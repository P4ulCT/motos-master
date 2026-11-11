<template>
  <div style="padding: 20px;">
    <el-card>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h2>Control de Inventario</h2>
        <div>
          <el-button type="success" @click="$router.push('/citas')">Ir a Citas</el-button>
          <el-button type="primary" @click="abrirModalNuevo">Nuevo Insumo</el-button>
        </div>
      </div>

      <el-table :data="insumos" style="width: 100%" v-loading="cargando">
        <el-table-column prop="id" label="ID" width="60"></el-table-column>
        <el-table-column prop="nombre" label="Insumo"></el-table-column>
        <el-table-column prop="descripcion" label="Descripción"></el-table-column>
        <el-table-column label="Stock" width="150">
          <template #default="scope">
            <!-- Si la cantidad es menor al stock mínimo, se pone rojo -->
            <el-tag :type="scope.row.cantidad <= scope.row.stock_minimo ? 'danger' : 'success'">
              {{ scope.row.cantidad }} unds. (Mín: {{ scope.row.stock_minimo }})
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="precio" label="Precio ($)"></el-table-column>
        <el-table-column label="Acciones" width="150">
          <template #default="scope">
            <el-button size="small" type="warning" @click="abrirModalEditar(scope.row)">Editar</el-button>
            <el-button size="small" type="danger" @click="eliminarInsumo(scope.row.id)">Eliminar</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- Modal -->
    <el-dialog v-model="modalVisible" :title="esEdicion ? 'Editar Insumo' : 'Nuevo Insumo'" width="500px">
      <el-form :model="formulario" label-position="top">
        <el-form-item label="Nombre del Insumo">
          <el-input v-model="formulario.nombre" placeholder="Ej: Aceite 20W-50"></el-input>
        </el-form-item>
        <el-form-item label="Descripción">
          <el-input v-model="formulario.descripcion" placeholder="Ej: Aceite para motor de 4 tiempos"></el-input>
        </el-form-item>
        <el-form-item label="Cantidad en Stock">
          <el-input v-model="formulario.cantidad" type="number" placeholder="Ej: 10"></el-input>
        </el-form-item>
        <el-form-item label="Stock Mínimo (Alerta)">
          <el-input v-model="formulario.stock_minimo" type="number" placeholder="Ej: 3"></el-input>
        </el-form-item>
        <el-form-item label="Precio Unitario">
          <el-input v-model="formulario.precio" type="number" step="0.01" placeholder="Ej: 15.50"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="modalVisible = false">Cancelar</el-button>
        <el-button type="primary" @click="guardarInsumo" :loading="guardando">Guardar</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'

const insumos = ref([])
const cargando = ref(false)
const modalVisible = ref(false)
const esEdicion = ref(false)
const guardando = ref(false)
const idEdicion = ref(null)

const formulario = ref({
  nombre: '',
  descripcion: '',
  cantidad: 0,
  stock_minimo: 5,
  precio: 0
})

const cargarInsumos = async () => {
  cargando.value = true
  try {
    const res = await axios.get('http://localhost:3000/api/insumos')
    insumos.value = res.data
  } catch (error) {
    ElMessage.error('Error al cargar el inventario')
  } finally {
    cargando.value = false
  }
}

const abrirModalNuevo = () => {
  esEdicion.value = false
  formulario.value = { nombre: '', descripcion: '', cantidad: 0, stock_minimo: 5, precio: 0 }
  modalVisible.value = true
}

const abrirModalEditar = (insumo) => {
  esEdicion.value = true
  idEdicion.value = insumo.id
  formulario.value = { 
    nombre: insumo.nombre, 
    descripcion: insumo.descripcion, 
    cantidad: insumo.cantidad,
    stock_minimo: insumo.stock_minimo,
    precio: insumo.precio
  }
  modalVisible.value = true
}

const guardarInsumo = async () => {
  if (!formulario.value.nombre) {
    return ElMessage.warning('El nombre es obligatorio')
  }
  
  guardando.value = true
  try {
    if (esEdicion.value) {
      await axios.put(`http://localhost:3000/api/insumos/${idEdicion.value}`, formulario.value)
      ElMessage.success('Insumo actualizado')
    } else {
      await axios.post('http://localhost:3000/api/insumos', formulario.value)
      ElMessage.success('Insumo registrado')
    }
    modalVisible.value = false
    cargarInsumos()
  } catch (error) {
    ElMessage.error('Error al guardar el insumo')
  } finally {
    guardando.value = false
  }
}

const eliminarInsumo = (id) => {
  ElMessageBox.confirm('¿Eliminar este insumo del inventario?', 'Advertencia', { type: 'warning' }).then(async () => {
    await axios.delete(`http://localhost:3000/api/insumos/${id}`)
    ElMessage.success('Insumo eliminado')
    cargarInsumos()
  }).catch(() => {})
}

onMounted(() => {
  cargarInsumos()
})
</script>