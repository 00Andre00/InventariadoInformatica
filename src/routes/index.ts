import { createRouter, createWebHistory } from 'vue-router';
import EquiposList from '../components/EquiposList.vue';
import AgregarEquipo from '../components/AgregarEquipo.vue';
import EditarEquipo from '../components/EditarEquipo.vue';
import ListaImpresoras from '../components/ListaImpresoras.vue';
import AgregarImpresora from '../components/AgregarImpresora.vue';
import EditarImpresora from '../components/EditarImpresora.vue';
import ListaUsuarios from '../components/ListaUsuarios.vue';
import AgregarUsuario from '../components/AgregarUsuario.vue';
import EditarUsuario from '../components/EditarUsuario.vue';

const routes = [
  { path: '/', component: EquiposList },
  { path: '/agregar', component: AgregarEquipo },
  { path: '/editar/:id', component: EditarEquipo, props: true },
  
  // Rutas de Impresoras
  { path: '/impresoras', component: ListaImpresoras },
  { path: '/impresoras/agregar', component: AgregarImpresora },
  { path: '/impresoras/editar/:id', component: EditarImpresora, props: true },
  
  // Rutas de Usuarios
  { path: '/usuarios', component: ListaUsuarios },
  { path: '/usuarios/agregar', component: AgregarUsuario },
  { path: '/usuarios/editar/:id', component: EditarUsuario, props: true },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;