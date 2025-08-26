import axios from 'axios'

// Dify API 服务类
class DifyAPI {
  constructor() {
    // API 基础配置
    this.baseURL = 'https://api.dify.ai/v1' // Dify API 地址
    this.timeout = 30000 // 30秒超时
    this.apiKey = '' // Dify API Key
    this.appId = '' // Dify 应用ID
    
    // 创建 axios 实例
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: this.timeout,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      }
    })
    
    // 请求拦截器
    this.api.interceptors.request.use(
      (config) => {
        // 动态设置Authorization头
        if (this.apiKey) {
          config.headers.Authorization = `Bearer ${this.apiKey}`
        }
        
        console.log('🚀 发送Dify请求:', config.method?.toUpperCase(), config.url)
        return config
      },
      (error) => {
        console.error('❌ Dify请求错误:', error)
        return Promise.reject(error)
      }
    )
    
    // 响应拦截器
    this.api.interceptors.response.use(
      (response) => {
        console.log('✅ Dify请求成功:', response.status)
        return response
      },
      (error) => {
        console.error('❌ Dify响应错误:', error.response?.status, error.message)
        return Promise.reject(error)
      }
    )
  }

  // 设置API配置
  setConfig(config) {
    if (config.apiKey) {
      this.apiKey = config.apiKey
      this.api.defaults.headers.Authorization = `Bearer ${config.apiKey}`
    }
    if (config.appId) {
      this.appId = config.appId
    }
    if (config.baseURL) {
      this.baseURL = config.baseURL
      this.api.defaults.baseURL = config.baseURL
    }
  }

  // 检查连接状态
  async checkConnection() {
    try {
      // Dify使用应用列表来检查连接
      const response = await this.api.get('/apps')
      return {
        connected: true,
        apps: response.data.data || []
      }
    } catch (error) {
      return {
        connected: false,
        error: error.message
      }
    }
  }

  // 发送聊天消息
  async sendChatMessage(message, options = {}) {
    const {
      conversationId = null,
      user = 'user',
      inputs = {},
      query = message,
      responseMode = 'blocking', // blocking 或 streaming
      userInputs = {}
    } = options

    try {
      const requestData = {
        inputs: userInputs,
        query: query,
        response_mode: responseMode,
        user: user
      }

      // 如果有会话ID，添加到请求中
      if (conversationId) {
        requestData.conversation_id = conversationId
      }

      const response = await this.api.post(`/chat-messages`, requestData)

      // 处理响应
      if (responseMode === 'blocking') {
        const data = response.data
        return {
          success: true,
          content: data.answer,
          conversationId: data.conversation_id,
          messageId: data.id,
          usage: data.metadata?.usage || {}
        }
      } else {
        // 流式响应处理
        return {
          success: true,
          stream: true,
          data: response.data
        }
      }
    } catch (error) {
      return {
        success: false,
        error: this.handleError(error)
      }
    }
  }

  // 获取应用列表
  async getApps() {
    try {
      const response = await this.api.get('/apps')
      return {
        success: true,
        apps: response.data.data || []
      }
    } catch (error) {
      return {
        success: false,
        error: this.handleError(error)
      }
    }
  }

  // 获取应用详情
  async getAppDetail(appId) {
    try {
      const response = await this.api.get(`/apps/${appId}`)
      return {
        success: true,
        app: response.data
      }
    } catch (error) {
      return {
        success: false,
        error: this.handleError(error)
      }
    }
  }

  // 获取会话列表
  async getConversations(appId, user = 'user') {
    try {
      const response = await this.api.get(`/conversations`, {
        params: {
          app_id: appId,
          user: user
        }
      })
      return {
        success: true,
        conversations: response.data.data || []
      }
    } catch (error) {
      return {
        success: false,
        error: this.handleError(error)
      }
    }
  }

  // 获取会话消息
  async getConversationMessages(conversationId) {
    try {
      const response = await this.api.get(`/conversations/${conversationId}/messages`)
      return {
        success: true,
        messages: response.data.data || []
      }
    } catch (error) {
      return {
        success: false,
        error: this.handleError(error)
      }
    }
  }

  // 删除会话
  async deleteConversation(conversationId) {
    try {
      await this.api.delete(`/conversations/${conversationId}`)
      return {
        success: true
      }
    } catch (error) {
      return {
        success: false,
        error: this.handleError(error)
      }
    }
  }

  // 错误处理
  handleError(error) {
    if (error.response) {
      // 服务器响应了错误状态码
      const status = error.response.status
      const message = error.response.data?.message || error.message
      
      switch (status) {
        case 400:
          return '请求参数错误，请检查输入内容'
        case 401:
          return 'API密钥无效，请检查Dify配置'
        case 403:
          return '权限不足，请检查应用访问权限'
        case 404:
          return '应用不存在，请检查应用ID'
        case 429:
          return '请求频率过高，请稍后重试'
        case 500:
          return 'Dify服务器错误，请稍后重试'
        default:
          return `请求失败 (${status}): ${message}`
      }
    } else if (error.request) {
      // 请求已发出但没有收到响应
      return '无法连接到Dify服务，请检查网络连接'
    } else {
      // 其他错误
      return error.message || '未知错误'
    }
  }

  // 设置基础URL
  setBaseURL(url) {
    this.baseURL = url
    this.api.defaults.baseURL = url
  }

  // 设置超时时间
  setTimeout(timeout) {
    this.timeout = timeout
    this.api.defaults.timeout = timeout
  }

  // 设置API密钥
  setApiKey(apiKey) {
    this.apiKey = apiKey
    this.api.defaults.headers.Authorization = `Bearer ${apiKey}`
  }

  // 设置应用ID
  setAppId(appId) {
    this.appId = appId
  }
}

// 创建单例实例
const difyAPI = new DifyAPI()

export default difyAPI
