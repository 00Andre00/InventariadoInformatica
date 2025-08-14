<template>
  <div class="p-4 border rounded-lg shadow-sm bg-white">
    <h2 class="text-xl font-bold mb-4">Agregar Equipo</h2>
    <form @submit.prevent="agregarEquipo" class="space-y-6">
      <!-- Sección de Usuario -->
      <div class="border-b pb-4">
        <h3 class="text-lg font-semibold mb-3">Información del Usuario</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="usuarioId" class="block text-sm font-medium">Usuario Asignado</label>
            <div class="relative">
              <input 
                v-model="usuarioBusqueda" 
                @input="buscarUsuarios" 
                @focus="mostrarListaUsuarios = true"
                type="text" 
                id="usuarioId" 
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
            <label for="oficina" class="block text-sm font-medium">Oficina</label>
            <input 
              v-model="nuevoEquipo.oficina" 
              id="oficina" 
              type="text" 
              class="input bg-gray-100" 
              readonly 
            />
          </div>
        </div>
      </div>

      <!-- Sección del Equipo -->
      <div class="border-b pb-4">
        <h3 class="text-lg font-semibold mb-3">Información del Equipo</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="tipo" class="block text-sm font-medium">Tipo*</label>
            <select v-model="nuevoEquipo.tipo" id="tipo" class="input" required>
              <option value="">Seleccione un tipo</option>
              <option value="Computadora">Computadora</option>
              <option value="Laptop">Laptop</option>
              <option value="Servidor">Servidor</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          <div>
            <label for="marca" class="block text-sm font-medium">Marca*</label>
            <input v-model="nuevoEquipo.marca" id="marca" type="text" class="input" required />
          </div>

          <div>
            <label for="modelo" class="block text-sm font-medium">Modelo*</label>
            <input v-model="nuevoEquipo.modelo" id="modelo" type="text" class="input" required />
          </div>

          <div>
            <label for="procesador" class="block text-sm font-medium">Procesador*</label>
            <input v-model="nuevoEquipo.procesador" id="procesador" type="text" class="input" required />
          </div>

          <div>
            <label for="ram" class="block text-sm font-medium">RAM*</label>
            <select v-model="nuevoEquipo.ram" id="ram" class="input" required>
              <option value="">Seleccione RAM</option>
              <option value="1GB">1GB</option>
              <option value="2GB">2GB</option>
              <option value="4GB">4GB</option>
              <option value="6GB">6GB</option>
              <option value="8GB">8GB</option>
              <option value="16GB">16GB</option>
              <option value="32GB">32GB</option>
              <option value="64GB">64GB</option>
              <option value="128GB">128GB</option>
            </select>
          </div>

          <div>
            <label for="almacenamiento" class="block text-sm font-medium">Almacenamiento*</label>
            <select v-model="nuevoEquipo.almacenamiento" id="almacenamiento" class="input" required>
              <option value="">Seleccione almacenamiento</option>
              <option value="125GB">125GB</option>
              <option value="250GB">250GB</option>
              <option value="500GB">500GB</option>
              <option value="1TB">1TB</option>
              <option value="2TB">2TB</option>
            </select>
          </div>

          <div>
            <label for="ip" class="block text-sm font-medium">IP*</label>
            <input v-model="nuevoEquipo.ip" id="ip" type="text" class="input" required />
            <p class="text-xs text-gray-500 mt-1">Formato: 192.168.1.1</p>
          </div>

          <div>
            <label for="mac" class="block text-sm font-medium">MAC Address*</label>
            <input v-model="nuevoEquipo.mac" id="mac" type="text" class="input" required />
            <p class="text-xs text-gray-500 mt-1">Formato: 00:1A:2B:3C:4D:5E o 00-1A-2B-3C-4D-5E</p>
          </div>

          <div>
            <label for="codigoPatrimonial" class="block text-sm font-medium">Código Patrimonial</label>
            <input v-model="nuevoEquipo.codigoPatrimonial" id="codigoPatrimonial" type="text" class="input" />
          </div>

          <div>
            <label for="so" class="block text-sm font-medium">Sistema Operativo</label>
            <select v-model="nuevoEquipo.so" id="so" class="input">
              <option value="">Seleccione SO</option>
              <option value="Windows Server">Windows Server</option>
              <option value="Windows 7">Windows 7</option>
              <option value="Windows 8">Windows 8</option>
              <option value="Windows 10">Windows 10</option>
              <option value="Windows 11">Windows 11</option>
            </select>
          </div>

          <div>
            <label for="officeVersion" class="block text-sm font-medium">Versión de Office</label>
            <input v-model="nuevoEquipo.officeVersion" id="officeVersion" type="text" class="input" />
          </div>

          <div>
            <label for="antivirus" class="block text-sm font-medium">Antivirus</label>
            <input v-model="nuevoEquipo.antivirus" id="antivirus" type="text" class="input" />
          </div>

          <div>
            <label for="estado" class="block text-sm font-medium">Estado del equipo*</label>
            <select v-model="nuevoEquipo.estado" id="estado" class="input" required>
              <option value="">Seleccione estado</option>
              <option value="Bueno">Bueno</option>
              <option value="Regular">Regular</option>
              <option value="Malo">Malo</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Sección del Monitor -->
      <div class="border-b pb-4">
        <h3 class="text-lg font-semibold mb-3">Información del Monitor</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="marcaMonitor" class="block text-sm font-medium">Marca Monitor*</label>
            <input v-model="nuevoEquipo.marcaMonitor" id="marcaMonitor" type="text" class="input" required />
          </div>

          <div>
            <label for="pulgadasMonitor" class="block text-sm font-medium">Pulgadas Monitor*</label>
            <input v-model="nuevoEquipo.pulgadasMonitor" id="pulgadasMonitor" type="text" class="input" required />
          </div>

          <div>
            <label for="codigoPatrimonialMonitor" class="block text-sm font-medium">Código Patrimonial Monitor</label>
            <input v-model="nuevoEquipo.codigoPatrimonialMonitor" id="codigoPatrimonialMonitor" type="text" class="input" />
          </div>

          <div>
            <label for="estadoMonitor" class="block text-sm font-medium">Estado del Monitor*</label>
            <select v-model="nuevoEquipo.estadoMonitor" id="estadoMonitor" class="input" required>
              <option value="">Seleccione estado</option>
              <option value="Bueno">Bueno</option>
              <option value="Regular">Regular</option>
              <option value="Malo">Malo</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Sección de Periféricos -->
      <div>
        <h3 class="text-lg font-semibold mb-3">Periféricos</h3>
        <div class="flex items-center space-x-6">
          <div class="flex items-center">
            <input v-model="nuevoEquipo.tieneTeclado" id="tieneTeclado" type="checkbox" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
            <label for="tieneTeclado" class="ml-2 block text-sm font-medium">Tiene Teclado</label>
          </div>

          <div class="flex items-center">
            <input v-model="nuevoEquipo.tieneMouse" id="tieneMouse" type="checkbox" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
            <label for="tieneMouse" class="ml-2 block text-sm font-medium">Tiene Mouse</label>
          </div>
        </div>
      </div>

      <div class="pt-4">
        <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition">
          Agregar Equipo
        </button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import axios from 'axios';

