<template>
  <div class="custom-filter">
    <div class="filter-group">
      <DropDownButton v-model="filterType1" :items="filteredFilterOptions" class="dropdown" />
      <input type="text" v-model="filterValue1" class="filter-input" :placeholder="localizedLabel.enterValue" />
    </div>
    <div class="filter-group-logic-operator-container">
      <DropDownButton v-model="logicalOperator" :items="logicalOptions" class="logic-operator" />
    </div>
    <div class="filter-group">
      <DropDownButton v-model="filterType2" :items="filteredFilterOptions" class="dropdown" />
      <input type="text" v-model="filterValue2" class="filter-input" :placeholder="localizedLabel.enterValue" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, watch } from "vue";
import DropDownButton from "./DropDownButton.vue";
import DatePicker from '@vuepic/vue-datepicker';

const props = defineProps<{
  localizedLabel: Record<string, string>;
  columnType: String;
}>();

const emit = defineEmits(['applyCustomFilter']);

const filterType1 = ref();
const filterValue1 = ref("");
const logicalOperator = ref(props.localizedLabel.filterAndText);
const filterType2 = ref();
const filterValue2 = ref("");

const allFilterOptions = computed(() => [
  { value: "equal", name: props.localizedLabel.near },
  { value: "exactMatch", name: props.localizedLabel.exactMatch },
  { value: "notMatch", name: props.localizedLabel.notMatch },
  { value: "greaterThan", name: props.localizedLabel.greaterThan },
  { value: "greaterThanOrEqualTo", name: props.localizedLabel.greaterThanOrEqualTo },
  { value: "lessThan", name: props.localizedLabel.lessThan },
  { value: "lessThanOrEqualTo", name: props.localizedLabel.lessThanOrEqualTo },
  { value: "regularExpression", name: props.localizedLabel.regularExpression },
]);

const filteredFilterOptions = computed(() => {
  if (props.columnType === 'number') {
    return allFilterOptions.value.filter(option =>
      ['equal', 'greaterThan', 'greaterThanOrEqualTo', 'lessThan', 'lessThanOrEqualTo'].includes(option.value)
    );
  } else if (props.columnType === 'string') {
    return allFilterOptions.value.filter(option =>
      ['equal', 'exactMatch', 'notMatch', 'regularExpression'].includes(option.value)
    );
  } else if (props.columnType === 'datetick') {
    return allFilterOptions.value.filter(option =>
      ['equal', 'greaterThan', 'greaterThanOrEqualTo', 'lessThan', 'lessThanOrEqualTo'].includes(option.value)
    );
  } else {
    return allFilterOptions.value;
  }
});

const logicalOptions = [
  { value: "AND", name: props.localizedLabel.filterAndText },
  { value: "OR", name: props.localizedLabel.filterOrText },
];

watch([filterType1, filterValue1, logicalOperator, filterType2, filterValue2], () => {
  emit("applyCustomFilter", {
    filterType1: filterType1.value,
    filterValue1: filterValue1.value,
    logicalOperator: logicalOperator.value,
    filterType2: filterType2.value,
    filterValue2: filterValue2.value,
  });
});

</script>

<style scoped lang="scss">
.custom-filter {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #fff;
  transition: all 0.3s ease-in-out;
}
.filter-group {
  display: flex;
  gap: 10px;
  align-items: center;
}
.filter-input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.2s ease-in-out;
  &:focus {
    border-color: #009639;
    outline: none;
  }
}
.dropdown {
  width: 50%;
  min-width: 180px;
}
.logic-operator {
  width: 10%;
  text-align: center;
}

.filter-group-logic-operator-container {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>