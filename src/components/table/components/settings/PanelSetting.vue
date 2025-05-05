<template>
  <ExcelModal
    class="table-settings"
    :show="show"
    @close="closePanel"
    :header="localizedLabel.tableSetting"
    :localizedLabel="localizedLabel"
  >
    <template #content>
      <div class="table-settings__content">
        <ExcelTabs
          :tabs="availableTabs"
          v-model="activeTab"
        />
        <component
          :is="currentTabComponent"
          v-model:fields="localFields"
          v-model:exportSettings="exportSettings"
          :localizedLabel="localizedLabel"
        />
      </div>
    </template>

    <template #actions>
        <ExcelButton 
          class="table-settings__button" 
          :label="localizedLabel.back" 
          @click="closePanel"
        />
        <ExcelButton 
          v-if="activeTab === 'settings'"
          class="table-settings__button" 
          :label="localizedLabel.apply" 
          @click="applyChanges"
        />
        <ExcelButton
          v-if="activeTab === 'export'"
          class="table-settings__button" 
          :label="localizedLabel.exportExcel" 
          @click="exportTable"
        />
        <ExcelButton
          v-if="activeTab === 'import'"
          class="table-settings__button" 
          :label="localizedLabel.importExcel" 
          @click="importTable"
        />
    </template>
  </ExcelModal>
</template>

<script setup lang="ts">
import { ref, computed, watch} from 'vue'
import cloneDeep from 'lodash/cloneDeep'
import ExcelModal from "../ui/ExcelModal.vue"
import ExcelButton from '../ui/ExcelButton.vue'
import ExcelTabs from '../ui/ExcelTabs.vue'
import ImportExcel from './ImportExcel.vue'
import ExportExcel from './ExportExcel.vue'
import SettingsList from './SettingsList.vue'

type TabKey = 'settings' | 'export' | 'import';

const props = defineProps({
  modelValue: Array,
  localizedLabel: {
    type: Object,
    required: true
  },
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits([
  "update:modelValue",
  "resetColumn",
  "calStickyLeft",
  "export",
  "import",
  "close"
])

const localFields = ref([]);

const exportSettings = ref({
  fileName: 'report',
})

watch(
  () => props.modelValue,
  (newVal) => {
    localFields.value = cloneDeep(newVal)
  },
  { immediate: true }
)

const activeTab = ref<TabKey>('settings')

const availableTabs = computed(() => [
  { name: 'settings', label: props.localizedLabel.settings },
  { name: 'export', label: props.localizedLabel.exportExcel },
  { name: 'import', label: props.localizedLabel.importExcel }
])

const tabComponents = {
  settings: SettingsList,
  export: ExportExcel,
  import: ImportExcel
}

const currentTabComponent = computed(() => tabComponents[activeTab.value]);

const closePanel = () => emit("close");

const applyChanges = () => {
  emit("update:modelValue", localFields.value)
  emit("close")
}

const exportTable = () => {
  emit('export', exportSettings);
}

const importTable = () => {
  
}
</script>

<style scoped>
.table-settings__content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.table-settings__button {
  min-width: 100px;
}
</style>
