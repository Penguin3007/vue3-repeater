<template>
  {{ fields }}
  <vue-repeater v-model="fields" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import VueRepeater from "/src/index";

const fields = ref<Array<{ name: string; value: object }>>([
  { name: "address-component", value: { street: "", city: "", zip: "" } },
]);
</script>
