<template>
  <div id="app" class="min-h-screen flex flex-col bg-gray-50">
    <!-- Barra de navegación mejorada -->
    <nav class="bg-gray-800 text-white shadow-lg">
      <div class="container mx-auto px-4 py-3">
        <div class="flex items-center justify-between">
          <!-- Título a la izquierda - siempre visible -->
          <router-link to="/" class="text-xl font-bold text-green-400 flex items-center">
            <i class="fas fa-server mr-2"></i>
            <span class="hidden sm:inline">Sistema de Inventario</span>
            <span class="sm:hidden">Inventario</span>
          </router-link>

          <!-- Menú para pantallas grandes -->
          <div class="hidden md:flex items-center space-x-4">
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
        </div>
      </div>
    </nav>
    
    <!-- Contenido principal -->
    <main class="flex-grow container mx-auto px-4 py-6">
      <router-view />
    </main>
    
    <!-- Pie de página -->
    <footer class="bg-gray-800 text-white py-4">
      <div class="container mx-auto px-4 text-center text-sm">
        <p>Sistema de Inventario &copy; {{ new Date().getFullYear() }}</p>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'App',
  setup() {
    const isMobileMenuOpen = ref(false);
    
    return {
      isMobileMenuOpen
    };
  }
});
</script>

<style>
/* Transiciones suaves para el router */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Estilos para los enlaces activos */
.router-link-active {
  font-weight: 500;
}
</style>