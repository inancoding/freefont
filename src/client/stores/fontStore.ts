import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { api } from '../utils/api.ts';
import type { FontListItem, FontListParams } from '@shared/types/index.ts';

export const useFontStore = defineStore('fonts', () => {
  const fonts = ref<FontListItem[]>([]);
  const total = ref(0);
  const loading = ref(false);
  const params = ref<FontListParams>({
    page: 1,
    pageSize: 20,
    sort: 'added_at',
    order: 'desc',
  });

  const totalPages = computed(() => Math.ceil(total.value / params.value.pageSize!));

  async function fetchFonts() {
    loading.value = true;
    try {
      const result = await api.getFonts(params.value as Record<string, string | number>);
      fonts.value = result.data;
      total.value = result.total;
    } finally {
      loading.value = false;
    }
  }

  function setPage(page: number) {
    params.value.page = page;
    fetchFonts();
  }

  function setPageSize(size: number) {
    params.value.pageSize = size;
    params.value.page = 1;
  }

  function setSearch(search: string) {
    if (search) params.value.search = search;
    else delete params.value.search;
    params.value.page = 1;
  }

  function setFilter(key: keyof FontListParams, value: string) {
    if (value) (params.value as Record<string, unknown>)[key] = value;
    else delete (params.value as Record<string, unknown>)[key];
    params.value.page = 1;
    fetchFonts();
  }

  function setSort(sort: string, order: string) {
    params.value.sort = sort as NonNullable<FontListParams['sort']>;
    params.value.order = order as NonNullable<FontListParams['order']>;
    params.value.page = 1;
  }

  function resetFilters() {
    params.value = {
      page: 1,
      pageSize: 20,
      sort: 'added_at',
      order: 'desc',
    };
  }

  return { fonts, total, loading, params, totalPages, fetchFonts, setPage, setPageSize, setSearch, setFilter, setSort, resetFilters };
});
