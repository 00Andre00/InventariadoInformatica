<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Editar Impresora</h1>
      <router-link to="/impresoras" class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600">
        Volver a la Lista
      </router-link>
    </div>

    <div class="bg-white shadow-md rounded-lg p-6">
      <form @submit.prevent="actualizarImpresora" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="nombre" class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input 
              v-model="impresora.nombre" 
              id="nombre" 
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              required 
            />
          </div>
          
          <div>
            <label for="tipo" class="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
            <input 
              v-model="impresora.tipo" 
              id="tipo" 
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              required 
            />
          </div>
          
          <div>
            <label for="ip" class="block text-sm font-medium text-gray-700 mb-1">IP</label>
            <input 
              v-model="impresora.ip" 
              id="ip" 
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              required 
            />
          </div>
          
          <div>
            <label for="piso" class="block text-sm font-medium text-gray-700 mb-1">Piso</label>
            <input 
              v-model="impresora.piso" 
              id="piso" 
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              required 
            />
          </div>
          
          <div>
            <label for="oficina" class="block text-sm font-medium text-gray-700 mb-1">Oficina</label>
            <input 
              v-model="impresora.oficina" 
              id="oficina" 
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              required 
            />
          </div>
          
          <div>
            <label for="recurso" class="block text-sm font-medium text-gray-700 mb-1">Recurso</label>
            <input 
              v-model="impresora.recurso" 
              id="recurso" 
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              required 
            />
          </div>
          
          <div>
            <label for="modeloRecurso" class="block text-sm font-medium text-gray-700 mb-1">Modelo Recurso</label>
            <input 
              v-model="impresora.modeloRecurso" 
              id="modeloRecurso" 
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              required 
            />
          </div>
          
          <div>
            <label for="numeroSerie" class="block text-sm font-medium text-gray-700 mb-1">Número de Serie</label>
            <input 
              v-model="impresora.numeroSerie" 
              id="numeroSerie" 
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              required 
            />
          </div>
        </div>

        <div class="flex justify-between pt-4">
          <button 
            type="submit" 
            class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
            :disabled="loading"
          >
            {{ loading ? 'Actualizando...' : 'Actualizar Impresora' }}
          </button>
          
          <button 
            @click="eliminarImpresora" 
            type="button"
            class="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors"
            :disabled="loading"
          >
            Eliminar Impresora
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';

interface Impresora {
  id?: number;
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
  name: 'EditarImpresora',
  setup() {
    const impresora = ref<Impresora>({
      nombre: '',
      tipo: '',
      ip: '',
      piso: '',
      oficina: '',
      recurso: '',
      modeloRecurso: '',
      numeroSerie: ''
    });
    const loading = ref(false);
    const route = useRoute();
    const router = useRouter();

    const cargarImpresora = async () => {
      try {
        loading.value = true;
        const response = await axios.get(`http://localhost:5000/api/impresoras/${route.params.id}`);
        impresora.value = response.data.data;
      } catch (error) {
        console.error('Error al cargar la impresora', error);
        alert('Error al cargar la impresora');
      } finally {
        loading.value = false;
      }
    };

    const actualizarImpresora = async () => {
      try {
        loading.value = true;
        await axios.put(`http://localhost:5000/api/impresoras/${route.params.id}`, impresora.value);
        alert('Impresora actualizada correctamente');
        router.push('/impresoras');
      } catch (error) {
        console.error('Error al actualizar la impresora', error);
        alert('Error al actualizar la impresora');
      } finally {
        loading.value = false;
      }
    };

    const eliminarImpresora = async () => {
      try {
        const confirmation = confirm('¿Estás seguro de que deseas eliminar esta impresora?');
        if (confirmation) {
          loading.value = true;
          await axios.delete(`http://localhost:5000/api/impresoras/${route.params.id}`);
          alert('Impresora eliminada correctamente');
          router.push('/impresoras');
        }
      } catch (error) {
        console.error('Error al eliminar la impresora', error);
        alert('Error al eliminar la impresora');
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      cargarImpresora();
    });

    return {
      impresora,
      loading,
      actualizarImpresora,
      eliminarImpresora,
    };
  },
});
</script>