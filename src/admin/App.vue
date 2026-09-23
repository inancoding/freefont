<template>
  <el-container class="min-h-screen">
    <el-header class="!h-14 flex items-center border-b border-gray-200 bg-white px-4">
      <div class="w-full max-w-7xl mx-auto flex items-center gap-6">
        <router-link to="/" class="flex items-center" style="font-family: 'Inter', sans-serif; font-weight: 700;">
          <span class="text-xl" style="color: #1A1A2E">free</span>
          <span class="text-xl" style="color: #2563EB">font</span>
        </router-link>
        <el-menu :default-active="route.path" mode="horizontal" :ellipsis="false" router class="!border-b-0">
          <el-menu-item index="/fonts">字体管理</el-menu-item>
          <el-menu-item index="/licenses">许可管理</el-menu-item>
          <el-menu-item index="/banners">轮播图管理</el-menu-item>
        </el-menu>
      </div>
    </el-header>
    <el-main class="bg-gray-50">
      <router-view />
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();
</script>
