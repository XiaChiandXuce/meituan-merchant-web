<script setup lang="ts">

import { ref, onMounted } from 'vue'
import { Search, Filter, Refresh, Download, Bell, QuestionFilled, ArrowDown, Setting, Close, ArrowRight } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

// 路由
const router = useRouter()

// 搜索关键词
const searchKeyword = ref('')

// 订单状态筛选
const activeTab = ref('all')
const orderTabs = ref([
  { key: 'all', label: '全部订单', count: 156 },
  { key: 'inProgress', label: '进行中', count: 8 },
  { key: 'newOrder', label: '新订单', count: 12 },
  { key: 'refund', label: '退单', count: 3 },
  { key: 'compensation', label: '定则赔付', count: 2 },
  { key: 'waitingMeal', label: '待出餐', count: 15 },
  { key: 'mealException', label: '出餐异常', count: 4 },
  { key: 'waitingDelivery', label: '待发配送', count: 6 },
  { key: 'deliveryException', label: '配送异常', count: 5 },
  { key: 'urge', label: '催单', count: 9 }
])

// 时间筛选
const dateRange = ref('')
const timeFilter = ref('today')
const timeOptions = [
  { value: 'today', label: '今日' },
  { value: 'yesterday', label: '昨日' },
  { value: 'week', label: '近7天' },
  { value: 'month', label: '近30天' },
  { value: 'custom', label: '自定义' }
]

// 订单列表数据
const orderList = ref([
  {
    id: '2024042200001',
    orderNo: '#397',
    time: '04-22 09:12',
    status: 'pending',
    statusText: '待接单',
    statusColor: '#E6A23C',
    customer: {
      name: '张先生',
      phone: '186****5842',
      address: '长春市朝阳区前进大街2699号'
    },
    items: [
      { name: '招牌粥', price: 18.0, quantity: 2 },
      { name: '小菜拼盘', price: 12.0, quantity: 1 }
    ],
    totalAmount: 48.0,
    deliveryFee: 3.0,
    actualAmount: 51.0,
    payMethod: '微信支付',
    remark: '不要香菜，多放胡椒粉',
    estimatedTime: '25分钟',
    urgent: true
  },
  {
    id: '2024042200002',
    orderNo: '#396',
    time: '04-22 09:08',
    status: 'accepted',
    statusText: '制作中',
    statusColor: '#409EFF',
    customer: {
      name: '李女士',
      phone: '138****3272',
      address: '长春市南关区人民大街1485号'
    },
    items: [
      { name: '瘦肉粥', price: 16.0, quantity: 1 },
      { name: '咸菜', price: 8.0, quantity: 1 }
    ],
    totalAmount: 24.0,
    deliveryFee: 3.0,
    actualAmount: 27.0,
    payMethod: '支付宝',
    remark: '',
    estimatedTime: '20分钟',
    urgent: false
  },
  {
    id: '2024042200003',
    orderNo: '#395',
    time: '04-22 08:45',
    status: 'ready',
    statusText: '待配送',
    statusColor: '#67C23A',
    customer: {
      name: '王先生',
      phone: '159****7890',
      address: '长春市宽城区北湖科技园'
    },
    items: [
      { name: '八宝粥', price: 20.0, quantity: 1 },
      { name: '榨菜丝', price: 6.0, quantity: 2 }
    ],
    totalAmount: 32.0,
    deliveryFee: 4.0,
    actualAmount: 36.0,
    payMethod: '微信支付',
    remark: '请尽快配送',
    estimatedTime: '已完成',
    urgent: false
  }
])

// 批量操作
const selectedOrders = ref([])
const selectAll = ref(false)

// 右侧设置面板
const showSettingsPanel = ref(false)
const settingsItems = ref([
  { icon: '🔗', label: '微信接入公众号', status: '已接入', action: 'wechat' },
  { icon: '🔊', label: '消息与铃声设置', action: 'notification' },
  { icon: '⏰', label: '预订单设置', action: 'booking' },
  { icon: '🚪', label: '门店承诺出餐时长设置', action: 'timing' }
])

const orderManagementItems = ref([
  { icon: '📋', label: '订单模块功能介绍', badge: 'NEW', action: 'intro' },
  { icon: '⚙️', label: '订单相关设置', action: 'settings' }
])

// 方法
const handleTabChange = (tab) => {
  activeTab.value = tab
  // 这里可以添加筛选逻辑
}

const handleSearch = () => {
  ElMessage.success('搜索功能开发中')
}

const handleRefresh = () => {
  ElMessage.success('数据已刷新')
}

