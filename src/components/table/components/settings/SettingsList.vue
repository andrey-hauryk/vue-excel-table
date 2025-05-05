<template>
  <div class="panel-list">
    <transition-group name="list" tag="div">
      <draggable
        v-model="localFields"
        @change="onDragChange"
        draggable=".panel-list-item"
        item-key="name"
      >
        <template #item="{ element }">
          <div class="panel-list-item" @click="toggleVisibility(element)">
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
import {ref, watch} from "vue";
import draggable from "vuedraggable/src/vuedraggable";

const props = defineProps({
  fields: Array,
});

const emit = defineEmits<{
  (e: 'update:fields', value: Array<any>): void;
}>();

const toggleVisibility = (item: any) => {
  item.invisible = !item.invisible;
  emit('update:fields', localFields.value);
};

const localFields = ref([...props.fields]); //not deep copy

watch(
  () => props.fields,
  (newFields) => {
    localFields.value = [...newFields];
  }
);

const onDragChange = () => {
  emit('update:fields', localFields.value);
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