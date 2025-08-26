<template>
  <div class="app-container">
    <!-- 应用标题栏 -->
    <header class="app-header">
      <h1>🤖 智能体聊天助手</h1>
      <div class="header-controls">
        <div class="status-indicator">
          <span :class="['status-dot', { 'connected': isConnected }]"></span>
          {{ isConnected ? '已连接' : '未连接' }}
        </div>
        <button @click="toggleToolbar" class="toolbar-toggle" title="显示工具栏">
          🛠️
        </button>
      </div>
    </header>

    <!-- 聊天界面容器 -->
    <div class="chat-container">
      <!-- 左侧面板 -->
      <div class="left-panel">
        <!-- 聊天历史记录 -->
        <ChatHistory 
          :current-session-id="currentSessionId"
          :sessions="sessions"
          @session-selected="handleSessionSelect"
          @new-chat="handleNewChat"
          @session-deleted="handleSessionDelete"
        />
        
        <!-- 配置面板 -->
        <ConfigPanel @config-updated="handleConfigUpdate" />
      </div>
      
      <!-- 主聊天区域 -->
      <div class="main-chat-area">
        <!-- 快捷回复组件 -->
        <QuickReplies @quick-reply-click="handleQuickReplyClick" />
        
        <!-- 聊天消息显示区域 -->
        <div class="chat-messages" ref="messagesContainer">
          <div v-if="messages.length === 0" class="empty-state">
            <div class="empty-icon">🤖</div>
            <div class="empty-title">欢迎使用智能体聊天助手</div>
            <div class="empty-subtitle">选择快捷问题开始对话，或直接输入您的问题</div>
          </div>
          
          <div 
            v-for="(message, index) in messages" 
            :key="index"
            :class="['message', message.position]"
          >
            <div class="message-avatar">
              {{ message.user.avatar }}
            </div>
            <div class="message-content">
              <div class="message-text">{{ message.content.text }}</div>
              <div class="message-time">{{ formatTime(message.timestamp) }}</div>
            </div>
          </div>
          
          <!-- 加载状态 -->
          <div v-if="loading" class="loading-message">
            <div class="loading-avatar">🤖</div>
            <div class="loading-content">
              <div class="loading-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div class="loading-text">正在思考中...</div>
            </div>
          </div>
        </div>
        
        <!-- 用户输入组件 -->
        <UserInput 
          :loading="loading"
          :placeholder="placeholder"
          @send="handleUserInput"
        />
      </div>
    </div>
    
    <!-- 消息工具栏 -->
    <MessageToolbar 
      :show="showToolbar"
      :messages="messages"
      @close="closeToolbar"
      @clear-chat="handleClearChat"
    />
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import ConfigPanel from './components/ConfigPanel.vue'
import ChatHistory from './components/ChatHistory.vue'
import MessageToolbar from './components/MessageToolbar.vue'
import QuickReplies from './components/QuickReplies.vue'
import UserInput from './components/UserInput.vue'
import apiManager from './services/apiManager.js'

