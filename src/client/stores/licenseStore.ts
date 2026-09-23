import { defineStore } from 'pinia';
import { ref } from 'vue';
import { api } from '../utils/api.ts';
import type { License } from '@shared/types/index.ts';

export const useLicenseStore = defineStore('licenses', () => {
  const licenses = ref<License[]>([]);
  const loading = ref(false);

  async function fetchLicenses() {
    loading.value = true;
    try {
      licenses.value = await api.getLicenses();
    } finally {
      loading.value = false;
    }
  }

  return { licenses, loading, fetchLicenses };
});
