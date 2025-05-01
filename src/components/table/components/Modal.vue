<template>
<transition name="modal-fade">
  <div
    id="modal"
    v-show="show"
    class="modal"
    @click="clickOutside"
    @keydown.exact.esc="hideModal"
  >
    <div class="modal__body">
      <div class="modal__header">
        <span>{{ header }}</span>
      </div>
      <div class="modal__content">
        <slot name="content"></slot>
      </div>
      <div class="modal__actions">
        <slot name="actions">
          <button
            class="modal__button modal__button--cancel"
            @click="hideModal"
          >
            {{ localizedLabel.cancel }}
          </button>
          <button
            class="modal__button modal__button--confirm"
            @click="onConfirm"
          >
            {{ localizedLabel.confirm }}
          </button>
        </slot>
      </div>
    </div>
  </div>
  </transition>
</template>
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from "vue";

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  header: {
    type: String,
    default: "Modal Title",
  },
  localizedLabel: {
    type: Object,
  },
});

const emit = defineEmits(["close", "confirm"]);

const hideModal = (): void => {
  emit("close");
};

const clickOutside = (e: MouseEvent): void => {
  if ((e.target as HTMLElement).id === "modal") {
    hideModal();
  }
};

const onConfirm = (): void => {
  emit("confirm");
  hideModal();
};

const disableScroll = (): void => {
  document.body.style.overflow = "hidden";
};

const enableScroll = (): void => {
  document.body.style.overflow = "";
};

onMounted(() => {
  if (props.show) {
    disableScroll();
  }
});

onBeforeUnmount(() => {
  enableScroll();
});

watch(() => props.show, (newVal: boolean) => {
  if (newVal) {
    disableScroll();
  } else {
    enableScroll();
  }
}
);
</script>
<style scoped lang="scss">
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: #0007;
  z-index: 999;
  font-weight: 400;
  font-size: 1rem;
  text-shadow: none;
  &__body {
    background-color: white;
    position: fixed;
    border-radius: 5px;
    padding: 0;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 28rem;
    max-width: 75vh;
    min-width: 55vh;
    height: fit-content;
    max-height: 80vh;
    min-height: 35vh;
    display: flex;
    flex-direction: column;
    overflow: auto;
  }
  &__header {
    padding: 1rem;
    display: flex;
    color: dimgray;
    font-size: 1.25rem;
    line-height: 1.5rem;
    align-items: center;
    justify-content: flex-start;
    border-bottom: 1px solid lightgray;
  }
  &__close-button {
    background: none;
    border: none;
    font-size: 1.25rem;
    cursor: pointer;
  }
  &__content {
    padding: 1rem;
    text-align: left;
  }
  &__actions {
    display: flex;
    padding: 1rem;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    border-top: 1px solid lightgray;
  }
  &__button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  &__button--cancel {
    background-color: #ccc;
  }
  &__button--confirm {
    background-color: #28a745;
    color: white;
  }
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.modal-fade-enter-from {
  opacity: 1;
  transform:  scale(0.9);
}
.modal-fade-leave-to {
  opacity: 0;
  transform: scale(1.1);
}
</style>