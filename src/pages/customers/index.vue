<script setup>
import { ref, onMounted } from 'vue'
import { Bell, QuestionFilled, ArrowDown, Search, ArrowRight } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

// 路由
const router = useRouter()

// 搜索关键词
const searchKeyword = ref('')

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
        id: 'customer-list',
        icon: '📋',
        label: '顾客列表',
        path: '/customers/list'
      },
      {
        id: 'customer-tags',
        icon: '🏷️',
        label: '顾客标签',
        path: '/customers/tags'
      },
      {
        id: 'customer-profile',
        icon: '👥',
        label: '顾客画像',
        path: '/customers/profile'
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
const menuCollapsed = ref({})

// 菜单点击处理
const handleMenuClick = (path) => {
  if (path) {
    router.push(path)
  }
}

// 切换菜单折叠状态
const toggleMenu = (menuId) => {
  menuCollapsed.value[menuId] = !menuCollapsed.value[menuId]
}

// 判断菜单是否展开
const isMenuExpanded = (menuId) => {
  return menuCollapsed.value[menuId] || false
}

// 判断当前页面
const isCurrentPage = (path) => {
  return router.currentRoute.value.path === path
}

// 判断父菜单是否包含当前页面
const isParentActive = (menu) => {
  if (!menu.children) return false
  return menu.children.some(child => isCurrentPage(child.path))
}

onMounted(() => {
  // 初始化菜单状态 - 默认展开顾客管理
  menuItems.value.forEach(menu => {
    if (menu.isParent && (isParentActive(menu) || menu.id === 'customers')) {
      menuCollapsed.value[menu.id] = true
    }
  })
})
</script>

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
            <!-- 普通菜单项 -->
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
        <div class="page-header">
          <h1 class="page-title">顾客管理</h1>
          <p class="page-description">管理您的顾客信息，分析顾客行为，提升顾客满意度</p>
        </div>
        
        <div class="customer-overview">
          <div class="overview-cards">
            <div class="overview-card">
              <div class="card-icon">👥</div>
              <div class="card-content">
                <div class="card-title">总顾客数</div>
                <div class="card-value">1,234</div>
                <div class="card-trend">+12% 较上月</div>
              </div>
            </div>
            
            <div class="overview-card">
              <div class="card-icon">🔄</div>
              <div class="card-content">
                <div class="card-title">回头客率</div>
                <div class="card-value">68.5%</div>
                <div class="card-trend">+5.2% 较上月</div>
              </div>
            </div>
            
            <div class="overview-card">
              <div class="card-icon">💰</div>
              <div class="card-content">
                <div class="card-title">客单价</div>
                <div class="card-value">¥45.8</div>
                <div class="card-trend">+8.3% 较上月</div>
              </div>
            </div>
            
            <div class="overview-card">
              <div class="card-icon">⭐</div>
              <div class="card-content">
                <div class="card-title">顾客满意度</div>
                <div class="card-value">4.8</div>
                <div class="card-trend">+0.2 较上月</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="quick-actions">
          <h2 class="section-title">快捷操作</h2>
          <div class="action-grid">
            <div class="action-card" @click="handleMenuClick('/customers/analysis')">
              <div class="action-icon">📊</div>
              <div class="action-title">顾客分析</div>
              <div class="action-desc">查看详细的顾客数据分析</div>
            </div>
            
            <div class="action-card" @click="handleMenuClick('/customers/list')">
              <div class="action-icon">👤</div>
              <div class="action-title">顾客列表</div>
              <div class="action-desc">管理所有顾客信息</div>
            </div>
            
            <div class="action-card" @click="handleMenuClick('/customers/tags')">
              <div class="action-icon">🏷️</div>
              <div class="action-title">顾客标签</div>
              <div class="action-desc">设置和管理顾客标签</div>
            </div>
            
            <div class="action-card" @click="handleMenuClick('/customers/profile')">
              <div class="action-icon">👥</div>
              <div class="action-title">顾客画像</div>
              <div class="action-desc">分析顾客特征和行为偏好</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 基础布局 */
.merchant-layout {
  min-height: 100vh;
  background-color: #f5f5f5;
}

/* 顶部导航栏 */
.top-navbar {
  height: 60px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  border-bottom: 1px solid #e8e8e8;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 1000;
}

.navbar-left {
  display: flex;
  align-items: center;
}

.navbar-title {
  display: flex;
  align-items: center;
  color: #333;
  font-weight: 600;
  font-size: 18px;
}

.logo-icon {
  font-size: 24px;
  margin-right: 12px;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 24px;
}

.search-input {
  width: 300px;
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
  flex-direction: column;
  align-items: center;
  color: #666;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.2s;
}

.navbar-item:hover {
  color: #FFB800;
  background-color: #f5f5f5;
}

.navbar-text {
  font-size: 12px;
  margin-top: 2px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
  cursor: pointer;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.user-name {
  font-size: 14px;
  font-weight: 500;
}

/* 内容区域 */
.content-wrapper {
  display: flex;
  min-height: calc(100vh - 60px);
}

/* 左侧边栏 */
.sidebar {
  width: 240px;
  background: white;
  border-right: 1px solid #e8e8e8;
  overflow-y: auto;
}

.menu-list {
  display: flex;
  flex-direction: column;
  padding: 10px 0;
}

.menu-item {
  cursor: pointer;
  transition: all 0.3s;
  color: #333;
}

.menu-content {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-left: 3px solid transparent;
  text-align: left;
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
}

.parent-menu.active .menu-content {
  background-color: #e6f7ff;
  border-left-color: #1890ff;
  color: #1890ff;
}

/* 子级菜单容器 */
.submenu-container {
  background-color: #fafafa;
  border-left: 3px solid #e8e8e8;
}

/* 子级菜单样式 */
.child-menu .menu-content {
  padding: 8px 16px 8px 44px;
  border-left: none;
  text-align: left;
}

.child-menu .menu-label {
  font-weight: normal;
  font-size: 13px;
  color: #666;
}

.child-menu:hover .menu-content {
  background-color: #f0f0f0;
  color: #1890ff;
}

.child-menu.active .menu-content {
  background-color: #e6f7ff;
  color: #1890ff;
  border-left: 3px solid #1890ff;
  margin-left: -3px;
}

/* 展开图标 */
.expand-icon {
  margin-left: auto;
  transition: transform 0.3s;
  font-size: 12px;
}

.expand-icon.expanded {
  transform: rotate(90deg);
}

.menu-icon {
  font-size: 16px;
  margin-right: 12px;
  width: 16px;
  text-align: center;
}

.menu-label {
  flex: 1;
  font-size: 14px;
  text-align: left;
}

.menu-count {
  background-color: #ff4d4f;
  color: white;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 10px;
  margin-left: 8px;
  min-width: 18px;
  text-align: center;
}

.menu-badge {
  background-color: #52c41a;
  color: white;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 10px;
  margin-left: 8px;
}

/* 主内容区域 */
.main-content {
  flex: 1;
  padding: 24px;
  background-color: #f5f5f5;
  overflow-y: auto;
}

.page-header {
  margin-bottom: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.page-description {
  color: #666;
  margin: 0;
  font-size: 14px;
}

.customer-overview {
  margin-bottom: 32px;
}

.overview-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.overview-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid #f0f0f0;
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
  background: linear-gradient(135deg, #FFB800, #FFA000);
  border-radius: 12px;
}

.card-content {
  flex: 1;
}

.card-title {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.card-value {
  font-size: 28px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.card-trend {
  font-size: 12px;
  color: #52c41a;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.action-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid #f0f0f0;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
}

.action-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border-color: #FFB800;
}

.action-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.action-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.action-desc {
  font-size: 14px;
  color: #666;
  line-height: 1.4;
}
</style>