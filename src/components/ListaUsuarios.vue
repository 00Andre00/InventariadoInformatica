<template>
  <div class="container mx-auto p-4">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <h1 class="text-2xl font-bold text-gray-800">Gestión de Usuarios</h1>
      <div class="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
        <router-link to="/usuarios/agregar" class="btn-primary">
          <i class="fas fa-plus mr-2"></i> Nuevo Usuario
        </router-link>
        <button @click="exportarUsuarios" class="btn-success" :disabled="usuarios.length === 0">
          <i class="fas fa-file-export mr-2"></i> Exportar
        </button>
      </div>
    </div>

    <!-- Estado de carga -->
    <div v-if="loading" class="text-center py-8 bg-gray-50 rounded-lg">
      <i class="fas fa-circle-notch fa-spin text-blue-500 text-2xl mb-2"></i>
      <p class="text-gray-600">Cargando usuarios...</p>
    </div>

    <!-- Mensaje de error -->
    <div v-else-if="error" class="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-4">
      <div class="flex items-center">
        <i class="fas fa-exclamation-circle text-red-500 mr-2"></i>
        <p class="text-red-700">{{ error }}</p>
      </div>
      <button @click="cargarUsuarios" class="mt-2 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors">
        <i class="fas fa-sync-alt mr-1"></i> Reintentar
      </button>
    </div>

    <!-- Sin usuarios -->
    <div v-else-if="usuarios.length === 0" class="text-center py-8 bg-gray-50 rounded-lg">
      <i class="fas fa-users text-gray-400 text-2xl mb-2"></i>
      <p class="text-gray-600 mb-4">No hay usuarios registrados</p>
      <router-link to="/usuarios/agregar" class="btn-primary inline-flex items-center">
        <i class="fas fa-plus mr-2"></i> Registrar Primer Usuario
      </router-link>
    </div>

    <!-- Tabla de usuarios -->
    <div v-else class="bg-white rounded-lg shadow overflow-hidden">
      <!-- Barra de búsqueda -->
      <div class="p-4 border-b bg-gray-50">
        <div class="relative max-w-md">
          <input 
            type="text" 
            v-model="busqueda" 
            placeholder="Buscar por DNI, nombres, apellidos..." 
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
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DNI</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombres</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Apellidos</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Oficina</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contrato</th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="usuariosPaginados.length === 0">
              <td colspan="7" class="px-6 py-8 text-center text-gray-500">
                <i class="fas fa-search-minus text-gray-300 text-2xl mb-2"></i>
                <p>No se encontraron usuarios con los filtros actuales</p>
              </td>
            </tr>
            <tr 
              v-for="usuario in usuariosPaginados" 
              :key="usuario.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{{ usuario.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-mono">{{ usuario.dni }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">{{ usuario.nombres }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">{{ usuario.apellidos }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">{{ usuario.oficina }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <span class="px-2 py-1 rounded-full text-xs font-medium" :class="getBadgeContrato(usuario.tipoContrato)">
                  {{ usuario.tipoContrato }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-center">
                <div class="flex justify-center space-x-2">
                  <button 
                    @click="editarUsuario(usuario.id)"
                    class="btn-action bg-blue-600 text-white hover:bg-blue-700"
                    title="Editar"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button 
                    @click="verEquipos(usuario)"
                    class="btn-action bg-green-600 text-white hover:bg-green-700"
                    title="Ver Equipos"
                  >
                    <i class="fas fa-laptop"></i>
                  </button>
                  <button 
                    @click="confirmarEliminacion(usuario)"
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
          {{ Math.min(paginaActual * itemsPorPagina, usuariosFiltrados.length) }} 
          de {{ usuariosFiltrados.length }} usuarios
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

    <!-- Modal de confirmación -->
    <div v-if="usuarioAEliminar" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <div class="flex items-center mb-4">
          <i class="fas fa-exclamation-triangle text-yellow-500 mr-2"></i>
          <h3 class="text-lg font-semibold">Confirmar Eliminación</h3>
        </div>
        
        <p class="text-gray-600 mb-4">
          ¿Estás seguro de eliminar al usuario <strong class="text-gray-800">{{ usuarioAEliminar.nombres }} {{ usuarioAEliminar.apellidos }}</strong> (DNI: {{ usuarioAEliminar.dni }})?
        </p>
        <p class="text-sm text-gray-500 mb-6">
          <i class="fas fa-info-circle mr-1"></i> Esta acción no se puede deshacer.
        </p>
        
        <div class="flex gap-3 justify-end">
          <button @click="cancelarEliminacion" class="btn-cancel">
            Cancelar
          </button>
          <button 
            @click="eliminarUsuario" 
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

    <!-- Modal de equipos del usuario -->
    <div v-if="usuarioSeleccionado" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold">
            <i class="fas fa-laptop mr-2 text-blue-500"></i>
            Equipos asignados a {{ usuarioSeleccionado.nombres }} {{ usuarioSeleccionado.apellidos }}
          </h3>
          <button @click="usuarioSeleccionado = null" class="text-gray-500 hover:text-gray-700">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div v-if="cargandoEquipos" class="text-center py-4">
          <i class="fas fa-circle-notch fa-spin text-blue-500 text-xl"></i>
          <p class="text-gray-600 mt-2">Cargando equipos...</p>
        </div>
        
        <div v-else>
          <div v-if="equiposUsuario.length === 0" class="text-center py-4 text-gray-500">
            <i class="fas fa-laptop text-2xl mb-2"></i>
            <p>No hay equipos asignados a este usuario</p>
          </div>

          <div v-else class="space-y-4">
            <div 
              v-for="equipo in equiposUsuario" 
              :key="equipo.id"
              class="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div class="flex justify-between items-start">
                <div>
                  <h4 class="font-medium">{{ equipo.tipo }} {{ equipo.marca }} {{ equipo.modelo }}</h4>
                  <p class="text-sm text-gray-500 mt-1">
                    <span class="font-mono">{{ equipo.ip }}</span> • 
                    <span class="font-medium">{{ equipo.codigoPatrimonial }}</span>
                  </p>
                </div>
                <span class="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                  {{ equipo.estado || 'Activo' }}
                </span>
              </div>
            </div>
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

interface Usuario {
  id: number;
  dni: string;
  nombres: string;
  apellidos: string;
  oficina: string;
  tipoContrato: string;
  createdAt: string;
}

interface Equipo {
  id: number;
  tipo: string;
  marca: string;
  modelo: string;
  ip: string;
  codigoPatrimonial: string;
  estado: string;
}

export default defineComponent({
  name: 'ListaUsuarios',
  setup() {
    const router = useRouter();
    const usuarios = ref<Usuario[]>([]);
    const busqueda = ref('');
    const paginaActual = ref(1);
    const itemsPorPagina = 10;
    const loading = ref(true);
    const error = ref('');
    const usuarioAEliminar = ref<Usuario | null>(null);
    const eliminando = ref(false);
    const usuarioSeleccionado = ref<Usuario | null>(null);
    const equiposUsuario = ref<Equipo[]>([]);
    const cargandoEquipos = ref(false);

    // Cargar usuarios desde la API
    const cargarUsuarios = async () => {
      loading.value = true;
      error.value = '';
      
      try {
        const response = await axios.get('https://isiback.drtchco.gob.pe/api/usuarios');
        usuarios.value = response.data.data;
      } catch (err: any) {
        console.error('Error al cargar usuarios:', err);
        error.value = 'No se pudieron cargar los usuarios. ' + 
                     (err.response?.data?.message || err.message || 'Error desconocido');
      } finally {
        loading.value = false;
      }
    };

    // Computed properties
    const usuariosFiltrados = computed(() => {
      if (!busqueda.value.trim()) return usuarios.value;
      const termino = busqueda.value.toLowerCase().trim();
      return usuarios.value.filter(usuario => 
        usuario.dni?.includes(termino) ||
        usuario.nombres?.toLowerCase().includes(termino) ||
        usuario.apellidos?.toLowerCase().includes(termino) ||
        usuario.oficina?.toLowerCase().includes(termino)
      );
    });

    const usuariosPaginados = computed(() => {
      const inicio = (paginaActual.value - 1) * itemsPorPagina;
      const fin = inicio + itemsPorPagina;
      return usuariosFiltrados.value.slice(inicio, fin);
    });

    const totalPaginas = computed(() => 
      Math.ceil(usuariosFiltrados.value.length / itemsPorPagina)
    );

    // Métodos
    const cambiarPagina = (pagina: number) => {
      if (pagina >= 1 && pagina <= totalPaginas.value) {
        paginaActual.value = pagina;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    const getBadgeContrato = (tipoContrato: string) => {
      const tipos: Record<string, string> = {
        'Nombrado': 'bg-green-100 text-green-800',
        'Contratado': 'bg-blue-100 text-blue-800',
        'CAS': 'bg-yellow-100 text-yellow-800',
        'Practicante': 'bg-purple-100 text-purple-800'
      };
      return tipos[tipoContrato] || 'bg-gray-100 text-gray-800';
    };

    const editarUsuario = (id: number) => {
      router.push(`/usuarios/editar/${id}`);
    };

    const verEquipos = async (usuario: Usuario) => {
      usuarioSeleccionado.value = usuario;
      cargandoEquipos.value = true;
      
      try {
        const response = await axios.get(`https://isiback.drtchco.gob.pe/api/usuarios/${usuario.id}/equipos`);
        equiposUsuario.value = response.data.data;
      } catch (err) {
        console.error('Error al cargar equipos:', err);
        equiposUsuario.value = [];
      } finally {
        cargandoEquipos.value = false;
      }
    };

    const confirmarEliminacion = (usuario: Usuario) => {
      usuarioAEliminar.value = usuario;
    };

    const cancelarEliminacion = () => {
      usuarioAEliminar.value = null;
    };

    const eliminarUsuario = async () => {
      if (!usuarioAEliminar.value) return;

      eliminando.value = true;

      try {
        await axios.delete(`https://isiback.drtchco.gob.pe/api/usuarios/${usuarioAEliminar.value.id}`);
        usuarios.value = usuarios.value.filter(u => u.id !== usuarioAEliminar.value!.id);
        usuarioAEliminar.value = null;
      } catch (err: any) {
        console.error('Error al eliminar usuario:', err);
        if (err.response?.data?.error) {
          error.value = err.response.data.error;
        } else {
          error.value = 'Error al eliminar el usuario: ' + (err.message || 'Error desconocido');
        }
      } finally {
        eliminando.value = false;
      }
    };

    const exportarUsuarios = async () => {
      if (usuarios.value.length === 0) {
        alert('No hay usuarios para exportar');
        return;
      }

      try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Usuarios');

        // Definir columnas
        worksheet.columns = [
          { header: 'ID', key: 'id', width: 8 },
          { header: 'DNI', key: 'dni', width: 12 },
          { header: 'Nombres', key: 'nombres', width: 25 },
          { header: 'Apellidos', key: 'apellidos', width: 25 },
          { header: 'Oficina', key: 'oficina', width: 20 },
          { header: 'Tipo Contrato', key: 'tipoContrato', width: 15 },
          { header: 'Fecha Registro', key: 'createdAt', width: 15 }
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
        usuarios.value.forEach((usuario, index) => {
          const row = worksheet.addRow({
            id: usuario.id,
            dni: usuario.dni,
            nombres: usuario.nombres,
            apellidos: usuario.apellidos,
            oficina: usuario.oficina,
            tipoContrato: usuario.tipoContrato,
            createdAt: new Date(usuario.createdAt).toLocaleDateString('es-PE')
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
        link.download = `usuarios_${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);

      } catch (err) {
        console.error('Error al exportar usuarios:', err);
        error.value = 'Error al exportar usuarios a Excel';
      }
    };

    // Cargar datos al montar el componente
    onMounted(() => {
      cargarUsuarios();
    });

    return {
      usuarios,
      busqueda,
      paginaActual,
      itemsPorPagina,
      loading,
      error,
      usuarioAEliminar,
      eliminando,
      usuarioSeleccionado,
      equiposUsuario,
      cargandoEquipos,
      usuariosFiltrados,
      usuariosPaginados,
      totalPaginas,
      cargarUsuarios,
      cambiarPagina,
      getBadgeContrato,
      editarUsuario,
      verEquipos,
      confirmarEliminacion,
      cancelarEliminacion,
      eliminarUsuario,
      exportarUsuarios
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