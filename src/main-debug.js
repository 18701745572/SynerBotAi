import { createApp } from 'vue'
import AppDebug from './App-debug.vue'

// 导入 ChatUI 的默认样式
import '@chatui/core/dist/index.css'
import './style.css'

// 创建 Vue 应用实例
const app = createApp(AppDebug)

// 挂载应用到 DOM
app.mount('#app')

console.log('调试版本已加载')
