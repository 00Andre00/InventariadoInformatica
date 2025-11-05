<template>
  <div class="container mx-auto p-4">
    <!-- Encabezado mejorado -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <h1 class="text-2xl font-bold text-gray-800">Inventario de Equipos</h1>
      <div class="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
        <router-link to="/agregar" class="btn-primary">
          <i class="fas fa-plus mr-2"></i> Agregar Equipo
        </router-link>
        <button
          @click="exportarEquipos"
          class="btn-success"
          :disabled="equipos.length === 0"
        >
          <i class="fas fa-file-export mr-2"></i> Exportar Excel
        </button>
        <button
          @click="generarReporteGeneral"
          class="btn-warning"
          :disabled="equipos.length === 0"
        >
          <i class="fas fa-file-pdf mr-2"></i> Reporte General PDF
        </button>
        <!-- NUEVO BOTÓN PARA TRANSFERENCIA EN BLOQUE -->
        <button
          @click="abrirModalTransferencia"
          class="btn-info"
          :disabled="equipos.length === 0"
        >
          <i class="fas fa-exchange-alt mr-2"></i> Transferencia en Bloque
        </button>
      </div>
    </div>

    <!-- Mensajes de estado -->
    <div v-if="loading" class="text-center py-8 bg-gray-50 rounded-lg">
      <i class="fas fa-circle-notch fa-spin text-blue-500 text-2xl mb-2"></i>
      <p class="text-gray-600">Cargando equipos...</p>
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
        @click="cargarEquipos"
        class="mt-2 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
      >
        <i class="fas fa-sync-alt mr-1"></i> Reintentar
      </button>
    </div>

    <div
      v-else-if="equipos.length === 0"
      class="text-center py-8 bg-gray-50 rounded-lg"
    >
      <i class="fas fa-box-open text-gray-400 text-2xl mb-2"></i>
      <p class="text-gray-600 mb-4">No hay equipos registrados</p>
      <router-link to="/agregar" class="btn-primary inline-flex items-center">
        <i class="fas fa-plus mr-2"></i> Agregar Primer Equipo
      </router-link>
    </div>

    <!-- Tabla de equipos -->
    <div v-else class="bg-white rounded-lg shadow overflow-hidden">
      <!-- Barra de búsqueda -->
      <div class="p-4 border-b bg-gray-50">
        <div class="relative max-w-md">
          <input
            type="text"
            v-model="busqueda"
            placeholder="Buscar equipos..."
            class="input-search"
          />
          <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
        </div>
      </div>

      <!-- Tabla responsive -->
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
                Tipo
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Marca/Modelo
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Procesador
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                RAM/Almacenamiento
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                IP/MAC
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Oficina/Usuario
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Monitor
              </th>
              <th
                class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="equiposPaginados.length === 0">
              <td colspan="9" class="px-6 py-8 text-center text-gray-500">
                <i class="fas fa-search-minus text-gray-300 text-2xl mb-2"></i>
                <p>No se encontraron equipos con los filtros actuales</p>
              </td>
            </tr>
            <tr
              v-for="equipo in equiposPaginados"
              :key="equipo.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
              >
                #{{ equipo.id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <span
                  class="px-2 py-1 rounded-full text-xs font-medium"
                  :class="getBadgeClass(equipo.tipo)"
                >
                  {{ equipo.tipo }}
                </span>
                <div
                  class="text-xs mt-1"
                  :class="getEstadoClass(equipo.estado)"
                >
                  {{ equipo.estado }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <div class="font-medium">{{ equipo.marca }}</div>
                <div class="text-gray-500">{{ equipo.modelo }}</div>
                <div
                  v-if="equipo.codigoPatrimonial"
                  class="text-xs text-gray-400"
                >
                  Pat: {{ equipo.codigoPatrimonial }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ equipo.procesador || "-" }}
                <div v-if="equipo.so" class="text-xs text-gray-400">
                  SO: {{ equipo.so }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <div>{{ equipo.ram }}</div>
                <div class="text-gray-500">{{ equipo.almacenamiento }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <div class="font-mono">{{ equipo.ip || "-" }}</div>
                <div class="text-xs font-mono text-gray-500">
                  {{ equipo.mac || "-" }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <div class="flex flex-col">
                  <span>{{ equipo.oficina }}</span>
                  <span v-if="equipo.usuario" class="text-xs text-gray-500">
                    {{ equipo.usuario.nombres }} {{ equipo.usuario.apellidos }}
                  </span>
                  <span v-else class="text-xs text-gray-500">Sin usuario</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <div v-if="equipo.marcaMonitor">
                  {{ equipo.marcaMonitor }} ({{ equipo.pulgadasMonitor }}")
                  <div
                    v-if="equipo.codigoPatrimonialMonitor"
                    class="text-xs text-gray-400"
                  >
                    Pat: {{ equipo.codigoPatrimonialMonitor }}
                  </div>
                </div>
                <div v-else class="text-gray-400">-</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-center">
                <div class="flex justify-center space-x-2">
                  <button
                    @click="editarEquipo(equipo)"
                    class="btn-action bg-blue-600 text-white hover:bg-blue-700"
                    title="Editar"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button
                    @click="confirmarEliminacion(equipo)"
                    class="btn-action bg-red-600 text-white hover:bg-red-700"
                    title="Eliminar"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                  <button
                    v-if="
                      equipo.mantenimientos && equipo.mantenimientos.length > 0
                    "
                    @click="verMantenimientos(equipo)"
                    class="btn-action bg-gray-600 text-white hover:bg-gray-700"
                    title="Ver mantenimientos"
                  >
                    <i class="fas fa-tools"></i>
                  </button>

                  <button
                    v-if="isAdmin"
                    @click="enviarARevision(equipo)"
                    class="btn-action bg-yellow-600 text-white hover:bg-yellow-700"
                    title="Enviar a Revisión"
                  >
                    <i class="fas fa-tools"></i>
                  </button>

                  <button
                    @click="generarReporte(equipo)"
                    class="btn-action bg-gray-600 text-white hover:bg-gray-700"
                    title="Generar Reporte"
                  >
                    <i class="fas fa-file-pdf"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Paginación -->
      <div
        class="px-4 py-3 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-3"
      >
        <div class="text-sm text-gray-500">
          Mostrando {{ (paginaActual - 1) * itemsPorPagina + 1 }} -
          {{ Math.min(paginaActual * itemsPorPagina, equiposFiltrados.length) }}
          de {{ equiposFiltrados.length }} equipos
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

    <!-- Modal de confirmación de eliminación -->
    <div
      v-if="equipoAEliminar"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <div class="flex items-center mb-4">
          <i class="fas fa-exclamation-triangle text-yellow-500 mr-2"></i>
          <h3 class="text-lg font-semibold">Confirmar Eliminación</h3>
        </div>

        <p class="text-gray-600 mb-4">
          ¿Estás seguro de eliminar el equipo
          <strong class="text-gray-800"
            >{{ equipoAEliminar.marca }} {{ equipoAEliminar.modelo }}</strong
          >?
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
            @click="eliminarEquipo"
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

    <!-- Modal de mantenimientos -->
    <div
      v-if="equipoSeleccionado"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div
        class="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
      >
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold">
            <i class="fas fa-tools mr-2 text-blue-500"></i>
            Mantenimientos para {{ equipoSeleccionado.marca }}
            {{ equipoSeleccionado.modelo }}
          </h3>
          <button
            @click="equipoSeleccionado = null"
            class="text-gray-500 hover:text-gray-700"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div v-if="cargandoMantenimientos" class="text-center py-4">
          <i class="fas fa-circle-notch fa-spin text-blue-500 text-xl"></i>
          <p class="text-gray-600 mt-2">Cargando mantenimientos...</p>
        </div>

        <div v-else>
          <div
            v-if="equipoSeleccionado?.mantenimientos?.length === 0"
            class="text-center py-4 text-gray-500"
          >
            <i class="fas fa-tools text-2xl mb-2"></i>
            <p>No hay mantenimientos registrados para este equipo</p>
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="(
                mantenimiento, index
              ) in equipoSeleccionado.mantenimientos"
              :key="index"
              class="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div class="flex justify-between items-start">
                <div>
                  <h4 class="font-medium">{{ mantenimiento.descripcion }}</h4>
                  <p class="text-sm text-gray-500 mt-1">
                    <i class="far fa-calendar-alt mr-1"></i>
                    {{ formatFecha(mantenimiento.fecha) }}
                  </p>
                </div>
                <span
                  class="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800"
                >
                  Mantenimiento #{{ index + 1 }}
                </span>
              </div>
            </div>
          </div>

          <div class="mt-6 pt-4 border-t">
            <router-link
              :to="`/agregar-mantenimiento/${equipoSeleccionado.id}`"
              class="btn-primary inline-flex items-center"
            >
              <i class="fas fa-plus mr-2"></i> Agregar Mantenimiento
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Transferencia en Bloque -->
    <div
      v-if="mostrarModalTransferencia"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-semibold">
            <i class="fas fa-exchange-alt mr-2 text-blue-500"></i>
            Transferencia Masiva de Equipos
          </h3>
          <button
            @click="cerrarModalTransferencia"
            class="text-gray-500 hover:text-gray-700"
          >
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>

        <!-- Usuario Origen -->
        <div class="mb-6 p-4 border rounded-lg bg-gray-50">
          <h4 class="text-lg font-medium mb-3 text-gray-700">
            <i class="fas fa-user mr-2 text-blue-500"></i>
            Usuario Actual (Origen)
          </h4>
          <div class="relative">
           <input
  v-model="usuarioOrigenBusqueda"
  @input="buscarUsuariosOrigen"
  @focus="mostrarListaUsuariosOrigen = true"
  type="text"
  class="input-search"
  placeholder="Buscar por nombre, apellido o DNI..."
/>
            <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
       <ul
  v-if="mostrarListaUsuariosOrigen && usuariosEncontradosOrigen.length"
  class="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
>
  <li
    v-for="usuario in usuariosEncontradosOrigen"
    :key="'origen-' + usuario.id"
    @click="seleccionarUsuarioOrigen(usuario)"
    class="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b last:border-b-0 transition-colors"
  >
    <div class="flex justify-between items-start">
      <div class="flex-1">
        <div class="font-medium text-gray-900">
          {{ usuario.nombres }} {{ usuario.apellidos }}
        </div>
        <div class="text-sm text-gray-600 mt-1">
          <span class="inline-block bg-gray-100 px-2 py-1 rounded text-xs mr-2">
            DNI: {{ usuario.dni }}
          </span>
          <span class="inline-block bg-blue-100 px-2 py-1 rounded text-xs">
            {{ usuario.oficina }}
          </span>
        </div>
        <div class="text-xs text-gray-500 mt-1">
          Contrato: {{ usuario.tipoContrato }}
        </div>
      </div>
      <i class="fas fa-chevron-right text-gray-400 mt-1 text-sm"></i>
    </div>
  </li>
</ul>
          </div>

     <!-- PONE esto: -->
<div v-if="usuarioOrigenSeleccionado" class="mt-4">
  <h5 class="font-medium text-gray-700 mb-2">
    Equipos asignados a {{ usuarioOrigenSeleccionado.nombres }} {{ usuarioOrigenSeleccionado.apellidos }}:
  </h5>
  <div v-if="equiposOrigenCargando" class="text-center py-4">
    <i class="fas fa-circle-notch fa-spin text-blue-500 mr-2"></i>
    Cargando equipos...
  </div>
  <div v-else-if="equiposUsuarioOrigen.length === 0" class="text-center py-4 text-gray-500">
    <i class="fas fa-box-open text-gray-300 text-2xl mb-2"></i>
    <p>Este usuario no tiene equipos asignados</p>
  </div>
  <div v-else class="max-h-60 overflow-y-auto border rounded">
    <!-- CABECERA DE SELECCIÓN -->
    <div class="p-3 border-b bg-gray-50 flex items-center justify-between">
      <div class="flex items-center">
        <input
          type="checkbox"
          v-model="seleccionarTodos"
          @change="toggleSeleccionarTodos"
          class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          id="seleccionarTodos"
        />
        <label for="seleccionarTodos" class="ml-2 text-sm font-medium text-gray-700">
          Seleccionar todos
        </label>
      </div>
      <span class="text-sm text-gray-600">
        {{ equiposSeleccionadosCount }} de {{ equiposUsuarioOrigen.length }} seleccionados
      </span>
    </div>

    <!-- LISTA DE EQUIPOS CON CHECKBOX -->
    <div
      v-for="equipo in equiposUsuarioOrigen"
      :key="'origen-equipo-' + equipo.id"
      class="p-3 border-b hover:bg-blue-50 transition-colors"
      :class="{ 'bg-blue-50': estaSeleccionado(equipo.id) }"
    >
      <div class="flex items-start space-x-3">
        <input
          type="checkbox"
          :value="equipo.id"
          v-model="equiposSeleccionados"
          class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
        />
        <div class="flex-1">
          <div class="flex justify-between items-start">
            <div>
              <span class="font-medium">{{ equipo.marca }} {{ equipo.modelo }}</span>
              <div class="text-sm text-gray-500">
                {{ equipo.tipo }} • {{ equipo.codigoPatrimonial || 'Sin código patrimonial' }}
              </div>
              <div class="text-xs text-gray-400">
                IP: {{ equipo.ip }} • Oficina: {{ equipo.oficina }}
              </div>
            </div>
            <i 
              v-if="estaSeleccionado(equipo.id)" 
              class="fas fa-check text-green-500 mt-1"
            ></i>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="mt-2 text-sm text-gray-600 flex justify-between">
    <span>Total: {{ equiposUsuarioOrigen.length }} equipo(s)</span>
    <span class="font-medium text-blue-600">
      {{ equiposSeleccionadosCount }} seleccionado(s)
    </span>
  </div>
</div>
        </div>

        <!-- Usuario Destino -->
        <div class="mb-6 p-4 border rounded-lg bg-green-50">
          <h4 class="text-lg font-medium mb-3 text-gray-700">
            <i class="fas fa-user-plus mr-2 text-green-500"></i>
            Usuario Nuevo (Destino)
          </h4>
          <div class="relative">
          <input
  v-model="usuarioDestinoBusqueda"
  @input="buscarUsuariosDestino"
  @focus="mostrarListaUsuariosDestino = true"
  type="text"
  class="input-search"
  placeholder="Buscar por nombre, apellido o DNI..."
/>
            <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
            
         <ul
  v-if="mostrarListaUsuariosDestino && usuariosEncontradosDestino.length"
  class="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
>
  <li
    v-for="usuario in usuariosEncontradosDestino"
    :key="'destino-' + usuario.id"
    @click="seleccionarUsuarioDestino(usuario)"
    class="px-4 py-3 hover:bg-green-50 cursor-pointer border-b last:border-b-0 transition-colors"
  >
    <div class="flex justify-between items-start">
      <div class="flex-1">
        <div class="font-medium text-gray-900">
          {{ usuario.nombres }} {{ usuario.apellidos }}
        </div>
        <div class="text-sm text-gray-600 mt-1">
          <span class="inline-block bg-gray-100 px-2 py-1 rounded text-xs mr-2">
            DNI: {{ usuario.dni }}
          </span>
          <span class="inline-block bg-green-100 px-2 py-1 rounded text-xs">
            {{ usuario.oficina }}
          </span>
        </div>
        <div class="text-xs text-gray-500 mt-1">
          Contrato: {{ usuario.tipoContrato }}
        </div>
      </div>
      <i class="fas fa-chevron-right text-gray-400 mt-1 text-sm"></i>
    </div>
  </li>
</ul>
          </div>

          <div v-if="usuarioDestinoSeleccionado" class="mt-3 p-3 bg-green-100 rounded">
            <div class="flex items-center">
              <i class="fas fa-check-circle text-green-500 mr-2"></i>
              <span class="font-medium">{{ usuarioDestinoSeleccionado.nombres }} {{ usuarioDestinoSeleccionado.apellidos }}</span>
            </div>
            <div class="text-sm text-gray-600 mt-1">
              DNI: {{ usuarioDestinoSeleccionado.dni }} • Oficina: {{ usuarioDestinoSeleccionado.oficina }}
            </div>
          </div>
        </div>

        <!-- Resumen de Transferencia -->
  <div v-if="usuarioOrigenSeleccionado && usuarioDestinoSeleccionado" class="mb-6 p-4 border rounded-lg bg-yellow-50">
  <h4 class="text-lg font-medium mb-3 text-gray-700">
    <i class="fas fa-sync-alt mr-2 text-yellow-500"></i>
    Resumen de Transferencia
  </h4>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
    <div>
      <strong>Desde:</strong> {{ usuarioOrigenSeleccionado.nombres }} {{ usuarioOrigenSeleccionado.apellidos }}
    </div>
    <div>
      <strong>Hacia:</strong> {{ usuarioDestinoSeleccionado.nombres }} {{ usuarioDestinoSeleccionado.apellidos }}
    </div>
    <!-- ✅ CAMBIA equiposUsuarioOrigen.length por equiposSeleccionadosCount -->
    <div>
      <strong>Equipos a transferir:</strong> {{ equiposSeleccionadosCount }}
    </div>
    <div>
      <strong>Nueva oficina:</strong> {{ usuarioDestinoSeleccionado.oficina }}
    </div>
  </div>
</div>

        <!-- Botones de acción -->
        <div class="flex gap-3 justify-end pt-4 border-t">
          <button
            @click="cerrarModalTransferencia"
            class="btn-cancel"
          >
            Cancelar
          </button>
     <button
  @click="confirmarTransferencia"
  :disabled="!puedeTransferir || transferenciaEnProgreso"
  class="btn-confirm-bulk"
>
  <span v-if="transferenciaEnProgreso">
    <i class="fas fa-circle-notch fa-spin mr-2"></i> Transferiendo...
  </span>
  <span v-else>
    <!-- ✅ CAMBIA equiposUsuarioOrigen.length por equiposSeleccionadosCount -->
    <i class="fas fa-exchange-alt mr-2"></i> Transferir {{ equiposSeleccionadosCount }} Equipo(s)
  </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { ElLoading, ElMessage } from "element-plus";
import ExcelJS from "exceljs";
import { useAuth } from "@/composables/useAuth";

import "../interceptors/axios";

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
  estadoMonitor: string;
  tieneTeclado: boolean;
  tieneMouse: boolean;
  usuarioId: number | null;
  usuario?: Usuario;
  mantenimientos?: Mantenimiento[];
}

interface Mantenimiento {
  id: number;
  descripcion: string;
  fecha: string;
}

export default defineComponent({
  name: "EquiposList",
  setup() {
    const router = useRouter();
    const equipos = ref<Equipo[]>([]);
    const busqueda = ref("");
    const paginaActual = ref(1);
    const itemsPorPagina = 10;
    // Agrega estas variables en el setup()
const buscandoUsuariosOrigen = ref(false);
const buscandoUsuariosDestino = ref(false);
    const loading = ref(true);
    const error = ref("");
    const equipoAEliminar = ref<Equipo | null>(null);
    const eliminando = ref(false);
    const equipoSeleccionado = ref<Equipo | null>(null);
    const cargandoMantenimientos = ref(false);

    // Variables para transferencia en bloque
    const mostrarModalTransferencia = ref(false);
    const usuarioOrigenBusqueda = ref("");
    const usuarioDestinoBusqueda = ref("");
    const usuariosEncontradosOrigen = ref<Usuario[]>([]);
    const usuariosEncontradosDestino = ref<Usuario[]>([]);
    const mostrarListaUsuariosOrigen = ref(false);
    const mostrarListaUsuariosDestino = ref(false);
    const usuarioOrigenSeleccionado = ref<Usuario | null>(null);
    const usuarioDestinoSeleccionado = ref<Usuario | null>(null);
    const equiposUsuarioOrigen = ref<Equipo[]>([]);
    const equiposOrigenCargando = ref(false);
    const transferenciaEnProgreso = ref(false);
    const equiposSeleccionados = ref<number[]>([]);
const seleccionarTodos = ref(false);

    const { isAdmin, isInformatica } = useAuth();

    const cargarEquipos = async () => {
      loading.value = true;
      error.value = "";

      try {
        const response = await axios.get("/equipos");
        equipos.value = response.data.data
          .filter((equipo: any) => {
            return equipo.estado_especial === "asignado";
          })
          .map((equipo: any) => ({
            ...equipo,
            tieneTeclado: Boolean(equipo.tieneTeclado),
            tieneMouse: Boolean(equipo.tieneMouse),
            estadoMonitor: equipo.estadoMonitor || "",
          }));

        console.log("📋 Equipos asignados cargados:", equipos.value.length);
      } catch (err: any) {
        console.error("Error al cargar equipos:", err);
        error.value =
          "No se pudieron cargar los equipos. " +
          (err.response?.data?.message || err.message || "Error desconocido");
      } finally {
        loading.value = false;
      }
    };

    // Computed properties
    const equiposFiltrados = computed(() => {
      if (!busqueda.value.trim()) return equipos.value;
      const termino = busqueda.value.toLowerCase().trim();
      return equipos.value.filter(
        (equipo) =>
          equipo.marca?.toLowerCase().includes(termino) ||
          equipo.modelo?.toLowerCase().includes(termino) ||
          equipo.tipo?.toLowerCase().includes(termino) ||
          equipo.ip?.toLowerCase().includes(termino) ||
          equipo.mac?.toLowerCase().includes(termino) ||
          equipo.oficina?.toLowerCase().includes(termino) ||
          equipo.codigoPatrimonial?.toLowerCase().includes(termino) ||
          (equipo.usuario?.nombres + " " + equipo.usuario?.apellidos)
            ?.toLowerCase()
            .includes(termino)
      );
    });

    const equiposPaginados = computed(() => {
      const inicio = (paginaActual.value - 1) * itemsPorPagina;
      const fin = inicio + itemsPorPagina;
      return equiposFiltrados.value.slice(inicio, fin);
    });

    const totalPaginas = computed(() =>
      Math.ceil(equiposFiltrados.value.length / itemsPorPagina)
    );

    // Computed para validar transferencia
const puedeTransferir = computed(() => {
  return (
    usuarioOrigenSeleccionado.value &&
    usuarioDestinoSeleccionado.value &&
    usuarioOrigenSeleccionado.value.id !== usuarioDestinoSeleccionado.value.id &&
    equiposSeleccionadosCount.value > 0  // ✅ Ahora valida que haya seleccionados
  );
});

    // Métodos para transferencia en bloque
    const abrirModalTransferencia = () => {
      mostrarModalTransferencia.value = true;
      usuarioOrigenSeleccionado.value = null;
      usuarioDestinoSeleccionado.value = null;
      equiposUsuarioOrigen.value = [];
      usuarioOrigenBusqueda.value = "";
      usuarioDestinoBusqueda.value = "";
    };

  const cerrarModalTransferencia = () => {
  mostrarModalTransferencia.value = false;
  usuarioOrigenSeleccionado.value = null;
  usuarioDestinoSeleccionado.value = null;
  equiposUsuarioOrigen.value = [];
  equiposSeleccionados.value = []; // ✅ Limpiar selección
  seleccionarTodos.value = false;  // ✅ Limpiar "seleccionar todos"
  usuarioOrigenBusqueda.value = "";
  usuarioDestinoBusqueda.value = "";
};


    const toggleSeleccionarTodos = () => {
  if (seleccionarTodos.value) {
    equiposSeleccionados.value = equiposUsuarioOrigen.value.map(equipo => equipo.id);
  } else {
    equiposSeleccionados.value = [];
  }
};

const estaSeleccionado = (equipoId: number) => {
  return equiposSeleccionados.value.includes(equipoId);
};
const buscarUsuariosOrigen = async () => {
  const searchTerm = usuarioOrigenBusqueda.value.trim();
  
  // Mostrar lista si hay texto
  if (searchTerm.length > 0) {
    mostrarListaUsuariosOrigen.value = true;
  } else {
    mostrarListaUsuariosOrigen.value = false;
    usuariosEncontradosOrigen.value = [];
    return;
  }
  
  // Buscar si hay al menos 2 caracteres
  if (searchTerm.length >= 2) {
    buscandoUsuariosOrigen.value = true;
    try {
      // Enviar el término de búsqueda como parámetro único
      const response = await axios.get('/buscar-usuarios', {
        params: { search: searchTerm }
      });
      usuariosEncontradosOrigen.value = response.data.data || [];
    } catch (error) {
      console.error("Error al buscar usuarios origen:", error);
      usuariosEncontradosOrigen.value = [];
    } finally {
      buscandoUsuariosOrigen.value = false;
    }
  } else {
    usuariosEncontradosOrigen.value = [];
  }
};

const buscarUsuariosDestino = async () => {
  // MOSTRAR la lista cuando se empiece a escribir
  mostrarListaUsuariosDestino.value = true;
  
  if (usuarioDestinoBusqueda.value.length > 2) {
    buscandoUsuariosDestino.value = true;
    try {
      const searchTerm = usuarioDestinoBusqueda.value;
      const params = new URLSearchParams({
        nombres: searchTerm,
        apellidos: searchTerm,
        dni: searchTerm
      });
      
      const response = await axios.get(`/buscar-usuarios?${params}`);
      usuariosEncontradosDestino.value = response.data.data;
    } catch (error) {
      console.error("Error al buscar usuarios destino:", error);
      usuariosEncontradosDestino.value = [];
    } finally {
      buscandoUsuariosDestino.value = false;
    }
  } else {
    usuariosEncontradosDestino.value = [];
    buscandoUsuariosDestino.value = false;
  }
};

    const seleccionarUsuarioOrigen = async (usuario: Usuario) => {
      usuarioOrigenSeleccionado.value = usuario;
      usuarioOrigenBusqueda.value = `${usuario.nombres} ${usuario.apellidos} (${usuario.dni})`;
      mostrarListaUsuariosOrigen.value = false;
      
      await cargarEquiposUsuarioOrigen(usuario.id);
    };

    const seleccionarUsuarioDestino = (usuario: Usuario) => {
      usuarioDestinoSeleccionado.value = usuario;
      usuarioDestinoBusqueda.value = `${usuario.nombres} ${usuario.apellidos} (${usuario.dni})`;
      mostrarListaUsuariosDestino.value = false;
    };

const cargarEquiposUsuarioOrigen = async (usuarioId: number) => {
  equiposOrigenCargando.value = true;
  equiposSeleccionados.value = []; // ✅ Resetear selección
  seleccionarTodos.value = false;  // ✅ Resetear "seleccionar todos"
  try {
    const response = await axios.get(`/equipos/usuario/${usuarioId}`);
    equiposUsuarioOrigen.value = response.data.data || [];
  } catch (error) {
    console.error("Error al cargar equipos del usuario:", error);
    equiposUsuarioOrigen.value = [];
    ElMessage.error("Error al cargar equipos del usuario");
  } finally {
    equiposOrigenCargando.value = false;
  }
};

 const confirmarTransferencia = async () => {
  if (!puedeTransferir.value) return;

  const confirmacion = confirm(
    // ✅ CAMBIA equiposUsuarioOrigen.length por equiposSeleccionadosCount
    `¿Estás seguro de transferir ${equiposSeleccionadosCount.value} equipo(s) de ${usuarioOrigenSeleccionado.value?.nombres} a ${usuarioDestinoSeleccionado.value?.nombres}?`
  );

  if (!confirmacion) return;

  await ejecutarTransferencia();
};



const ejecutarTransferencia = async () => {
  transferenciaEnProgreso.value = true;
  let loadingInstance: any = null;

  try {
    loadingInstance = ElLoading.service({
      lock: true,
      text: `Transferiendo ${equiposSeleccionadosCount.value} equipo(s)...`, // ✅ Usar contador de seleccionados
      background: "rgba(0, 0, 0, 0.7)",
    });

    // ✅ CAMBIA esta línea - usar equipos seleccionados en lugar de todos
    await axios.post("/equipos/transferencia-bloque", {
      usuarioOrigenId: usuarioOrigenSeleccionado.value?.id,
      usuarioDestinoId: usuarioDestinoSeleccionado.value?.id,
      equipoIds: equiposSeleccionados.value  // ✅ Solo los seleccionados
    });

    if (loadingInstance) {
      loadingInstance.close();
    }

    ElMessage.success(
      `Transferencia completada: ${equiposSeleccionadosCount.value} equipo(s) transferidos exitosamente` // ✅ Usar contador de seleccionados
    );

    await cargarEquipos();
    cerrarModalTransferencia();

  } catch (error: any) {
    console.error("Error en transferencia en bloque:", error);
    
    if (loadingInstance) {
      loadingInstance.close();
    }

    ElMessage.error(
      error.response?.data?.error || "Error al realizar la transferencia en bloque"
    );
  } finally {
    transferenciaEnProgreso.value = false;
  }
};

    // Métodos existentes
    const cambiarPagina = (pagina: number) => {
      if (pagina >= 1 && pagina <= totalPaginas.value) {
        paginaActual.value = pagina;
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };
const equiposSeleccionadosCount = computed(() => equiposSeleccionados.value.length);

    const getBadgeClass = (tipo: string) => {
      const tipos: Record<string, string> = {
        Computadora: "bg-blue-100 text-blue-800",
        Laptop: "bg-purple-100 text-purple-800",
        Servidor: "bg-red-100 text-red-800",
        Otro: "bg-gray-100 text-gray-800",
      };
      return tipos[tipo] || "bg-gray-100 text-gray-800";
    };

    const getEstadoClass = (estado: string) => {
      const estados: Record<string, string> = {
        activo: "text-green-600",
        inactivo: "text-gray-600",
        mantenimiento: "text-yellow-600",
        baja: "text-red-600",
      };
      return estados[estado] || "text-gray-600";
    };

    const formatFecha = (fecha: string) => {
      return new Date(fecha).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    };

    const editarEquipo = (equipo: Equipo) => {
      router.push(`/editar/${equipo.id}`);
    };

    const cargarMantenimientos = async (equipoId: number) => {
      cargandoMantenimientos.value = true;
      try {
        const response = await axios.get(`/equipos/${equipoId}/mantenimientos`);
        return response.data.data;
      } catch (err) {
        console.error("Error al cargar mantenimientos:", err);
        return [];
      } finally {
        cargandoMantenimientos.value = false;
      }
    };

    const verMantenimientos = async (equipo: Equipo) => {
      equipoSeleccionado.value = { ...equipo };
      if (!equipoSeleccionado.value.mantenimientos) {
        equipoSeleccionado.value.mantenimientos = await cargarMantenimientos(
          equipo.id
        );
      }
    };

    const confirmarEliminacion = (equipo: Equipo) => {
      equipoAEliminar.value = equipo;
    };

    const cancelarEliminacion = () => {
      equipoAEliminar.value = null;
    };

    const eliminarEquipo = async () => {
      if (!equipoAEliminar.value) return;

      eliminando.value = true;

      try {
        await axios.delete(`/equipos/${equipoAEliminar.value.id}`);
        equipos.value = equipos.value.filter(
          (e) => e.id !== equipoAEliminar.value!.id
        );
        equipoAEliminar.value = null;
      } catch (err: any) {
        console.error("Error al eliminar equipo:", err);
        error.value =
          "Error al eliminar el equipo: " +
          (err.response?.data?.message || err.message || "Error desconocido");
      } finally {
        eliminando.value = false;
      }
    };

    const exportarEquipos = async () => {
      if (equipos.value.length === 0) {
        alert("No hay equipos para exportar");
        return;
      }

      try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Equipos");

        worksheet.columns = [
          { header: "ID", key: "id", width: 10 },
          { header: "Tipo", key: "tipo", width: 15 },
          { header: "Marca", key: "marca", width: 20 },
          { header: "Modelo", key: "modelo", width: 20 },
          { header: "Procesador", key: "procesador", width: 25 },
          { header: "RAM", key: "ram", width: 15 },
          { header: "Almacenamiento", key: "almacenamiento", width: 20 },
          { header: "Oficina", key: "oficina", width: 20 },
          { header: "IP", key: "ip", width: 15 },
          { header: "MAC", key: "mac", width: 20 },
          { header: "Código Patrimonial", key: "codigoPatrimonial", width: 20 },
          { header: "Sistema Operativo", key: "so", width: 20 },
          { header: "Versión Office", key: "officeVersion", width: 20 },
          { header: "Antivirus", key: "antivirus", width: 20 },
          { header: "Estado Equipo", key: "estado", width: 15 },
          { header: "Marca Monitor", key: "marcaMonitor", width: 20 },
          { header: "Pulgadas Monitor", key: "pulgadasMonitor", width: 15 },
          {
            header: "Código Monitor",
            key: "codigoPatrimonialMonitor",
            width: 20,
          },
          { header: "Estado Monitor", key: "estadoMonitor", width: 15 },
          { header: "Tiene Teclado", key: "tieneTeclado", width: 15 },
          { header: "Tiene Mouse", key: "tieneMouse", width: 15 },
          { header: "Usuario", key: "usuario", width: 30 },
          { header: "DNI Usuario", key: "dniUsuario", width: 15 },
        ];

        worksheet.getRow(1).eachCell((cell) => {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FF3B82F6" },
          };
          cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
          cell.border = {
            top: { style: "thin", color: { argb: "FF1E40AF" } },
            bottom: { style: "thin", color: { argb: "FF1E40AF" } },
            left: { style: "thin", color: { argb: "FF1E40AF" } },
            right: { style: "thin", color: { argb: "FF1E40AF" } },
          };
        });

        equipos.value.forEach((equipo, index) => {
          const row = worksheet.addRow({
            id: equipo.id,
            tipo: equipo.tipo,
            marca: equipo.marca,
            modelo: equipo.modelo,
            procesador: equipo.procesador,
            ram: equipo.ram,
            almacenamiento: equipo.almacenamiento,
            oficina: equipo.oficina,
            ip: equipo.ip,
            mac: equipo.mac,
            codigoPatrimonial: equipo.codigoPatrimonial || "-",
            so: equipo.so || "-",
            officeVersion: equipo.officeVersion || "-",
            antivirus: equipo.antivirus || "-",
            estado: equipo.estado || "-",
            marcaMonitor: equipo.marcaMonitor || "-",
            pulgadasMonitor: equipo.pulgadasMonitor || "-",
            codigoPatrimonialMonitor: equipo.codigoPatrimonialMonitor || "-",
            estadoMonitor: equipo.estadoMonitor || "-",
            tieneTeclado: equipo.tieneTeclado ? "Sí" : "No",
            tieneMouse: equipo.tieneMouse ? "Sí" : "No",
            usuario: equipo.usuario
              ? `${equipo.usuario.nombres} ${equipo.usuario.apellidos}`
              : "Sin asignar",
            dniUsuario: equipo.usuario?.dni || "-",
          });

          row.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: index % 2 === 0 ? "FFF3F4F6" : "FFFFFFFF" },
          };
        });

        worksheet.columns.forEach((column) => {
          if (column.values) {
            let maxLength = 0;
            column.values.forEach((value: any) => {
              if (value !== null && value !== undefined) {
                const length = String(value).length;
                if (length > maxLength) {
                  maxLength = length;
                }
              }
            });
            column.width = Math.min(Math.max(maxLength + 2, 10), 30);
          }
        });

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `equipos_${
          new Date().toISOString().split("T")[0]
        }.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
      } catch (err) {
        console.error("Error al exportar equipos:", err);
        error.value = "Error al exportar equipos a Excel";
      }
    };

    const enviarARevision = async (equipo: Equipo) => {
      if (
        !confirm(
          `¿Enviar el equipo ${equipo.marca} ${equipo.modelo} a revisión?`
        )
      )
        return;

      try {
        await axios.post(`/sistema/equipos/${equipo.id}/revision`);
        alert("Equipo enviado a revisión correctamente");
        cargarEquipos();
      } catch (error) {
        console.error("Error al enviar equipo a revisión:", error);
        alert("Error al enviar equipo a revisión");
      }
    };

    const generarReporteGeneral = async () => {
      let loadingInstance: any = null;
      
      try {
        loadingInstance = ElLoading.service({
          lock: true,
          text: "Generando reporte general de equipos...",
          background: "rgba(0, 0, 0, 0.7)",
        });

        const response = await axios.get(
          `/sistema/reportes/general-equipos`,
          {
            responseType: "blob",
          }
        );

        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `reporte-general-equipos-${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        if (loadingInstance) {
          loadingInstance.close();
        }
        ElMessage.success("Reporte general generado exitosamente");
      } catch (error: any) {
        console.error("Error al generar reporte general:", error);
        
        if (loadingInstance) {
          loadingInstance.close();
        }
        ElMessage.error("Error al generar el reporte general PDF");
      }
    };

    const generarReporte = async (equipo: Equipo) => {
      let loadingInstance: any = null;
      
      try {
        loadingInstance = ElLoading.service({
          lock: true,
          text: "Generando reporte PDF...",
          background: "rgba(0, 0, 0, 0.7)",
        });

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
        link.download = `reporte-equipo-${equipo.codigoPatrimonial || equipo.id}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        if (loadingInstance) {
          loadingInstance.close();
        }
        ElMessage.success("Reporte generado exitosamente");
      } catch (error: any) {
        console.error("Error al generar reporte:", error);
        
        if (loadingInstance) {
          loadingInstance.close();
        }
        ElMessage.error("Error al generar el reporte PDF");
      }
    };

    onMounted(cargarEquipos);

    return {
      equipos,
      busqueda,
      paginaActual,
      itemsPorPagina,
      loading,
      error,
      equipoAEliminar,
      eliminando,
      equipoSeleccionado,
      cargandoMantenimientos,
      equiposFiltrados,
      equiposPaginados,
      isInformatica,
      isAdmin,
      // Transferencia en bloque
      mostrarModalTransferencia,
      usuarioOrigenBusqueda,
      usuarioDestinoBusqueda,
      usuariosEncontradosOrigen,
      usuariosEncontradosDestino,
      mostrarListaUsuariosOrigen,
      mostrarListaUsuariosDestino,
      usuarioOrigenSeleccionado,
      usuarioDestinoSeleccionado,
      equiposUsuarioOrigen,
      equiposOrigenCargando,
      transferenciaEnProgreso,
      puedeTransferir,
        equiposSeleccionados,
  seleccionarTodos,
  equiposSeleccionadosCount,
  toggleSeleccionarTodos,
  estaSeleccionado,
      abrirModalTransferencia,
      cerrarModalTransferencia,
      buscarUsuariosOrigen,
      buscarUsuariosDestino,
      seleccionarUsuarioOrigen,
      seleccionarUsuarioDestino,
      confirmarTransferencia,
      // Métodos existentes
      enviarARevision,
      generarReporteGeneral,
      generarReporte,
      totalPaginas,
      cargarEquipos,
      cambiarPagina,
      getBadgeClass,
      getEstadoClass,
      formatFecha,
      editarEquipo,
      verMantenimientos,
      confirmarEliminacion,
      cancelarEliminacion,
      eliminarEquipo,
      exportarEquipos,
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

.btn-warning {
  @apply inline-flex items-center justify-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn-info {
  @apply inline-flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed;
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

.btn-confirm-bulk {
  @apply px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed;
}

.input-search {
  @apply pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent;
}

.pagination-button {
  @apply w-10 h-10 flex items-center justify-center rounded-md border border-gray-300 bg-white hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed;
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