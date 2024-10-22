import { createHead } from '@vueuse/head';
import { createPinia } from 'pinia';
import { registerSW } from 'virtual:pwa-register';
import { createApp } from 'vue';
import App from './App.vue';
import { naive } from './plugins/naive.plugin';
import { plausible } from './plugins/plausible.plugin';
import router from './router';
import 'virtual:uno.css';

registerSW();

const app = createApp(App);

app.use(createPinia());
app.use(createHead());
app.use(router);
app.use(naive);
app.use(plausible);

app.mount('#app');