export default {
  name: 'App',
  components: {
    ConfigPanel,
    ChatHistory,
    MessageToolbar,
    QuickReplies,
    UserInput
  },
  setup() {
    // 响应式数据
    const messages = ref([])
    const loading = ref(false)
    const isConnected = ref(false)
    const showToolbar = ref(false)
    const currentSessionId = ref('')
    const chatHistoryRef = ref(null)
    
    // 会话管理
    const sessions = ref([])
    
    // 聊天配置
    const locale = {
      inputPlaceholder: '请输入您的问题...',
      sendButtonText: '发送',
      loadingText: '正在思考中...'
    }
    
    const placeholder = '请输入您的问题...'
    
    // 快捷回复选项
    const quickReplies = ref([
      {
        icon: 'message',
        name: '你好',
        isNew: true,
        isHighlight: true,
      },
      {
        name: '介绍一下你自己',
        isNew: true,
      },
      {
        name: '帮我写代码',
        isNew: true,
      },
      {
        name: '解释一个概念',
        isNew: true,
      },
    ])

    // 聊天配置
    const chatConfig = reactive({
      model: 'local-model',
      temperature: 0.7,
      maxTokens: 1000,
      systemPrompt: '你是一个友好的AI助手，请用中文回答用户的问题。'
    })
    
    // 连接检查防抖
    let connectionCheckTimeout = null
    
    // 保存会话到本地存储
    const saveSessions = () => {
      localStorage.setItem('chatSessions', JSON.stringify(sessions.value))
    }
    
    // 加载会话从本地存储
    const loadSessions = () => {
      const saved = localStorage.getItem('chatSessions')
      if (saved) {
        try {
          sessions.value = JSON.parse(saved).map(session => ({
            ...session,
            timestamp: new Date(session.timestamp)
          }))
        } catch (error) {
          console.error('加载会话失败:', error)
        }
      }
      
      // 如果没有会话，创建一个默认会话
      if (sessions.value.length === 0) {
        createNewSession()
      } else {
        // 选择第一个会话
        currentSessionId.value = sessions.value[0].id
        loadSessionMessages(currentSessionId.value)
      }
    }
    
    // 创建新会话
    const createNewSession = () => {
      const newSession = {
        id: Date.now().toString(),
        title: '新对话',
        preview: '开始新的对话...',
        timestamp: new Date(),
        messages: []
      }
      
      sessions.value.unshift(newSession)
      saveSessions()
      currentSessionId.value = newSession.id
      messages.value = []
      return newSession
    }
    
    // 加载会话消息
    const loadSessionMessages = (sessionId) => {
      const session = sessions.value.find(s => s.id === sessionId)
      if (session) {
        messages.value = session.messages || []
      } else {
        messages.value = []
      }
    }
    
    // 保存当前会话消息
    const saveCurrentSessionMessages = () => {
      const session = sessions.value.find(s => s.id === currentSessionId.value)
      if (session) {
        session.messages = [...messages.value]
        session.timestamp = new Date()
        
        // 更新会话标题和预览
        if (messages.value.length > 0) {
          const firstUserMessage = messages.value.find(m => m.position === 'right')
          if (firstUserMessage) {
            session.title = firstUserMessage.content.text.substring(0, 20) + (firstUserMessage.content.text.length > 20 ? '...' : '')
          }
          
          const lastMessage = messages.value[messages.value.length - 1]
          if (lastMessage) {
            session.preview = lastMessage.content.text.substring(0, 30) + (lastMessage.content.text.length > 30 ? '...' : '')
          }
        }
        
        saveSessions()
      }
    }
    
    // 检查连接状态
    const checkConnection = async () => {
      // 如果已经在检查中，则跳过
      if (connectionCheckTimeout) {
        return
      }
      
      try {
        const result = await apiManager.checkConnection()
        const wasConnected = isConnected.value
        isConnected.value = result.connected
        
        // 只在连接状态发生变化时打印日志
        if (result.connected && !wasConnected) {
          console.log(`✅ ${result.apiType.toUpperCase()} 连接成功`)
        } else if (!result.connected && wasConnected) {
          console.error(`❌ ${result.apiType.toUpperCase()} 连接失败:`, result.error)
        }
      } catch (error) {
        const wasConnected = isConnected.value
        isConnected.value = false
        
        // 只在连接状态发生变化时打印日志
        if (wasConnected) {
          console.error('❌ API连接失败:', error.message)
        }
      }
    }

    // 发送消息到AI服务
    const sendToAI = async (message) => {
      try {
        const result = await apiManager.sendChatMessage(message, {
          model: chatConfig.model,
          temperature: chatConfig.temperature,
          maxTokens: chatConfig.maxTokens,
          systemPrompt: chatConfig.systemPrompt
        })
        
        if (result.success) {
          return result.content
        } else {
          throw new Error(result.error)
        }
      } catch (error) {
        console.error('发送消息失败:', error)
        throw new Error('抱歉，我暂时无法回答您的问题，请检查网络连接或稍后重试。')
      }
    }

    // 处理发送消息
    const handleSend = async (type, val) => {
      console.log('handleSend 被调用:', type, val)
      if (type === 'text' && val.trim()) {
        // 确保有当前会话
        if (!currentSessionId.value) {
          createNewSession()
        }
        
        // 添加用户消息
        const userMessage = {
          type: 'text',
          content: { text: val },
          position: 'right',
          user: { avatar: '👤' },
          timestamp: new Date()
        }
        console.log('添加用户消息:', userMessage)
        messages.value.push(userMessage)
        
        // 保存消息到会话
        saveCurrentSessionMessages()
        
        // 显示加载状态
        loading.value = true
        
        try {
          // 发送到AI服务
          const response = await sendToAI(val)
          
          // 添加AI回复
          const aiMessage = {
            type: 'text',
            content: { text: response },
            position: 'left',
            user: { avatar: '🤖' },
            timestamp: new Date()
          }
          messages.value.push(aiMessage)
          
          // 保存消息到会话
          saveCurrentSessionMessages()
          
          // 滚动到底部
          setTimeout(() => {
            scrollToBottom()
          }, 100)
        } catch (error) {
          // 添加错误消息
          const errorMessage = {
            type: 'text',
            content: { text: error.message },
            position: 'left',
            user: { avatar: '⚠️' },
            timestamp: new Date()
          }
          messages.value.push(errorMessage)
          
          // 保存消息到会话
          saveCurrentSessionMessages()
        } finally {
          loading.value = false
        }
      }
    }
    
    // 格式化时间
    const formatTime = (timestamp) => {
      const now = new Date()
      const time = new Date(timestamp)
      const diff = now - time
      
      if (diff < 60000) { // 1分钟内
        return '刚刚'
      } else if (diff < 3600000) { // 1小时内
        return `${Math.floor(diff / 60000)}分钟前`
      } else if (diff < 86400000) { // 1天内
        return `${Math.floor(diff / 3600000)}小时前`
      } else {
        return time.toLocaleTimeString('zh-CN', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      }
    }
    
    // 滚动到底部
    const scrollToBottom = () => {
      const messagesContainer = document.querySelector('.chat-messages')
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight
      }
    }

    // 处理快捷回复点击
    const handleQuickReplyClick = (reply) => {
      handleSend('text', reply.name)
    }
    
    // 处理用户输入
    const handleUserInput = (message) => {
      console.log('收到用户输入:', message)
      handleSend('text', message)
    }

    // 渲染消息内容
    const renderMessageContent = (msg) => {
      const { content } = msg
      return content.text
    }

    // 处理配置更新
    const handleConfigUpdate = (newConfig) => {
      Object.assign(chatConfig, {
        model: newConfig.model,
        temperature: newConfig.temperature,
        maxTokens: newConfig.maxTokens,
        systemPrompt: newConfig.systemPrompt
      })
      console.log('配置已更新:', chatConfig)
    }

    // 切换工具栏显示
    const toggleToolbar = () => {
      showToolbar.value = !showToolbar.value
    }
    
    // 关闭工具栏
    const closeToolbar = () => {
      showToolbar.value = false
    }

    // 处理会话选择
    const handleSessionSelect = (sessionId) => {
      currentSessionId.value = sessionId
      loadSessionMessages(sessionId)
      console.log('选择会话:', sessionId)
    }

    // 处理新建聊天
    const handleNewChat = (newSession) => {
      currentSessionId.value = newSession.id
      messages.value = []
      console.log('新建聊天:', newSession)
    }

    // 处理会话删除
    const handleSessionDelete = (sessionId) => {
      // 从会话列表中删除
      const index = sessions.value.findIndex(s => s.id === sessionId)
      if (index > -1) {
        sessions.value.splice(index, 1)
        saveSessions()
        
        // 如果删除的是当前会话
        if (currentSessionId.value === sessionId) {
          // 选择其他会话或创建新会话
          if (sessions.value.length > 0) {
            currentSessionId.value = sessions.value[0].id
            loadSessionMessages(currentSessionId.value)
          } else {
            createNewSession()
          }
        }
      }
      console.log('删除会话:', sessionId)
    }

    // 处理清空聊天
    const handleClearChat = () => {
      messages.value = []
      // 更新当前会话
      saveCurrentSessionMessages()
      console.log('清空聊天记录')
    }

    // 组件挂载时检查连接
    onMounted(() => {
      // 加载会话数据
      loadSessions()
      
      // 检查连接状态
      checkConnection()
      
      // 定期检查连接状态（改为60秒检查一次，减少请求频率）
      const connectionInterval = setInterval(checkConnection, 60000)
      
      // 组件卸载时清理定时器
      return () => {
        clearInterval(connectionInterval)
      }
    })

    return {
      messages,
      loading,
      isConnected,
      showToolbar,
      currentSessionId,
      sessions,
      quickReplies,
      locale,
      placeholder,
      handleSend,
      handleQuickReplyClick,
      handleUserInput,
      renderMessageContent,
      handleConfigUpdate,
      toggleToolbar,
      handleSessionSelect,
      handleNewChat,
      handleSessionDelete,
      handleClearChat,
      closeToolbar,
      formatTime
    }
  }
}
</script>

