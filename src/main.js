import './assets/css/main.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import Vue3EasyDataTable from 'vue3-easy-data-table';
import 'vue3-easy-data-table/dist/style.css';
import App from './App.vue';
import router from './router';
import SoftUIDashboard from './soft-ui-dashboard';
// 引入 vue3-perfect-scrollbar
import { PerfectScrollbarPlugin } from 'vue3-perfect-scrollbar';
import 'vue3-perfect-scrollbar/style.css';

// 引入 vue-smooth-scroll
import vueSmoothScroll from 'vue-smooth-scroll';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(SoftUIDashboard);
app.use(ElementPlus);
app.component('EasyDataTable', Vue3EasyDataTable);
app.use(PerfectScrollbarPlugin);
app.use(vueSmoothScroll);
app.mount('#app');
