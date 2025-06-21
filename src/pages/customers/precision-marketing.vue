<template>
  <div class="merchant-layout">
    <!-- 顶部导航栏 -->
    <div class="top-navbar">
      <div class="navbar-left">
        <div class="navbar-title">
          <span class="logo-icon">🍊</span>
          <span class="title-text">美团外卖 | 商家中心</span>
        </div>
      </div>
      <div class="navbar-right">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索商品、订单、客户"
          prefix-icon="Search"
          class="search-input"
          clearable
        />
        <div class="navbar-item">
          <el-badge :value="12" class="notification-badge">
            <el-icon size="20"><Bell /></el-icon>
          </el-badge>
          <span class="navbar-text">消息</span>
        </div>
        <div class="navbar-item">
          <el-icon size="20"><QuestionFilled /></el-icon>
          <span class="navbar-text">帮助</span>
        </div>
        <div class="navbar-item">
          <el-dropdown>
            <div class="user-info">
              <img src="https://via.placeholder.com/32x32/409EFF/FFFFFF?text=商" alt="用户头像" class="user-avatar" />
              <span class="user-name">商家账号</span>
              <el-icon><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>个人中心</el-dropdown-item>
                <el-dropdown-item>账户设置</el-dropdown-item>
                <el-dropdown-item divided>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="content-wrapper">
      <!-- 左侧导航菜单 -->
      <div class="sidebar">
        <div class="menu-list">
          <template v-for="item in menuItems" :key="item.id">
            <!-- 父级菜单 -->
            <div v-if="item.isParent" :class="['menu-item', 'parent-menu', { active: isParentActive(item) }]">
              <div class="menu-content" @click="toggleMenu(item.id)">
                <span class="menu-icon">{{ item.icon }}</span>
                <span class="menu-label">{{ item.label }}</span>
                <span v-if="item.count" class="menu-count">{{ item.count }}</span>
                <span v-if="item.badge" class="menu-badge">{{ item.badge }}</span>
                <el-icon class="expand-icon" :class="{ 'expanded': isMenuExpanded(item.id) }">
                  <ArrowRight />
                </el-icon>
              </div>
              <!-- 子级菜单容器 -->
              <div v-if="isMenuExpanded(item.id)" class="submenu-container">
                <div 
                  v-for="child in item.children" 
                  :key="child.id"
                  :class="['menu-item', 'child-menu', { active: isCurrentPage(child.path) }]"
                  @click="handleMenuClick(child.path)"
                >
                  <div class="menu-content">
                    <span class="menu-label">{{ child.label }}</span>
                    <span v-if="child.count" class="menu-count">{{ child.count }}</span>
                    <span v-if="child.badge" class="menu-badge">{{ child.badge }}</span>
                  </div>
                </div>
              </div>
            </div>
            <!-- 单级菜单 -->
            <div v-else :class="['menu-item', { active: isCurrentPage(item.path) }]" @click="handleMenuClick(item.path)">
              <div class="menu-content">
                <span class="menu-icon">{{ item.icon }}</span>
                <span class="menu-label">{{ item.label }}</span>
                <span v-if="item.count" class="menu-count">{{ item.count }}</span>
                <span v-if="item.badge" class="menu-badge">{{ item.badge }}</span>
              </div>
            </div>
          </template>
        </div>
      </div>

      <!-- 主内容区域 -->
      <div class="main-content">
        <!-- 页面头部 -->
        <div class="page-header">
          <div class="header-left">
            <h1 class="page-title">精准营销</h1>
          </div>
        </div>

        <!-- 营销类型选择 -->
        <div class="marketing-types">
          <!-- 人群营销 -->
          <div class="marketing-section">
            <div class="section-header">
              <div class="section-icon">👥</div>
              <div class="section-info">
                <h2 class="section-title">人群营销</h2>
                <p class="section-desc">基于用户画像和行为数据，精准定位目标客户群体</p>
              </div>
              <el-button type="primary" @click="createAudienceMarketing">
                立即投放
              </el-button>
            </div>
            
            <div class="audience-grid">
              <div v-for="audience in audienceTypes" :key="audience.id" class="audience-card" @click="selectAudience(audience)">
                <div class="audience-icon">{{ audience.icon }}</div>
                <div class="audience-content">
                  <h3 class="audience-title">{{ audience.title }}</h3>
                  <p class="audience-desc">{{ audience.description }}</p>
                  <div class="audience-stats">
                    <span class="stat-item">预估人数: {{ audience.estimatedCount }}人</span>
                  </div>
                </div>
                <div class="audience-action">
                  <el-button size="small" type="primary" plain>立即投放</el-button>
                </div>
              </div>
            </div>
          </div>

          <!-- 营销场景 -->
          <div class="marketing-section">
            <div class="section-header">
              <div class="section-icon">🎯</div>
              <div class="section-info">
                <h2 class="section-title">营销场景</h2>
                <p class="section-desc">针对不同业务场景，提供专业的营销解决方案</p>
              </div>
              <el-button type="primary" @click="createScenarioMarketing">
                立即投放
              </el-button>
            </div>
            
            <div class="scenario-grid">
              <div v-for="scenario in scenarioTypes" :key="scenario.id" class="scenario-card" @click="selectScenario(scenario)">
                <div class="scenario-icon">{{ scenario.icon }}</div>
                <div class="scenario-content">
                  <h3 class="scenario-title">{{ scenario.title }}</h3>
                  <p class="scenario-desc">{{ scenario.description }}</p>
                  <div class="scenario-features">
                    <span v-for="feature in scenario.features" :key="feature" class="feature-tag">{{ feature }}</span>
                  </div>
                </div>
                <div class="scenario-action">
                  <el-button size="small" type="primary" plain>立即投放</el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Bell, QuestionFilled, ArrowDown, Search, ArrowRight } from '@element-plus/icons-vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'

