<template>
  <div class="app-container">
    <!-- 顶部导航栏 -->
    <div class="navbar">
      <div class="navbar-left">
        <div class="logo">
          <span class="logo-icon">🍊</span>
          <span class="logo-text">美团外卖 | 商家中心</span>
        </div>
      </div>
      <div class="navbar-right">
        <div class="navbar-item">
          <el-icon><Bell /></el-icon>
          <span class="navbar-text">消息</span>
        </div>
        <div class="navbar-item">
          <el-icon><QuestionFilled /></el-icon>
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
          <h1 class="page-title">财务管理</h1>
          <p class="page-description">管理店铺财务数据，查看营收统计和结算信息</p>
        </div>
        
        <!-- 财务概览 -->
        <div class="finance-overview">
          <div class="overview-cards">
            <div class="overview-card">
              <div class="card-icon">💰</div>
              <div class="card-content">
                <div class="card-title">今日营收</div>
                <div class="card-value">¥12,580</div>
                <div class="card-trend">+8.5% 较昨日</div>
              </div>
            </div>
            
            <div class="overview-card">
              <div class="card-icon">📊</div>
              <div class="card-content">
                <div class="card-title">本月营收</div>
                <div class="card-value">¥356,420</div>
                <div class="card-trend">+12.3% 较上月</div>
              </div>
            </div>
            
            <div class="overview-card">
              <div class="card-icon">💳</div>
              <div class="card-content">
                <div class="card-title">待结算金额</div>
                <div class="card-value">¥45,680</div>
                <div class="card-trend">预计3日到账</div>
              </div>
            </div>
            
            <div class="overview-card">
              <div class="card-icon">📈</div>
              <div class="card-content">
                <div class="card-title">对账状态</div>
                <div class="card-value">正常</div>
                <div class="card-trend">最近更新：今日</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 快捷操作 -->
        <div class="quick-actions">
          <div class="section-header">
            <h3 class="section-title">快捷操作</h3>
          </div>
          
          <div class="action-cards">
            <div class="action-card" @click="handleMenuClick('/finance/reconciliation')">
              <div class="action-icon">🔍</div>
              <div class="action-content">
                <div class="action-title">对账首页</div>
                <div class="action-desc">查看对账详情和状态</div>
              </div>
              <el-icon class="action-arrow"><ArrowRight /></el-icon>
            </div>
            
            <div class="action-card" @click="handleMenuClick('/finance/revenue')">
              <div class="action-icon">📈</div>
              <div class="action-content">
                <div class="action-title">营收统计</div>
                <div class="action-desc">查看详细营收数据</div>
              </div>
              <el-icon class="action-arrow"><ArrowRight /></el-icon>
            </div>
            
            <div class="action-card" @click="handleMenuClick('/finance/settlement')">
              <div class="action-icon">💳</div>
              <div class="action-content">
                <div class="action-title">结算管理</div>
                <div class="action-desc">管理结算记录</div>
              </div>
              <el-icon class="action-arrow"><ArrowRight /></el-icon>
            </div>
          </div>
        </div>

        <!-- 最近交易 -->
        <div class="recent-transactions">
          <div class="section-header">
            <h3 class="section-title">最近交易</h3>
            <el-button type="text" @click="handleMenuClick('/finance/revenue')">查看全部</el-button>
          </div>
          
          <div class="transaction-list">
            <div v-for="transaction in recentTransactions" :key="transaction.id" class="transaction-item">
              <div class="transaction-info">
                <div class="transaction-type">{{ transaction.type }}</div>
                <div class="transaction-time">{{ transaction.time }}</div>
              </div>
              <div class="transaction-amount" :class="transaction.status">
                {{ transaction.amount }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Bell, QuestionFilled, ArrowDown, ArrowRight } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

// 展开的菜单项
const expandedMenus = ref<string[]>(['finance'])

// 菜单数据
const menuItems = ref([
  {
    id: 'home',
    icon: '🏠',
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
    isParent: true,
    children: [
      {
        id: 'reconciliation',
        icon: '🔍',
        label: '对账首页',
        path: '/finance/reconciliation'
      },
      {
        id: 'bill-reconciliation',
        icon: '📋',
        label: '账单对账',
        path: '/finance/bill-reconciliation'
      },
      {
        id: 'order-query',
        icon: '🔎',
        label: '订单查询',
        path: '/finance/order-query'
      },
      {
        id: 'account-management',
        icon: '🏦',
        label: '账户管理',
        path: '/finance/account-management'
      },
      {
        id: 'revenue',
        icon: '📈',
        label: '营收统计',
        path: '/finance/revenue'
      },
      {
        id: 'settlement',
        icon: '💳',
        label: '结算管理',
        path: '/finance/settlement'
      }
    ]
  },
  {
    id: 'analytics',
    icon: '📊',
    label: '经营分析',
    badge: '热',
    isParent: true,
    children: [
      {
        id: 'business-overview',
        icon: '📋',
        label: '经营概况',
        path: '/analytics/overview'
      },
      {
        id: 'sales-analysis',
        icon: '📈',
        label: '销售分析',
        path: '/analytics/sales'
      }
    ]
  },
  {
    id: 'promotion',
    icon: '📢',
    label: '门店推广',
    isParent: true,
    children: [
      {
        id: 'activities',
        icon: '🎉',
        label: '营销活动',
        path: '/promotion/activities'
      },
      {
        id: 'coupons',
        icon: '🎫',
        label: '优惠券',
        path: '/promotion/coupons'
      }
    ]
  }
])

