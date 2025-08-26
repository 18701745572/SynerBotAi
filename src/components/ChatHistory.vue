<template>
  <div class="chat-history">
    <div class="history-header">
      <span class="history-icon">📝</span>
      <span class="history-title">聊天记录</span>
      <span class="history-count">({{ sessions.length }})</span>
    </div>
    
    <button class="new-chat-btn" @click="createNewChat">
      <span class="plus-icon">+</span>
      新建聊天
    </button>
    
    <div class="sessions-list">
      <div 
        v-for="session in sessions" 
        :key="session.id"
        :class="['session-item', { active: currentSessionId === session.id }]"
        @click="selectSession(session.id)"
      >
        <div class="session-info">
          <div class="session-title">{{ session.title || '新对话' }}</div>
          <div class="session-preview">{{ session.preview || '开始新的对话...' }}</div>
          <div class="session-time">{{ formatTime(session.timestamp) }}</div>
        </div>
        <button 
          class="delete-btn"
          @click.stop="deleteSession(session.id)"
          title="删除对话"
        >
          🗑️
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'ChatHistory',
  props: {
    currentSessionId: {
      type: String,
      default: ''
    },
    sessions: {
      type: Array,
      default: () => []
    }
  },
  emits: ['session-selected', 'new-chat', 'session-deleted'],
  setup(props, { emit }) {
    // 创建新聊天
    const createNewChat = () => {
      emit('new-chat')
    }
    
    // 选择会话
    const selectSession = (sessionId) => {
      emit('session-selected', sessionId)
    }
    
    // 删除会话
    const deleteSession = (sessionId) => {
      emit('session-deleted', sessionId)
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
        return time.toLocaleDateString()
      }
    }
    
    return {
      createNewChat,
      selectSession,
      deleteSession,
      formatTime
    }
  }
}
</script>

<style scoped>
.chat-history {
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.history-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 15px;
  font-weight: 600;
  color: #333;
}

.history-icon {
  font-size: 1.2rem;
}

.history-title {
  flex: 1;
}

.history-count {
  color: #666;
  font-size: 0.9rem;
}

.new-chat-btn {
  width: 100%;
  padding: 12px;
  border: 2px dashed #ddd;
  border-radius: 8px;
  background: white;
  color: #667eea;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
  margin-bottom: 20px;
}

.new-chat-btn:hover {
  border-color: #667eea;
  background: #f8f9ff;
}

.plus-icon {
  font-size: 1.2rem;
  font-weight: bold;
}

.sessions-list {
  flex: 1;
  overflow-y: auto;
}

.session-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;
  margin-bottom: 8px;
  background: white;
  border: 1px solid #e9ecef;
}

.session-item:hover {
  background: #f8f9fa;
}

.session-item.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.session-info {
  flex: 1;
  min-width: 0;
}

.session-title {
  font-weight: 500;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.session-preview {
  font-size: 0.85rem;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 4px;
}

.session-item.active .session-preview {
  color: rgba(255, 255, 255, 0.8);
}

.session-time {
  font-size: 0.75rem;
  color: #999;
}

.session-item.active .session-time {
  color: rgba(255, 255, 255, 0.6);
}

.delete-btn {
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.3s ease;
  opacity: 0;
}

.session-item:hover .delete-btn {
  opacity: 1;
}

.delete-btn:hover {
  background: #ff4757;
  color: white;
}

.session-item.active .delete-btn {
  color: rgba(255, 255, 255, 0.6);
}

.session-item.active .delete-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

/* 滚动条样式 */
.sessions-list::-webkit-scrollbar {
  width: 4px;
}

.sessions-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.sessions-list::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.sessions-list::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
