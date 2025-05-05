<template>
  <ExcelModal
    :show="show"
    @close="hidePanel"
    :header="localizedLabel.findOnPage"
  >
    <template #content>
      <div class="content">
        <SearchInput v-model="inputFind" :localizedLabel="localizedLabel" @search="doFind" />
        <SearchButton @click="doFind" />
      </div>
    </template>
    <template #actions>
      <div></div>
    </template>
  </ExcelModal>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits, nextTick } from "vue";
import SearchInput from "./SearchInput.vue";
import ExcelModal from "../ui/ExcelModal.vue";
import SearchButton from './SearchButton.vue';

const props = defineProps<{ show: boolean, localizedLabel: any }>();
const emit = defineEmits(["doFind", "close"]);

const inputFind = ref("");

const clickOutside = (e: MouseEvent) => {
  if ((e.target as HTMLElement).id === "panelModal") {
    hidePanel();
  }
};

const doFind = () => {
  hidePanel();
  emit("doFind", inputFind.value);
};

const hidePanel = () => {
  emit("close");
};

watch(
  () => props.show,
  async (newValue) => {
    if (newValue) {
      await nextTick();
      document.getElementById("inputField")?.focus();
    }
  }
);
</script>

<style scoped lang="scss">
.content {
  display: flex;
}

</style>
