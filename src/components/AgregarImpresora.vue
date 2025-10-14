<template>
  <div class="p-4 border rounded-lg shadow-sm bg-white">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-xl font-bold">Agregar Nueva Impresora</h1>
      <router-link
        to="/impresoras"
        class="text-blue-600 hover:text-blue-800 flex items-center"
      >
        <i class="fas fa-arrow-left mr-2"></i> Volver a la Lista
      </router-link>
    </div>

    <form @submit.prevent="agregarImpresora" class="space-y-6">
      <!-- Sección de Usuario -->
      <div class="border-b pb-4">
        <h2 class="text-lg font-semibold mb-3">Información del Usuario</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="usuario" class="block text-sm font-medium mb-1"
              >Usuario Asignado</label
            >
            <div class="relative">
              <input
                v-model="usuarioBusqueda"
                @input="buscarUsuarios"
                @focus="mostrarListaUsuarios = true"
                type="text"
                id="usuario"
                class="input"
                placeholder="Buscar por DNI o nombre..."
              />
              <ul
                v-if="mostrarListaUsuarios && usuariosEncontrados.length"
                class="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
              >
                <li
                  v-for="usuario in usuariosEncontrados"
                  :key="usuario.id"
                  @click="seleccionarUsuario(usuario)"
                  class="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                >
                  {{ usuario.nombres }} {{ usuario.apellidos }} ({{
                    usuario.dni
                  }})
                </li>
              </ul>
            </div>
          </div>

          <div>
            <label for="oficina" class="block text-sm font-medium mb-1"
              >Oficina</label
            >
            <input
              v-model="nuevaImpresora.oficina"
              id="oficina"
              type="text"
              class="input bg-gray-100"
              readonly
            />
          </div>
        </div>
      </div>

      <!-- Información de la Impresora -->
      <div class="border-b pb-4">
        <h2 class="text-lg font-semibold mb-3">Información de la Impresora</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Código Patrimonial movido al inicio -->
          <div>
            <label
              for="codigoPatrimonial"
              class="block text-sm font-medium mb-1"
              >Código Patrimonial*</label
            >
            <input
              v-model="nuevaImpresora.codigoPatrimonial"
              id="codigoPatrimonial"
              type="text"
              class="input"
              required
              placeholder="Ej: 123456789"
            />
          </div>

          <div>
            <label for="modelo" class="block text-sm font-medium mb-1"
              >Modelo*</label
            >
            <input
              v-model="nuevaImpresora.modelo"
              id="modelo"
              type="text"
              class="input"
              required
              placeholder="Ej: HP LaserJet Pro M404"
            />
          </div>

          <div>
            <label for="estado" class="block text-sm font-medium mb-1"
              >Estado*</label
            >
            <select
              v-model="nuevaImpresora.estado"
              id="estado"
              class="input"
              required
            >
              <option value="">Seleccione un estado</option>
              <option value="Bueno">Bueno</option>
              <option value="Regular">Regular</option>
              <option value="Malo">Malo</option>
            </select>
          </div>

          <div>
            <label for="ip" class="block text-sm font-medium mb-1">IP*</label>
            <input
              v-model="nuevaImpresora.ip"
              id="ip"
              type="text"
              class="input"
              required
              placeholder="Ej: 192.168.1.100"
              @blur="validarIP"
            />
            <p v-if="errores.ip" class="text-xs text-red-500 mt-1">
              {{ errores.ip }}
            </p>
          </div>

          <div>
            <label for="mac" class="block text-sm font-medium mb-1"
              >MAC Address*</label
            >
            <input
              v-model="nuevaImpresora.mac"
              id="mac"
              type="text"
              class="input"
              required
              placeholder="Ej: 00:1A:2B:3C:4D:5E"
              @blur="validarMAC"
            />
            <p v-if="errores.mac" class="text-xs text-red-500 mt-1">
              {{ errores.mac }}
            </p>
            <p class="text-xs text-gray-500 mt-1">
              Formato: 00:1A:2B:3C:4D:5E o 00-1A-2B-3C-4D-5E
            </p>
          </div>
        </div>
      </div>

      <div class="pt-4">
        <button
          type="submit"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="loading || hayErrores"
        >
          <span v-if="loading">
            <i class="fas fa-circle-notch fa-spin mr-2"></i> Procesando...
          </span>
          <span v-else>Agregar Impresora</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
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

