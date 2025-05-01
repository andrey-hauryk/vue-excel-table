<template>
  <div class="ui-switch-container">
    <label v-if="label" class="ui-switch__label">{{ label }}</label>

    <button
      class="ui-switch"
      :aria-checked="isChecked"
      role="switch"
      @click="toggle"
    >
      <span
        class="ui-switch__thumb"
        :class="{ 'ui-switch__thumb--checked': isChecked }"
      >
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  modelValue: boolean
  label?: string
  checkedLabel?: string
  uncheckedLabel?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const isChecked = computed(() => props.modelValue)

function toggle() {
  emit('update:modelValue', !isChecked.value)
}
</script>

<style scoped lang="scss">
.ui-switch-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.ui-switch__label {
  font-weight: 600;
  font-size: 0.875rem;
}

.ui-switch {
  width: 80px;
  height: 40px;
  border-radius: 9999px;
  background-color: #d1d5db; // gray-300
  position: relative;
  padding: 4px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &[aria-checked="true"] {
    background-color: #2563eb; // blue-600
  }
}

.ui-switch__thumb {
  width: 50%;
  height: 100%;
  border-radius: 9999px;
  background-color: #fff;
  font-weight: 600;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1f2937; // gray-800
  transition: transform 0.2s ease-in-out;

  &--checked {
    transform: translateX(100%);
  }
}
</style>
