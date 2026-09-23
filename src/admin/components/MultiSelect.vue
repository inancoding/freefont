<template>
  <div class="flex flex-wrap gap-2">
    <label v-for="opt in options" :key="opt" class="flex items-center gap-1 text-sm text-gray-600">
      <input
        type="checkbox"
        :value="opt"
        :checked="modelValue.includes(opt)"
        @change="toggle(opt)"
        class="rounded border-gray-300"
      />
      {{ opt }}
    </label>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ modelValue: string[]; options: string[] }>();
const emit = defineEmits<{ 'update:modelValue': [value: string[]] }>();

function toggle(opt: string) {
  const next = props.modelValue.includes(opt)
    ? props.modelValue.filter((v) => v !== opt)
    : [...props.modelValue, opt];
  emit('update:modelValue', next);
}
</script>
