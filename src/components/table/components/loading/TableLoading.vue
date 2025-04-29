<template>
  <div v-if="loading" class="excel-loading">
    <div class="excel-loading__spinner"></div>
  </div>
</template>


<script setup lang="ts">

interface Props {
    loading: boolean,
}

const props = defineProps<Props>();

</script>

<style scoped lang="scss">
.excel-loading {
  position: absolute;
  top: 50%;
  left: 50%;
}

.excel-loading__spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top: 5px solid #009639;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>