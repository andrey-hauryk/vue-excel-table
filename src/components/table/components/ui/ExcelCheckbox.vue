<template>
  <label class="checkbox">
    <input
      type="checkbox"
      class="checkbox__input"
      :checked="value"
      @change="handleChange"
      @click.stop=""
    />
    <span class="checkbox__label">
      <slot></slot>
    </span>
  </label>
</template>

<script setup lang="ts">
const props = defineProps({
    modelValue: Boolean,
    value: Boolean,
});

const emit = defineEmits(["update:modelValue", "change"]);

const handleChange = (e: Event) => {
    emit("update:modelValue", e.target.checked);
    emit("change", e.target.checked);
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