<template>
  <div class="max-w-5xl mx-auto mt-8">
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

          <el-button type="primary" size="large" class="w-full" @click="onDownload">
            <el-icon class="mr-1"><Download /></el-icon>下载字体
          </el-button>

          <div v-if="downloadUrls" class="mt-3 space-y-2">
            <el-link
              v-for="(url, key) in downloadUrls"
              :key="key"
              :href="url"
              type="primary"
              :underline="false"
              target="_blank"
              class="block text-xs truncate"
            >
              {{ downloadLabel(key) }}
            </el-link>
          </div>
        </div>

        <div class="flex-1 min-w-0">
          <h1 class="text-2xl font-bold text-gray-900">
            {{ font.nameZh || font.nameEn || font.slug }}
          </h1>
          <p v-if="font.nameZh && font.nameEn" class="text-gray-500 mt-1">{{ font.nameEn }}</p>

          <p v-if="font.description" class="mt-4 text-gray-600 leading-relaxed">{{ font.description }}</p>

          <el-descriptions :column="2" border class="mt-6">
            <el-descriptions-item label="厂商">{{ font.vendor }}</el-descriptions-item>
            <el-descriptions-item label="版本">{{ font.version }}</el-descriptions-item>
            <el-descriptions-item label="分类">{{ font.category || '-' }}</el-descriptions-item>
            <el-descriptions-item label="许可">{{ font.licenseId }}</el-descriptions-item>
            <el-descriptions-item label="语言">{{ font.languages.join(', ') || '-' }}</el-descriptions-item>
            <el-descriptions-item label="格式">{{ font.formats.join(', ') || '-' }}</el-descriptions-item>
            <el-descriptions-item label="字重">{{ font.weights.join(', ') || '-' }}</el-descriptions-item>
            <el-descriptions-item label="字数">{{ font.glyphCount ?? '-' }}</el-descriptions-item>
            <el-descriptions-item label="文件大小">{{ font.fileSize ? formatSize(font.fileSize) : '-' }}</el-descriptions-item>
            <el-descriptions-item label="下载次数">{{ font.downloadCount }}</el-descriptions-item>
          </el-descriptions>

          <div v-if="font.tags.length" class="mt-4 flex flex-wrap gap-2">
            <el-tag v-for="tag in font.tags" :key="tag" type="info" size="small">{{ tag }}</el-tag>
          </div>

          <el-link
            v-if="font.officialUrl"
            :href="font.officialUrl"
            type="primary"
            target="_blank"
            class="mt-4"
          >
            官方网站 →
          </el-link>
        </div>
      </div>

      <div v-if="font.previewPath" class="mb-8">
        <img :src="font.previewPath" alt="预览" class="w-full rounded-lg border border-gray-200" />
      </div>

      <el-card v-if="font.content" class="prose max-w-none">
        <div v-html="renderedContent" />
      </el-card>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { api } from '../utils/api.ts';
import type { Font, DownloadUrls } from '@shared/types/index.ts';

const route = useRoute();
const font = ref<Font | null>(null);
const loading = ref(true);
const downloadUrls = ref<DownloadUrls | null>(null);

const renderedContent = computed(() => {
  if (!font.value?.content) return '';
  return simpleMarkdown(font.value.content);
});

function simpleMarkdown(md: string): string {
  return md
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(.+)$/gm, (m) => (m.startsWith('<') ? m : `<p>${m}</p>`));
}

function downloadLabel(key: string): string {
  const map: Record<string, string> = { githubRaw: 'GitHub 直链', jsdelivr: 'jsDelivr CDN', githack: 'GitHack CDN', cloudDrive: '百度网盘' };
  return map[key] || key;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

async function onDownload() {
  if (!font.value) return;
  try {
    downloadUrls.value = await api.recordDownload(font.value.slug);
  } catch {
    // ignore
  }
}

onMounted(async () => {
  const slug = route.params.slug as string;
  try {
    font.value = await api.getFont(slug);
  } finally {
    loading.value = false;
  }
});
</script>
