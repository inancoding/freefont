<template>
  <el-container class="h-screen flex-col">
    <el-header class="!h-16 flex items-center border-b border-gray-200 bg-white px-4 shrink-0">
      <div class="w-full max-w-7xl mx-auto flex items-center justify-between gap-4">
        <router-link to="/" class="flex items-center shrink-0" style="font-family: 'Inter', sans-serif; font-weight: 700;">
          <span class="text-2xl" style="color: #1A1A2E">free</span>
          <span class="text-2xl" style="color: #2563EB">font</span>
        </router-link>
        <div class="flex items-center gap-4">
          <el-menu :default-active="route.path" mode="horizontal" :ellipsis="false" router class="!border-b-0">
            <el-menu-item index="/">首页</el-menu-item>
            <el-menu-item index="/fonts">免费字体</el-menu-item>
            <el-menu-item index="/font-assistant">字体助手</el-menu-item>
            <el-menu-item index="/creators">字体创作者</el-menu-item>
            <el-menu-item index="/download">全站下载</el-menu-item>
            <el-menu-item index="/submit">字体提交</el-menu-item>
            <el-menu-item index="/about">关于我们</el-menu-item>
          </el-menu>
          <el-popover
            :visible="showHistory"
            placement="bottom"
            :width="280"
            trigger="click"
            popper-class="search-history-popover"
            @update:visible="showHistory = $event"
          >
            <template #reference>
              <el-input
                v-model="searchValue"
                placeholder="搜索字体..."
                clearable
                size="default"
                class="w-64"
                @focus="onSearchFocus"
                @keydown.enter="doSearch"
                @clear="doSearch"
              >
                <!-- <template #prefix>
                  <el-icon><Search /></el-icon>
                </template> -->
                <template #append>
                  <el-button :icon="Search" @click="doSearch"></el-button>
                </template>
              </el-input>
            </template>
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-gray-500">搜索历史</span>
                <el-button
                  v-if="searchHistory.length > 0"
                  type="danger"
                  size="small"
                  text
                  @click="clearHistory"
                >
                  清空记录
                </el-button>
              </div>
              <div v-if="searchHistory.length === 0" class="text-sm text-gray-400 py-2">
                暂无搜索记录
              </div>
              <div v-else class="flex flex-wrap gap-2">
                <el-tag
                  v-for="item in searchHistory"
                  :key="item"
                  class="cursor-pointer"
                  size="default"
                  @click="selectHistory(item)"
                >
                  {{ item }}
                </el-tag>
              </div>
            </div>
          </el-popover>
        </div>
      </div>
    </el-header>
    <el-scrollbar ref="scrollbarRef" class="flex-1">
      <el-main class="p-0">
        <router-view />
      </el-main>
      <el-footer class="!h-auto py-6 bg-gray-900 text-gray-300 shrink-0">
        <div class="max-w-7xl mx-auto px-4">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div class="flex items-center mb-4" style="font-family: 'Inter', sans-serif; font-weight: 700;">
                <span class="text-2xl" style="color: #fff">free</span>
                <span class="text-2xl" style="color: #2563EB">font</span>
              </div>
              <p class="text-sm text-gray-400 leading-relaxed">
                收录授权明确允许免费使用的字体
              </p>
              <p class="text-xs text-gray-500 mt-3">
                使用前请阅读各字体对应的授权协议。<br/>字体版权归原作者或厂商所有。
              </p>
            </div>

            <div>
              <h4 class="text-white font-medium mb-3">快速链接</h4>
              <ul class="space-y-2 text-sm">
                <li><router-link to="/" class="hover:text-white transition-colors">首页</router-link></li>
                <li><router-link to="/fonts" class="hover:text-white transition-colors">免费字体</router-link></li>
                <li><router-link to="/creators" class="hover:text-white transition-colors">字体创作者</router-link></li>
                <li><router-link to="/download" class="hover:text-white transition-colors">全站下载</router-link></li>
                <li><router-link to="/submit" class="hover:text-white transition-colors">字体提交</router-link></li>
                <li><router-link to="/about" class="hover:text-white transition-colors">关于我们</router-link></li>
                <li><router-link to="/font-assistant" class="hover:text-white transition-colors">字体助手</router-link></li>
              </ul>
            </div>

            <div>
              <h4 class="text-white font-medium mb-3">使用帮助</h4>
              <ul class="space-y-2 text-sm">
                <li><a href="#" class="hover:text-white transition-colors">如何安装字体</a></li>
                <li><a href="#" class="hover:text-white transition-colors">商用授权说明</a></li>
                <li><a href="#" class="hover:text-white transition-colors">常见问题</a></li>
              </ul>
            </div>

            <div>
              <h4 class="text-white font-medium mb-3">联系我们</h4>
              <ul class="space-y-2 text-sm text-gray-400">
                <li>邮箱：contact@freefont.com</li>
                <li>GitHub：<a href="#" class="hover:text-white transition-colors">free-font</a></li>
              </ul>
            </div>
          </div>

          <div class="mt-8 pt-6 border-t border-gray-800 text-center text-xs text-gray-500">
            <p>&copy; 2026 freefont. All rights reserved.</p>
          </div>
        </div>
      </el-footer>
    </el-scrollbar>
  </el-container>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Search } from '@element-plus/icons-vue';
