<script setup lang="ts">
import { defineEmits } from "vue";

const emit = defineEmits<{
  (event: "drop", payload: Event): void;
  (event: "dragEnter", payload: Event): void;
}>();
</script>

<template>
  <div
    @dragover.prevent=""
    @drop="emit('drop', $event)"
    @dragenter="emit('dragEnter', $event)"
    class="repeater-drop-zone"
  >
    <slot></slot>
  </div>
</template>

<style scoped lang="scss">
.entered {
  box-shadow: inset 0 3px 0 0 #409eff;
}

.repeater-drop-zone {
  padding-top: 8px;
}
</style>
