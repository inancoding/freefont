<template>
  <div class="max-w-7xl mx-auto mt-8">
    <div v-if="loading" v-loading="true" class="min-h-[300px]" />

    <el-empty v-else-if="!font" description="字体不存在" />

    <template v-else>
      <div class="flex flex-col md:flex-row gap-8 mb-8">
        <div class="md:w-80 shrink-0">
          <div class="aspect-[16/9] bg-gray-100 rounded-lg overflow-hidden mb-4">
            <img
              v-if="font.coverPath"
              :src="font.coverPath"
              :alt="font.nameZh || font.nameEn || font.slug"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center text-gray-300 text-6xl font-bold">
              {{ (font.nameZh || font.nameEn || '?')[0] }}
            </div>
          </div>

          <div v-if="downloadUrls" class="download-buttons space-y-2">
            <el-button
              v-for="(url, key) in downloadUrls"
              :key="key"
              type="primary"
              class="w-full"
              @click="url && onDownloadClick(url)"
            >
              <el-icon class="mr-1"><Download /></el-icon>{{ downloadLabel(key as string) }}
            </el-button>
            <p class="text-xs text-gray-400 mt-2">如果以上链接下载失败时请使用百度网盘下载</p>
          </div>
        </div>

        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between gap-4">
            <h1 class="text-2xl font-bold text-gray-900">
              {{ font.nameZh || font.nameEn || font.slug }}
            </h1>
            <el-link
              v-if="font.officialUrl"
              :href="font.officialUrl"
              type="primary"
              target="_blank"
              class="shrink-0"
            >
              来源页面 →
            </el-link>
          </div>
          <p v-if="font.nameZh && font.nameEn" class="text-gray-500 mt-1">{{ font.nameEn }}</p>

          <div v-if="font.tags.length" class="mt-2 flex flex-wrap gap-2">
            <el-tag v-for="tag in font.tags" :key="tag" type="info" size="small">{{ tag }}</el-tag>
          </div>

          <p v-if="font.description" class="mt-4 text-gray-600 leading-relaxed">{{ font.description }}</p>

          <el-descriptions :column="2" border class="mt-6">
            <el-descriptions-item label="厂商">{{ font.vendor }}</el-descriptions-item>
            <el-descriptions-item label="版本">{{ font.version }}</el-descriptions-item>
            <el-descriptions-item label="分类">{{ font.category || '-' }}</el-descriptions-item>
            <el-descriptions-item label="语言">{{ font.languages.join(', ') || '-' }}</el-descriptions-item>
            <el-descriptions-item label="授权">{{ font.licenseId || '-' }}</el-descriptions-item>
            <el-descriptions-item label="格式">{{ font.formats.join(', ') || '-' }}</el-descriptions-item>
            <el-descriptions-item label="字数">{{ font.glyphCount || '-' }}</el-descriptions-item>
            <el-descriptions-item label="字重">{{ font.weights.join(', ') || '-' }}</el-descriptions-item>
            <el-descriptions-item label="文件大小">{{ font.fileSize ? formatSize(font.fileSize) : '-' }}</el-descriptions-item>
            <el-descriptions-item label="下载次数">{{ font.downloadCount }}</el-descriptions-item>
          </el-descriptions>
        </div>
      </div>

      <div v-if="font.previewPath" class="mb-8">
        <img :src="font.previewPath" alt="预览" class="w-full rounded-lg border border-gray-200" />
      </div>

      <div v-if="font.content" class="mb-8 flex gap-6 items-start">
        <div class="w-[800px] shrink-0 bg-white shadow-md rounded-xl p-4">
          <MdPreview :model-value="font.content" class="md-preview-full" />
        </div>
        <div v-if="recommendFonts.length" class="flex-1 min-w-0 bg-white shadow-md rounded-xl p-4">
          <h3 class="text-lg font-bold text-gray-900 mb-3">推荐字体</h3>
          <div class="grid grid-cols-2 gap-3">
            <div
              v-for="rf in recommendFonts"
              :key="rf.slug"
              class="cursor-pointer hover:bg-white rounded-lg transition"
              @click="goFont(rf.slug)"
            >
              <div class="aspect-[3/2] bg-gray-100 rounded overflow-hidden mb-2">
                <img v-if="rf.coverPath" :src="rf.coverPath" class="w-full h-full object-cover" />
                <div v-else class="w-full h-full flex items-center justify-center text-gray-300 text-2xl font-bold">
                  {{ (rf.nameZh || rf.nameEn || '?')[0] }}
                </div>
              </div>
              <p class="text-xs font-medium text-gray-900 truncate">{{ rf.nameZh || rf.nameEn || rf.slug }}</p>
              <p class="text-xs text-gray-500 truncate">{{ rf.vendor }}</p>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { api } from '../utils/api.ts';
import { MdPreview } from 'md-editor-v3';
import 'md-editor-v3/lib/preview.css';
import type { Font, FontListItem, DownloadUrls } from '@shared/types/index.ts';

const route = useRoute();
const router = useRouter();
const font = ref<Font | null>(null);
const loading = ref(true);
const downloadUrls = ref<DownloadUrls | null>(null);
const recommendFonts = ref<FontListItem[]>([]);

function downloadLabel(key: string): string {
  const map: Record<string, string> = { githubRaw: '下载链接1', jsdelivr: '下载链接2', githack: '下载链接3', cloudDrive: '百度网盘下载' };
  return map[key] || key;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

async function onDownloadClick(url: string) {
  if (font.value) {
    try {
      await api.recordDownload(font.value.slug);
    } catch {
      // ignore
    }
  }
  window.open(url, '_blank');
}

function goFont(slug: string) {
  router.push(`/fonts/${slug}`);
}

onMounted(async () => {
  const slug = route.params.slug as string;
  try {
    font.value = await api.getFont(slug);
    downloadUrls.value = await api.getDownloadUrls(slug);
    recommendFonts.value = await api.getRecommendFonts(slug);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.md-preview-full :deep(img) {
  width: 100% !important;
  height: auto !important;
  max-width: 100% !important;
}
.md-preview-full :deep(.md-editor-preview-wrapper) {
  padding: 0;
}
.download-buttons .el-button + .el-button {
  margin-left: 0;
}
</style>
