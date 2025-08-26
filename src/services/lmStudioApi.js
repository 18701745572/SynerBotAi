import axios from 'axios'

// LM Studio API 服务类
class LMStudioAPI {
  constructor() {
    // API 基础配置
    this.baseURL = 'http://localhost:1234/v1'
    this.timeout = 30000 // 30秒超时
    
    // 创建 axios 实例
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: this.timeout,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    // 请求拦截器
    this.api.interceptors.request.use(
      (config) => {
        // 只在非连接检查请求时打印日志
        if (!config.url?.includes('/models') || config.method !== 'GET') {
          console.log('🚀 发送请求:', config.method?.toUpperCase(), config.url)
        }
        return config
      },
      (error) => {
        console.error('❌ 请求错误:', error)
        return Promise.reject(error)
      }
    )
    
    // 响应拦截器
    this.api.interceptors.response.use(
      (response) => {
        // 只在非连接检查请求时打印日志
        if (!response.config.url?.includes('/models') || response.config.method !== 'GET') {
          console.log('✅ 请求成功:', response.status)
        }
        return response
      },
      (error) => {
        console.error('❌ 响应错误:', error.response?.status, error.message)
        return Promise.reject(error)
      }
    )
  }

  // 检查连接状态
  async checkConnection() {
    try {
      const response = await this.api.get('/models')
      return {
        connected: true,
        models: response.data.data || []
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
      model = 'local-model',
      temperature = 0.7,
      maxTokens = 1000,
      systemPrompt = '你是一个友好的AI助手，请用中文回答用户的问题。'
    } = options

    try {
      const response = await this.api.post('/chat/completions', {
        model,
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature,
        max_tokens: maxTokens,
        stream: false
      })

      // 获取AI回复内容
      let content = response.data.choices[0].message.content
      
      // 过滤掉thinking部分
      content = this.filterThinkingContent(content)
      
      return {
        success: true,
        content: content,
        usage: response.data.usage
      }
    } catch (error) {
      return {
        success: false,
        error: this.handleError(error)
      }
    }
  }

  // 获取模型列表
  async getModels() {
    try {
      const response = await this.api.get('/models')
      return {
        success: true,
        models: response.data.data || []
      }
    } catch (error) {
      return {
        success: false,
        error: this.handleError(error)
      }
    }
  }

  // 获取嵌入向量
  async getEmbeddings(text, model = 'local-model') {
    try {
      const response = await this.api.post('/embeddings', {
        model,
        input: text
      })

      return {
        success: true,
        embeddings: response.data.data[0].embedding
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
      const message = error.response.data?.error?.message || error.message
      
      switch (status) {
        case 400:
          return '请求参数错误，请检查输入内容'
        case 401:
          return '认证失败，请检查API配置'
        case 404:
          return '模型不存在，请检查模型名称'
        case 500:
          return '服务器内部错误，请稍后重试'
        default:
          return `请求失败 (${status}): ${message}`
      }
    } else if (error.request) {
      // 请求已发出但没有收到响应
      return '无法连接到LM Studio，请确保服务正在运行'
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

  // 过滤thinking内容
  filterThinkingContent(content) {
    if (!content) return content
    
    // 移除<think>标签及其内容
    let filteredContent = content.replace(/<think>[\s\S]*?<\/think>/gi, '')
    
    // 移除可能的XML标签
    filteredContent = filteredContent.replace(/<[^>]*>/g, '')
    
    // 清理多余的空行和空格
    filteredContent = filteredContent
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('\n')
    
    // 如果过滤后内容为空，返回原始内容
    if (!filteredContent.trim()) {
      return content
    }
    
    return filteredContent.trim()
  }
}

// 创建单例实例
const lmStudioAPI = new LMStudioAPI()

export default lmStudioAPI
