<template>
  <ExcelModal
    :show="show"
    @close="hidePanel"
    :header="localizedLabel.sortingAndFiltering"
    :localizedLabel="localizedLabel"
  >
    <template #content>
      <div class="panel-action">
        <ExcelButton class="panel-btn" :label="localizedLabel.sortAscending" @click="sort(1)"></ExcelButton>
        <ExcelButton class="panel-btn" :label="localizedLabel.sortDescending" @click="sort(-1)"></ExcelButton>
      </div>
      <div class="panel-action">
        <ExcelTabs
          :tabs="[
            { name: 'basic', label: localizedLabel.basicFilter },
            { name: 'custom', label: localizedLabel.customFilter || 'Custom Filter' },
          ]"
          v-model="activeTab"
        />
      </div>
      <transition name="fade" mode="out-in">
        <div v-if="activeTab !== 'basic'" class="panel-content">
          <CustomFilter
            :localizedLabel="localizedLabel"
            :columnType="columnType"
            @applyCustomFilter="applyCustomFilter"
          ></CustomFilter>
        </div>
        <div v-else class="panel-content">
          <SearchInput
            :localizedLabel="localizedLabel"
            v-model="search"
            @search="doInputFilter"
          ></SearchInput>
        <div class="panel-list">
          <div class="panel-list__item" @click="toggleSelectAll(!isAllSelected)">
            <ExcelCheckbox
              :value="isAllSelected"
              @change="toggleSelectAll"
              @click.stop=""
            ></ExcelCheckbox>
            <span class="panel-list__text">{{ isFiltered ? localizedLabel.selectAllSearchResults : localizedLabel.selectAll }}</span>
          </div>
          <transition-group name="list" tag="div">
            <div
              v-for="(item, k) in filteredSortedUniqueValueList"
              :key="k"
              class="panel-list__item"
              @click="toggleSelection(item)"
            >
              <ExcelCheckbox
                :value="selectedRows.has(item)"
                @change="toggleSelection(item)"
              ></ExcelCheckbox>
              <span class="panel-list__text">{{ item }}</span>
            </div>
        </transition-group>
      </div>
    </div>
    </transition>
    </template>
    <template #actions>
      <div class="panel-action">
        <ExcelButton class="panel-btn" :label="localizedLabel.deleteFilter" @click="deleteFilter"></ExcelButton>
        <ExcelButton class="panel-btn" :label="localizedLabel.apply" @click="apply"></ExcelButton>
      </div>
    </template>
  </ExcelModal>
</template>

<script setup lang="ts">
import ExcelModal from "../ui/ExcelModal.vue";
import ExcelButton from '../ui/ExcelButton.vue';
import SearchInput from "../find/SearchInput.vue";
import ExcelCheckbox from "../ui/ExcelCheckbox.vue";
import CustomFilter from "./CustomFilter.vue";
import ExcelTabs from '../ui/ExcelTabs.vue';
import { ref, computed, watch } from "vue";

const props = defineProps({
  localizedLabel: {
    type: Object,
  },
  show: {
    type: Boolean,
    default: false,
  },
  filterColumnsRows: {
    type: Array,
    default: () => [],
  },
  filterColumnPosition: {
    type: Number,
  },
  selectedColumnRowsForFilter: {
    type: Object,
    default: () => [],
  },
  columnType: {
    type: String,
    default: () => 'string',
  },
});

const emit = defineEmits(["close", "sort", "applyFilter", "removeFilter"]);

const selectedValue = ref<string | number | null>(null);

const search = ref<string>("");

const selectedRows = ref(new Set(props.selectedColumnRowsForFilter[props.filterColumnPosition] || []));

const customFilterData = ref(new Set(props.selectedColumnRowsForFilter[props.filterColumnPosition] || []));

const showCustomFilter = ref<Boolean>(false);

const activeTab = ref<string>('basic');

const isFiltered = computed(() => search.value.trim().length > 0);

const filteredSortedUniqueValueList = computed(() => [...new Set(props.filterColumnsRows)].filter((item) => item?.toString()?.startsWith(search.value)));

const hidePanel = () => {
  emit("close");
};

const sort = (direction: number) => {
  emit("sort", direction, props.filterColumnPosition);
  hidePanel();
};

const isAllSelected = computed(() => {
  return (
    filteredSortedUniqueValueList.value.length > 0 &&
    filteredSortedUniqueValueList.value.every((item) => selectedRows.value.has(item))
  );
});

const toggleSelection = (item: string | number) => {
  if (selectedRows.value.has(item)) {
    selectedRows.value.delete(item);
  } else {
    selectedRows.value.add(item);
  }
};

const toggleSelectAll = (value: boolean) => {
  if (value) {
    filteredSortedUniqueValueList.value.forEach((item) => selectedRows.value.add(item));
  } else {
    filteredSortedUniqueValueList.value.forEach((item) => selectedRows.value.delete(item));
  }
};

