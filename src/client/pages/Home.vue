<template>
  <div class="max-w-7xl mx-auto py-8">
    <!-- 轮播图占位 -->
    <div class="mb-6">
      <el-carousel height="300px" :interval="5000" arrow="always">
        <el-carousel-item v-for="item in 3" :key="item">
          <div class="h-full flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100">
            <span class="text-2xl text-gray-400">轮播图 {{ item }} - 待填充</span>
          </div>
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
import { onMounted } from 'vue';
import { ArrowRight } from '@element-plus/icons-vue';
import { useFontStore } from '../stores/fontStore.ts';
import FontCard from '../components/FontCard.vue';

const store = useFontStore();

onMounted(() => {
  store.resetFilters();
  store.setSort('download_count', 'desc');
  store.setPageSize(24);
  store.fetchFonts();
});
</script>
