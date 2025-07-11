<template>
  <div class="container mx-auto p-4">
    <!-- Encabezado mejorado responsive -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <h1 class="text-2xl font-bold text-gray-800">Lista de Dispositivos</h1>
      <div class="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
        <router-link 
          to="/dispositivos/agregar" 
          class="btn-primary"
        >
          <i class="fas fa-plus mr-2"></i> Agregar Dispositivo
        </router-link>
        <button 
          @click="exportarDispositivos" 
          class="btn-success"
          :disabled="dispositivos.length === 0"
        >
          <i class="fas fa-file-export mr-2"></i> Exportar
        </button>
      </div>
    </div>

    <!-- Mensajes de estado mejorados -->
    <div v-if="loading" class="text-center py-8 bg-gray-50 rounded-lg">
      <i class="fas fa-circle-notch fa-spin text-blue-500 text-2xl mb-2"></i>
      <p class="text-gray-600">Cargando dispositivos...</p>
    </div>

    <div v-else-if="error" class="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-4">
      <div class="flex items-center">
        <i class="fas fa-exclamation-circle text-red-500 mr-2"></i>
        <p class="text-red-700">{{ error }}</p>
      </div>
      <button 
        @click="cargarDispositivos" 
        class="mt-2 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
      >
        <i class="fas fa-sync-alt mr-1"></i> Reintentar
      </button>
    </div>

    <div v-else-if="dispositivos.length === 0" class="text-center py-8 bg-gray-50 rounded-lg">
      <i class="fas fa-box-open text-gray-400 text-2xl mb-2"></i>
      <p class="text-gray-600 mb-4">No hay dispositivos registrados</p>
      <router-link 
        to="/dispositivos/agregar" 
        class="btn-primary inline-flex items-center"
      >
        <i class="fas fa-plus mr-2"></i> Agregar Primer Dispositivo
      </router-link>
    </div>

    <!-- Tabla de dispositivos -->
    <div v-else class="bg-white rounded-lg shadow overflow-hidden">
      <!-- Barra de búsqueda mejorada -->
      <div class="p-4 border-b bg-gray-50">
        <div class="relative max-w-md">
          <input 
            type="text" 
            v-model="busqueda" 
            placeholder="Buscar por nombre, tipo, ubicación o serie..." 
            class="input-search"
          />
          <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
        </div>
      </div>

      <!-- Tabla responsive mejorada -->
      <div class="overflow-x-auto">
        <div class="min-w-[800px] md:min-w-0">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ubicación</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N° Serie</th>
                <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="dispositivosPaginados.length === 0">
                <td colspan="7" class="px-4 py-6 text-center text-gray-500">
                  <i class="fas fa-search-minus text-gray-300 text-xl mb-2"></i>
                  <p>No se encontraron dispositivos con los filtros actuales</p>
                </td>
              </tr>
              <tr 
                v-for="dispositivo in dispositivosPaginados" 
                :key="dispositivo.id"
                class="hover:bg-gray-50 transition-colors"
              >
                <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">#{{ dispositivo.id }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{{ dispositivo.nombre }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm">
                  <span class="px-2 py-1 rounded-full text-xs font-medium" 
                        :class="getBadgeClass(dispositivo.tipo)">
                    {{ dispositivo.tipo }}
                  </span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm">
                  <div class="flex flex-col">
                    <span>Piso {{ dispositivo.piso }}</span>
                    <span class="text-xs text-gray-500">{{ dispositivo.oficina }}</span>
                  </div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm">
                  <span class="quantity-badge">{{ dispositivo.cantidad }}</span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500 font-mono">
                  {{ dispositivo.numeroSerie || '-' }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-center">
                  <div class="flex justify-center space-x-1">
                    <button 
                      @click="editarDispositivo(dispositivo)"
                      class="btn-action text-blue-600 hover:bg-blue-50"
                      title="Editar"
                    >
                      <i class="fas fa-edit text-sm"></i>
                    </button>
                    <button 
                      @click="confirmarEliminacion(dispositivo)"
                      class="btn-action text-red-600 hover:bg-red-50"
                      title="Eliminar"
                    >
                      <i class="fas fa-trash text-sm"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Paginación mejorada -->
      <div class="px-4 py-3 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-3">
        <div class="text-sm text-gray-500">
          Mostrando {{ ((paginaActual - 1) * itemsPorPagina) + 1 }} - 
          {{ Math.min(paginaActual * itemsPorPagina, dispositivosFiltrados.length) }} 
          de {{ dispositivosFiltrados.length }} dispositivos
        </div>
        
        <div class="flex items-center gap-1">
          <button 
            @click="cambiarPagina(paginaActual - 1)" 
            :disabled="paginaActual === 1"
            class="pagination-button"
          >
            <i class="fas fa-chevron-left text-xs"></i>
          </button>
          
          <template v-for="page in totalPaginas" :key="page">
            <button 
              v-if="Math.abs(page - paginaActual) <= 2 || page === 1 || page === totalPaginas"
              @click="cambiarPagina(page)"
              :class="{
                'bg-blue-500 text-white hover:bg-blue-600': paginaActual === page, 
                'bg-white text-gray-700 hover:bg-gray-100': paginaActual !== page
              }"
              class="pagination-button"
            >
              {{ page }}
            </button>
            <span 
              v-else-if="Math.abs(page - paginaActual) === 3" 
              class="px-2 text-gray-500 text-sm"
            >
              ...
            </span>
          </template>
          
          <button 
            @click="cambiarPagina(paginaActual + 1)" 
            :disabled="paginaActual >= totalPaginas"
            class="pagination-button"
          >
            <i class="fas fa-chevron-right text-xs"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de confirmación mejorado -->
    <div v-if="dispositivoAEliminar" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div class="flex items-center mb-4">
          <i class="fas fa-exclamation-triangle text-yellow-500 mr-2"></i>
          <h3 class="text-lg font-semibold">Confirmar Eliminación</h3>
        </div>
        
        <p class="text-gray-600 mb-4">
          ¿Estás seguro de eliminar el dispositivo <strong class="text-gray-800">{{ dispositivoAEliminar.nombre }}</strong>?
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
            @click="eliminarDispositivo" 
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

