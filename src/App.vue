<template>
  <div class="table">
    <button @click="exportTable">Экспорт</button>

    <ExcelTable
      v-model="tableData"
      :columns="columns"
      no-header-edit
      @onReady="handleTableReady"
    >
      <template #cell="{ record, column, value, rowIndex }">
        <template v-if="rowIndex === 2">
          <select
            v-model="record[column.field]"
            class="cell-select"
            @click.stop
          >
            <option disabled value="">Выберите значение</option>
            <option
              v-for="option in getOptions(column.field)"
              :key="option"
              :value="option"
            >
              {{ option }}
            </option>
          </select>
        </template>

        <!-- <template v-else>
          {{ value }}
        </template> -->
      </template>
    </ExcelTable>
  </div>
</template>

<script setup lang="ts">
import ExcelTable from "./components/ui/ExcelTable.vue";
import { formatNumber } from "./mock/helpers";
import tableDataMock from "./mock/data";
import { computed, ref } from "vue";

const tableData = ref(tableDataMock);
const tableApi = ref<any>(null);

const handleTableReady = (api: any) => {
  tableApi.value = api;
};

const exportTable = () => {
  tableApi.value?.exportTable();
};

// ✅ Опции для select в зависимости от поля
const getOptions = (field: string) => {
  switch (field) {
    case "well_status":
      return ["Активна", "В ремонте", "Остановлена"];
    case "well_type":
      return ["Нефтяная", "Нагнетательная", "Газовая"];
    case "eff":
      return ["0.8", "0.9", "1.0"];
    default:
      return ["A", "B", "C"];
  }
};

// Колонки без изменений
const columns = computed(() => [
  { field: "groupKey", type: "string", label: "Группа", grouping: "expand" },
  { field: "date_dt", type: "date", label: "Дата" },
  {
    field: "prod_horizon",
    label: "Объект работы",
    type: "string",
    width: "2000",
    invisible: false,
    readonly: false,
    autoFillWidth: true,
    sticky: true,
    noSorting: true,
    autocomplete: true,
  },
  { field: "well_status", type: "string", label: "Состояние", width: "4000" },
  {
    field: "well_type",
    type: "string",
    label: "Характер работы",
    width: "4000",
  },
  {
    field: "liq_prod_rate_tn",
    type: "number",
    label: "Дебит жид., т/сут",
    valueFormatter: (value: number) => formatNumber(value, "liq_prod_rate_tn"),
  },
  { field: "liq_prod_month_tn", type: "number", label: "Добыча  жид., тыс.т" },
  {
    field: "oil_prod_rate_tn",
    type: "number",
    label: "Дебит неф., т/сут",
    valueFormatter: (value: number) => formatNumber(value, "oil_prod_rate_tn"),
  },
  {
    field: "oil_prod_month_tn",
    type: "number",
    label: "Добыча  неф., тыс.т",
    valueFormatter: (value: number) => formatNumber(value, "oil_prod_month_tn"),
  },
  {
    field: "oil_prod_cumul_tn",
    type: "number",
    label: "Нак. добыча неф., тыс.т",
    valueFormatter: (value: number) => formatNumber(value, "oil_prod_cumul_tn"),
  },
  {
    field: "png_prod_rate_m3",
    type: "number",
    label: "Дебит газа, тыс.м3/сут",
    valueFormatter: (value: number) => formatNumber(value, "png_prod_rate_m3"),
  },
  {
    field: "png_prod_month_m3",
    type: "number",
    label: "Добыча  газа, тыс.м3",
    valueFormatter: (value: number) => formatNumber(value, "png_prod_month_m3"),
  },
  {
    field: "png_prod_cumul_m3",
    type: "number",
    label: "Нак. добыча газа, млн.м3",
    valueFormatter: (value: number) => formatNumber(value, "png_prod_cumul_m3"),
  },
  {
    field: "wat_inje_rate_m3",
    type: "number",
    label: "Приемистость, м3/сут",
    valueFormatter: (value: number) => formatNumber(value, "wat_inje_rate_m3"),
  },
  {
    field: "wat_inje_month_m3",
    type: "number",
    label: "Закачка воды, тыс.м3",
    valueFormatter: (value: number) => formatNumber(value, "wat_inje_month_m3"),
  },
  {
    field: "wat_inje_cumul_m3",
    type: "number",
    label: "Нак. закачка воды, тыс.м3",
    valueFormatter: (value: number) => formatNumber(value, "wat_inje_cumul_m3"),
  },
  {
    field: "wct_tn",
    type: "number",
    label: "Обв., т/т",
    valueFormatter: (value: number) => formatNumber(value, "wct_tn"),
  },
  {
    field: "gor_tn_to_m3",
    type: "number",
    label: "Газовый фактор, м3/т",
    valueFormatter: (value: number) => formatNumber(value, "gor_tn_to_m3"),
  },
  {
    field: "eff",
    autocomplete: true,
    type: "number",
    label: "К_эксп",
    valueFormatter: (value: number) => formatNumber(value, "eff"),
  },
]);
</script>

<style scoped lang="scss">
.cell-select {
  width: 100%;
  font-size: 10px;
  padding: 2px;
  border: 1px solid #ccc;
  border-radius: 3px;
}
</style>
