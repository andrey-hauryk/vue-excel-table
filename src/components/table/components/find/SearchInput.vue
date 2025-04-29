<template>
  <div class="panel-input__container">
    <input
      ref="inputField"
      id="inputField"
      type="text"
      :value="modelValue"
      :placeholder="localizedLabel.customFilter"
      class="panel-input"
      trim
      autocomplete="off"
      autocorrect="off"
      autocapitalize="off"
      spellcheck="false"
      @input="handleInput"
      @keydown.exact.enter="emitSearch"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, defineEmits } from 'vue';
const emit = defineEmits(['update:modelValue', 'search']);
const props = defineProps({
  modelValue: {
    type: String,
  },
  localizedLabel: {
    type: Object,
  },
});

const handleInput = (event: Event) => {
  emit('update:modelValue', (event.target as HTMLInputElement).value);
};

const emitSearch = () => {
  emit('search', props.modelValue);
};
</script>

<style scoped lang="scss">
$tableBaseColor: #009639;
.panel-input__container {
  display: flex;
  align-items: center;
  border: 1px solid lightgray;
  border-radius: 4px;
  width: 100%;
  height: 2.3rem;
  position: relative;
}
.panel-input {
  border: none;
  padding: 0.6rem;
  width: 100%;
  font-size: 0.88rem;
  background-color: transparent;
  transition: box-shadow 0.3s ease, border-color 0.3s ease;
  &:focus-within {
    box-shadow: 0 0 8px rgba($tableBaseColor, 0.4);
    border: 1px solid $tableBaseColor;
    outline: none;
  }
  &::placeholder {
    color: #999;
  }
}
.search-icon {
  position: absolute;
  right: 0.5rem;
  font-size: 1.2rem;
  color: #999;
  cursor: pointer;
  transition: color 0.3s ease;
  &:hover {
    color: $tableBaseColor;
  }
}
</style>