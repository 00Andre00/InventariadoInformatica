<template>
  <div class="p-4 border">
    <h2 class="text-lg font-semibold mb-4">Agregar Dispositivo</h2>
    <form @submit.prevent="agregarDispositivo">
      <div class="mb-2">
        <label for="nombre" class="block">Nombre</label>
        <input v-model="nuevoDispositivo.nombre" id="nombre" type="text" class="input" required />
      </div>
      <div class="mb-2">
        <label for="tipo" class="block">Tipo</label>
        <input v-model="nuevoDispositivo.tipo" id="tipo" type="text" class="input" required />
      </div>
      <div class="mb-2">
        <label for="piso" class="block">Piso</label>
        <input v-model="nuevoDispositivo.piso" id="piso" type="text" class="input" required />
      </div>
      <div class="mb-2">
        <label for="oficina" class="block">Oficina</label>
        <input v-model="nuevoDispositivo.oficina" id="oficina" type="text" class="input" required />
      </div>
      <div class="mb-2">
        <label for="cantidad" class="block">Cantidad</label>
        <input v-model="nuevoDispositivo.cantidad" id="cantidad" type="number" class="input" required />
      </div>
      <div class="mb-2">
        <label for="numeroSerie" class="block">Número de Serie</label>
        <input v-model="nuevoDispositivo.numeroSerie" id="numeroSerie" type="text" class="input" required />
      </div>
      <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Agregar</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import axios from 'axios';

export default defineComponent({
  name: 'AgregarDispositivo',
  setup() {
    const nuevoDispositivo = ref({
      nombre: '',
      tipo: '',
      piso: '',
      oficina: '',
      cantidad: 0, // Cambié "unidades" por "cantidad"
      numeroSerie: '',
    });

    const agregarDispositivo = async () => {
      try {
        await axios.post('https://isiback.drtchco.gob.pe/api/dispositivos', nuevoDispositivo.value);
        alert('Dispositivo agregado correctamente');
        // Resetear el formulario
        nuevoDispositivo.value = { nombre: '', tipo: '', piso: '', oficina: '', cantidad: 0, numeroSerie: '' };
      } catch (error) {
        console.error('Error al agregar el dispositivo', error);
        alert('Hubo un error al agregar el dispositivo');
      }
    };

    return {
      nuevoDispositivo,
      agregarDispositivo,
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
