<template>
  <div class="container mx-auto p-4">
    <h2 class="text-2xl font-semibold mb-4">Editar Equipo</h2>

    <form @submit.prevent="actualizarEquipo" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="tipo" class="block text-sm font-medium">Tipo*</label>
          <select v-model="equipo.tipo" id="tipo" class="input" required>
            <option value="">Seleccione un tipo</option>
            <option value="Computadora">Computadora</option>
            <option value="Laptop">Laptop</option>
            <option value="Servidor">Servidor</option>
            <option value="Otro">Otro</option>
          </select>
        </div>

        <div>
          <label for="marca" class="block text-sm font-medium">Marca*</label>
          <input v-model="equipo.marca" id="marca" type="text" class="input" required />
        </div>

        <div>
          <label for="modelo" class="block text-sm font-medium">Modelo*</label>
          <input v-model="equipo.modelo" id="modelo" type="text" class="input" required />
        </div>

        <div>
          <label for="procesador" class="block text-sm font-medium">Procesador*</label>
          <input v-model="equipo.procesador" id="procesador" type="text" class="input" required />
        </div>

        <div>
          <label for="grafica" class="block text-sm font-medium">Tarjeta Gráfica</label>
          <input v-model="equipo.grafica" id="grafica" type="text" class="input" />
        </div>

        <div>
          <label for="ram" class="block text-sm font-medium">RAM*</label>
          <input v-model="equipo.ram" id="ram" type="text" class="input" required />
        </div>

        <div>
          <label for="almacenamiento" class="block text-sm font-medium">Almacenamiento*</label>
          <input v-model="equipo.almacenamiento" id="almacenamiento" type="text" class="input" required />
        </div>

        <div>
          <label for="placaMadre" class="block text-sm font-medium">Placa Madre</label>
          <input v-model="equipo.placaMadre" id="placaMadre" type="text" class="input" />
        </div>

        <div>
          <label for="oficina" class="block text-sm font-medium">Oficina*</label>
          <input v-model="equipo.oficina" id="oficina" type="text" class="input" required />
        </div>

        <div>
          <label for="vlan" class="block text-sm font-medium">VLAN</label>
          <input v-model="equipo.vlan" id="vlan" type="text" class="input" />
        </div>

        <div>
          <label for="ip" class="block text-sm font-medium">IP*</label>
          <input v-model="equipo.ip" id="ip" type="text" class="input" required />
          <p class="text-xs text-gray-500 mt-1">Formato: 192.168.1.1</p>
        </div>

        <div>
          <label for="mac" class="block text-sm font-medium">MAC Address*</label>
          <input v-model="equipo.mac" id="mac" type="text" class="input" required />
          <p class="text-xs text-gray-500 mt-1">Formato: 00:1A:2B:3C:4D:5E o 00-1A-2B-3C-4D-5E</p>
        </div>

        <div>
          <label for="numeroSerie" class="block text-sm font-medium">Número de Serie</label>
          <input v-model="equipo.numeroSerie" id="numeroSerie" type="text" class="input" />
        </div>

        <div>
          <label for="usuario" class="block text-sm font-medium">Usuario</label>
          <input v-model="equipo.usuario" id="usuario" type="text" class="input" />
        </div>
      </div>

      <div class="flex gap-4 pt-4">
        <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition">
          Actualizar Equipo
        </button>
        <button @click="eliminarEquipo" type="button" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition">
          Eliminar Equipo
        </button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

export default defineComponent({
  name: 'EditarEquipo',
  setup() {
    const equipo = ref({
      tipo: '',
      marca: '',
      modelo: '',
      procesador: '',
      grafica: '',
      ram: '',
      almacenamiento: '',
      placaMadre: '',
      oficina: '',
      vlan: '',
      ip: '',
      mac: '',
      numeroSerie: '',
      usuario: ''
    });

    const route = useRoute();
    const router = useRouter();

    const cargarEquipo = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/equipos/${route.params.id}`);
        equipo.value = response.data.data;
      } catch (error) {
        console.error('Error al cargar el equipo', error);
        alert('Error al cargar los datos del equipo');
      }
    };

    const actualizarEquipo = async () => {
      try {
        await axios.put(`http://localhost:5000/api/equipos/${route.params.id}`, equipo.value);
        alert('Equipo actualizado correctamente');
        router.push('/');
      } catch (error: any) {
        console.error('Error al actualizar el equipo', error);
        if (error.response && error.response.data.error) {
          alert(error.response.data.error);
        } else {
          alert('Hubo un error al actualizar el equipo');
        }
      }
    };

    const eliminarEquipo = async () => {
      const confirmacion = confirm('¿Estás seguro de que deseas eliminar este equipo?');
      if (!confirmacion) return;

      try {
        await axios.delete(`http://localhost:5000/api/equipos/${route.params.id}`);
        alert('Equipo eliminado correctamente');
        router.push('/equipos');
      } catch (error) {
        console.error('Error al eliminar el equipo', error);
        alert('Hubo un error al eliminar el equipo');
      }
    };

    onMounted(() => {
      cargarEquipo();
    });

    return {
      equipo,
      actualizarEquipo,
      eliminarEquipo,
    };
  },
});
</script>

<style scoped>
.input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
}
</style>