interface Usuario {
  id: number;
  dni: string;
  nombres: string;
  apellidos: string;
  oficina: string;
  tipoContrato: string;
}

export default defineComponent({
  name: 'AgregarEquipo',
  setup() {
    const nuevoEquipo = ref({
      tipo: '',
      marca: '',
      modelo: '',
      procesador: '',
      ram: '',
      almacenamiento: '',
      oficina: '',
      ip: '',
      mac: '',
      codigoPatrimonial: '',
      so: '',
      officeVersion: '',
      antivirus: '',
      estado: '',
      marcaMonitor: '',
      pulgadasMonitor: '',
      codigoPatrimonialMonitor: '',
      estadoMonitor: '',
      tieneTeclado: false,
      tieneMouse: false,
      usuarioId: null as number | null
    });

    const usuarioBusqueda = ref('');
    const usuariosEncontrados = ref<Usuario[]>([]);
    const mostrarListaUsuarios = ref(false);

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
      nuevoEquipo.value.usuarioId = usuario.id;
      nuevoEquipo.value.oficina = usuario.oficina;
      usuarioBusqueda.value = `${usuario.nombres} ${usuario.apellidos} (${usuario.dni})`;
      mostrarListaUsuarios.value = false;
    };

    const agregarEquipo = async () => {
      try {
        // Validar campos requeridos
        if (!nuevoEquipo.value.estado || !nuevoEquipo.value.estadoMonitor) {
          alert('Debe seleccionar el estado del equipo y del monitor');
          return;
        }

        // Preparar datos para enviar
        const datosEnvio = {
          ...nuevoEquipo.value,
          tieneTeclado: nuevoEquipo.value.tieneTeclado ? 1 : 0,
          tieneMouse: nuevoEquipo.value.tieneMouse ? 1 : 0
        };

        await axios.post('https://isiback.drtchco.gob.pe/api/equipos', datosEnvio);
        alert('Equipo agregado correctamente');
        
        // Resetear formulario
        nuevoEquipo.value = {
          tipo: '',
          marca: '',
          modelo: '',
          procesador: '',
          ram: '',
          almacenamiento: '',
          oficina: '',
          ip: '',
          mac: '',
          codigoPatrimonial: '',
          so: '',
          officeVersion: '',
          antivirus: '',
          estado: '',
          marcaMonitor: '',
          pulgadasMonitor: '',
          codigoPatrimonialMonitor: '',
          estadoMonitor: '',
          tieneTeclado: false,
          tieneMouse: false,
          usuarioId: null
        };
        usuarioBusqueda.value = '';
      } catch (error: any) {
        console.error('Error al agregar el equipo', error);
        if (error.response && error.response.data.error) {
          alert(error.response.data.error);
        } else {
          alert('Hubo un error al agregar el equipo');
        }
      }
    };

    return {
      nuevoEquipo,
      usuarioBusqueda,
      usuariosEncontrados,
      mostrarListaUsuarios,
      buscarUsuarios,
      seleccionarUsuario,
      agregarEquipo,
    };
  },
});
</script>

<style scoped>
.input {
  @apply p-2 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500;
}
</style>