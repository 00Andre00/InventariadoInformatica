<template>
  <div id="app">
    <!-- Barra de navegación -->
    <nav class="bg-gray-800 text-white p-4">
      <ul class="flex space-x-4">
        <li>
          <router-link to="/" class="hover:text-green-400">Ver Equipos</router-link>
        </li>
        <li>
          <router-link to="/agregar" class="hover:text-green-400">Agregar Equipo</router-link>
        </li>
      </ul>
    </nav>
    <!-- Vista renderizada según la ruta -->
    <router-view />  
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',
});
</script>

<style scoped>
/* Estilos globales */
</style>
