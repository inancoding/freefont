<template>
  <el-form label-width="100px" @submit.prevent="onSubmit">
    <el-form-item label="ID" required>
      <el-input v-model="form.id" :disabled="!!initial" />
    </el-form-item>
    <el-form-item label="名称" required>
      <el-input v-model="form.name" />
    </el-form-item>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="中文名">
          <el-input v-model="form.nameZh" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="英文名">
          <el-input v-model="form.nameEn" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label="类型" required>
      <el-select v-model="form.type" class="w-full">
        <el-option value="open-source" label="开源许可" />
        <el-option value="vendor" label="厂商许可" />
        <el-option value="custom" label="自定义" />
      </el-select>
    </el-form-item>
    <el-form-item label="链接">
      <el-input v-model="form.url" placeholder="https://" />
    </el-form-item>
    <el-form-item label="简介">
      <el-input v-model="form.summary" type="textarea" :rows="2" />
    </el-form-item>
    <el-form-item label="允许">
      <el-input v-model="permissionsInput" placeholder="逗号分隔" />
    </el-form-item>
    <el-form-item label="限制">
      <el-input v-model="limitationsInput" placeholder="逗号分隔" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" native-type="submit">保存</el-button>
      <el-button @click="$emit('cancel')">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue';
import type { License } from '@shared/types/index.ts';

const props = defineProps<{ initial?: License }>();
const emit = defineEmits<{ submit: [data: License]; cancel: [] }>();

const permissionsInput = ref('');
const limitationsInput = ref('');

const form = reactive({
  id: '',
  name: '',
  nameZh: '',
  nameEn: '',
  type: 'open-source' as License['type'],
  url: '',
  summary: '',
  permissions: [] as string[],
  limitations: [] as string[],
});

onMounted(() => {
  if (props.initial) {
    Object.assign(form, { ...props.initial });
    permissionsInput.value = props.initial.permissions.join(', ');
    limitationsInput.value = props.initial.limitations.join(', ');
  }
});

function onSubmit() {
  form.permissions = permissionsInput.value.split(',').map((s) => s.trim()).filter(Boolean);
  form.limitations = limitationsInput.value.split(',').map((s) => s.trim()).filter(Boolean);
  emit('submit', { ...form } as unknown as License);
}
</script>