const handleExport = () => {
  ElMessage.success('导出功能开发中')
}

const handleAcceptOrder = (order) => {
  order.status = 'accepted'
  order.statusText = '制作中'
  order.statusColor = '#409EFF'
  ElMessage.success(`订单 ${order.orderNo} 已接单`)
}

const handleRejectOrder = (order) => {
  ElMessage.confirm('确定要拒绝这个订单吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    order.status = 'cancelled'
    order.statusText = '已取消'
    order.statusColor = '#909399'
    ElMessage.success('订单已拒绝')
  })
}

const handleOrderReady = (order) => {
  order.status = 'ready'
  order.statusText = '待配送'
  order.statusColor = '#67C23A'
  ElMessage.success(`订单 ${order.orderNo} 已完成制作`)
}

const handleViewDetail = (order) => {
  ElMessage.info(`查看订单 ${order.orderNo} 详情`)
}

const handleSelectAll = () => {
  if (selectAll.value) {
    selectedOrders.value = orderList.value.map(order => order.id)
  } else {
    selectedOrders.value = []
  }
}

const handleSelectionChange = () => {
  selectAll.value = selectedOrders.value.length === orderList.value.length
}

const getStatusActions = (order) => {
  switch (order.status) {
    case 'pending':
      return [
        { text: '接单', type: 'primary', action: () => handleAcceptOrder(order) },
        { text: '拒绝', type: 'danger', action: () => handleRejectOrder(order) }
      ]
    case 'accepted':
    case 'cooking':
      return [
        { text: '完成制作', type: 'success', action: () => handleOrderReady(order) }
      ]
    default:
      return [
        { text: '查看详情', type: 'info', action: () => handleViewDetail(order) }
      ]
  }
}

// 菜单点击处理
const handleMenuClick = (route) => {
  if (route) {
    router.push(route)
  }
}

// 设置面板处理
const toggleSettingsPanel = () => {
  showSettingsPanel.value = !showSettingsPanel.value
}

const handleSettingsClick = (item) => {
  ElMessage.info(`点击了${item.label}，功能开发中`)
}

