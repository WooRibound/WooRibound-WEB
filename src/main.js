import { createApp } from 'vue'
import App from './App.vue'
import MainCss from '@/assets/css/main.css'
import router from '@/router';
import { createPinia } from 'pinia';

const pinia = createPinia();
const app = createApp(App);
    app
    .use(router)
    .use(MainCss)
    .use(pinia)
    .mount('#app');