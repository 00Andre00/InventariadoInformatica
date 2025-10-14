<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Editar Usuario</h1>
      <router-link to="/usuarios" class="btn-secondary">
        <i class="fas fa-arrow-left mr-2"></i> Volver
      </router-link>
    </div>

    <div v-if="loading" class="text-center py-8 bg-gray-50 rounded-lg">
      <i class="fas fa-circle-notch fa-spin text-blue-500 text-2xl mb-2"></i>
      <p class="text-gray-600">Cargando información del usuario...</p>
    </div>

    <div
      v-else-if="error"
      class="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-4"
    >
      <div class="flex items-center">
        <i class="fas fa-exclamation-circle text-red-500 mr-2"></i>
        <p class="text-red-700">{{ error }}</p>
      </div>
      <router-link
        to="/usuarios"
        class="mt-2 inline-block text-sm text-red-600 hover:text-red-800"
      >
        <i class="fas fa-arrow-left mr-1"></i> Volver a la lista
      </router-link>
    </div>

    <div v-else class="bg-white shadow-md rounded-lg p-6">
      <form @submit.prevent="actualizarUsuario" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              for="dni"
              class="block text-sm font-medium text-gray-700 mb-1"
              >DNI*</label
            >
            <input
              v-model="usuario.dni"
              id="dni"
              type="text"
              class="input"
              required
              placeholder="Ingrese 8 dígitos"
              maxlength="8"
              @blur="validarDNI"
            />
            <p v-if="errores.dni" class="text-xs text-red-500 mt-1">
              {{ errores.dni }}
            </p>
          </div>

          <div>
            <label
              for="nombres"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Nombres*</label
            >
            <input
              v-model="usuario.nombres"
              id="nombres"
              type="text"
              class="input"
              required
              placeholder="Ej: Juan Carlos"
            />
          </div>

          <div>
            <label
              for="apellidos"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Apellidos*</label
            >
            <input
              v-model="usuario.apellidos"
              id="apellidos"
              type="text"
              class="input"
              required
              placeholder="Ej: Pérez López"
            />
          </div>

          <div>
            <label
              for="oficina"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Oficina*</label
            >
            <input
              v-model="usuario.oficina"
              id="oficina"
              type="text"
              class="input"
              required
              placeholder="Ej: Gerencia de TI"
            />
          </div>

          <div>
            <label
              for="tipoContrato"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Tipo de Contrato*</label
            >
            <select
              v-model="usuario.tipoContrato"
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

        <div class="flex justify-between pt-4">
          <button
            type="submit"
            class="btn-primary"
            :disabled="guardando || hayErrores"
          >
            <span v-if="guardando">
              <i class="fas fa-circle-notch fa-spin mr-2"></i> Actualizando...
            </span>
            <span v-else>Actualizar Usuario</span>
          </button>

          <button
            @click="confirmarEliminacion"
            type="button"
            class="btn-danger"
            :disabled="guardando"
          >
            <i class="fas fa-trash mr-2"></i> Eliminar Usuario
          </button>
        </div>
      </form>
    </div>

    <!-- Modal de confirmación de eliminación -->
    <div
      v-if="mostrarModalEliminar"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <div class="flex items-center mb-4">
          <i class="fas fa-exclamation-triangle text-yellow-500 mr-2"></i>
          <h3 class="text-lg font-semibold">Confirmar Eliminación</h3>
        </div>

        <p class="text-gray-600 mb-4">
          ¿Estás seguro de eliminar al usuario
          <strong class="text-gray-800"
            >{{ usuario.nombres }} {{ usuario.apellidos }}</strong
          >
          (DNI: {{ usuario.dni }})?
        </p>
        <p class="text-sm text-gray-500 mb-6">
          <i class="fas fa-info-circle mr-1"></i> Esta acción no se puede
          deshacer.
        </p>

        <div class="flex gap-3 justify-end">
          <button @click="mostrarModalEliminar = false" class="btn-cancel">
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
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";

import "../interceptors/axios";

interface Usuario {
  id: number;
  dni: string;
  nombres: string;
  apellidos: string;
  oficina: string;
  tipoContrato: string;
}

export default defineComponent({
  name: "EditarUsuario",
  setup() {
    const router = useRouter();
    const route = useRoute();
    const usuarioId = route.params.id as string;

    const usuario = ref<Usuario>({
      id: 0,
      dni: "",
      nombres: "",
      apellidos: "",
      oficina: "",
      tipoContrato: "",
    });

    const loading = ref(true);
    const guardando = ref(false);
    const eliminando = ref(false);
    const error = ref("");
    const errores = ref({
      dni: "",
    });
    const mostrarModalEliminar = ref(false);

    const hayErrores = computed(() => {
      return (
        Object.values(errores.value).some((error) => error !== "") ||
        !usuario.value.dni ||
        !usuario.value.nombres ||
        !usuario.value.apellidos ||
        !usuario.value.oficina ||
        !usuario.value.tipoContrato
      );
    });

    const cargarUsuario = async () => {
      loading.value = true;
      error.value = "";

      try {
        const response = await axios.get(`/usuarios/${usuarioId}`);
        usuario.value = response.data.data;
      } catch (err: any) {
        console.error("Error al cargar usuario:", err);
        error.value =
          "No se pudo cargar la información del usuario. " +
          (err.response?.data?.message || err.message || "Error desconocido");
      } finally {
        loading.value = false;
      }
    };

    const validarDNI = () => {
      const dniRegex = /^\d{8}$/;
      if (!dniRegex.test(usuario.value.dni)) {
        errores.value.dni = "El DNI debe tener exactamente 8 dígitos numéricos";
      } else {
        errores.value.dni = "";
      }
    };

    const actualizarUsuario = async () => {
      try {
        guardando.value = true;
        await axios.put(`/usuarios/${usuarioId}`, usuario.value);

        alert("Usuario actualizado correctamente");
        router.push("/usuarios");
      } catch (error: any) {
        console.error("Error al actualizar usuario:", error);
        if (error.response?.data?.error) {
          alert(error.response.data.error);
        } else {
          alert(
            "Error al actualizar el usuario. Por favor, intente nuevamente."
          );
        }
      } finally {
        guardando.value = false;
      }
    };

    const confirmarEliminacion = () => {
      mostrarModalEliminar.value = true;
    };

    const eliminarUsuario = async () => {
      try {
        eliminando.value = true;
        await axios.delete(`/usuarios/${usuarioId}`);

        alert("Usuario eliminado correctamente");
        router.push("/usuarios");
      } catch (error: any) {
        console.error("Error al eliminar usuario:", error);
        mostrarModalEliminar.value = false;

        if (error.response?.data?.error) {
          alert(error.response.data.error);
        } else {
          alert("Error al eliminar el usuario. Por favor, intente nuevamente.");
        }
      } finally {
        eliminando.value = false;
      }
    };

    // Cargar datos al montar el componente
    onMounted(() => {
      cargarUsuario();
    });

    return {
      usuario,
      loading,
      guardando,
      eliminando,
      error,
      errores,
      hayErrores,
      mostrarModalEliminar,
      validarDNI,
      actualizarUsuario,
      confirmarEliminacion,
      eliminarUsuario,
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

.btn-cancel {
  @apply px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2;
}

.btn-confirm {
  @apply px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed;
}
</style>
