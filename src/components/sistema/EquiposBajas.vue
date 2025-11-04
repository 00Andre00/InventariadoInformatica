<template>
  <div class="container mx-auto p-4">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <h1 class="text-2xl font-bold text-gray-800">Recursos Dados de Baja</h1>
    </div>

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
            <i class="fas fa-laptop mr-2"></i>
            Equipos ({{ equiposFiltrados.length }})
          </button>
          <button
            @click="tabActiva = 'impresoras'"
            :class="{
              'border-blue-500 text-blue-600': tabActiva === 'impresoras',
              'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300': tabActiva !== 'impresoras'
            }"
            class="whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm"
          >
            <i class="fas fa-print mr-2"></i>
            Impresoras ({{ impresorasFiltradas.length }})
          </button>
        </nav>
      </div>
    </div>

    <!-- Estado de carga -->
    <div v-if="cargando" class="text-center py-8 bg-gray-50 rounded-lg">
      <i class="fas fa-circle-notch fa-spin text-blue-500 text-2xl mb-2"></i>
      <p class="text-gray-600">Cargando recursos de baja...</p>
    </div>

    <!-- Tabla de Equipos de Baja -->
    <div v-else-if="tabActiva === 'equipos'" class="bg-white rounded-lg shadow overflow-hidden">
      <!-- Buscador -->
      <div class="p-4 border-b bg-gray-50">
        <div class="relative max-w-md">
          <input
            type="text"
            v-model="busquedaEquipos"
            placeholder="Buscar por código, marca, modelo, procesador..."
            class="input-search"
          />
          <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Código Patrimonial
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Marca / Modelo
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Especificaciones
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha de Baja
              </th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="equiposFiltrados.length === 0">
              <td colspan="6" class="px-6 py-8 text-center text-gray-500">
                <i class="fas fa-search text-gray-300 text-2xl mb-2"></i>
                <p>No hay equipos dados de baja</p>
              </td>
            </tr>
            <tr
              v-for="equipo in equiposFiltrados"
              :key="equipo.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm font-mono font-medium">
                {{ equipo.codigoPatrimonial || 'N/A' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ equipo.tipo }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ equipo.marca }}</div>
                <div class="text-sm text-gray-500">{{ equipo.modelo }}</div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600">
                <div><strong>Procesador:</strong> {{ equipo.procesador || 'N/A' }}</div>
                <div><strong>RAM:</strong> {{ equipo.ram || 'N/A' }}</div>
                <div><strong>Almacenamiento:</strong> {{ equipo.almacenamiento || 'N/A' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ obtenerFechaBaja(equipo.id, 'equipo') }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-center">
                <div class="flex justify-center space-x-2">
                  <!-- SOLO REPORTE PDF -->
                  <button
                    @click="generarReporteEquipo(equipo)"
                    class="btn-action bg-gray-600 text-white hover:bg-gray-700"
                    title="Generar Reporte PDF"
                  >
                    <i class="fas fa-file-pdf"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Tabla de Impresoras de Baja -->
    <div v-else-if="tabActiva === 'impresoras'" class="bg-white rounded-lg shadow overflow-hidden">
      <!-- Buscador -->
      <div class="p-4 border-b bg-gray-50">
        <div class="relative max-w-md">
          <input
            type="text"
            v-model="busquedaImpresoras"
            placeholder="Buscar por código, modelo, IP, oficina..."
            class="input-search"
          />
          <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Código Patrimonial
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Modelo
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                IP / MAC
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Oficina
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha de Baja
              </th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="impresorasFiltradas.length === 0">
              <td colspan="6" class="px-6 py-8 text-center text-gray-500">
                <i class="fas fa-search text-gray-300 text-2xl mb-2"></i>
                <p>No hay impresoras dadas de baja</p>
              </td>
            </tr>
            <tr
              v-for="impresora in impresorasFiltradas"
              :key="impresora.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm font-mono font-medium">
                {{ impresora.codigoPatrimonial || 'N/A' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ impresora.modelo }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <div class="font-mono">{{ impresora.ip || 'N/A' }}</div>
                <div class="text-xs font-mono text-gray-500">{{ impresora.mac || 'N/A' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ impresora.oficina }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ obtenerFechaBaja(impresora.id, 'impresora') }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-center">
                <div class="flex justify-center space-x-2">
                  <!-- SOLO REPORTE PDF -->
                  <button
                    @click="generarReporteImpresora(impresora)"
                    class="btn-action bg-gray-600 text-white hover:bg-gray-700"
                    title="Generar Reporte PDF"
                  >
                    <i class="fas fa-file-pdf"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from "vue";
import axios from "axios";
import { ElMessage, ElLoading } from "element-plus";

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
    const busquedaEquipos = ref('');
    const busquedaImpresoras = ref('');

    // Computed para equipos filtrados
    const equiposFiltrados = computed(() => {
      if (!busquedaEquipos.value.trim()) return equiposBaja.value;
      const termino = busquedaEquipos.value.toLowerCase().trim();
      return equiposBaja.value.filter(equipo =>
        equipo.codigoPatrimonial?.toLowerCase().includes(termino) ||
        equipo.marca?.toLowerCase().includes(termino) ||
        equipo.modelo?.toLowerCase().includes(termino) ||
        equipo.tipo?.toLowerCase().includes(termino) ||
        equipo.procesador?.toLowerCase().includes(termino)
      );
    });

    // Computed para impresoras filtradas
    const impresorasFiltradas = computed(() => {
      if (!busquedaImpresoras.value.trim()) return impresorasBaja.value;
      const termino = busquedaImpresoras.value.toLowerCase().trim();
      return impresorasBaja.value.filter(impresora =>
        impresora.codigoPatrimonial?.toLowerCase().includes(termino) ||
        impresora.modelo?.toLowerCase().includes(termino) ||
        impresora.ip?.toLowerCase().includes(termino) ||
        impresora.oficina?.toLowerCase().includes(termino)
      );
    });

    const cargarRecursosBaja = async () => {
      cargando.value = true;
      try {
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

      } catch (error: any) {
        console.error("Error al cargar recursos de baja:", error);
        ElMessage.error('Error al cargar recursos de baja: ' + (error.response?.data?.error || error.message));
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

    // FUNCIONES DE REPORTES PDF
    const generarReporteEquipo = async (equipo: EquipoBaja) => {
      let loadingInstance: any = null;
      
      try {
        loadingInstance = ElLoading.service({
          lock: true,
          text: "Generando reporte PDF...",
          background: "rgba(0, 0, 0, 0.7)",
        });

        // Intentar con endpoint de cambio primero
        try {
          const response = await axios.get(
            `/sistema/reportes/cambio/equipo/${equipo.id}`,
            { responseType: "blob" }
          );

          const blob = new Blob([response.data], { type: "application/pdf" });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `reporte-baja-equipo-${equipo.codigoPatrimonial || equipo.id}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);

          ElMessage.success("Reporte del equipo generado exitosamente");
        } catch (cambioError: any) {
          // Si falla, intentar con endpoint normal
          const response = await axios.get(
            `/sistema/reportes/equipo/${equipo.id}`,
            { responseType: "blob" }
          );

          const blob = new Blob([response.data], { type: "application/pdf" });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `reporte-baja-equipo-${equipo.codigoPatrimonial || equipo.id}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);

          ElMessage.success("Reporte del equipo generado exitosamente");
        }

      } catch (error: any) {
        console.error("Error al generar reporte del equipo:", error);
        ElMessage.error("Error al generar el reporte del equipo");
      } finally {
        if (loadingInstance) {
          loadingInstance.close();
        }
      }
    };

    const generarReporteImpresora = async (impresora: ImpresoraBaja) => {
      let loadingInstance: any = null;
      
      try {
        loadingInstance = ElLoading.service({
          lock: true,
          text: "Generando reporte PDF...",
          background: "rgba(0, 0, 0, 0.7)",
        });

        const response = await axios.get(
          `/sistema/reportes/cambio/impresora/${impresora.id}`,
          { responseType: "blob" }
        );

        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `reporte-baja-impresora-${impresora.codigoPatrimonial || impresora.id}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        ElMessage.success("Reporte de la impresora generado exitosamente");
      } catch (error: any) {
        console.error("Error al generar reporte de impresora:", error);
        ElMessage.error("Error al generar el reporte de la impresora");
      } finally {
        if (loadingInstance) {
          loadingInstance.close();
        }
      }
    };

    onMounted(() => {
      cargarRecursosBaja();
    });

    return {
      equiposBaja,
      impresorasBaja,
      tabActiva,
      cargando,
      busquedaEquipos,
      busquedaImpresoras,
      equiposFiltrados,
      impresorasFiltradas,
      obtenerFechaBaja,
      generarReporteEquipo,
      generarReporteImpresora
    };
  },
});
</script>

<style scoped>
.btn-action {
  @apply inline-flex items-center justify-center p-2 rounded-full transition-colors focus:outline-none;
}

.input-search {
  @apply pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent;
}
</style>