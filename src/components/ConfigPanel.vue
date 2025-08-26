<template>
  <div class="config-panel" :class="{ 'open': isOpen }">
    <div class="config-header" @click="togglePanel">
      <span class="config-icon">⚙️</span>
      <span class="config-title">配置设置</span>
      <span class="config-arrow" :class="{ 'rotated': isOpen }">▼</span>
    </div>
    
    <div class="config-content" v-show="isOpen">
      <div class="config-section">
        <h3>LM Studio 连接设置</h3>
        
        <div class="form-group">
          <label for="api-url">API 地址:</label>
          <input 
            id="api-url"
            v-model="config.apiUrl" 
            type="text" 
            placeholder="http://localhost:1234/v1"
            @change="updateConfig"
          />
        </div>
        
        <div class="form-group">
          <label for="timeout">超时时间 (秒):</label>
          <input 
            id="timeout"
            v-model.number="config.timeout" 
            type="number" 
            min="5" 
            max="120"
            @change="updateConfig"
          />
        </div>
        
        <div class="form-group">
          <label for="model">模型名称:</label>
          <input 
            id="model"
            v-model="config.model" 
            type="text" 
            placeholder="local-model"
            @change="updateConfig"
          />
        </div>
        
        <div class="form-group">
          <label for="temperature">温度 (创造性):</label>
          <input 
            id="temperature"
            v-model.number="config.temperature" 
            type="range" 
            min="0" 
            max="2" 
            step="0.1"
            @input="updateConfig"
          />
          <span class="range-value">{{ config.temperature }}</span>
        </div>
        
        <div class="form-group">
          <label for="max-tokens">最大令牌数:</label>
          <input 
            id="max-tokens"
            v-model.number="config.maxTokens" 
            type="number" 
            min="100" 
            max="4000"
            @change="updateConfig"
          />
        </div>
      </div>
      
      <div class="config-section">
        <h3>系统提示词</h3>
        <div class="form-group">
          <label for="system-prompt">自定义系统提示词:</label>
          <textarea 
            id="system-prompt"
            v-model="config.systemPrompt" 
            rows="4"
            placeholder="你是一个友好的AI助手，请用中文回答用户的问题。"
            @change="updateConfig"
          ></textarea>
        </div>
      </div>
      
      <div class="config-section">
        <h3>连接测试</h3>
        <div class="test-buttons">
          <button @click="testConnection" :disabled="testing">
            {{ testing ? '测试中...' : '测试连接' }}
          </button>
          <button @click="getModels" :disabled="loadingModels">
            {{ loadingModels ? '加载中...' : '获取模型列表' }}
          </button>
        </div>
        
        <div v-if="testResult" class="test-result" :class="testResult.success ? 'success' : 'error'">
          {{ testResult.message }}
        </div>
        
        <div v-if="models.length > 0" class="models-list">
          <h4>可用模型:</h4>
          <ul>
            <li v-for="model in models" :key="model.id">
              {{ model.id }} ({{ model.object }})
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import lmStudioAPI from '../services/lmStudioApi.js'

