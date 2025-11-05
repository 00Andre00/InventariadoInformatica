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
          <!-- DNI con búsqueda RENIEC -->
          <div>
            <label
              for="dni"
              class="block text-sm font-medium text-gray-700 mb-1"
              >DNI*</label
            >
            <div class="flex space-x-2">
              <input
                v-model="nuevoUsuario.dni"
                id="dni"
                type="text"
                class="input flex-1"
                required
                placeholder="Ingrese 8 dígitos"
                maxlength="8"
                @input="limpiarMensajes"
                :disabled="consultandoRENIEC"
              />
              <button
                type="button"
                @click="consultarRENIEC"
                class="btn-info whitespace-nowrap"
                :disabled="!dniValido || consultandoRENIEC"
                title="Consultar RENIEC (opcional)"
              >
                <span v-if="consultandoRENIEC">
                  <i class="fas fa-circle-notch fa-spin mr-1"></i>
                  Buscando...
                </span>
                <span v-else>
                  <i class="fas fa-search mr-1"></i>
                  Buscar
                </span>
              </button>
            </div>
            <p v-if="errores.dni" class="text-xs text-red-500 mt-1">
              {{ errores.dni }}
            </p>
            <p
              v-if="mensajeRENIEC"
              :class="{
                'text-xs mt-1': true,
                'text-green-600': mensajeRENIEC.includes('✅'),
                'text-blue-500': mensajeRENIEC.includes('Consultando'),
                'text-yellow-600': mensajeRENIEC.includes('⚠️'),
                'text-red-500': mensajeRENIEC.includes('❌'),
              }"
            >
              <i 
                v-if="mensajeRENIEC.includes('⚠️')" 
                class="fas fa-info-circle mr-1"
              ></i>
              {{ mensajeRENIEC }}
            </p>
          </div>

          <!-- Nombres -->
          <div>
            <label
              for="nombres"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Nombres*</label
            >
            <input
              v-model="nuevoUsuario.nombres"
              id="nombres"
              type="text"
              class="input"
              required
              placeholder="Ej: Juan Carlos"
            />
          </div>

          <!-- Apellidos -->
          <div>
            <label
              for="apellidos"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Apellidos*</label
            >
            <input
              v-model="nuevoUsuario.apellidos"
              id="apellidos"
              type="text"
              class="input"
              required
              placeholder="Ej: Pérez López"
            />
          </div>

          <!-- Oficina -->
          <div>
            <label
              for="oficina"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Oficina*</label
            >
            <input
              v-model="nuevoUsuario.oficina"
              id="oficina"
              type="text"
              class="input"
              required
              placeholder="Ej: Gerencia de TI"
            />
          </div>

          <!-- Tipo de Contrato -->
          <div>
            <label
              for="tipoContrato"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Tipo de Contrato*</label
            >
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

        <!-- Botón de registro -->
        <div class="pt-4">
          <button
            type="submit"
            class="btn-primary"
            :disabled="loading || hayErrores"
          >
            <span v-if="loading">
              <i class="fas fa-circle-notch fa-spin mr-2"></i> Registrando...
            </span>
            <span v-else>
              <i class="fas fa-user-plus mr-2"></i>
              Registrar Usuario
            </span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

import "../interceptors/axios";

interface NuevoUsuario {
  dni: string;
  nombres: string;
  apellidos: string;
  oficina: string;
  tipoContrato: string;
}

interface RENIECResponse {
  success: boolean;
  data?: {
    numero: string;
    nombre_completo: string;
    nombres: string;
    apellido_paterno: string;
    apellido_materno: string;
    codigo_verificacion: string | number;
  };
  message?: string;
  error?: string;
  manual?: boolean; // Indica si puede continuar manualmente
}

