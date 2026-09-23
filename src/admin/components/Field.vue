<template>
  <div>
    <label class="block text-sm font-medium text-gray-700 mb-1">{{ label }}<span v-if="required" class="text-red-500 ml-0.5">*</span></label>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{ label: string; required?: boolean }>();
</script>
