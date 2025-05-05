<template>
  <form class="export-container" @submit.prevent="submitExport">
      <ExcelInput
        v-model="form.fileName"
        @update:modelValue="submitExport"
        :label="localizedLabel.fileName"
        :placeholder="localizedLabel.fileName"
      ></ExcelInput>
  </form>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import ExcelInput from '../ui/ExcelInput.vue';

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
}

const form = reactive<ExportSettings>({
  fileName: 'report',
})

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
