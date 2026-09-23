<template>
  <div class="flex items-center gap-2">
    <button
      v-for="p in pages"
      :key="p"
      :disabled="p === '...' || p === currentPage"
      :class="[
        'px-3 py-1.5 rounded text-sm transition-colors',
        p === currentPage
          ? 'bg-blue-600 text-white'
          : p === '...'
          ? 'text-gray-400 cursor-default'
          : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
      ]"
      @click="p !== '...' && $emit('update:page', p as number)"
    >
      {{ p }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ currentPage: number; totalPages: number }>();
defineEmits<{ 'update:page': [page: number] }>();

const pages = computed(() => {
  const total = props.totalPages;
  const current = props.currentPage;
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const items: (number | string)[] = [1];
  if (current > 3) items.push('...');
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    items.push(i);
  }
  if (current < total - 2) items.push('...');
  items.push(total);
  return items;
});
</script>
