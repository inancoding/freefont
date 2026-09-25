<template>
  <div class="h-full flex flex-col">
    <div class="flex items-center justify-between px-6 pt-5 pb-3">
      <h1 class="text-xl font-bold text-gray-900">许可管理</h1>
      <el-button type="primary" @click="showCreate = true">
        <el-icon class="mr-1"><Plus /></el-icon>新增许可
      </el-button>
    </div>

    <div class="flex-1 px-6 pb-4">
      <el-table :data="licenses" v-loading="loading" stripe class="bg-white rounded-lg border border-gray-200">
        <el-table-column label="名称" min-width="180">
          <template #default="{ row }">
            <span class="font-medium text-gray-900">{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" width="120">
          <template #default="{ row }">
            <el-tag :type="typeTagType(row.type)" size="small">{{ typeLabel(row.type) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="ID" width="160" />
        <el-table-column label="操作" width="80" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="onEdit(row)">编辑</el-button>
          </template>
        </el-table-column>
        <template #empty>
          <el-empty description="暂无许可" />
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

    <el-dialog v-model="showCreate" title="新增许可" width="560px" destroy-on-close>
      <LicenseForm @submit="onCreate" @cancel="showCreate = false" />
    </el-dialog>

    <el-dialog v-model="showEdit" title="编辑许可" width="560px" destroy-on-close>
      <LicenseForm v-if="editingLicense" :initial="editingLicense" @submit="onUpdate" @cancel="showEdit = false" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { adminApi } from '../utils/api.ts';
import LicenseForm from '../components/LicenseForm.vue';
import type { License } from '@shared/types/index.ts';

const licenses = ref<License[]>([]);
const loading = ref(true);
const total = ref(0);
const page = ref(1);
const pageSize = ref(20);
const showCreate = ref(false);
const showEdit = ref(false);
const editingLicense = ref<License | null>(null);

function typeTagType(type: string) {
  if (type === 'open-source') return 'success';
  if (type === 'vendor') return '';
  return 'info';
}

function typeLabel(type: string) {
  if (type === 'open-source') return '开源许可';
  if (type === 'vendor') return '厂商许可';
  return '自定义';
}

function onEdit(license: License) {
  editingLicense.value = license;
  showEdit.value = true;
}

async function load() {
  loading.value = true;
  try {
    const result = await adminApi.getLicenses(page.value, pageSize.value);
    licenses.value = result.data;
    total.value = result.total;
  } finally {
    loading.value = false;
  }
}

async function onCreate(data: License) {
  await adminApi.createLicense(data);
  showCreate.value = false;
  ElMessage.success('许可创建成功');
  await load();
}

async function onUpdate(data: License) {
  await adminApi.updateLicense(editingLicense.value!.id, data);
  showEdit.value = false;
  editingLicense.value = null;
  ElMessage.success('许可更新成功');
  await load();
}

onMounted(load);
</script>
