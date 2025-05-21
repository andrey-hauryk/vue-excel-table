<template>
  <div
    class="import-container"
    @dragover.prevent
    @drop.prevent="handleDrop"
  >
    <div
      class="import-box"
      @click="triggerFileInput"
    >
      <input
        ref="fileInput"
        type="file"
        accept=".xlsx"
        class="file-input"
        @change="handleFileChange"
        hidden
      />
      <div class="icon">
        <IconFileSaving />
      </div>
      <p>{{ localizedLabel.moveFileOrSelect }}</p>
      <p v-if="importedFile" class="file-info">{{ importedFile.name }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import IconFileSaving from '../svg/IconFileSaving.vue'

defineProps<{
  importedFile: File | null
  localizedLabel: {
    moveFileOrSelect: string
  }
}>()

const emit = defineEmits<{
  (e: 'update:importedFile', value: File | null): void
}>()

const fileInput = ref<HTMLInputElement | null>(null)

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileChange = () => {
  const file = fileInput.value?.files?.[0] ?? null
  emit('update:importedFile', file)
}

const handleDrop = (event: DragEvent) => {
  const file = event.dataTransfer?.files?.[0] ?? null
  emit('update:importedFile', file)
}
</script>

<style scoped>
.import-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px dashed #009639;
  padding: 20px;
  border-radius: 10px;
  background-color: #f9f9f9;
  cursor: pointer;
  transition: background-color 0.3s;
}

.import-container:hover {
  background-color: #0096392a;
}

.import-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.icon svg {
  fill: #009639;
}

.file-input {
  display: none;
}

.file-info {
  margin-top: 20px;
  font-size: 14px;
  color: #333;
}

button {
  background-color: #009639;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

button:hover {
  background-color: #009639;
}
</style>