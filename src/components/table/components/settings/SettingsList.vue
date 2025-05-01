<template>
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

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";
import draggable from "vuedraggable/src/vuedraggable";

const props = defineProps({
  fields: Array,
  getKey: Function,
});

const emit = defineEmits(["update:fields", "calStickyLeft"]);

const columnLabelClick = (item: any) => {
  item.invisible = !item.invisible;
  emit("calStickyLeft");
};

const fields = props.fields;
const getKey = props.getKey;
</script>

<style scoped lang="scss">
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
</style>
