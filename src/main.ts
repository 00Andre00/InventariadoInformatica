// src/main.ts
import { createApp } from 'vue'
import App from './App.vue'
import router from './routes'
import './assets/main.css'
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

// Importar Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// Importar servicio de autenticación e interceptores
import authService from './services/authService'
import './interceptors/axios'

library.add(fas)

// Inicializar el servicio de autenticación
authService.init()

const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon)
app.use(ElementPlus) // ¡FALTABA ESTA LÍNEA!
app.use(router)
app.mount('#app')