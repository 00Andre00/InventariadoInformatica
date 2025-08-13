<template>
  <div class="container mx-auto p-4">
    <h2 class="text-2xl font-semibold mb-4">Editar Equipo</h2>

    <form @submit.prevent="actualizarEquipo" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Moví el campo de usuario al principio -->
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
          <label for="tipo" class="block text-sm font-medium">Tipo*</label>
          <select v-model="equipo.tipo" id="tipo" class="input" required>
            <option value="">Seleccione un tipo</option>
            <option value="Computadora">Computadora</option>
            <option value="Laptop">Laptop</option>
            <option value="Servidor">Servidor</option>
            <option value="Otro">Otro</option>
          </select>
        </div>

        <div>
          <label for="marca" class="block text-sm font-medium">Marca*</label>
          <input v-model="equipo.marca" id="marca" type="text" class="input" required />
        </div>

        <div>
          <label for="modelo" class="block text-sm font-medium">Modelo*</label>
          <input v-model="equipo.modelo" id="modelo" type="text" class="input" required />
        </div>

        <div>
          <label for="procesador" class="block text-sm font-medium">Procesador*</label>
          <input v-model="equipo.procesador" id="procesador" type="text" class="input" required />
        </div>

        <div>
          <label for="ram" class="block text-sm font-medium">RAM*</label>
          <select v-model="equipo.ram" id="ram" class="input" required>
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
          <select v-model="equipo.almacenamiento" id="almacenamiento" class="input" required>
            <option value="">Seleccione almacenamiento</option>
            <option value="125GB">125GB</option>
            <option value="250GB">250GB</option>
            <option value="500GB">500GB</option>
            <option value="1TB">1TB</option>
            <option value="2TB">2TB</option>
          </select>
        </div>

        <div>
          <label for="oficina" class="block text-sm font-medium">Oficina*</label>
          <input v-model="equipo.oficina" id="oficina" type="text" class="input" required />
        </div>

        <div>
          <label for="ip" class="block text-sm font-medium">IP*</label>
          <input v-model="equipo.ip" id="ip" type="text" class="input" required />
          <p class="text-xs text-gray-500 mt-1">Formato: 192.168.1.1</p>
        </div>

        <div>
          <label for="mac" class="block text-sm font-medium">MAC Address*</label>
          <input v-model="equipo.mac" id="mac" type="text" class="input" required />
          <p class="text-xs text-gray-500 mt-1">Formato: 00:1A:2B:3C:4D:5E o 00-1A-2B-3C-4D-5E</p>
        </div>

        <div>
          <label for="codigoPatrimonial" class="block text-sm font-medium">Código Patrimonial</label>
          <input v-model="equipo.codigoPatrimonial" id="codigoPatrimonial" type="text" class="input" />
        </div>

        <div>
          <label for="so" class="block text-sm font-medium">Sistema Operativo</label>
          <select v-model="equipo.so" id="so" class="input">
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
          <input v-model="equipo.officeVersion" id="officeVersion" type="text" class="input" />
        </div>

        <div>
          <label for="antivirus" class="block text-sm font-medium">Antivirus</label>
          <input v-model="equipo.antivirus" id="antivirus" type="text" class="input" />
        </div>

        <!-- Cambié el label de "Estado" a "Estado del equipo" -->
        <div>
          <label for="estado" class="block text-sm font-medium">Estado del equipo*</label>
          <select v-model="equipo.estado" id="estado" class="input" required>
            <option value="">Seleccione estado</option>
            <option value="Bueno">Bueno</option>
            <option value="Regular">Regular</option>
            <option value="Malo">Malo</option>
          </select>
        </div>

        <div>
          <label for="marcaMonitor" class="block text-sm font-medium">Marca Monitor*</label>
          <input v-model="equipo.marcaMonitor" id="marcaMonitor" type="text" class="input" required />
        </div>

        <div>
          <label for="pulgadasMonitor" class="block text-sm font-medium">Pulgadas Monitor*</label>
          <input v-model="equipo.pulgadasMonitor" id="pulgadasMonitor" type="text" class="input" required />
        </div>

        <div>
          <label for="codigoPatrimonialMonitor" class="block text-sm font-medium">Código Patrimonial Monitor</label>
          <input v-model="equipo.codigoPatrimonialMonitor" id="codigoPatrimonialMonitor" type="text" class="input" />
        </div>

        <div class="flex items-center space-x-4">
          <div class="flex items-center">
            <input v-model="equipo.tieneTeclado" id="tieneTeclado" type="checkbox" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
            <label for="tieneTeclado" class="ml-2 block text-sm font-medium">Tiene Teclado</label>
          </div>

          <div class="flex items-center">
            <input v-model="equipo.tieneMouse" id="tieneMouse" type="checkbox" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
            <label for="tieneMouse" class="ml-2 block text-sm font-medium">Tiene Mouse</label>
          </div>
        </div>
      </div>

      <div class="flex gap-4 pt-4">
        <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition">
          Actualizar Equipo
        </button>
        <button @click="eliminarEquipo" type="button" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition">
          Eliminar Equipo
        </button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

