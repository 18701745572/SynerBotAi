# 🤖 智能体聊天应用

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Vue.js](https://img.shields.io/badge/Vue.js-3.3+-green.svg)](https://vuejs.org/)
[![ChatUI](https://img.shields.io/badge/ChatUI-1.4+-orange.svg)](https://chatui.io/)
[![LM Studio](https://img.shields.io/badge/LM%20Studio-Local%20AI-red.svg)](https://lmstudio.ai/)

基于 [ChatUI](https://chatui.io/) 框架开发的智能体聊天应用，集成 LM Studio 本地 AI 模型。

## 📋 目录

- [功能特性](#-功能特性)
- [快速开始](#-快速开始)
- [配置说明](#-配置说明)
- [项目结构](#-项目结构)
- [自定义配置](#-自定义配置)
- [故障排除](#-故障排除)
- [贡献指南](#-贡献指南)
- [许可证](#-许可证)
- [更新日志](#-更新日志)

## ✨ 功能特性

- 🎨 **现代化UI设计** - 基于 ChatUI 框架的优雅界面
- 🤖 **本地AI模型** - 集成 LM Studio 本地大语言模型
- 💬 **实时聊天** - 流畅的对话体验
- 📚 **多会话管理** - 支持多个聊天会话的创建和管理
- 💾 **历史记录** - 自动保存聊天记录到本地存储
- ⚡ **分类快捷回复** - 按类别组织的预设问题（通用、编程、写作、分析）
- 🛠️ **消息工具栏** - 复制、分享、导出、清空等操作
- ⚙️ **配置面板** - 自定义AI模型参数和系统提示词
- 📱 **响应式设计** - 支持桌面和移动设备
- 🔄 **连接状态监控** - 实时显示 LM Studio 连接状态
- 🎯 **错误处理** - 完善的错误提示和重试机制

## 🚀 快速开始

### 前置要求

1. **Node.js** (版本 16 或更高)
2. **LM Studio** 已安装并运行在本地

### 安装依赖

```bash
# 克隆项目
git clone https://github.com/18701745572/SynerBotAi.git
cd charui

# 安装依赖
npm install
```

### 启动应用

```bash
# 开发模式
npm run dev

# 或者构建生产版本
npm run build
npm run preview
```

应用将在 `http://localhost:3000` 启动

### 测试应用

您可以使用 `test.html` 文件来测试应用状态：
1. 在浏览器中打开 `test.html`
2. 点击"检查应用状态"按钮
3. 点击"测试 LM Studio 连接"按钮
4. 如果所有测试通过，点击"打开聊天应用"

### 启动 LM Studio

1. 打开 LM Studio
2. 加载您的大语言模型
3. 启动本地服务器 (默认端口 1234)

## 🔧 配置说明

### LM Studio API 配置

应用默认连接到 `http://localhost:1234/v1`，您可以在 `src/services/lmStudioApi.js` 中修改配置：

```javascript
// 修改 API 地址
lmStudioAPI.setBaseURL('http://your-lm-studio-url:port/v1')

// 修改超时时间
lmStudioAPI.setTimeout(60000) // 60秒
```

### 支持的 API 端点

- `GET /v1/models` - 获取可用模型列表
- `POST /v1/chat/completions` - 发送聊天消息
- `POST /v1/completions` - 文本补全
- `POST /v1/embeddings` - 获取文本嵌入向量

## 📁 项目结构

```
charui/
├── src/
│   ├── components/
│   │   ├── ConfigPanel.vue      # 配置面板组件
│   │   ├── ChatHistory.vue      # 聊天历史记录组件
│   │   ├── MessageToolbar.vue   # 消息工具栏组件
│   │   └── QuickReplies.vue     # 快捷回复组件
│   ├── services/
│   │   └── lmStudioApi.js       # LM Studio API 服务
│   ├── App.vue                  # 主应用组件
│   ├── main.js                  # 应用入口
│   └── style.css                # 全局样式
├── index.html                   # HTML 模板
├── vite.config.js               # Vite 配置
├── package.json                 # 项目配置
├── CHAT_FEATURES.md             # 聊天功能详细说明
├── CONTRIBUTING.md              # 贡献指南
├── CHANGELOG.md                 # 更新日志
└── README.md                    # 项目说明
```

## 🎨 自定义配置

### 修改系统提示词

在 `src/services/lmStudioApi.js` 中修改默认系统提示词：

```javascript
const systemPrompt = '你是一个专业的编程助手，请用中文回答用户的问题。'
```

### 添加快捷回复

在 `src/components/QuickReplies.vue` 中修改快捷回复数据：

```javascript
const quickRepliesData = ref({
  general: [
    { id: 'custom', name: '你的新快捷回复', icon: '🎯', isHighlight: true },
    // ... 更多快捷回复
  ],
  // ... 更多分类
})
```

### 自定义样式

修改 `src/style.css` 中的 CSS 变量：

```css
:root {
  --primary-color: #your-color;
  --secondary-color: #your-color;
  /* ... 更多样式变量 */
}
```

## 🔍 故障排除

### 连接问题

1. **确保 LM Studio 正在运行**
   - 检查 LM Studio 是否已启动
   - 确认端口 1234 没有被其他程序占用

2. **检查网络连接**
   - 确保浏览器可以访问 `http://localhost:1234`
   - 检查防火墙设置

3. **查看控制台错误**
   - 打开浏览器开发者工具
   - 查看 Console 标签页的错误信息

### 模型问题

1. **模型未加载**
   - 在 LM Studio 中确保模型已正确加载
   - 检查模型文件是否完整

2. **API 响应错误**
   - 检查模型名称是否正确
   - 确认模型支持聊天功能

## 🤝 贡献指南

我们欢迎所有形式的贡献！请查看 [CONTRIBUTING.md](CONTRIBUTING.md) 了解详细的贡献指南。

### 贡献方式

- 🐛 [报告 Bug](https://github.com/18701745572/SynerBotAi/issues/new?template=bug_report.md)
- 💡 [提出新功能建议](https://github.com/18701745572/SynerBotAi/issues/new?template=feature_request.md)
- 📝 [改进文档](https://github.com/18701745572/SynerBotAi/issues/new?template=documentation.md)
- 🔧 [提交代码](https://github.com/18701745572/SynerBotAi/compare)

### 开发环境设置

```bash
# 克隆项目
git clone https://github.com/18701745572/SynerBotAi.git
cd charui

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

## 📄 许可证

本项目采用 [ISC License](LICENSE) 许可证。

## 📖 详细文档

- [聊天功能详细说明](CHAT_FEATURES.md) - 完整的功能使用指南
- [配置面板使用说明](CHAT_FEATURES.md#4-配置ai参数) - AI参数配置指南
- [快捷回复使用说明](CHAT_FEATURES.md#方法二使用快捷回复) - 快捷回复功能说明
- [贡献指南](CONTRIBUTING.md) - 如何参与项目开发
- [更新日志](CHANGELOG.md) - 版本更新历史

## 🔗 相关链接

- [ChatUI 官方文档](https://chatui.io/docs/quick-start)
- [LM Studio 官网](https://lmstudio.ai/)
- [Vue.js 官方文档](https://vuejs.org/)
- [Vite 官方文档](https://vitejs.dev/)

## ⭐ 支持项目

如果这个项目对您有帮助，请给我们一个 ⭐ Star！

---

**注意**: 请确保在使用前已正确配置 LM Studio 并加载了合适的模型。
