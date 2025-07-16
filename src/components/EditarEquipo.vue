<template>
  <div class="container mx-auto p-4">
    <h2 class="text-2xl font-semibold mb-4">Editar Equipo</h2>
    <form @submit.prevent="actualizarEquipo">
      <!-- Campos del formulario para editar el equipo -->
      <div class="mb-4">
        <label for="nombre" class="block">Nombre</label>
        <input v-model="equipo.nombre" id="nombre" type="text" class="input" required />
      </div>

      <div class="mb-4">
        <label for="tipo" class="block">Tipo</label>
        <input v-model="equipo.tipo" id="tipo" type="text" class="input" required />
      </div>

      <div class="mb-4">
        <label for="ip" class="block">IP</label>
        <input v-model="equipo.ip" id="ip" type="text" class="input" required />
      </div>

      <div class="mb-4">
        <label for="piso" class="block">Piso</label>
        <input v-model="equipo.piso" id="piso" type="text" class="input" required />
      </div>

      <div class="mb-4">
        <label for="oficina" class="block">Oficina</label>
        <input v-model="equipo.oficina" id="oficina" type="text" class="input" required />
      </div>

      <div class="mb-4">
        <label for="numeroSerie" class="block">Número de Serie</label>
        <input v-model="equipo.numeroSerie" id="numeroSerie" type="text" class="input" required />
      </div>

      <!-- Botón para actualizar -->
      <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded-lg">Actualizar</button>
    </form>

    <!-- Botón para eliminar el equipo -->
    <button @click="eliminarEquipo" class="bg-red-500 text-white px-4 py-2 rounded mt-4">
      Eliminar Equipo
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';

export default defineComponent({
  name: 'EditarEquipo',
  setup() {
    const equipo = ref<any>({
      nombre: '',
      tipo: '',
      ip: '',
      piso: '',
      oficina: '',
      numeroSerie: ''
    });
    const route = useRoute();
    const router = useRouter();

    // Cargar los datos del equipo
    const cargarEquipo = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/equipos/${route.params.id}`);
        equipo.value = response.data.data;
      } catch (error) {
        console.error('Error al cargar el equipo', error);
      }
    };

    // Actualizar el equipo
    const actualizarEquipo = async () => {
      try {
        await axios.put(`http://localhost:5000/api/equipos/${route.params.id}`, equipo.value);
        alert('Equipo actualizado correctamente');
        router.push('/equipos');
      } catch (error) {
        console.error('Error al actualizar el equipo', error);
      }
    };

    // Eliminar el equipo
    const eliminarEquipo = async () => {
      try {
        const confirmation = confirm('¿Estás seguro de que deseas eliminar este equipo?');
        if (confirmation) {
          await axios.delete(`http://localhost:5000/api/equipos/${route.params.id}`);
          alert('Equipo eliminado correctamente');
          router.push('/equipos');
        }
      } catch (error) {
        console.error('Error al eliminar el equipo', error);
        alert('Hubo un error al intentar eliminar el equipo');
      }
    };

    onMounted(() => {
      cargarEquipo(); // Cargar los datos del equipo al montar el componente
    });

    return {
      equipo,
      actualizarEquipo,
      eliminarEquipo
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