const deleteFilter = () => {
  emit('removeFilter', props.filterColumnPosition);
  hidePanel();
};

const apply = () => {
  if (activeTab.value === 'basic') {
    emit("applyFilter", [...selectedRows.value], props.filterColumnPosition);
  } else {
    emit("applyFilter", customFilterData.value, props.filterColumnPosition);
  }
  hidePanel();
};

function compareValues(value: any, filterValue: string, filterType: string, dataType: string): boolean {
  switch (dataType) {
    case 'number':
      return compareNumbers(Number(value), Number(filterValue), filterType);
    case 'datetick':
      return compareDates(new Date(value), new Date(filterValue), filterType);
    case 'string':
      return compareStrings(value.toString(), filterValue.toString(), filterType);
    default:
      return false;
  }
}
function compareNumbers(value: number, filterValue: number, filterType: string): boolean {
  switch (filterType) {
    case 'equal': return value === filterValue;
    case 'greaterThan': return value > filterValue;
    case 'greaterThanOrEqualTo': return value >= filterValue;
    case 'lessThan': return value < filterValue;
    case 'lessThanOrEqualTo': return value <= filterValue;
    default: return false;
  }
}
function compareDates(value: Date, filterValue: Date, filterType: string): boolean {
  switch (filterType) {
    case 'equal': return value.getTime() === filterValue.getTime();
    case 'greaterThan': return value > filterValue;
    case 'greaterThanOrEqualTo': return value >= filterValue;
    case 'lessThan': return value < filterValue;
    case 'lessThanOrEqualTo': return value <= filterValue;
    default: return false;
  }
}
function compareStrings(value: string, filterValue: string, filterType: string): boolean {
  switch (filterType) {
    case 'equal': return value === filterValue;
    case 'exactMatch': return value.trim() === filterValue.trim();
    case 'notMatch': return value.trim() !== filterValue.trim();
    case 'regularExpression': return new RegExp(filterValue).test(value);
    default: return false;
  }
}

function filterFunction(item: any, filterType: string, filterValue: string): boolean {
  return compareValues(item, filterValue, filterType, props.columnType);
}

const applyCustomFilter = (filterData) => {
  const {
    filterType1,
    filterValue1,
    logicalOperator,
    filterType2,
    filterValue2
  } = filterData;

  let filteredData: string[] = props.filterColumnsRows;

  if (filterValue1) {
    filteredData = filteredData.filter((item) => filterFunction(item, filterType1, filterValue1));
  }

  if (filterValue2) {
    filteredData = filteredData.filter((item) => filterFunction(item, filterType2, filterValue2));
  }

  if (logicalOperator === 'AND' && filterValue1 && filterValue2) {
    filteredData = filteredData.filter((item) => {
      return (
        filterFunction(item, filterType1, filterValue1) || filterFunction(item, filterType2, filterValue2)
      )
    });
  }

  if (logicalOperator === 'OR' && filterValue1 && filterValue2) {
    filteredData = filteredData.filter((item) => {
      return (
        filterFunction(item, filterType1, filterValue1) || filterFunction(item, filterType2, filterValue2)
      )
    });
  }

  console.log(filteredData);

  customFilterData.value = filteredData;
}

watch(() => props.show, () => {
  selectedRows.value = new Set(props.selectedColumnRowsForFilter[props.filterColumnPosition] || []);
});

</script>

<style scoped lang="scss">
$tableBaseColor: #009639;
$cellAnomalyColor: rgba(237, 110, 28, 0.5);
$textBaseFontSize: 10px;
$borderColor: #ced4da;
$hoverBgColor: rgba(0, 216, 83, 0.26);

.panel {
  &-content {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 0.5rem;
    white-space: nowrap;
    flex-wrap: wrap;
    min-height: 20rem;
  }
  &-action {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 0.5rem;
    white-space: nowrap;
    flex-wrap: wrap;
  }

  &-list {
    width: 100%;
    overflow-y: auto;
    max-height: 20rem;
    min-height: 15rem;
    border: 1px solid $borderColor;
    border-radius: 0.25rem;
    display: flex;
    flex-direction: column;

    &__item {
      padding: 10px;
      font-size: 0.88rem;
      cursor: pointer;
      white-space: nowrap;
      display: flex;
      align-items: center;
      gap: 10px;
      &:hover {
        background-color: $hoverBgColor;
      }
      &:not(:last-child) {
        border-bottom: 1px solid lightgray;
      }
    }

    &__text {
      color: gray;
    }
  }

  &-btn {
    width: 40%;
  }
}

.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.list-leave-active {
  position: absolute;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

input[type="checkbox"] {
  accent-color: $tableBaseColor;
}
</style>