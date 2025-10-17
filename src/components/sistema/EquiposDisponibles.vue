<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Recursos Disponibles</h1>

    <!-- Pestañas para equipos e impresoras -->
    <div class="mb-6">
      <div class="border-b border-gray-200">
        <nav class="-mb-px flex space-x-8">
          <button
            @click="tabActiva = 'equipos'"
            :class="{
              'border-blue-500 text-blue-600': tabActiva === 'equipos',
              'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300':
                tabActiva !== 'equipos',
            }"
            class="whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm"
          >
            Equipos ({{ equiposDisponibles.length }})
          </button>
          <button
            @click="tabActiva = 'impresoras'"
            :class="{
              'border-blue-500 text-blue-600': tabActiva === 'impresoras',
              'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300':
                tabActiva !== 'impresoras',
            }"
            class="whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm"
          >
            Impresoras ({{ impresorasDisponibles.length }})
          </button>
        </nav>
      </div>
    </div>

    <!-- Equipos disponibles -->
    <div
      v-if="tabActiva === 'equipos'"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <div
        v-for="equipo in equiposDisponibles"
        :key="equipo.id"
        class="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500"
      >
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-lg font-semibold">
            {{ equipo.marca }} {{ equipo.modelo }}
          </h3>
          <span
            class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs"
          >
            Disponible
          </span>
        </div>

        <div class="space-y-2 text-sm text-gray-600">
          <p><strong>Tipo:</strong> {{ equipo.tipo }}</p>
          <p>
            <strong>Código Patrimonial:</strong>
            {{ equipo.codigoPatrimonial || "N/A" }}
          </p>
          <p><strong>Procesador:</strong> {{ equipo.procesador }}</p>
          <p><strong>RAM:</strong> {{ equipo.ram }}</p>
          <p><strong>Almacenamiento:</strong> {{ equipo.almacenamiento }}</p>
        </div>

        <div class="mt-4">
          <button
            @click="asignarRecurso(equipo, 'equipo')"
            class="btn-primary w-full"
          >
            <i class="fas fa-user-plus mr-2"></i> Asignar a Usuario
          </button>
        </div>
      </div>
    </div>

    <!-- Impresoras disponibles -->
    <div
      v-if="tabActiva === 'impresoras'"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <div
        v-for="impresora in impresorasDisponibles"
        :key="impresora.id"
        class="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500"
      >
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-lg font-semibold">
            {{ impresora.modelo }}
          </h3>
          <span
            class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs"
          >
            Disponible
          </span>
        </div>

        <div class="space-y-2 text-sm text-gray-600">
          <p>
            <strong>Código Patrimonial:</strong>
            {{ impresora.codigoPatrimonial || "N/A" }}
          </p>
          <p><strong>IP:</strong> {{ impresora.ip || "N/A" }}</p>
          <p><strong>MAC:</strong> {{ impresora.mac || "N/A" }}</p>
          <p><strong>Oficina:</strong> {{ impresora.oficina }}</p>
        </div>

        <div class="mt-4">
          <button
            @click="asignarRecurso(impresora, 'impresora')"
            class="btn-primary w-full"
          >
            <i class="fas fa-user-plus mr-2"></i> Asignar a Usuario
          </button>
        </div>
      </div>
    </div>

    <!-- Mensajes cuando no hay elementos -->
    <div
      v-if="
        tabActiva === 'equipos' && equiposDisponibles.length === 0 && !cargando
      "
      class="text-center py-8 bg-gray-50 rounded-lg"
    >
      <i class="fas fa-check-circle text-gray-400 text-4xl mb-4"></i>
      <p class="text-gray-600">No hay equipos disponibles</p>
    </div>

    <div
      v-if="
        tabActiva === 'impresoras' &&
        impresorasDisponibles.length === 0 &&
        !cargando
      "
      class="text-center py-8 bg-gray-50 rounded-lg"
    >
      <i class="fas fa-print text-gray-400 text-4xl mb-4"></i>
      <p class="text-gray-600">No hay impresoras disponibles</p>
    </div>

    <!-- Estado de carga -->
    <div v-if="cargando" class="text-center py-8 bg-gray-50 rounded-lg">
      <i class="fas fa-circle-notch fa-spin text-blue-500 text-2xl mb-2"></i>
      <p class="text-gray-600">Cargando...</p>
    </div>

    <!-- Modal para asignar recurso -->
    <div
      v-if="mostrarModalAsignar"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 class="text-lg font-semibold mb-4">
          Asignar {{ tipoRecurso === "impresora" ? "Impresora" : "Equipo" }} a
          Usuario
        </h3>

        <div class="mb-4">
          <p>
            <strong
              >{{
                tipoRecurso === "impresora" ? "Impresora" : "Equipo"
              }}:</strong
            >
            {{
              tipoRecurso === "impresora"
                ? recursoSeleccionado?.modelo
                : (recursoSeleccionado as EquipoDisponible)?.marca +
                  " " +
                  (recursoSeleccionado as EquipoDisponible)?.modelo
            }}
          </p>
          <p>
            <strong>Código:</strong>
            {{ recursoSeleccionado?.codigoPatrimonial }}
          </p>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Buscar Usuario</label>
          <div class="relative">
            <input
              v-model="busquedaUsuario"
              @input="buscarUsuarios"
              type="text"
              class="input w-full"
              placeholder="Buscar por DNI o nombre..."
            />
            <ul
              v-if="usuariosEncontrados.length"
              class="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
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

        <div class="flex gap-3 justify-end">
          <button @click="cerrarModal" class="btn-cancel">Cancelar</button>
          <button
            @click="confirmarAsignacion"
            class="btn-primary"
            :disabled="!usuarioSeleccionado || asignando"
          >
            <span v-if="asignando">
              <i class="fas fa-circle-notch fa-spin mr-2"></i> Asignando...
            </span>
            <span v-else>Asignar</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import axios from "axios";

