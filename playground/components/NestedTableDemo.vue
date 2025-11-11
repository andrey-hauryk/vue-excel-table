<template>
  <div>
    <NestedTable
      :tableData="tableDataMock"
      :panelStates="panelStates"
      :columns="columns"
      tableKey="data"
      titleKey="name"
      idKey="id"
    ></NestedTable>
  </div>
</template>

<script setup lang="ts">
// import NestedTable from "../../src/components/ui/NestedTable.vue";
import tableDataMock from "../mock/nestedData.ts";
import { ref, computed } from 'vue';

const panelStates = ref(tableDataMock.map((item) => ({
  id: item.id,
  isOpen: false,
})));

const columns = computed(() => [
  {
    field: 'name',
    type: 'string',
    label: 'параметр',
  }
]);
</script>