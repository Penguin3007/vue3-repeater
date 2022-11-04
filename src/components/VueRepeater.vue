<script setup lang="ts">
import {
  defineProps,
  defineEmits,
  onMounted,
  onBeforeUnmount,
  ref,
  reactive,
  computed,
} from "vue";
import type { FieldType } from "@/types/Field";
import { cloneDeep } from "lodash";
import RepeaterBlock from "./RepeaterBlock.vue";
import RepeaterDropZone from "./RepeaterDropZone.vue";

const props = defineProps<{
  modelValue: Array<FieldType>;
}>();
const emit = defineEmits<{
  (event: "update:modelValue", payload: Array<FieldType>): void;
}>();

const repeater = ref();

const data = reactive<{
  defaults: { [key: string]: FieldType };
  entered: number;
}>({
  defaults: {
    key: {
      name: "",
      value: {},
      active: false,
    },
  },
  entered: -1,
});

const fields = computed({
  get: (): Array<FieldType> => props.modelValue,
  set: (value: Array<FieldType>): void => {
    emit("update:modelValue", value);
  },
});

/**
 * Generate default value object for each field from modelValue
 */
fields.value.forEach((field: FieldType) => {
  Object.assign(data.defaults, { [field.name]: cloneDeep(field.value) });
});

onMounted(() => {
  document.body.addEventListener("click", clickOutside);
});
onBeforeUnmount(() => {
  document.body.removeEventListener("click", clickOutside);
});

const clickOutside = (): void => {
  deactivate();
};

const add = (index: number, field: FieldType): void => {
  fields.value.splice(index + 1, 0, {
    name: field.name,
    value: data.defaults[field.name],
    active: false,
  });
};
const remove = (index: number) => {
  fields.value.splice(index, 1);
};
const duplicate = (index: number, field: FieldType) => {
  fields.value.splice(index, 0, cloneDeep(field));
};
const move = (from: string, to: number) => {
  const fromIndex = parseInt(from, 10) || 0;
  const el = fields.value.splice(fromIndex, 1);
  fields.value.splice(to, 0, el[0]);
  data.entered = -1;
};
const deactivate = () => {
  fields.value.forEach((el: FieldType) => {
    el.active = false;
  });
};
const activate = (index: number) => {
  deactivate();
  fields.value[index].active = true;
};
const dragStart = ($event: DragEvent, index: number) => {
  if ($event.dataTransfer) {
    $event.dataTransfer.setData("index", String(index));
  }
};
const dragEnd = ($event: DragEvent) => {
  if ($event.target && $event.dataTransfer) {
    const target = $event.target as HTMLDivElement;
    const { y } = $event;
    const { bottom } = target.getBoundingClientRect();
    const from = $event.dataTransfer.getData("index");
    const to = fields.value.length - 1;
    if (y > bottom) {
      move(from, to);
    }
  }
};
const drop = ($event: any, index: number) => {
  if ($event.dataTransfer) {
    move($event.dataTransfer.getData("index"), index);
  }
};
</script>

<template>
  <div @click.prevent="" class="repeater" ref="repeater">
    <repeater-drop-zone
      v-for="(field, index) in fields"
      @drop="drop($event, index)"
      @dragEnter="data.entered = index"
      :class="{
        entered: data.entered === index,
      }"
      :key="field.name + index"
    >
      <repeater-block
        @dragStart="dragStart($event, index)"
        @dragEnd="dragEnd"
        @add="add(index, field)"
        @remove="remove(index)"
        @duplicate="duplicate(index, field)"
        @up="move(String(index), index - 1)"
        @down="move(String(index), index + 1)"
        @click="activate(index)"
        :class="{
          active: field.active,
        }"
        :isFirst="index === 0"
        :isLast="index === fields.length - 1"
      >
        <component :is="field.name" v-model="field.value"></component>
      </repeater-block>
    </repeater-drop-zone>
  </div>
</template>