// 路由
const router = useRouter()
const route = useRoute()

// 搜索关键词
const searchKeyword = ref('')

// 人群营销数据
const audienceTypes = ref([
  {
    id: 1,
    icon: '🔥',
    title: '高消费熟客',
    description: '最近3个月消费金额超过1000元的老客户',
    estimatedCount: 1234
  },
  {
    id: 2,
    icon: '⭐',
    title: '高点评熟客',
    description: '给出5星好评且复购率高的优质客户',
    estimatedCount: 856
  },
  {
    id: 3,
    icon: '🎯',
    title: '商圈点餐熟客',
    description: '经常在商圈范围内点餐的常客',
    estimatedCount: 2341
  },
  {
    id: 4,
    icon: '🍽️',
    title: '商圈点餐新客',
    description: '在商圈范围内的新用户群体',
    estimatedCount: 1567
  },
  {
    id: 5,
    icon: '💤',
    title: '低消费熟客',
    description: '消费频次较低但有复购潜力的客户',
    estimatedCount: 987
  },
  {
    id: 6,
    icon: '🔄',
    title: '一般发展熟客',
    description: '消费行为稳定的普通老客户',
    estimatedCount: 3456
  },
  {
    id: 7,
    icon: '😴',
    title: '昨日未下单新客',
    description: '注册后尚未完成首单的新用户',
    estimatedCount: 789
  },
  {
    id: 8,
    icon: '😞',
    title: '不评价熟客',
    description: '下单但很少给出评价的客户群体',
    estimatedCount: 654
  }
])

// 营销场景数据
const scenarioTypes = ref([
  {
    id: 1,
    icon: '🎁',
    title: '勤丝顾客',
    description: '针对高频消费客户的专属优惠活动',
    features: ['专属折扣', '积分翻倍', '优先配送']
  },
  {
    id: 2,
    icon: '🌟',
    title: '昨日未下单新客',
    description: '激活新注册用户的首单转化',
    features: ['新人专享', '首单立减', '免配送费']
  },
  {
    id: 3,
    icon: '🎯',
    title: '好评顾客',
    description: '奖励给出好评的优质客户',
    features: ['好评返现', '专属优惠券', '会员升级']
  },
  {
    id: 4,
    icon: '💝',
    title: '不评价顾客',
    description: '鼓励客户参与评价的激励活动',
    features: ['评价有礼', '积分奖励', '专属福利']
  },
  {
    id: 5,
    icon: '🔄',
    title: '差评顾客',
    description: '挽回差评客户的服务补偿方案',
    features: ['服务补偿', '专人跟进', '品质保证']
  },
  {
    id: 6,
    icon: '🎪',
    title: '不评价顾客',
    description: '提升客户评价参与度的营销策略',
    features: ['评价奖励', '互动游戏', '社交分享']
  }
])

