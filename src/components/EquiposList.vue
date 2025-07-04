<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Lista de Equipos</h1>
      <div class="flex gap-2">
        <!-- Enlace para agregar un nuevo equipo -->
        <router-link 
          to="/agregar" 
          class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Agregar Nuevo Equipo
        </router-link>
        
        <!-- Botón para exportar equipos a Excel -->
        <button 
          @click="exportarEquipos" 
          class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
          :disabled="equipos.length === 0"
        >
          Exportar a Excel
        </button>
      </div>
    </div>

    <!-- Mensajes de estado -->
    <div v-if="loading" class="text-center py-8">
      <p class="text-gray-600">Cargando equipos...</p>
    </div>

    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      <p>{{ error }}</p>
      <button @click="cargarEquipos" class="mt-2 bg-red-500 text-white px-3 py-1 rounded text-sm">
        Reintentar
      </button>
    </div>

    <div v-else-if="equipos.length === 0" class="text-center py-8">
      <p class="text-gray-600 mb-4">No hay equipos registrados</p>
      <router-link 
        to="/agregar" 
        class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
      >
        Agregar Primer Equipo
      </router-link>
    </div>

    <!-- Tabla de equipos -->
    <div v-else>
      <!-- Barra de búsqueda -->
      <div class="mb-6">
        <div class="relative w-full md:w-1/2">
          <input 
            type="text" 
            v-model="busqueda" 
            placeholder="Buscar por nombre, tipo, IP u oficina..." 
            class="px-4 py-2 pl-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <IconSearch class="absolute left-3 top-2.5 text-gray-400" size="20" />
        </div>
      </div>

      <!-- Tabla de equipos -->
      <div class="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Piso</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Oficina</th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="equiposPaginados.length === 0">
              <td colspan="7" class="px-6 py-8 text-center text-gray-500">
                No se encontraron equipos con los filtros actuales
              </td>
            </tr>

            <tr 
              v-for="(equipo, index) in equiposPaginados" 
              :key="equipo.id"
              :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-50'"
            >
              <td class="px-6 py-4 text-sm font-medium text-gray-900">#{{ equipo.id }}</td>
              <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ equipo.nombre }}</td>
              <td class="px-6 py-4 text-sm text-gray-500">{{ equipo.tipo }}</td>
              <td class="px-6 py-4 text-sm text-gray-500 font-mono">{{ equipo.ip }}</td>
              <td class="px-6 py-4 text-sm text-gray-500">{{ equipo.piso }}</td>
              <td class="px-6 py-4 text-sm text-gray-500">{{ equipo.oficina }}</td>
              <td class="px-6 py-4 text-center space-x-2">
                <button 
                  @click="editarEquipo(equipo)"
                  class="text-yellow-600 hover:text-yellow-800 px-2 py-1 rounded hover:bg-yellow-50 transition-colors"
                >
                  Editar
                </button>
                <button 
                  @click="confirmarEliminacion(equipo)"
                  class="text-red-600 hover:text-red-800 px-2 py-1 rounded hover:bg-red-50 transition-colors"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Paginación mejorada -->
      <div class="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div class="text-sm text-gray-500">
          Mostrando {{ ((paginaActual - 1) * itemsPorPagina) + 1 }} - 
          {{ Math.min(paginaActual * itemsPorPagina, equiposFiltrados.length) }} 
          de {{ equiposFiltrados.length }} equipos
        </div>

        <div class="flex gap-1">
          <button 
            @click="cambiarPagina(paginaActual - 1)" 
            :disabled="paginaActual === 1"
            class="p-2 rounded border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <IconChevronLeft size="20" class="text-gray-600" />
          </button>
          
          <button 
            v-for="page in totalPaginas" 
            :key="page"
            @click="cambiarPagina(page)"
            :class="{'bg-blue-500 text-white': paginaActual === page, 'bg-white text-gray-700': paginaActual !== page}"
            class="w-10 h-10 rounded border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            {{ page }}
          </button>
          
          <button 
            @click="cambiarPagina(paginaActual + 1)" 
            :disabled="paginaActual >= totalPaginas"
            class="p-2 rounded border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <IconChevronRight size="20" class="text-gray-600" />
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de confirmación -->
    <div v-if="equipoAEliminar" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold mb-4">Confirmar Eliminación</h3>
        <p class="text-gray-600 mb-6">
          ¿Estás seguro de que quieres eliminar el equipo "{{ equipoAEliminar.nombre }}"?
          Esta acción no se puede deshacer.
        </p>
        <div class="flex gap-3 justify-end">
          <button 
            @click="cancelarEliminacion" 
            class="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button 
            @click="eliminarEquipo" 
            class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            :disabled="eliminando"
          >
            {{ eliminando ? 'Eliminando...' : 'Eliminar' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import { IconSearch, IconChevronLeft, IconChevronRight } from '@tabler/icons-vue';
import axios from 'axios';
import ExcelJS from 'exceljs';
import { useRouter } from 'vue-router';

interface Equipo {
  id: number;
  nombre: string;
  tipo: string;
  ip: string;
  piso: string;
  oficina: string;
  usuario?: string;
}

export default defineComponent({
  name: 'EquiposList',
  components: {
    IconSearch,
    IconChevronLeft,
    IconChevronRight
  },
  setup() {
    const router = useRouter();
    const equipos = ref<Equipo[]>([]);
    const busqueda = ref('');
    const paginaActual = ref(1);
    const itemsPorPagina = 5;
    const loading = ref(true);
    const error = ref('');
    const equipoAEliminar = ref<Equipo | null>(null);
    const eliminando = ref(false);

    // Cargar equipos desde la API
    const cargarEquipos = async () => {
      loading.value = true;
      error.value = '';
      
      try {
        const response = await axios.get('http://localhost:5000/api/equipos');
        equipos.value = response.data.data;
        equipos.value.sort((a: Equipo, b: Equipo) => a.id - b.id);
      } catch (err: any) {
        console.error('Error al cargar equipos:', err);
        error.value = 'No se pudieron cargar los equipos. ' + 
                     (err.response?.data?.message || err.message || 'Error desconocido');
      } finally {
        loading.value = false;
      }
    };

    // Computed properties
    const equiposFiltrados = computed(() => {
      if (!busqueda.value.trim()) return equipos.value;
      const termino = busqueda.value.toLowerCase().trim();
      return equipos.value.filter(equipo => 
        (equipo.nombre?.toLowerCase().includes(termino) || 
         equipo.tipo?.toLowerCase().includes(termino) ||
         equipo.ip?.toLowerCase().includes(termino) ||
         equipo.oficina?.toLowerCase().includes(termino) ||
         equipo.piso?.toLowerCase().includes(termino))
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
      }
    };

    const editarEquipo = (equipo: Equipo) => {
      console.log('Editar equipo:', equipo);
      router.push(`/editar/${equipo.id}`);
    };

    const confirmarEliminacion = (equipo: Equipo) => {
      equipoAEliminar.value = equipo;
    };

    const cancelarEliminacion = () => {
      equipoAEliminar.value = null;
    };

    const eliminarEquipo = async () => {
      if (!equipoAEliminar.value) {
        console.log("No hay equipo seleccionado para eliminar.");
        return;
      }

      eliminando.value = true;

      try {
        // URL actualizada para usar la ruta plural
        await axios.delete(`http://localhost:5000/api/equipos/${equipoAEliminar.value.id}`);
        
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
    const equiposOrdenados = [...equipos.value].sort((a: Equipo, b: Equipo) => a.id - b.id);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Equipos');

    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Nombre', key: 'nombre', width: 30 },
      { header: 'Tipo', key: 'tipo', width: 20 },
      { header: 'IP', key: 'ip', width: 15 },
      { header: 'Piso', key: 'piso', width: 10 },
      { header: 'Oficina', key: 'oficina', width: 20 },
      { header: 'Usuario', key: 'usuario', width: 25 },
    ];

    // Estilo para las cabeceras
    for (let col = 1; col <= 7; col++) {
      const cell = worksheet.getCell(1, col);
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFF7A00' },
      };
    }
    worksheet.getRow(1).height = 25;

    // Añadir datos
    equiposOrdenados.forEach((equipo, index) => {
      const row = worksheet.addRow({
        id: equipo.id,
        nombre: equipo.nombre,
        tipo: equipo.tipo,
        ip: equipo.ip,
        piso: equipo.piso,
        oficina: equipo.oficina,
        usuario: equipo.usuario || 'N/A',
      });

      // Alternar colores de fondo
      row.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: index % 2 === 0 ? 'FFF0F0F0' : 'FFFFFFFF' },
      };

      // Estilo de bordes y alineación
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
          left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
          bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
          right: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      });

      row.height = 20;
    });

    // Auto-filtros
    worksheet.autoFilter = 'A1:G1';

    // Generar el archivo Excel
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    // Crear enlace de descarga
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
      equiposFiltrados,
      equiposPaginados,
      totalPaginas,
      cargarEquipos,
      cambiarPagina,
      editarEquipo,
      confirmarEliminacion,
      cancelarEliminacion,
      eliminarEquipo,
      exportarEquipos
    };
  }
});
</script>

<style scoped>
.transition-colors {
  transition: background-color 0.15s ease-in-out, color 0.15s ease-in-out;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
.animate-spin {
  animation: spin 1s linear infinite;
}

@media (max-width: 640px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  table {
    font-size: 0.875rem;
  }
  
  td, th {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
}
</style>