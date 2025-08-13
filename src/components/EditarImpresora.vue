<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Editar Impresora</h1>
      <router-link to="/impresoras" class="btn-secondary">
        <i class="fas fa-arrow-left mr-2"></i> Volver a la Lista
      </router-link>
    </div>

    <div class="bg-white shadow-md rounded-lg p-6">
      <form @submit.prevent="actualizarImpresora" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Campo de usuario movido al principio -->
          <div>
            <label for="usuario" class="block text-sm font-medium text-gray-700 mb-1">Usuario Asignado</label>
            <div class="relative">
              <input 
                v-model="usuarioBusqueda" 
                @input="buscarUsuarios" 
                @focus="mostrarListaUsuarios = true"
                type="text" 
                id="usuario" 
                class="input" 
                placeholder="Buscar usuario..."
              />
              <ul v-if="mostrarListaUsuarios && usuariosEncontrados.length" class="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                <li 
                  v-for="usuario in usuariosEncontrados" 
                  :key="usuario.id"
                  @click="seleccionarUsuario(usuario)"
                  class="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                >
                  {{ usuario.nombres }} {{ usuario.apellidos }} ({{ usuario.dni }})
                </li>
              </ul>
            </div>
          </div>

          <div>
            <label for="modelo" class="block text-sm font-medium text-gray-700 mb-1">Modelo*</label>
            <input 
              v-model="impresora.modelo" 
              id="modelo" 
              type="text" 
              class="input" 
              required 
              placeholder="Ej: HP LaserJet Pro M404"
            />
          </div>
          
          <div>
            <label for="ip" class="block text-sm font-medium text-gray-700 mb-1">IP*</label>
            <input 
              v-model="impresora.ip" 
              id="ip" 
              type="text" 
              class="input" 
              required 
              placeholder="Ej: 192.168.1.100"
              @blur="validarIP"
            />
            <p v-if="errores.ip" class="text-xs text-red-500 mt-1">{{ errores.ip }}</p>
          </div>
          
          <div>
            <label for="mac" class="block text-sm font-medium text-gray-700 mb-1">MAC Address*</label>
            <input 
              v-model="impresora.mac" 
              id="mac" 
              type="text" 
              class="input" 
              required 
              placeholder="Ej: 00:1A:2B:3C:4D:5E"
              @blur="validarMAC"
            />
            <p v-if="errores.mac" class="text-xs text-red-500 mt-1">{{ errores.mac }}</p>
            <p class="text-xs text-gray-500 mt-1">Formato: 00:1A:2B:3C:4D:5E o 00-1A-2B-3C-4D-5E</p>
          </div>
          
          <div>
            <label for="oficina" class="block text-sm font-medium text-gray-700 mb-1">Oficina*</label>
            <input 
              v-model="impresora.oficina" 
              id="oficina" 
              type="text" 
              class="input" 
              required 
              placeholder="Ej: Gerencia de TI"
            />
          </div>
          
          <div>
            <label for="codigoPatrimonial" class="block text-sm font-medium text-gray-700 mb-1">Código Patrimonial*</label>
            <input 
              v-model="impresora.codigoPatrimonial" 
              id="codigoPatrimonial" 
              type="text" 
              class="input" 
              required 
              placeholder="Ej: 123456789"
            />
          </div>
        </div>

        <div class="flex justify-between pt-4">
          <button 
            type="submit" 
            class="btn-primary"
            :disabled="loading || hayErrores"
          >
            <span v-if="loading">
              <i class="fas fa-circle-notch fa-spin mr-2"></i> Actualizando...
            </span>
            <span v-else>Actualizar Impresora</span>
          </button>
          
          <button 
            @click="confirmarEliminacion" 
            type="button"
            class="btn-danger"
            :disabled="loading"
          >
            <i class="fas fa-trash mr-2"></i> Eliminar Impresora
          </button>
        </div>
      </form>
    </div>

    <!-- Modal de confirmación -->
    <div v-if="mostrarModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <div class="flex items-center mb-4">
          <i class="fas fa-exclamation-triangle text-yellow-500 mr-2"></i>
          <h3 class="text-lg font-semibold">Confirmar Eliminación</h3>
        </div>
        
        <p class="text-gray-600 mb-4">
          ¿Estás seguro de eliminar la impresora <strong class="text-gray-800">{{ impresora.modelo }}</strong>?
        </p>
        <p class="text-sm text-gray-500 mb-6">
          <i class="fas fa-info-circle mr-1"></i> Esta acción no se puede deshacer.
        </p>
        
        <div class="flex gap-3 justify-end">
          <button 
            @click="mostrarModal = false" 
            class="btn-secondary"
          >
            Cancelar
          </button>
          <button 
            @click="eliminarImpresora" 
            class="btn-danger"
            :disabled="loading"
          >
            <span v-if="loading">
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
import { defineComponent, ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';

interface Usuario {
  id: number;
  dni: string;
  nombres: string;
  apellidos: string;
  oficina: string;
  tipoContrato: string;
}

interface Impresora {
  id?: number;
  modelo: string;
  ip: string;
  mac: string;
  oficina: string;
  codigoPatrimonial: string;
  usuarioId?: number | null;
  usuario?: Usuario;
}

export default defineComponent({
  name: 'EditarImpresora',
  setup() {
    const impresora = ref<Impresora>({
      modelo: '',
      ip: '',
      mac: '',
      oficina: '',
      codigoPatrimonial: '',
      usuarioId: null
    });
    
    const loading = ref(false);
    const usuarioBusqueda = ref('');
    const usuariosEncontrados = ref<Usuario[]>([]);
    const mostrarListaUsuarios = ref(false);
    const mostrarModal = ref(false);
    const route = useRoute();
    const router = useRouter();

    const errores = ref({
      ip: '',
      mac: ''
    });

    const hayErrores = computed(() => {
      return Object.values(errores.value).some(error => error !== '') ||
        !impresora.value.modelo ||
        !impresora.value.ip ||
        !impresora.value.mac ||
        !impresora.value.oficina ||
        !impresora.value.codigoPatrimonial;
    });

    const validarIP = () => {
      const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
      if (!ipRegex.test(impresora.value.ip)) {
        errores.value.ip = 'Formato de IP inválido';
      } else {
        errores.value.ip = '';
      }
    };

    const validarMAC = () => {
      const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
      if (!macRegex.test(impresora.value.mac)) {
        errores.value.mac = 'Formato de MAC inválido';
      } else {
        errores.value.mac = '';
      }
    };

    const buscarUsuarios = async () => {
      if (usuarioBusqueda.value.length > 2) {
        try {
          const response = await axios.get(`https://isiback.drtchco.gob.pe/api/buscar-usuarios?nombres=${usuarioBusqueda.value}`);
          usuariosEncontrados.value = response.data.data;
        } catch (error) {
          console.error('Error al buscar usuarios:', error);
          usuariosEncontrados.value = [];
        }
      } else {
        usuariosEncontrados.value = [];
      }
    };

    const seleccionarUsuario = (usuario: Usuario) => {
      impresora.value.usuarioId = usuario.id;
      impresora.value.oficina = usuario.oficina; // Autocompletar oficina
      usuarioBusqueda.value = `${usuario.nombres} ${usuario.apellidos} (${usuario.dni})`;
      mostrarListaUsuarios.value = false;
    };

    const cargarImpresora = async () => {
      try {
        loading.value = true;
        const response = await axios.get(`https://isiback.drtchco.gob.pe/api/impresoras/${route.params.id}`);
        
        // Convertir datos para el formulario
        const datos = response.data.data;
        impresora.value = {
          ...datos,
          usuarioId: datos.usuarioId || null
        };
        
        // Cargar nombre de usuario si existe
        if (datos.usuario) {
          usuarioBusqueda.value = `${datos.usuario.nombres} ${datos.usuario.apellidos} (${datos.usuario.dni})`;
        }
        
      } catch (error) {
        console.error('Error al cargar la impresora', error);
        alert('Error al cargar la impresora');
        router.push('/impresoras');
      } finally {
        loading.value = false;
      }
    };

    const actualizarImpresora = async () => {
      try {
        loading.value = true;
        await axios.put(`https://isiback.drtchco.gob.pe/api/impresoras/${route.params.id}`, impresora.value);
        alert('Impresora actualizada correctamente');
        router.push('/impresoras');
      } catch (error: any) {
        console.error('Error al actualizar la impresora', error);
        if (error.response?.data?.error) {
          alert(error.response.data.error);
        } else {
          alert('Error al actualizar la impresora');
        }
      } finally {
        loading.value = false;
      }
    };

    const confirmarEliminacion = () => {
      mostrarModal.value = true;
    };

    const eliminarImpresora = async () => {
      try {
        loading.value = true;
        await axios.delete(`https://isiback.drtchco.gob.pe/api/impresoras/${route.params.id}`);
        alert('Impresora eliminada correctamente');
        router.push('/impresoras');
      } catch (error) {
        console.error('Error al eliminar la impresora', error);
        alert('Error al eliminar la impresora');
      } finally {
        loading.value = false;
        mostrarModal.value = false;
      }
    };

    onMounted(() => {
      cargarImpresora();
    });

    return {
      impresora,
      usuarioBusqueda,
      usuariosEncontrados,
      mostrarListaUsuarios,
      mostrarModal,
      loading,
      errores,
      hayErrores,
      validarIP,
      validarMAC,
      buscarUsuarios,
      seleccionarUsuario,
      actualizarImpresora,
      confirmarEliminacion,
      eliminarImpresora
    };
  },
});
</script>

<style scoped>
.input {
  @apply w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent;
}

.btn-primary {
  @apply bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center;
}

.btn-secondary {
  @apply bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors inline-flex items-center;
}

.btn-danger {
  @apply bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center;
}
</style>