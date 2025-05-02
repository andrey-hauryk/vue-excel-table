<template>
  <div class="ui-input">
    <label v-if="label" class="ui-input__label">{{ label }}</label>
    <input
      :type="type"
      :placeholder="placeholder"
      class="ui-input__field"
      :class="{ 'ui-input__field--error': error }"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <p v-if="error" class="ui-input__error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string
  label?: string
  placeholder?: string
  type?: string
  error?: string
}>()

defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>

<style scoped lang="scss">
.ui-input {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  &__label {
    font-weight: 500;
    font-size: 0.9rem;
  }

  &__field {
    padding: 0.5rem 0.75rem;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 1rem;
    outline: none;
    transition: border-color 0.2s;

    &:focus {
      border-color: #007bff;
    }

    &--error {
      border-color: #e53935;
    }
  }

  &__error {
    color: #e53935;
    font-size: 0.8rem;
  }
}
</style>
