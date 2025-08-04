<template>
  <div class="p-4 border rounded-lg shadow-sm bg-white">
    <h2 class="text-xl font-bold mb-4">Agregar Equipo</h2>
    <form @submit.prevent="agregarEquipo" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="tipo" class="block text-sm font-medium">Tipo*</label>
          <select v-model="nuevoEquipo.tipo" id="tipo" class="input" required>
            <option value="">Seleccione un tipo</option>
            <option value="Computadora">Computadora</option>
            <option value="Laptop">Laptop</option>
            <option value="Servidor">Servidor</option>
            <option value="Otro">Otro</option>
          </select>
        </div>

        <div>
          <label for="marca" class="block text-sm font-medium">Marca*</label>
          <input v-model="nuevoEquipo.marca" id="marca" type="text" class="input" required />
        </div>

        <div>
          <label for="modelo" class="block text-sm font-medium">Modelo*</label>
          <input v-model="nuevoEquipo.modelo" id="modelo" type="text" class="input" required />
        </div>

        <div>
          <label for="procesador" class="block text-sm font-medium">Procesador*</label>
          <input v-model="nuevoEquipo.procesador" id="procesador" type="text" class="input" required />
        </div>

        <div>
          <label for="ram" class="block text-sm font-medium">RAM*</label>
          <input v-model="nuevoEquipo.ram" id="ram" type="text" class="input" required />
        </div>

        <div>
          <label for="almacenamiento" class="block text-sm font-medium">Almacenamiento*</label>
          <input v-model="nuevoEquipo.almacenamiento" id="almacenamiento" type="text" class="input" required />
        </div>

        <div>
          <label for="placaMadre" class="block text-sm font-medium">Placa Madre</label>
          <input v-model="nuevoEquipo.placaMadre" id="placaMadre" type="text" class="input" />
        </div>

        <div>
          <label for="grafica" class="block text-sm font-medium">Tarjeta Gráfica</label>
          <input v-model="nuevoEquipo.grafica" id="grafica" type="text" class="input" />
        </div>

        <div>
          <label for="oficina" class="block text-sm font-medium">Oficina*</label>
          <input v-model="nuevoEquipo.oficina" id="oficina" type="text" class="input" required />
        </div>

        <div>
          <label for="vlan" class="block text-sm font-medium">VLAN</label>
          <input v-model="nuevoEquipo.vlan" id="vlan" type="text" class="input" />
        </div>

        <div>
          <label for="ip" class="block text-sm font-medium">IP*</label>
          <input v-model="nuevoEquipo.ip" id="ip" type="text" class="input" required />
          <p class="text-xs text-gray-500 mt-1">Formato: 192.168.1.1</p>
        </div>

        <div>
          <label for="mac" class="block text-sm font-medium">MAC Address*</label>
          <input v-model="nuevoEquipo.mac" id="mac" type="text" class="input" required />
          <p class="text-xs text-gray-500 mt-1">Formato: 00:1A:2B:3C:4D:5E o 00-1A-2B-3C-4D-5E</p>
        </div>

        <div>
          <label for="numeroSerie" class="block text-sm font-medium">Número de Serie</label>
          <input v-model="nuevoEquipo.numeroSerie" id="numeroSerie" type="text" class="input" />
        </div>

        <div>
          <label for="usuario" class="block text-sm font-medium">Usuario</label>
          <input v-model="nuevoEquipo.usuario" id="usuario" type="text" class="input" />
        </div>
      </div>

      <div class="pt-4">
        <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition">
          Agregar Equipo
        </button>
      </div>
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

    const agregarEquipo = async () => {
      try {
        await axios.post('http://localhost:5000/api/equipos', nuevoEquipo.value);
        alert('Equipo agregado correctamente');
        // Resetear formulario
        nuevoEquipo.value = {
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
        };
      } catch (error: any) {
        console.error('Error al agregar el equipo', error);
        if (error.response && error.response.data.error) {
          alert(error.response.data.error);
        } else {
          alert('Hubo un error al agregar el equipo');
        }
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
  border-radius: 4px;
  width: 100%;
}
</style>