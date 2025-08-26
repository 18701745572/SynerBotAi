<template>
  <div class="debug-container">
    <h1>🔍 聊天组件调试页面</h1>
    
    <!-- 调试信息 -->
    <div class="debug-info">
      <h3>调试信息</h3>
      <p>消息数量: {{ messages.length }}</p>
      <p>加载状态: {{ loading }}</p>
      <p>连接状态: {{ isConnected }}</p>
    </div>
    
    <!-- 简化的聊天界面 -->
    <div class="chat-debug">
      <h3>聊天界面测试</h3>
      
      <!-- 消息列表 -->
      <div class="message-list">
        <div v-for="(message, index) in messages" :key="index" class="message">
          <div :class="['message-content', message.position]">
            <span class="avatar">{{ message.user.avatar }}</span>
            <span class="text">{{ message.content.text }}</span>
          </div>
        </div>
      </div>
      
      <!-- 输入框 -->
      <div class="input-area">
        <input 
          v-model="inputText" 
          @keyup.enter="sendMessage"
          placeholder="输入消息..."
          class="message-input"
        />
        <button @click="sendMessage" class="send-btn">发送</button>
      </div>
    </div>
    
    <!-- 测试按钮 -->
    <div class="test-buttons">
      <button @click="addTestMessage" class="test-btn">添加测试消息</button>
      <button @click="clearMessages" class="test-btn">清空消息</button>
      <button @click="testChatUI" class="test-btn">测试 ChatUI</button>
    </div>
    
    <!-- ChatUI 组件测试 -->
    <div class="chatui-test" v-if="showChatUI">
      <h3>ChatUI 组件测试</h3>
      <div class="chatui-container">
        <Chat
          :messages="messages"
          :quick-replies="[]"
          :render-message-content="renderMessageContent"
          :on-send="handleSend"
          :locale="locale"
          :placeholder="placeholder"
          :loading="loading"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { Chat } from '@chatui/core'

export default {
  name: 'AppDebug',
  components: {
    Chat
  },
  setup() {
    const messages = ref([])
    const loading = ref(false)
    const isConnected = ref(false)
    const inputText = ref('')
    const showChatUI = ref(false)
    
    // 聊天配置
    const locale = {
      inputPlaceholder: '请输入您的问题...',
      sendButtonText: '发送',
      loadingText: '正在思考中...'
    }
    
    const placeholder = '请输入您的问题...'
    
    // 添加测试消息
    const addTestMessage = () => {
      const testMessage = {
        type: 'text',
        content: { text: '这是一条测试消息 - ' + new Date().toLocaleTimeString() },
        position: 'left',
        user: { avatar: '🤖' }
      }
      messages.value.push(testMessage)
    }
    
    // 清空消息
    const clearMessages = () => {
      messages.value = []
    }
    
    // 发送消息
    const sendMessage = () => {
      if (inputText.value.trim()) {
        const userMessage = {
          type: 'text',
          content: { text: inputText.value },
          position: 'right',
          user: { avatar: '👤' }
        }
        messages.value.push(userMessage)
        inputText.value = ''
        
        // 模拟AI回复
        setTimeout(() => {
          const aiMessage = {
            type: 'text',
            content: { text: '收到您的消息：' + userMessage.content.text },
            position: 'left',
            user: { avatar: '🤖' }
          }
          messages.value.push(aiMessage)
        }, 1000)
      }
    }
    
    // 处理 ChatUI 发送
    const handleSend = (type, val) => {
      if (type === 'text' && val.trim()) {
        const userMessage = {
          type: 'text',
          content: { text: val },
          position: 'right',
          user: { avatar: '👤' }
        }
        messages.value.push(userMessage)
        
        // 模拟AI回复
        setTimeout(() => {
          const aiMessage = {
            type: 'text',
            content: { text: 'ChatUI 收到：' + val },
            position: 'left',
            user: { avatar: '🤖' }
          }
          messages.value.push(aiMessage)
        }, 1000)
      }
    }
    
    // 渲染消息内容
    const renderMessageContent = (msg) => {
      return msg.content.text
    }
    
    // 测试 ChatUI
    const testChatUI = () => {
      showChatUI.value = !showChatUI.value
    }
    
    onMounted(() => {
      console.log('调试页面已加载')
      console.log('ChatUI 组件:', Chat)
      
      // 添加一条欢迎消息
      addTestMessage()
    })
    
    return {
      messages,
      loading,
      isConnected,
      inputText,
      showChatUI,
      locale,
      placeholder,
      addTestMessage,
      clearMessages,
      sendMessage,
      handleSend,
      renderMessageContent,
      testChatUI
    }
  }
}
</script>

<style scoped>
.debug-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.debug-info {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.debug-info h3 {
  margin-top: 0;
  color: #333;
}

.chat-debug {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.chat-debug h3 {
  margin-top: 0;
  color: #333;
}

.message-list {
  height: 300px;
  overflow-y: auto;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 15px;
  background: #f9f9f9;
}

.message {
  margin-bottom: 10px;
}

.message-content {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 8px;
  max-width: 80%;
}

.message-content.left {
  background: #e3f2fd;
  margin-right: auto;
}

.message-content.right {
  background: #f3e5f5;
  margin-left: auto;
  flex-direction: row-reverse;
}

.avatar {
  font-size: 1.2rem;
}

.text {
  flex: 1;
}

.input-area {
  display: flex;
  gap: 10px;
}

.message-input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
}

.send-btn {
  padding: 10px 20px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.send-btn:hover {
  background: #5a6fd8;
}

.test-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.test-btn {
  padding: 10px 15px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.test-btn:hover {
  background: #218838;
}

.chatui-test {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
}

.chatui-test h3 {
  margin-top: 0;
  color: #333;
}

.chatui-container {
  height: 400px;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  overflow: hidden;
}

/* 确保 ChatUI 组件正确显示 */
.chatui-container :deep(.Chat) {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.chatui-container :deep(.Chat-messageList) {
  flex: 1;
  overflow-y: auto;
}

.chatui-container :deep(.Chat-input) {
  flex-shrink: 0;
}
</style>
