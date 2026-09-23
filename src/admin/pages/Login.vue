<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <el-card class="w-96">
      <template #header>
        <h1 class="text-xl font-bold text-center">管理后台登录</h1>
      </template>
      <el-form @submit.prevent="onLogin">
        <el-form-item label="用户名">
          <el-input v-model="username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="password" type="password" placeholder="请输入密码" show-password />
        </el-form-item>
        <el-alert v-if="error" :title="error" type="error" :closable="false" class="mb-4" />
        <el-button type="primary" class="w-full" native-type="submit" :loading="loading">
          登录
        </el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { adminApi, setToken } from '../utils/api.ts';

const router = useRouter();
const username = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

async function onLogin() {
  error.value = '';
  loading.value = true;
  try {
    const result = await adminApi.login(username.value, password.value);
    setToken(result.token);
    const redirect = (router.currentRoute.value.query.redirect as string) || '/fonts';
    router.push(redirect);
  } catch {
    error.value = '用户名或密码错误';
  } finally {
    loading.value = false;
  }
}
</script>
