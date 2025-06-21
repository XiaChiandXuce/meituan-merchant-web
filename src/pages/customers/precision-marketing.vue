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
            <p class="page-description">基于顾客数据分析，制定精准营销策略，提升转化率</p>
          </div>
          <div class="header-right">
            <el-button type="primary" @click="createCampaign">
              <el-icon><Plus /></el-icon>
              创建营销活动
            </el-button>
          </div>
        </div>

        <!-- 营销概览 -->
        <div class="overview-section">
          <div class="overview-cards">
            <div class="overview-card">
              <div class="card-icon">📊</div>
              <div class="card-content">
                <div class="card-title">活跃营销活动</div>
                <div class="card-value">{{ activeCampaigns }}</div>
                <div class="card-trend positive">+12% 较上周</div>
              </div>
            </div>
            <div class="overview-card">
              <div class="card-icon">🎯</div>
              <div class="card-content">
                <div class="card-title">目标客户数</div>
                <div class="card-value">{{ targetCustomers }}</div>
                <div class="card-trend positive">+8% 较上周</div>
              </div>
            </div>
            <div class="overview-card">
              <div class="card-icon">💰</div>
              <div class="card-content">
                <div class="card-title">营销转化率</div>
                <div class="card-value">{{ conversionRate }}%</div>
                <div class="card-trend positive">+5% 较上周</div>
              </div>
            </div>
            <div class="overview-card">
              <div class="card-icon">📈</div>
              <div class="card-content">
                <div class="card-title">营销收入</div>
                <div class="card-value">¥{{ marketingRevenue }}</div>
                <div class="card-trend positive">+15% 较上周</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 营销活动列表 -->
        <div class="campaigns-section">
          <div class="section-header">
            <h2 class="section-title">营销活动</h2>
            <div class="section-actions">
              <el-select v-model="statusFilter" placeholder="活动状态" style="width: 120px">
                <el-option label="全部" value="all" />
                <el-option label="进行中" value="active" />
                <el-option label="已结束" value="ended" />
                <el-option label="草稿" value="draft" />
              </el-select>
              <el-date-picker
                v-model="dateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                style="width: 240px; margin-left: 12px"
              />
            </div>
          </div>

          <div class="campaigns-grid">
            <div v-for="campaign in filteredCampaigns" :key="campaign.id" class="campaign-card">
              <div class="campaign-header">
                <div class="campaign-status" :class="campaign.status">{{ getStatusText(campaign.status) }}</div>
                <el-dropdown trigger="click">
                  <el-icon class="campaign-menu"><MoreFilled /></el-icon>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item @click="editCampaign(campaign)">编辑</el-dropdown-item>
                      <el-dropdown-item @click="duplicateCampaign(campaign)">复制</el-dropdown-item>
                      <el-dropdown-item @click="viewReport(campaign)">查看报告</el-dropdown-item>
                      <el-dropdown-item divided @click="deleteCampaign(campaign)">删除</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
              <div class="campaign-content">
                <h3 class="campaign-title">{{ campaign.title }}</h3>
                <p class="campaign-description">{{ campaign.description }}</p>
                <div class="campaign-meta">
                  <div class="meta-item">
                    <span class="meta-label">目标客户:</span>
                    <span class="meta-value">{{ campaign.targetCount }}人</span>
                  </div>
                  <div class="meta-item">
                    <span class="meta-label">预算:</span>
                    <span class="meta-value">¥{{ campaign.budget }}</span>
                  </div>
                  <div class="meta-item">
                    <span class="meta-label">时间:</span>
                    <span class="meta-value">{{ formatDateRange(campaign.startDate, campaign.endDate) }}</span>
                  </div>
                </div>
                <div class="campaign-stats">
                  <div class="stat-item">
                    <div class="stat-value">{{ campaign.impressions }}</div>
                    <div class="stat-label">曝光量</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-value">{{ campaign.clicks }}</div>
                    <div class="stat-label">点击量</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-value">{{ campaign.conversions }}</div>
                    <div class="stat-label">转化量</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-value">{{ (campaign.conversions / campaign.clicks * 100).toFixed(1) }}%</div>
                    <div class="stat-label">转化率</div>
                  </div>
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
import { Bell, QuestionFilled, ArrowDown, Search, ArrowRight, Plus, MoreFilled } from '@element-plus/icons-vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'

