<template>
  <Modal
    :show="show"
    @close="hidePanel"
    :header="localizedLabel.tableSetting"
    :localizedLabel="localizedLabel"
  >
    <template #content>
      <div class="panel-action">
        <ExcelButton
          class="btn"
          :label="localizedLabel.exportExcel"
          @click="exportTable('excel')"
        ></ExcelButton>
        <ExcelButton
          class="btn"
          :label="localizedLabel.importExcel"
          @click="importTable"
        ></ExcelButton>
      </div>
      <div class="panel-list">
        <transition-group name="list" tag="div">
          <draggable
            v-model="fields"
            draggable=".panel-list-item"
            :item-key="getKey"
          >
            <template #item="{ element }">
              <div class="panel-list-item" @click="columnLabelClick(element)">
                <input
                  type="checkbox"
                  v-model="element.invisible"
                  class="panel-checkbox"
                  :true-value="false"
                  :false-value="true"
                  @click.stop
                />
                <span>{{ element.label }}</span>
              </div>
            </template>
          </draggable>
        </transition-group>
      </div>
    </template>
    <template #actions>
      <ExcelButton
          class="btn"
          :label="localizedLabel.back"
          @click="hidePanel"
        ></ExcelButton>
    </template>
  </Modal>
</template>
<script setup lang="ts">
import { ref, computed } from "vue";
import Modal from "../Modal.vue";
import draggable from "vuedraggable/src/vuedraggable";
import ExcelButton from '../ExcelButton.vue';

const props = defineProps({
  modelValue: Array,
  localizedLabel: {
    type: Object,
  },
  show: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits([
  "update:modelValue",
  "resetColumn",
  "calStickyLeft",
  "export",
  "import",
  "close",
]);

const fields = computed({
  get() {
    return props.modelValue;
  },
  set(newValue) {
    emit("update:modelValue", newValue);
  },
});

const reset = () => {
  emit("resetColumn");
  hidePanel();
};

const columnLabelClick = (item: any) => {
  item.invisible = !item.invisible;
  emit("calStickyLeft");
};

const exportTable = (format: string) => {
  hidePanel();
  emit("export", format);
};

const importTable = () => {
  hidePanel();
  emit("import");
};

const hidePanel = () => {
  emit("close");
};

</script>
<style scoped lang="scss">
.panel-action {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  width: 100%;
  position: relative;
  white-space: nowrap;
}
.panel-list {
  overflow-y: scroll;
  max-height: 20rem;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  display: flex;
  flex-direction: column;
}
.panel-checkbox {
  background-color: #009639;
  vertical-align: 2px;
}
input[type="checkbox"] {
  accent-color: #009639;
}
.panel-list span {
  margin-left: 10px;
  color: gray;
}
.panel-list-item {
  padding: 10px 10px;
  font-size: 0.88rem;
  cursor: pointer;
}
.panel-list-item:hover {
  background-color: #00d85342;
}
.panel-list-item:not(:last-child) {
  border-bottom: 1px solid lightgray;
}

.btn {
  width: 45%;
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
</style>