<template>
  <div class="config-panel">
    <div class="config-header">
      <h3>⚙️ 配置设置</h3>
      <button @click="togglePanel" class="toggle-btn">
        {{ isExpanded ? '收起' : '展开' }}
      </button>
    </div>
    
    <div v-if="isExpanded" class="config-content">
      <!-- API类型选择 -->
      <div class="config-section">
        <h4>🔌 API类型</h4>
        <div class="api-selector">
          <label class="api-option">
            <input 
              type="radio" 
              v-model="selectedAPI" 
              value="lmstudio"
              @change="handleAPIChange"
            >
            <span class="api-label">
              本地LMStudio
            </span>
          </label>
          <label class="api-option">
            <input 
              type="radio" 
              v-model="selectedAPI" 
              value="dify"
              @change="handleAPIChange"
            >
            <span class="api-label">
              云端Dify
            </span>
          </label>
        </div>
      </div>

      <!-- LM Studio 配置 -->
      <div v-if="selectedAPI === 'lmstudio'" class="config-section">
        <h4>🏠 LM Studio 配置</h4>
        <div class="config-item">
          <label>API地址:</label>
          <input 
            v-model="lmstudioConfig.baseURL" 
            type="text" 
            placeholder="http://localhost:1234/v1"
            @blur="updateLMStudioConfig"
          >
        </div>
        <div class="config-item">
          <label>超时时间 (秒):</label>
          <input 
            v-model.number="lmstudioConfig.timeout" 
            type="number" 
            min="5000" 
            max="120000"
            @blur="updateLMStudioConfig"
          >
        </div>
      </div>

      <!-- Dify 配置 -->
      <div v-if="selectedAPI === 'dify'" class="config-section">
        <h4>☁️ Dify 配置</h4>
        <div class="config-item">
          <label>API地址:</label>
          <input 
            v-model="difyConfig.baseURL" 
            type="text" 
            placeholder="https://api.dify.ai/v1"
            @blur="updateDifyConfig"
          >
        </div>
        <div class="config-item">
          <label>API密钥:</label>
          <input 
            v-model="difyConfig.apiKey" 
            type="password" 
            placeholder="输入您的Dify API密钥"
            @blur="updateDifyConfig"
          >
        </div>
        <div class="config-item">
          <label>应用ID:</label>
          <input 
            v-model="difyConfig.appId" 
            type="text" 
            placeholder="输入您的Dify应用ID"
            @blur="updateDifyConfig"
          >
        </div>
        <div class="config-item">
          <label>超时时间 (秒):</label>
          <input 
            v-model.number="difyConfig.timeout" 
            type="number" 
            min="5000" 
            max="120000"
            @blur="updateDifyConfig"
          >
        </div>
        
        <!-- Dify应用选择 -->
        <div v-if="difyApps.length > 0" class="config-item">
          <label>选择应用:</label>
          <select v-model="selectedAppId" @change="handleAppChange">
            <option value="">请选择应用</option>
            <option 
              v-for="app in difyApps" 
              :key="app.id" 
              :value="app.id"
            >
              {{ app.name }} ({{ app.mode }})
            </option>
          </select>
        </div>
        
        <button @click="loadDifyApps" class="load-apps-btn">
          🔄 加载应用列表
        </button>
      </div>

      <!-- AI参数配置 -->
      <div class="config-section">
        <h4>🤖 AI参数</h4>
        <div class="config-item">
          <label>模型/应用:</label>
          <input 
            v-model="aiConfig.model" 
            type="text" 
            :placeholder="selectedAPI === 'lmstudio' ? 'local-model' : '应用ID'"
            @blur="updateAIConfig"
          >
        </div>
        <div class="config-item">
          <label>温度 (Temperature):</label>
          <input 
            v-model.number="aiConfig.temperature" 
            type="range" 
            min="0" 
            max="2" 
            step="0.1"
            @input="updateAIConfig"
          >
          <span class="value-display">{{ aiConfig.temperature }}</span>
        </div>
        <div class="config-item">
          <label>最大令牌数:</label>
          <input 
            v-model.number="aiConfig.maxTokens" 
            type="number" 
            min="100" 
            max="4000"
            @blur="updateAIConfig"
          >
        </div>
        <div class="config-item">
          <label>系统提示词:</label>
          <textarea 
            v-model="aiConfig.systemPrompt" 
            rows="3"
            placeholder="设置AI助手的角色和行为..."
            @blur="updateAIConfig"
          ></textarea>
        </div>
      </div>

      <!-- 连接状态 -->
      <div class="config-section">
        <h4>📡 连接状态</h4>
        <div class="connection-status">
          <span :class="['status-dot', { 'connected': isConnected }]"></span>
          <span class="status-text">
            {{ isConnected ? `${selectedAPI.toUpperCase()} 已连接` : `${selectedAPI.toUpperCase()} 未连接` }}
          </span>
        </div>
        <button @click="checkConnection" class="check-connection-btn">
          🔍 检查连接
        </button>
      </div>

      <!-- 操作按钮 -->
      <div class="config-actions">
        <button @click="saveConfig" class="save-btn">
          💾 保存配置
        </button>
        <button @click="resetConfig" class="reset-btn">
          🔄 重置配置
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted, watch } from 'vue'
import apiManager from '../services/apiManager.js'

