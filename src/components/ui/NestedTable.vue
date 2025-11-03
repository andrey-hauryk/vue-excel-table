<template>
  <div>
    <template v-for="(table, index) in tableData" :key="table.company_id">
      <ExpansionPanel
        :title="table.company_name"
        v-model:show="panelStates[index]"
      >
        <VueExcelEditor
          class="excel-table"
          v-model="table.scenarios"
          noPaging
          noFooter
          no-header-edit
          selectable
          free-select
          disableMultiCopy
          disableMultiPaste
          :cellStyle="cellStyle"
          :selectedRows="selectedRowsLocal"
          :sortingByDefault="{
            colPos: 7,
            dir: 1,
          }"
          highlightRowKey="cons_ready"
          @select="handleSelect"
          @ready="setProps"
          >
          <template v-for="(column, colIndex) in columns" :key="column.index || colIndex">
            <VueExcelColumn
              v-bind="column"
              :init-style="{ padding: '2px 4px', height: '15px', 'text-align': 'center' }"
              auto-fill-width
              v-slot="scope"
            >
            </VueExcelColumn>
            <template v-if="$slots[`cell-${column.field}`]">
                <slot :name="`cell-${column.field}`" :record="record" />
            </template>
          </template>
        </VueExcelEditor>
      </ExpansionPanel>
    </template>
  </div>
</template>

<script setup lang="ts">
import ExpansionPanel from '../table/components/ExpansionPanel.vue';
import VueExcelEditor from '../table/VueExcelEditor.vue';
import VueExcelColumn from '../table/VueExcelColumn.vue';
import {reactive, ref, watch} from 'vue';

const props = defineProps({
  tableData: Array,
  columns: Array,
  selectedRows: Array,
  cellStyle: Function,
});

const selectedRowsLocal = ref([]);

const setProps = () => {
  selectedRowsLocal.value = props.selectedRows;
};


const emit = defineEmits(['selected']);

const panelStates = [];

const allSelectedIds = ref<string[]>(props.selectedRows);

const handleSelect = (selectedId: string[], status: boolean): void => {
  selectedId.forEach((id: string) => {
    const indexIfExist: number = allSelectedIds.value.indexOf(id);
    if (!status) {
      allSelectedIds.value.splice(indexIfExist, 1);
    } else {
      allSelectedIds.value.push(id);
    }
  });

  emit('selected', allSelectedIds.value);
}
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
