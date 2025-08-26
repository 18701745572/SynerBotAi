<template>
  <div class="user-input">
    <div class="input-container">
      <textarea 
        v-model="inputMessage"
        @keydown.enter.prevent="handleEnterPress"
        @keydown.ctrl.enter="handleCtrlEnter"
        @input="handleInput"
        placeholder="请输入您的问题..."
        class="message-input"
        rows="1"
        ref="messageInput"
        :disabled="loading"
      ></textarea>
      
      <div class="input-actions">
        <button 
          @click="handleSendMessage"
          :disabled="!inputMessage.trim() || loading"
          class="send-btn"
          :class="{ loading: loading }"
        >
          <span v-if="!loading" class="send-icon">📤</span>
          <span v-else class="loading-spinner"></span>
        </button>
      </div>
    </div>
    
    <div class="input-tips">
      <span class="tip-text">按 Enter 发送，Ctrl+Enter 换行</span>
      <span v-if="inputMessage.length > 0" class="char-count">
        {{ inputMessage.length }}/2000
      </span>
    </div>
    
    <!-- 输入建议 -->
    <div v-if="showSuggestions && suggestions.length > 0" class="input-suggestions">
      <div 
        v-for="suggestion in suggestions" 
        :key="suggestion"
        class="suggestion-item"
        @click="selectSuggestion(suggestion)"
      >
        {{ suggestion }}
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, nextTick } from 'vue'

export default {
  name: 'UserInput',
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: '请输入您的问题...'
    }
  },
  emits: ['send'],
  setup(props, { emit }) {
    const inputMessage = ref('')
    const messageInput = ref(null)
    const showSuggestions = ref(false)
    
    // 输入建议
    const suggestions = ref([
      '请帮我解释一下这个概念',
      '你能帮我写一段代码吗？',
      '请分析一下这个问题',
      '帮我总结一下要点'
    ])
    
    // 处理输入
    const handleInput = () => {
      // 自动调整高度
      nextTick(() => {
        if (messageInput.value) {
          messageInput.value.style.height = 'auto'
          messageInput.value.style.height = messageInput.value.scrollHeight + 'px'
        }
      })
      
      // 显示建议
      showSuggestions.value = inputMessage.value.length > 0 && inputMessage.value.length < 10
    }
    
    // 处理回车键
    const handleEnterPress = () => {
      if (!props.loading && inputMessage.value.trim()) {
        handleSendMessage()
      }
    }
    
    // 处理 Ctrl+Enter
    const handleCtrlEnter = () => {
      inputMessage.value += '\n'
    }
    
    // 发送消息
    const handleSendMessage = () => {
      if (inputMessage.value.trim() && !props.loading) {
        emit('send', inputMessage.value.trim())
        inputMessage.value = ''
        showSuggestions.value = false
        
        // 重置输入框高度
        nextTick(() => {
          if (messageInput.value) {
            messageInput.value.style.height = 'auto'
          }
        })
      }
    }
    
    // 选择建议
    const selectSuggestion = (suggestion) => {
      inputMessage.value = suggestion
      showSuggestions.value = false
      messageInput.value?.focus()
    }
    
    // 监听加载状态变化
    watch(() => props.loading, (newLoading) => {
      if (!newLoading) {
        // 加载完成后聚焦输入框
        nextTick(() => {
          messageInput.value?.focus()
        })
      }
    })
    
    return {
      inputMessage,
      messageInput,
      showSuggestions,
      suggestions,
      handleInput,
      handleEnterPress,
      handleCtrlEnter,
      handleSendMessage,
      selectSuggestion
    }
  }
}
</script>

<style scoped>
.user-input {
  position: relative;
  padding: 20px;
  background: white;
  border-top: 1px solid #e9ecef;
}

.input-container {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 12px;
  transition: border-color 0.3s ease;
}

.input-container:focus-within {
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
}

.message-input {
  flex: 1;
  border: none;
  background: transparent;
  resize: none;
  outline: none;
  font-size: 0.95rem;
  line-height: 1.5;
  max-height: 120px;
  min-height: 20px;
  font-family: inherit;
}

.message-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.input-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.send-btn {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: #667eea;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.send-btn:hover:not(:disabled) {
  background: #5a6fd8;
  transform: scale(1.05);
}

.send-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}

.send-btn.loading {
  background: #667eea;
}

.send-icon {
  font-size: 1.1rem;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.input-tips {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  padding: 0 4px;
}

.tip-text {
  font-size: 0.8rem;
  color: #999;
}

.char-count {
  font-size: 0.8rem;
  color: #666;
  font-weight: 500;
}

.input-suggestions {
  position: absolute;
  bottom: 100%;
  left: 20px;
  right: 20px;
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
}

.suggestion-item {
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid #f8f9fa;
  transition: background 0.3s ease;
  font-size: 0.9rem;
  color: #333;
}

.suggestion-item:hover {
  background: #f8f9fa;
}

.suggestion-item:last-child {
  border-bottom: none;
}

/* 滚动条样式 */
.input-suggestions::-webkit-scrollbar {
  width: 4px;
}

.input-suggestions::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.input-suggestions::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.input-suggestions::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .user-input {
    padding: 15px;
  }
  
  .input-container {
    padding: 10px;
  }
  
  .message-input {
    font-size: 0.9rem;
  }
  
  .send-btn {
    width: 36px;
    height: 36px;
  }
  
  .input-tips {
    margin-top: 6px;
  }
  
  .tip-text {
    font-size: 0.75rem;
  }
  
  .char-count {
    font-size: 0.75rem;
  }
}
</style>
