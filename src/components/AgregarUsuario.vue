<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Registrar Nuevo Usuario</h1>
      <router-link to="/usuarios" class="btn-secondary">
        <i class="fas fa-arrow-left mr-2"></i> Volver
      </router-link>
    </div>

    <div class="bg-white shadow-md rounded-lg p-6">
      <form @submit.prevent="crearUsuario" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="dni" class="block text-sm font-medium text-gray-700 mb-1">DNI*</label>
            <input 
              v-model="nuevoUsuario.dni" 
              id="dni" 
              type="text" 
              class="input" 
              required
              placeholder="Ingrese 8 dígitos"
              maxlength="8"
              @blur="validarDNI"
            />
            <p v-if="errores.dni" class="text-xs text-red-500 mt-1">{{ errores.dni }}</p>
          </div>

          <div>
            <label for="nombres" class="block text-sm font-medium text-gray-700 mb-1">Nombres*</label>
            <input 
              v-model="nuevoUsuario.nombres" 
              id="nombres" 
              type="text" 
              class="input" 
              required
              placeholder="Ej: Juan Carlos"
            />
          </div>

          <div>
            <label for="apellidos" class="block text-sm font-medium text-gray-700 mb-1">Apellidos*</label>
            <input 
              v-model="nuevoUsuario.apellidos" 
              id="apellidos" 
              type="text" 
              class="input" 
              required
              placeholder="Ej: Pérez López"
            />
          </div>

          <div>
            <label for="oficina" class="block text-sm font-medium text-gray-700 mb-1">Oficina*</label>
            <input 
              v-model="nuevoUsuario.oficina" 
              id="oficina" 
              type="text" 
              class="input" 
              required
              placeholder="Ej: Gerencia de TI"
            />
          </div>

          <div>
            <label for="tipoContrato" class="block text-sm font-medium text-gray-700 mb-1">Tipo de Contrato*</label>
            <select 
              v-model="nuevoUsuario.tipoContrato" 
              id="tipoContrato" 
              class="input" 
              required
            >
              <option value="">Seleccione...</option>
              <option value="Nombrado">Nombrado</option>
              <option value="Contratado">Contratado</option>
              <option value="CAS">CAS</option>
              <option value="Practicante">Practicante</option>
            </select>
          </div>
        </div>

        <div class="pt-4">
          <button 
            type="submit" 
            class="btn-primary"
            :disabled="loading || hayErrores"
          >
            <span v-if="loading">
              <i class="fas fa-circle-notch fa-spin mr-2"></i> Registrando...
            </span>
            <span v-else>Registrar Usuario</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

import '../interceptors/axios';

interface NuevoUsuario {
  dni: string;
  nombres: string;
  apellidos: string;
  oficina: string;
  tipoContrato: string;
}

export default defineComponent({
  name: 'AgregarUsuario',
  setup() {
    const router = useRouter();
    const loading = ref(false);
    
    const nuevoUsuario = ref<NuevoUsuario>({
      dni: '',
      nombres: '',
      apellidos: '',
      oficina: '',
      tipoContrato: ''
    });

    const errores = ref({
      dni: ''
    });

    const hayErrores = computed(() => {
      return Object.values(errores.value).some(error => error !== '') ||
        !nuevoUsuario.value.dni ||
        !nuevoUsuario.value.nombres ||
        !nuevoUsuario.value.apellidos ||
        !nuevoUsuario.value.oficina ||
        !nuevoUsuario.value.tipoContrato;
    });

    const validarDNI = () => {
      const dniRegex = /^\d{8}$/;
      if (!dniRegex.test(nuevoUsuario.value.dni)) {
        errores.value.dni = 'El DNI debe tener exactamente 8 dígitos numéricos';
      } else {
        errores.value.dni = '';
      }
    };

    const crearUsuario = async () => {
      try {
        loading.value = true;
        await axios.post('https://isiback.drtchco.gob.pe/api/usuarios', nuevoUsuario.value);
        
        alert('Usuario registrado correctamente');
        router.push('/usuarios');
        
      } catch (error: any) {
        console.error('Error al registrar usuario:', error);
        if (error.response?.data?.error) {
          alert(error.response.data.error);
        } else {
          alert('Error al registrar el usuario. Por favor, intente nuevamente.');
        }
      } finally {
        loading.value = false;
      }
    };

    return {
      nuevoUsuario,
      loading,
      errores,
      hayErrores,
      validarDNI,
      crearUsuario
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
</style>