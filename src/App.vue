<template>
  <div id="app">
    <AgregarEquipo />
    <EquiposList />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AgregarEquipo from './components/AgregarEquipo.vue';
import EquiposList from './components/EquiposList.vue';

export default defineComponent({
  name: 'App',
  components: {
    AgregarEquipo,
    EquiposList,
  },
});
</script>

<style scoped>
/* Puedes agregar estilos globales aquí */
</style>