import { useFontStore } from './stores/fontStore.ts';

const STORAGE_KEY = 'font-search-history';
const MAX_HISTORY = 8;

const route = useRoute();
const router = useRouter();
const store = useFontStore();
const searchValue = ref(store.params.search || '');
const searchHistory = ref<string[]>([]);
const showHistory = ref(false);

const scrollbarRef = ref<any>(null);

function loadHistory() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      searchHistory.value = JSON.parse(stored);
    }
  } catch {
    searchHistory.value = [];
  }
}

function saveHistory() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(searchHistory.value));
}

function addToHistory(keyword: string) {
  const trimmed = keyword.trim();
  if (!trimmed) return;
  searchHistory.value = [
    trimmed,
    ...searchHistory.value.filter(item => item !== trimmed),
  ].slice(0, MAX_HISTORY);
  saveHistory();
}

function clearHistory() {
  searchHistory.value = [];
  saveHistory();
}

function selectHistory(item: string) {
  searchValue.value = item;
  showHistory.value = false;
  doSearch();
}

function onSearchFocus() {
  if (searchHistory.length > 0) {
    showHistory.value = true;
  }
}

function doSearch() {
  showHistory.value = false;
  const keyword = searchValue.value.trim();
  if (keyword) {
    addToHistory(keyword);
  }
  store.setSearch(keyword);
  if (route.path !== '/fonts') {
    router.push('/fonts');
  }
}

function onScrollbarScroll() {
  if (route.path !== '/fonts') return;
  const wrap = scrollbarRef.value?.wrapRef
    || scrollbarRef.value?.$el?.querySelector('.el-scrollbar__wrap')
    || document.querySelector('.el-scrollbar .el-scrollbar__wrap');
  if (!wrap) return;
  const { scrollTop, scrollHeight, clientHeight } = wrap;
  const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
  if (distanceFromBottom < 100) {
    window.dispatchEvent(new CustomEvent('fonts-load-more'));
  }
}

onMounted(() => {
  loadHistory();
  nextTick(() => {
    const wrap = scrollbarRef.value?.wrapRef
      || scrollbarRef.value?.$el?.querySelector('.el-scrollbar__wrap')
      || document.querySelector('.el-scrollbar .el-scrollbar__wrap');
    if (wrap) {
      wrap.addEventListener('scroll', onScrollbarScroll);
    }
  });
});

onUnmounted(() => {
  const wrap = scrollbarRef.value?.wrapRef
    || scrollbarRef.value?.$el?.querySelector('.el-scrollbar__wrap')
    || document.querySelector('.el-scrollbar .el-scrollbar__wrap');
  if (wrap) {
    wrap.removeEventListener('scroll', onScrollbarScroll);
  }
});

watch(() => store.params.search, (val) => {
  searchValue.value = val || '';
});
</script>

<style>
.search-history-popover {
  padding: 12px !important;
}
</style>
