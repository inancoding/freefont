<template>
  <el-container class="h-screen">
    <template v-if="route.path !== '/login'">
      <el-aside width="220px" class="bg-[#1A1A2E] flex flex-col shrink-0">
        <a href="/" class="flex items-center justify-center h-14 shrink-0" style="font-family: 'Inter', sans-serif; font-weight: 700;">
          <span class="text-xl" style="color: #fff">free</span>
          <span class="text-xl" style="color: #60A5FA">font</span>
        </a>
        <el-menu
          :default-active="route.path"
          background-color="#1A1A2E"
          text-color="#9CA3AF"
          active-text-color="#60A5FA"
          class="admin-sidebar !border-r-0 flex-1"
          @select="onMenuSelect"
        >
          <el-menu-item index="/">
            <el-icon><HomeFilled /></el-icon>
            <span>网站首页</span>
          </el-menu-item>
          <el-menu-item index="/fonts">
            <el-icon><Files /></el-icon>
            <span>字体管理</span>
          </el-menu-item>
          <el-menu-item index="/licenses">
            <el-icon><Document /></el-icon>
            <span>许可管理</span>
          </el-menu-item>
          <el-menu-item index="/banners">
            <el-icon><Picture /></el-icon>
            <span>轮播图管理</span>
          </el-menu-item>
          <el-menu-item index="/resources">
            <el-icon><FolderOpened /></el-icon>
            <span>资源管理</span>
          </el-menu-item>
        </el-menu>
        <div class="px-4 pb-4 shrink-0">
          <el-popconfirm title="确定要退出登录吗？" confirm-button-text="确定" cancel-button-text="取消" @confirm="onLogout">
            <template #reference>
              <div class="flex items-center justify-center gap-2 py-2.5 rounded-lg cursor-pointer text-gray-400 hover:text-white hover:bg-white/8 transition-colors">
                <el-icon><SwitchButton /></el-icon>
                <span class="text-sm">退出登录</span>
              </div>
            </template>
          </el-popconfirm>
        </div>
      </el-aside>
    </template>
    <el-main class="bg-gray-50 !p-0 overflow-hidden">
      <el-scrollbar>
        <router-view />
      </el-scrollbar>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { setToken } from './utils/api.ts';

const route = useRoute();
const router = useRouter();

function onMenuSelect(index: string) {
  if (index === '/') {
    window.location.href = '/';
  } else {
    router.push(index);
  }
}

function onLogout() {
  setToken(null);
  router.push('/login');
}
</script>

<style>
.admin-sidebar .el-menu-item:hover {
  background-color: rgba(255, 255, 255, 0.08) !important;
}
.admin-sidebar .el-menu-item.is-active {
  background-color: rgba(96, 165, 250, 0.15) !important;
}
</style>
