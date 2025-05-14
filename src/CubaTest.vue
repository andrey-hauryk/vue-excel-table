<template>

</template>

<script setup lang="ts">
import {ref} from 'vue';
import cubaDataMock from './mock/cuba.ts';

const tableData = ref(cubaDataMock);

const monthTableData = ref([]);

const CalculateTableData = () => {
  for(let month in tableData.value) {
    Object.keys(tableData.value[month].days).forEach((key) => {
      monthTableData.value.push(tableData.value[month].days[key]);
    })
  }

  console.log(monthTableData.value);
}

CalculateTableData();

</script>

<style scoped lang="scss"></style>