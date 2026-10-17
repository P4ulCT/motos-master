import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Importar Element Plus y sus estilos
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App)

app.use(router)
app.use(ElementPlus) // <-- Activamos Element Plus

app.mount('#app')