<style scoped>
.app-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.app-header {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.header-controls {
  display: flex;
  align-items: center;
  gap: 15px;
}

.toolbar-toggle {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  color: white;
  cursor: pointer;
  transition: background 0.3s ease;
  font-size: 1.1rem;
}

.toolbar-toggle:hover {
  background: rgba(255, 255, 255, 0.3);
}

.app-header h1 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ff4757;
  transition: background 0.3s ease;
}

.status-dot.connected {
  background: #2ed573;
}

.chat-container {
  flex: 1;
  overflow: hidden;
  background: white;
  border-radius: 20px 20px 0 0;
  margin: 0 10px;
  box-shadow: 0 -5px 20px rgba(0, 0, 0, 0.1);
  display: flex;
}

.left-panel {
  width: 300px;
  min-width: 300px;
  background: #f8f9fa;
  border-right: 1px solid #e9ecef;
  overflow-y: auto;
}

.main-chat-area {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: white;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
  text-align: center;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 10px;
  color: #333;
}

.empty-subtitle {
  font-size: 1rem;
  color: #666;
  max-width: 300px;
  line-height: 1.5;
}

.message {
  display: flex;
  margin-bottom: 20px;
  animation: fadeIn 0.3s ease;
}

.message.left {
  justify-content: flex-start;
}

