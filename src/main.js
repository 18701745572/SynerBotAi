import { createApp } from 'vue'
import App from './App.vue'

// 导入 ChatUI 的默认样式
import '@chatui/core/dist/index.css'
import './style.css'

// 创建 Vue 应用实例
const app = createApp(App)

// 挂载应用到 DOM
app.mount('#app')
