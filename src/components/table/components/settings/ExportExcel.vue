<template>
  <form class="export-container" @submit.prevent="submitExport">
      <ExcelInput
        v-model="form.fileName"
        @update:modelValue="submitExport"
        :label="localizedLabel.fileName"
        :placeholder="localizedLabel.fileName"
      ></ExcelInput>
      <DropDownButton 
        v-model="form.delimiter" 
        :items="delimitersOptions"
        @update:modelValue="submitExport"
      ></DropDownButton>
      <ExcelCheckbox v-model="form.filteredValues">
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
import { reactive, ref } from 'vue';
import ExcelInput from '../ui/ExcelInput.vue';
import DropDownButton from "../filter/DropDownButton.vue";
import ExcelCheckbox from '../ui/ExcelCheckbox.vue';

const props = defineProps<{
  localizedLabel: {
    fileName: string
  }
}>();

const emit = defineEmits<{
  (e: 'update:exportSettings', payload: ExportSettings): void
}>();

type ExportSettings = {
  fileName: string
  delimiter: string
  filteredValues: boolean,
  selectedRows: boolean,
  formatValues: boolean,
}

const form = reactive<ExportSettings>({
  fileName: 'отчет',
  delimiter: ',',
  formatValues: true,
  filteredValues: false,
  selectedRows: false,
});

const delimitersOptions = ref([
  {
    value: ',',
    name: ','
  },
  {
    value: '.',
    name: '.'
  },
]);

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
