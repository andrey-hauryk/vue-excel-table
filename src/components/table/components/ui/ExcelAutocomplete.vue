<template>
  <div class="ui-autocomplete">
    <label v-if="label" class="ui-autocomplete__label">{{ label }}</label>
    <input
      type="text"
      class="ui-autocomplete__input"
      :placeholder="placeholder"
      v-model="search"
      @focus="isOpen = true"
      @blur="handleBlur"
    />

    <ul v-if="isOpen && filteredOptions.length" class="ui-autocomplete__list">
      <li
        v-for="option in filteredOptions"
        :key="option.value"
        class="ui-autocomplete__item"
        @mousedown.prevent="selectOption(option)"
      >
        {{ option.label }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Option {
  label: string
  value: string
}

const props = defineProps<{
  modelValue: string
  options: Option[]
  label?: string
  placeholder?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const search = ref('')
const isOpen = ref(false)

const filteredOptions = computed(() =>
  props.options.filter((opt) =>
    opt.label.toLowerCase().includes(search.value.toLowerCase())
  )
)

watch(
  () => props.modelValue,
  (newValue) => {
    const match = props.options.find((o) => o.value === newValue)
    if (match) search.value = match.label
  },
  { immediate: true }
)

function selectOption(option: Option) {
  emit('update:modelValue', option.value)
  search.value = option.label
  isOpen.value = false
}

function handleBlur() {
  setTimeout(() => (isOpen.value = false), 100)
}
</script>

<style scoped lang="scss">
.ui-autocomplete {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  &__label {
    font-weight: 500;
    font-size: 0.9rem;
  }

  &__input {
    padding: 0.5rem 0.75rem;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 1rem;
    outline: none;

    &:focus {
      border-color: #007bff;
    }
  }

  &__list {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 10;
    background: white;
    border: 1px solid #ccc;
    border-radius: 6px;
    margin-top: 4px;
    width: 100%;
    max-height: 150px;
    overflow-y: auto;
  }

  &__item {
    padding: 0.5rem 0.75rem;
    cursor: pointer;

    &:hover {
      background-color: #f0f0f0;
    }
  }
}
</style>
