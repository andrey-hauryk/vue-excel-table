<template>
    <div class="table">
      <button @click="exportTable">Эксопрт</button>
      <ExcelTable
        v-model="tableData"
        :columns="columns"
        no-header-edit
        @onReady="handleTableReady"
      >
      <template #afterGroup>
        <div style="color: red">Строка после группы</div>
      </template>
      <template #LastRow>
        <div style="color: red">Последняя строка</div>
      </template>
    </ExcelTable>
    </div>
</template>


<script setup lang="ts">
import ExcelTable from './components/ui/ExcelTable.vue';
import {formatNumber} from './mock/helpers';
import tableDataMock from './mock/data';
import {computed, ref} from 'vue';

const tableData = ref(tableDataMock);
const tableApi = ref<any>(null);

const handleTableReady = (api: any) => {
  tableApi.value = api;
};

const exportTable = () => {
  tableApi.value?.exportTable();
};

const columns = computed(() => [
  { field: "groupKey", type: "string", label: "Группа", grouping: 'expand' },
  { field: "date_dt", type: "date", label: "Дата" },
  { 
    field: "prod_horizon", 
    label: "Объект работы",
    type: "string", 
    width: "2000",
    invisible: false,
    readonly: false,
    autoFillWidth: true,
    // lengthLimit: 2,
    sticky: true,
    noSorting: true,
    autocomplete: true,
  },
  { field: "well_status", type: "string", label: "Состояние", width: "4000",},
  { field: "well_type", type: "string", label: "Характер работы", width: "4000"},
  { field: "liq_prod_rate_tn", type: "number", label: "Дебит жид., т/сут", valueFormatter: (value: number) => formatNumber(value, "liq_prod_rate_tn")},
  { field: "liq_prod_month_tn", type: "number", label: "Добыча  жид., тыс.т",},
  { field: "oil_prod_rate_tn", type: "number", label: "Дебит неф., т/сут", valueFormatter: (value: number) => formatNumber(value, "oil_prod_rate_tn")},
  { field: "oil_prod_month_tn", type: "number", label: "Добыча  неф., тыс.т", valueFormatter: (value: number) => formatNumber(value, "oil_prod_month_tn")},
  { field: "oil_prod_cumul_tn", type: "number", label: "Нак. добыча неф., тыс.т", valueFormatter: (value: number) => formatNumber(value, "oil_prod_cumul_tn")},
  { field: "png_prod_rate_m3", type: "number", label: "Дебит газа, тыс.м3/сут", valueFormatter: (value: number) => formatNumber(value, "png_prod_rate_m3")},
  { field: "png_prod_month_m3", type: "number", label: "Добыча  газа, тыс.м3", valueFormatter: (value: number) => formatNumber(value, "png_prod_month_m3")},
  { field: "png_prod_cumul_m3", type: "number", label: "Нак. добыча газа, млн.м3", valueFormatter: (value: number) => formatNumber(value, "png_prod_cumul_m3")},
  { field: "wat_inje_rate_m3", type: "number", label: "Приемистость, м3/сут", valueFormatter: (value: number) => formatNumber(value, "wat_inje_rate_m3")},
  { field: "wat_inje_month_m3", type: "number", label: "Закачка воды, тыс.м3", valueFormatter: (value: number) => formatNumber(value, "wat_inje_month_m3")},
  { field: "wat_inje_cumul_m3", type: "number", label: "Нак. закачка воды, тыс.м3", valueFormatter: (value: number) => formatNumber(value, "wat_inje_cumul_m3")},
  { field: "wct_tn", type: "number", label: "Обв., т/т", valueFormatter: (value: number) => formatNumber(value, "wct_tn")},
  { field: "gor_tn_to_m3", type: "number", label: "Газовый фактор, м3/т", valueFormatter: (value: number) => formatNumber(value, "gor_tn_to_m3")},
  { field: "eff", autocomplete: true, type: "number", label: "К_эксп", valueFormatter: (value: number) => formatNumber(value, "eff")},
]);

</script>


<style scoped lang="scss"></style>