export default defineComponent({
  name: "AgregarUsuario",
  setup() {
    const router = useRouter();
    const loading = ref(false);
    const consultandoRENIEC = ref(false);
    const mensajeRENIEC = ref("");

    const nuevoUsuario = ref<NuevoUsuario>({
      dni: "",
      nombres: "",
      apellidos: "",
      oficina: "",
      tipoContrato: "",
    });

    const errores = ref({
      dni: "",
    });

    const dniValido = computed(() => {
      const dniRegex = /^\d{8}$/;
      return dniRegex.test(nuevoUsuario.value.dni);
    });

    const hayErrores = computed(() => {
      return (
        Object.values(errores.value).some((error) => error !== "") ||
        !nuevoUsuario.value.dni ||
        !nuevoUsuario.value.nombres ||
        !nuevoUsuario.value.apellidos ||
        !nuevoUsuario.value.oficina ||
        !nuevoUsuario.value.tipoContrato
      );
    });

    const validarDNI = () => {
      if (!dniValido.value) {
        errores.value.dni = "El DNI debe tener exactamente 8 dígitos numéricos";
        return false;
      } else {
        errores.value.dni = "";
        return true;
      }
    };

    const limpiarMensajes = () => {
      mensajeRENIEC.value = "";
      errores.value.dni = "";
    };

    const consultarRENIEC = async () => {
      if (!validarDNI()) {
        return;
      }

      try {
        consultandoRENIEC.value = true;
        mensajeRENIEC.value = "Consultando RENIEC...";

        const apiUrl = import.meta.env.VITE_API_URL;
        
        // Timeout del lado del cliente también (12 segundos)
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('TIMEOUT')), 12000)
        );

        const fetchPromise = axios.post<RENIECResponse>(
          `${apiUrl}/reniec/consultar`,
          { dni: nuevoUsuario.value.dni }
        );

        const response = await Promise.race([fetchPromise, timeoutPromise]);

        if (response.data.success && response.data.data) {
          const datos = response.data.data;
          
          // ✅ Autocompletar campos
          nuevoUsuario.value.nombres = datos.nombres;
          nuevoUsuario.value.apellidos = `${datos.apellido_paterno} ${datos.apellido_materno}`.trim();
          
          mensajeRENIEC.value = "✅ Datos encontrados y autocompletados desde RENIEC";
          
          setTimeout(() => {
            mensajeRENIEC.value = "";
          }, 5000);
        } else if (response.data.manual) {
          // ⚠️ API caída o sin datos - modo manual habilitado
          mensajeRENIEC.value =
            response.data.message || "⚠️ RENIEC no disponible. Complete manualmente los datos.";
        } else {
          mensajeRENIEC.value = "⚠️ No se encontraron datos. Complete manualmente.";
        }
      } catch (error: any) {
        // 🛡️ NUNCA bloquear - siempre permitir continuar
        
        if (error.message === 'TIMEOUT') {
          mensajeRENIEC.value = "⚠️ RENIEC tardó en responder. Complete manualmente los datos.";
        } else if (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED') {
          mensajeRENIEC.value = "⚠️ Sin conexión con RENIEC. Complete manualmente los datos.";
        } else if (error.response?.data?.manual) {
          mensajeRENIEC.value = error.response.data.message || "⚠️ Complete los datos manualmente.";
        } else {
          mensajeRENIEC.value = "⚠️ RENIEC no disponible. Complete manualmente los datos.";
        }
        
        // NO mostrar errores técnicos al usuario
        console.warn("Consulta RENIEC falló (modo manual activado):", error.message);
      } finally {
        consultandoRENIEC.value = false;
        
        // Enfocar el campo de nombres si no se autocompletó
        if (!nuevoUsuario.value.nombres) {
          setTimeout(() => {
            document.getElementById('nombres')?.focus();
          }, 100);
        }
      }
    };

    const crearUsuario = async () => {
      if (!validarDNI()) return;

      try {
        loading.value = true;
        await axios.post("/usuarios", nuevoUsuario.value);

        alert("✅ Usuario registrado correctamente");
        router.push("/usuarios");
      } catch (error: any) {
        console.error("Error al registrar usuario:", error);
        if (error.response?.data?.error) {
          alert(`❌ ${error.response.data.error}`);
        } else {
          alert("❌ Error al registrar el usuario. Por favor, intente nuevamente.");
        }
      } finally {
        loading.value = false;
      }
    };

    return {
      nuevoUsuario,
      loading,
      consultandoRENIEC,
      mensajeRENIEC,
      errores,
      hayErrores,
      dniValido,
      validarDNI,
      limpiarMensajes,
      consultarRENIEC,
      crearUsuario,
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

.btn-info {
  @apply bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center text-sm;
}
</style>