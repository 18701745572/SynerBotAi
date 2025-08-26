# 🔄 Dify平台集成指南

## 📋 概述

本项目已成功集成Dify平台API，支持在LM Studio（本地）和Dify（云端）之间动态切换。本指南将详细介绍如何使用Dify平台接口。

## ✨ 新增功能

### 🔌 双API支持
- **LM Studio API** - 本地AI模型，无需网络连接
- **Dify API** - 云端AI服务，功能更丰富

### 🎛️ 统一配置管理
- 动态API切换
- 配置自动保存
- 连接状态监控
- 应用列表管理

## 🚀 快速开始

### 1. 获取Dify API密钥

1. 登录 [Dify平台](https://dify.ai)
2. 进入"API访问"页面
3. 创建新的API密钥
4. 复制API密钥和应用ID

### 2. 配置Dify连接

1. 打开应用配置面板
2. 选择"☁️ Dify (云端)"选项
3. 填入以下信息：
   - **API地址**: `https://api.dify.ai/v1` (默认)
   - **API密钥**: 您的Dify API密钥
   - **应用ID**: 您的Dify应用ID
4. 点击"检查连接"验证配置

### 3. 选择应用

1. 点击"🔄 加载应用列表"
2. 从下拉列表中选择要使用的应用
3. 应用会自动配置到系统中

## 🔧 详细配置

### API类型对比

| 特性 | LM Studio | Dify |
|------|-----------|------|
| **部署方式** | 本地 | 云端 |
| **网络要求** | 无需网络 | 需要网络 |
| **模型选择** | 本地模型 | 多种云端模型 |
| **会话管理** | 本地存储 | 云端同步 |
| **知识库** | 不支持 | 支持 |
| **工作流** | 不支持 | 支持 |
| **成本** | 一次性 | 按使用量 |

### Dify特有功能

#### 1. 会话管理
```javascript
// 获取会话列表
const conversations = await apiManager.getConversations()

// 获取会话消息
const messages = await apiManager.getConversationMessages(conversationId)

// 删除会话
await apiManager.deleteConversation(conversationId)
```

#### 2. 应用管理
```javascript
// 获取应用列表
const apps = await apiManager.getModels()

// 获取应用详情
const appDetail = await apiManager.getAppDetail(appId)
```

#### 3. 流式响应
```javascript
// 支持流式响应
const result = await apiManager.sendChatMessage(message, {
  responseMode: 'streaming'
})
```

## 📁 项目结构

```
src/services/
├── apiManager.js      # API管理器（新增）
├── lmStudioApi.js     # LM Studio API服务
└── difyApi.js         # Dify API服务（新增）

src/components/
└── ConfigPanel.vue    # 配置面板（已更新）
```

## 🔄 API切换流程

### 1. 自动切换
```javascript
// 切换到Dify
apiManager.switchAPI('dify')

// 切换到LM Studio
apiManager.switchAPI('lmstudio')
```

### 2. 配置应用
```javascript
// 设置Dify配置
apiManager.setConfig('dify', {
  baseURL: 'https://api.dify.ai/v1',
  apiKey: 'your-api-key',
  appId: 'your-app-id'
})
```

### 3. 连接检查
```javascript
// 检查连接状态
const status = await apiManager.checkConnection()
console.log(`当前API: ${status.apiType}, 连接状态: ${status.connected}`)
```

## 🛠️ 故障排除

### 常见问题

#### 1. API密钥无效
**症状**: 401错误
**解决方案**: 
- 检查API密钥是否正确
- 确认API密钥是否已激活
- 验证API密钥权限

#### 2. 应用ID不存在
**症状**: 404错误
**解决方案**:
- 检查应用ID是否正确
- 确认应用是否已发布
- 验证应用访问权限

#### 3. 网络连接问题
**症状**: 连接超时
**解决方案**:
- 检查网络连接
- 确认防火墙设置
- 尝试使用代理

#### 4. 请求频率过高
**症状**: 429错误
**解决方案**:
- 降低请求频率
- 检查API使用配额
- 联系Dify支持

### 调试技巧

#### 1. 查看控制台日志
```javascript
// 启用详细日志
console.log('API信息:', apiManager.getAPIInfo())
```

#### 2. 测试连接
```javascript
// 测试连接状态
const result = await apiManager.checkConnection()
console.log('连接结果:', result)
```

#### 3. 验证配置
```javascript
// 验证当前配置
const config = apiManager.getAPIInfo()
console.log('当前配置:', config)
```

## 📊 性能优化

### 1. 连接池管理
- 自动重连机制
- 连接状态缓存
- 请求超时控制

### 2. 错误处理
- 智能重试机制
- 错误分类处理
- 用户友好提示

### 3. 配置缓存
- 本地存储配置
- 自动加载设置
- 配置版本管理

## 🔐 安全考虑

### 1. API密钥保护
- 密钥本地加密存储
- 不在日志中显示密钥
- 定期更新密钥

### 2. 数据传输
- HTTPS加密传输
- 请求签名验证
- 数据完整性检查

### 3. 访问控制
- 应用级别权限控制
- 用户身份验证
- 操作审计日志

## 📈 使用建议

### 1. 选择合适的API
- **开发测试**: 使用LM Studio（快速、免费）
- **生产环境**: 使用Dify（稳定、功能丰富）
- **混合模式**: 根据需求动态切换

### 2. 配置优化
- 根据网络环境调整超时时间
- 合理设置最大令牌数
- 优化系统提示词

### 3. 监控维护
- 定期检查连接状态
- 监控API使用量
- 及时更新配置

## 🆘 获取帮助

### 1. 官方文档
- [Dify API文档](https://docs.dify.ai/api-reference)
- [Dify开发者指南](https://docs.dify.ai/developers)

### 2. 社区支持
- [Dify GitHub](https://github.com/langgenius/dify)
- [Dify Discord](https://discord.gg/dify)

### 3. 技术支持
- 提交Issue到项目仓库
- 联系Dify官方支持
- 查看常见问题FAQ

## 📝 更新日志

### v1.1.0 (当前版本)
- ✅ 新增Dify API支持
- ✅ 实现API动态切换
- ✅ 优化配置管理界面
- ✅ 添加会话管理功能
- ✅ 改进错误处理机制

### 计划功能
- 🔄 流式响应支持
- 📚 知识库集成
- 🔄 工作流支持
- 📊 使用统计
- 🔐 多用户支持

---

**注意**: 使用Dify API需要有效的API密钥和应用ID，请确保在Dify平台上正确配置您的应用。
