<template>
  <div class="p-4 border">
    <h2 class="text-lg font-semibold mb-4">Agregar Equipo</h2>
    <form @submit.prevent="agregarEquipo">
      <div class="mb-2">
        <label for="nombre" class="block">Nombre</label>
        <input v-model="nuevoEquipo.nombre" id="nombre" type="text" class="input" required />
      </div>
      <div class="mb-2">
        <label for="tipo" class="block">Tipo</label>
        <input v-model="nuevoEquipo.tipo" id="tipo" type="text" class="input" required />
      </div>
      <div class="mb-2">
        <label for="ip" class="block">IP</label>
        <input v-model="nuevoEquipo.ip" id="ip" type="text" class="input" required />
      </div>
      <div class="mb-2">
        <label for="piso" class="block">Piso</label>
        <input v-model="nuevoEquipo.piso" id="piso" type="text" class="input" required />
      </div>
      <div class="mb-2">
        <label for="oficina" class="block">Oficina</label>
        <input v-model="nuevoEquipo.oficina" id="oficina" type="text" class="input" required />
      </div>
      <div class="mb-2">
        <label for="usuario" class="block">Usuario</label>
        <input v-model="nuevoEquipo.usuario" id="usuario" type="text" class="input" required />
      </div>
      <div class="mb-2">
        <label for="numeroSerie" class="block">Número de Serie</label>
        <input v-model="nuevoEquipo.numeroSerie" id="numeroSerie" type="text" class="input" required />
      </div>
      <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Agregar</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import axios from 'axios';

export default defineComponent({
  name: 'AgregarEquipo',
  setup() {
    const nuevoEquipo = ref({
      nombre: '',
      tipo: '',
      ip: '',
      piso: '',
      oficina: '',
      usuario: '',
      numeroSerie: '',  // Agregado el campo 'numeroSerie'
    });

    const agregarEquipo = async () => {
      try {
        await axios.post('http://localhost:5000/api/equipos', nuevoEquipo.value);
        alert('Equipo agregado correctamente');
        // Resetear el formulario
        nuevoEquipo.value = { nombre: '', tipo: '', ip: '', piso: '', oficina: '', usuario: '', numeroSerie: '' };
      } catch (error) {
        console.error('Error al agregar el equipo', error);
        alert('Hubo un error al agregar el equipo');
      }
    };

    return {
      nuevoEquipo,
      agregarEquipo,
    };
  },
});
</script>

<style scoped>
.input {
  padding: 8px;
  border: 1px solid #ccc;
  width: 100%;
  margin-top: 4px;
}
</style>
