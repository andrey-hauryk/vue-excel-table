<template>
  <form class="export-container" @submit.prevent="submitExport">
    <ExcelAutocomplete
      v-model="form.delimiter"
      :label="localizedLabel.delimiter"
      :options="delimiterOptions"
      placeholder=","
    ></ExcelAutocomplete>
      <ExcelInput
        v-model="form.fileName"
        :label="localizedLabel.fileName"
        placeholder="example"
      ></ExcelInput>
      <ExcelAutocomplete
        v-model="form.format"
        :label="localizedLabel.format"
        :options="formatOptions"
        placeholder="xlsx"
    ></ExcelAutocomplete>
    <ExcelSwitch
    v-model="form.enabled"
    label="Экспорт включен"
    :checked-label="'Да'"
    :unchecked-label="'Нет'"
    ></ExcelSwitch>
  </form>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import ExcelInput from '../ui/ExcelInput.vue';
import ExcelAutocomplete from '../ui/ExcelAutocomplete.vue';
import ExcelSwitch from '../ui/ExcelSwitch.vue';

const props = defineProps<{
  localizedLabel: {
    delimiter: string
    fileName: string
    format: string
  }
}>()

const emit = defineEmits<{
  (e: 'update:exportSettings', payload: ExportSettings): void
}>()

type ExportSettings = {
  delimiter: string
  fileName: string
  format: 'xlsx' | 'csv'
  enabled: boolean
}

const form = reactive<ExportSettings>({
  delimiter: ',',
  fileName: 'export',
  format: 'xlsx',
  enabled: false,
})

const delimiterOptions = [
  { label: ', (запятая)', value: ',' },
  { label: '; (точка с запятой)', value: ';' },
  { label: 'табуляция', value: '\t' },
]

const formatOptions = [
  { label: 'XLSX', value: 'xlsx' },
  { label: 'CSV', value: 'csv' },
]

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
