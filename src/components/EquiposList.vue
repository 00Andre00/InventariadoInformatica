<template>
  <div>
    <h1 class="text-xl font-bold">Lista de Equipos</h1>
    <ul class="mt-4">
      <li v-for="equipo in equipos" :key="equipo.id" class="mb-2">
        <div class="border p-2">
          <p><strong>Nombre:</strong> {{ equipo.nombre }}</p>
          <p><strong>Tipo:</strong> {{ equipo.tipo }}</p>
          <p><strong>IP:</strong> {{ equipo.ip }}</p>
          <p><strong>Piso:</strong> {{ equipo.piso }}</p>
          <p><strong>Oficina:</strong> {{ equipo.oficina }}</p>
          <button @click="eliminarEquipo(equipo.id)" class="bg-red-500 text-white px-2 py-1 rounded">
            Eliminar
          </button>
        </div>
      </li>
    </ul>

    <button @click="exportarEquipos" class="bg-green-500 text-white px-4 py-2 rounded mt-4">
      Exportar a Excel
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import axios from 'axios';
import ExcelJS from 'exceljs';

export default defineComponent({
  name: 'EquiposList',
  setup() {
    const equipos = ref<any[]>([]);

    // Función para cargar los equipos desde el backend
    const cargarEquipos = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/equipos');
        equipos.value = response.data;
      } catch (error) {
        console.error('Error al cargar los equipos', error);
      }
    };

    // Función para eliminar un equipo
    const eliminarEquipo = async (id: number) => {
      try {
        await axios.delete(`http://localhost:5000/api/equipo/${id}`);
        cargarEquipos(); // Recargar los equipos después de eliminar uno
      } catch (error) {
        console.error('Error al eliminar el equipo', error);
      }
    };

    // Función para exportar los equipos a Excel
    const exportarEquipos = async () => {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Equipos');

      worksheet.columns = [
        { header: 'Nombre', key: 'nombre', width: 30 },
        { header: 'Tipo', key: 'tipo', width: 20 },
        { header: 'IP', key: 'ip', width: 15 },
        { header: 'Piso', key: 'piso', width: 10 },
        { header: 'Oficina', key: 'oficina', width: 20 },
      ];

      equipos.value.forEach(equipo => {
        worksheet.addRow({
          nombre: equipo.nombre,
          tipo: equipo.tipo,
          ip: equipo.ip,
          piso: equipo.piso,
          oficina: equipo.oficina,
        });
      });

      // Descargar el archivo Excel
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'equipos.xlsx';
      link.click();
    };

    // Cargar los equipos cuando el componente esté montado
    onMounted(() => {
      cargarEquipos();
    });

    return {
      equipos,
      eliminarEquipo,
      exportarEquipos,
    };
  },
});
</script>

<style scoped>
/* Estilo para los botones */
button {
  background-color: #ef4444;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  margin-top: 8px;
  border-radius: 5px;
}

button:hover {
  background-color: #dc2626;
}

.bg-green-500 {
  background-color: #10b981;
}

.bg-green-500:hover {
  background-color: #059669;
}
</style>
