<template>
  <div style="padding: 20px;">
    <el-card>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h2>Gestión de Motos</h2>
        <div>
          <el-button type="primary" @click="abrirModalNuevo">Registrar Moto</el-button>
          <el-button @click="$router.push('/clientes')">Ir a Clientes</el-button>
          <!-- NUEVO BOTÓN AQUÍ -->
          <el-button type="success" @click="$router.push('/citas')">Ir a Citas</el-button> 
        </div>
      </div>

      <el-table :data="motos" style="width: 100%" v-loading="cargando">
        <el-table-column prop="id" label="ID" width="60"></el-table-column>
        <el-table-column prop="cliente_nombre" label="Propietario"></el-table-column>
        <el-table-column prop="marca" label="Marca"></el-table-column>
        <el-table-column prop="modelo" label="Modelo"></el-table-column>
        <el-table-column prop="placa" label="Placa"></el-table-column>
        <el-table-column prop="anio" label="Año"></el-table-column>
        <el-table-column label="Acciones" width="150">
          <template #default="scope">
            <el-button size="small" type="danger" @click="eliminarMoto(scope.row.id)">Eliminar</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- Modal -->
    <el-dialog v-model="modalVisible" title="Registrar Nueva Moto" width="500px">
      <el-form :model="formulario" label-position="top">
        <el-form-item label="Dueño (Cliente)">
          <el-select v-model="formulario.cliente_id" placeholder="Seleccione un cliente" style="width: 100%">
            <el-option v-for="c in clientes" :key="c.id" :label="c.nombre" :value="c.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Marca">
          <el-input v-model="formulario.marca" placeholder="Ej: Honda"></el-input>
        </el-form-item>
        <el-form-item label="Modelo">
          <el-input v-model="formulario.modelo" placeholder="Ej: CBR 250"></el-input>
        </el-form-item>
        <el-form-item label="Placa">
          <el-input v-model="formulario.placa" placeholder="Ej: PBX-1234"></el-input>
        </el-form-item>
        <el-form-item label="Año">
          <el-input v-model="formulario.anio" type="number" placeholder="Ej: 2020"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="modalVisible = false">Cancelar</el-button>
        <el-button type="primary" @click="guardarMoto">Guardar Moto</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'

const motos = ref([])
const clientes = ref([])
const cargando = ref(false)
const modalVisible = ref(false)

const formulario = ref({
  cliente_id: null,
  marca: '',
  modelo: '',
  placa: '',
  anio: ''
})

const cargarDatos = async () => {
  cargando.value = true
  try {
    const resMotos = await axios.get('http://localhost:3000/api/motos')
    motos.value = resMotos.data
    
    const resClientes = await axios.get('http://localhost:3000/api/clientes')
    clientes.value = resClientes.data
  } catch (error) {
    ElMessage.error('Error al cargar datos')
  } finally {
    cargando.value = false
  }
}

const abrirModalNuevo = () => {
  formulario.value = { cliente_id: null, marca: '', modelo: '', placa: '', anio: '' }
  modalVisible.value = true
}

const guardarMoto = async () => {
  if (!formulario.value.cliente_id || !formulario.value.marca) {
    return ElMessage.warning('Seleccione un cliente y una marca')
  }
  try {
    await axios.post('http://localhost:3000/api/motos', formulario.value)
    ElMessage.success('Moto registrada')
    modalVisible.value = false
    cargarDatos()
  } catch (error) {
    ElMessage.error('Error al guardar')
  }
}

const eliminarMoto = (id) => {
  ElMessageBox.confirm('¿Eliminar esta moto?', 'Advertencia', { type: 'warning' }).then(async () => {
    await axios.delete(`http://localhost:3000/api/motos/${id}`)
    ElMessage.success('Eliminada')
    cargarDatos()
  }).catch(() => {})
}

onMounted(() => {
  cargarDatos()
})
</script>