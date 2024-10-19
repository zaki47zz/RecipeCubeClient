import './assets/css/main.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue';
import router from './router';
import SoftUIDashboard from './soft-ui-dashboard';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(SoftUIDashboard);
app.use(ElementPlus);
app.component('EasyDataTable', Vue3EasyDataTable);
app.mount('#app');
