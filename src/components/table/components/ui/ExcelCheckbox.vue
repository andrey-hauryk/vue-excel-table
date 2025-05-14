<template>
  <label class="checkbox">
    <input
      type="checkbox"
      class="checkbox__input"
      :checked="modelValue"
      @change="handleChange"
      @click.stop
    />
    <span class="checkbox__label">
      <slot></slot>
    </span>
  </label>
</template>

<script setup lang="ts">
defineProps<{ modelValue: boolean }>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'change', value: boolean): void
}>()

const handleChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  emit('update:modelValue', target.checked)
  emit('change', target.checked)
}
</script>

<style scoped lang="scss">
$tableBaseColor: #009639;

.checkbox {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;

  &__input {
    accent-color: $tableBaseColor;
    cursor: pointer;
    transition: transform 0.2s ease;
  }

  &__label {
    color: gray;
  }
}
</style>
