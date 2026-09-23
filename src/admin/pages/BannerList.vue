<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-semibold text-gray-900">轮播图管理</h2>
      <el-button type="primary" @click="showCreateDialog = true">
        <el-icon><Plus /></el-icon>
        新增轮播图
      </el-button>
    </div>

    <el-table :data="banners" v-loading="loading" stripe>
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column label="预览图" width="180">
        <template #default="{ row }">
          <el-image
            v-if="row.imagePath"
            :src="row.imagePath"
            fit="cover"
            class="w-[160px] h-[80px] rounded"
            :preview-src-list="[row.imagePath]"
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
          >
            <img v-if="form.imagePath" :src="form.imagePath" class="banner-preview" />
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

interface Banner {
  id?: number;
  title: string;
  description: string;
  imagePath: string;
  linkUrl: string;
  sortOrder: number;
  isActive: boolean;
}

const banners = ref<Banner[]>([]);
const loading = ref(false);
const saving = ref(false);
const showCreateDialog = ref(false);
const editingBanner = ref<Banner | null>(null);

const form = ref<Banner>({
  title: '',
  description: '',
  imagePath: '',
  linkUrl: '',
  sortOrder: 0,
  isActive: true,
});

// 模拟数据
onMounted(() => {
  banners.value = [
    {
      id: 1,
      title: '精选字体推荐',
      description: '本周最受欢迎的免费字体合集',
      imagePath: '',
      linkUrl: 'https://example.com/featured',
      sortOrder: 1,
      isActive: true,
    },
    {
      id: 2,
      title: '商用字体指南',
      description: '了解如何合法使用免费字体进行商业项目',
      imagePath: '',
      linkUrl: 'https://example.com/commercial',
      sortOrder: 2,
      isActive: true,
    },
  ];
});

function handleImageChange(file: any) {
  const reader = new FileReader();
  reader.onload = (e) => {
    form.value.imagePath = e.target?.result as string;
  };
  reader.readAsDataURL(file.raw);
}

function editBanner(banner: Banner) {
  editingBanner.value = banner;
  form.value = { ...banner };
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

  saving.value = true;
  
  // 模拟保存
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  if (editingBanner.value) {
    const index = banners.value.findIndex((b) => b.id === editingBanner.value?.id);
    if (index !== -1) {
      banners.value[index] = { ...form.value, id: editingBanner.value.id };
    }
    ElMessage.success('更新成功');
  } else {
    const newId = Math.max(...banners.value.map((b) => b.id || 0), 0) + 1;
    banners.value.push({ ...form.value, id: newId });
    ElMessage.success('创建成功');
  }
  
  saving.value = false;
  showCreateDialog.value = false;
}

async function deleteBanner(id: number) {
  try {
    await ElMessageBox.confirm('确定要删除这个轮播图吗？', '提示', {
      type: 'warning',
    });
    
    const index = banners.value.findIndex((b) => b.id === id);
    if (index !== -1) {
      banners.value.splice(index, 1);
      ElMessage.success('删除成功');
    }
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
