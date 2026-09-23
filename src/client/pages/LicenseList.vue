<template>
  <div class="max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold text-gray-900 mb-6">开源许可</h1>

    <div v-if="store.loading" v-loading="true" class="min-h-[200px]" />

    <div v-else class="space-y-4">
      <el-card v-for="license in store.licenses" :key="license.id">
        <div class="flex items-start justify-between">
          <div>
            <h2 class="text-lg font-semibold text-gray-900">{{ license.nameZh || license.nameEn || license.name }}</h2>
            <p v-if="license.nameZh && license.nameEn" class="text-sm text-gray-500 mt-0.5">{{ license.nameEn }}</p>
          </div>
          <el-tag :type="typeTagType(license.type)" size="small">{{ typeLabel(license.type) }}</el-tag>
        </div>

        <p v-if="license.summary" class="mt-3 text-sm text-gray-600">{{ license.summary }}</p>

        <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div v-if="license.permissions.length">
            <h3 class="font-medium text-green-700 mb-1">允许</h3>
            <ul class="space-y-0.5 text-gray-600">
              <li v-for="p in license.permissions" :key="p" class="flex items-start gap-1">
                <el-icon class="text-green-500 mt-0.5"><Check /></el-icon> {{ p }}
              </li>
            </ul>
          </div>
          <div v-if="license.limitations.length">
            <h3 class="font-medium text-red-700 mb-1">限制</h3>
            <ul class="space-y-0.5 text-gray-600">
              <li v-for="l in license.limitations" :key="l" class="flex items-start gap-1">
                <el-icon class="text-red-500 mt-0.5"><Close /></el-icon> {{ l }}
              </li>
            </ul>
          </div>
        </div>

        <el-link
          v-if="license.url"
          :href="license.url"
          type="primary"
          target="_blank"
          class="mt-3"
        >
          查看原文 →
        </el-link>
      </el-card>

      <el-empty v-if="store.licenses.length === 0" description="暂无许可" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useLicenseStore } from '../stores/licenseStore.ts';

const store = useLicenseStore();

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

onMounted(() => store.fetchLicenses());
</script>
