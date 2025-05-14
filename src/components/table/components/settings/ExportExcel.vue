<template>
  <form class="export-container" @submit.prevent="submitExport">
      <ExcelInput
        v-model="form.fileName"
        :label="localizedLabel.fileName"
        :placeholder="localizedLabel.fileName"
      ></ExcelInput>
      <ExcelCheckbox v-model="form.formattedValues">
        Форматирование значений
      </ExcelCheckbox>
      <ExcelCheckbox v-model="form.filteredValues">
        Экспортировать офильтрованные значения
      </ExcelCheckbox>
      <ExcelCheckbox v-model="form.selectedRows">
        Выбранные строки
      </ExcelCheckbox>
  </form>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue';
import ExcelInput from '../ui/ExcelInput.vue';
import ExcelCheckbox from '../ui/ExcelCheckbox.vue';

const props = defineProps<{
  localizedLabel: {
    fileName: string
  },
  exportSettings: ExportSettings
}>();

const emit = defineEmits<{
  (e: 'update:exportSettings', payload: ExportSettings): void
}>();

type ExportSettings = {
  fileName: string
  filteredValues: boolean,
  selectedRows: boolean,
  formattedValues: boolean,
}

const form = reactive({ ...props.exportSettings })

watch(form, () => {
  emit('update:exportSettings', { ...form })
}, { deep: true })


function submitExport() {
  emit('update:exportSettings', { ...form })
}
</script>

<style scoped lang="scss">
.export-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-control {
  padding: 0.5rem;
  font-size: 1rem;
}
</style>
