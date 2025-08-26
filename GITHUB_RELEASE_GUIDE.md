# 🚀 GitHub 发布指南

本指南将帮助您将智能体聊天应用发布到 GitHub 上。

## 📋 发布前准备

### 1. 检查项目完整性

确保以下文件都已创建并正确配置：

- ✅ `README.md` - 项目说明文档
- ✅ `CONTRIBUTING.md` - 贡献指南
- ✅ `CHANGELOG.md` - 更新日志
- ✅ `LICENSE` - 许可证文件
- ✅ `package.json` - 项目配置
- ✅ `.gitignore` - Git 忽略文件
- ✅ `.github/` - GitHub 配置文件

### 2. 更新个人信息

在以下文件中更新您的个人信息：

#### package.json
```json
{
  "author": "您的名字 <your-email@example.com>",
  "repository": {
    "type": "git",
    "url": "https://github.com/18701745572/SynerBotAi.git"
  },
  "bugs": {
    "url": "https://github.com/18701745572/SynerBotAi/issues"
  },
  "homepage": "https://github.com/18701745572/SynerBotAi#readme"
}
```

#### README.md
将所有 `your-username` 替换为您的 GitHub 用户名

#### CONTRIBUTING.md
更新所有链接中的用户名

### 3. 检查代码质量

```bash
# 安装依赖
npm install

# 运行代码检查
npm run lint

# 构建项目
npm run build

# 测试构建结果
npm run preview
```

## 🔧 GitHub 仓库设置

### 1. 创建新仓库

1. 访问 [GitHub](https://github.com)
2. 点击 "New repository"
3. 填写仓库信息：
   - Repository name: `charui`
   - Description: `基于 ChatUI 框架的智能体聊天应用，集成 LM Studio 本地 AI 模型`
   - Visibility: Public
   - 不要初始化 README（因为我们已经有了）

### 2. 上传代码

```bash
# 初始化 Git 仓库
git init

# 添加所有文件
git add .

# 提交初始版本
git commit -m "feat: 初始版本发布

- 基于 ChatUI 框架的智能体聊天应用
- 集成 LM Studio 本地 AI 模型
- 支持多会话管理和快捷回复
- 响应式设计，支持桌面和移动设备"

# 添加远程仓库
git remote add origin https://github.com/18701745572/SynerBotAi.git

# 推送到 GitHub
git branch -M main
git push -u origin main
```

### 3. 配置 GitHub Pages

1. 进入仓库设置 (Settings)
2. 找到 "Pages" 选项
3. 选择 "Deploy from a branch"
4. 选择 `gh-pages` 分支
5. 保存设置

### 4. 启用 GitHub Actions

1. 进入仓库的 "Actions" 标签页
2. 点击 "Enable Actions"
3. 选择 "Node.js" 工作流或使用我们提供的 `.github/workflows/ci.yml`

## 🏷️ 创建发布版本

### 1. 创建标签

```bash
# 创建版本标签
git tag -a v1.0.0 -m "版本 1.0.0: 初始版本发布"

# 推送标签
git push origin v1.0.0
```

### 2. 在 GitHub 上创建 Release

1. 进入仓库的 "Releases" 页面
2. 点击 "Create a new release"
3. 选择刚创建的标签 `v1.0.0`
4. 填写发布信息：

**标题**: `v1.0.0 - 初始版本发布`

**描述**:
```markdown
## 🎉 初始版本发布

### ✨ 主要功能

- 🎨 **现代化UI设计** - 基于 ChatUI 框架的优雅界面
- 🤖 **本地AI模型集成** - 集成 LM Studio 本地大语言模型
- 💬 **实时聊天功能** - 流畅的对话体验
- 📚 **多会话管理** - 支持多个聊天会话的创建和管理
- 💾 **历史记录保存** - 自动保存聊天记录到本地存储
- ⚡ **分类快捷回复** - 按类别组织的预设问题
- 🛠️ **消息工具栏** - 复制、分享、导出、清空等操作
- ⚙️ **配置面板** - 自定义AI模型参数和系统提示词
- 📱 **响应式设计** - 支持桌面和移动设备
- 🔄 **连接状态监控** - 实时显示 LM Studio 连接状态

### 🚀 快速开始

```bash
# 克隆项目
git clone https://github.com/18701745572/SynerBotAi.git
cd charui

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 📋 系统要求

- Node.js 16.0 或更高版本
- LM Studio 已安装并运行

### 🔗 相关链接

- [在线演示](https://your-username.github.io/charui/)
- [详细文档](https://github.com/18701745572/SynerBotAi#readme)
- [问题反馈](https://github.com/18701745572/SynerBotAi/issues)
```

5. 勾选 "This is a pre-release"（如果是预发布版本）
6. 点击 "Publish release"

## 📢 推广项目

### 1. 添加项目描述

在仓库主页添加项目描述和标签：

- 添加相关标签：`chat`, `ai`, `vue`, `chatui`, `lm-studio`, `local-ai`, `chatbot`
- 更新项目描述

### 2. 创建项目 Wiki

1. 进入仓库的 "Wiki" 标签页
2. 创建详细的使用指南
3. 添加常见问题解答

### 3. 社交媒体分享

- 在技术社区分享项目
- 在相关论坛和群组中介绍
- 使用项目标签进行推广

### 4. 参与开源社区

- 在 GitHub 上关注相关项目
- 参与相关技术讨论
- 回答其他开发者的问题

## 🔄 持续维护

### 1. 定期更新

- 定期更新依赖包
- 修复发现的 Bug
- 添加新功能
- 改进文档

### 2. 版本管理

- 遵循语义化版本规范
- 及时更新 CHANGELOG.md
- 为每个版本创建 Release

### 3. 社区互动

- 及时回复 Issues 和 Pull Requests
- 感谢贡献者
- 维护项目活跃度

## 📞 获取帮助

如果您在发布过程中遇到问题，可以：

1. 查看 [GitHub 帮助文档](https://help.github.com/)
2. 在项目 Issues 中提问
3. 联系项目维护者

---

**祝您发布顺利！** 🎉
