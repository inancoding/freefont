<template>
  <div class="h-full flex flex-col">
    <div class="flex items-center justify-between px-6 pt-5 pb-3">
      <div class="flex items-center gap-3">
        <h1 class="text-xl font-bold text-gray-900">字体管理</h1>
        <span class="text-sm text-gray-500">已收录 {{ total }} 款字体</span>
      </div>
      <el-button type="primary" @click="showCreate = true">
        <el-icon class="mr-1"><Plus /></el-icon>新增字体
      </el-button>
    </div>

    <div class="flex-1 px-6 pb-4">
      <el-table :data="fonts" v-loading="loading" stripe class="bg-white rounded-lg border border-gray-200">
        <el-table-column prop="nameZh" label="名称" min-width="160">
          <template #default="{ row }">
            <span class="font-medium text-gray-900">{{ row.nameZh || row.nameEn || row.slug }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="vendor" label="厂商" width="140" />
        <el-table-column prop="category" label="分类" width="100">
          <template #default="{ row }">{{ row.category || '-' }}</template>
        </el-table-column>
        <el-table-column prop="version" label="版本" width="100" />
        <el-table-column prop="downloadCount" label="下载" width="80" />
        <el-table-column label="操作" width="140" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="onEdit(row.slug)">编辑</el-button>
            <el-popconfirm title="确定要删除该字体吗？" @confirm="onDelete(row.slug)">
              <template #reference>
                <el-button link type="danger">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
        <template #empty>
          <el-empty description="暂无字体" />
        </template>
      </el-table>

      <div class="flex justify-end mt-4">
        <el-pagination
          v-model:current-page="page"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next"
          @size-change="load"
          @current-change="load"
        />
      </div>
    </div>

    <el-dialog v-model="showCreate" title="新增字体" width="1600px" destroy-on-close :body-style="{ paddingTop: '10px' }">
      <FontForm @submit="onCreate" @cancel="showCreate = false" />
    </el-dialog>

    <el-dialog v-model="showEdit" title="编辑字体" width="1600px" destroy-on-close :body-style="{ paddingTop: '10px' }">
      <FontForm v-if="editingFont" :initial="editingFont" @submit="onUpdate" @cancel="showEdit = false" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { adminApi } from '../utils/api.ts';
import FontForm from '../components/FontForm.vue';
import type { Font, FontFormData, FontListItem } from '@shared/types/index.ts';

const fonts = ref<FontListItem[]>([]);
const loading = ref(true);
const total = ref(0);
const page = ref(1);
const pageSize = ref(20);
const showCreate = ref(false);
const showEdit = ref(false);
const editingFont = ref<Font | null>(null);

async function load() {
  loading.value = true;
  try {
    const result = await adminApi.getFonts(page.value, pageSize.value);
    fonts.value = result.data;
    total.value = result.total;
  } finally {
    loading.value = false;
  }
}

async function onEdit(slug: string) {
  editingFont.value = await adminApi.getFont(slug);
  showEdit.value = true;
}

async function onCreate(data: FontFormData) {
  await adminApi.createFont(data);
  showCreate.value = false;
  ElMessage.success('字体创建成功');
  await load();
}

async function onUpdate(data: FontFormData) {
  await adminApi.updateFont(editingFont.value!.slug, data);
  showEdit.value = false;
  editingFont.value = null;
  ElMessage.success('字体更新成功');
  await load();
}

async function onDelete(slug: string) {
  await adminApi.deleteFont(slug);
  await load();
}

onMounted(load);
</script>