interface Usuario {
  id: number;
  dni: string;
  nombres: string;
  apellidos: string;
  oficina: string;
  tipoContrato: string;
}

interface Equipo {
  id: number;
  tipo: string;
  marca: string;
  modelo: string;
  procesador: string;
  ram: string;
  almacenamiento: string;
  oficina: string;
  ip: string;
  mac: string;
  codigoPatrimonial: string;
  so: string;
  officeVersion: string;
  antivirus: string;
  estado: string;
  marcaMonitor: string;
  pulgadasMonitor: string;
  codigoPatrimonialMonitor: string;
  tieneTeclado: boolean;
  tieneMouse: boolean;
  usuarioId: number | null;
  usuario?: {
    id: number;
    dni: string;
    nombres: string;
    apellidos: string;
  };
}

export default defineComponent({
  name: 'EditarEquipo',
  setup() {
    const equipo = ref<Equipo>({
      id: 0,
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
      estado: 'activo',
      marcaMonitor: '',
      pulgadasMonitor: '',
      codigoPatrimonialMonitor: '',
      tieneTeclado: false,
      tieneMouse: false,
      usuarioId: null
    });

    const usuarioBusqueda = ref('');
    const usuariosEncontrados = ref<Usuario[]>([]);
    const mostrarListaUsuarios = ref(false);

    const route = useRoute();
    const router = useRouter();

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
      equipo.value.usuarioId = usuario.id;
      equipo.value.oficina = usuario.oficina; // Añadí esta línea para autocompletar la oficina
      usuarioBusqueda.value = `${usuario.nombres} ${usuario.apellidos} (${usuario.dni})`;
      mostrarListaUsuarios.value = false;
    };

const cargarEquipo = async () => {
  try {
    const response = await axios.get(`https://isiback.drtchco.gob.pe/api/equipos/${route.params.id}`);
    const equipoData = response.data.data;
    
    // Convertir 1/0 o true/false de la BD a booleanos para los checkboxes
    equipoData.tieneTeclado = Boolean(equipoData.tieneTeclado);
    equipoData.tieneMouse = Boolean(equipoData.tieneMouse);
    
    // Cargar datos del usuario si existe
    if (equipoData.usuario) {
      usuarioBusqueda.value = `${equipoData.usuario.nombres} ${equipoData.usuario.apellidos} (${equipoData.usuario.dni})`;
    }
    
    equipo.value = equipoData;
  } catch (error) {
    console.error('Error al cargar el equipo', error);
    alert('Error al cargar los datos del equipo');
  }
};

    const actualizarEquipo = async () => {
      try {
        // Preparar datos para enviar
        const datosEnvio = {
          ...equipo.value,
          tieneTeclado: equipo.value.tieneTeclado ? 1 : 0,
          tieneMouse: equipo.value.tieneMouse ? 1 : 0
        };

        await axios.put(`https://isiback.drtchco.gob.pe/api/equipos/${route.params.id}`, datosEnvio);
        alert('Equipo actualizado correctamente');
        router.push('/');
      } catch (error: any) {
        console.error('Error al actualizar el equipo', error);
        if (error.response && error.response.data.error) {
          alert(error.response.data.error);
        } else {
          alert('Hubo un error al actualizar el equipo');
        }
      }
    };

    const eliminarEquipo = async () => {
      const confirmacion = confirm('¿Estás seguro de que deseas eliminar este equipo?');
      if (!confirmacion) return;

      try {
        await axios.delete(`https://isiback.drtchco.gob.pe/api/equipos/${route.params.id}`);
        alert('Equipo eliminado correctamente');
        router.push('/');
      } catch (error) {
        console.error('Error al eliminar el equipo', error);
        alert('Hubo un error al eliminar el equipo');
      }
    };

    onMounted(() => {
      cargarEquipo();
    });

    return {
      equipo,
      usuarioBusqueda,
      usuariosEncontrados,
      mostrarListaUsuarios,
      buscarUsuarios,
      seleccionarUsuario,
      actualizarEquipo,
      eliminarEquipo,
    };
  },
});
</script>

<style scoped>
.input {
  @apply p-2 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500;
}
</style>