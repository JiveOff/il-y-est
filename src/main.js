import Vue from "vue";
import App from "./App.vue";

import "./plugins/vue2-leaflet";

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { ToggleButton } from "vue-js-toggle-button";

Vue.component("toggle-button", ToggleButton);
Vue.component("font-awesome-icon", FontAwesomeIcon);

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount("#app");
