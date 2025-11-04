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
            :value="record[column.field]"
            class="cell-select"
            @change="(e) => handleSelectChange(e, record, column.field)"
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

        <template v-else>
          {{ value }}
        </template>
      </template>
    </ExcelTable>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { formatNumber } from "../mock/helpers"; // если есть
import tableDataMock from "../mock/data"; // если есть

const tableData = ref(tableDataMock);
const tableApi = ref<any>(null);

const handleTableReady = (api: any) => {
  tableApi.value = api;
};

const exportTable = () => {
  tableApi.value?.exportTable();
};

const handleSelectChange = (event: Event, record: any, field: string) => {
  const newValue = (event.target as HTMLSelectElement).value;
  record[field] = newValue;
  tableData.value = [...tableData.value];
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
  { field: "well_status", type: "string", label: "Состояние" },
  { field: "well_type", type: "string", label: "Характер работы" },
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
