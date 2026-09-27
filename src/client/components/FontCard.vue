<template>
  <router-link :to="`/fonts/${font.slug}`" class="block no-underline">
    <el-card :body-style="{ padding: '0' }" class="hover:shadow-md hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden">
      <div class="aspect-[16/9] bg-gray-100 overflow-hidden">
        <img
          v-if="font.coverPath"
          :src="font.coverPath"
          :alt="font.nameZh || font.nameEn || font.slug"
          class="w-full h-full object-cover"
          loading="lazy"
        />
        <div v-else class="w-full h-full flex items-center justify-center text-gray-400 text-4xl font-bold">
          {{ (font.nameZh || font.nameEn || '?')[0] }}
        </div>
      </div>
      <div class="p-3">
        <h3 class="font-medium text-gray-900 truncate text-sm">{{ font.nameZh || font.nameEn || font.slug }}</h3>
        <div class="flex items-center justify-between mt-1">
          <el-tag v-if="font.category" size="small" type="info">{{ font.category }}</el-tag>
          <span class="text-xs text-gray-400">{{ font.downloadCount }} 次下载</span>
        </div>
      </div>
    </el-card>
  </router-link>
</template>

<script setup lang="ts">
import type { FontListItem } from '@shared/types/index.ts';

defineProps<{ font: FontListItem }>();
</script>
