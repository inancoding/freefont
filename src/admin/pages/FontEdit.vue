<template>
  <div class="max-w-3xl mx-auto">
    <el-card>
      <template #header>
        <h1 class="text-xl font-bold">编辑字体</h1>
      </template>
      <div v-loading="loading">
        <FontForm v-if="font" :initial="font" @submit="onSubmit" />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { adminApi } from '../utils/api.ts';
import FontForm from '../components/FontForm.vue';
import type { Font, FontFormData } from '@shared/types/index.ts';

const route = useRoute();
const router = useRouter();
const font = ref<Font | null>(null);
const loading = ref(true);

async function onSubmit(data: FontFormData) {
  await adminApi.updateFont(route.params.slug as string, data);
  router.push('/fonts');
}

onMounted(async () => {
  try {
    font.value = await adminApi.getFont(route.params.slug as string);
  } finally {
    loading.value = false;
  }
});
</script>
