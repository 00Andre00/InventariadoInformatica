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

    <!-- Lista de equipos -->
    <div v-else class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div 
        v-for="equipo in equipos" 
        :key="equipo.id" 
        class="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg shadow-sm p-4 hover:shadow-lg hover:from-orange-100 hover:to-orange-200 transition-all duration-300"
      >
        <div class="space-y-2">
          <div class="flex justify-between items-start">
            <h3 class="font-semibold text-lg text-gray-800">{{ equipo.nombre }}</h3>
            <span class="text-sm text-orange-600 bg-orange-200 px-2 py-1 rounded-full">#{{ equipo.id }}</span>
          </div>
          
          <div class="space-y-1 text-sm">
            <p><span class="font-medium text-gray-700">Tipo:</span> <span class="text-gray-600">{{ equipo.tipo }}</span></p>
            <p><span class="font-medium text-gray-700">IP:</span> <span class="text-blue-600 font-mono">{{ equipo.ip }}</span></p>
            <p><span class="font-medium text-gray-700">Piso:</span> <span class="text-gray-600">{{ equipo.piso }}</span></p>
            <p><span class="font-medium text-gray-700">Oficina:</span> <span class="text-gray-600">{{ equipo.oficina }}</span></p>
            <p v-if="equipo.usuario"><span class="font-medium text-gray-700">Usuario:</span> <span class="text-purple-600">{{ equipo.usuario }}</span></p>
          </div>
        </div>

        <!-- Botones de acción -->
        <div class="flex gap-2 mt-4 pt-3 border-t border-gray-100">
          <router-link 
            :to="`/editar/${equipo.id}`" 
            class="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white text-center px-3 py-2 rounded text-sm transition-colors"
          >
            Editar
          </router-link>
          
          <button 
            @click="confirmarEliminacion(equipo)" 
            class="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm transition-colors"
          >
            Eliminar
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
import { defineComponent, ref, onMounted } from 'vue';
import axios from 'axios';
import ExcelJS from 'exceljs';

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
  setup() {
    const equipos = ref<Equipo[]>([]);
    const loading = ref(false);
    const error = ref('');
    const equipoAEliminar = ref<Equipo | null>(null);
    const eliminando = ref(false);

    const cargarEquipos = async () => {
      loading.value = true;
      error.value = '';
      
      try {
        const response = await axios.get('http://localhost:5000/api/equipos');
        
        // Manejar la respuesta del backend mejorado
        if (response.data.data) {
          equipos.value = response.data.data;
        } else {
          equipos.value = Array.isArray(response.data) ? response.data : [];
        }
      } catch (err: any) {
        console.error('Error al cargar los equipos:', err);
        error.value = err.response?.data?.error || 'Error al cargar los equipos';
        equipos.value = [];
      } finally {
        loading.value = false;
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
        await axios.delete(`http://localhost:5000/api/equipo/${equipoAEliminar.value.id}`);
        
        // Remover el equipo de la lista local
        equipos.value = equipos.value.filter(e => e.id !== equipoAEliminar.value!.id);
        
        // Cerrar el modal
        equipoAEliminar.value = null;
        
      } catch (err: any) {
        console.error('Error al eliminar el equipo:', err);
        error.value = err.response?.data?.error || 'Error al eliminar el equipo';
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
        // Ordenar los equipos por 'id' antes de agregarlos al archivo Excel
        const equiposOrdenados = equipos.value.sort((a, b) => a.id - b.id);

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Equipos');

        // Configurar columnas
        worksheet.columns = [
          { header: 'ID', key: 'id', width: 10 },
          { header: 'Nombre', key: 'nombre', width: 30 },
          { header: 'Tipo', key: 'tipo', width: 20 },
          { header: 'IP', key: 'ip', width: 15 },
          { header: 'Piso', key: 'piso', width: 10 },
          { header: 'Oficina', key: 'oficina', width: 20 },
          { header: 'Usuario', key: 'usuario', width: 25 },
        ];

        // Estilo para las cabeceras hasta la columna "Usuario" (columna G)
        for (let col = 1; col <= 7; col++) {  // De la columna 1 a la 7 (A a G)
          const cell = worksheet.getCell(1, col);
          cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };  // Blanco
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFF7A00' },  // Fondo naranja
          };
        }
        worksheet.getRow(1).height = 25;  // Altura aumentada para las cabeceras

        // Agregar datos y aplicar colores de fondo alternos
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

          // Alternar colores de fondo para las filas
          if (index % 2 === 0) {
            row.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FFF0F0F0' },  // Fondo gris claro
            };
          } else {
            row.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FFFFFFFF' },  // Fondo blanco
            };
          }

          // Aplicar bordes grises en todas las celdas
          row.eachCell((cell) => {
            cell.border = {
              top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
              left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
              bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
              right: { style: 'thin', color: { argb: 'FFCCCCCC' } },
            };

            // Centrar el contenido horizontal y verticalmente
            cell.alignment = {
              vertical: 'middle',
              horizontal: 'center',
            };
          });

          // Ajustar la altura de las filas
          row.height = 20;
        });

        // Agregar filtros a las cabeceras
        worksheet.autoFilter = 'A1:G1';

        // Generar archivo y descargar
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `equipos_${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Limpiar URL
        URL.revokeObjectURL(link.href);

      } catch (err) {
        console.error('Error al exportar equipos:', err);
        error.value = 'Error al exportar equipos a Excel';
      }
    };

    onMounted(() => {
      cargarEquipos();
    });

    return {
      equipos,
      loading,
      error,
      equipoAEliminar,
      eliminando,
      cargarEquipos,
      confirmarEliminacion,
      cancelarEliminacion,
      eliminarEquipo,
      exportarEquipos,
    };
  },
});
</script>

<style scoped>
/* Estilos adicionales si es necesario */
.transition-colors {
  transition: background-color 0.2s ease-in-out;
}

.transition-shadow {
  transition: box-shadow 0.2s ease-in-out;
}

/* Responsive grid */
@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
