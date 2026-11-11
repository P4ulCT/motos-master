<template>
  <div style="padding: 20px;">
    <el-card>
      <!-- Encabezado -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h2>Gestión de Clientes</h2>
        <div>
          <el-button type="primary" @click="abrirModalNuevo">Nuevo Cliente</el-button>
          <!-- NUEVO BOTÓN AQUÍ -->
          <el-button type="success" @click="$router.push('/motos')">Ir a Motos</el-button> 
          <el-button type="danger" @click="cerrarSesion">Cerrar Sesión</el-button>
        </div>
      </div>

      <!-- Tabla de Clientes -->
      <el-table :data="clientes" style="width: 100%" v-loading="cargando">
        <el-table-column prop="id" label="ID" width="60"></el-table-column>
        <el-table-column prop="nombre" label="Nombre Completo"></el-table-column>
        <el-table-column prop="cedula" label="Cédula"></el-table-column>
        <el-table-column prop="telefono" label="Teléfono"></el-table-column>
        <el-table-column prop="email" label="Email"></el-table-column>
        <el-table-column label="Acciones" width="150">
          <template #default="scope">
            <el-button size="small" type="warning" @click="abrirModalEditar(scope.row)">Editar</el-button>
            <el-button size="small" type="danger" @click="eliminarCliente(scope.row.id)">Eliminar</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- Ventana Modal para Crear/Editar -->
    <el-dialog v-model="modalVisible" :title="esEdicion ? 'Editar Cliente' : 'Nuevo Cliente'" width="500px">
      <el-form :model="formulario" label-position="top">
        <el-form-item label="Nombre">
          <el-input v-model="formulario.nombre" placeholder="Ej: Juan Perez"></el-input>
        </el-form-item>
        <el-form-item label="Cédula">
          <el-input v-model="formulario.cedula" placeholder="Ej: 1712345678"></el-input>
        </el-form-item>
        <el-form-item label="Teléfono">
          <el-input v-model="formulario.telefono" placeholder="Ej: 0999999999"></el-input>
        </el-form-item>
        <el-form-item label="Email">
          <el-input v-model="formulario.email" placeholder="Ej: correo@ejemplo.com"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="modalVisible = false">Cancelar</el-button>
        <el-button type="primary" @click="guardarCliente" :loading="guardando">Guardar</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import axios from 'axios'

const router = useRouter()
const API_URL = 'http://localhost:3000/api/clientes'

// Variables reactivas
const clientes = ref([])
const cargando = ref(false)
const modalVisible = ref(false)
const esEdicion = ref(false)
const guardando = ref(false)
const idEdicion = ref(null)

// Formulario
const formulario = ref({
  nombre: '',
  cedula: '',
  telefono: '',
  email: ''
})

// 1. Obtener clientes (READ)
const obtenerClientes = async () => {
  cargando.value = true
  try {
    const respuesta = await axios.get(API_URL)
    clientes.value = respuesta.data
  } catch (error) {
    ElMessage.error('Error al cargar los clientes')
  } finally {
    cargando.value = false
  }
}

// 2. Abrir modal para crear
const abrirModalNuevo = () => {
  esEdicion.value = false
  formulario.value = { nombre: '', cedula: '', telefono: '', email: '' }
  modalVisible.value = true
}

// 3. Abrir modal para editar
const abrirModalEditar = (cliente) => {
  esEdicion.value = true
  idEdicion.value = cliente.id
  formulario.value = { 
    nombre: cliente.nombre, 
    cedula: cliente.cedula, 
    telefono: cliente.telefono, 
    email: cliente.email 
  }
  modalVisible.value = true
}

// 4. Guardar (Crear o Actualizar)
const guardarCliente = async () => {
  if (!formulario.value.nombre) {
    return ElMessage.warning('El nombre es obligatorio')
  }
  
  guardando.value = true
  try {
    if (esEdicion.value) {
      // UPDATE
      await axios.put(`${API_URL}/${idEdicion.value}`, formulario.value)
      ElMessage.success('Cliente actualizado')
    } else {
      // CREATE
      await axios.post(API_URL, formulario.value)
      ElMessage.success('Cliente creado')
    }
    modalVisible.value = false
    obtenerClientes() // Recargar tabla
  } catch (error) {
    ElMessage.error('Error al guardar el cliente')
  } finally {
    guardando.value = false
  }
}

// 5. Eliminar (DELETE)
const eliminarCliente = (id) => {
  ElMessageBox.confirm('¿Está seguro de eliminar este cliente?', 'Advertencia', {
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    type: 'warning'
  }).then(async () => {
    try {
      await axios.delete(`${API_URL}/${id}`)
      ElMessage.success('Cliente eliminado')
      obtenerClientes() // Recargar tabla
    } catch (error) {
      ElMessage.error('Error al eliminar')
    }
  }).catch(() => {})
}

// Cerrar sesión
const cerrarSesion = () => {
  localStorage.removeItem('usuario')
  router.push('/')
}

// Cargar clientes al entrar a la página
onMounted(() => {
  obtenerClientes()
})
</script>