<template>
  <div class="max-w-5xl mx-auto">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-xl font-bold text-gray-900">字体管理</h1>
      <el-button type="primary" @click="$router.push('/fonts/create')">
        <el-icon class="mr-1"><Plus /></el-icon>新增字体
      </el-button>
    </div>

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
          <el-button link type="primary" @click="$router.push(`/fonts/${row.slug}/edit`)">编辑</el-button>
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { adminApi } from '../utils/api.ts';
import type { FontListItem } from '@shared/types/index.ts';

const fonts = ref<FontListItem[]>([]);
const loading = ref(true);

async function load() {
  loading.value = true;
  try {
    const result = await adminApi.getFonts();
    fonts.value = result.data;
  } finally {
    loading.value = false;
  }
}

async function onDelete(slug: string) {
  await adminApi.deleteFont(slug);
  await load();
}

onMounted(load);
</script>
