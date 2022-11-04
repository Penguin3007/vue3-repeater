import { createApp } from "vue";
import AddressComponent from "./components/AddressComponent.vue";
import DemoComponent from "./DemoComponent.vue";

const app = createApp(DemoComponent);
app.component("address-component", AddressComponent);
app.mount("#app");