// 左侧菜单数据
const menuItems = ref([
  {
    id: 'home',
    icon: '📊',
    label: '商家首页',
    path: '/home'
  },
  {
    id: 'orders',
    icon: '📋',
    label: '订单管理',
    count: 12,
    isParent: true,
    children: [
      {
        id: 'pending',
        icon: '⏰',
        label: '待处理',
        count: 3,
        path: '/orders/pending'
      },
      {
        id: 'history',
        icon: '📜',
        label: '历史订单',
        path: '/orders/history'
      }
    ]
  },
  {
    id: 'products',
    icon: '🏪',
    label: '商品管理',
    count: 1,
    isParent: true,
    children: [
      {
        id: 'product-list',
        icon: '📦',
        label: '商品列表',
        path: '/products/list'
      },
      {
        id: 'product-helper',
        icon: '🛠️',
        label: '商品助手',
        count: 1,
        path: '/products/helper'
      },
      {
        id: 'spec-management',
        icon: '🔧',
        label: '规格管理',
        path: '/products/spec'
      }
    ]
  },
  {
    id: 'customers',
    icon: '👥',
    label: '顾客管理',
    badge: '新',
    isParent: true,
    children: [
      {
        id: 'customer-analysis',
        icon: '📊',
        label: '顾客分析',
        path: '/customers/analysis'
      },
      {
        id: 'customer-profile',
        icon: '👤',
        label: '顾客画像',
        path: '/customers/profile'
      },
      {
        id: 'precision-marketing',
        icon: '🎯',
        label: '精准营销',
        path: '/customers/precision-marketing'
      },
      {
        id: 'customer-reviews',
        icon: '💬',
        label: '顾客评价',
        path: '/customers/reviews'
      }
    ]
  },
  {
    id: 'finance',
    icon: '💰',
    label: '财务管理',
    path: '/finance'
  },
  {
    id: 'analytics',
    icon: '📊',
    label: '经营分析',
    path: '/analytics'
  },
  {
    id: 'marketing',
    icon: '📢',
    label: '门店推广',
    path: '/marketing'
  },
  {
    id: 'activities',
    icon: '🎯',
    label: '活动中心',
    badge: '新',
    path: '/activities'
  },
  {
    id: 'settings',
    icon: '⚙️',
    label: '向左收起',
    path: '/settings'
  }
])

// 菜单折叠状态
const menuCollapsed = ref({
  customers: true // 默认展开顾客管理菜单
})

// 方法
const toggleMenu = (menuId) => {
  menuCollapsed.value[menuId] = !menuCollapsed.value[menuId]
}

const isMenuExpanded = (menuId) => {
  return menuCollapsed.value[menuId]
}

const isCurrentPage = (path) => {
  return route.path === path
}

const isParentActive = (item) => {
  if (!item.children) return false
  return item.children.some(child => isCurrentPage(child.path))
}

const handleMenuClick = (path) => {
  if (path) {
    router.push(path)
  }
}

// 人群营销相关方法
const createAudienceMarketing = () => {
  ElMessage.info('创建人群营销活动功能开发中...')
}

const selectAudience = (audience) => {
  ElMessage.info(`选择人群: ${audience.title}`)
}

// 营销场景相关方法
const createScenarioMarketing = () => {
  ElMessage.info('创建营销场景活动功能开发中...')
}

const selectScenario = (scenario) => {
  ElMessage.info(`选择场景: ${scenario.title}`)
}

onMounted(() => {
  // 页面加载时的初始化逻辑
})
</script>

<style scoped>
/* 基础布局样式 */
.merchant-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;
}

/* 顶部导航栏样式 */
.top-navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 24px;
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  flex-shrink: 0;
  z-index: 1000;
}

.navbar-left {
  display: flex;
  align-items: center;
  flex: 1;
  max-width: 600px;
  gap: 20px;
}

