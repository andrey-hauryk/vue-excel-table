<template>
  <div class="panel-tabs">
    <div
      v-for="tab in tabs"
      :key="tab.name"
      class="panel-tab"
      :class="{ active: activeTab === tab.name }"
      @click="setActiveTab(tab.name)"
    >
    <transition name="tab-transition">
        <span class="tab-label">{{ tab.label }}</span>
    </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from "vue";
const props = defineProps({
  tabs: {
    type: Array,
    required: true,
  },
  modelValue: {
    type: String,
    required: true,
  },
});
const emit = defineEmits(["update:modelValue"]);
const activeTab = ref(props.modelValue);
const setActiveTab = (tabName: string) => {
  activeTab.value = tabName;
  emit("update:modelValue", tabName);
};
</script>

<style scoped lang="scss">
$borderColor: #ced4da;
$tableBaseColor: #009639;
.panel-tabs {
  display: flex;
  width: 100%;
  margin-bottom: 1rem;
}
.panel-tab {
  padding: 10px 15px;
  width: 100%;
  text-align: center;
  cursor: pointer;
  border: 1px solid $borderColor;
  border-bottom: none;
  background-color: #f8f9fa;
  &:first-child {
    border-top-left-radius: 0.25rem;
    border-right: none;
  }
  &:last-child {
    border-top-right-radius: 0.25rem;
    border-left: none;
  }
  &.active {
    background-color: $tableBaseColor;
    color: white;
    border-bottom: 1px solid white;
  }
}

.tab-transition-enter-active,
.tab-transition-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.tab-transition-enter-from,
.tab-transition-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
.tab-label {
  display: inline-block;
}
</style>