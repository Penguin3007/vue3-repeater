# vue3-repeater

The Vue 3 repeater component allows you to create a set of subcomponents which can be repeated again and again!

This components is based on [VueJs Repeater](https://github.com/theguriev/vue-repeater)

## Install

`npm i @penguin3007/vue3-repeater`

## How it works

### Start
![Start](https://raw.githubusercontent.com/gcofficial/vue-repeater/master/gifs/start.gif)

### Reordering
![Reordering](https://raw.githubusercontent.com/gcofficial/vue-repeater/master/gifs/reordering.gif)

### Add
![Add](https://raw.githubusercontent.com/gcofficial/vue-repeater/master/gifs/add.gif)

### Remove
![Remove](https://raw.githubusercontent.com/gcofficial/vue-repeater/master/gifs/remove.gif)

### Duplicate
![Duplicate](https://raw.githubusercontent.com/gcofficial/vue-repeater/master/gifs/duplicate.gif)

## Usage
### Basic example

**./main.js** - entry point
```javascript
import { createApp } from 'vue';
import AddressComponent from './components/AddressComponent';
import App from './App';

const app = createApp(App);
app.component('address-component', AddressComponent);
app.mount('#app');
```

**./components/Address.vue** - Component inside repeater
```vue
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
import {defineProps, defineEmits, computed} from 'vue';

const emit = defineEmits<{
    (event: 'input', payload: object): void
}>()

const props = defineProps<{
    modelValue: object
}>();

const localAddress = computed({
    get: () => props.modelValue,
    set: (value: object) => {
        emit('input', value)
    }
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
    border: 1px solid #DCDFE6;
}
</style>
```


**./App.vue** - application component
```vue
<script setup lang="ts">
  import {ref} from "vue";
  import VueRepeater from '@penguin3007/vue3-repeater';

  const fields = ref([{name: 'address-component', value: {street: '', city: '', zip: ''}}])
</script>

<template>
  {{ fields }}
  <vue-repeater v-model="fields" />
</template>
```
