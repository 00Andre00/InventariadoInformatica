<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Equipos en Revisión</h1>

    <!-- Pestañas para equipos e impresoras -->
    <div class="mb-6">
      <div class="border-b border-gray-200">
        <nav class="-mb-px flex space-x-8">
          <button
            @click="tabActiva = 'equipos'"
            :class="{
              'border-blue-500 text-blue-600': tabActiva === 'equipos',
              'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300': tabActiva !== 'equipos'
            }"
            class="whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm"
          >
            Equipos ({{ equiposRevision.length }})
          </button>
          <button
            @click="tabActiva = 'impresoras'"
            :class="{
              'border-blue-500 text-blue-600': tabActiva === 'impresoras',
              'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300': tabActiva !== 'impresoras'
            }"
            class="whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm"
          >
            Impresoras ({{ impresorasRevision.length }})
          </button>
        </nav>
      </div>
    </div>

    <!-- Equipos en revisión -->
    <div v-if="tabActiva === 'equipos'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="equipo in equiposRevision" 
        :key="equipo.id"
        class="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500"
      >
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-lg font-semibold">{{ equipo.marca }} {{ equipo.modelo }}</h3>
          <span class="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
            En Revisión
          </span>
        </div>
        
        <div class="space-y-2 text-sm text-gray-600">
          <p><strong>Tipo:</strong> {{ equipo.tipo }}</p>
          <p><strong>Código Patrimonial:</strong> {{ equipo.codigoPatrimonial || 'N/A' }}</p>
          <p><strong>Usuario Anterior:</strong> {{ equipo.usuario_anterior || 'Sin asignar' }}</p>
          <p><strong>Estado:</strong> {{ equipo.estado }}</p>
        </div>

        <div class="flex gap-2 mt-4">
          <button 
            @click="repararEquipo(equipo.id)"
            class="btn-success flex-1"
          >
            <i class="fas fa-check mr-2"></i> Reparado
          </button>
          <button 
            @click="darDeBajaEquipo(equipo.id)"
            class="btn-danger flex-1"
          >
            <i class="fas fa-archive mr-2"></i> Dar de Baja
          </button>
        </div>
      </div>
    </div>

    <!-- Impresoras en revisión -->
    <div v-if="tabActiva === 'impresoras'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="impresora in impresorasRevision" 
        :key="impresora.id"
        class="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500"
      >
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-lg font-semibold">{{ impresora.modelo }}</h3>
          <span class="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
            En Revisión
          </span>
        </div>
        
        <div class="space-y-2 text-sm text-gray-600">
          <p><strong>Código Patrimonial:</strong> {{ impresora.codigoPatrimonial || 'N/A' }}</p>
          <p><strong>Usuario Anterior:</strong> {{ impresora.usuario_anterior || 'Sin asignar' }}</p>
          <p><strong>Estado:</strong> {{ impresora.estado }}</p>
          <p><strong>IP:</strong> {{ impresora.ip || 'N/A' }}</p>
        </div>

        <div class="flex gap-2 mt-4">
          <button 
            @click="repararImpresora(impresora.id)"
            class="btn-success flex-1"
          >
            <i class="fas fa-check mr-2"></i> Reparada
          </button>
          <button 
            @click="darDeBajaImpresora(impresora.id)"
            class="btn-danger flex-1"
          >
            <i class="fas fa-archive mr-2"></i> Dar de Baja
          </button>
        </div>
      </div>
    </div>

    <!-- Mensajes cuando no hay elementos -->
    <div v-if="tabActiva === 'equipos' && equiposRevision.length === 0 && !cargando" class="text-center py-8 bg-gray-50 rounded-lg">
      <i class="fas fa-tools text-gray-400 text-4xl mb-4"></i>
      <p class="text-gray-600">No hay equipos en revisión</p>
    </div>

    <div v-if="tabActiva === 'impresoras' && impresorasRevision.length === 0 && !cargando" class="text-center py-8 bg-gray-50 rounded-lg">
      <i class="fas fa-print text-gray-400 text-4xl mb-4"></i>
      <p class="text-gray-600">No hay impresoras en revisión</p>
    </div>

    <!-- Estado de carga -->
    <div v-if="cargando" class="text-center py-8 bg-gray-50 rounded-lg">
      <i class="fas fa-circle-notch fa-spin text-blue-500 text-2xl mb-2"></i>
      <p class="text-gray-600">Cargando...</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import axios from 'axios';