onMounted(() => {
  // 页面加载完成后的初始化操作
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
          <div class="menu-item" @click="handleMenuClick('/home')">
             <span class="menu-icon">📊</span>
             <span class="menu-label">商家首页</span>
           </div>
           <div class="menu-item active">
             <span class="menu-icon">📋</span>
             <span class="menu-label">订单管理</span>
             <span class="menu-count">12</span>
           </div>
           <div class="menu-item">
             <span class="menu-icon">⏰</span>
             <span class="menu-label">待处理</span>
             <span class="menu-count">12</span>
           </div>
           <div class="menu-item">
             <span class="menu-icon">📜</span>
             <span class="menu-label">历史订单</span>
           </div>
           <div class="menu-item" @click="handleMenuClick('/products')">
             <span class="menu-icon">🏪</span>
             <span class="menu-label">商品管理</span>
             <span class="menu-count">1</span>
           </div>
           <div class="menu-item">
             <span class="menu-icon">📦</span>
             <span class="menu-label">商品列表</span>
           </div>
           <div class="menu-item">
             <span class="menu-icon">🛠️</span>
             <span class="menu-label">商品助手</span>
             <span class="menu-count">1</span>
           </div>
           <div class="menu-item">
             <span class="menu-icon">🔧</span>
             <span class="menu-label">规格管理</span>
           </div>
           <div class="menu-item" @click="handleMenuClick('/customers')">
             <span class="menu-icon">👥</span>
             <span class="menu-label">顾客管理</span>
             <span class="menu-badge">新</span>
           </div>
           <div class="menu-item" @click="handleMenuClick('/finance')">
             <span class="menu-icon">💰</span>
             <span class="menu-label">财务管理</span>
           </div>
           <div class="menu-item" @click="handleMenuClick('/analytics')">
             <span class="menu-icon">📊</span>
             <span class="menu-label">经营分析</span>
           </div>
           <div class="menu-item" @click="handleMenuClick('/marketing')">
             <span class="menu-icon">📢</span>
             <span class="menu-label">门店推广</span>
           </div>
           <div class="menu-item" @click="handleMenuClick('/activities')">
             <span class="menu-icon">🎯</span>
             <span class="menu-label">活动中心</span>
             <span class="menu-badge">新</span>
           </div>
           <div class="menu-item">
             <span class="menu-icon">⚙️</span>
             <span class="menu-label">向左收起</span>
           </div>
        </div>
      </div>

      <!-- 主内容区域 -->
      <div class="main-content">
        <!-- 右侧设置面板切换按钮 -->
        <div class="settings-toggle" @click="toggleSettingsPanel">
          <el-icon><Setting /></el-icon>
          <span>设置</span>
        </div>
        <div class="orders-container">
          <!-- 页面标题 -->
          <div class="page-header">
            <h1 class="page-title">订单管理</h1>
            <div class="header-actions">
              <el-button :icon="Refresh" @click="handleRefresh">刷新</el-button>
              <el-button :icon="Download" @click="handleExport">导出</el-button>
            </div>
          </div>

          <!-- 筛选工具栏 -->
          <div class="filter-toolbar">
            <div class="filter-left">
              <el-select v-model="timeFilter" placeholder="选择时间" style="width: 120px">
                <el-option
                  v-for="option in timeOptions"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
              <el-date-picker
                v-if="timeFilter === 'custom'"
                v-model="dateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                style="margin-left: 12px"
              />
            </div>
            <div class="filter-right">
              <el-input
                v-model="searchKeyword"
                placeholder="搜索订单号、客户信息"
                :prefix-icon="Search"
                style="width: 280px"
                @keyup.enter="handleSearch"
              />
              <el-button :icon="Filter" style="margin-left: 12px">筛选</el-button>
            </div>
          </div>

          <!-- 订单状态标签 -->
          <div class="order-tabs">
            <div
              v-for="tab in orderTabs"
              :key="tab.key"
              :class="['tab-item', { active: activeTab === tab.key }]"
              @click="handleTabChange(tab.key)"
            >
              <span class="tab-label">{{ tab.label }}</span>
              <span class="tab-count">{{ tab.count }}</span>
            </div>
          </div>

          <!-- 批量操作栏 -->
          <div class="batch-actions" v-if="selectedOrders.length > 0">
            <div class="batch-info">
              <el-checkbox v-model="selectAll" @change="handleSelectAll">全选</el-checkbox>
              <span class="selected-count">已选择 {{ selectedOrders.length }} 个订单</span>
            </div>
            <div class="batch-buttons">
              <el-button size="small">批量接单</el-button>
              <el-button size="small">批量导出</el-button>
            </div>
          </div>

          <!-- 订单列表 -->
          <div class="order-list">
            <div v-for="order in orderList" :key="order.id" class="order-card">
              <div class="order-header">
                <div class="order-left">
                  <el-checkbox
                    v-model="selectedOrders"
                    :label="order.id"
                    @change="handleSelectionChange"
                  />
                  <div class="order-info">
                    <div class="order-number">
                      <span class="order-no">{{ order.orderNo }}</span>
                      <span class="order-time">{{ order.time }}</span>
                      <el-tag v-if="order.urgent" type="danger" size="small" style="margin-left: 8px">急单</el-tag>
                    </div>
                    <div class="order-status">
                      <el-tag :color="order.statusColor" effect="light">{{ order.statusText }}</el-tag>
                      <span class="estimated-time" v-if="order.estimatedTime !== '已完成'">预计{{ order.estimatedTime }}</span>
                    </div>
                  </div>
                </div>
                <div class="order-actions">
                  <el-button
                    v-for="action in getStatusActions(order)"
                    :key="action.text"
                    :type="action.type"
                    size="small"
                    @click="action.action"
                  >
                    {{ action.text }}
                  </el-button>
                </div>
              </div>

              <div class="order-content">
                <div class="customer-info">
                  <div class="customer-details">
                    <div class="customer-name">{{ order.customer.name }}</div>
                    <div class="customer-contact">{{ order.customer.phone }}</div>
                    <div class="customer-address">{{ order.customer.address }}</div>
                  </div>
                </div>

                <div class="order-items">
                  <div class="items-list">
                    <div v-for="item in order.items" :key="item.name" class="item-row">
                      <span class="item-name">{{ item.name }}</span>
                      <span class="item-quantity">×{{ item.quantity }}</span>
                      <span class="item-price">¥{{ item.price.toFixed(2) }}</span>
                    </div>
                  </div>
                  <div class="order-remark" v-if="order.remark">
                    <span class="remark-label">备注：</span>
                    <span class="remark-text">{{ order.remark }}</span>
                  </div>
                </div>

                <div class="order-summary">
                  <div class="summary-row">
                    <span class="summary-label">商品小计：</span>
                    <span class="summary-value">¥{{ order.totalAmount.toFixed(2) }}</span>
                  </div>
                  <div class="summary-row">
                    <span class="summary-label">配送费：</span>
                    <span class="summary-value">¥{{ order.deliveryFee.toFixed(2) }}</span>
                  </div>
                  <div class="summary-row total">
                    <span class="summary-label">实付金额：</span>
                    <span class="summary-value">¥{{ order.actualAmount.toFixed(2) }}</span>
                  </div>
                  <div class="summary-row">
                    <span class="summary-label">支付方式：</span>
                    <span class="summary-value">{{ order.payMethod }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 分页 -->
          <div class="pagination-wrapper">
            <el-pagination
              background
              layout="total, sizes, prev, pager, next, jumper"
              :total="156"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="20"
              :current-page="1"
            />
          </div>
        </div>
      </div>

      <!-- 右侧设置面板 -->
      <div class="settings-panel" :class="{ 'show': showSettingsPanel }">
        <div class="panel-header">
          <h3>订单相关设置</h3>
          <el-button text @click="toggleSettingsPanel">
            <el-icon><Close /></el-icon>
          </el-button>
        </div>
        
        <div class="panel-content">
          <div class="settings-section">
            <div class="section-title">设置 2 个预订单条达成时间，请注意查看</div>
            <div class="section-subtitle">未再提醒</div>
            
            <div class="settings-list">
              <div 
                v-for="item in settingsItems" 
                :key="item.action" 
                class="settings-item"
                @click="handleSettingsClick(item)"
              >
                <div class="item-left">
                  <span class="item-icon">{{ item.icon }}</span>
                  <span class="item-label">{{ item.label }}</span>
                </div>
                <div class="item-right">
                  <span v-if="item.status" class="item-status">{{ item.status }}</span>
                  <el-icon><ArrowRight /></el-icon>
                </div>
              </div>
            </div>
          </div>
          
          <div class="settings-section">
            <div class="section-title">高效使用订单管理</div>
            
            <div class="settings-list">
              <div 
                v-for="item in orderManagementItems" 
                :key="item.action" 
                class="settings-item"
                @click="handleSettingsClick(item)"
              >
                <div class="item-left">
                  <span class="item-icon">{{ item.icon }}</span>
                  <span class="item-label">{{ item.label }}</span>
                  <span v-if="item.badge" class="item-badge">{{ item.badge }}</span>
                </div>
                <div class="item-right">
                  <span class="item-link">查看详情</span>
                  <el-icon><ArrowRight /></el-icon>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 整体布局样式 */
.merchant-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f5f5;
}

/* 设置面板切换按钮 */
.settings-toggle {
  position: fixed;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  background: #ff6600;
  color: white;
  padding: 12px 8px;
  border-radius: 6px 0 0 6px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  z-index: 1000;
  transition: all 0.3s;
}

.settings-toggle:hover {
  background: #e55a00;
}

/* 右侧设置面板 */
.settings-panel {
  position: fixed;
  top: 0;
  right: -400px;
  width: 400px;
  height: 100vh;
  background: #fff;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
  transition: right 0.3s ease;
  z-index: 999;
  overflow-y: auto;
}

.settings-panel.show {
  right: 0;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e4e7ed;
}

.panel-header h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.panel-content {
  padding: 20px;
}

.settings-section {
  margin-bottom: 32px;
}

.section-title {
  font-size: 14px;
  color: #ff6600;
  margin-bottom: 4px;
  font-weight: 500;
}

.section-subtitle {
  font-size: 12px;
  color: #999;
  margin-bottom: 16px;
}

.settings-list {
  background: #f8f9fa;
  border-radius: 8px;
  overflow: hidden;
}

.settings-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #e4e7ed;
  cursor: pointer;
  transition: background-color 0.3s;
}

.settings-item:last-child {
  border-bottom: none;
}

.settings-item:hover {
  background: #f0f0f0;
}

.item-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.item-icon {
  font-size: 16px;
}

.item-label {
  font-size: 14px;
  color: #333;
}

.item-badge {
  background: #ff6600;
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
  margin-left: 8px;
}

.item-right {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #999;
}

.item-status {
  font-size: 12px;
  color: #67c23a;
}

.item-link {
  font-size: 12px;
  color: #ff6600;
}

/* 调整主内容区域 */
.main-content {
  position: relative;
  padding-right: 0;
  transition: padding-right 0.3s;
}

.settings-panel.show ~ .main-content {
  padding-right: 400px;
}

/* 顶部导航栏 */
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
}

