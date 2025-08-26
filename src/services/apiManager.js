import lmStudioAPI from './lmStudioApi.js'
import difyAPI from './difyApi.js'

// API服务管理器
class APIManager {
  constructor() {
    // 当前使用的API类型
    this.currentAPI = 'lmstudio' // 'lmstudio' 或 'dify'
    
    // API实例映射
    this.apis = {
      lmstudio: lmStudioAPI,
      dify: difyAPI
    }
    
    // 当前API实例
    this.currentInstance = this.apis[this.currentAPI]
    
    // 配置信息
    this.config = {
      lmstudio: {
        baseURL: 'http://localhost:1234/v1',
        timeout: 30000
      },
      dify: {
        baseURL: 'https://api.dify.ai/v1',
        timeout: 30000,
        apiKey: '',
        appId: ''
      }
    }
  }

  // 切换API类型
  switchAPI(apiType) {
    if (this.apis[apiType]) {
      this.currentAPI = apiType
      this.currentInstance = this.apis[apiType]
      console.log(`🔄 已切换到 ${apiType.toUpperCase()} API`)
      return true
    } else {
      console.error(`❌ 不支持的API类型: ${apiType}`)
      return false
    }
  }

  // 获取当前API类型
  getCurrentAPI() {
    return this.currentAPI
  }

  // 获取当前API实例
  getCurrentInstance() {
    return this.currentInstance
  }

  // 设置配置
  setConfig(apiType, config) {
    if (this.config[apiType]) {
      this.config[apiType] = { ...this.config[apiType], ...config }
      
      // 如果是当前API，立即应用配置
      if (apiType === this.currentAPI) {
        this.applyConfig(apiType)
      }
    }
  }

  // 应用配置到API实例
  applyConfig(apiType) {
    const config = this.config[apiType]
    const instance = this.apis[apiType]
    
    if (apiType === 'lmstudio') {
      if (config.baseURL) {
        instance.setBaseURL(config.baseURL)
      }
      if (config.timeout) {
        instance.setTimeout(config.timeout)
      }
    } else if (apiType === 'dify') {
      if (config.baseURL) {
        instance.setBaseURL(config.baseURL)
      }
      if (config.timeout) {
        instance.setTimeout(config.timeout)
      }
      if (config.apiKey) {
        instance.setApiKey(config.apiKey)
      }
      if (config.appId) {
        instance.setAppId(config.appId)
      }
    }
  }

  // 检查连接状态
  async checkConnection() {
    try {
      const result = await this.currentInstance.checkConnection()
      return {
        ...result,
        apiType: this.currentAPI
      }
    } catch (error) {
      return {
        connected: false,
        error: error.message,
        apiType: this.currentAPI
      }
    }
  }

  // 发送聊天消息
  async sendChatMessage(message, options = {}) {
    try {
      // 根据API类型调整参数
      if (this.currentAPI === 'dify') {
        // Dify需要appId
        if (this.config.dify.appId) {
          options.appId = this.config.dify.appId
        }
      }
      
      const result = await this.currentInstance.sendChatMessage(message, options)
      return {
        ...result,
        apiType: this.currentAPI
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        apiType: this.currentAPI
      }
    }
  }

  // 获取模型/应用列表
  async getModels() {
    try {
      if (this.currentAPI === 'lmstudio') {
        return await this.currentInstance.getModels()
      } else if (this.currentAPI === 'dify') {
        return await this.currentInstance.getApps()
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  // 获取会话列表（仅Dify支持）
  async getConversations() {
    if (this.currentAPI === 'dify') {
      try {
        return await this.currentInstance.getConversations(this.config.dify.appId)
      } catch (error) {
        return {
          success: false,
          error: error.message
        }
      }
    } else {
      return {
        success: false,
        error: '当前API不支持会话管理功能'
      }
    }
  }

  // 获取会话消息（仅Dify支持）
  async getConversationMessages(conversationId) {
    if (this.currentAPI === 'dify') {
      try {
        return await this.currentInstance.getConversationMessages(conversationId)
      } catch (error) {
        return {
          success: false,
          error: error.message
        }
      }
    } else {
      return {
        success: false,
        error: '当前API不支持会话管理功能'
      }
    }
  }

  // 删除会话（仅Dify支持）
  async deleteConversation(conversationId) {
    if (this.currentAPI === 'dify') {
      try {
        return await this.currentInstance.deleteConversation(conversationId)
      } catch (error) {
        return {
          success: false,
          error: error.message
        }
      }
    } else {
      return {
        success: false,
        error: '当前API不支持会话管理功能'
      }
    }
  }

  // 保存配置到本地存储
  saveConfig() {
    localStorage.setItem('apiManagerConfig', JSON.stringify({
      currentAPI: this.currentAPI,
      config: this.config
    }))
  }

  // 从本地存储加载配置
  loadConfig() {
    const saved = localStorage.getItem('apiManagerConfig')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        this.currentAPI = data.currentAPI || 'lmstudio'
        this.currentInstance = this.apis[this.currentAPI]
        this.config = { ...this.config, ...data.config }
        
        // 应用配置
        this.applyConfig(this.currentAPI)
        
        console.log('✅ 已加载API配置')
        return true
      } catch (error) {
        console.error('❌ 加载API配置失败:', error)
        return false
      }
    }
    return false
  }

  // 获取API信息
  getAPIInfo() {
    return {
      currentAPI: this.currentAPI,
      config: this.config[this.currentAPI],
      supportedAPIs: Object.keys(this.apis)
    }
  }
}

// 创建单例实例
const apiManager = new APIManager()

// 自动加载配置
apiManager.loadConfig()

export default apiManager
