import { createRouter, createWebHistory } from 'vue-router';
import EquiposList from '../components/EquiposList.vue';
import AgregarEquipo from '../components/AgregarEquipo.vue';
import EditarEquipo from '../components/EditarEquipo.vue';
import ListaDispositivos from '../components/ListaDispositivos.vue'; // Importar lista de dispositivos
import AgregarDispositivo from '../components/AgregarDispositivo.vue'; // Importar agregar dispositivo
import EditarDispositivo from '../components/EditarDispositivo.vue'; // Importar editar dispositivo
import ListaImpresoras from '../components/ListaImpresoras.vue'; // Importar lista de impresoras
import AgregarImpresora from '../components/AgregarImpresora.vue'; // Importar agregar impresora
import EditarImpresora from '../components/EditarImpresora.vue'; // Importar editar impresora

const routes = [
  { path: '/', component: EquiposList },
  { path: '/agregar', component: AgregarEquipo },
  { path: '/editar/:id', component: EditarEquipo, props: true },
  // Rutas de Dispositivos
  { path: '/dispositivos', component: ListaDispositivos },
  { path: '/dispositivos/agregar', component: AgregarDispositivo },
  { path: '/dispositivos/editar/:id', component: EditarDispositivo, props: true },
  // Rutas de Impresoras
  { path: '/impresoras', component: ListaImpresoras },
  { path: '/impresoras/agregar', component: AgregarImpresora },
  { path: '/impresoras/editar/:id', component: EditarImpresora, props: true },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
