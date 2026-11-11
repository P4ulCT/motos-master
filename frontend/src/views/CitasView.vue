<template>
  <div style="padding: 20px;">
    <el-card>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h2>Agendamiento de Citas</h2>
        <div>
          <el-button type="success" @click="$router.push('/motos')">Ir a Motos</el-button>
          <!-- NUEVO BOTÓN AQUÍ -->
          <el-button type="warning" @click="$router.push('/inventario')">Ir a Inventario</el-button> 
          <el-button type="primary" @click="abrirModalNuevo">Agendar Cita</el-button>
        </div>
      </div>

      <el-table :data="citas" style="width: 100%" v-loading="cargando">
        <el-table-column prop="id" label="ID" width="60"></el-table-column>
        <el-table-column prop="cliente_nombre" label="Cliente"></el-table-column>
        <el-table-column label="Moto">
          <template #default="scope">
            {{ scope.row.marca }} {{ scope.row.modelo }} ({{ scope.row.placa }})
          </template>
        </el-table-column>
        <el-table-column label="Fecha">
          <template #default="scope">
            {{ new Date(scope.row.fecha).toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column prop="motivo" label="Motivo"></el-table-column>
        <el-table-column label="Estado" width="120">
          <template #default="scope">
            <el-tag v-if="scope.row.estado === 'pendiente'" type="warning">Pendiente</el-tag>
            <el-tag v-else-if="scope.row.estado === 'completada'" type="success">Completada</el-tag>
            <el-tag v-else type="danger">Cancelada</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Acciones" width="200">
          <template #default="scope">
            <el-button size="small" type="primary" @click="cambiarEstado(scope.row.id, 'completada')" v-if="scope.row.estado === 'pendiente'">Completar</el-button>
            <el-button size="small" type="danger" @click="eliminarCita(scope.row.id)">Eliminar</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- Modal para Agendar Cita -->
    <el-dialog v-model="modalVisible" title="Agendar Nueva Cita" width="500px">
      <el-form :model="formulario" label-position="top">
        <el-form-item label="Cliente">
          <el-select v-model="formulario.cliente_id" placeholder="Seleccione un cliente" style="width: 100%" @change="cargarMotosCliente">
            <el-option v-for="c in clientes" :key="c.id" :label="c.nombre" :value="c.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Moto del Cliente">
          <el-select v-model="formulario.moto_id" placeholder="Seleccione una moto" style="width: 100%">
            <el-option v-for="m in motosCliente" :key="m.id" :label="`${m.marca} ${m.modelo} (${m.placa})`" :value="m.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Fecha y Hora">
          <el-date-picker v-model="formulario.fecha" type="datetime" placeholder="Seleccione fecha y hora" style="width: 100%" />
        </el-form-item>
        <el-form-item label="Motivo">
          <el-input v-model="formulario.motivo" placeholder="Ej: Mantenimiento general, cambio de aceite..."></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="modalVisible = false">Cancelar</el-button>
        <el-button type="primary" @click="guardarCita">Agendar</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'

const citas = ref([])
const clientes = ref([])
const motosCliente = ref([]) 
const cargando = ref(false)
const modalVisible = ref(false)

const formulario = ref({
  cliente_id: null,
  moto_id: null,
  fecha: '',
  motivo: ''
})

const cargarDatos = async () => {
  cargando.value = true
  try {
    const resCitas = await axios.get('http://localhost:3000/api/citas')
    citas.value = resCitas.data
    
    const resClientes = await axios.get('http://localhost:3000/api/clientes')
    clientes.value = resClientes.data
  } catch (error) {
    ElMessage.error('Error al cargar datos')
  } finally {
    cargando.value = false
  }
}

const abrirModalNuevo = () => {
  formulario.value = { cliente_id: null, moto_id: null, fecha: '', motivo: '' }
  motosCliente.value = []
  modalVisible.value = true
}

// Cuando se elige un cliente, buscamos sus motos
const cargarMotosCliente = async () => {
  formulario.value.moto_id = null
  if (!formulario.value.cliente_id) return
  try {
    const res = await axios.get('http://localhost:3000/api/motos')
    // Filtramos las motos que son de este cliente
    motosCliente.value = res.data.filter(m => m.cliente_id === formulario.value.cliente_id)
  } catch (error) {
    console.error(error)
  }
}

const guardarCita = async () => {
  if (!formulario.value.cliente_id || !formulario.value.moto_id || !formulario.value.fecha) {
    return ElMessage.warning('Complete todos los campos obligatorios')
  }
  try {
    await axios.post('http://localhost:3000/api/citas', formulario.value)
    ElMessage.success('Cita agendada exitosamente')
    modalVisible.value = false
    cargarDatos()
  } catch (error) {
    ElMessage.error('Error al agendar la cita')
  }
}

const cambiarEstado = async (id, nuevoEstado) => {
  try {
    await axios.put(`http://localhost:3000/api/citas/${id}/estado`, { estado: nuevoEstado })
    ElMessage.success('Estado actualizado')
    cargarDatos()
  } catch (error) {
    ElMessage.error('Error al actualizar estado')
  }
}

const eliminarCita = (id) => {
  ElMessageBox.confirm('¿Eliminar esta cita?', 'Advertencia', { type: 'warning' }).then(async () => {
    await axios.delete(`http://localhost:3000/api/citas/${id}`)
    ElMessage.success('Cita eliminada')
    cargarDatos()
  }).catch(() => {})
}

onMounted(() => {
  cargarDatos()
})
</script>