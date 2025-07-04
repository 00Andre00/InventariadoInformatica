<template>
  <div class="p-4 border">
    <h2 class="text-lg font-semibold mb-4">Editar Equipo</h2>
    <form @submit.prevent="actualizarEquipo">
      <div class="mb-2">
        <label for="nombre" class="block">Nombre</label>
        <input v-model="equipo.nombre" id="nombre" type="text" class="input" required />
      </div>
      <div class="mb-2">
        <label for="tipo" class="block">Tipo</label>
        <input v-model="equipo.tipo" id="tipo" type="text" class="input" required />
      </div>
      <div class="mb-2">
        <label for="ip" class="block">IP</label>
        <input v-model="equipo.ip" id="ip" type="text" class="input" required />
      </div>
      <div class="mb-2">
        <label for="piso" class="block">Piso</label>
        <input v-model="equipo.piso" id="piso" type="text" class="input" required />
      </div>
      <div class="mb-2">
        <label for="oficina" class="block">Oficina</label>
        <input v-model="equipo.oficina" id="oficina" type="text" class="input" required />
      </div>
      <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Actualizar</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';

export default defineComponent({
  name: 'EditarEquipo',
  setup() {
    const equipo = ref<any>({});
    const route = useRoute();
    const router = useRouter();

    // Cargar el equipo a editar desde el backend
    const cargarEquipo = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/equipo/${route.params.id}`);
        equipo.value = response.data;
      } catch (error) {
        console.error('Error al cargar el equipo', error);
      }
    };

    // Actualizar equipo
    const actualizarEquipo = async () => {
      try {
        await axios.put(`http://localhost:5000/api/equipo/${route.params.id}`, equipo.value);
        alert('Equipo actualizado correctamente');
        router.push('/');  // Redirigir a la lista de equipos
      } catch (error) {
        console.error('Error al actualizar el equipo', error);
      }
    };

    // Cargar el equipo cuando el componente esté montado
    onMounted(() => {
      cargarEquipo();
    });

    return {
      equipo,
      actualizarEquipo,
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
