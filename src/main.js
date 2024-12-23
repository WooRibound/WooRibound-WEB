// main.js
import { createApp } from 'vue';
import App from './App.vue';
import MainCss from '@/assets/css/main.css';
import router from '@/router';
import { createPinia } from 'pinia';
import { createPersistedState } from 'pinia-plugin-persistedstate';

const pinia = createPinia();

// Pinia에 플러그인을 적용하여 로컬 스토리지에 자동 저장
pinia.use(createPersistedState({
    storage: localStorage,
}));

const app = createApp(App);
app
.use(router)
.use(MainCss)
.use(pinia)
.mount('#app');
