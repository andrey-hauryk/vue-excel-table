<template>
<ExcelTable
  v-model="monthTableData"
  :columns="columns"
  :selectedRows="selectedRows"
  autocomplete
  selectable
  free-select
  no-header-edit
  no-paging
></ExcelTable>
</template>

<script setup lang="ts">
import {ref, computed} from 'vue';
import ExcelTable from './components/ui/ExcelTable.vue';

import cubaDataMock from './mock/cuba.ts';

const tableData = ref(cubaDataMock);

const selectedRows = ref([]);

const monthTableData = ref([]);

const CalculateTableData = () => {
  for(let month in tableData.value) {
    Object.keys(tableData.value[month].days).forEach((key) => {
      const row = tableData.value[month].days[key];
      for (let key in row) {
        row[key] = {
          value: row[key],
        }
      }
      monthTableData.value.push(tableData.value[month].days[key]);
    })
  }

  console.log(monthTableData.value);
}

const columns = computed(() => [
  { 
    field: "oil_debit", 
    label: "Дебит нефти",
    type: "string", 
  },
  // { field: "well_status", type: "string", label: "Состояние"},
  // { field: "well_type", type: "string", label: "Характер работы"},
  // { field: "liq_prod_rate_tn", type: "number", label: "Дебит жид., т/сут", valueFormatter: (value: number) => formatNumber(value, "liq_prod_rate_tn")},
  // { field: "liq_prod_month_tn", type: "number", label: "Добыча  жид., тыс.т", valueFormatter: (value: number) => formatNumber(value, "liq_prod_month_tn")},
  // { field: "oil_prod_rate_tn", type: "number", label: "Дебит неф., т/сут", valueFormatter: (value: number) => formatNumber(value, "oil_prod_rate_tn")},
  // { field: "oil_prod_month_tn", type: "number", label: "Добыча  неф., тыс.т", valueFormatter: (value: number) => formatNumber(value, "oil_prod_month_tn")},
  // { field: "oil_prod_cumul_tn", type: "number", label: "Нак. добыча неф., тыс.т", valueFormatter: (value: number) => formatNumber(value, "oil_prod_cumul_tn")},
  // { field: "png_prod_rate_m3", type: "number", label: "Дебит газа, тыс.м3/сут", valueFormatter: (value: number) => formatNumber(value, "png_prod_rate_m3")},
  // { field: "png_prod_month_m3", type: "number", label: "Добыча  газа, тыс.м3", valueFormatter: (value: number) => formatNumber(value, "png_prod_month_m3")},
  // { field: "png_prod_cumul_m3", type: "number", label: "Нак. добыча газа, млн.м3", valueFormatter: (value: number) => formatNumber(value, "png_prod_cumul_m3")},
  // { field: "wat_inje_rate_m3", type: "number", label: "Приемистость, м3/сут", valueFormatter: (value: number) => formatNumber(value, "wat_inje_rate_m3")},
  // { field: "wat_inje_month_m3", type: "number", label: "Закачка воды, тыс.м3", valueFormatter: (value: number) => formatNumber(value, "wat_inje_month_m3")},
  // { field: "wat_inje_cumul_m3", type: "number", label: "Нак. закачка воды, тыс.м3", valueFormatter: (value: number) => formatNumber(value, "wat_inje_cumul_m3")},
  // { field: "wct_tn", type: "number", label: "Обв., т/т", valueFormatter: (value: number) => formatNumber(value, "wct_tn")},
  // { field: "gor_tn_to_m3", type: "number", label: "Газовый фактор, м3/т", valueFormatter: (value: number) => formatNumber(value, "gor_tn_to_m3")},
  // { field: "eff", autocomplete: true, type: "number", label: "К_эксп", valueFormatter: (value: number) => formatNumber(value, "eff")},
]);


CalculateTableData();

</script>

<style scoped lang="scss"></style>