.navbar-title {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.logo-icon {
  font-size: 24px;
  margin-right: 8px;
}

.title-text {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  white-space: nowrap;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.search-input {
  width: 280px;
  margin-right: 8px;
}

.search-input :deep(.el-input__wrapper) {
  border-radius: 20px;
  background: #f5f5f5;
  border: 1px solid #e8e8e8;
  transition: all 0.3s;
}

.search-input :deep(.el-input__wrapper:hover) {
  border-color: #FFB800;
  background: #fff;
}

.search-input :deep(.el-input__wrapper.is-focus) {
  border-color: #FFB800;
  background: #fff;
  box-shadow: 0 0 0 2px rgba(255, 184, 0, 0.1);
}

.navbar-item {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.3s;
  color: #666;
}

.navbar-item:hover {
  background: #f5f5f5;
  color: #FFB800;
}

.navbar-text {
  font-size: 14px;
  font-weight: 500;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 20px;
  background: #f8f9fa;
  transition: all 0.3s;
  cursor: pointer;
}

.user-info:hover {
  background: #e9ecef;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.user-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

/* 内容区域样式 */
.content-wrapper {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* 左侧边栏样式 */
.sidebar {
  width: 200px;
  background: white;
  color: #333;
  overflow-y: auto;
  flex-shrink: 0;
  border-right: 1px solid #e8e8e8;
}

.menu-list {
  padding: 16px 0;
}

.menu-item {
  margin: 0 12px 4px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  color: #333;
}

.menu-item:hover {
  background-color: #f5f7fa;
}

.menu-item.active {
  background-color: #e1f3ff;
  color: #409eff;
}

.menu-content {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  font-size: 14px;
  text-align: left;
  border-left: 3px solid transparent;
}

.menu-icon {
  font-size: 16px;
  margin-right: 12px;
  width: 16px;
  text-align: center;
}

.menu-label {
  flex: 1;
  text-align: left;
  color: #333;
  font-size: 14px;
}

.menu-count {
  background: #f56c6c;
  color: white;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 10px;
  margin-left: 8px;
}

.menu-badge {
  background: #67c23a;
  color: white;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 10px;
  margin-left: 8px;
}

.expand-icon {
  margin-left: auto;
  transition: transform 0.3s;
  font-size: 12px;
  color: #333;
}

.expand-icon.expanded {
  transform: rotate(90deg);
}

.submenu-container {
  background-color: #fafafa;
  border-left: 3px solid #e8e8e8;
  margin: 4px 0;
  border-radius: 0 4px 4px 0;
}

.child-menu .menu-content {
  padding: 8px 16px 8px 44px;
  font-size: 13px;
  color: #333;
  border-left: 3px solid transparent;
  text-align: left;
}

.child-menu .menu-label {
  text-align: left;
  color: #333;
  font-size: 13px;
}

.child-menu:hover .menu-content {
  background-color: #f0f0f0;
  color: #1890ff;
}

.child-menu.active .menu-content {
  background-color: #e6f7ff;
  color: #1890ff;
  border-left-color: #1890ff;
}

.menu-item:hover .menu-content {
  background-color: #f5f7fa;
  color: #1890ff;
}

.menu-item.active .menu-content {
  background-color: #e6f7ff;
  border-left-color: #1890ff;
  color: #1890ff;
}

/* 父级菜单样式 */
.parent-menu .menu-label {
  font-weight: 600;
  font-size: 14px;
  text-align: left;
  color: #333;
}

.parent-menu.active .menu-content {
  background-color: #e6f7ff;
  border-left-color: #1890ff;
  color: #1890ff;
}

/* 主内容区域样式 */
.main-content {
  flex: 1;
  padding: 0;
  background: #f5f5f5;
  overflow-y: auto;
}

/* 页面头部样式 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin: 20px 20px 24px 20px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 8px 0;
}

.page-description {
  font-size: 14px;
  color: #909399;
  margin: 0;
}

/* 概览卡片样式 */
.overview-section {
  margin: 0 20px 32px 20px;
}

.overview-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.overview-card {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 16px;
}

.card-icon {
  font-size: 32px;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f9ff;
  border-radius: 12px;
}

.card-content {
  flex: 1;
}

.card-title {
  font-size: 14px;
  color: #909399;
  margin-bottom: 8px;
}

.card-value {
  font-size: 28px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}

.card-trend {
  font-size: 12px;
}

.card-trend.positive {
  color: #67c23a;
}

.card-trend.negative {
  color: #f56c6c;
}

/* 营销类型样式 */
.marketing-types {
  padding: 0 20px;
}

.marketing-section {
  background: white;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f2f5;
}

.section-icon {
  font-size: 32px;
  margin-right: 16px;
}

.section-info {
  flex: 1;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 8px 0;
}

.section-desc {
  font-size: 14px;
  color: #606266;
  margin: 0;
  line-height: 1.5;
}

/* 人群营销样式 */
.audience-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.audience-card {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
}

.audience-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #409eff;
  transform: translateY(-2px);
}

.audience-icon {
  font-size: 24px;
  margin-right: 16px;
  flex-shrink: 0;
}

.audience-content {
  flex: 1;
  margin-right: 16px;
}

.audience-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 8px 0;
}

.audience-desc {
  font-size: 13px;
  color: #606266;
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.audience-stats {
  font-size: 12px;
  color: #909399;
}

.audience-action {
  flex-shrink: 0;
}

/* 营销场景样式 */
.scenario-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 16px;
}

.scenario-card {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: flex-start;
}

.scenario-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #409eff;
  transform: translateY(-2px);
}

.scenario-icon {
  font-size: 24px;
  margin-right: 16px;
  flex-shrink: 0;
  margin-top: 4px;
}

.scenario-content {
  flex: 1;
  margin-right: 16px;
}

.scenario-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 8px 0;
}

.scenario-desc {
  font-size: 13px;
  color: #606266;
  margin: 0 0 12px 0;
  line-height: 1.4;
}

.scenario-features {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.feature-tag {
  background: #f0f9ff;
  color: #409eff;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 10px;
  border: 1px solid #b3d8ff;
}

.scenario-action {
  flex-shrink: 0;
  margin-top: 4px;
}
</style>