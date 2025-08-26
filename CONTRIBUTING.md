# 🤝 贡献指南

感谢您对智能体聊天应用项目的关注！我们欢迎所有形式的贡献，无论是报告 Bug、提出新功能建议、改进文档还是提交代码。

## 📋 目录

- [贡献方式](#贡献方式)
- [开发环境设置](#开发环境设置)
- [代码规范](#代码规范)
- [提交规范](#提交规范)
- [Pull Request 流程](#pull-request-流程)
- [问题报告](#问题报告)
- [功能建议](#功能建议)
- [文档贡献](#文档贡献)

## 🚀 贡献方式

### 🐛 报告 Bug

如果您发现了 Bug，请通过以下方式报告：

1. 使用 [Bug 报告模板](https://github.com/your-username/charui/issues/new?template=bug_report.md)
2. 提供详细的复现步骤
3. 包含错误信息和截图
4. 说明您的环境信息（操作系统、浏览器版本等）

### 💡 提出新功能建议

如果您有新功能的想法，请：

1. 使用 [功能建议模板](https://github.com/your-username/charui/issues/new?template=feature_request.md)
2. 详细描述功能需求和使用场景
3. 说明为什么需要这个功能
4. 提供可能的实现方案

### 📝 改进文档

文档改进包括：

- 修复文档中的错误
- 添加缺失的说明
- 改进文档的可读性
- 翻译文档到其他语言

### 🔧 提交代码

代码贡献是最直接的贡献方式，包括：

- 修复 Bug
- 实现新功能
- 优化性能
- 改进代码质量

## 🛠️ 开发环境设置

### 1. 克隆项目

```bash
git clone https://github.com/your-username/charui.git
cd charui
```

### 2. 安装依赖

```bash
npm install
```

### 3. 启动开发服务器

```bash
npm run dev
```

### 4. 运行测试

```bash
npm test
```

## 📏 代码规范

### JavaScript/Vue.js 规范

- 使用 ES6+ 语法
- 遵循 Vue.js 官方风格指南
- 使用 2 空格缩进
- 使用单引号
- 每行最大长度 80 字符
- 使用分号结尾

### 组件命名规范

- 组件文件名使用 PascalCase（如 `ChatHistory.vue`）
- 组件名使用 PascalCase（如 `ChatHistory`）
- 事件名使用 kebab-case（如 `message-sent`）

### CSS 规范

- 使用 CSS 变量定义主题色彩
- 遵循 BEM 命名规范
- 避免使用 `!important`
- 优先使用 Flexbox 和 Grid 布局

### 注释规范

- 所有函数必须有中文注释说明功能
- 复杂逻辑需要详细注释
- 使用 JSDoc 格式注释

```javascript
/**
 * 发送消息到 LM Studio API
 * @param {string} message - 用户输入的消息
 * @param {Object} options - 发送选项
 * @returns {Promise<Object>} API 响应结果
 */
async function sendMessage(message, options = {}) {
  // 实现代码
}
```

## 📝 提交规范

我们使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

### 提交类型

- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

### 提交示例

```bash
feat: 添加消息导出功能
fix: 修复连接状态显示问题
docs: 更新安装说明
style: 调整按钮样式
refactor: 重构 API 调用逻辑
test: 添加单元测试
chore: 更新依赖版本
```

### 提交信息格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

## 🔄 Pull Request 流程

### 1. 创建分支

```bash
git checkout -b feature/your-feature-name
# 或
git checkout -b fix/your-bug-fix
```

### 2. 开发功能

- 编写代码
- 添加测试
- 更新文档
- 确保代码通过所有检查

### 3. 提交代码

```bash
git add .
git commit -m "feat: 添加新功能"
```

### 4. 推送分支

```bash
git push origin feature/your-feature-name
```

### 5. 创建 Pull Request

1. 访问 GitHub 仓库页面
2. 点击 "New Pull Request"
3. 选择您的分支
4. 填写 PR 描述，使用提供的模板
5. 提交 PR

### 6. 代码审查

- 等待维护者审查
- 根据反馈修改代码
- 解决所有问题后合并

## 🐛 问题报告

### Bug 报告模板

```markdown
## Bug 描述
简要描述 Bug 的情况

## 复现步骤
1. 打开应用
2. 执行操作 A
3. 执行操作 B
4. 看到错误

## 预期行为
描述应该发生什么

## 实际行为
描述实际发生了什么

## 环境信息
- 操作系统: [如 Windows 10]
- 浏览器: [如 Chrome 120.0]
- Node.js 版本: [如 18.0.0]
- LM Studio 版本: [如 0.2.0]

## 错误信息
```
错误详情
```

## 截图
[如果适用，请添加截图]

## 其他信息
任何其他相关信息
```

## 💡 功能建议

### 功能建议模板

```markdown
## 功能描述
详细描述您想要的功能

## 使用场景
描述在什么情况下会使用这个功能

## 实现建议
[可选] 提供实现思路或方案

## 替代方案
[可选] 描述其他可能的解决方案

## 相关功能
[可选] 列出相关的现有功能
```

## 📚 文档贡献

### 文档类型

- **README.md**: 项目主要说明文档
- **CHAT_FEATURES.md**: 功能使用说明
- **API 文档**: 接口使用说明
- **教程**: 使用教程和示例
- **翻译**: 多语言文档

### 文档规范

- 使用清晰的标题结构
- 提供代码示例
- 包含截图说明
- 保持文档的时效性
- 使用中文编写

## 🎯 贡献者行为准则

### 基本原则

- 尊重所有贡献者
- 保持专业和友善的交流
- 接受建设性的批评
- 关注项目的长期发展

### 沟通方式

- 使用中文进行交流
- 保持礼貌和耐心
- 提供具体的反馈
- 鼓励新贡献者

## 🏆 贡献者名单

感谢所有为项目做出贡献的开发者！

### 核心贡献者

- [您的名字](https://github.com/your-username) - 项目维护者

### 贡献者

- [贡献者名字](https://github.com/contributor) - 功能开发
- [贡献者名字](https://github.com/contributor) - Bug 修复

## 📞 联系方式

如果您有任何问题或建议，可以通过以下方式联系我们：

- [GitHub Issues](https://github.com/your-username/charui/issues)
- [GitHub Discussions](https://github.com/your-username/charui/discussions)
- 邮箱: your-email@example.com

---

再次感谢您的贡献！您的参与让这个项目变得更好。🎉