.navbar-title {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.logo-icon {
  font-size: 24px;
  margin-right: 8px;
}

.title-text {
  color: #303133;
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

.notification-badge :deep(.el-badge__content) {
  background: #ff4757;
  border: none;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 20px;
  background: #f8f9fa;
  transition: all 0.3s;
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

/* 内容区域 */
.content-wrapper {
  display: flex;
  flex: 1;
  margin-top: 16px;
}

/* 左侧边栏 */
.sidebar {
  width: 200px;
  background: white;
  color: #333;
  overflow-y: auto;
  flex-shrink: 0;
  border-right: 1px solid #e8e8e8;
}

.menu-list {
  padding: 10px 0;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
}

.menu-item:hover {
  background-color: #f5f5f5;
}

.menu-item.active {
  background-color: #e6f7ff;
  border-right: 3px solid #1890ff;
  color: #1890ff;
}

.menu-icon {
  font-size: 16px;
  margin-right: 10px;
  width: 20px;
}

.menu-label {
  flex: 1;
  font-size: 14px;
}

.menu-count {
  background-color: #ff4757;
  color: white;
  border-radius: 10px;
  padding: 2px 6px;
  font-size: 12px;
  min-width: 18px;
  text-align: center;
}

.menu-badge {
  background-color: #ff4757;
  color: white;
  border-radius: 8px;
  padding: 1px 4px;
  font-size: 10px;
}

/* 主内容区域 */
.main-content {
  flex: 1;
  overflow-y: auto;
}

.orders-container {
  padding: 24px;
}

/* 页面标题 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 12px;
}

/* 筛选工具栏 */
.filter-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  padding: 16px 20px;
  border-radius: 8px;
  margin-bottom: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.filter-left {
  display: flex;
  align-items: center;
}

.filter-right {
  display: flex;
  align-items: center;
}

/* 订单状态标签 */
.order-tabs {
  display: flex;
  background: #fff;
  border-radius: 8px;
  padding: 4px;
  margin-bottom: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.tab-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.3s;
  margin-right: 4px;
  color: #333;
}

.tab-item:hover {
  background-color: #f5f7fa;
}

.tab-item.active {
  background-color: #409eff;
  color: #fff;
}

.tab-label {
  font-size: 14px;
  margin-right: 8px;
  color: inherit;
}

.tab-count {
  background-color: rgba(255, 255, 255, 0.2);
  color: inherit;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
}

.tab-item.active .tab-count {
  background-color: rgba(255, 255, 255, 0.3);
}

.tab-item:not(.active) .tab-count {
  background-color: #f0f0f0;
  color: #666;
}

/* 批量操作栏 */
.batch-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #e6f7ff;
  padding: 12px 20px;
  border-radius: 8px;
  margin-bottom: 16px;
  border: 1px solid #91d5ff;
}

.batch-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.selected-count {
  color: #1890ff;
  font-size: 14px;
}

.batch-buttons {
  display: flex;
  gap: 8px;
}

/* 订单列表 */
.order-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.order-card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s;
}

.order-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.order-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.order-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.order-number {
  display: flex;
  align-items: center;
}

.order-no {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-right: 12px;
}

.order-time {
  font-size: 14px;
  color: #909399;
}

.order-status {
  display: flex;
  align-items: center;
  gap: 8px;
}

.estimated-time {
  font-size: 12px;
  color: #e6a23c;
}

.order-actions {
  display: flex;
  gap: 8px;
}

.order-content {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 24px;
}

/* 客户信息 */
.customer-info {
  display: flex;
  flex-direction: column;
}

.customer-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.customer-name {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.customer-contact {
  font-size: 14px;
  color: #606266;
}

.customer-address {
  font-size: 12px;
  color: #909399;
  line-height: 1.4;
}

/* 订单商品 */
.order-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.item-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.item-name {
  flex: 1;
  color: #303133;
}

.item-quantity {
  color: #606266;
  margin: 0 12px;
}

.item-price {
  color: #f56c6c;
  font-weight: 600;
}

.order-remark {
  background: #f8f9fa;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 12px;
}

.remark-label {
  color: #909399;
}

.remark-text {
  color: #606266;
}

/* 订单汇总 */
.order-summary {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.summary-row.total {
  font-weight: 600;
  color: #f56c6c;
  border-top: 1px solid #f0f0f0;
  padding-top: 8px;
  margin-top: 4px;
}

.summary-label {
  color: #606266;
}

.summary-value {
  color: #303133;
}

.summary-row.total .summary-value {
  color: #f56c6c;
}

/* 分页 */
.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 32px;
  padding: 20px 0;
}
</style>