export default {
  name: 'ConfigPanel',
  emits: ['config-updated'],
  setup(props, { emit }) {
    // 响应式数据
    const isExpanded = ref(false)
    const selectedAPI = ref('lmstudio')
    const isConnected = ref(false)
    const difyApps = ref([])
    const selectedAppId = ref('')

    // LM Studio配置
    const lmstudioConfig = reactive({
      baseURL: 'http://localhost:1234/v1',
      timeout: 30000
    })

    // Dify配置
    const difyConfig = reactive({
      baseURL: 'https://api.dify.ai/v1',
      timeout: 30000,
      apiKey: '',
      appId: ''
    })

    // AI参数配置
    const aiConfig = reactive({
      model: 'local-model',
      temperature: 0.7,
      maxTokens: 1000,
      systemPrompt: '你是一个友好的AI助手，请用中文回答用户的问题。'
    })

    // 切换面板展开状态
    const togglePanel = () => {
      isExpanded.value = !isExpanded.value
    }

    // 处理API类型切换
    const handleAPIChange = () => {
      apiManager.switchAPI(selectedAPI.value)
      checkConnection()
      emit('config-updated', {
        apiType: selectedAPI.value,
        config: getCurrentConfig()
      })
    }

    // 更新LM Studio配置
    const updateLMStudioConfig = () => {
      apiManager.setConfig('lmstudio', lmstudioConfig)
      apiManager.applyConfig('lmstudio')
      apiManager.saveConfig()
    }

    // 更新Dify配置
    const updateDifyConfig = () => {
      apiManager.setConfig('dify', difyConfig)
      apiManager.applyConfig('dify')
      apiManager.saveConfig()
    }

    // 更新AI配置
    const updateAIConfig = () => {
      emit('config-updated', {
        apiType: selectedAPI.value,
        config: getCurrentConfig()
      })
    }

    // 获取当前配置
    const getCurrentConfig = () => {
      return {
        lmstudio: { ...lmstudioConfig },
        dify: { ...difyConfig },
        ai: { ...aiConfig }
      }
    }

    // 检查连接状态
    const checkConnection = async () => {
      try {
        const result = await apiManager.checkConnection()
        isConnected.value = result.connected
        
        if (result.connected) {
          console.log(`✅ ${selectedAPI.value.toUpperCase()} 连接成功`)
        } else {
          console.error(`❌ ${selectedAPI.value.toUpperCase()} 连接失败:`, result.error)
        }
      } catch (error) {
        isConnected.value = false
        console.error('连接检查失败:', error)
      }
    }

    // 加载Dify应用列表
    const loadDifyApps = async () => {
      try {
        const result = await apiManager.getModels()
        if (result.success) {
          difyApps.value = result.apps || []
          console.log('✅ 已加载Dify应用列表')
        } else {
          console.error('❌ 加载应用列表失败:', result.error)
        }
      } catch (error) {
        console.error('加载应用列表失败:', error)
      }
    }

    // 处理应用选择
    const handleAppChange = () => {
      if (selectedAppId.value) {
        difyConfig.appId = selectedAppId.value
        updateDifyConfig()
      }
    }

    // 保存配置
    const saveConfig = () => {
      apiManager.saveConfig()
      localStorage.setItem('aiConfig', JSON.stringify(aiConfig))
      console.log('✅ 配置已保存')
    }

    // 重置配置
    const resetConfig = () => {
      if (confirm('确定要重置所有配置吗？')) {
        // 重置API配置
        apiManager.setConfig('lmstudio', {
          baseURL: 'http://localhost:1234/v1',
          timeout: 30000
        })
        apiManager.setConfig('dify', {
          baseURL: 'https://api.dify.ai/v1',
          timeout: 30000,
          apiKey: '',
          appId: ''
        })
        
        // 重置AI配置
        Object.assign(aiConfig, {
          model: 'local-model',
          temperature: 0.7,
          maxTokens: 1000,
          systemPrompt: '你是一个友好的AI助手，请用中文回答用户的问题。'
        })
        
        // 重新加载配置
        loadConfig()
        console.log('✅ 配置已重置')
      }
    }

    // 加载配置
    const loadConfig = () => {
      // 加载API配置
      const apiInfo = apiManager.getAPIInfo()
      selectedAPI.value = apiInfo.currentAPI
      
      if (apiInfo.config) {
        if (selectedAPI.value === 'lmstudio') {
          Object.assign(lmstudioConfig, apiInfo.config)
        } else if (selectedAPI.value === 'dify') {
          Object.assign(difyConfig, apiInfo.config)
        }
      }
      
      // 加载AI配置
      const savedAIConfig = localStorage.getItem('aiConfig')
      if (savedAIConfig) {
        try {
          Object.assign(aiConfig, JSON.parse(savedAIConfig))
        } catch (error) {
          console.error('加载AI配置失败:', error)
        }
      }
    }

    // 监听API类型变化
    watch(selectedAPI, (newAPI) => {
      if (newAPI === 'dify' && difyConfig.apiKey) {
        loadDifyApps()
      }
    })

    // 组件挂载时初始化
    onMounted(() => {
      loadConfig()
      checkConnection()
    })

    return {
      isExpanded,
      selectedAPI,
      isConnected,
      difyApps,
      selectedAppId,
      lmstudioConfig,
      difyConfig,
      aiConfig,
      togglePanel,
      handleAPIChange,
      updateLMStudioConfig,
      updateDifyConfig,
      updateAIConfig,
      checkConnection,
      loadDifyApps,
      handleAppChange,
      saveConfig,
      resetConfig
    }
  }
}
</script>

