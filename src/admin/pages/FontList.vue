<template>
  <div class="h-full flex flex-col">
    <div class="flex items-center justify-between px-6 pt-5 pb-3">
      <div class="flex items-center gap-3">
        <h1 class="text-xl font-bold text-gray-900">字体管理</h1>
        <span class="text-sm text-gray-500">共 {{ total }} 款字体</span>
      </div>
      <div class="flex items-center gap-2">
        <el-button @click="downloadTemplate">
          <el-icon class="mr-1"><Download /></el-icon>导入模板
        </el-button>
        <el-button type="success" @click="showImport = true">
          <el-icon class="mr-1"><Upload /></el-icon>批量导入
        </el-button>
        <el-button type="primary" @click="showCreate = true">
          <el-icon class="mr-1"><Plus /></el-icon>新增字体
        </el-button>
      </div>
    </div>

    <div class="px-6 pb-2">
      <el-radio-group v-model="statusFilter" @change="onStatusChange">
        <el-radio-button value="">全部</el-radio-button>
        <el-radio-button value="published">已发布</el-radio-button>
        <el-radio-button value="draft">待添加</el-radio-button>
      </el-radio-group>
    </div>

    <div class="flex-1 px-6 pb-4">
      <el-table :data="fonts" v-loading="loading" stripe class="bg-white rounded-lg border border-gray-200">
        <el-table-column prop="nameZh" label="名称" min-width="160">
          <template #default="{ row }">
            <span class="font-medium text-gray-900">{{ row.nameZh || row.nameEn || row.slug }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="90" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.status === 'published'" type="success" size="small">已发布</el-tag>
            <el-tag v-else type="warning" size="small">待添加</el-tag>
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
      <FontForm v-if="editingFont" :initial="editingFont" @submit="onUpdate" @publish="onPublish" @cancel="showEdit = false" />
    </el-dialog>

    <el-dialog v-model="showImport" title="批量导入字体" width="600px" destroy-on-close>
      <div class="space-y-4">
        <div class="text-sm text-gray-600">
          <p>请上传 Excel 文件（.xlsx），支持以下字段：</p>
          <p class="mt-1"><strong>必填：</strong>Slug、版本、厂商、许可</p>
          <p><strong>选填：</strong>中文名、英文名、分类、官方网站、简介、语言、格式、字重、标签、字数</p>
          <p class="mt-1 text-gray-500">导入后字体状态为「待添加」，需编辑补充封面图、ZIP 文件等内容后发布。</p>
        </div>
        <el-upload
          ref="importUploadRef"
          :auto-upload="false"
          :show-file-list="false"
          accept=".xlsx,.xls"
          :limit="1"
          :on-change="onImportFileChange"
        >
          <el-button type="primary">选择 Excel 文件</el-button>
        </el-upload>
        <div v-if="importResult" class="mt-3 p-3 bg-gray-50 rounded-lg text-sm space-y-1">
          <p>总计行数：{{ importResult.total }}</p>
          <p class="text-green-600">成功导入：{{ importResult.created.length }} 条</p>
          <p v-if="importResult.skipped.length > 0" class="text-yellow-600">跳过（已存在）：{{ importResult.skipped.length }} 条</p>
          <p v-if="importResult.errors.length > 0" class="text-red-500">数据库错误：{{ importResult.errors.length }} 条</p>
          <p v-if="importResult.rowErrors.length > 0" class="text-red-500">格式错误：{{ importResult.rowErrors.length }} 条</p>
          <div v-if="importResult.rowErrors.length > 0" class="mt-2 max-h-40 overflow-auto">
            <div v-for="e in importResult.rowErrors" :key="e.row" class="text-xs text-red-500">
              第 {{ e.row }} 行：{{ e.errors.join('；') }}
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="showImport = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import type { UploadFile, UploadInstance } from 'element-plus';
import { Download, Upload, Plus } from '@element-plus/icons-vue';
import { adminApi } from '../utils/api.ts';
import FontForm from '../components/FontForm.vue';
import type { Font, FontFormData, FontListItem } from '@shared/types/index.ts';

interface ImportResult {
  created: string[];
  skipped: string[];
  errors: { slug: string; error: string }[];
  rowErrors: { row: number; errors: string[] }[];
  total: number;
}

const fonts = ref<FontListItem[]>([]);
const loading = ref(true);
const total = ref(0);
const page = ref(1);
const pageSize = ref(20);
const statusFilter = ref('');
const showCreate = ref(false);
const showEdit = ref(false);
const showImport = ref(false);
const editingFont = ref<Font | null>(null);
const importUploadRef = ref<UploadInstance | null>(null);
const importResult = ref<ImportResult | null>(null);

async function load() {
  loading.value = true;
  try {
    const result = await adminApi.getFonts(page.value, pageSize.value, statusFilter.value || undefined);
    fonts.value = result.data;
    total.value = result.total;
  } finally {
    loading.value = false;
  }
}

function onStatusChange() {
  page.value = 1;
  load();
}

async function downloadTemplate() {
  try {
    const token = localStorage.getItem('admin_token');
    const res = await fetch('/api/admin/fonts/import/template', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('下载失败');
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'font-import-template.xlsx';
    a.click();
    URL.revokeObjectURL(url);
  } catch {
    ElMessage.error('模板下载失败');
  }
}

async function onImportFileChange(file: UploadFile) {
  if (!file.raw) return;
  try {
    const result = await adminApi.importFonts(file.raw);
    importResult.value = result;
    ElMessage.success(`成功导入 ${result.created.length} 款字体`);
    importUploadRef.value?.clearFiles();
    await load();
  } catch (err) {
    ElMessage.error('导入失败：' + (err instanceof Error ? err.message : '未知错误'));
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

async function onPublish(data: FontFormData) {
  await adminApi.updateFont(editingFont.value!.slug, { ...data, status: 'published' });
  showEdit.value = false;
  editingFont.value = null;
  ElMessage.success('字体已发布');
  await load();
}

async function onDelete(slug: string) {
  await adminApi.deleteFont(slug);
  await load();
}

onMounted(load);
</script>
