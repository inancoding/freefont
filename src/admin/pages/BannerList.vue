<template>
  <div class="h-full flex flex-col">
    <div class="flex items-center justify-between px-6 pt-5 pb-3">
      <h2 class="text-xl font-bold text-gray-900">轮播图管理</h2>
      <el-button type="primary" @click="showCreateDialog = true">
        <el-icon><Plus /></el-icon>
        新增轮播图
      </el-button>
    </div>

    <div class="flex-1 px-6 pb-4">
      <el-table :data="banners" v-loading="loading" stripe class="bg-white rounded-lg border border-gray-200">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="预览图" width="180">
          <template #default="{ row }">
            <el-image
              v-if="row.imagePath"
              :src="row.imagePath"
              fit="cover"
              class="w-[160px] h-[80px] rounded"
              :preview-src-list="[row.imagePath]"
              preview-teleported
              :z-index="9999"
            />
            <span v-else class="text-gray-400 text-sm">未上传</span>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" min-width="150" />
        <el-table-column prop="description" label="描述" min-width="200" show-overflow-tooltip />
        <el-table-column prop="linkUrl" label="跳转链接" min-width="200" show-overflow-tooltip>
          <template #default="{ row }">
            <a v-if="row.linkUrl" :href="row.linkUrl" target="_blank" class="text-blue-600 hover:underline">
              {{ row.linkUrl }}
            </a>
            <span v-else class="text-gray-400">无</span>
          </template>
        </el-table-column>
        <el-table-column prop="sortOrder" label="排序" width="100" />
        <el-table-column prop="isActive" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.isActive ? 'success' : 'info'">
              {{ row.isActive ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="editBanner(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="deleteBanner(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="flex justify-end mt-4">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next"
          @size-change="fetchBanners"
          @current-change="fetchBanners"
        />
      </div>
    </div>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="showCreateDialog"
      :title="editingBanner ? '编辑轮播图' : '新增轮播图'"
      width="600px"
      @close="resetForm"
    >
      <el-form :model="form" label-width="100px">
        <el-form-item label="预览图">
          <el-upload
            class="banner-uploader"
            :auto-upload="false"
            :on-change="handleImageChange"
            accept="image/*"
            :show-file-list="false"
            :disabled="uploading"
          >
            <img v-if="form.imagePath" :src="form.imagePath" class="banner-preview" />
            <div v-else-if="uploading" v-loading="true" class="w-full h-full" />
            <el-icon v-else class="banner-uploader-icon"><Plus /></el-icon>
          </el-upload>
          <p class="text-xs text-gray-500 mt-2">建议尺寸：1200x300px，支持 JPG/PNG 格式</p>
        </el-form-item>

        <el-form-item label="标题">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>

        <el-form-item label="描述">
          <el-input v-model="form.description" type="textarea" :rows="3" placeholder="请输入描述文字" />
        </el-form-item>

        <el-form-item label="跳转链接">
          <el-input v-model="form.linkUrl" placeholder="https://example.com" />
        </el-form-item>

        <el-form-item label="排序">
          <el-input-number v-model="form.sortOrder" :min="0" :max="999" />
        </el-form-item>

        <el-form-item label="状态">
          <el-switch v-model="form.isActive" active-text="启用" inactive-text="禁用" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="showCreateDialog = false">取消</el-button>
        <el-button type="primary" @click="saveBanner" :loading="saving">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Plus } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { adminApi } from '../utils/api.ts';
import type { Banner, BannerFormData } from '@shared/types/index.ts';

const banners = ref<Banner[]>([]);
const loading = ref(false);
const saving = ref(false);
const uploading = ref(false);
const showCreateDialog = ref(false);
const editingBanner = ref<Banner | null>(null);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(20);

const form = ref<BannerFormData>({
  title: '',
  description: '',
  imagePath: '',
  linkUrl: '',
  sortOrder: 0,
  isActive: true,
});

onMounted(() => {
  fetchBanners();
});

async function fetchBanners() {
  loading.value = true;
  try {
    const result = await adminApi.getBanners(currentPage.value, pageSize.value);
    banners.value = result.data;
    total.value = result.total;
  } catch (err: any) {
    ElMessage.error(err.message || '加载失败');
  } finally {
    loading.value = false;
  }
}

async function handleImageChange(file: any) {
  uploading.value = true;
  try {
    const res = await adminApi.uploadImage(file.raw, 'banners');
    form.value.imagePath = res.url;
    ElMessage.success('图片上传成功');
  } catch (err: any) {
    ElMessage.error(err.message || '图片上传失败');
  } finally {
    uploading.value = false;
  }
}

function editBanner(banner: Banner) {
  editingBanner.value = banner;
  form.value = {
    title: banner.title,
    description: banner.description || '',
    imagePath: banner.imagePath,
    linkUrl: banner.linkUrl || '',
    sortOrder: banner.sortOrder,
    isActive: banner.isActive,
  };
  showCreateDialog.value = true;
}

function resetForm() {
  editingBanner.value = null;
  form.value = {
    title: '',
    description: '',
    imagePath: '',
    linkUrl: '',
    sortOrder: 0,
    isActive: true,
  };
}

async function saveBanner() {
  if (!form.value.title) {
    ElMessage.warning('请输入标题');
    return;
  }
  if (!form.value.imagePath) {
    ElMessage.warning('请上传预览图');
    return;
  }

  saving.value = true;
  try {
    if (editingBanner.value) {
      await adminApi.updateBanner(editingBanner.value.id, form.value);
      ElMessage.success('更新成功');
    } else {
      await adminApi.createBanner(form.value);
      ElMessage.success('创建成功');
    }
    showCreateDialog.value = false;
    await fetchBanners();
  } catch (err: any) {
    ElMessage.error(err.message || '保存失败');
  } finally {
    saving.value = false;
  }
}

async function deleteBanner(id: number) {
  try {
    await ElMessageBox.confirm('确定要删除这个轮播图吗？', '提示', { type: 'warning' });
    await adminApi.deleteBanner(id);
    ElMessage.success('删除成功');
    await fetchBanners();
  } catch {
    // 用户取消
  }
}
</script>

<style scoped>
.banner-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s;
  width: 300px;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.banner-uploader:hover {
  border-color: #409eff;
}

.banner-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.banner-uploader-icon {
  font-size: 28px;
  color: #8c939d;
}
</style>
