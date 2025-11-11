<template>
  <div>
    <template v-for="(table, index) in tableData" :key="table[idKey]">
      <ExpansionPanel
        :title="table[titleKey]"
        v-model:show="panelStates[index].isOpen"
        >
        <ExcelTable
          v-model="table[tableKey]"
          v-bind="tableOptions"
          :columns="columns"
          :init-style="{ padding: '2px 4px', height: '15px', 'text-align': 'center' }"
          :selectedRows="selectedRowsLocal"
          :sortingByDefault="sortingByDefaultLocal"
          :cellStyle="cellStyle"
          @select="handleSelect"
          @ready="setProps"
        ></ExcelTable>
      </ExpansionPanel>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ExcelTable } from "vue-excel-table";
import ExpansionPanel from "../table/components/ExpansionPanel.vue";
import {ref} from 'vue';

interface Panel {
  id: string;
  isOpen: boolean;
}

interface tableOptions {
  selectable: boolean;
  noPaging: boolean;
  noFooter: boolean;
  noHeaderEdit: boolean;
  freeSelect: boolean;
  disableMultiCopy: boolean;
  disableMultiPaste: boolean;
  highlightRowKey: string;
  autoFillWidth: boolean;
}

interface Props {
  tableData: any;
  columns: any;
  titleKey: string;
  idKey: string;
  tableKey: string;
  loading: boolean;
  panelStates: Panel[];
  selectedRows: any;
  tableOptions: tableOptions;
  cellStyle: any;
  sortingByDefault: any;
}

const props = withDefaults(defineProps<Props>(), {
  titleKey: "company_name",
  idKey: "company_id",
  tableKey: "scenarios",
});

const selectedRowsLocal = ref([]);
const sortingByDefaultLocal = ref([]);

const setProps = () => {
  selectedRowsLocal.value = props.selectedRows;
  sortingByDefaultLocal.value = props.sortingByDefault;
};

const emit = defineEmits(['selected']);

const allSelectedIds = ref<Set<string>>(new Set(props.selectedRows));

const handleSelect = (selectedId: string[], status: boolean): void => {
  selectedId.forEach((id) => {
    if (status) {
      allSelectedIds.value.add(id);
    } else {
      allSelectedIds.value.delete(id);
    }
  });
  emit('selected', Array.from(allSelectedIds.value));
};
</script>

<style scoped lang="scss">
::v-deep .excel-table table > thead > tr > th {
  background-color: #009639;
  color: #fff;
}

::v-deep .excel-table td,
::v-deep .excel-table th {
  font-size: 14px;
  font-family: "Montserrat";
}

.excel-table::v-deep .component-content .table-content .systable {
  width: auto !important;
}
</style>