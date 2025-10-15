<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Cambiar Contraseña</h1>
      <router-link to="/sistema/usuarios" class="btn-secondary">
        <i class="fas fa-arrow-left mr-2"></i> Volver
      </router-link>
    </div>

    <div class="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto">
      <form @submit.prevent="cambiarPassword" class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">Contraseña Actual</label>
          <input 
            v-model="passwords.actual" 
            type="password" 
            class="input w-full"
            required
          >
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Nueva Contraseña</label>
          <input 
            v-model="passwords.nueva" 
            type="password" 
            class="input w-full"
            required
            minlength="6"
          >
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Confirmar Nueva Contraseña</label>
          <input 
            v-model="passwords.confirmacion" 
            type="password" 
            class="input w-full"
            required
          >
        </div>

        <div v-if="error" class="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div class="flex items-center">
            <i class="fas fa-exclamation-circle text-red-500 mr-2"></i>
            <p class="text-red-700">{{ error }}</p>
          </div>
        </div>

        <div v-if="success" class="bg-green-50 border-l-4 border-green-500 p-4 rounded">
          <div class="flex items-center">
            <i class="fas fa-check-circle text-green-500 mr-2"></i>
            <p class="text-green-700">{{ success }}</p>
          </div>
        </div>

        <button 
          type="submit" 
          class="btn-primary w-full"
          :disabled="cargando || !passwords.nueva || !passwords.confirmacion"
        >
          <span v-if="cargando">
            <i class="fas fa-circle-notch fa-spin mr-2"></i> Cambiando...
          </span>
          <span v-else>Cambiar Contraseña</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

export default defineComponent({
  name: 'EditarPassword',
  setup() {
    const router = useRouter();
    const cargando = ref(false);
    const error = ref('');
    const success = ref('');

    const passwords = ref({
      actual: '',
      nueva: '',
      confirmacion: ''
    });

    const cambiarPassword = async () => {
      if (passwords.value.nueva !== passwords.value.confirmacion) {
        error.value = 'Las contraseñas nuevas no coinciden';
        return;
      }

      if (passwords.value.nueva.length < 6) {
        error.value = 'La nueva contraseña debe tener al menos 6 caracteres';
        return;
      }

      try {
        cargando.value = true;
        error.value = '';
        success.value = '';

        await axios.put('/sistema/cambiar-password', {
          passwordActual: passwords.value.actual,
          passwordNueva: passwords.value.nueva
        });

        success.value = 'Contraseña cambiada correctamente';
        passwords.value = { actual: '', nueva: '', confirmacion: '' };
        
        setTimeout(() => {
          router.push('/sistema/usuarios');
        }, 2000);

      } catch (err: any) {
        console.error('Error al cambiar contraseña:', err);
        error.value = err.response?.data?.error || 'Error al cambiar contraseña';
      } finally {
        cargando.value = false;
      }
    };

    return {
      passwords,
      cargando,
      error,
      success,
      cambiarPassword
    };
  }
});
</script>

<style scoped>
.btn-primary {
  @apply bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn-secondary {
  @apply bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition inline-flex items-center;
}

.input {
  @apply w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500;
}
</style>