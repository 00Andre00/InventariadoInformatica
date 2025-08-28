// src/main.ts
import { createApp } from 'vue'
import App from './App.vue'
import router from './routes'
import './assets/main.css'

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

createApp(App)
  .component('font-awesome-icon', FontAwesomeIcon)
  .use(router)
  .mount('#app')