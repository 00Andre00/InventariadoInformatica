// src/router/index.ts
import { createRouter, createWebHistory } from "vue-router";
import authService from "../services/authService";

// Importar componentes existentes
import Login from "../components/Login.vue";
import EquiposList from "../components/EquiposList.vue";
import AgregarEquipo from "../components/AgregarEquipo.vue";
import EditarEquipo from "../components/EditarEquipo.vue";
import ListaImpresoras from "../components/ListaImpresoras.vue";
import AgregarImpresora from "../components/AgregarImpresora.vue";
import EditarImpresora from "../components/EditarImpresora.vue";
import ListaUsuarios from "../components/ListaUsuarios.vue";
import AgregarUsuario from "../components/AgregarUsuario.vue";
import EditarUsuario from "../components/EditarUsuario.vue";

// Importar nuevos componentes del sistema
import UsuariosSistema from "../components/sistema/UsuariosSistema.vue";
import RevisionEquipos from "../components/sistema/RevisionEquipos.vue";
import EquiposDisponibles from "../components/sistema/EquiposDisponibles.vue";
import EquiposBajas from "../components/sistema/EquiposBajas.vue";

const routes = [
  // Ruta de login (pública)
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { requiresGuest: true },
  },

  // Rutas protegidas principales
  {
    path: "/",
    name: "Equipos",
    component: EquiposList,
    meta: { requiresAuth: true },
  },
  {
    path: "/agregar",
    name: "AgregarEquipo",
    component: AgregarEquipo,
    meta: { requiresAuth: true, requiresInformatica: true },
  },
  {
    path: "/editar/:id",
    name: "EditarEquipo",
    component: EditarEquipo,
    props: true,
    meta: { requiresAuth: true, requiresInformatica: true },
  },

  // Rutas de Impresoras
  {
    path: "/impresoras",
    name: "Impresoras",
    component: ListaImpresoras,
    meta: { requiresAuth: true },
  },
  {
    path: "/impresoras/agregar",
    name: "AgregarImpresora",
    component: AgregarImpresora,
    meta: { requiresAuth: true, requiresInformatica: true },
  },
  {
    path: "/impresoras/editar/:id",
    name: "EditarImpresora",
    component: EditarImpresora,
    props: true,
    meta: { requiresAuth: true, requiresInformatica: true },
  },

  // Rutas de Usuarios
  {
    path: "/usuarios",
    name: "Usuarios",
    component: ListaUsuarios,
    meta: { requiresAuth: true },
  },
  {
    path: "/usuarios/agregar",
    name: "AgregarUsuario",
    component: AgregarUsuario,
    meta: { requiresAuth: true, requiresInformatica: true },
  },
  {
    path: "/usuarios/editar/:id",
    name: "EditarUsuario",
    component: EditarUsuario,
    props: true,
    meta: { requiresAuth: true, requiresInformatica: true },
  },

  // Nuevas rutas del sistema
  {
    path: "/sistema/usuarios",
    name: "UsuariosSistema",
    component: UsuariosSistema,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/sistema/revision",
    name: "RevisionEquipos",
    component: RevisionEquipos,
    meta: { requiresAuth: true, requiresInformatica: true },
  },
  {
    path: "/sistema/disponibles",
    name: "EquiposDisponibles",
    component: EquiposDisponibles,
    meta: { requiresAuth: true, requiresInformatica: true },
  },
  {
    path: "/sistema/bajas",
    name: "EquiposBajas",
    component: EquiposBajas,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/sistema/cambiar-password",
    name: "CambiarPassword",
    component: () => import("../components/sistema/EditarPassword.vue"),
    meta: { requiresAuth: true },
  },

  // Ruta de fallback
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Guards de navegación
router.beforeEach(async (to, _from, next) => {
  const isAuthenticated = authService.isAuthenticated();
  const isAdmin = authService.isAdmin();
  const isInformatica = authService.isInformatica();

  // Si la ruta requiere ser invitado (como login) y ya está autenticado
  if (to.meta.requiresGuest && isAuthenticated) {
    return next("/");
  }

  // Si la ruta requiere autenticación
  if (to.meta.requiresAuth) {
    if (!isAuthenticated) {
      return next("/login");
    }

    // Verificar token con el servidor
    const tokenValid = await authService.verifyToken();
    if (!tokenValid) {
      return next("/login");
    }

    // Si la ruta requiere permisos de admin
    if (to.meta.requiresAdmin && !isAdmin) {
      alert("No tienes permisos de administrador para acceder a esta página");
      return next("/");
    }

    // Si la ruta requiere permisos de informática
    if (to.meta.requiresInformatica && !isInformatica) {
      alert("No tienes permisos de informática para acceder a esta página");
      return next("/");
    }
  }

  next();
});

export default router;