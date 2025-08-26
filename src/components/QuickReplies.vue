<template>
  <div class="quick-replies">
    <div class="quick-header">
      <span class="quick-icon">💡</span>
      <span class="quick-title">快捷问题</span>
    </div>
    
    <!-- 分类标签 -->
    <div class="category-tabs">
      <div 
        v-for="category in questionCategories" 
        :key="category.id"
        :class="['category-tab', { active: activeCategory === category.id }]"
        @click="activeCategory = category.id"
      >
        {{ category.name }}
      </div>
    </div>
    
    <!-- 快捷回复按钮 -->
    <div class="quick-buttons">
      <button 
        v-for="reply in getCurrentQuickReplies()" 
        :key="reply.name"
        :class="['quick-btn', { highlighted: reply.isHighlight }]"
        @click="handleQuickReplyClick(reply)"
      >
        <span class="reply-icon">{{ reply.icon }}</span>
        {{ reply.name }}
      </button>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'

export default {
  name: 'QuickReplies',
  emits: ['quick-reply-click'],
  setup(props, { emit }) {
    const activeCategory = ref('general')
    
    // 问题分类
    const questionCategories = ref([
      { id: 'general', name: '通用' },
      { id: 'programming', name: '编程' },
      { id: 'writing', name: '写作' },
      { id: 'analysis', name: '分析' }
    ])
    
    // 快捷回复配置
    const quickRepliesConfig = reactive({
      general: [
        {
          name: '你好',
          icon: '👋',
          isHighlight: true
        },
        {
          name: '介绍一下你自己',
          icon: '🤖'
        },
        {
          name: '你能做什么',
          icon: '❓'
        },
        {
          name: '谢谢',
          icon: '🙏'
        }
      ],
      programming: [
        {
          name: '帮我写代码',
          icon: '💻',
          isHighlight: true
        },
        {
          name: '解释这段代码',
          icon: '🔍'
        },
        {
          name: '代码优化建议',
          icon: '⚡'
        },
        {
          name: '调试帮助',
          icon: '🐛'
        }
      ],
      writing: [
        {
          name: '帮我写文章',
          icon: '✍️',
          isHighlight: true
        },
        {
          name: '润色文本',
          icon: '✨'
        },
        {
          name: '翻译文本',
          icon: '🌐'
        },
        {
          name: '创意写作',
          icon: '🎨'
        }
      ],
      analysis: [
        {
          name: '数据分析',
          icon: '📊',
          isHighlight: true
        },
        {
          name: '市场分析',
          icon: '📈'
        },
        {
          name: '风险评估',
          icon: '⚠️'
        },
        {
          name: '趋势预测',
          icon: '🔮'
        }
      ]
    })
    
    // 获取当前分类的快捷回复
    const getCurrentQuickReplies = () => {
      return quickRepliesConfig[activeCategory.value] || []
    }
    
    // 处理快捷回复点击
    const handleQuickReplyClick = (reply) => {
      emit('quick-reply-click', reply)
    }
    
    return {
      activeCategory,
      questionCategories,
      getCurrentQuickReplies,
      handleQuickReplyClick
    }
  }
}
</script>

<style scoped>
.quick-replies {
  padding: 20px;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.quick-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 15px;
  font-weight: 600;
  color: #333;
}

.quick-icon {
  font-size: 1.2rem;
}

.quick-title {
  flex: 1;
}

.category-tabs {
  display: flex;
  gap: 2px;
  margin-bottom: 15px;
  background: #e9ecef;
  border-radius: 8px;
  padding: 2px;
}

.category-tab {
  flex: 1;
  padding: 8px 12px;
  text-align: center;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  font-weight: 500;
  color: #666;
  background: transparent;
}

.category-tab:hover {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
}

.category-tab.active {
  background: #667eea;
  color: white;
  box-shadow: 0 2px 4px rgba(102, 126, 234, 0.3);
}

.quick-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 10px;
}

.quick-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  background: white;
  color: #333;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  font-weight: 500;
  text-align: left;
}

.quick-btn:hover {
  border-color: #667eea;
  background: #f8f9ff;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.15);
}

.quick-btn.highlighted {
  border-color: #667eea;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.quick-btn.highlighted:hover {
  background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.reply-icon {
  font-size: 1.1rem;
  flex-shrink: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .quick-replies {
    padding: 15px;
  }
  
  .category-tabs {
    margin-bottom: 12px;
  }
  
  .category-tab {
    padding: 6px 8px;
    font-size: 0.8rem;
  }
  
  .quick-buttons {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }
  
  .quick-btn {
    padding: 10px 12px;
    font-size: 0.85rem;
  }
}

@media (max-width: 480px) {
  .quick-buttons {
    grid-template-columns: 1fr;
  }
}
</style>
