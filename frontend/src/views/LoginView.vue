<template>
  <div class="login-container">
    <el-card class="login-card">
      <h2 style="text-align: center;">Motos Master 🏍️</h2>
      <p style="text-align: center; color: gray; margin-bottom: 20px;">Iniciar Sesión</p>
      
      <el-form :model="form" label-position="top">
        <el-form-item label="Usuario">
          <el-input v-model="form.usuario" placeholder="Ingrese su usuario"></el-input>
        </el-form-item>
        <el-form-item label="Contraseña">
          <el-input v-model="form.password" type="password" placeholder="Ingrese su contraseña"></el-input>
        </el-form-item>
        <el-button type="primary" style="width: 100%;" @click="hacerLogin">Ingresar</el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import axios from 'axios'

const router = useRouter()
const form = ref({
  usuario: '',
  password: ''
})

const hacerLogin = async () => {
  try {
    const respuesta = await axios.post('http://localhost:3000/api/login', form.value)
    
    // Si el login es exitoso:
    ElMessage.success('Bienvenido ' + respuesta.data.usuario.nombre)
    
    // Guardamos los datos del usuario en el navegador
    localStorage.setItem('usuario', JSON.stringify(respuesta.data.usuario))
    
    // Redirigimos a la pantalla de clientes
    router.push('/clientes')

  } catch (error) {
    ElMessage.error(error.response?.data?.error || 'Error al conectar con el servidor')
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
.login-card {
  width: 400px;
}
</style>