interface EquipoRevision {
  id: number;
  tipo: string;
  marca: string;
  modelo: string;
  codigoPatrimonial: string;
  estado: string;
  usuario_anterior?: string;
}

interface ImpresoraRevision {
  id: number;
  modelo: string;
  codigoPatrimonial: string;
  estado: string;
  usuario_anterior?: string;
  ip?: string;
}

export default defineComponent({
  name: 'RevisionEquipos',
  setup() {
    const equiposRevision = ref<EquipoRevision[]>([]);
    const impresorasRevision = ref<ImpresoraRevision[]>([]);
    const tabActiva = ref<'equipos' | 'impresoras'>('equipos');
    const cargando = ref(false);
    const error = ref('');

    const cargarDatosRevision = async () => {
      try {
        cargando.value = true;
        
        // Cargar equipos en revisión
        const [equiposResponse, impresorasResponse] = await Promise.all([
          axios.get('/sistema/equipos-revision'),
          axios.get('/sistema/impresoras-revision')
        ]);
        
        equiposRevision.value = equiposResponse.data.data;
        impresorasRevision.value = impresorasResponse.data.data;
      } catch (error: any) {
        console.error('Error al cargar datos de revisión:', error);
        error.value = 'Error al cargar datos: ' + (error.response?.data?.error || error.message);
        alert(error.value);
      } finally {
        cargando.value = false;
      }
    };

    const repararEquipo = async (equipoId: number) => {
      if (!confirm('¿Marcar este equipo como reparado?')) return;

      try {
        await axios.put(`/sistema/equipos/${equipoId}/reparar`);
        alert('Equipo marcado como reparado y disponible');
        cargarDatosRevision();
      } catch (error: any) {
        console.error('Error al reparar equipo:', error);
        alert('Error al marcar equipo como reparado: ' + (error.response?.data?.error || error.message));
      }
    };

    const darDeBajaEquipo = async (equipoId: number) => {
      if (!confirm('¿Dar de baja este equipo? Esta acción no se puede deshacer.')) return;

      try {
        await axios.put(`/sistema/equipos/${equipoId}/baja`);
        alert('Equipo dado de baja correctamente');
        cargarDatosRevision();
      } catch (error: any) {
        console.error('Error al dar de baja equipo:', error);
        alert('Error al dar de baja el equipo: ' + (error.response?.data?.error || error.message));
      }
    };

    const repararImpresora = async (impresoraId: number) => {
      if (!confirm('¿Marcar esta impresora como reparada?')) return;

      try {
        await axios.put(`/sistema/impresoras/${impresoraId}/reparar`);
        alert('Impresora marcada como reparada y disponible');
        cargarDatosRevision();
      } catch (error: any) {
        console.error('Error al reparar impresora:', error);
        alert('Error al marcar impresora como reparada: ' + (error.response?.data?.error || error.message));
      }
    };

    const darDeBajaImpresora = async (impresoraId: number) => {
      if (!confirm('¿Dar de baja esta impresora? Esta acción no se puede deshacer.')) return;

      try {
        await axios.put(`/sistema/impresoras/${impresoraId}/baja`);
        alert('Impresora dada de baja correctamente');
        cargarDatosRevision();
      } catch (error: any) {
        console.error('Error al dar de baja impresora:', error);
        alert('Error al dar de baja la impresora: ' + (error.response?.data?.error || error.message));
      }
    };

    onMounted(() => {
      cargarDatosRevision();
    });

    return {
      equiposRevision,
      impresorasRevision,
      tabActiva,
      cargando,
      error,
      repararEquipo,
      darDeBajaEquipo,
      repararImpresora,
      darDeBajaImpresora
    };
  }
});
</script>

<style scoped>
.btn-success {
  @apply bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm transition disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn-danger {
  @apply bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm transition disabled:opacity-50 disabled:cursor-not-allowed;
}
</style>