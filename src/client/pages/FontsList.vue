<template>
  <div class="max-w-7xl mx-auto py-8">
    <AdBanner />
    <!-- 筛选条件 -->
    <div class="mb-6 space-y-3">
      <div class="flex flex-wrap items-center gap-x-3 gap-y-2">
        <span class="text-sm font-bold text-gray-500 shrink-0">分类</span>
        <div class="flex flex-wrap items-center gap-6">
          <a
            :class="['text-sm cursor-pointer transition-colors', categoryValue === '' ? 'text-gray-600 hover:text-blue-600' : 'text-blue-600 font-medium']"
            @click="setCategory('')"
          >全部</a>
          <a
            v-for="cat in CATEGORIES"
            :key="cat"
            :class="['text-sm cursor-pointer transition-colors', categoryValue === cat ? 'text-gray-600 hover:text-blue-600' : 'text-blue-600 font-medium']"
            @click="setCategory(cat)"
          >{{ cat }}</a>
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-x-3 gap-y-2">
        <span class="text-sm font-bold text-gray-500 shrink-0">语言</span>
        <div class="flex flex-wrap items-center gap-6">
          <a
            :class="['text-sm cursor-pointer transition-colors', languageValue === '' ? 'text-gray-600 hover:text-blue-600' : 'text-blue-600 font-medium']"
            @click="setLanguage('')"
          >全部</a>
          <a
            v-for="lang in LANGUAGES"
            :key="lang"
            :class="['text-sm cursor-pointer transition-colors', languageValue === lang ? 'text-gray-600 hover:text-blue-600' : 'text-blue-600 font-medium']"
            @click="setLanguage(lang)"
          >{{ lang }}</a>
        </div>

        <div class="ml-auto flex items-center gap-2">
          <span class="text-sm font-medium text-gray-500 shrink-0">排序</span>
          <el-select :model-value="sortValue" @update:model-value="onSortChange" class="!w-36">
            <el-option value="added_at-desc" label="最新添加" />
            <el-option value="added_at-asc" label="最早添加" />
            <el-option value="download_count-desc" label="下载最多" />
            <el-option value="name-asc" label="名称 A-Z" />
            <el-option value="name-desc" label="名称 Z-A" />
          </el-select>
        </div>
      </div>
    </div>

    <!-- 瀑布流字体列表 -->
    <div v-if="store.loading && allFonts.length === 0" v-loading="true" class="min-h-[200px]" />

    <el-empty v-else-if="allFonts.length === 0" description="暂无字体" />

    <template v-else>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <FontCard
          v-for="(font, index) in allFonts"
          :key="font.id"
          :font="font"
          :class="newFontIds.has(font.id) ? 'font-card-enter' : (isInitialLoad ? 'font-card-initial' : '')"
          :style="(isInitialLoad && !newFontIds.size) ? { animationDelay: `${Math.min(index * 20, 400)}ms` } : {}"
        />
      </div>

      <!-- 加载更多指示器 -->
      <div v-if="loadingMore" class="mt-8 flex flex-col items-center justify-center py-8 gap-3">
        <div class="loading-dots">
          <span></span><span></span><span></span>
        </div>
        <span class="text-sm text-gray-400">正在加载更多字体…</span>
      </div>

      <!-- 加载完成提示 -->
      <div v-else-if="!hasMore && allFonts.length > 0" class="mt-8 text-center text-sm text-gray-400 py-4">
        已加载全部 {{ allFonts.length }} 个字体
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed, nextTick, watch } from 'vue';
import { useFontStore } from '../stores/fontStore.ts';
import FontCard from '../components/FontCard.vue';
import AdBanner from '../components/AdBanner.vue';
import { CATEGORIES, LANGUAGES } from '@shared/types/common.ts';
import { api } from '../utils/api.ts';
import type { FontListItem } from '@shared/types/index.ts';

const store = useFontStore();
const params = store.params;
const categoryValue = ref(params.category || '');
const languageValue = ref(params.language || '');
const allFonts = ref<FontListItem[]>([]);
const loadingMore = ref(false);
const currentPage = ref(1);
const pageSize = 24;
const newFontIds = ref(new Set<number>());
const isInitialLoad = ref(true);

const sortValue = computed(() => `${params.sort}-${params.order}`);
const hasMore = computed(() => allFonts.value.length < store.total);

function setCategory(cat: string) {
  categoryValue.value = cat;
  currentPage.value = 1;
  allFonts.value = [];
  loadInitial();
}

function setLanguage(lang: string) {
  languageValue.value = lang;
  currentPage.value = 1;
  allFonts.value = [];
  loadInitial();
}

function onSortChange(val: string) {
  const [sort, order] = val.split('-');
  store.setSort(sort!, order!);
  currentPage.value = 1;
  allFonts.value = [];
  loadInitial();
}

async function loadInitial() {
  const currentSort = params.sort || 'added_at';
  const currentOrder = params.order || 'desc';
  const currentSearch = params.search || '';
  
  store.loading = true;
  isInitialLoad.value = true;
  try {
    const result = await api.getFonts({
      page: 1,
      pageSize,
      sort: currentSort,
      order: currentOrder,
      search: currentSearch || undefined,
      category: categoryValue.value || undefined,
      language: languageValue.value || undefined,
    } as Record<string, string | number>);
    allFonts.value = result.data;
    store.total = result.total;
    currentPage.value = 1;
    await nextTick();
    setTimeout(() => {
      isInitialLoad.value = false;
    }, 600);
  } finally {
    store.loading = false;
  }
}

async function loadMore() {
  if (loadingMore.value || !hasMore.value) return;
  loadingMore.value = true;
  
  try {
    currentPage.value++;
    const result = await api.getFonts({
      page: currentPage.value,
      pageSize,
      sort: params.sort,
      order: params.order,
      search: params.search || undefined,
      category: categoryValue.value || undefined,
      language: languageValue.value || undefined,
    } as Record<string, string | number>);
    const newIds = new Set(result.data.map(f => f.id));
    newFontIds.value = newIds;
    allFonts.value = [...allFonts.value, ...result.data];
    await nextTick();
    setTimeout(() => {
      newFontIds.value = new Set();
    }, 600);
  } finally {
    loadingMore.value = false;
  }
}

watch(() => store.params.search, () => {
  currentPage.value = 1;
  allFonts.value = [];
  loadInitial();
});

onMounted(() => {
  if (!params.search) {
    store.resetFilters();
    store.setSort('added_at', 'desc');
  }
  loadInitial();
  window.addEventListener('fonts-load-more', handleLoadMore);
});

onUnmounted(() => {
  window.removeEventListener('fonts-load-more', handleLoadMore);
});

function handleLoadMore() {
  loadMore();
}
</script>

<style scoped>
.font-card-initial,
.font-card-enter {
  animation: fontCardIn 0.4s ease-out both;
}

@keyframes fontCardIn {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.loading-dots {
  display: flex;
  gap: 6px;
}

.loading-dots span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #9ca3af;
  animation: dotBounce 1.2s infinite ease-in-out;
}

.loading-dots span:nth-child(2) {
  animation-delay: 0.15s;
}

.loading-dots span:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes dotBounce {
  0%, 80%, 100% {
    transform: scale(0.6);
    opacity: 0.4;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
