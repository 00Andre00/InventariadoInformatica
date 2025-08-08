<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Agregar Nueva Impresora</h1>
      <router-link to="/impresoras" class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600">
        Volver a la Lista
      </router-link>
    </div>

    <div class="bg-white shadow-md rounded-lg p-6">
      <form @submit.prevent="agregarImpresora" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="nombre" class="block text-sm font-medium text-gray-700 mb-1">Nombre*</label>
            <input 
              v-model="nuevaImpresora.nombre" 
              id="nombre" 
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              required 
            />
          </div>
          
          <div>
            <label for="tipo" class="block text-sm font-medium text-gray-700 mb-1">Tipo*</label>
            <input 
              v-model="nuevaImpresora.tipo" 
              id="tipo" 
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              required 
            />
          </div>
          
          <div>
            <label for="ip" class="block text-sm font-medium text-gray-700 mb-1">IP*</label>
            <input 
              v-model="nuevaImpresora.ip" 
              id="ip" 
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              required 
            />
          </div>
          
          <div>
            <label for="piso" class="block text-sm font-medium text-gray-700 mb-1">Piso*</label>
            <input 
              v-model="nuevaImpresora.piso" 
              id="piso" 
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              required 
            />
          </div>
          
          <div>
            <label for="oficina" class="block text-sm font-medium text-gray-700 mb-1">Oficina*</label>
            <input 
              v-model="nuevaImpresora.oficina" 
              id="oficina" 
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              required 
            />
          </div>
          
          <div>
            <label for="recurso" class="block text-sm font-medium text-gray-700 mb-1">Recurso*</label>
            <input 
              v-model="nuevaImpresora.recurso" 
              id="recurso" 
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              required 
            />
          </div>
          
          <div>
            <label for="modeloRecurso" class="block text-sm font-medium text-gray-700 mb-1">Modelo Recurso*</label>
            <input 
              v-model="nuevaImpresora.modeloRecurso" 
              id="modeloRecurso" 
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              required 
            />
          </div>
          
          <div>
            <label for="numeroSerie" class="block text-sm font-medium text-gray-700 mb-1">Número de Serie*</label>
            <input 
              v-model="nuevaImpresora.numeroSerie" 
              id="numeroSerie" 
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              required 
            />
          </div>
        </div>

        <div class="pt-4">
          <button 
            type="submit" 
            class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
            :disabled="loading"
          >
            <span v-if="loading">
              <i class="fas fa-circle-notch fa-spin mr-2"></i> Procesando...
            </span>
            <span v-else>Agregar Impresora</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import axios from 'axios';

interface NuevaImpresora {
  nombre: string;
  tipo: string;
  ip: string;
  piso: string;
  oficina: string;
  recurso: string;
  modeloRecurso: string;
  numeroSerie: string;
}

export default defineComponent({
  name: 'AgregarImpresora',
  setup() {
    const loading = ref(false);
    
    const nuevaImpresora = ref<NuevaImpresora>({
      nombre: '',
      tipo: '',
      ip: '',
      piso: '',
      oficina: '',
      recurso: '',
      modeloRecurso: '',
      numeroSerie: ''
    });

    const agregarImpresora = async () => {
      try {
        loading.value = true;
        await axios.post('https://isiback.drtchco.gob.pe/api/impresoras', nuevaImpresora.value);
        alert('Impresora agregada correctamente');
        
        // Limpiar el formulario automáticamente
        nuevaImpresora.value = {
          nombre: '',
          tipo: '',
          ip: '',
          piso: '',
          oficina: '',
          recurso: '',
          modeloRecurso: '',
          numeroSerie: ''
        };
        
      } catch (error) {
        console.error('Error al agregar la impresora', error);
        alert('Error al agregar la impresora. Por favor, intente nuevamente.');
      } finally {
        loading.value = false;
      }
    };

    return {
      nuevaImpresora,
      loading,
      agregarImpresora
    };
  },
});
</script>