import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './routes';
import './assets/main.css';


createApp(App)
  .use(router)  // Usamos Vue Router aquí
  .mount('#app');