interface NuevaImpresora {
  modelo: string;
  ip: string;
  mac: string;
  oficina: string;
  codigoPatrimonial: string;
  estado: string;
  usuarioId?: number | null;
}

export default defineComponent({
  name: "AgregarImpresora",
  setup() {
    const loading = ref(false);
    const usuarioBusqueda = ref("");
    const usuariosEncontrados = ref<Usuario[]>([]);
    const usuarioSeleccionado = ref<Usuario | null>(null);
    const mostrarListaUsuarios = ref(false);

    const nuevaImpresora = ref<NuevaImpresora>({
      modelo: "",
      ip: "",
      mac: "",
      oficina: "",
      codigoPatrimonial: "",
      estado: "",
      usuarioId: null,
    });

    const errores = ref({
      ip: "",
      mac: "",
    });

    const hayErrores = computed(() => {
      return (
        Object.values(errores.value).some((error) => error !== "") ||
        !nuevaImpresora.value.modelo ||
        !nuevaImpresora.value.ip ||
        !nuevaImpresora.value.mac ||
        !nuevaImpresora.value.oficina ||
        !nuevaImpresora.value.codigoPatrimonial ||
        !nuevaImpresora.value.estado
      );
    });

    const validarIP = () => {
      const ipRegex =
        /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
      if (!ipRegex.test(nuevaImpresora.value.ip)) {
        errores.value.ip = "Formato de IP inválido";
      } else {
        errores.value.ip = "";
      }
    };

    const validarMAC = () => {
      const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
      if (!macRegex.test(nuevaImpresora.value.mac)) {
        errores.value.mac = "Formato de MAC inválido";
      } else {
        errores.value.mac = "";
      }
    };

    const buscarUsuarios = async () => {
      if (usuarioBusqueda.value.length > 2) {
        try {
          const response = await axios.get(
            `/buscar-usuarios?nombres=${usuarioBusqueda.value}`
          );
          usuariosEncontrados.value = response.data.data;
          mostrarListaUsuarios.value = true;
        } catch (error) {
          console.error("Error al buscar usuarios:", error);
          usuariosEncontrados.value = [];
        }
      } else {
        usuariosEncontrados.value = [];
      }
    };

    const seleccionarUsuario = (usuario: Usuario) => {
      usuarioSeleccionado.value = usuario;
      nuevaImpresora.value.usuarioId = usuario.id;
      nuevaImpresora.value.oficina = usuario.oficina;
      usuarioBusqueda.value = `${usuario.nombres} ${usuario.apellidos} (${usuario.dni})`;
      mostrarListaUsuarios.value = false;
    };

    const agregarImpresora = async () => {
      try {
        loading.value = true;
        await axios.post("/impresoras", nuevaImpresora.value);
        alert("Impresora agregada correctamente");

        // Limpiar el formulario
        nuevaImpresora.value = {
          modelo: "",
          ip: "",
          mac: "",
          oficina: "",
          codigoPatrimonial: "",
          estado: "",
          usuarioId: null,
        };
        usuarioBusqueda.value = "";
        usuarioSeleccionado.value = null;
      } catch (error: any) {
        console.error("Error al agregar la impresora", error);
        if (error.response?.data?.error) {
          alert(error.response.data.error);
        } else {
          alert(
            "Error al agregar la impresora. Por favor, intente nuevamente."
          );
        }
      } finally {
        loading.value = false;
      }
    };

    return {
      nuevaImpresora,
      usuarioBusqueda,
      usuariosEncontrados,
      usuarioSeleccionado,
      mostrarListaUsuarios,
      loading,
      errores,
      hayErrores,
      validarIP,
      validarMAC,
      buscarUsuarios,
      seleccionarUsuario,
      agregarImpresora,
    };
  },
});
</script>

<style scoped>
.input {
  @apply p-2 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500;
}

.input:disabled {
  @apply bg-gray-100 cursor-not-allowed;
}
</style>