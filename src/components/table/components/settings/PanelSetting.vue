<template>
  <Modal
    class="settings__modal"
    :show="show"
    @close="hidePanel"
    :header="localizedLabel.tableSetting"
    :localizedLabel="localizedLabel"
  >
    <template #content>
      <div class="settings__content">
        <Tabs
          :tabs="availableTabs"
          v-model="activeTab"
        />
        <component
          :is="currentTabComponent"
          :localizedLabel="localizedLabel"
        />
      </div>
    </template>

    <template #actions>
      <div class="settings-actions">
        <ExcelButton 
          class="panel-btn" 
          :label="localizedLabel.back" 
          @click="hidePanel"
        />
        <ExcelButton 
          class="panel-btn" 
          :label="localizedLabel.apply" 
        />
      </div>
    </template>
  </Modal>
</template>


<script setup lang="ts">
import { ref, computed } from 'vue'
import Modal from "../Modal.vue"
import ExcelButton from '../ExcelButton.vue'
import Tabs from '../Tabs.vue'
import ImportExcel from './ImportExcel.vue'
import ExportExcel from './ExportExcel.vue'
import SettingsList from './SettingsList.vue'

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

type TabKey = 'settings' | 'export' | 'import'

const activeTab = ref<TabKey>('settings');

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

const currentTabComponent = computed(() => tabComponents[activeTab.value])

const hidePanel = () => {
  emit("close")
}
</script>
