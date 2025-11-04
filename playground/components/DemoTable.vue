<template>
  <div class="demo">
    <h2>🎨 Vue Excel Table Playground</h2>

    <button @click="exportTable" class="demo__btn">Экспорт</button>

    <ExcelTable
      v-model="tableData"
      :columns="columns"
      no-header-edit
      @onReady="handleTableReady"
    >
      <template #cell="{ record, column, value, rowIndex }">
        <template v-if="rowIndex === 2">
          <select v-model="record[column.field]" class="cell-select" @click.stop>
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
        <template v-else>{{ value }}</template>
      </template>
    </ExcelTable>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { formatNumber } from "../../src/mock/helpers";
import tableDataMock from "../../src/mock/data";
import { ExcelTable } from "@/index";

const tableData = ref(tableDataMock);
const tableApi = ref<any>(null);

const handleTableReady = (api: any) => {
  tableApi.value = api;
};

const exportTable = () => {
  tableApi.value?.exportTable();
};

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

const columns = computed(() => [
  { field: "groupKey", type: "string", label: "Группа", grouping: "expand" },
  { field: "date_dt", type: "date", label: "Дата" },
  { field: "prod_horizon", type: "string", label: "Объект работы" },
  { field: "well_status", type: "string", label: "Состояние" },
  { field: "well_type", type: "string", label: "Характер работы" },
  { field: "eff", type: "number", label: "К_эксп" },
]);
</script>

<style scoped lang="scss">
.demo {
  padding: 20px;
  font-family: Inter, sans-serif;
}
.demo__btn {
  padding: 6px 12px;
  margin-bottom: 10px;
  font-size: 12px;
  background: #009639;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.cell-select {
  width: 100%;
  font-size: 10px;
  padding: 2px;
  border: 1px solid #ccc;
  border-radius: 3px;
}
</style>
