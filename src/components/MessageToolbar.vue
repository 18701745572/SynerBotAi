<template>
  <div class="message-toolbar" :class="{ show: show }">
    <div class="toolbar-content">
      <div class="toolbar-header">
        <span class="toolbar-title">消息工具栏</span>
        <button @click="$emit('close')" class="close-btn">×</button>
      </div>
      
      <div class="toolbar-actions">
        <button @click="handleClearChat" class="action-btn clear-btn">
          <span class="action-icon">🗑️</span>
          <span class="action-text">清空聊天</span>
        </button>
        
        <button @click="handleExportChat" class="action-btn export-btn">
          <span class="action-icon">📤</span>
          <span class="action-text">导出聊天</span>
        </button>
        
        <button @click="handleCopyChat" class="action-btn copy-btn">
          <span class="action-icon">📋</span>
          <span class="action-text">复制聊天</span>
        </button>
        
        <button @click="handleSaveChat" class="action-btn save-btn">
          <span class="action-icon">💾</span>
          <span class="action-text">保存聊天</span>
        </button>
      </div>
      
      <div class="chat-stats">
        <div class="stat-item">
          <span class="stat-label">消息数量:</span>
          <span class="stat-value">{{ messages.length }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">用户消息:</span>
          <span class="stat-value">{{ userMessageCount }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">AI回复:</span>
          <span class="stat-value">{{ aiMessageCount }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'MessageToolbar',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    messages: {
      type: Array,
      default: () => []
    }
  },
  emits: ['close', 'clear-chat'],
  setup(props, { emit }) {
    // 计算用户消息数量
    const userMessageCount = computed(() => {
      return props.messages.filter(msg => msg.position === 'right').length
    })
    
    // 计算AI消息数量
    const aiMessageCount = computed(() => {
      return props.messages.filter(msg => msg.position === 'left').length
    })
    
    // 清空聊天
    const handleClearChat = () => {
      if (confirm('确定要清空所有聊天记录吗？此操作不可撤销。')) {
        emit('clear-chat')
      }
    }
    
    // 导出聊天
    const handleExportChat = () => {
      const chatText = props.messages.map(msg => {
        const role = msg.position === 'right' ? '用户' : 'AI'
        return `[${role}] ${msg.content.text}`
      }).join('\n\n')
      
      const blob = new Blob([chatText], { type: 'text/plain;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `聊天记录_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
    
    // 复制聊天
    const handleCopyChat = async () => {
      const chatText = props.messages.map(msg => {
        const role = msg.position === 'right' ? '用户' : 'AI'
        return `[${role}] ${msg.content.text}`
      }).join('\n\n')
      
      try {
        await navigator.clipboard.writeText(chatText)
        alert('聊天记录已复制到剪贴板')
      } catch (error) {
        console.error('复制失败:', error)
        alert('复制失败，请手动复制')
      }
    }
    
    // 保存聊天
    const handleSaveChat = () => {
      const chatData = {
        timestamp: new Date().toISOString(),
        messages: props.messages,
        stats: {
          total: props.messages.length,
          user: userMessageCount.value,
          ai: aiMessageCount.value
        }
      }
      
      const blob = new Blob([JSON.stringify(chatData, null, 2)], { 
        type: 'application/json;charset=utf-8' 
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `聊天记录_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
    
    return {
      userMessageCount,
      aiMessageCount,
      handleClearChat,
      handleExportChat,
      handleCopyChat,
      handleSaveChat
    }
  }
}
</script>

<style scoped>
.message-toolbar {
  position: fixed;
  top: 0;
  right: -350px;
  width: 350px;
  height: 100vh;
  background: white;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  transition: right 0.3s ease;
  z-index: 1000;
  overflow-y: auto;
}

.message-toolbar.show {
  right: 0;
}

.toolbar-content {
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.toolbar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e9ecef;
}

.toolbar-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #999;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: #f8f9fa;
  color: #333;
}

.toolbar-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 30px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  background: white;
  color: #333;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95rem;
  font-weight: 500;
  text-align: left;
}

.action-btn:hover {
  border-color: #667eea;
  background: #f8f9ff;
  transform: translateX(2px);
}

.action-icon {
  font-size: 1.2rem;
  flex-shrink: 0;
}

.action-text {
  flex: 1;
}

.clear-btn:hover {
  border-color: #ff4757;
  background: #fff5f5;
  color: #ff4757;
}

.export-btn:hover {
  border-color: #2ed573;
  background: #f0fff4;
  color: #2ed573;
}

.copy-btn:hover {
  border-color: #ffa502;
  background: #fff8e1;
  color: #ffa502;
}

.save-btn:hover {
  border-color: #3742fa;
  background: #f1f2ff;
  color: #3742fa;
}

.chat-stats {
  margin-top: auto;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f8f9fa;
}

.stat-item:last-child {
  border-bottom: none;
}

.stat-label {
  color: #666;
  font-size: 0.9rem;
}

.stat-value {
  color: #333;
  font-weight: 600;
  font-size: 0.9rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .message-toolbar {
    width: 100%;
    right: -100%;
  }
  
  .toolbar-content {
    padding: 15px;
  }
  
  .toolbar-header {
    margin-bottom: 15px;
    padding-bottom: 10px;
  }
  
  .toolbar-title {
    font-size: 1.1rem;
  }
  
  .action-btn {
    padding: 10px 12px;
    font-size: 0.9rem;
  }
  
  .action-icon {
    font-size: 1.1rem;
  }
}
</style>
