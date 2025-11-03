<template>
  <div class="container mx-auto p-4">
    <div
      class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4"
    >
      <h1 class="text-2xl font-bold text-gray-800">Gestión de Usuarios</h1>
      <div class="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
        <router-link to="/usuarios/agregar" class="btn-primary">
          <i class="fas fa-plus mr-2"></i> Nuevo Usuario
        </router-link>
        <button
          @click="exportarUsuarios"
          class="btn-success"
          :disabled="usuarios.length === 0"
        >
          <i class="fas fa-file-export mr-2"></i> Exportar
        </button>
      </div>
    </div>

    <div v-if="loading" class="text-center py-8 bg-gray-50 rounded-lg">
      <i class="fas fa-circle-notch fa-spin text-blue-500 text-2xl mb-2"></i>
      <p class="text-gray-600">Cargando usuarios...</p>
    </div>

    <div
      v-else-if="error"
      class="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-4"
    >
      <div class="flex items-center">
        <i class="fas fa-exclamation-circle text-red-500 mr-2"></i>
        <p class="text-red-700">{{ error }}</p>
      </div>
      <button
        @click="cargarUsuarios"
        class="mt-2 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
      >
        <i class="fas fa-sync-alt mr-1"></i> Reintentar
      </button>
    </div>

    <div
      v-else-if="usuarios.length === 0"
      class="text-center py-8 bg-gray-50 rounded-lg"
    >
      <i class="fas fa-users text-gray-400 text-2xl mb-2"></i>
      <p class="text-gray-600 mb-4">No hay usuarios registrados</p>
      <router-link
        to="/usuarios/agregar"
        class="btn-primary inline-flex items-center"
      >
        <i class="fas fa-plus mr-2"></i> Registrar Primer Usuario
      </router-link>
    </div>

    <div v-else class="bg-white rounded-lg shadow overflow-hidden">
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

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                ID
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                DNI
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Nombres
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Apellidos
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Oficina
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Contrato
              </th>
              <th
                class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Acciones
              </th>
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
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
              >
                #{{ usuario.id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-mono">
                {{ usuario.dni }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                {{ usuario.nombres }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                {{ usuario.apellidos }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                {{ usuario.oficina }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <span
                  class="px-2 py-1 rounded-full text-xs font-medium"
                  :class="getBadgeContrato(usuario.tipoContrato)"
                >
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
                    @click="verImpresoras(usuario)"
                    class="btn-action bg-purple-600 text-white hover:bg-purple-700"
                    title="Ver Impresoras"
                  >
                    <i class="fas fa-print"></i>
                  </button>
                  <button
                    @click="generarReporteUsuario(usuario)"
                    class="btn-action bg-gray-600 text-white hover:bg-gray-700"
                    title="Generar Reporte"
                  >
                    <i class="fas fa-file-pdf"></i>
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

      <div
        class="px-4 py-3 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-3"
      >
        <div class="text-sm text-gray-500">
          Mostrando {{ (paginaActual - 1) * itemsPorPagina + 1 }} -
          {{
            Math.min(paginaActual * itemsPorPagina, usuariosFiltrados.length)
          }}
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
              v-if="
                Math.abs(page - paginaActual) <= 2 ||
                page === 1 ||
                page === totalPaginas
              "
              @click="cambiarPagina(page)"
              :class="{
                'bg-blue-500 text-white': paginaActual === page,
                'bg-white text-gray-700': paginaActual !== page,
              }"
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

    <div
      v-if="usuarioAEliminar"
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
            >{{ usuarioAEliminar.nombres }}
            {{ usuarioAEliminar.apellidos }}</strong
          >
          (DNI: {{ usuarioAEliminar.dni }})?
        </p>
        <p class="text-sm text-gray-500 mb-6">
          <i class="fas fa-info-circle mr-1"></i> Esta acción no se puede
          deshacer.
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

    <div
      v-if="mostrarModalEquipos"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div
        class="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
      >
        <div class="flex justify-between items-center mb-4">
          <div>
            <h3 class="text-lg font-semibold">
              <i class="fas fa-laptop mr-2 text-blue-500"></i>
              Equipos asignados a {{ usuarioSeleccionado?.nombres }}
              {{ usuarioSeleccionado?.apellidos }}
            </h3>
            <p class="text-sm text-gray-500">
              DNI: {{ usuarioSeleccionado?.dni }} • Oficina: {{ usuarioSeleccionado?.oficina }}
            </p>
          </div>
          <button
            @click="cerrarModalEquipos"
            class="text-gray-500 hover:text-gray-700 text-xl"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div v-if="cargandoEquipos" class="text-center py-8">
          <i class="fas fa-circle-notch fa-spin text-blue-500 text-2xl mb-2"></i>
          <p class="text-gray-600">Cargando equipos...</p>
        </div>

        <div v-else>
          <div
            v-if="equiposUsuario.length === 0"
            class="text-center py-8 text-gray-500"
          >
            <i class="fas fa-laptop text-4xl mb-3 text-gray-300"></i>
            <p class="text-lg mb-2">No hay equipos asignados</p>
            <p class="text-sm">Este usuario no tiene equipos de computo asignados actualmente.</p>
          </div>

          <div v-else class="space-y-3">
            <div class="flex justify-between items-center mb-2">
              <span class="text-sm text-gray-500">
                Total: {{ equiposUsuario.length }} equipo(s)
              </span>
            </div>
            
            <div
              v-for="equipo in equiposUsuario"
              :key="equipo.id"
              class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 bg-white"
            >
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-2">
                    <h4 class="font-semibold text-gray-800">
                      {{ equipo.tipo }} {{ equipo.marca }} {{ equipo.modelo }}
                    </h4>
                    <span
                      class="text-xs px-2 py-1 rounded-full font-medium"
                      :class="getEstadoEquipoClass(equipo.estado)"
                    >
                      {{ equipo.estado || 'Activo' }}
                    </span>
                  </div>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                    <div class="flex items-center gap-2">
                      <i class="fas fa-hashtag text-gray-400"></i>
                      <span class="font-mono">{{ equipo.codigoPatrimonial || 'Sin código' }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <i class="fas fa-network-wired text-gray-400"></i>
                      <span class="font-mono">{{ equipo.ip }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <i class="fas fa-microchip text-gray-400"></i>
                      <span>{{ equipo.procesador || 'N/A' }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <i class="fas fa-memory text-gray-400"></i>
                      <span>{{ equipo.ram || 'N/A' }}</span>
                    </div>
                  </div>
                </div>
                
                <div class="flex flex-col items-end gap-2 ml-4">
                  <button
                    @click="generarReporteEquipo(equipo)"
                    class="text-red-500 hover:text-red-700 transition-colors p-2 rounded-full hover:bg-red-50"
                    title="Generar Reporte PDF"
                  >
                    <i class="fas fa-file-pdf text-lg"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="mostrarModalImpresoras"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div
        class="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
      >
        <div class="flex justify-between items-center mb-4">
          <div>
            <h3 class="text-lg font-semibold">
              <i class="fas fa-print mr-2 text-purple-500"></i>
              Impresoras asignadas a {{ usuarioSeleccionado?.nombres }}
              {{ usuarioSeleccionado?.apellidos }}
            </h3>
            <p class="text-sm text-gray-500">
              DNI: {{ usuarioSeleccionado?.dni }} • Oficina: {{ usuarioSeleccionado?.oficina }}
            </p>
          </div>
          <button
            @click="cerrarModalImpresoras"
            class="text-gray-500 hover:text-gray-700 text-xl"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div v-if="cargandoImpresoras" class="text-center py-8">
          <i class="fas fa-circle-notch fa-spin text-purple-500 text-2xl mb-2"></i>
          <p class="text-gray-600">Cargando impresoras...</p>
        </div>

        <div v-else>
          <div
            v-if="impresorasUsuario.length === 0"
            class="text-center py-8 text-gray-500"
          >
            <i class="fas fa-print text-4xl mb-3 text-gray-300"></i>
            <p class="text-lg mb-2">No hay impresoras asignadas</p>
            <p class="text-sm">Este usuario no tiene impresoras asignadas actualmente.</p>
          </div>

          <div v-else class="space-y-3">
            <div class="flex justify-between items-center mb-2">
              <span class="text-sm text-gray-500">
                Total: {{ impresorasUsuario.length }} impresora(s)
              </span>
            </div>

            <div
              v-for="impresora in impresorasUsuario"
              :key="impresora.id"
              class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 bg-white"
            >
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-2">
                    <h4 class="font-semibold text-gray-800">
                      {{ impresora.modelo }}
                    </h4>
                    <span
                      class="text-xs px-2 py-1 rounded-full font-medium"
                      :class="getEstadoImpresoraClass(impresora.estado)"
                    >
                      {{ impresora.estado || 'Activa' }}
                    </span>
                  </div>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                    <div class="flex items-center gap-2">
                      <i class="fas fa-hashtag text-gray-400"></i>
                      <span class="font-mono">{{ impresora.codigoPatrimonial || 'Sin código' }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <i class="fas fa-network-wired text-gray-400"></i>
                      <span class="font-mono">{{ impresora.ip || 'Sin IP' }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <i class="fas fa-building text-gray-400"></i>
                      <span>{{ impresora.oficina || 'Sin oficina' }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <i class="fas fa-fingerprint text-gray-400"></i>
                      <span class="font-mono text-xs">{{ impresora.mac || 'Sin MAC' }}</span>
                    </div>
                  </div>
                </div>
                
                <div class="flex flex-col items-end gap-2 ml-4">
                  <button
                    @click="generarReporteImpresora(impresora)"
                    class="text-red-500 hover:text-red-700 transition-colors p-2 rounded-full hover:bg-red-50"
                    title="Generar Reporte PDF"
                  >
                    <i class="fas fa-file-pdf text-lg"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import ExcelJS from "exceljs";
import { ElMessage } from "element-plus";
import { useLoading } from "@/composables/useLoading"; // AÑADE ESTA IMPORTACIÓN

import "../interceptors/axios";

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
  procesador?: string;
  ram?: string;
  almacenamiento?: string;
  ip: string;
  mac?: string;
  codigoPatrimonial: string;
  so?: string;
  officeVersion?: string;
  antivirus?: string;
  estado: string;
  oficina?: string;
  usuarioId?: number;
}

interface Impresora {
  id: number;
  modelo: string;
  ip?: string;
  mac?: string;
  oficina?: string;
  codigoPatrimonial?: string;
  estado: string;
  usuarioId?: number;
}

export default defineComponent({
  name: "ListaUsuarios",
  setup() {
    const router = useRouter();
    const usuarios = ref<Usuario[]>([]);
    const busqueda = ref("");
    const paginaActual = ref(1);
    const itemsPorPagina = 10;
    const loading = ref(true);
    const error = ref("");
    const usuarioAEliminar = ref<Usuario | null>(null);
    const eliminando = ref(false);
    const usuarioSeleccionado = ref<Usuario | null>(null);
    const equiposUsuario = ref<Equipo[]>([]);
    const impresorasUsuario = ref<Impresora[]>([]);
    const cargandoEquipos = ref(false);
    const cargandoImpresoras = ref(false);
    const mostrarModalEquipos = ref(false);
    const mostrarModalImpresoras = ref(false);

    const cargarUsuarios = async () => {
      loading.value = true;
      error.value = "";

      try {
        const response = await axios.get("/usuarios");
        usuarios.value = response.data.data;
      } catch (err: any) {
        console.error("Error al cargar usuarios:", err);
        error.value =
          "No se pudieron cargar los usuarios. " +
          (err.response?.data?.message || err.message || "Error desconocido");
      } finally {
        loading.value = false;
      }
    };

    const usuariosFiltrados = computed(() => {
      if (!busqueda.value.trim()) return usuarios.value;
      const termino = busqueda.value.toLowerCase().trim();
      return usuarios.value.filter(
        (usuario) =>
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

    const cambiarPagina = (pagina: number) => {
      if (pagina >= 1 && pagina <= totalPaginas.value) {
        paginaActual.value = pagina;
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    const getEstadoEquipoClass = (estado?: string) => {
      const estados: Record<string, string> = {
        bueno: "bg-green-100 text-green-800",
        regular: "bg-yellow-100 text-yellow-800",
        malo: "bg-red-100 text-red-800",
        activo: "bg-green-100 text-green-800",
        inactivo: "bg-gray-100 text-gray-800",
        mantenimiento: "bg-yellow-100 text-yellow-800",
        revision: "bg-orange-100 text-orange-800",
        baja: "bg-red-100 text-red-800",
      };
      return estados[estado?.toLowerCase() || ""] || "bg-gray-100 text-gray-800";
    };

    const getEstadoImpresoraClass = (estado?: string) => {
      const estados: Record<string, string> = {
        bueno: "bg-green-100 text-green-800",
        regular: "bg-yellow-100 text-yellow-800",
        malo: "bg-red-100 text-red-800",
        activo: "bg-green-100 text-green-800",
        inactivo: "bg-gray-100 text-gray-800",
        mantenimiento: "bg-yellow-100 text-yellow-800",
        baja: "bg-red-100 text-red-800",
      };
      return estados[estado?.toLowerCase() || ""] || "bg-gray-100 text-gray-800";
    };

    const getBadgeContrato = (tipoContrato: string) => {
      const tipos: Record<string, string> = {
        Nombrado: "bg-green-100 text-green-800",
        Contratado: "bg-blue-100 text-blue-800",
        CAS: "bg-yellow-100 text-yellow-800",
        Practicante: "bg-purple-100 text-purple-800",
      };
      return tipos[tipoContrato] || "bg-gray-100 text-gray-800";
    };

    // FUNCIONES PRINCIPALES CORREGIDAS
    const verEquipos = async (usuario: Usuario) => {
      usuarioSeleccionado.value = usuario;
      mostrarModalEquipos.value = true;
      cargandoEquipos.value = true;
      equiposUsuario.value = [];

      try {
        // Obtener TODOS los equipos y filtrar por usuarioId
        const response = await axios.get("/equipos");
        const todosLosEquipos = response.data.data || [];
        
        // Filtrar equipos que pertenecen a este usuario
        equiposUsuario.value = todosLosEquipos.filter(
          (equipo: any) => equipo.usuarioId === usuario.id
        );
        
        if (equiposUsuario.value.length === 0) {
          ElMessage.info(`${usuario.nombres} no tiene equipos asignados`);
        }
      } catch (err: any) {
        console.error("Error al cargar equipos:", err);
        ElMessage.error("Error al cargar los equipos del usuario");
        equiposUsuario.value = [];
      } finally {
        cargandoEquipos.value = false;
      }
    };

    const verImpresoras = async (usuario: Usuario) => {
      usuarioSeleccionado.value = usuario;
      mostrarModalImpresoras.value = true;
      cargandoImpresoras.value = true;
      impresorasUsuario.value = [];

      try {
        // Obtener TODAS las impresoras y filtrar por usuarioId
        const response = await axios.get("/impresoras");
        const todasLasImpresoras = response.data.data || [];
        
        // Filtrar impresoras que pertenecen a este usuario
        impresorasUsuario.value = todasLasImpresoras.filter(
          (impresora: any) => impresora.usuarioId === usuario.id
        );
        
        if (impresorasUsuario.value.length === 0) {
          ElMessage.info(`${usuario.nombres} no tiene impresoras asignadas`);
        }
      } catch (err: any) {
        console.error("Error al cargar impresoras:", err);
        ElMessage.error("Error al cargar las impresoras del usuario");
        impresorasUsuario.value = [];
      } finally {
        cargandoImpresoras.value = false;
      }
    };

    const cerrarModalEquipos = () => {
      mostrarModalEquipos.value = false;
      usuarioSeleccionado.value = null;
    };

    const cerrarModalImpresoras = () => {
      mostrarModalImpresoras.value = false;
      usuarioSeleccionado.value = null;
    };

    const editarUsuario = (id: number) => {
      router.push(`/usuarios/editar/${id}`);
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
        await axios.delete(`/usuarios/${usuarioAEliminar.value.id}`);
        usuarios.value = usuarios.value.filter(
          (u) => u.id !== usuarioAEliminar.value!.id
        );
        usuarioAEliminar.value = null;
        ElMessage.success("Usuario eliminado correctamente");
      } catch (err: any) {
        console.error("Error al eliminar usuario:", err);
        if (err.response?.data?.error) {
          ElMessage.error(err.response.data.error);
        } else {
          ElMessage.error("Error al eliminar el usuario");
        }
      } finally {
        eliminando.value = false;
      }
    };

  // FUNCIONES DE REPORTES CORREGIDAS - USANDO COMPOSABLE
const generarReporteUsuario = async (usuario: Usuario) => {
  const { startLoading, stopLoading } = useLoading()
  
  try {
    startLoading({ text: "Generando reporte PDF..." })

    // Endpoint corregido
    const response = await axios.get(
      `/sistema/reportes/usuario/${usuario.id}`,
      {
        responseType: "blob",
      }
    )

    const blob = new Blob([response.data], { type: "application/pdf" })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `reporte-usuario-${usuario.dni}-${usuario.apellidos}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    ElMessage.success("Reporte generado exitosamente")
  } catch (error: any) {
    console.error("Error al generar reporte:", error)
    ElMessage.error("Error al generar el reporte PDF")
  } finally {
    stopLoading()
  }
}

const generarReporteEquipo = async (equipo: Equipo) => {
  const { startLoading, stopLoading } = useLoading()
  
  try {
    startLoading({ text: "Generando reporte del equipo..." })

    // Endpoint corregido - usar el mismo formato que para usuario
    const response = await axios.get(
      `/sistema/reportes/equipo/${equipo.id}`,
      {
        responseType: "blob",
      }
    )

    const blob = new Blob([response.data], { type: "application/pdf" })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `reporte-equipo-${
      equipo.codigoPatrimonial || equipo.id
    }.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    ElMessage.success("Reporte del equipo generado exitosamente")
  } catch (error: any) {
    console.error("Error al generar reporte del equipo:", error)
    // Si falla, intentar con el endpoint alternativo
    try {
      const response = await axios.get(
        `/sistema/reportes/cambio/equipo/${equipo.id}`,
        {
          responseType: "blob",
        }
      )

      const blob = new Blob([response.data], { type: "application/pdf" })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `reporte-equipo-${
        equipo.codigoPatrimonial || equipo.id
      }.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      ElMessage.success("Reporte del equipo generado exitosamente")
    } catch (secondError: any) {
      ElMessage.error("Error al generar el reporte del equipo")
    }
  } finally {
    stopLoading()
  }
}

const generarReporteImpresora = async (impresora: Impresora) => {
  const { startLoading, stopLoading } = useLoading()
  
  try {
    startLoading({ text: "Generando reporte de la impresora..." })

    // Endpoint corregido - usar el mismo formato que para usuario
    const response = await axios.get(
      `/sistema/reportes/impresora/${impresora.id}`,
      {
        responseType: "blob",
      }
    )

    const blob = new Blob([response.data], { type: "application/pdf" })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `reporte-impresora-${
      impresora.codigoPatrimonial || impresora.id
    }.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    ElMessage.success("Reporte de la impresora generado exitosamente")
  } catch (error: any) {
    console.error("Error al generar reporte de impresora:", error)
    // Si falla, intentar con el endpoint alternativo
    try {
      const response = await axios.get(
        `/sistema/reportes/cambio/impresora/${impresora.id}`,
        {
          responseType: "blob",
        }
      )

      const blob = new Blob([response.data], { type: "application/pdf" })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `reporte-impresora-${
        impresora.codigoPatrimonial || impresora.id
      }.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      ElMessage.success("Reporte de la impresora generado exitosamente")
    } catch (secondError: any) {
      ElMessage.error("Error al generar el reporte de la impresora")
    }
  } finally {
    stopLoading()
  }
}

    const exportarUsuarios = async () => {
      if (usuarios.value.length === 0) {
        ElMessage.warning("No hay usuarios para exportar");
        return;
      }

      try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Usuarios");

        worksheet.columns = [
          { header: "ID", key: "id", width: 8 },
          { header: "DNI", key: "dni", width: 12 },
          { header: "Nombres", key: "nombres", width: 25 },
          { header: "Apellidos", key: "apellidos", width: 25 },
          { header: "Oficina", key: "oficina", width: 20 },
          { header: "Tipo Contrato", key: "tipoContrato", width: 15 },
          { header: "Fecha Registro", key: "createdAt", width: 15 },
        ];

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

        usuarios.value.forEach((usuario, index) => {
          const row = worksheet.addRow({
            id: usuario.id,
            dni: usuario.dni,
            nombres: usuario.nombres,
            apellidos: usuario.apellidos,
            oficina: usuario.oficina,
            tipoContrato: usuario.tipoContrato,
            createdAt: new Date(usuario.createdAt).toLocaleDateString("es-PE"),
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
        link.download = `usuarios_${
          new Date().toISOString().split("T")[0]
        }.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);

        ElMessage.success("Usuarios exportados exitosamente");
      } catch (err) {
        console.error("Error al exportar usuarios:", err);
        ElMessage.error("Error al exportar usuarios a Excel");
      }
    };

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
      impresorasUsuario,
      cargandoEquipos,
      cargandoImpresoras,
      mostrarModalEquipos,
      mostrarModalImpresoras,
      usuariosFiltrados,
      usuariosPaginados,
      totalPaginas,
      getEstadoEquipoClass,
      getEstadoImpresoraClass,
      getBadgeContrato,
      verEquipos,
      verImpresoras,
      editarUsuario,
      cambiarPagina,
      cerrarModalEquipos,
      cerrarModalImpresoras,
      confirmarEliminacion,
      cancelarEliminacion,
      eliminarUsuario,
      generarReporteUsuario,
      generarReporteEquipo,
      generarReporteImpresora,
      cargarUsuarios,
      exportarUsuarios,
    };
  },
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

/* Estilos para los estados de impresoras */
.bg-green-100 {
  background-color: #dcfce7;
}
.text-green-800 {
  color: #166534;
}
.bg-yellow-100 {
  background-color: #fef9c3;
}
.text-yellow-800 {
  color: #854d0e;
}
.bg-red-100 {
  background-color: #fee2e2;
}
.text-red-800 {
  color: #991b1b;
}
.bg-blue-100 {
  background-color: #dbeafe;
}
.text-blue-800 {
  color: #1e40af;
}
.bg-gray-100 {
  background-color: #f3f4f6;
}
.text-gray-800 {
  color: #1f2937;
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

  th,
  td {
    @apply px-2 py-3;
  }
}
</style>