interface Dispositivo {
  id: number;
  nombre: string;
  tipo: string;
  piso: string;
  oficina: string;
  cantidad: number;
  numeroSerie: string;
}

export default defineComponent({
  name: 'ListaDispositivos',
  setup() {
    const router = useRouter();
    const dispositivos = ref<Dispositivo[]>([]);
    const busqueda = ref('');
    const paginaActual = ref(1);
    const itemsPorPagina = 10;
    const loading = ref(true);
    const error = ref('');
    const dispositivoAEliminar = ref<Dispositivo | null>(null);
    const eliminando = ref(false);

    // Cargar dispositivos desde la API
    const cargarDispositivos = async () => {
      loading.value = true;
      error.value = '';

      try {
        const response = await axios.get('http://localhost:5000/api/dispositivos');
        dispositivos.value = response.data.data;
        dispositivos.value.sort((a: Dispositivo, b: Dispositivo) => a.id - b.id);
      } catch (err: any) {
        console.error('Error al cargar dispositivos:', err);
        error.value = 'No se pudieron cargar los dispositivos. ' + 
                     (err.response?.data?.message || err.message || 'Error desconocido');
      } finally {
        loading.value = false;
      }
    };

    // Computed properties
    const dispositivosFiltrados = computed(() => {
      if (!busqueda.value.trim()) return dispositivos.value;
      const termino = busqueda.value.toLowerCase().trim();
      return dispositivos.value.filter(dispositivo => {
        const campos = [
          dispositivo.nombre,
          dispositivo.tipo,
          dispositivo.oficina,
          dispositivo.piso,
          dispositivo.numeroSerie
        ];
        return campos.some(campo => campo?.toLowerCase().includes(termino));
      });
    });

    const dispositivosPaginados = computed(() => {
      const inicio = (paginaActual.value - 1) * itemsPorPagina;
      const fin = inicio + itemsPorPagina;
      return dispositivosFiltrados.value.slice(inicio, fin);
    });

    const totalPaginas = computed(() =>
      Math.ceil(dispositivosFiltrados.value.length / itemsPorPagina)
    );

    // Métodos
    const cambiarPagina = (pagina: number) => {
      if (pagina >= 1 && pagina <= totalPaginas.value) {
        paginaActual.value = pagina;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    const getBadgeClass = (tipo: string) => {
      const tipos: Record<string, string> = {
        'Computadora': 'bg-blue-100 text-blue-800',
        'Laptop': 'bg-purple-100 text-purple-800',
        'Servidor': 'bg-red-100 text-red-800',
        'Impresora': 'bg-green-100 text-green-800',
        'Switch': 'bg-yellow-100 text-yellow-800',
        'Router': 'bg-indigo-100 text-indigo-800',
        'Monitor': 'bg-pink-100 text-pink-800',
        'Teléfono': 'bg-cyan-100 text-cyan-800'
      };
      return tipos[tipo] || 'bg-gray-100 text-gray-800';
    };

    const editarDispositivo = (dispositivo: Dispositivo) => {
      router.push(`/dispositivos/editar/${dispositivo.id}`);
    };

    const confirmarEliminacion = (dispositivo: Dispositivo) => {
      dispositivoAEliminar.value = dispositivo;
    };

    const cancelarEliminacion = () => {
      dispositivoAEliminar.value = null;
    };

    const eliminarDispositivo = async () => {
      if (!dispositivoAEliminar.value) return;

      eliminando.value = true;

      try {
        await axios.delete(`http://localhost:5000/api/dispositivos/${dispositivoAEliminar.value.id}`);
        dispositivos.value = dispositivos.value.filter(d => d.id !== dispositivoAEliminar.value!.id);
        dispositivoAEliminar.value = null;
      } catch (err: any) {
        console.error('Error al eliminar dispositivo:', err);
        error.value = 'Error al eliminar el dispositivo: ' + (err.response?.data?.message || err.message || 'Error desconocido');
      } finally {
        eliminando.value = false;
      }
    };

    const exportarDispositivos = async () => {
      if (dispositivos.value.length === 0) {
        alert('No hay dispositivos para exportar');
        return;
      }

      try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Dispositivos');

        // Definir columnas
        worksheet.columns = [
          { header: 'ID', key: 'id', width: 8 },
          { header: 'Nombre', key: 'nombre', width: 25 },
          { header: 'Tipo', key: 'tipo', width: 15 },
          { header: 'Piso', key: 'piso', width: 8 },
          { header: 'Oficina', key: 'oficina', width: 20 },
          { header: 'Cantidad', key: 'cantidad', width: 10 },
          { header: 'Número de Serie', key: 'numeroSerie', width: 20 }
        ];

        // Estilo para las cabeceras
        worksheet.getRow(1).eachCell((cell) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF3B82F6' } // azul-600
          };
          cell.font = { 
            bold: true, 
            color: { argb: 'FFFFFFFF' }, // blanco
            size: 12
          };
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
          cell.border = {
            top: { style: 'thin', color: { argb: 'FF1E40AF' } }, // azul-800
            bottom: { style: 'thin', color: { argb: 'FF1E40AF' } },
            left: { style: 'thin', color: { argb: 'FF1E40AF' } },
            right: { style: 'thin', color: { argb: 'FF1E40AF' } }
          };
        });

        // Añadir datos
        dispositivos.value.forEach((dispositivo, index) => {
          const row = worksheet.addRow({
            id: dispositivo.id,
            nombre: dispositivo.nombre || 'N/A',
            tipo: dispositivo.tipo || 'N/A',
            piso: dispositivo.piso || 'N/A',
            oficina: dispositivo.oficina || 'N/A',
            cantidad: dispositivo.cantidad || 0,
            numeroSerie: dispositivo.numeroSerie || 'N/A'
          });

          // Alternar colores de fila
          row.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: index % 2 === 0 ? 'FFF3F4F6' : 'FFFFFFFF' } // gris-50 / blanco
          };

          // Alinear celdas
          row.eachCell({ includeEmpty: true }, (cell) => {
            cell.border = {
              top: { style: 'thin', color: { argb: 'FFE5E7EB' } }, // gris-200
              bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
              left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
              right: { style: 'thin', color: { argb: 'FFE5E7EB' } }
            };
            cell.alignment = { vertical: 'middle', horizontal: 'left' };
          });
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
            column.width = Math.min(Math.max(maxLength + 2, column.header?.length || 0), 30);
          }
        });

        // Generar archivo
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        // Descargar archivo
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `dispositivos_${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);

      } catch (err) {
        console.error('Error al exportar dispositivos:', err);
        error.value = 'Error al exportar dispositivos a Excel';
      }
    };

    // Cargar datos al montar el componente
    onMounted(() => {
      cargarDispositivos();
    });

    return {
      dispositivos,
      busqueda,
      paginaActual,
      itemsPorPagina,
      loading,
      error,
      dispositivoAEliminar,
      eliminando,
      dispositivosFiltrados,
      dispositivosPaginados,
      totalPaginas,
      cargarDispositivos,
      cambiarPagina,
      getBadgeClass,
      editarDispositivo,
      confirmarEliminacion,
      cancelarEliminacion,
      eliminarDispositivo,
      exportarDispositivos
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
  @apply inline-flex items-center justify-center p-2 rounded-full hover:bg-opacity-20 transition-colors focus:outline-none;
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