<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">
        Gestión de Usuarios del Sistema
      </h1>
      <button @click="mostrarFormulario = true" class="btn-primary">
        <i class="fas fa-plus mr-2"></i> Crear Usuario
      </button>
    </div>

    <!-- Tabla de usuarios del sistema -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                ID
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Usuario
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Nombre
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Rol
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Estado
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="usuario in usuarios"
              :key="usuario.id"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                {{ usuario.id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                {{ usuario.username }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                {{ usuario.nombre }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <span
                  :class="getRolBadgeClass(usuario.rol)"
                  class="px-2 py-1 rounded-full text-xs"
                >
                  {{ getRolText(usuario.rol) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <span
                  :class="usuario.activo ? 'text-green-600' : 'text-red-600'"
                  class="flex items-center"
                >
                  <i
                    :class="
                      usuario.activo
                        ? 'fas fa-check-circle'
                        : 'fas fa-times-circle'
                    "
                    class="mr-1"
                  ></i>
                  {{ usuario.activo ? "Activo" : "Inactivo" }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <button
                  @click="editarPassword(usuario)"
                  class="text-blue-600 hover:text-blue-800 mr-3"
                  title="Cambiar Contraseña"
                >
                  <i class="fas fa-key"></i>
                </button>
                <button
                  @click="eliminarUsuario(usuario)"
                  class="text-red-600 hover:text-red-800"
                  :disabled="usuario.rol === 'admin'"
                  :class="
                    usuario.rol === 'admin'
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  "
                >
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal para crear usuario -->
    <div
      v-if="mostrarFormulario"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 class="text-lg font-semibold mb-4">Crear Usuario del Sistema</h3>

        <form @submit.prevent="crearUsuario" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Usuario*</label>
            <input
              v-model="nuevoUsuario.username"
              type="text"
              class="input"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Contraseña*</label>
            <input
              v-model="nuevoUsuario.password"
              type="password"
              class="input"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1"
              >Nombre Completo*</label
            >
            <input
              v-model="nuevoUsuario.nombre"
              type="text"
              class="input"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Rol*</label>
            <select v-model="nuevoUsuario.rol" class="input" required>
              <option value="">Seleccionar rol</option>
              <option value="informatica">Informática</option>
              <option value="patrimonio">Patrimonio</option>
            </select>
          </div>

          <div class="flex gap-3 justify-end pt-4">
            <button
              type="button"
              @click="mostrarFormulario = false"
              class="btn-cancel"
            >
              Cancelar
            </button>
            <button type="submit" class="btn-primary" :disabled="cargando">
              <span v-if="cargando">
                <i class="fas fa-circle-notch fa-spin mr-2"></i> Creando...
              </span>
              <span v-else>Crear Usuario</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal para cambiar contraseña -->
    <div
      v-if="mostrarModalPassword"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 class="text-lg font-semibold mb-4">Cambiar Contraseña</h3>

        <div class="mb-4">
          <p class="text-gray-600">
            Cambiando contraseña para:
            <strong>{{ usuarioSeleccionado?.nombre }}</strong>
          </p>
          <p class="text-sm text-gray-500">
            Usuario: {{ usuarioSeleccionado?.username }}
          </p>
        </div>

        <form @submit.prevent="cambiarPasswordUsuario" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1"
              >Nueva Contraseña*</label
            >
            <input
              v-model="nuevaPassword"
              type="password"
              class="input"
              required
              minlength="6"
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1"
              >Confirmar Contraseña*</label
            >
            <input
              v-model="confirmarPassword"
              type="password"
              class="input"
              required
              placeholder="Repetir contraseña"
            />
          </div>

          <div
            v-if="errorPassword"
            class="bg-red-50 border-l-4 border-red-500 p-4 rounded"
          >
            <div class="flex items-center">
              <i class="fas fa-exclamation-circle text-red-500 mr-2"></i>
              <p class="text-red-700">{{ errorPassword }}</p>
            </div>
          </div>

          <div
            v-if="successPassword"
            class="bg-green-50 border-l-4 border-green-500 p-4 rounded"
          >
            <div class="flex items-center">
              <i class="fas fa-check-circle text-green-500 mr-2"></i>
              <p class="text-green-700">{{ successPassword }}</p>
            </div>
          </div>

          <div class="flex gap-3 justify-end pt-4">
            <button
              type="button"
              @click="cerrarModalPassword"
              class="btn-cancel"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="btn-primary"
              :disabled="
                cambiandoPassword || !nuevaPassword || !confirmarPassword
              "
            >
              <span v-if="cambiandoPassword">
                <i class="fas fa-circle-notch fa-spin mr-2"></i> Cambiando...
              </span>
              <span v-else>Cambiar Contraseña</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Mensaje cuando no hay usuarios -->
    <div
      v-if="usuarios.length === 0 && !cargando"
      class="text-center py-8 bg-gray-50 rounded-lg"
    >
      <i class="fas fa-users text-gray-400 text-4xl mb-4"></i>
      <p class="text-gray-600">No hay usuarios del sistema registrados</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import axios from "axios";

interface UsuarioSistema {
  id: number;
  username: string;
  nombre: string;
  rol: string;
  activo: boolean;
}

export default defineComponent({
  name: "UsuariosSistema",
  setup() {
    const usuarios = ref<UsuarioSistema[]>([]);
    const mostrarFormulario = ref(false);
    const mostrarModalPassword = ref(false);
    const cargando = ref(false);
    const cambiandoPassword = ref(false);
    const error = ref("");
    const errorPassword = ref("");
    const successPassword = ref("");

    const usuarioSeleccionado = ref<UsuarioSistema | null>(null);
    const nuevaPassword = ref("");
    const confirmarPassword = ref("");

    const nuevoUsuario = ref({
      username: "",
      password: "",
      nombre: "",
      rol: "",
    });

    const cargarUsuarios = async () => {
      try {
        cargando.value = true;
        const response = await axios.get("/sistema/usuarios-sistema");
        usuarios.value = response.data.data;
      } catch (error: any) {
        console.error("Error al cargar usuarios del sistema:", error);
        error.value =
          "Error al cargar usuarios del sistema: " +
          (error.response?.data?.error || error.message);
        alert(error.value);
      } finally {
        cargando.value = false;
      }
    };

    const crearUsuario = async () => {
      try {
        cargando.value = true;
        await axios.post("/sistema/usuarios-sistema", nuevoUsuario.value);

        alert("Usuario creado correctamente");
        mostrarFormulario.value = false;
        cargarUsuarios();

        // Resetear formulario
        nuevoUsuario.value = {
          username: "",
          password: "",
          nombre: "",
          rol: "",
        };
      } catch (error: any) {
        console.error("Error al crear usuario:", error);
        alert(error.response?.data?.error || "Error al crear usuario");
      } finally {
        cargando.value = false;
      }
    };

    const eliminarUsuario = async (usuario: UsuarioSistema) => {
      if (usuario.rol === "admin") {
        alert("No se puede eliminar un usuario administrador");
        return;
      }

      if (!confirm(`¿Está seguro de eliminar al usuario ${usuario.nombre}?`)) {
        return;
      }

      try {
        await axios.delete(`/sistema/usuarios-sistema/${usuario.id}`);
        alert("Usuario eliminado correctamente");
        cargarUsuarios();
      } catch (error: any) {
        console.error("Error al eliminar usuario:", error);
        alert(error.response?.data?.error || "Error al eliminar usuario");
      }
    };

    const editarPassword = (usuario: UsuarioSistema) => {
      usuarioSeleccionado.value = usuario;
      nuevaPassword.value = "";
      confirmarPassword.value = "";
      errorPassword.value = "";
      successPassword.value = "";
      mostrarModalPassword.value = true;
    };

    const cerrarModalPassword = () => {
      mostrarModalPassword.value = false;
      usuarioSeleccionado.value = null;
      nuevaPassword.value = "";
      confirmarPassword.value = "";
      errorPassword.value = "";
      successPassword.value = "";
    };

    const cambiarPasswordUsuario = async () => {
      if (!usuarioSeleccionado.value) return;

      if (nuevaPassword.value !== confirmarPassword.value) {
        errorPassword.value = "Las contraseñas no coinciden";
        return;
      }

      if (nuevaPassword.value.length < 6) {
        errorPassword.value = "La contraseña debe tener al menos 6 caracteres";
        return;
      }

      try {
        cambiandoPassword.value = true;
        errorPassword.value = "";
        successPassword.value = "";

        // Usar la nueva ruta para cambiar contraseña de otros usuarios
        await axios.put(
          `sistema/usuarios-sistema/${usuarioSeleccionado.value.id}/password`,
          {
            nuevaPassword: nuevaPassword.value,
          }
        );

        successPassword.value = "Contraseña cambiada correctamente";

        setTimeout(() => {
          cerrarModalPassword();
        }, 2000);
      } catch (err: any) {
        console.error("Error al cambiar contraseña:", err);
        errorPassword.value =
          err.response?.data?.error || "Error al cambiar contraseña";
      } finally {
        cambiandoPassword.value = false;
      }
    };

    const getRolBadgeClass = (rol: string) => {
      switch (rol) {
        case "admin":
          return "bg-red-100 text-red-800";
        case "informatica":
          return "bg-blue-100 text-blue-800";
        case "patrimonio":
          return "bg-purple-100 text-purple-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    };

    const getRolText = (rol: string) => {
      switch (rol) {
        case "admin":
          return "Administrador";
        case "informatica":
          return "Informática";
        case "patrimonio":
          return "Patrimonio";
        default:
          return rol;
      }
    };

    onMounted(() => {
      cargarUsuarios();
    });

    return {
      usuarios,
      mostrarFormulario,
      mostrarModalPassword,
      cargando,
      cambiandoPassword,
      error,
      errorPassword,
      successPassword,
      usuarioSeleccionado,
      nuevaPassword,
      confirmarPassword,
      nuevoUsuario,
      crearUsuario,
      eliminarUsuario,
      editarPassword,
      cerrarModalPassword,
      cambiarPasswordUsuario,
      getRolBadgeClass,
      getRolText,
    };
  },
});
</script>

<style scoped>
.btn-primary {
  @apply bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn-cancel {
  @apply bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition;
}

.input {
  @apply w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500;
}
</style>
