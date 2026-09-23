<template>
  <div class="max-w-3xl mx-auto">
    <el-card>
      <template #header>
        <h1 class="text-xl font-bold">新增字体</h1>
      </template>
      <FontForm @submit="onSubmit" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { adminApi } from '../utils/api.ts';
import FontForm from '../components/FontForm.vue';
import type { FontFormData } from '@shared/types/index.ts';

const router = useRouter();

async function onSubmit(data: FontFormData) {
  await adminApi.createFont(data);
  router.push('/fonts');
}
</script>
