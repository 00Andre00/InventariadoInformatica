<template>
  <div class="container mx-auto p-4">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <h1 class="text-2xl font-bold text-gray-800">Equipos en Revisión</h1>
      <div class="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
        <button
          v-if="tabActiva === 'equipos' && equiposFiltrados.length > 0"
          @click="exportarEquiposRevision"
          class="btn-success"
        >
          <i class="fas fa-file-export mr-2"></i> Exportar Equipos
        </button>
        <button
          v-if="tabActiva === 'impresoras' && impresorasFiltradas.length > 0"
          @click="exportarImpresorasRevision"
          class="btn-success"
        >
          <i class="fas fa-file-export mr-2"></i> Exportar Impresoras
        </button>
      </div>
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

    <!-- Tabla de Equipos en Revisión -->
    <div v-if="tabActiva === 'equipos'" class="bg-white rounded-lg shadow overflow-hidden">
      <!-- Buscador -->
      <div class="p-4 border-b bg-gray-50">
        <div class="relative max-w-md">
          <input
            type="text"
            v-model="busquedaEquipos"
            placeholder="Buscar por código, marca, modelo..."
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
                Estado
              </th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="equiposFiltrados.length === 0 && !cargando">
              <td colspan="5" class="px-6 py-8 text-center text-gray-500">
                <i class="fas fa-search text-gray-300 text-2xl mb-2"></i>
                <p>{{ cargando ? 'Cargando...' : 'No hay equipos en revisión' }}</p>
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
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                  <i class="fas fa-tools mr-1"></i> En Revisión
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-center">
                <div class="flex justify-center space-x-2">
                  <button
                    @click="repararEquipo(equipo.id)"
                    class="btn-action bg-green-600 text-white hover:bg-green-700"
                    title="Marcar como Reparado"
                  >
                    <i class="fas fa-check"></i>
                  </button>
                  <button
                    @click="darDeBajaEquipo(equipo.id)"
                    class="btn-action bg-red-600 text-white hover:bg-red-700"
                    title="Dar de Baja"
                  >
                    <i class="fas fa-archive"></i>
                  </button>
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

    <!-- Tabla de Impresoras en Revisión -->
    <div v-if="tabActiva === 'impresoras'" class="bg-white rounded-lg shadow overflow-hidden">
      <!-- Buscador -->
      <div class="p-4 border-b bg-gray-50">
        <div class="relative max-w-md">
          <input
            type="text"
            v-model="busquedaImpresoras"
            placeholder="Buscar por código, modelo, IP..."
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
                IP
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="impresorasFiltradas.length === 0 && !cargando">
              <td colspan="5" class="px-6 py-8 text-center text-gray-500">
                <i class="fas fa-search text-gray-300 text-2xl mb-2"></i>
                <p>{{ cargando ? 'Cargando...' : 'No hay impresoras en revisión' }}</p>
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
              <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">
                {{ impresora.ip || 'N/A' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                  <i class="fas fa-tools mr-1"></i> En Revisión
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-center">
                <div class="flex justify-center space-x-2">
                  <button
                    @click="repararImpresora(impresora.id)"
                    class="btn-action bg-green-600 text-white hover:bg-green-700"
                    title="Marcar como Reparada"
                  >
                    <i class="fas fa-check"></i>
                  </button>
                  <button
                    @click="darDeBajaImpresora(impresora.id)"
                    class="btn-action bg-red-600 text-white hover:bg-red-700"
                    title="Dar de Baja"
                  >
                    <i class="fas fa-archive"></i>
                  </button>
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

    <!-- Estado de carga -->
    <div v-if="cargando" class="text-center py-8 bg-gray-50 rounded-lg">
      <i class="fas fa-circle-notch fa-spin text-blue-500 text-2xl mb-2"></i>
      <p class="text-gray-600">Cargando...</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import axios from 'axios';
import ExcelJS from 'exceljs';
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus';

interface EquipoRevision {
  id: number;
  tipo: string;
  marca: string;
  modelo: string;
  codigoPatrimonial: string;
  estado: string;
}

interface ImpresoraRevision {
  id: number;
  modelo: string;
  codigoPatrimonial: string;
  estado: string;
  ip?: string;
}

export default defineComponent({
  name: 'RevisionEquipos',
  setup() {
    const equiposRevision = ref<EquipoRevision[]>([]);
    const impresorasRevision = ref<ImpresoraRevision[]>([]);
    const tabActiva = ref<'equipos' | 'impresoras'>('equipos');
    const cargando = ref(false);
    const busquedaEquipos = ref('');
    const busquedaImpresoras = ref('');

    // Computed para equipos filtrados
    const equiposFiltrados = computed(() => {
      if (!busquedaEquipos.value.trim()) return equiposRevision.value;
      const termino = busquedaEquipos.value.toLowerCase().trim();
      return equiposRevision.value.filter(equipo =>
        equipo.codigoPatrimonial?.toLowerCase().includes(termino) ||
        equipo.marca?.toLowerCase().includes(termino) ||
        equipo.modelo?.toLowerCase().includes(termino) ||
        equipo.tipo?.toLowerCase().includes(termino)
      );
    });

    // Computed para impresoras filtradas
    const impresorasFiltradas = computed(() => {
      if (!busquedaImpresoras.value.trim()) return impresorasRevision.value;
      const termino = busquedaImpresoras.value.toLowerCase().trim();
      return impresorasRevision.value.filter(impresora =>
        impresora.codigoPatrimonial?.toLowerCase().includes(termino) ||
        impresora.modelo?.toLowerCase().includes(termino) ||
        impresora.ip?.toLowerCase().includes(termino)
      );
    });

    const cargarDatosRevision = async () => {
      try {
        cargando.value = true;
        
        const [equiposResponse, impresorasResponse] = await Promise.all([
          axios.get('/sistema/equipos-revision'),
          axios.get('/sistema/impresoras-revision')
        ]);
        
        equiposRevision.value = equiposResponse.data.data || [];
        impresorasRevision.value = impresorasResponse.data.data || [];
      } catch (error: any) {
        console.error('Error al cargar datos de revisión:', error);
        ElMessage.error('Error al cargar datos: ' + (error.response?.data?.error || error.message));
      } finally {
        cargando.value = false;
      }
    };

    const repararEquipo = async (equipoId: number) => {
      try {
        await ElMessageBox.confirm(
          '¿Marcar este equipo como reparado? Se cambiará a estado "Disponible".',
          'Confirmar Reparación',
          {
            confirmButtonText: 'Sí, Reparado',
            cancelButtonText: 'Cancelar',
            type: 'warning'
          }
        );

        await axios.put(`/sistema/equipos/${equipoId}/reparar`);
        ElMessage.success('Equipo marcado como reparado y disponible');
        cargarDatosRevision();
      } catch (error: any) {
        if (error !== 'cancel') {
          console.error('Error al reparar equipo:', error);
          ElMessage.error('Error al marcar equipo como reparado: ' + (error.response?.data?.error || error.message));
        }
      }
    };

    const darDeBajaEquipo = async (equipoId: number) => {
      try {
        await ElMessageBox.confirm(
          '¿Dar de baja este equipo? Esta acción no se puede deshacer.',
          'Confirmar Baja',
          {
            confirmButtonText: 'Sí, Dar de Baja',
            cancelButtonText: 'Cancelar',
            type: 'error'
          }
        );

        await axios.put(`/sistema/equipos/${equipoId}/baja`);
        ElMessage.success('Equipo dado de baja correctamente');
        cargarDatosRevision();
      } catch (error: any) {
        if (error !== 'cancel') {
          console.error('Error al dar de baja equipo:', error);
          ElMessage.error('Error al dar de baja el equipo: ' + (error.response?.data?.error || error.message));
        }
      }
    };

    const repararImpresora = async (impresoraId: number) => {
      try {
        await ElMessageBox.confirm(
          '¿Marcar esta impresora como reparada? Se cambiará a estado "Disponible".',
          'Confirmar Reparación',
          {
            confirmButtonText: 'Sí, Reparada',
            cancelButtonText: 'Cancelar',
            type: 'warning'
          }
        );

        await axios.put(`/sistema/impresoras/${impresoraId}/reparar`);
        ElMessage.success('Impresora marcada como reparada y disponible');
        cargarDatosRevision();
      } catch (error: any) {
        if (error !== 'cancel') {
          console.error('Error al reparar impresora:', error);
          ElMessage.error('Error al marcar impresora como reparada: ' + (error.response?.data?.error || error.message));
        }
      }
    };

    const darDeBajaImpresora = async (impresoraId: number) => {
      try {
        await ElMessageBox.confirm(
          '¿Dar de baja esta impresora? Esta acción no se puede deshacer.',
          'Confirmar Baja',
          {
            confirmButtonText: 'Sí, Dar de Baja',
            cancelButtonText: 'Cancelar',
            type: 'error'
          }
        );

        await axios.put(`/sistema/impresoras/${impresoraId}/baja`);
        ElMessage.success('Impresora dada de baja correctamente');
        cargarDatosRevision();
      } catch (error: any) {
        if (error !== 'cancel') {
          console.error('Error al dar de baja impresora:', error);
          ElMessage.error('Error al dar de baja la impresora: ' + (error.response?.data?.error || error.message));
        }
      }
    };

    // FUNCIONES DE REPORTES PDF CORREGIDAS - USANDO LOS MISMOS ENDPOINTS QUE LISTAIMPRESORAS
    const generarReporteEquipo = async (equipo: EquipoRevision) => {
      let loadingInstance: any = null;
      
      try {
        loadingInstance = ElLoading.service({
          lock: true,
          text: "Generando reporte PDF...",
          background: "rgba(0, 0, 0, 0.7)",
        });

    // ✅ RUTA CORRECTA - SIN /cambio/
const response = await axios.get(
  `/sistema/reportes/equipo/${equipo.id}`,
  {
    responseType: "blob",
  }
);

        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `reporte-equipo-revision-${equipo.codigoPatrimonial || equipo.id}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        if (loadingInstance) {
          loadingInstance.close();
        }
        ElMessage.success("Reporte del equipo generado exitosamente");
      } catch (error: any) {
        console.error("Error al generar reporte del equipo:", error);
        
        if (loadingInstance) {
          loadingInstance.close();
        }
        ElMessage.error("Error al generar el reporte del equipo");
      }
    };

    const generarReporteImpresora = async (impresora: ImpresoraRevision) => {
      let loadingInstance: any = null;
      
      try {
        loadingInstance = ElLoading.service({
          lock: true,
          text: "Generando reporte PDF...",
          background: "rgba(0, 0, 0, 0.7)",
        });

      // ✅ RUTA CORRECTA - SIN /cambio/
const response = await axios.get(
  `/sistema/reportes/impresora/${impresora.id}`,
  {
    responseType: "blob",
  }
);

        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `reporte-impresora-revision-${impresora.codigoPatrimonial || impresora.id}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        if (loadingInstance) {
          loadingInstance.close();
        }
        ElMessage.success("Reporte de la impresora generado exitosamente");
      } catch (error: any) {
        console.error("Error al generar reporte de impresora:", error);
        
        if (loadingInstance) {
          loadingInstance.close();
        }
        ElMessage.error("Error al generar el reporte de la impresora");
      }
    };

    // FUNCIONES DE EXPORTACIÓN EXCEL
    const exportarEquiposRevision = async () => {
      if (equiposRevision.value.length === 0) {
        ElMessage.warning("No hay equipos para exportar");
        return;
      }

      try {
        const loadingInstance = ElLoading.service({
          lock: true,
          text: "Exportando equipos a Excel...",
          background: "rgba(0, 0, 0, 0.7)",
        });

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Equipos en Revisión");

        worksheet.columns = [
          { header: "ID", key: "id", width: 8 },
          { header: "Código Patrimonial", key: "codigoPatrimonial", width: 20 },
          { header: "Tipo", key: "tipo", width: 15 },
          { header: "Marca", key: "marca", width: 15 },
          { header: "Modelo", key: "modelo", width: 20 },
          { header: "Estado", key: "estado", width: 12 },
        ];

        // Estilo para el header
        worksheet.getRow(1).eachCell((cell) => {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FF3B82F6" },
          };
          cell.font = {
            bold: true,
            color: { argb: "FFFFFFFF" },
            size: 12,
          };
          cell.alignment = { vertical: "middle", horizontal: "center" };
          cell.border = {
            top: { style: "thin", color: { argb: "FF1E40AF" } },
            bottom: { style: "thin", color: { argb: "FF1E40AF" } },
            left: { style: "thin", color: { argb: "FF1E40AF" } },
            right: { style: "thin", color: { argb: "FF1E40AF" } },
          };
        });

        equiposRevision.value.forEach((equipo, index) => {
          const row = worksheet.addRow({
            id: equipo.id,
            codigoPatrimonial: equipo.codigoPatrimonial || 'N/A',
            tipo: equipo.tipo,
            marca: equipo.marca,
            modelo: equipo.modelo,
            estado: equipo.estado,
          });

          row.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: index % 2 === 0 ? "FFF3F4F6" : "FFFFFFFF" },
          };

          row.eachCell({ includeEmpty: true }, (cell) => {
            cell.border = {
              top: { style: "thin", color: { argb: "FFE5E7EB" } },
              bottom: { style: "thin", color: { argb: "FFE5E7EB" } },
              left: { style: "thin", color: { argb: "FFE5E7EB" } },
              right: { style: "thin", color: { argb: "FFE5E7EB" } },
            };
            cell.alignment = { vertical: "middle", horizontal: "left" };
          });
        });

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `equipos-revision_${new Date().toISOString().split("T")[0]}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);

        loadingInstance.close();
        ElMessage.success("Equipos exportados exitosamente");
      } catch (err) {
        console.error("Error al exportar equipos:", err);
        ElMessage.error("Error al exportar equipos a Excel");
      }
    };

    const exportarImpresorasRevision = async () => {
      if (impresorasRevision.value.length === 0) {
        ElMessage.warning("No hay impresoras para exportar");
        return;
      }

      try {
        const loadingInstance = ElLoading.service({
          lock: true,
          text: "Exportando impresoras a Excel...",
          background: "rgba(0, 0, 0, 0.7)",
        });

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Impresoras en Revisión");

        worksheet.columns = [
          { header: "ID", key: "id", width: 8 },
          { header: "Código Patrimonial", key: "codigoPatrimonial", width: 20 },
          { header: "Modelo", key: "modelo", width: 25 },
          { header: "IP", key: "ip", width: 15 },
          { header: "Estado", key: "estado", width: 12 },
        ];

        // Estilo para el header
        worksheet.getRow(1).eachCell((cell) => {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FF3B82F6" },
          };
          cell.font = {
            bold: true,
            color: { argb: "FFFFFFFF" },
            size: 12,
          };
          cell.alignment = { vertical: "middle", horizontal: "center" };
          cell.border = {
            top: { style: "thin", color: { argb: "FF1E40AF" } },
            bottom: { style: "thin", color: { argb: "FF1E40AF" } },
            left: { style: "thin", color: { argb: "FF1E40AF" } },
            right: { style: "thin", color: { argb: "FF1E40AF" } },
          };
        });

        impresorasRevision.value.forEach((impresora, index) => {
          const row = worksheet.addRow({
            id: impresora.id,
            codigoPatrimonial: impresora.codigoPatrimonial || 'N/A',
            modelo: impresora.modelo,
            ip: impresora.ip || 'N/A',
            estado: impresora.estado,
          });

          row.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: index % 2 === 0 ? "FFF3F4F6" : "FFFFFFFF" },
          };

          row.eachCell({ includeEmpty: true }, (cell) => {
            cell.border = {
              top: { style: "thin", color: { argb: "FFE5E7EB" } },
              bottom: { style: "thin", color: { argb: "FFE5E7EB" } },
              left: { style: "thin", color: { argb: "FFE5E7EB" } },
              right: { style: "thin", color: { argb: "FFE5E7EB" } },
            };
            cell.alignment = { vertical: "middle", horizontal: "left" };
          });
        });

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `impresoras-revision_${new Date().toISOString().split("T")[0]}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);

        loadingInstance.close();
        ElMessage.success("Impresoras exportadas exitosamente");
      } catch (err) {
        console.error("Error al exportar impresoras:", err);
        ElMessage.error("Error al exportar impresoras a Excel");
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
      busquedaEquipos,
      busquedaImpresoras,
      equiposFiltrados,
      impresorasFiltradas,
      repararEquipo,
      darDeBajaEquipo,
      repararImpresora,
      darDeBajaImpresora,
      generarReporteEquipo,
      generarReporteImpresora,
      exportarEquiposRevision,
      exportarImpresorasRevision
    };
  }
});
</script>

<style scoped>
.btn-success {
  @apply inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn-action {
  @apply inline-flex items-center justify-center p-2 rounded-full transition-colors focus:outline-none;
}

.input-search {
  @apply pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent;
}

/* Estilos para estados */
.bg-yellow-100 {
  background-color: #fef3c7;
}
.text-yellow-800 {
  color: #92400e;
}
</style>