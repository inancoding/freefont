<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <!-- 轮播图占位 -->
    <div class="mb-6">
      <el-carousel height="200px" :interval="5000" arrow="always">
        <el-carousel-item v-for="item in 3" :key="item">
          <div class="h-full flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg">
            <span class="text-2xl text-gray-400">轮播图 {{ item }} - 待填充</span>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>

    <div class="mb-6 space-y-3">
      <div class="flex flex-wrap items-center gap-x-4 gap-y-2">
        <span class="text-sm font-medium text-gray-500 shrink-0">分类</span>
        <el-radio-group v-model="categoryValue" @change="(v: string) => store.setFilter('category', v)">
          <el-radio-button value="">全部</el-radio-button>
          <el-radio-button v-for="cat in CATEGORIES" :key="cat" :value="cat">{{ cat }}</el-radio-button>
        </el-radio-group>
      </div>

      <div class="flex flex-wrap items-center gap-x-4 gap-y-2">
        <span class="text-sm font-medium text-gray-500 shrink-0">语言</span>
        <el-radio-group v-model="languageValue" @change="(v: string) => store.setFilter('language', v)" class="flex-wrap!">
          <el-radio-button value="">全部</el-radio-button>
          <el-radio-button v-for="lang in LANGUAGES" :key="lang" :value="lang">{{ lang }}</el-radio-button>
        </el-radio-group>

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

    <div v-if="store.loading" v-loading="true" class="min-h-[200px]" />

    <el-empty v-else-if="store.fonts.length === 0" description="暂无字体" />

    <template v-else>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <FontCard v-for="font in store.fonts" :key="font.id" :font="font" />
      </div>

      <div v-if="store.totalPages > 1" class="mt-8 flex justify-center">
        <el-pagination
          :current-page="params.page!"
          :page-count="store.totalPages"
          layout="prev, pager, next"
          @current-change="store.setPage"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useFontStore } from '../stores/fontStore.ts';
import FontCard from '../components/FontCard.vue';
import { CATEGORIES, LANGUAGES } from '@shared/types/common.ts';

const store = useFontStore();
const params = store.params;
const categoryValue = ref(params.category || '');
const languageValue = ref(params.language || '');

const sortValue = computed(() => `${params.sort}-${params.order}`);

function onSortChange(val: string) {
  const [sort, order] = val.split('-');
  store.setSort(sort!, order!);
}

onMounted(() => store.fetchFonts());
</script>
