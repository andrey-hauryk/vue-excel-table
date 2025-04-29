<template>
  <div
    class="norecord"
    :style="{ bottom: noFooter ? '12px' : '37px' }"
  >
    <span> {{ localizedLabel.noRecordIndicator }}</span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
    localizedLabel: {
        type: Object,
    },
    table: {
        type: Array,
    },
    noFooter: {
        type: Boolean,
    }
});

</script>

<script scoped lang="scss"></script>