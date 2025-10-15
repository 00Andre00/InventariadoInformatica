<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Recursos Dados de Baja</h1>

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
            Equipos ({{ equiposBaja.length }})
          </button>
          <button
            @click="tabActiva = 'impresoras'"
            :class="{
              'border-blue-500 text-blue-600': tabActiva === 'impresoras',
              'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300': tabActiva !== 'impresoras'
            }"
            class="whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm"
          >
            Impresoras ({{ impresorasBaja.length }})
          </button>
        </nav>
      </div>
    </div>

    <!-- Estado de carga -->
    <div v-if="cargando" class="text-center py-8 bg-gray-50 rounded-lg">
      <i class="fas fa-circle-notch fa-spin text-blue-500 text-2xl mb-2"></i>
      <p class="text-gray-600">Cargando recursos de baja...</p>
    </div>

    <!-- Tabla de equipos de baja -->
    <div v-else-if="tabActiva === 'equipos'" class="bg-white rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                ID
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Tipo
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Marca/Modelo
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Código Patrimonial
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Especificaciones
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Fecha de Baja
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="equipo in equiposBaja" :key="equipo.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                {{ equipo.id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <span class="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                  {{ equipo.tipo }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <div class="font-medium">{{ equipo.marca }}</div>
                <div class="text-gray-500">{{ equipo.modelo }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-mono">
                {{ equipo.codigoPatrimonial || "N/A" }}
              </td>
              <td class="px-6 py-4 text-sm">
                <div>{{ equipo.procesador }}</div>
                <div class="text-gray-500">
                  {{ equipo.ram }} / {{ equipo.almacenamiento }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ obtenerFechaBaja(equipo.id, 'equipo') }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <button
                  @click="generarReporte(equipo.id, 'equipo')"
                  class="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 transition"
                  title="Generar Reporte PDF"
                >
                  <i class="fas fa-file-pdf mr-1"></i> PDF
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="equiposBaja.length === 0" class="text-center py-8 bg-gray-50">
        <i class="fas fa-archive text-gray-400 text-4xl mb-4"></i>
        <p class="text-gray-600">No hay equipos dados de baja</p>
      </div>
    </div>

    <!-- Tabla de impresoras de baja -->
    <div v-else-if="tabActiva === 'impresoras'" class="bg-white rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                ID
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Modelo
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                IP/MAC
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Código Patrimonial
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Oficina
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Fecha de Baja
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="impresora in impresorasBaja" :key="impresora.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                {{ impresora.id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <div class="font-medium">{{ impresora.modelo }}</div>
                <span class="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                  Impresora
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <div class="font-mono">{{ impresora.ip || "-" }}</div>
                <div class="text-xs font-mono text-gray-500">
                  {{ impresora.mac || "-" }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-mono">
                {{ impresora.codigoPatrimonial || "N/A" }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                {{ impresora.oficina }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ obtenerFechaBaja(impresora.id, 'impresora') }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <button
                  @click="generarReporte(impresora.id, 'impresora')"
                  class="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 transition"
                  title="Generar Reporte PDF"
                >
                  <i class="fas fa-file-pdf mr-1"></i> PDF
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="impresorasBaja.length === 0" class="text-center py-8 bg-gray-50">
        <i class="fas fa-print text-gray-400 text-4xl mb-4"></i>
        <p class="text-gray-600">No hay impresoras dadas de baja</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import axios from "axios";

interface EquipoBaja {
  id: number;
  tipo: string;
  marca: string;
  modelo: string;
  codigoPatrimonial: string;
  procesador: string;
  ram: string;
  almacenamiento: string;
  estado_especial: string;
}

interface ImpresoraBaja {
  id: number;
  modelo: string;
  codigoPatrimonial: string;
  ip: string;
  mac: string;
  oficina: string;
  estado_especial: string;
}

export default defineComponent({
  name: "EquiposBajas",
  setup() {
    const equiposBaja = ref<EquipoBaja[]>([]);
    const impresorasBaja = ref<ImpresoraBaja[]>([]);
    const tabActiva = ref<'equipos' | 'impresoras'>('equipos');
    const cargando = ref(false);
    const fechasBajaCache = ref<Record<string, string>>({});

    const cargarRecursosBaja = async () => {
      cargando.value = true;
      try {
        // Cargar equipos e impresoras en paralelo
        const [equiposResponse, impresorasResponse] = await Promise.all([
          axios.get("/equipos"),
          axios.get("/impresoras")
        ]);

        // Filtrar recursos de baja
        equiposBaja.value = equiposResponse.data.data.filter(
          (equipo: any) => equipo.estado_especial === "baja"
        );
        impresorasBaja.value = impresorasResponse.data.data.filter(
          (impresora: any) => impresora.estado_especial === "baja"
        );

        // Cargar fechas de baja para todos los recursos
        await Promise.all([
          ...equiposBaja.value.map(async (equipo) => {
            await cargarFechaBaja(equipo.id, 'equipo');
          }),
          ...impresorasBaja.value.map(async (impresora) => {
            await cargarFechaBaja(impresora.id, 'impresora');
          })
        ]);

        console.log("🔄 Recursos de baja cargados:", {
          equipos: equiposBaja.value.length,
          impresoras: impresorasBaja.value.length
        });

      } catch (error) {
        console.error("Error al cargar recursos de baja:", error);
        alert("Error al cargar recursos dados de baja");
      } finally {
        cargando.value = false;
      }
    };

    const cargarFechaBaja = async (id: number, tipo: 'equipo' | 'impresora') => {
      try {
        const response = await axios.get(`/sistema/fecha-baja/${tipo}/${id}`);
        const cacheKey = `${tipo}_${id}`;
        
        if (response.data.tieneBaja && response.data.fechaBaja) {
          fechasBajaCache.value[cacheKey] = response.data.fechaBaja;
        } else {
          fechasBajaCache.value[cacheKey] = "Fecha no disponible";
        }
      } catch (error) {
        console.error(`Error al cargar fecha de baja para ${tipo} ${id}:`, error);
        const cacheKey = `${tipo}_${id}`;
        fechasBajaCache.value[cacheKey] = "Error al cargar fecha";
      }
    };

    const obtenerFechaBaja = (id: number, tipo: 'equipo' | 'impresora') => {
      const cacheKey = `${tipo}_${id}`;
      const fecha = fechasBajaCache.value[cacheKey];
      
      if (!fecha || fecha === "Fecha no disponible" || fecha === "Error al cargar fecha") {
        return fecha || "Fecha no disponible";
      }

      try {
        const fechaObj = new Date(fecha);
        if (isNaN(fechaObj.getTime())) {
          return "Fecha inválida";
        }
        return fechaObj.toLocaleDateString("es-ES", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      } catch {
        return "Fecha inválida";
      }
    };

    const generarReporte = (id: number, tipo: 'equipo' | 'impresora') => {
      window.open(`/sistema/reportes/cambio/${tipo}/${id}`, "_blank");
    };

    onMounted(() => {
      cargarRecursosBaja();
    });

    return {
      equiposBaja,
      impresorasBaja,
      tabActiva,
      cargando,
      obtenerFechaBaja,
      generarReporte
    };
  },
});
</script>

<style scoped>
.btn-secondary {
  @apply bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm transition;
}
</style>