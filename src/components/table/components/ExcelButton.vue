<template>
  <button class="panel-button" @click="handleClick">
    <span>{{ label }}</span>
  </button>
</template>

<script setup lang="ts">
const props = defineProps<{
  label: string;
}>();

const emit = defineEmits<{
  (e: "click"): void;
}>();

const handleClick = () => {
  emit("click");
};
</script>
<style scoped lang="scss">
$primaryColor: #009639;
$hoverColor: #007a2f;
$borderRadius: 5px;
.panel-button {
  width: 100%;
  font-size: 0.88rem;
  border-radius: $borderRadius;
  border: none;
  background-color: $primaryColor;
  color: white;
  padding: 0.6rem;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.1s ease,
  box-shadow 0.2s ease;
  position: relative;
  overflow: hidden;
  &:hover {
    background-color: $hoverColor;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    transform: translateY(-2px);
  }
  &:active {
    transform: translateY(0);
    box-shadow: none;
  }
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba($primaryColor, 0.4);
  }
  &::after {
    content: "";
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    pointer-events: none;
    background-image: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.3) 10%,
      transparent 10.01%
    );
    background-repeat: no-repeat;
    background-position: 50%;
    transform: scale(10, 10);
    opacity: 0;
    transition: transform 0.5s, opacity 1s;
  }
  &:active::after {
    transform: scale(0, 0);
    opacity: 0.3;
    transition: 0s;
  }
}
</style>