<style scoped>
.config-panel {
  background: #f8f9fa;
  border-radius: 8px;
  margin: 10px;
  overflow: hidden;
}

.config-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: #e9ecef;
  border-bottom: 1px solid #dee2e6;
}

.config-header h3 {
  margin: 0;
  font-size: 16px;
  color: #495057;
}

.toggle-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 5px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.toggle-btn:hover {
  background: #0056b3;
}

.config-content {
  padding: 20px;
}

.config-section {
  margin-bottom: 25px;
}

.config-section h4 {
  margin: 0 0 15px 0;
  font-size: 14px;
  color: #495057;
  border-bottom: 1px solid #dee2e6;
  padding-bottom: 5px;
}

.api-selector {
  display: flex;
  gap: 15px;
}

.api-option {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 10px;
  border: 2px solid #dee2e6;
  border-radius: 6px;
  flex: 1;
  transition: all 0.3s ease;
}

.api-option:hover {
  border-color: #007bff;
}

.api-option input[type="radio"] {
  margin-right: 8px;
}

.api-option input[type="radio"]:checked + .api-label {
  color: #007bff;
  font-weight: bold;
}

.api-label {
  display: flex;
  align-items: center;
  gap: 5px;
}

.api-icon {
  font-size: 16px;
}

.config-item {
  margin-bottom: 15px;
}

.config-item label {
  display: block;
  margin-bottom: 5px;
  font-size: 12px;
  color: #6c757d;
  font-weight: 500;
}

.config-item input[type="text"],
.config-item input[type="password"],
.config-item input[type="number"],
.config-item select,
.config-item textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

.config-item input[type="range"] {
  width: calc(100% - 50px);
  margin-right: 10px;
}

.value-display {
  font-size: 12px;
  color: #6c757d;
  min-width: 30px;
  display: inline-block;
}

.connection-status {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #dc3545;
}

.status-dot.connected {
  background: #28a745;
}

.status-text {
  font-size: 14px;
  color: #495057;
}

.check-connection-btn,
.load-apps-btn {
  background: #6c757d;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  margin-right: 10px;
}

.check-connection-btn:hover,
.load-apps-btn:hover {
  background: #545b62;
}

.config-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #dee2e6;
}

.save-btn,
.reset-btn {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}

.save-btn {
  background: #28a745;
  color: white;
}

.save-btn:hover {
  background: #218838;
}

.reset-btn {
  background: #dc3545;
  color: white;
}

.reset-btn:hover {
  background: #c82333;
}
</style>

