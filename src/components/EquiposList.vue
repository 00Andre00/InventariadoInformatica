<template>
  <div class="container mx-auto p-4">
    <!-- Encabezado mejorado -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <h1 class="text-2xl font-bold text-gray-800">Inventario de Equipos</h1>
      <div class="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
        <router-link 
          to="/agregar" 
          class="btn-primary"
        >
          <i class="fas fa-plus mr-2"></i> Agregar Equipo
        </router-link>
        <button 
          @click="exportarEquipos" 
          class="btn-success"
          :disabled="equipos.length === 0"
        >
          <i class="fas fa-file-export mr-2"></i> Exportar
        </button>
      </div>
    </div>

    <!-- Mensajes de estado -->
    <div v-if="loading" class="text-center py-8 bg-gray-50 rounded-lg">
      <i class="fas fa-circle-notch fa-spin text-blue-500 text-2xl mb-2"></i>
      <p class="text-gray-600">Cargando equipos...</p>
    </div>

    <div v-else-if="error" class="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-4">
      <div class="flex items-center">
        <i class="fas fa-exclamation-circle text-red-500 mr-2"></i>
        <p class="text-red-700">{{ error }}</p>
      </div>
      <button 
        @click="cargarEquipos" 
        class="mt-2 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
      >
        <i class="fas fa-sync-alt mr-1"></i> Reintentar
      </button>
    </div>

    <div v-else-if="equipos.length === 0" class="text-center py-8 bg-gray-50 rounded-lg">
      <i class="fas fa-box-open text-gray-400 text-2xl mb-2"></i>
      <p class="text-gray-600 mb-4">No hay equipos registrados</p>
      <router-link 
        to="/agregar" 
        class="btn-primary inline-flex items-center"
      >
        <i class="fas fa-plus mr-2"></i> Agregar Primer Equipo
      </router-link>
    </div>

    <!-- Tabla de equipos -->
    <div v-else class="bg-white rounded-lg shadow overflow-hidden">
      <!-- Barra de búsqueda -->
      <div class="p-4 border-b bg-gray-50">
        <div class="relative max-w-md">
          <input 
            type="text" 
            v-model="busqueda" 
            placeholder="Buscar equipos..." 
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
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marca/Modelo</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Procesador/Grafica</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RAM/Almacenamiento</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP/MAC/Serie</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ubicación/Usuario</th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="equiposPaginados.length === 0">
              <td colspan="8" class="px-6 py-8 text-center text-gray-500">
                <i class="fas fa-search-minus text-gray-300 text-2xl mb-2"></i>
                <p>No se encontraron equipos con los filtros actuales</p>
              </td>
            </tr>
            <tr 
              v-for="equipo in equiposPaginados" 
              :key="equipo.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{{ equipo.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <span class="px-2 py-1 rounded-full text-xs font-medium" 
                      :class="getBadgeClass(equipo.tipo)">
                  {{ equipo.tipo }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <div class="font-medium">{{ equipo.marca }}</div>
                <div class="text-gray-500">{{ equipo.modelo }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ equipo.procesador || '-' }}
                <div v-if="equipo.grafica" class="text-xs text-gray-400">
                  GPU: {{ equipo.grafica }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <div>{{ equipo.ram }}</div>
                <div class="text-gray-500">{{ equipo.almacenamiento }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <div class="font-mono">{{ equipo.ip || '-' }}</div>
                <div class="text-xs font-mono text-gray-500">{{ equipo.mac || '-' }}</div>
                <div class="text-xs text-gray-500">{{ equipo.numeroSerie || '-' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <div class="flex flex-col">
                  <span>{{ equipo.oficina }}</span>
                  <span class="text-xs text-gray-500">{{ equipo.usuario || 'Sin usuario' }}</span>
                  <button 
                    v-if="equipo.mantenimientos && equipo.mantenimientos.length > 0"
                    @click="verMantenimientos(equipo)"
                    class="text-xs text-blue-500 hover:text-blue-700 mt-1 text-left"
                  >
                    <i class="fas fa-tools mr-1"></i>
                    {{ equipo.mantenimientos.length }} mantenimiento(s)
                  </button>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-center">
                <div class="flex justify-center space-x-2">
                  <button 
                    @click="editarEquipo(equipo)"
                    class="btn-action bg-gray-800 text-white hover:bg-gray-700"
                    title="Editar"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button 
                    @click="confirmarEliminacion(equipo)"
                    class="btn-action bg-gray-800 text-white hover:bg-gray-700"
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
          {{ Math.min(paginaActual * itemsPorPagina, equiposFiltrados.length) }} 
          de {{ equiposFiltrados.length }} equipos
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
    <div v-if="equipoAEliminar" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <div class="flex items-center mb-4">
          <i class="fas fa-exclamation-triangle text-yellow-500 mr-2"></i>
          <h3 class="text-lg font-semibold">Confirmar Eliminación</h3>
        </div>
        
        <p class="text-gray-600 mb-4">
          ¿Estás seguro de eliminar el equipo <strong class="text-gray-800">{{ equipoAEliminar.marca }} {{ equipoAEliminar.modelo }}</strong>?
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
            @click="eliminarEquipo" 
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

    <!-- Modal de mantenimientos -->
    <div v-if="equipoSeleccionado" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold">
            <i class="fas fa-tools mr-2 text-blue-500"></i>
            Mantenimientos para {{ equipoSeleccionado.marca }} {{ equipoSeleccionado.modelo }}
          </h3>
          <button @click="equipoSeleccionado = null" class="text-gray-500 hover:text-gray-700">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div v-if="cargandoMantenimientos" class="text-center py-4">
          <i class="fas fa-circle-notch fa-spin text-blue-500 text-xl"></i>
          <p class="text-gray-600 mt-2">Cargando mantenimientos...</p>
        </div>
        
        <div v-else>
          <div v-if="equipoSeleccionado?.mantenimientos?.length === 0" class="text-center py-4 text-gray-500">
            <i class="fas fa-tools text-2xl mb-2"></i>
            <p>No hay mantenimientos registrados para este equipo</p>
          </div>

          <div v-else class="space-y-4">
            <div 
              v-for="(mantenimiento, index) in equipoSeleccionado.mantenimientos" 
              :key="index"
              class="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div class="flex justify-between items-start">
                <div>
                  <h4 class="font-medium">{{ mantenimiento.descripcion }}</h4>
                  <p class="text-sm text-gray-500 mt-1">
                    <i class="far fa-calendar-alt mr-1"></i>
                    {{ formatFecha(mantenimiento.fecha) }}
                  </p>
                </div>
                <span class="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                  Mantenimiento #{{ index + 1 }}
                </span>
              </div>
            </div>
          </div>
          
          <div class="mt-6 pt-4 border-t">
            <router-link 
              :to="`/agregar-mantenimiento/${equipoSeleccionado.id}`"
              class="btn-primary inline-flex items-center"
            >
              <i class="fas fa-plus mr-2"></i> Agregar Mantenimiento
            </router-link>
          </div>
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

interface Equipo {
  id: number;
  tipo: string;
  marca: string;
  modelo: string;
  procesador: string;
  grafica: string;
  ram: string;
  almacenamiento: string;
  placaMadre: string;
  oficina: string;
  vlan: string;
  ip: string;
  mac: string;
  numeroSerie: string;
  usuario: string;
  mantenimientos?: Mantenimiento[];
}

interface Mantenimiento {
  id: number;
  descripcion: string;
  fecha: string;
}

export default defineComponent({
  name: 'EquiposList',
  setup() {
    const router = useRouter();
    const equipos = ref<Equipo[]>([]);
    const busqueda = ref('');
    const paginaActual = ref(1);
    const itemsPorPagina = 10;
    const loading = ref(true);
    const error = ref('');
    const equipoAEliminar = ref<Equipo | null>(null);
    const eliminando = ref(false);
    const equipoSeleccionado = ref<Equipo | null>(null);
    const cargandoMantenimientos = ref(false);

    // Cargar equipos desde la API
    const cargarEquipos = async () => {
      loading.value = true;
      error.value = '';
      
      try {
        const response = await axios.get('https://isiback.drtchco.gob.pe/api/equipos');
        equipos.value = response.data.data;
      } catch (err: any) {
        console.error('Error al cargar equipos:', err);
        error.value = 'No se pudieron cargar los equipos. ' + 
                     (err.response?.data?.message || err.message || 'Error desconocido');
      } finally {
        loading.value = false;
      }
    };

    // Cargar mantenimientos para un equipo específico
    const cargarMantenimientos = async (equipoId: number) => {
      cargandoMantenimientos.value = true;
      try {
        const response = await axios.get(`https://isiback.drtchco.gob.pe/api/equipos/${equipoId}/mantenimientos`);
        return response.data.data;
      } catch (err) {
        console.error('Error al cargar mantenimientos:', err);
        return [];
      } finally {
        cargandoMantenimientos.value = false;
      }
    };

    // Computed properties
    const equiposFiltrados = computed(() => {
      if (!busqueda.value.trim()) return equipos.value;
      const termino = busqueda.value.toLowerCase().trim();
      return equipos.value.filter(equipo => 
        equipo.marca?.toLowerCase().includes(termino) || 
        equipo.modelo?.toLowerCase().includes(termino) ||
        equipo.tipo?.toLowerCase().includes(termino) ||
        equipo.ip?.toLowerCase().includes(termino) ||
        equipo.mac?.toLowerCase().includes(termino) ||
        equipo.oficina?.toLowerCase().includes(termino) ||
        equipo.numeroSerie?.toLowerCase().includes(termino) ||
        equipo.usuario?.toLowerCase().includes(termino)
      );
    });

    const equiposPaginados = computed(() => {
      const inicio = (paginaActual.value - 1) * itemsPorPagina;
      const fin = inicio + itemsPorPagina;
      return equiposFiltrados.value.slice(inicio, fin);
    });

    const totalPaginas = computed(() => 
      Math.ceil(equiposFiltrados.value.length / itemsPorPagina)
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
        'Router': 'bg-indigo-100 text-indigo-800'
      };
      return tipos[tipo] || 'bg-gray-100 text-gray-800';
    };

    const formatFecha = (fecha: string) => {
      return new Date(fecha).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

   const editarEquipo = (equipo: Equipo) => {
  router.push(`/editar/${equipo.id}`);
};

    const verMantenimientos = async (equipo: Equipo) => {
      equipoSeleccionado.value = { ...equipo };
      if (!equipoSeleccionado.value.mantenimientos) {
        equipoSeleccionado.value.mantenimientos = await cargarMantenimientos(equipo.id);
      }
    };

    const confirmarEliminacion = (equipo: Equipo) => {
      equipoAEliminar.value = equipo;
    };

    const cancelarEliminacion = () => {
      equipoAEliminar.value = null;
    };

    const eliminarEquipo = async () => {
      if (!equipoAEliminar.value) return;

      eliminando.value = true;

      try {
        await axios.delete(`https://isiback.drtchco.gob.pe/api/equipos/${equipoAEliminar.value.id}`);
        equipos.value = equipos.value.filter(e => e.id !== equipoAEliminar.value!.id);
        equipoAEliminar.value = null;
      } catch (err: any) {
        console.error('Error al eliminar equipo:', err);
        error.value = 'Error al eliminar el equipo: ' + (err.response?.data?.message || err.message || 'Error desconocido');
      } finally {
        eliminando.value = false;
      }
    };

   const exportarEquipos = async () => {
  if (equipos.value.length === 0) {
    alert('No hay equipos para exportar');
    return;
  }

  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Equipos');

    // Columnas actualizadas para incluir gráfica
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Tipo', key: 'tipo', width: 15 },
      { header: 'Marca', key: 'marca', width: 20 },
      { header: 'Modelo', key: 'modelo', width: 20 },
      { header: 'Procesador', key: 'procesador', width: 25 },
      { header: 'Tarjeta Gráfica', key: 'grafica', width: 25 }, // Nueva columna
      { header: 'RAM', key: 'ram', width: 15 },
      { header: 'Almacenamiento', key: 'almacenamiento', width: 20 },
      { header: 'IP', key: 'ip', width: 15 },
      { header: 'MAC', key: 'mac', width: 20 },
      { header: 'N° Serie', key: 'numeroSerie', width: 20 },
      { header: 'Oficina', key: 'oficina', width: 15 },
      { header: 'Usuario', key: 'usuario', width: 20 }
    ];

    // Estilo cabeceras (se mantiene igual)
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

    // Datos actualizados para incluir gráfica
    equipos.value.forEach((equipo, index) => {
      const row = worksheet.addRow({
        id: equipo.id,
        tipo: equipo.tipo,
        marca: equipo.marca,
        modelo: equipo.modelo,
        procesador: equipo.procesador,
        grafica: equipo.grafica || '-', // Incluir el campo gráfica
        ram: equipo.ram,
        almacenamiento: equipo.almacenamiento,
        ip: equipo.ip,
        mac: equipo.mac,
        numeroSerie: equipo.numeroSerie,
        oficina: equipo.oficina,
        usuario: equipo.usuario || 'N/A'
      });

      // Alternar colores de fila (se mantiene igual)
      row.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: index % 2 === 0 ? 'FFF3F4F6' : 'FFFFFFFF' }
      };
    });

    // Resto del código se mantiene igual...
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
    link.download = `equipos_${new Date().toISOString().split('T')[0]}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);

  } catch (err) {
    console.error('Error al exportar equipos:', err);
    error.value = 'Error al exportar equipos a Excel';
  }
};

    // Cargar datos al montar el componente
    onMounted(cargarEquipos);

    return {
      equipos,
      busqueda,
      paginaActual,
      itemsPorPagina,
      loading,
      error,
      equipoAEliminar,
      eliminando,
      equipoSeleccionado,
      cargandoMantenimientos,
      equiposFiltrados,
      equiposPaginados,
      totalPaginas,
      cargarEquipos,
      cambiarPagina,
      getBadgeClass,
      formatFecha,
      editarEquipo,
      verMantenimientos,
      confirmarEliminacion,
      cancelarEliminacion,
      eliminarEquipo,
      exportarEquipos
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
  @apply inline-flex items-center justify-center p-2 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-colors focus:outline-none;
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