// 最近交易数据
const recentTransactions = ref([
  {
    id: 1,
    type: '外卖订单收入',
    time: '2024-01-15 14:30',
    amount: '+¥128.50',
    status: 'income'
  },
  {
    id: 2,
    type: '平台服务费',
    time: '2024-01-15 14:25',
    amount: '-¥12.85',
    status: 'expense'
  },
  {
    id: 3,
    type: '外卖订单收入',
    time: '2024-01-15 14:15',
    amount: '+¥89.00',
    status: 'income'
  },
  {
    id: 4,
    type: '配送费收入',
    time: '2024-01-15 14:10',
    amount: '+¥6.00',
    status: 'income'
  },
  {
    id: 5,
    type: '外卖订单收入',
    time: '2024-01-15 13:55',
    amount: '+¥156.80',
    status: 'income'
  }
])

// 菜单展开/折叠
const toggleMenu = (menuId: string) => {
  const index = expandedMenus.value.indexOf(menuId)
  if (index > -1) {
    expandedMenus.value.splice(index, 1)
  } else {
    expandedMenus.value.push(menuId)
  }
}

// 判断菜单是否展开
const isMenuExpanded = (menuId: string) => {
  return expandedMenus.value.includes(menuId)
}

// 判断是否为当前页面
const isCurrentPage = (path: string) => {
  return route.path === path
}

// 判断父级菜单是否激活
const isParentActive = (item: any) => {
  return item.children?.some((child: any) => isCurrentPage(child.path))
}

// 菜单点击处理
const handleMenuClick = (path: string) => {
  router.push(path)
}

// 页面初始化
onMounted(() => {
  // 自动展开包含当前页面的菜单
  menuItems.value.forEach(item => {
    if (item.isParent && item.children) {
      const hasActivePage = item.children.some(child => isCurrentPage(child.path))
      if (hasActivePage && !expandedMenus.value.includes(item.id)) {
        expandedMenus.value.push(item.id)
      }
    }
  })
})
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  background-color: #f5f7fa;
}

/* 顶部导航栏样式 */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  z-index: 1000;
}

.navbar-left {
  display: flex;
  align-items: center;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 24px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-icon {
  font-size: 24px;
  margin-right: 8px;
}

.logo-text {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.navbar-item {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.navbar-item:hover {
  background: #e9ecef;
}

.navbar-text {
  font-size: 14px;
  font-weight: 500;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
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
  margin-top: 60px;
  min-height: calc(100vh - 60px);
}

/* 左侧边栏样式 */
.sidebar {
  width: 240px;
  background: #fff;
  border-right: 1px solid #e4e7ed;
  overflow-y: auto;
}

.menu-list {
  padding: 20px 0;
}

.menu-item {
  margin: 0 12px 4px;
  border-radius: 6px;
  overflow: hidden;
  transition: all 0.3s;
}

.menu-item:hover {
  background-color: #f5f7fa;
}

.menu-item.active {
  background-color: #fff2e8;
  border: 1px solid #ff6600;
}

.menu-item.active .menu-label {
  color: #ff6600;
  font-weight: 600;
}

.menu-content {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  position: relative;
}

.menu-icon {
  font-size: 16px;
  margin-right: 12px;
  width: 20px;
  text-align: center;
}

.menu-label {
  flex: 1;
  font-size: 14px;
  color: #333;
  transition: all 0.3s;
  text-align: left;
}

.menu-count {
  background: #ff6600;
  color: white;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 10px;
  margin-left: 8px;
  min-width: 18px;
  text-align: center;
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
  margin-left: 8px;
  transition: transform 0.3s;
  color: #999;
}

.expand-icon.expanded {
  transform: rotate(90deg);
}

.submenu-container {
  background-color: #f8f9fa;
  border-top: 1px solid #e9ecef;
}

.child-menu {
  margin: 0;
  border-radius: 0;
}

.child-menu .menu-content {
  padding-left: 48px;
  font-size: 13px;
}

.child-menu .menu-label {
  text-align: left;
}

.child-menu:hover {
  background-color: #e9ecef;
}

.child-menu.active {
  background-color: #fff2e8;
  border: none;
  border-left: 3px solid #ff6600;
}

/* 主内容区域样式 */
.main-content {
  flex: 1;
  padding: 24px;
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
  font-size: 14px;
  color: #666;
  margin: 0;
}

/* 财务概览样式 */
.finance-overview {
  margin-bottom: 24px;
}

.overview-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}

.overview-card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 16px;
  transition: transform 0.3s, box-shadow 0.3s;
}

.overview-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.card-icon {
  font-size: 32px;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ff6600, #ff8533);
  border-radius: 12px;
  color: white;
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
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.card-trend {
  font-size: 12px;
  color: #67c23a;
}

/* 快捷操作样式 */
.quick-actions {
  margin-bottom: 24px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.action-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.action-card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.action-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.action-icon {
  font-size: 24px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f9ff;
  border-radius: 8px;
  color: #ff6600;
}

.action-content {
  flex: 1;
}

.action-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.action-desc {
  font-size: 14px;
  color: #666;
}

.action-arrow {
  color: #999;
  font-size: 16px;
}

/* 最近交易样式 */
.recent-transactions {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.transaction-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.transaction-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.transaction-item:last-child {
  border-bottom: none;
}

.transaction-info {
  flex: 1;
}

.transaction-type {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.transaction-time {
  font-size: 12px;
  color: #999;
}

.transaction-amount {
  font-size: 16px;
  font-weight: 600;
}

.transaction-amount.income {
  color: #67c23a;
}

.transaction-amount.expense {
  color: #f56c6c;
}
</style>