interface EquipoDisponible {
  id: number;
  tipo: string;
  marca: string;
  modelo: string;
  codigoPatrimonial: string;
  procesador: string;
  ram: string;
  almacenamiento: string;
}

interface ImpresoraDisponible {
  id: number;
  modelo: string;
  codigoPatrimonial: string;
  ip: string;
  mac: string;
  oficina: string;
}

interface Usuario {
  id: number;
  dni: string;
  nombres: string;
  apellidos: string;
  oficina: string;
}

type RecursoSeleccionado = EquipoDisponible | ImpresoraDisponible;

export default defineComponent({
  name: "EquiposDisponibles",
  setup() {
    const equiposDisponibles = ref<EquipoDisponible[]>([]);
    const impresorasDisponibles = ref<ImpresoraDisponible[]>([]);
    const tabActiva = ref<"equipos" | "impresoras">("equipos");
    const mostrarModalAsignar = ref(false);
    const recursoSeleccionado = ref<RecursoSeleccionado | null>(null);
    const tipoRecurso = ref<"equipo" | "impresora">("equipo");
    const busquedaUsuario = ref("");
    const usuariosEncontrados = ref<Usuario[]>([]);
    const usuarioSeleccionado = ref<Usuario | null>(null);
    const cargando = ref(false);
    const asignando = ref(false);

    const cargarDatosDisponibles = async () => {
      try {
        cargando.value = true;

        // Cargar equipos e impresoras disponibles
        const [equiposResponse, impresorasResponse] = await Promise.all([
          axios.get("/sistema/equipos-disponibles"),
          axios.get("/sistema/impresoras-disponibles"),
        ]);

        // 🔽 FILTRAR SOLO LOS QUE SIGUEN DISPONIBLES
        equiposDisponibles.value = equiposResponse.data.data.filter(
          (equipo: any) => equipo.estado_especial === "disponible"
        );
        impresorasDisponibles.value = impresorasResponse.data.data.filter(
          (impresora: any) => impresora.estado_especial === "disponible"
        );

        console.log("🔄 Datos disponibles actualizados:", {
          equipos: equiposDisponibles.value.length,
          impresoras: impresorasDisponibles.value.length,
        });
      } catch (error: any) {
        console.error("Error al cargar recursos disponibles:", error);
        alert(
          "Error al cargar recursos disponibles: " +
            (error.response?.data?.error || error.message)
        );
      } finally {
        cargando.value = false;
      }
    };

    const asignarRecurso = (
      recurso: RecursoSeleccionado,
      tipo: "equipo" | "impresora"
    ) => {
      recursoSeleccionado.value = recurso;
      tipoRecurso.value = tipo;
      mostrarModalAsignar.value = true;
      resetearBusquedaUsuario();
    };

    const resetearBusquedaUsuario = () => {
      busquedaUsuario.value = "";
      usuariosEncontrados.value = [];
      usuarioSeleccionado.value = null;
    };

    const buscarUsuarios = async () => {
      if (busquedaUsuario.value.length > 2) {
        try {
          const response = await axios.get(
            `/usuarios?buscar=${busquedaUsuario.value}`
          );
          usuariosEncontrados.value = response.data.data || [];
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
      busquedaUsuario.value = `${usuario.nombres} ${usuario.apellidos} (${usuario.dni})`;
      usuariosEncontrados.value = [];
    };

    const confirmarAsignacion = async () => {
      if (!recursoSeleccionado.value || !usuarioSeleccionado.value) return;

      try {
        asignando.value = true;

        const tipo =
          tipoRecurso.value === "impresora" ? "impresoras" : "equipos";
        const url = `/sistema/${tipo}/${recursoSeleccionado.value.id}/asignar`;
        const payload = {
          usuarioId: usuarioSeleccionado.value.id,
        };

        console.log("🔍 DEBUG - URL:", url);
        console.log("🔍 DEBUG - Payload:", payload);

        const response = await axios.put(url, payload);

        console.log("✅ ÉXITO - Respuesta:", response.data);

        alert(
          `${
            tipoRecurso.value === "impresora" ? "Impresora" : "Equipo"
          } asignado correctamente\n` +
            `Estado especial: ${response.data.data.estado_especial}` // ← CORREGIDO
        );

        cerrarModal();
        cargarDatosDisponibles();
      } catch (error: any) {
        console.error("❌ ERROR COMPLETO:", error);

        if (error.response) {
          console.error("❌ RESPONSE ERROR DATA:", error.response.data);
          alert(
            `Error ${error.response.status}: ${
              error.response.data.message || JSON.stringify(error.response.data)
            }`
          );
        } else if (error.request) {
          alert("Error de conexión: No se pudo contactar al servidor");
        } else {
          alert("Error: " + error.message);
        }
      } finally {
        asignando.value = false;
      }
    };

    const cerrarModal = () => {
      mostrarModalAsignar.value = false;
      recursoSeleccionado.value = null;
      resetearBusquedaUsuario();
    };

    onMounted(() => {
      cargarDatosDisponibles();
    });

    return {
      equiposDisponibles,
      impresorasDisponibles,
      tabActiva,
      mostrarModalAsignar,
      recursoSeleccionado,
      tipoRecurso,
      busquedaUsuario,
      usuariosEncontrados,
      usuarioSeleccionado,
      cargando,
      asignando,
      asignarRecurso,
      buscarUsuarios,
      seleccionarUsuario,
      confirmarAsignacion,
      cerrarModal,
    };
  },
});
</script>

<style scoped>
.btn-primary {
  @apply bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm transition disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn-cancel {
  @apply bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded text-sm transition;
}

.input {
  @apply p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500;
}
</style>
