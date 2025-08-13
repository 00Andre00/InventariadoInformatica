<template>
  <div class="container mx-auto p-4">
    <!-- Encabezado mejorado -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <h1 class="text-2xl font-bold text-gray-800">Inventario de Impresoras</h1>
      <div class="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
        <router-link 
          to="/impresoras/agregar" 
          class="btn-primary"
        >
          <i class="fas fa-plus mr-2"></i> Agregar Impresora
        </router-link>
        <button 
          @click="exportarImpresoras" 
          class="btn-success"
          :disabled="impresoras.length === 0"
        >
          <i class="fas fa-file-export mr-2"></i> Exportar
        </button>
      </div>
    </div>

    <!-- Mensajes de estado -->
    <div v-if="loading" class="text-center py-8 bg-gray-50 rounded-lg">
      <i class="fas fa-circle-notch fa-spin text-blue-500 text-2xl mb-2"></i>
      <p class="text-gray-600">Cargando impresoras...</p>
    </div>

    <div v-else-if="error" class="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-4">
      <div class="flex items-center">
        <i class="fas fa-exclamation-circle text-red-500 mr-2"></i>
        <p class="text-red-700">{{ error }}</p>
      </div>
      <button 
        @click="cargarImpresoras" 
        class="mt-2 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
      >
        <i class="fas fa-sync-alt mr-1"></i> Reintentar
      </button>
    </div>

    <div v-else-if="impresoras.length === 0" class="text-center py-8 bg-gray-50 rounded-lg">
      <i class="fas fa-print text-gray-400 text-2xl mb-2"></i>
      <p class="text-gray-600 mb-4">No hay impresoras registradas</p>
      <router-link 
        to="/impresoras/agregar" 
        class="btn-primary inline-flex items-center"
      >
        <i class="fas fa-plus mr-2"></i> Agregar Primera Impresora
      </router-link>
    </div>

    <!-- Tabla de impresoras -->
    <div v-else class="bg-white rounded-lg shadow overflow-hidden">
      <!-- Barra de búsqueda -->
      <div class="p-4 border-b bg-gray-50">
        <div class="relative max-w-md">
          <input 
            type="text" 
            v-model="busqueda" 
            placeholder="Buscar impresoras..." 
            class="input-search"
          />
          <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
        </div>
      </div>

      <!-- Tabla responsive -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modelo</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP/MAC</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Oficina</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código Patrimonial</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="impresorasPaginadas.length === 0">
              <td colspan="7" class="px-6 py-8 text-center text-gray-500">
                <i class="fas fa-search-minus text-gray-300 text-2xl mb-2"></i>
                <p>No se encontraron impresoras con los filtros actuales</p>
              </td>
            </tr>
            <tr 
              v-for="impresora in impresorasPaginadas" 
              :key="impresora.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{{ impresora.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <div class="font-medium">{{ impresora.modelo }}</div>
                <div v-if="impresora.tipo" class="text-xs text-gray-500">
                  {{ impresora.tipo }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <div class="font-mono">{{ impresora.ip || '-' }}</div>
                <div class="text-xs font-mono text-gray-500">{{ impresora.mac || '-' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                {{ impresora.oficina }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                {{ impresora.codigoPatrimonial || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <div v-if="impresora.usuario">
                  {{ impresora.usuario.nombres }} {{ impresora.usuario.apellidos }}
                  <div class="text-xs text-gray-500">{{ impresora.usuario.dni }}</div>
                </div>
                <div v-else class="text-gray-400">Sin asignar</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-center">
                <div class="flex justify-center space-x-2">
                  <button 
                    @click="editarImpresora(impresora.id)"
                    class="btn-action bg-blue-600 text-white hover:bg-blue-700"
                    title="Editar"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button 
                    @click="confirmarEliminacion(impresora)"
                    class="btn-action bg-red-600 text-white hover:bg-red-700"
                    title="Eliminar"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Paginación -->
      <div class="px-4 py-3 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-3">
        <div class="text-sm text-gray-500">
          Mostrando {{ ((paginaActual - 1) * itemsPorPagina) + 1 }} - 
          {{ Math.min(paginaActual * itemsPorPagina, impresorasFiltradas.length) }} 
          de {{ impresorasFiltradas.length }} impresoras
        </div>
        
        <div class="flex items-center gap-1">
          <button 
            @click="cambiarPagina(paginaActual - 1)" 
            :disabled="paginaActual === 1"
            class="pagination-button"
          >
            <i class="fas fa-chevron-left"></i>
          </button>
          
          <template v-for="page in totalPaginas" :key="page">
            <button 
              v-if="Math.abs(page - paginaActual) <= 2 || page === 1 || page === totalPaginas"
              @click="cambiarPagina(page)"
              :class="{'bg-blue-500 text-white': paginaActual === page, 'bg-white text-gray-700': paginaActual !== page}"
              class="pagination-button"
            >
              {{ page }}
            </button>
            <span 
              v-else-if="Math.abs(page - paginaActual) === 3" 
              class="px-2 text-gray-500"
            >
              ...
            </span>
          </template>
          
          <button 
            @click="cambiarPagina(paginaActual + 1)" 
            :disabled="paginaActual >= totalPaginas"
            class="pagination-button"
          >
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de confirmación de eliminación -->
    <div v-if="impresoraAEliminar" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <div class="flex items-center mb-4">
          <i class="fas fa-exclamation-triangle text-yellow-500 mr-2"></i>
          <h3 class="text-lg font-semibold">Confirmar Eliminación</h3>
        </div>
        
        <p class="text-gray-600 mb-4">
          ¿Estás seguro de eliminar la impresora <strong class="text-gray-800">{{ impresoraAEliminar.modelo }}</strong>?
        </p>
        <p class="text-sm text-gray-500 mb-6">
          <i class="fas fa-info-circle mr-1"></i> Esta acción no se puede deshacer.
        </p>
        
        <div class="flex gap-3 justify-end">
          <button 
            @click="cancelarEliminacion" 
            class="btn-cancel"
          >
            Cancelar
          </button>
          <button 
            @click="eliminarImpresora" 
            class="btn-confirm"
            :disabled="eliminando"
          >
            <span v-if="eliminando">
              <i class="fas fa-circle-notch fa-spin mr-2"></i> Eliminando...
            </span>
            <span v-else>Eliminar</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import ExcelJS from 'exceljs';

interface Usuario {
  id: number;
  dni: string;
  nombres: string;
  apellidos: string;
}

interface Impresora {
  id: number;
  modelo: string;
  ip: string;
  mac: string;
  oficina: string;
  codigoPatrimonial: string;
  usuarioId?: number;
  usuario?: Usuario;
  tipo?: string;
}

export default defineComponent({
  name: 'ListaImpresoras',
  setup() {
    const router = useRouter();
    const impresoras = ref<Impresora[]>([]);
    const busqueda = ref('');
    const paginaActual = ref(1);
    const itemsPorPagina = 10;
    const loading = ref(true);
    const error = ref('');
    const impresoraAEliminar = ref<Impresora | null>(null);
    const eliminando = ref(false);

    // Cargar impresoras desde la API
    const cargarImpresoras = async () => {
      loading.value = true;
      error.value = '';
      
      try {
        const response = await axios.get('https://isiback.drtchco.gob.pe/api/impresoras');
        impresoras.value = response.data.data;
      } catch (err: any) {
        console.error('Error al cargar impresoras:', err);
        error.value = 'No se pudieron cargar las impresoras. ' + 
                     (err.response?.data?.message || err.message || 'Error desconocido');
      } finally {
        loading.value = false;
      }
    };

    // Computed properties
    const impresorasFiltradas = computed(() => {
      if (!busqueda.value.trim()) return impresoras.value;
      const termino = busqueda.value.toLowerCase().trim();
      return impresoras.value.filter(impresora => 
        impresora.modelo?.toLowerCase().includes(termino) ||
        impresora.ip?.toLowerCase().includes(termino) ||
        impresora.mac?.toLowerCase().includes(termino) ||
        impresora.oficina?.toLowerCase().includes(termino) ||
        impresora.codigoPatrimonial?.toLowerCase().includes(termino) ||
        (impresora.usuario?.nombres + ' ' + impresora.usuario?.apellidos)?.toLowerCase().includes(termino)
      );
    });

    const impresorasPaginadas = computed(() => {
      const inicio = (paginaActual.value - 1) * itemsPorPagina;
      const fin = inicio + itemsPorPagina;
      return impresorasFiltradas.value.slice(inicio, fin);
    });

    const totalPaginas = computed(() => 
      Math.ceil(impresorasFiltradas.value.length / itemsPorPagina)
    );

    // Métodos
    const cambiarPagina = (pagina: number) => {
      if (pagina >= 1 && pagina <= totalPaginas.value) {
        paginaActual.value = pagina;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    const editarImpresora = (id: number) => {
      router.push(`/impresoras/editar/${id}`);
    };

    const confirmarEliminacion = (impresora: Impresora) => {
      impresoraAEliminar.value = impresora;
    };

    const cancelarEliminacion = () => {
      impresoraAEliminar.value = null;
    };

    const eliminarImpresora = async () => {
      if (!impresoraAEliminar.value) return;

      eliminando.value = true;

      try {
        await axios.delete(`https://isiback.drtchco.gob.pe/api/impresoras/${impresoraAEliminar.value.id}`);
        impresoras.value = impresoras.value.filter(i => i.id !== impresoraAEliminar.value!.id);
        impresoraAEliminar.value = null;
      } catch (err: any) {
        console.error('Error al eliminar impresora:', err);
        error.value = 'Error al eliminar la impresora: ' + (err.response?.data?.message || err.message || 'Error desconocido');
      } finally {
        eliminando.value = false;
      }
    };

    const exportarImpresoras = async () => {
      if (impresoras.value.length === 0) {
        alert('No hay impresoras para exportar');
        return;
      }

      try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Impresoras');

        // Columnas actualizadas
        worksheet.columns = [
          { header: 'ID', key: 'id', width: 10 },
          { header: 'Modelo', key: 'modelo', width: 25 },
          { header: 'IP', key: 'ip', width: 15 },
          { header: 'MAC', key: 'mac', width: 20 },
          { header: 'Oficina', key: 'oficina', width: 20 },
          { header: 'Código Patrimonial', key: 'codigoPatrimonial', width: 20 },
          { header: 'Usuario', key: 'usuario', width: 30 }
        ];

        // Estilo cabeceras
        worksheet.getRow(1).eachCell(cell => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF3B82F6' }
          };
          cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
          cell.border = {
            top: { style: 'thin', color: { argb: 'FF1E40AF' } },
            bottom: { style: 'thin', color: { argb: 'FF1E40AF' } },
            left: { style: 'thin', color: { argb: 'FF1E40AF' } },
            right: { style: 'thin', color: { argb: 'FF1E40AF' } }
          };
        });

        // Datos actualizados
        impresoras.value.forEach((impresora, index) => {
          const row = worksheet.addRow({
            id: impresora.id,
            modelo: impresora.modelo,
            ip: impresora.ip,
            mac: impresora.mac,
            oficina: impresora.oficina,
            codigoPatrimonial: impresora.codigoPatrimonial || '-',
            usuario: impresora.usuario ? `${impresora.usuario.nombres} ${impresora.usuario.apellidos}` : 'Sin asignar'
          });

          // Alternar colores de fila
          row.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: index % 2 === 0 ? 'FFF3F4F6' : 'FFFFFFFF' }
          };
        });

        // Autoajustar columnas
        worksheet.columns.forEach(column => {
          if (column.values) {
            let maxLength = 0;
            column.values.forEach((value: any) => {
              if (value !== null && value !== undefined) {
                const length = String(value).length;
                if (length > maxLength) {
                  maxLength = length;
                }
              }
            });
            column.width = Math.min(Math.max(maxLength + 2, 10), 30);
          }
        });

        // Generar archivo
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        // Descargar
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `impresoras_${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);

      } catch (err) {
        console.error('Error al exportar impresoras:', err);
        error.value = 'Error al exportar impresoras a Excel';
      }
    };

    // Cargar datos al montar el componente
    onMounted(() => {
      cargarImpresoras();
    });

    return {
      impresoras,
      busqueda,
      paginaActual,
      itemsPorPagina,
      loading,
      error,
      impresoraAEliminar,
      eliminando,
      impresorasFiltradas,
      impresorasPaginadas,
      totalPaginas,
      cargarImpresoras,
      cambiarPagina,
      editarImpresora,
      confirmarEliminacion,
      cancelarEliminacion,
      eliminarImpresora,
      exportarImpresoras
    };
  }
});
</script>

<style scoped>
.btn-primary {
  @apply inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2;
}

.btn-success {
  @apply inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn-action {
  @apply inline-flex items-center justify-center p-2 rounded-full transition-colors focus:outline-none;
}

.btn-cancel {
  @apply px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2;
}

.btn-confirm {
  @apply px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed;
}

.input-search {
  @apply pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent;
}

.pagination-button {
  @apply w-10 h-10 flex items-center justify-center rounded-md border border-gray-300 bg-white hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed;
}

/* Animaciones */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsive */
@media (max-width: 640px) {
  .container {
    @apply px-2;
  }
  
  table {
    font-size: 0.875rem;
  }
  
  th, td {
    @apply px-2 py-3;
  }
}
</style>