.message.right {
  justify-content: flex-end;
}

.message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  margin: 0 10px;
  flex-shrink: 0;
}

.message.left .message-avatar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.message.right .message-avatar {
  background: #f0f0f0;
  color: #666;
}

.message-content {
  max-width: 70%;
  background: #f8f9fa;
  border-radius: 15px;
  padding: 12px 16px;
  position: relative;
}

.message.left .message-content {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.message.right .message-content {
  background: #e3f2fd;
  color: #333;
}

.message-text {
  font-size: 0.95rem;
  line-height: 1.5;
  word-wrap: break-word;
  white-space: pre-wrap;
}

.message-time {
  font-size: 0.75rem;
  opacity: 0.7;
  margin-top: 5px;
  text-align: right;
}

.loading-message {
  display: flex;
  margin-bottom: 20px;
  animation: fadeIn 0.3s ease;
}

.loading-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  margin: 0 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  flex-shrink: 0;
}

.loading-content {
  background: #f8f9fa;
  border-radius: 15px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.loading-dots {
  display: flex;
  gap: 4px;
}

.loading-dots span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #667eea;
  animation: loadingDot 1.4s infinite ease-in-out;
}

.loading-dots span:nth-child(1) {
  animation-delay: -0.32s;
}

.loading-dots span:nth-child(2) {
  animation-delay: -0.16s;
}

.loading-text {
  font-size: 0.9rem;
  color: #666;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes loadingDot {
  0%, 80%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .app-header {
    padding: 10px 15px;
  }
  
  .app-header h1 {
    font-size: 1.2rem;
  }
  
  .header-controls {
    gap: 10px;
  }
  
  .toolbar-toggle {
    padding: 6px 8px;
    font-size: 1rem;
  }
  
  .chat-container {
    margin: 0 5px;
    border-radius: 15px 15px 0 0;
    flex-direction: column;
  }
  
  .left-panel {
    width: 100%;
    min-width: auto;
    max-height: 200px;
    border-right: none;
    border-bottom: 1px solid #e9ecef;
  }
}
</style>
