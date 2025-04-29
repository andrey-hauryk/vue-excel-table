<template>
  <div class="dropdown" ref="dropdownRef">
    <button @click.stop="toggleDropdown" class="dropdown-button">
      {{ selectedItemName }}
      <span class="arrow" :class="{ open: isOpen }">▼</span>
    </button>
    <transition name="dropdown-transition">
      <div v-if="isOpen" class="dropdown-menu">
        <ul class="dropdown-list">
          <li
            v-for="(item, index) in items"
            :key="index"
            @click="selectItem(item)"
            class="dropdown-item"
          >
            {{ item.name }}
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";

interface Item {
  value: string;
  name: string;
}

const props = defineProps<{
  items: Item[];
  modelValue: string;
}>();

const emit = defineEmits(["update:modelValue", "change"]);
const isOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
};

const selectedItemName = computed(() => {
  const selectedItem = props.items.find((item) => item.value === props.modelValue);
  return selectedItem ? selectedItem.name : "Выбрать";
});

const selectItem = (item: Item) => {
  emit("update:modelValue", item.value);
  emit("change", item.value);
  isOpen.value = false;
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});

</script>
<style scoped lang="scss">
$primaryColor: #009639;
$borderRadius: 8px;
$shadow: 0 4px 10px rgba(0, 0, 0, 0.15);

.dropdown {
  position: relative;
  display: inline-block;
  width: 100%;
  &-button {
    width: 100%;
    font-size: 0.9rem;
    font-weight: 500;
    border-radius: $borderRadius;
    border: 1px solid #ccc;
    background-color: white;
    color: #333;
    padding: 10px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all 0.2s ease-in-out;
    &:hover {
      background-color: #f5f5f5;
    }
  }
  &-menu {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background: white;
    border: 1px solid #ccc;
    border-radius: $borderRadius;
    box-shadow: $shadow;
    z-index: 10;
    overflow: auto;
    // max-height: 150px
  }
  &-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  &-item {
    padding: 12px;
    cursor: pointer;
    font-size: 14px;
    transition: background 0.2s ease-in-out;
    &:hover {
      background: $primaryColor;
      color: white;
    }
  }
}

.arrow {
  transition: transform 0.2s ease-in-out;
  font-size: 0.7rem;
}
.arrow.open {
  transform: rotate(180deg);
}

.dropdown-transition-enter-active,
.dropdown-transition-leave-active {
  transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out, max-height 0.3s ease-in-out;
  overflow: hidden;
}
.dropdown-transition-enter-from {
  opacity: 0;
  transform: translateY(-10px);
  max-height: 0;
}
.dropdown-transition-leave-to {
  opacity: 0;
  transform: translateY(-10px);
  max-height: 0;
}
.dropdown-transition-enter-to,
.dropdown-transition-leave-from {
  max-height: 300px;
}
</style>