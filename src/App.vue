<template>
  <div id="app" class="min-h-screen flex flex-col bg-gray-50">
    <!-- Barra de navegación mejorada con autenticación -->
    <nav v-if="isAuthenticated" class="bg-gray-800 text-white shadow-lg">
      <div class="container mx-auto px-4 py-3">
        <div class="flex items-center justify-between">
          <!-- Título a la izquierda - siempre visible -->
          <router-link to="/" class="text-xl font-bold text-green-400 flex items-center">
            <i class="fas fa-server mr-2"></i>
            <span class="hidden sm:inline">Sistema de Inventario</span>
            <span class="sm:hidden">Inventario</span>
          </router-link>

          <!-- Información del usuario y menú para pantallas grandes -->
          <div class="hidden md:flex items-center space-x-2">
            <!-- Enlaces de navegación comunes para todos -->
            <router-link 
              to="/" 
              class="px-3 py-1 rounded-md hover:bg-gray-700 hover:text-green-400 transition-colors duration-200"
              active-class="bg-gray-700 text-green-400"
            >
              <i class="fas fa-desktop mr-1"></i> Equipos
            </router-link>
            <router-link 
              to="/usuarios" 
              class="px-3 py-1 rounded-md hover:bg-gray-700 hover:text-green-400 transition-colors duration-200"
              active-class="bg-gray-700 text-green-400"
            >
              <i class="fas fa-users mr-1"></i> Usuarios
            </router-link>
            <router-link 
              to="/impresoras" 
              class="px-3 py-1 rounded-md hover:bg-gray-700 hover:text-green-400 transition-colors duration-200"
              active-class="bg-gray-700 text-green-400"
            >
              <i class="fas fa-print mr-1"></i> Impresoras
            </router-link>

            <!-- Enlaces exclusivos para Admin con diseño mejorado -->
            <div v-if="isAdmin" class="flex items-center space-x-2">
              <!-- Separador visual -->
              <div class="border-l border-gray-600 h-6 mx-1"></div>
              
              <router-link 
                to="/sistema/usuarios" 
                class="px-3 py-1 rounded-md hover:bg-gray-700 hover:text-blue-400 transition-colors duration-200"
                active-class="bg-gray-700 text-blue-400"
              >
                <i class="fas fa-user-cog mr-1"></i> Usuarios Sistema
              </router-link>
              <router-link 
                to="/sistema/revision" 
                class="px-3 py-1 rounded-md hover:bg-gray-700 hover:text-yellow-400 transition-colors duration-200"
                active-class="bg-gray-700 text-yellow-400"
              >
                <i class="fas fa-tools mr-1"></i> Revisión
              </router-link>
              <router-link 
                to="/sistema/disponibles" 
                class="px-3 py-1 rounded-md hover:bg-gray-700 hover:text-green-400 transition-colors duration-200"
                active-class="bg-gray-700 text-green-400"
              >
                <i class="fas fa-check-circle mr-1"></i> Disponibles
              </router-link>
              <router-link 
                to="/sistema/bajas" 
                class="px-3 py-1 rounded-md hover:bg-gray-700 hover:text-red-400 transition-colors duration-200"
                active-class="bg-gray-700 text-red-400"
              >
                <i class="fas fa-archive mr-1"></i> Bajas
              </router-link>
            </div>

            <!-- Separador -->
            <div class="border-l border-gray-600 h-6 mx-2"></div>

            <!-- Información del usuario -->
            <div class="flex items-center space-x-2">
              <div class="flex items-center bg-gray-700 px-3 py-1 rounded-md">
                <i class="fas fa-user mr-2 text-green-400"></i>
                <span class="text-sm">{{ currentUser?.nombre || 'Usuario' }}</span>
                <span 
                  class="ml-2 text-xs px-2 py-0.5 rounded-full"
                  :class="getRolBadgeClass()"
                >
                  {{ getRolText() }}
                </span>
              </div>
              
              <!-- Botón de logout -->
              <button
                @click="handleLogout"
                class="p-2 rounded-md hover:bg-gray-700 hover:text-red-400 transition-colors duration-200 text-gray-300"
                title="Cerrar Sesión"
              >
                <i class="fas fa-sign-out-alt"></i>
              </button>
            </div>
          </div>

          <!-- Menú móvil - botón hamburguesa -->
          <button 
            @click="isMobileMenuOpen = !isMobileMenuOpen"
            class="md:hidden p-2 rounded-md hover:bg-gray-700 focus:outline-none"
          >
            <i class="fas fa-bars"></i>
          </button>
        </div>
        
        <!-- Menú desplegable móvil -->
        <div 
          v-show="isMobileMenuOpen"
          class="md:hidden mt-3 space-y-2 pb-2 border-t border-gray-700 pt-2"
        >
          <!-- Enlaces de navegación móvil comunes -->
          <router-link 
            to="/" 
            class="block px-3 py-2 rounded-md hover:bg-gray-700 hover:text-green-400 transition-colors duration-200"
            active-class="bg-gray-700 text-green-400"
            @click="isMobileMenuOpen = false"
          >
            <i class="fas fa-desktop mr-2"></i> Equipos
          </router-link>
          <router-link 
            to="/usuarios" 
            class="block px-3 py-2 rounded-md hover:bg-gray-700 hover:text-green-400 transition-colors duration-200"
            active-class="bg-gray-700 text-green-400"
            @click="isMobileMenuOpen = false"
          >
            <i class="fas fa-users mr-2"></i> Usuarios
          </router-link>
          <router-link 
            to="/impresoras" 
            class="block px-3 py-2 rounded-md hover:bg-gray-700 hover:text-green-400 transition-colors duration-200"
            active-class="bg-gray-700 text-green-400"
            @click="isMobileMenuOpen = false"
          >
            <i class="fas fa-print mr-2"></i> Impresoras
          </router-link>

          <!-- Enlaces móviles exclusivos para admin -->
          <template v-if="isAdmin">
            <div class="border-t border-gray-600 pt-2 mt-2">
              <div class="px-2 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Administración
              </div>
            </div>
            <router-link 
              to="/sistema/usuarios" 
              class="block px-3 py-2 rounded-md hover:bg-gray-700 hover:text-blue-400 transition-colors duration-200"
              active-class="bg-gray-700 text-blue-400"
              @click="isMobileMenuOpen = false"
            >
              <i class="fas fa-user-cog mr-2"></i> Usuarios Sistema
            </router-link>
            <router-link 
              to="/sistema/revision" 
              class="block px-3 py-2 rounded-md hover:bg-gray-700 hover:text-yellow-400 transition-colors duration-200"
              active-class="bg-gray-700 text-yellow-400"
              @click="isMobileMenuOpen = false"
            >
              <i class="fas fa-tools mr-2"></i> Revisión
            </router-link>
            <router-link 
              to="/sistema/disponibles" 
              class="block px-3 py-2 rounded-md hover:bg-gray-700 hover:text-green-400 transition-colors duration-200"
              active-class="bg-gray-700 text-green-400"
              @click="isMobileMenuOpen = false"
            >
              <i class="fas fa-check-circle mr-2"></i> Disponibles
            </router-link>
            <router-link 
              to="/sistema/bajas" 
              class="block px-3 py-2 rounded-md hover:bg-gray-700 hover:text-red-400 transition-colors duration-200"
              active-class="bg-gray-700 text-red-400"
              @click="isMobileMenuOpen = false"
            >
              <i class="fas fa-archive mr-2"></i> Bajas
            </router-link>
          </template>

          <!-- Información del usuario en móvil -->
          <div class="border-t border-gray-700 pt-2 mt-2">
            <div class="px-3 py-2">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <i class="fas fa-user mr-2 text-green-400"></i>
                  <span class="text-sm">{{ currentUser?.nombre || 'Usuario' }}</span>
                  <span 
                    class="ml-2 text-xs px-2 py-0.5 rounded-full"
                    :class="getRolBadgeClass()"
                  >
                    {{ getRolText() }}
                  </span>
                </div>
                <button
                  @click="handleLogout"
                  class="p-1 rounded-md hover:bg-gray-700 hover:text-red-400 transition-colors duration-200 text-gray-300"
                  title="Cerrar Sesión"
                >
                  <i class="fas fa-sign-out-alt"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
    
    <!-- Contenido principal -->
    <main class="flex-grow" :class="isAuthenticated ? 'container mx-auto px-4 py-6' : ''">
      <router-view />
    </main>
    
    <!-- Pie de página (solo si está autenticado) -->
    <footer v-if="isAuthenticated" class="bg-gray-800 text-white py-4">
      <div class="container mx-auto px-4 text-center text-sm">
        <p>Sistema de Inventario &copy; {{ new Date().getFullYear() }}</p>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, watch, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import authService from './services/authService';

