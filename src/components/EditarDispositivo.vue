<template>
  <div class="p-4 border">
    <h2 class="text-lg font-semibold mb-4">Editar Dispositivo</h2>
    <form @submit.prevent="actualizarDispositivo">
      <div class="mb-2">
        <label for="nombre" class="block">Nombre</label>
        <input v-model="dispositivo.nombre" id="nombre" type="text" class="input" required />
      </div>
      <div class="mb-2">
        <label for="tipo" class="block">Tipo</label>
        <input v-model="dispositivo.tipo" id="tipo" type="text" class="input" required />
      </div>
      <div class="mb-2">
        <label for="piso" class="block">Piso</label>
        <input v-model="dispositivo.piso" id="piso" type="text" class="input" required />
      </div>
      <div class="mb-2">
        <label for="oficina" class="block">Oficina</label>
        <input v-model="dispositivo.oficina" id="oficina" type="text" class="input" required />
      </div>
      <div class="mb-2">
        <label for="cantidad" class="block">Cantidad</label>
        <input v-model="dispositivo.cantidad" id="cantidad" type="number" class="input" required />
      </div>
      <div class="mb-2">
        <label for="numeroSerie" class="block">Número de Serie</label>
        <input v-model="dispositivo.numeroSerie" id="numeroSerie" type="text" class="input" required />
      </div>
      <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Actualizar</button>
    </form>

    <!-- Botón de eliminación del dispositivo -->
    <button @click="eliminarDispositivo" class="bg-red-500 text-white px-4 py-2 rounded mt-4">
      Eliminar Dispositivo
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';

export default defineComponent({
  name: 'EditarDispositivo',
  setup() {
    const dispositivo = ref<any>({
      nombre: '',
      tipo: '',
      piso: '',
      oficina: '',
      cantidad: 0, // Cambié "unidades" por "cantidad"
      numeroSerie: '',
    });
    const route = useRoute();
    const router = useRouter();

    // Cargar dispositivo desde la API
    const cargarDispositivo = async () => {
      try {
        const response = await axios.get(`https://isiback.drtchco.gob.pe/api/dispositivos/${route.params.id}`);
        dispositivo.value = response.data.data;
      } catch (error) {
        console.error('Error al cargar el dispositivo', error);
        alert('No se pudo cargar el dispositivo');
      }
    };

    // Actualizar dispositivo
    const actualizarDispositivo = async () => {
      try {
        await axios.put(`https://isiback.drtchco.gob.pe/api/dispositivos/${route.params.id}`, dispositivo.value);
        alert('Dispositivo actualizado correctamente');
        router.push('/dispositivos'); // Redirigir a la lista de dispositivos
      } catch (error) {
        console.error('Error al actualizar el dispositivo', error);
        alert('Hubo un error al actualizar el dispositivo');
      }
    };

    // Eliminar dispositivo
    const eliminarDispositivo = async () => {
      try {
        const confirmation = confirm('¿Estás seguro de que deseas eliminar este dispositivo?');
        if (confirmation) {
          await axios.delete(`https://isiback.drtchco.gob.pe/api/dispositivos/${route.params.id}`);
          alert('Dispositivo eliminado correctamente');
          router.push('/dispositivos'); // Redirigir después de eliminar
        }
      } catch (error) {
        console.error('Error al eliminar el dispositivo', error);
        alert('Hubo un error al intentar eliminar el dispositivo');
      }
    };

    // Cargar el dispositivo cuando se monta el componente
    onMounted(() => {
      cargarDispositivo();
    });

    return {
      dispositivo,
      actualizarDispositivo,
      eliminarDispositivo,
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