// 路由
const router = useRouter()
const route = useRoute()

// 搜索关键词
const searchKeyword = ref('')

// 筛选条件
const statusFilter = ref('all')
const dateRange = ref([])

// 概览数据
const activeCampaigns = ref(8)
const targetCustomers = ref(2456)
const conversionRate = ref(12.5)
const marketingRevenue = ref(45680)

// 营销活动数据
const campaigns = ref([
  {
    id: 1,
    title: '新用户专享优惠',
    description: '针对新注册用户推送专属优惠券，提升首单转化率',
    status: 'active',
    targetCount: 1200,
    budget: 5000,
    startDate: '2024-01-15',
    endDate: '2024-02-15',
    impressions: 15680,
    clicks: 2340,
    conversions: 298
  },
  {
    id: 2,
    title: '老客户回流活动',
    description: '向30天未下单的老客户推送回流优惠',
    status: 'active',
    targetCount: 800,
    budget: 3000,
    startDate: '2024-01-20',
    endDate: '2024-02-20',
    impressions: 9800,
    clicks: 1560,
    conversions: 187
  },
  {
    id: 3,
    title: '高价值客户专享',
    description: '为高消费客户提供专属服务和优惠',
    status: 'ended',
    targetCount: 300,
    budget: 8000,
    startDate: '2023-12-01',
    endDate: '2023-12-31',
    impressions: 4500,
    clicks: 890,
    conversions: 156
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

// 计算属性
const filteredCampaigns = computed(() => {
  let filtered = campaigns.value
  
  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(campaign => campaign.status === statusFilter.value)
  }
  
  return filtered
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

const getStatusText = (status) => {
  const statusMap = {
    active: '进行中',
    ended: '已结束',
    draft: '草稿'
  }
  return statusMap[status] || status
}

const formatDateRange = (startDate, endDate) => {
  return `${startDate} 至 ${endDate}`
}

const createCampaign = () => {
  ElMessage.info('创建营销活动功能开发中...')
}

const editCampaign = (campaign) => {
  ElMessage.info(`编辑活动: ${campaign.title}`)
}

const duplicateCampaign = (campaign) => {
  ElMessage.info(`复制活动: ${campaign.title}`)
}

const viewReport = (campaign) => {
  ElMessage.info(`查看活动报告: ${campaign.title}`)
}

const deleteCampaign = (campaign) => {
  ElMessage.warning(`删除活动: ${campaign.title}`)
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

/* 营销活动列表样式 */
.campaigns-section {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin: 0 20px 20px 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.section-actions {
  display: flex;
  align-items: center;
}

.campaigns-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 20px;
}

.campaign-card {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 20px;
  transition: all 0.3s;
}

.campaign-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #409eff;
}

.campaign-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.campaign-status {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.campaign-status.active {
  background: #f0f9ff;
  color: #409eff;
}

.campaign-status.ended {
  background: #f5f7fa;
  color: #909399;
}

.campaign-status.draft {
  background: #fdf6ec;
  color: #e6a23c;
}

.campaign-menu {
  cursor: pointer;
  color: #909399;
  transition: color 0.3s;
}

.campaign-menu:hover {
  color: #409eff;
}

.campaign-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 8px 0;
}

.campaign-description {
  font-size: 14px;
  color: #606266;
  margin: 0 0 16px 0;
  line-height: 1.5;
}

.campaign-meta {
  margin-bottom: 16px;
}

.meta-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
  font-size: 13px;
}

.meta-label {
  color: #909399;
}

.meta-value {
  color: #303133;
  font-weight: 500;
}

.campaign-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid #f0f2f5;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #909399;
}
</style>