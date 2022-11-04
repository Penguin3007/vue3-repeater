<script setup lang="ts">
import {
  defineProps,
  defineEmits,
  onMounted,
  onBeforeUnmount,
  ref,
  reactive,
} from "vue";
import { cloneDeep } from "lodash";
import RepeaterBlock from "./RepeaterBlock.vue";
import RepeaterDropZone from "./RepeaterDropZone.vue";

const props = defineProps<{
  modelValue: Array<{
    name: string;
    value: object;
    defaultValue?: object;
    active?: boolean;
  }>;
}>();
const emit = defineEmits<{
  (
    event: "update:modelValue",
    payload: Array<{
      name: string;
      value: object;
      defaultValue: object;
      active?: boolean;
    }>
  ): void;
}>();

const repeater = ref();

const data = reactive({
  pFields: props.modelValue.map((el) => ({
    ...el,
    defaultValue: cloneDeep(el.value),
  })),
  entered: -1,
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
const setFields = (
  newFields: Array<{
    name: string;
    value: object;
    defaultValue: object;
    active?: boolean;
  }>
): void => {
  data.pFields = newFields;
  emit("update:modelValue", data.pFields);
};
const add = (
  index: number,
  field: { name: string; value: object; defaultValue: object; active?: boolean }
): void => {
  const newFields = cloneDeep(data.pFields);
  const newField = cloneDeep(field);
  newField.value = newField.defaultValue;
  newField.active = false;
  newFields.splice(index, 0, newField);
  setFields(newFields);
};
const remove = (index: number) => {
  const newFields = cloneDeep(data.pFields);
  newFields.splice(index, 1);
  setFields(newFields);
};
const duplicate = (
  index: number,
  field: { name: string; value: object; defaultValue: object; active?: boolean }
) => {
  const newFields = cloneDeep(data.pFields);
  const newField = cloneDeep(field);
  newField.active = false;
  newFields.splice(index, 0, newField);
  setFields(newFields);
};
const move = (from: string, to: number) => {
  const fromIndex = parseInt(from, 10) || 0;
  const newFields = cloneDeep(data.pFields);
  let el = newFields.splice(fromIndex, 1);
  newFields.splice(to, 0, el[0]);
  setFields(newFields);
  data.entered = -1;
};
const deactivate = () => {
  const newFields = cloneDeep(data.pFields).map(
    (el: {
      name: string;
      value: object;
      defaultValue: object;
      active?: boolean;
    }) => ({
      ...el,
      active: false,
    })
  );
  setFields(newFields);
};
const activate = (index: number) => {
  deactivate();
  const newFields: Array<{
    name: string;
    value: object;
    defaultValue: object;
    active?: boolean;
  }> = cloneDeep(data.pFields);
  newFields[index].active = true;
  setFields(newFields);
};
const dragEnd = ($event: { y: number; dataTransfer: DataTransfer }) => {
  const { y } = $event;
  const { bottom } = repeater.value.getBoundingClientRect();
  const from = $event.dataTransfer.getData("index");
  const to = data.pFields.length - 1;
  if (y > bottom) {
    move(from, to);
  }
};
</script>

<template>
  <div @click.stop="" class="repeater" ref="repeater">
    <repeater-drop-zone
      v-for="(field, index) in data.pFields"
      @drop="move($event.dataTransfer.getData('index'), index)"
      @dragEnter="data.entered = index"
      :class="{
        entered: data.entered === index,
      }"
      :key="field.name + index"
    >
      <repeater-block
        @dragStart="$event.dataTransfer.setData('index', index)"
        @dragEnd="dragEnd"
        @add="add(index, field)"
        @remove="remove(index)"
        @duplicate="duplicate(index, field)"
        @up="move(index, index - 1)"
        @down="move(index, index + 1)"
        @click="activate(index)"
        :class="{
          active: field.active,
        }"
        :isFirst="index === 0"
        :isLast="index === data.pFields.length - 1"
      >
        <component :is="field.name" v-model="field.value"></component>
      </repeater-block>
    </repeater-drop-zone>
  </div>
</template>
