<template>
  <div class="address">
    <div class="row">
      <label>Street</label>
      <input v-model="localAddress.street" />
    </div>
    <div class="row">
      <label>City</label>
      <input v-model="localAddress.city" />
    </div>
    <div class="row">
      <label>Zip</label>
      <input v-model="localAddress.zip" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineProps, defineEmits, computed } from "vue";

const emit = defineEmits<{
  (event: "input", payload: object): void;
}>();

const props = defineProps<{
  modelValue: object;
}>();

const localAddress = computed({
  get: () => props.modelValue,
  set: (value: object) => {
    emit("input", value);
  },
});
</script>

<style scoped lang="scss">
.address {
  display: flex;
  flex-direction: column;
}

.row {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
}

label {
  text-align: left;
  margin-bottom: 4px;
}

input {
  height: 32px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
}
</style>
