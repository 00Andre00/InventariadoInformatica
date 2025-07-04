import { createRouter, createWebHistory } from 'vue-router';
import EquiposList from '../components/EquiposList.vue';
import AgregarEquipo from '../components/AgregarEquipo.vue';
import EditarEquipo from '../components/EditarEquipo.vue';

const routes = [
  { path: '/', component: EquiposList },
  { path: '/agregar', component: AgregarEquipo },
  { path: '/editar/:id', component: EditarEquipo, props: true },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