export default defineComponent({
  name: 'App',
  setup() {
    const router = useRouter();
    const route = useRoute();
    const isMobileMenuOpen = ref(false);
    
    // Estado reactivo local para forzar actualizaciones
    const authUpdateTrigger = ref(0);
    const forceUpdate = () => {
      authUpdateTrigger.value++;
      console.log('Forzando actualización del estado de auth');
    };

    // Estados computados que se actualizan cuando authUpdateTrigger cambia
    const isAuthenticated = computed(() => {
      authUpdateTrigger.value;
      const result = authService.isAuthenticated();
      console.log('isAuthenticated evaluado:', result);
      return result;
    });

    const currentUser = computed(() => {
      authUpdateTrigger.value;
      const user = authService.getUser();
      console.log('currentUser evaluado:', user);
      return user;
    });

    const isAdmin = computed(() => {
      authUpdateTrigger.value;
      const admin = authService.isAdmin();
      console.log('isAdmin evaluado:', admin);
      return admin;
    });

    const isInformatica = computed(() => {
      authUpdateTrigger.value;
      const informatica = authService.isInformatica();
      console.log('isInformatica evaluado:', informatica);
      return informatica;
    });

    // Eliminamos isPatrimonio ya que este rol se quita del sistema

    const getRolBadgeClass = () => {
      const rol = currentUser.value?.rol;
      switch (rol) {
        case 'admin':
          return 'bg-red-500 text-white';
        case 'informatica':
          return 'bg-blue-500 text-white';
        // Eliminamos el caso 'patrimonio'
        default:
          return 'bg-gray-500 text-white';
      }
    };

    const getRolText = () => {
      const rol = currentUser.value?.rol;
      switch (rol) {
        case 'admin':
          return 'Admin';
        case 'informatica':
          return 'Informática';
        // Eliminamos el caso 'patrimonio'
        default:
          return 'Usuario';
      }
    };

    const handleLogout = () => {
      if (confirm('¿Está seguro que desea cerrar sesión?')) {
        authService.logout();
        forceUpdate(); // Forzar actualización después del logout
        router.push('/login');
      }
    };

    // Escuchar cambios en la ruta para detectar login/logout
    watch(() => route.path, (newPath, oldPath) => {
      console.log('Ruta cambió de', oldPath, 'a', newPath);
      
      // Si venimos de login o vamos a login, actualizar estado
      if (newPath === '/login' || oldPath === '/login') {
        nextTick(() => {
          forceUpdate();
        });
      }
    });

    // Escuchar cambios en localStorage (para multi-tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token' || e.key === 'user' || e.key === 'authToken') {
        console.log('Cambio detectado en localStorage:', e.key);
        nextTick(() => {
          forceUpdate();
        });
      }
    };

    // Función global para que otros componentes puedan forzar actualización
    const refreshAuthState = () => {
      console.log('Refrescando estado desde función global');
      forceUpdate();
    };

    // Exponer función globalmente
    (window as any).refreshAuthState = refreshAuthState;

    // Inicializar servicio de auth al montar el componente
    onMounted(() => {
      authService.init();
      
      // Escuchar cambios en localStorage
      window.addEventListener('storage', handleStorageChange);
      
      // Forzar evaluación inicial
      nextTick(() => {
        forceUpdate();
      });
      
      console.log('App montado. Estado inicial:', {
        isAuthenticated: isAuthenticated.value,
        currentUser: currentUser.value,
        isAdmin: isAdmin.value,
        isInformatica: isInformatica.value
      });
    });

    // Limpiar listeners al desmontar
    const onBeforeUnmount = () => {
      window.removeEventListener('storage', handleStorageChange);
      delete (window as any).refreshAuthState;
    };
    
    return {
      isMobileMenuOpen,
      isAuthenticated,
      currentUser,
      isAdmin,
      isInformatica,
      handleLogout,
      refreshAuthState,
      onBeforeUnmount,
      getRolBadgeClass,
      getRolText
    };
  },
  beforeUnmount() {
    this.onBeforeUnmount?.();
  }
});
</script>