<template>
  <div class="max-w-7xl mx-auto py-8">
    <!-- 轮播图 -->
    <div class="mb-6" v-if="banners.length > 0">
      <el-carousel height="300px" :interval="5000" arrow="always">
        <el-carousel-item v-for="banner in banners" :key="banner.id">
          <a
            :href="banner.linkUrl || undefined"
            :target="banner.linkUrl ? '_blank' : undefined"
            :rel="banner.linkUrl ? 'noopener noreferrer' : undefined"
            :class="['block h-full', banner.linkUrl ? 'cursor-pointer' : 'cursor-default']"
          >
            <img :src="banner.imagePath" :alt="banner.title" class="w-full h-full object-cover" />
          </a>
        </el-carousel-item>
      </el-carousel>
    </div>

    <!-- 热门字体标题 -->
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-semibold text-gray-900">热门字体</h2>
      <router-link to="/fonts" class="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1">
        显示更多免费字体
        <el-icon><ArrowRight /></el-icon>
      </router-link>
    </div>

    <div v-if="store.loading" v-loading="true" class="min-h-[200px]" />

    <el-empty v-else-if="store.fonts.length === 0" description="暂无字体" />

    <template v-else>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <FontCard v-for="font in store.fonts" :key="font.id" :font="font" />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ArrowRight } from '@element-plus/icons-vue';
import { useFontStore } from '../stores/fontStore.ts';
import FontCard from '../components/FontCard.vue';
import { api } from '../utils/api.ts';
import type { Banner } from '@shared/types/index.ts';

const store = useFontStore();
const banners = ref<Banner[]>([]);

onMounted(async () => {
  store.resetFilters();
  store.setSort('download_count', 'desc');
  store.setPageSize(24);
  store.fetchFonts();

  try {
    banners.value = await api.getBanners();
  } catch {
    // 轮播图加载失败不影响页面
  }
});
</script>
