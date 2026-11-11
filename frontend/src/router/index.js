import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '../views/MainLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/',
      component: MainLayout,
      children: [
        {
          path: 'clientes',
          name: 'clientes',
          component: () => import('../views/ClientesView.vue')
        },
        {
          path: 'motos',
          name: 'motos',
          component: () => import('../views/MotosView.vue')
        },
        {
          path: 'citas',
          name: 'citas',
          component: () => import('../views/CitasView.vue')
        },
        {
          path: 'inventario',
          name: 'inventario',
          component: () => import('../views/InventarioView.vue')
        }
      ]
    }
  ]
})

export default router