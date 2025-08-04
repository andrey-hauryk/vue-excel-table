<template>
  <VueExcelEditor
    class="excel-table"
    v-model="localTableData"
    @update:modelValue="localTableData = $event"
    v-bind="editorProps"
    :selectedRows="localSelectedWells"
    :cellStyle="cellStyle"
    :columns="columns"
    @select="handleSelect"
    @ready="setProps"
    @cell-click="handleCellClick"
  >
    <VueExcelColumn
      v-for="(column, colIndex) in columns"
      :key="column.field"
      v-bind="column"
      :init-style="{ padding: '2px 4px', height: '15px', 'text-align': 'center' }"
      auto-fill-width
    >
    </VueExcelColumn>
  </VueExcelEditor>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import VueExcelEditor from '../table/VueExcelEditor.vue';
import VueExcelColumn from '../table/VueExcelColumn.vue';
import { TableProps } from '../table/types';

const props = defineProps<TableProps>();
const { modelValue, ...editorProps } = props;

const allSelectedIds = ref<string[]>();

const localSelectedWells = ref([]);

const emit = defineEmits(['update:modelValue', 'selected', "onReady", 'cell-click']);

const handleSelect = (selectedId: string[], status: boolean, currentRowsData: any): void => {
  if (props.singleSelect) {
    allSelectedIds.value = status ? [...selectedId] : [];
  } else {
    selectedId.forEach((field: string) => {
      const indexIfExist: number = allSelectedIds.value.indexOf(field);
      if (status) {
        if (indexIfExist === -1) {
          allSelectedIds.value.push(field);
        }
      } else if (indexIfExist !== -1) {
        allSelectedIds.value.splice(indexIfExist, 1);
      }
    });
  }
  emit('selected', [...allSelectedIds.value], currentRowsData, status);
};

const handleCellClick = (position, text, record, currentField, context) => {
  emit('cell-click', position, text, record, currentField, context);
}

const setProps = (api: any) => {
  localSelectedWells.value = props.selectedRows || [];
  allSelectedIds.value = localSelectedWells.value;
  emit('onReady', api);
}

watch(() => props.selectedRows, () => setProps())

watch(() => props.columns, (newValue) => {
  console.log('columns chandef', newValue.length);
});

const localTableData = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});
</script>

<style scoped lang="scss">
::v-deep .excel-table table > thead > tr > th {
  background-color: #009639;
  color: #fff;
}

::v-deep .excel-table td,
::v-deep .excel-table th {
  font-size: 10px;
  font-family: "Montserrat";
}

.excel-table::v-deep .component-content .table-content .systable {
  width: auto !important;
}
</style>