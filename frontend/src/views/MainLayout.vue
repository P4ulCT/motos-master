<template>
  <el-container style="height: 100vh;">
    <!-- Menú Lateral -->
    <el-aside width="220px" style="background-color: #304156; color: white;">
      <div style="padding: 20px; text-align: center; font-size: 20px; font-weight: bold; border-bottom: 1px solid #1f2d3d;">
        Motos Master 🏍️
      </div>
      <el-menu
        active-text-color="#ffd04b"
        background-color="#304156"
        text-color="#bfcbd9"
        :default-active="$route.path"
        router
        style="border-right: none;"
      >
        <el-menu-item index="/clientes">
          <span>Clientes</span>
        </el-menu-item>
        <el-menu-item index="/motos">
          <span>Motos</span>
        </el-menu-item>
        <el-menu-item index="/citas">
          <span>Citas</span>
        </el-menu-item>
        <el-menu-item index="/inventario">
          <span>Inventario</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- Contenido Principal -->
    <el-container>
      <!-- Barra Superior -->
      <el-header style="background-color: white; display: flex; justify-content: flex-end; align-items: center; border-bottom: 1px solid #ccc;">
        <span style="margin-right: 20px; font-weight: bold;">Administrador</span>
        <el-button type="danger" size="small" @click="cerrarSesion">Cerrar Sesión</el-button>
      </el-header>

      <!-- Aquí se cargan las pantallas (Clientes, Motos, etc.) -->
      <el-main style="background-color: #f0f2f5;">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()

const cerrarSesion = () => {
  localStorage.removeItem('usuario')
  ElMessage.info('Sesión cerrada')
  router.push('/')
}
</script>