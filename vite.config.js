import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Vite 配置文件
export default defineConfig({
  plugins: [vue()], // 启用 Vue 插件
  server: {
    port: 3000, // 开发服务器端口
    open: true  // 自动打开浏览器
  },
  build: {
    outDir: 'dist', // 构建输出目录
    sourcemap: true // 生成源码映射
  }
})
