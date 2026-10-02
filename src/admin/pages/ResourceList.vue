<template>
  <div class="h-full flex flex-col">
    <div class="flex items-center justify-between px-6 pt-5 pb-3">
      <h2 class="text-xl font-bold text-gray-900">资源管理</h2>
      <div class="flex items-center gap-3">
        <el-select v-model="folderFilter" placeholder="全部目录" clearable class="w-36" @change="applyFilter">
          <el-option label="covers" value="covers" />
          <el-option label="content" value="content" />
          <el-option label="banners" value="banners" />
        </el-select>
        <el-button @click="scanUnused" :loading="scanning">扫描未使用</el-button>
        <el-button v-if="unused.length > 0" type="danger" @click="cleanUnused" :loading="cleaning">
          清理未使用 ({{ unused.length }})
        </el-button>
      </div>
    </div>

    <div v-if="unused.length > 0" class="mx-6 mb-3">
      <el-alert
        type="warning"
        :closable="false"
        show-icon
      >
        <template #title>
          发现 {{ unused.length }} 个未使用的图片文件，共 {{ formatSize(unusedTotalSize) }}
        </template>
        <template #default>
          <div class="flex flex-wrap gap-2 mt-2">
            <el-tag
              v-for="img in unused"
              :key="img.path"
              size="small"
              type="warning"
              closable
              @close="deleteSingle(img)"
            >
              {{ img.filename }}
            </el-tag>
          </div>
        </template>
      </el-alert>
    </div>

    <div class="flex-1 px-6 pb-4">
      <el-table :data="pagedImages" v-loading="loading" stripe class="bg-white rounded-lg border border-gray-200">
        <el-table-column label="预览" width="120">
          <template #default="{ row }">
            <el-image
              :src="row.url"
              fit="cover"
              class="w-[100px] h-[60px] rounded"
              :preview-src-list="[row.url]"
              preview-teleported
              :z-index="9999"
            />
          </template>
        </el-table-column>
        <el-table-column prop="filename" label="文件名" min-width="200" show-overflow-tooltip />
        <el-table-column prop="folder" label="目录" width="100">
          <template #default="{ row }">
            <el-tag size="small" :type="row.folder === 'covers' ? 'primary' : row.folder === 'content' ? 'success' : 'warning'">
              {{ row.folder }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="大小" width="100">
          <template #default="{ row }">
            {{ formatSize(row.size) }}
          </template>
        </el-table-column>
        <el-table-column label="修改时间" width="170">
          <template #default="{ row }">
            {{ formatDate(row.modifiedAt) }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="80">
          <template #default="{ row }">
            <el-tag v-if="isUnused(row)" size="small" type="danger">未使用</el-tag>
            <el-tag v-else size="small" type="success">使用中</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button size="small" type="danger" text @click="deleteSingle(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="flex justify-end mt-4">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="filteredImages.length"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { adminApi } from '../utils/api.ts';

interface ImageFile {
  path: string;
  url: string;
  folder: string;
  filename: string;
  size: number;
  modifiedAt: string;
}

const images = ref<ImageFile[]>([]);
const unused = ref<ImageFile[]>([]);
const loading = ref(false);
const scanning = ref(false);
const cleaning = ref(false);
const folderFilter = ref('');
const currentPage = ref(1);
const pageSize = ref(20);

const filteredImages = computed(() => {
  if (!folderFilter.value) return images.value;
  return images.value.filter((img) => img.folder === folderFilter.value);
});

const pagedImages = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredImages.value.slice(start, start + pageSize.value);
});

const totalSize = computed(() => images.value.reduce((sum, img) => sum + img.size, 0));
const unusedTotalSize = computed(() => unused.value.reduce((sum, img) => sum + img.size, 0));

const unusedPaths = computed(() => new Set(unused.value.map((img) => img.path)));

function isUnused(img: ImageFile): boolean {
  return unusedPaths.value.has(img.path);
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
}

function applyFilter() {
  currentPage.value = 1;
}

async function fetchResources() {
  loading.value = true;
  try {
    images.value = await adminApi.getResources();
  } catch (err: any) {
    ElMessage.error(err.message || '加载资源列表失败');
  } finally {
    loading.value = false;
  }
}

async function scanUnused() {
  scanning.value = true;
  try {
    unused.value = await adminApi.getUnusedResources();
    if (unused.value.length === 0) {
      ElMessage.success('没有发现未使用的图片');
    }
  } catch (err: any) {
    ElMessage.error(err.message || '扫描失败');
  } finally {
    scanning.value = false;
  }
}

async function cleanUnused() {
  try {
    await ElMessageBox.confirm(
      `确定要删除 ${unused.value.length} 个未使用的图片文件吗？此操作不可恢复。`,
      '确认清理',
      { type: 'warning', confirmButtonText: '确认删除', cancelButtonText: '取消' },
    );
    cleaning.value = true;
    const result = await adminApi.deleteUnusedResources();
    ElMessage.success(`已删除 ${result.deleted} 个文件`);
    unused.value = [];
    await fetchResources();
  } catch {
    // cancelled
  } finally {
    cleaning.value = false;
  }
}

async function deleteSingle(img: ImageFile) {
  try {
    await ElMessageBox.confirm(`确定要删除 ${img.filename} 吗？`, '确认删除', {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消',
    });
    await adminApi.deleteResource(img.folder, img.filename);
    ElMessage.success('已删除');
    images.value = images.value.filter((i) => i.path !== img.path);
    unused.value = unused.value.filter((i) => i.path !== img.path);
  } catch {
    // cancelled
  }
}

onMounted(() => {
  fetchResources();
});
</script>