export default {
  name: 'ConfigPanel',
  emits: ['config-updated'],
  setup(props, { emit }) {
    const isOpen = ref(false)
    const testing = ref(false)
    const loadingModels = ref(false)
    const testResult = ref(null)
    const models = ref([])
    
    // 默认配置
    const config = reactive({
      apiUrl: 'http://localhost:1234/v1',
      timeout: 30,
      model: 'local-model',
      temperature: 0.7,
      maxTokens: 1000,
      systemPrompt: '你是一个友好的AI助手，请用中文回答用户的问题。'
    })
    
    // 切换面板显示
    const togglePanel = () => {
      isOpen.value = !isOpen.value
    }
    
    // 更新配置
    const updateConfig = () => {
      // 更新 API 服务配置
      lmStudioAPI.setBaseURL(config.apiUrl)
      lmStudioAPI.setTimeout(config.timeout * 1000)
      
      // 通知父组件配置已更新
      emit('config-updated', { ...config })
      
      // 保存到本地存储
      localStorage.setItem('lmStudioConfig', JSON.stringify(config))
    }
    
    // 测试连接
    const testConnection = async () => {
      testing.value = true
      testResult.value = null
      
      try {
        const result = await lmStudioAPI.checkConnection()
        if (result.connected) {
          testResult.value = {
            success: true,
            message: '✅ 连接成功！LM Studio 服务正常运行。'
          }
        } else {
          testResult.value = {
            success: false,
            message: `❌ 连接失败: ${result.error}`
          }
        }
      } catch (error) {
        testResult.value = {
          success: false,
          message: `❌ 测试失败: ${error.message}`
        }
      } finally {
        testing.value = false
      }
    }
    
    // 获取模型列表
    const getModels = async () => {
      loadingModels.value = true
      models.value = []
      
      try {
        const result = await lmStudioAPI.getModels()
        if (result.success) {
          models.value = result.models
          testResult.value = {
            success: true,
            message: `✅ 成功获取 ${result.models.length} 个模型`
          }
        } else {
          testResult.value = {
            success: false,
            message: `❌ 获取模型失败: ${result.error}`
          }
        }
      } catch (error) {
        testResult.value = {
          success: false,
          message: `❌ 获取模型失败: ${error.message}`
        }
      } finally {
        loadingModels.value = false
      }
    }
    
    // 加载保存的配置
    const loadSavedConfig = () => {
      const saved = localStorage.getItem('lmStudioConfig')
      if (saved) {
        try {
          const savedConfig = JSON.parse(saved)
          Object.assign(config, savedConfig)
          
          // 只更新API服务配置，不触发父组件更新
          lmStudioAPI.setBaseURL(config.apiUrl)
          lmStudioAPI.setTimeout(config.timeout * 1000)
        } catch (error) {
          console.error('加载配置失败:', error)
        }
      }
    }
    
    onMounted(() => {
      loadSavedConfig()
    })
    
    return {
      isOpen,
      config,
      testing,
      loadingModels,
      testResult,
      models,
      togglePanel,
      updateConfig,
      testConnection,
      getModels
    }
  }
}
</script>

<style scoped>
.config-panel {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin: 10px;
  overflow: hidden;
}

.config-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 15px 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: background 0.3s ease;
}

.config-header:hover {
  background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
}

.config-icon {
  font-size: 1.2rem;
}

.config-title {
  flex: 1;
  font-weight: 600;
}

.config-arrow {
  transition: transform 0.3s ease;
}

.config-arrow.rotated {
  transform: rotate(180deg);
}

.config-content {
  padding: 20px;
}

.config-section {
  margin-bottom: 25px;
}

.config-section h3 {
  color: #333;
  margin-bottom: 15px;
  font-size: 1.1rem;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 8px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  color: #555;
  font-weight: 500;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
}

.form-group input[type="range"] {
  width: calc(100% - 50px);
  margin-right: 10px;
}

.range-value {
  display: inline-block;
  width: 40px;
  text-align: center;
  font-weight: 600;
  color: #667eea;
}

.test-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.test-buttons button {
  flex: 1;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  background: #667eea;
  color: white;
  cursor: pointer;
  transition: background 0.3s ease;
}

.test-buttons button:hover:not(:disabled) {
  background: #5a6fd8;
}

.test-buttons button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.test-result {
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 15px;
  font-weight: 500;
}

.test-result.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.test-result.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.models-list {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 5px;
}

.models-list h4 {
  margin-bottom: 10px;
  color: #333;
}

.models-list ul {
  list-style: none;
  padding: 0;
}

.models-list li {
  padding: 5px 0;
  border-bottom: 1px solid #e9ecef;
  color: #666;
}

.models-list li:last-child {
  border-bottom: none;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .config-panel {
    margin: 5px;
  }
  
  .config-content {
    padding: 15px;
  }
  
  .test-buttons {
    flex-direction: column;
  }
}
</style>
