<template>
  <div class="container mx-auto p-4">
    <div
      class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4"
    >
      <h1 class="text-2xl font-bold text-gray-800">Recursos Disponibles</h1>
      <div class="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
        <button
          v-if="tabActiva === 'equipos' && equiposFiltrados.length > 0"
          @click="exportarEquiposDisponibles"
          class="btn-success"
        >
          <i class="fas fa-file-export mr-2"></i> Exportar Equipos
        </button>
        <button
          v-if="tabActiva === 'impresoras' && impresorasFiltradas.length > 0"
          @click="exportarImpresorasDisponibles"
          class="btn-success"
        >
          <i class="fas fa-file-export mr-2"></i> Exportar Impresoras
        </button>
      </div>
    </div>

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
            <i class="fas fa-laptop mr-2"></i>
            Equipos ({{ equiposFiltrados.length }})
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
            <i class="fas fa-print mr-2"></i>
            Impresoras ({{ impresorasFiltradas.length }})
          </button>
        </nav>
      </div>
    </div>

    <!-- Tabla de Equipos Disponibles -->
    <div
      v-if="tabActiva === 'equipos'"
      class="bg-white rounded-lg shadow overflow-hidden"
    >
      <!-- Buscador -->
      <div class="p-4 border-b bg-gray-50">
        <div class="relative max-w-md">
          <input
            type="text"
            v-model="busquedaEquipos"
            placeholder="Buscar por código, marca, modelo, procesador..."
            class="input-search"
          />
          <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Código Patrimonial
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Tipo
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Marca / Modelo
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Especificaciones
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Estado
              </th>
              <th
                class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="equiposFiltrados.length === 0 && !cargando">
              <td colspan="6" class="px-6 py-8 text-center text-gray-500">
                <i class="fas fa-search text-gray-300 text-2xl mb-2"></i>
                <p>
                  {{ cargando ? "Cargando..." : "No hay equipos disponibles" }}
                </p>
              </td>
            </tr>
            <tr
              v-for="equipo in equiposFiltrados"
              :key="equipo.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-mono font-medium"
              >
                {{ equipo.codigoPatrimonial || "N/A" }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ equipo.tipo }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  {{ equipo.marca }}
                </div>
                <div class="text-sm text-gray-500">{{ equipo.modelo }}</div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600">
                <div>
                  <strong>Procesador:</strong> {{ equipo.procesador || "N/A" }}
                </div>
                <div><strong>RAM:</strong> {{ equipo.ram || "N/A" }}</div>
                <div>
                  <strong>Almacenamiento:</strong>
                  {{ equipo.almacenamiento || "N/A" }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full"
                >
                  <i class="fas fa-check mr-1"></i> Disponible
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-center">
                <div class="flex justify-center space-x-2">
                  <button
                    @click="asignarRecurso(equipo, 'equipo')"
                    class="btn-action bg-blue-600 text-white hover:bg-blue-700"
                    title="Asignar a Usuario"
                  >
                    <i class="fas fa-user-plus"></i>
                  </button>
                  <button
                    @click="generarReporteEquipo(equipo)"
                    class="btn-action bg-gray-600 text-white hover:bg-gray-700"
                    title="Generar Reporte PDF"
                  >
                    <i class="fas fa-file-pdf"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Tabla de Impresoras Disponibles -->
    <div
      v-if="tabActiva === 'impresoras'"
      class="bg-white rounded-lg shadow overflow-hidden"
    >
      <!-- Buscador -->
      <div class="p-4 border-b bg-gray-50">
        <div class="relative max-w-md">
          <input
            type="text"
            v-model="busquedaImpresoras"
            placeholder="Buscar por código, modelo, IP, oficina..."
            class="input-search"
          />
          <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Código Patrimonial
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Modelo
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                IP / MAC
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Oficina
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Estado
              </th>
              <th
                class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="impresorasFiltradas.length === 0 && !cargando">
              <td colspan="6" class="px-6 py-8 text-center text-gray-500">
                <i class="fas fa-search text-gray-300 text-2xl mb-2"></i>
                <p>
                  {{
                    cargando ? "Cargando..." : "No hay impresoras disponibles"
                  }}
                </p>
              </td>
            </tr>
            <tr
              v-for="impresora in impresorasFiltradas"
              :key="impresora.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-mono font-medium"
              >
                {{ impresora.codigoPatrimonial || "N/A" }}
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
              >
                {{ impresora.modelo }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <div class="font-mono">{{ impresora.ip || "N/A" }}</div>
                <div class="text-xs font-mono text-gray-500">
                  {{ impresora.mac || "N/A" }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ impresora.oficina }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full"
                >
                  <i class="fas fa-check mr-1"></i> Disponible
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-center">
                <div class="flex justify-center space-x-2">
                  <button
                    @click="asignarRecurso(impresora, 'impresora')"
                    class="btn-action bg-blue-600 text-white hover:bg-blue-700"
                    title="Asignar a Usuario"
                  >
                    <i class="fas fa-user-plus"></i>
                  </button>
                  <button
                    @click="generarReporteImpresora(impresora)"
                    class="btn-action bg-gray-600 text-white hover:bg-gray-700"
                    title="Generar Reporte PDF"
                  >
                    <i class="fas fa-file-pdf"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
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

        <div class="mb-4 p-3 bg-gray-50 rounded-md">
          <p class="font-medium">
            {{ tipoRecurso === "impresora" ? "Impresora" : "Equipo" }}:
            {{
              tipoRecurso === "impresora"
                ? recursoSeleccionado?.modelo
                : (recursoSeleccionado as EquipoDisponible)?.marca +
                  " " +
                  (recursoSeleccionado as EquipoDisponible)?.modelo
            }}
          </p>
          <p class="text-sm text-gray-600">
            <strong>Código:</strong>
            {{ recursoSeleccionado?.codigoPatrimonial || "N/A" }}
          </p>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium mb-2">Buscar Usuario</label>
          <div class="relative">
            <input
              v-model="busquedaUsuario"
              @input="buscarUsuarios"
              @focus="mostrarListaUsuarios = true"
              @blur="onBlurInput"
              type="text"
              class="input-search w-full"
              placeholder="Buscar por DNI, nombres, apellidos u oficina..."
            />

            <!-- Lista de resultados -->
            <div
              v-if="mostrarListaUsuarios && usuariosEncontrados.length > 0"
              class="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto mt-1"
            >
              <div
                v-for="usuario in usuariosEncontrados"
                :key="usuario.id"
                @mousedown="seleccionarUsuario(usuario)"
                class="px-4 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
              >
                <div class="font-medium text-gray-900">
                  {{ usuario.nombres }} {{ usuario.apellidos }}
                </div>
                <div class="text-sm text-gray-500">
                  DNI: {{ usuario.dni }} • Oficina: {{ usuario.oficina }}
                </div>
              </div>
            </div>

            <!-- Mensaje cuando no hay resultados -->
            <div
              v-if="
                mostrarListaUsuarios &&
                busquedaUsuario.length > 2 &&
                usuariosEncontrados.length === 0
              "
              class="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 p-4 text-center text-gray-500"
            >
              <i class="fas fa-search text-gray-300 mb-2"></i>
              <p>No se encontraron usuarios</p>
            </div>
          </div>
        </div>

        <div v-if="usuarioSeleccionado" class="mb-4 p-3 bg-blue-50 rounded-md">
          <div class="flex justify-between items-start">
            <div>
              <p class="font-medium text-blue-800">Usuario seleccionado:</p>
              <p class="font-semibold">
                {{ usuarioSeleccionado.nombres }}
                {{ usuarioSeleccionado.apellidos }}
              </p>
              <p class="text-sm text-blue-600">
                DNI: {{ usuarioSeleccionado.dni }} • Oficina:
                {{ usuarioSeleccionado.oficina }}
              </p>
            </div>
            <button
              @click="deseleccionarUsuario"
              class="text-blue-600 hover:text-blue-800 text-sm"
            >
              <i class="fas fa-times"></i>
            </button>
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
import { defineComponent, ref, onMounted, computed } from "vue";
import axios from "axios";
import ExcelJS from "exceljs";
import { ElMessage, ElMessageBox, ElLoading } from "element-plus";

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
    const busquedaEquipos = ref("");
    const busquedaImpresoras = ref("");
    const todosLosUsuarios = ref<Usuario[]>([]);
    const mostrarListaUsuarios = ref(false);

    // Computed para equipos filtrados
    const equiposFiltrados = computed(() => {
      if (!busquedaEquipos.value.trim()) return equiposDisponibles.value;
      const termino = busquedaEquipos.value.toLowerCase().trim();
      return equiposDisponibles.value.filter(
        (equipo) =>
          equipo.codigoPatrimonial?.toLowerCase().includes(termino) ||
          equipo.marca?.toLowerCase().includes(termino) ||
          equipo.modelo?.toLowerCase().includes(termino) ||
          equipo.tipo?.toLowerCase().includes(termino) ||
          equipo.procesador?.toLowerCase().includes(termino)
      );
    });

    // Computed para impresoras filtradas
    const impresorasFiltradas = computed(() => {
      if (!busquedaImpresoras.value.trim()) return impresorasDisponibles.value;
      const termino = busquedaImpresoras.value.toLowerCase().trim();
      return impresorasDisponibles.value.filter(
        (impresora) =>
          impresora.codigoPatrimonial?.toLowerCase().includes(termino) ||
          impresora.modelo?.toLowerCase().includes(termino) ||
          impresora.ip?.toLowerCase().includes(termino) ||
          impresora.oficina?.toLowerCase().includes(termino)
      );
    });

    const cargarDatosDisponibles = async () => {
      try {
        cargando.value = true;

        const [equiposResponse, impresorasResponse, usuariosResponse] =
          await Promise.all([
            axios.get("/sistema/equipos-disponibles"),
            axios.get("/sistema/impresoras-disponibles"),
            axios.get("/usuarios"), // Cargar todos los usuarios al inicio
          ]);

        equiposDisponibles.value = equiposResponse.data.data.filter(
          (equipo: any) => equipo.estado_especial === "disponible"
        );
        impresorasDisponibles.value = impresorasResponse.data.data.filter(
          (impresora: any) => impresora.estado_especial === "disponible"
        );
        todosLosUsuarios.value =
          usuariosResponse.data?.data || usuariosResponse.data || [];

        console.log("🔄 Datos disponibles actualizados:", {
          equipos: equiposDisponibles.value.length,
          impresoras: impresorasDisponibles.value.length,
          usuarios: todosLosUsuarios.value.length,
        });
      } catch (error: any) {
        console.error("Error al cargar recursos disponibles:", error);
        ElMessage.error(
          "Error al cargar datos: " +
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
      mostrarListaUsuarios.value = false;
    };

    const buscarUsuarios = () => {
      if (busquedaUsuario.value.length > 2) {
        const termino = busquedaUsuario.value.toLowerCase().trim();

        // Aplicar filtro LOCAL igual que en el primer componente
        usuariosEncontrados.value = todosLosUsuarios.value.filter(
          (usuario: Usuario) =>
            usuario.dni?.toLowerCase().includes(termino) ||
            usuario.nombres?.toLowerCase().includes(termino) ||
            usuario.apellidos?.toLowerCase().includes(termino) ||
            `${usuario.nombres} ${usuario.apellidos}`
              .toLowerCase()
              .includes(termino) ||
            usuario.oficina?.toLowerCase().includes(termino)
        );

        console.log(
          "🔍 Usuarios encontrados:",
          usuariosEncontrados.value.length
        );
        mostrarListaUsuarios.value = true;
      } else {
        usuariosEncontrados.value = [];
        mostrarListaUsuarios.value = false;
      }
    };

    const onBlurInput = () => {
      // Pequeño delay para permitir el click en los elementos de la lista
      setTimeout(() => {
        mostrarListaUsuarios.value = false;
      }, 200);
    };

    const seleccionarUsuario = (usuario: Usuario) => {
      usuarioSeleccionado.value = usuario;
      busquedaUsuario.value = `${usuario.nombres} ${usuario.apellidos}`;
      usuariosEncontrados.value = [];
      mostrarListaUsuarios.value = false;
    };

    const deseleccionarUsuario = () => {
      usuarioSeleccionado.value = null;
      busquedaUsuario.value = "";
      usuariosEncontrados.value = [];
    };

    const confirmarAsignacion = async () => {
      if (!recursoSeleccionado.value || !usuarioSeleccionado.value) return;

      try {
        await ElMessageBox.confirm(
          `¿Asignar ${
            tipoRecurso.value === "impresora" ? "la impresora" : "el equipo"
          } a ${usuarioSeleccionado.value.nombres} ${
            usuarioSeleccionado.value.apellidos
          }?`,
          "Confirmar Asignación",
          {
            confirmButtonText: "Sí, Asignar",
            cancelButtonText: "Cancelar",
            type: "warning",
          }
        );

        asignando.value = true;

        const tipo =
          tipoRecurso.value === "impresora" ? "impresoras" : "equipos";
        const url = `/sistema/${tipo}/${recursoSeleccionado.value.id}/asignar`;

        const payload = {
          usuarioId: usuarioSeleccionado.value.id,
          oficina: usuarioSeleccionado.value.oficina,
        };

        await axios.put(url, payload);

        ElMessage.success(
          `${
            tipoRecurso.value === "impresora" ? "Impresora" : "Equipo"
          } asignado correctamente`
        );

        cerrarModal();
        cargarDatosDisponibles();
      } catch (error: any) {
        if (error !== "cancel") {
          console.error("Error al asignar recurso:", error);
          ElMessage.error(
            "Error al asignar el recurso: " +
              (error.response?.data?.error || error.message)
          );
        }
      } finally {
        asignando.value = false;
      }
    };

    // FUNCIONES DE REPORTES PDF
    const generarReporteEquipo = async (equipo: EquipoDisponible) => {
      let loadingInstance: any = null;

      try {
        loadingInstance = ElLoading.service({
          lock: true,
          text: "Generando reporte PDF...",
          background: "rgba(0, 0, 0, 0.7)",
        });

        // ✅ RUTA CORRECTA - SIN /cambio/
        const response = await axios.get(
          `/sistema/reportes/equipo/${equipo.id}`,
          {
            responseType: "blob",
          }
        );

        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `reporte-equipo-disponible-${
          equipo.codigoPatrimonial || equipo.id
        }.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        if (loadingInstance) {
          loadingInstance.close();
        }
        ElMessage.success("Reporte del equipo generado exitosamente");
      } catch (error: any) {
        console.error("Error al generar reporte del equipo:", error);

        if (loadingInstance) {
          loadingInstance.close();
        }
        ElMessage.error("Error al generar el reporte del equipo");
      }
    };

    const generarReporteImpresora = async (impresora: ImpresoraDisponible) => {
      let loadingInstance: any = null;

      try {
        loadingInstance = ElLoading.service({
          lock: true,
          text: "Generando reporte PDF...",
          background: "rgba(0, 0, 0, 0.7)",
        });

        // ✅ RUTA CORRECTA - SIN /cambio/
        const response = await axios.get(
          `/sistema/reportes/cambio/impresora/${impresora.id}`,
          {
            responseType: "blob",
          }
        );

        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `reporte-impresora-disponible-${
          impresora.codigoPatrimonial || impresora.id
        }.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        if (loadingInstance) {
          loadingInstance.close();
        }
        ElMessage.success("Reporte de la impresora generado exitosamente");
      } catch (error: any) {
        console.error("Error al generar reporte de impresora:", error);

        if (loadingInstance) {
          loadingInstance.close();
        }
        ElMessage.error("Error al generar el reporte de la impresora");
      }
    };

    // FUNCIONES DE EXPORTACIÓN EXCEL
    const exportarEquiposDisponibles = async () => {
      if (equiposDisponibles.value.length === 0) {
        ElMessage.warning("No hay equipos para exportar");
        return;
      }

      try {
        const loadingInstance = ElLoading.service({
          lock: true,
          text: "Exportando equipos a Excel...",
          background: "rgba(0, 0, 0, 0.7)",
        });

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Equipos Disponibles");

        worksheet.columns = [
          { header: "ID", key: "id", width: 8 },
          { header: "Código Patrimonial", key: "codigoPatrimonial", width: 20 },
          { header: "Tipo", key: "tipo", width: 15 },
          { header: "Marca", key: "marca", width: 15 },
          { header: "Modelo", key: "modelo", width: 20 },
          { header: "Procesador", key: "procesador", width: 20 },
          { header: "RAM", key: "ram", width: 10 },
          { header: "Almacenamiento", key: "almacenamiento", width: 15 },
        ];

        // Estilo para el header
        worksheet.getRow(1).eachCell((cell) => {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FF3B82F6" },
          };
          cell.font = {
            bold: true,
            color: { argb: "FFFFFFFF" },
            size: 12,
          };
          cell.alignment = { vertical: "middle", horizontal: "center" };
          cell.border = {
            top: { style: "thin", color: { argb: "FF1E40AF" } },
            bottom: { style: "thin", color: { argb: "FF1E40AF" } },
            left: { style: "thin", color: { argb: "FF1E40AF" } },
            right: { style: "thin", color: { argb: "FF1E40AF" } },
          };
        });

        equiposDisponibles.value.forEach((equipo, index) => {
          const row = worksheet.addRow({
            id: equipo.id,
            codigoPatrimonial: equipo.codigoPatrimonial || "N/A",
            tipo: equipo.tipo,
            marca: equipo.marca,
            modelo: equipo.modelo,
            procesador: equipo.procesador || "N/A",
            ram: equipo.ram || "N/A",
            almacenamiento: equipo.almacenamiento || "N/A",
          });

          row.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: index % 2 === 0 ? "FFF3F4F6" : "FFFFFFFF" },
          };

          row.eachCell({ includeEmpty: true }, (cell) => {
            cell.border = {
              top: { style: "thin", color: { argb: "FFE5E7EB" } },
              bottom: { style: "thin", color: { argb: "FFE5E7EB" } },
              left: { style: "thin", color: { argb: "FFE5E7EB" } },
              right: { style: "thin", color: { argb: "FFE5E7EB" } },
            };
            cell.alignment = { vertical: "middle", horizontal: "left" };
          });
        });

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `equipos-disponibles_${
          new Date().toISOString().split("T")[0]
        }.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);

        loadingInstance.close();
        ElMessage.success("Equipos exportados exitosamente");
      } catch (err) {
        console.error("Error al exportar equipos:", err);
        ElMessage.error("Error al exportar equipos a Excel");
      }
    };

    const exportarImpresorasDisponibles = async () => {
      if (impresorasDisponibles.value.length === 0) {
        ElMessage.warning("No hay impresoras para exportar");
        return;
      }

      try {
        const loadingInstance = ElLoading.service({
          lock: true,
          text: "Exportando impresoras a Excel...",
          background: "rgba(0, 0, 0, 0.7)",
        });

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Impresoras Disponibles");

        worksheet.columns = [
          { header: "ID", key: "id", width: 8 },
          { header: "Código Patrimonial", key: "codigoPatrimonial", width: 20 },
          { header: "Modelo", key: "modelo", width: 25 },
          { header: "IP", key: "ip", width: 15 },
          { header: "MAC", key: "mac", width: 20 },
          { header: "Oficina", key: "oficina", width: 20 },
        ];

        // Estilo para el header
        worksheet.getRow(1).eachCell((cell) => {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FF3B82F6" },
          };
          cell.font = {
            bold: true,
            color: { argb: "FFFFFFFF" },
            size: 12,
          };
          cell.alignment = { vertical: "middle", horizontal: "center" };
          cell.border = {
            top: { style: "thin", color: { argb: "FF1E40AF" } },
            bottom: { style: "thin", color: { argb: "FF1E40AF" } },
            left: { style: "thin", color: { argb: "FF1E40AF" } },
            right: { style: "thin", color: { argb: "FF1E40AF" } },
          };
        });

        impresorasDisponibles.value.forEach((impresora, index) => {
          const row = worksheet.addRow({
            id: impresora.id,
            codigoPatrimonial: impresora.codigoPatrimonial || "N/A",
            modelo: impresora.modelo,
            ip: impresora.ip || "N/A",
            mac: impresora.mac || "N/A",
            oficina: impresora.oficina,
          });

          row.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: index % 2 === 0 ? "FFF3F4F6" : "FFFFFFFF" },
          };

          row.eachCell({ includeEmpty: true }, (cell) => {
            cell.border = {
              top: { style: "thin", color: { argb: "FFE5E7EB" } },
              bottom: { style: "thin", color: { argb: "FFE5E7EB" } },
              left: { style: "thin", color: { argb: "FFE5E7EB" } },
              right: { style: "thin", color: { argb: "FFE5E7EB" } },
            };
            cell.alignment = { vertical: "middle", horizontal: "left" };
          });
        });

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `impresoras-disponibles_${
          new Date().toISOString().split("T")[0]
        }.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);

        loadingInstance.close();
        ElMessage.success("Impresoras exportadas exitosamente");
      } catch (err) {
        console.error("Error al exportar impresoras:", err);
        ElMessage.error("Error al exportar impresoras a Excel");
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
      busquedaEquipos,
      busquedaImpresoras,
      equiposFiltrados,
      impresorasFiltradas,
      mostrarListaUsuarios,
      asignarRecurso,
      buscarUsuarios,
      seleccionarUsuario,
      deseleccionarUsuario,
      confirmarAsignacion,
      cerrarModal,
      generarReporteEquipo,
      generarReporteImpresora,
      exportarEquiposDisponibles,
      exportarImpresorasDisponibles,
      onBlurInput,
    };
  },
});
</script>

<style scoped>
.btn-success {
  @apply inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn-primary {
  @apply inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn-cancel {
  @apply px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2;
}

.btn-action {
  @apply inline-flex items-center justify-center p-2 rounded-full transition-colors focus:outline-none;
}

.input-search {
  @apply pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent;
}

/* Estilos para estados */
.bg-green-100 {
  background-color: #dcfce7;
}
.text-green-800 {
  color: #166534;
}
</style>
