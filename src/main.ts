import Vue from "vue";
import App from "./App.vue";
import { store } from "./store/index.vuex";

import { BootstrapVue } from "bootstrap-vue";

import "./style/style.scss";

Vue.use(BootstrapVue);

Vue.config.productionTip = false;

new Vue({
  store,
  render: (h) => h(App),
}).$mount("#app");
