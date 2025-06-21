<script setup>
import { ref, onMounted } from 'vue'
import { Search, Filter, Refresh, Download, Bell, QuestionFilled, ArrowDown, Setting, Close, ArrowRight } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

// 路由
const router = useRouter()

// 左侧菜单折叠状态
const menuCollapsed = ref({})

// 菜单数据结构
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
        label: '待处理',
        path: '/orders/pending',
        count: 3
      },
      {
        id: 'history',
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
        label: '商品列表',
        path: '/products/list'
      },
      {
        id: 'product-helper',
        label: '商品助手',
        path: '/products/helper',
        count: 1
      },
      {
        id: 'spec-management',
        label: '规格管理',
        path: '/products/specs'
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
        path: '/customers'
      },
      {
        id: 'customer-tags',
        label: '顾客标签',
        path: '/customers/tags'
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
    path: '/activities',
    badge: '新'
  }
])

// 搜索关键词
const searchKeyword = ref('')

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

// 待处理订单列表数据
const pendingOrders = ref([
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
    id: '2024042200004',
    orderNo: '#394',
    time: '04-22 09:15',
    status: 'pending',
    statusText: '待接单',
    statusColor: '#E6A23C',
    customer: {
      name: '刘女士',
      phone: '139****2468',
      address: '长春市绿园区西安大路1566号'
    },
    items: [
      { name: '小米粥', price: 15.0, quantity: 1 },
      { name: '咸鸭蛋', price: 8.0, quantity: 2 }
    ],
    totalAmount: 31.0,
    deliveryFee: 3.0,
    actualAmount: 34.0,
    payMethod: '支付宝',
    remark: '请送到门卫室',
    estimatedTime: '30分钟',
    urgent: false
  },
  {
    id: '2024042200005',
    orderNo: '#393',
    time: '04-22 09:18',
    status: 'pending',
    statusText: '待接单',
    statusColor: '#E6A23C',
    customer: {
      name: '陈先生',
      phone: '158****7531',
      address: '长春市二道区东环城路8899号'
    },
    items: [
      { name: '瘦肉粥', price: 16.0, quantity: 2 },
      { name: '榨菜丝', price: 6.0, quantity: 1 }
    ],
    totalAmount: 38.0,
    deliveryFee: 4.0,
    actualAmount: 42.0,
    payMethod: '微信支付',
    remark: '',
    estimatedTime: '20分钟',
    urgent: true
  }
])

// 批量操作
const selectedOrders = ref([])
const selectAll = ref(false)

// 右侧设置面板
const showSettingsPanel = ref(false)

// 方法
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
  // 从待处理列表中移除
  const index = pendingOrders.value.findIndex(o => o.id === order.id)
  if (index > -1) {
    pendingOrders.value.splice(index, 1)
  }
  ElMessage.success(`订单 ${order.orderNo} 已接单`)
}

const handleRejectOrder = (order) => {
  ElMessage.confirm('确定要拒绝这个订单吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 从待处理列表中移除
    const index = pendingOrders.value.findIndex(o => o.id === order.id)
    if (index > -1) {
      pendingOrders.value.splice(index, 1)
    }
    ElMessage.success('订单已拒绝')
  })
}

const handleViewDetail = (order) => {
  ElMessage.info(`查看订单 ${order.orderNo} 详情`)
}

const handleSelectAll = () => {
  if (selectAll.value) {
    selectedOrders.value = pendingOrders.value.map(order => order.id)
  } else {
    selectedOrders.value = []
  }
}

const handleSelectionChange = () => {
  selectAll.value = selectedOrders.value.length === pendingOrders.value.length
}

const handleBatchAccept = () => {
  if (selectedOrders.value.length === 0) {
    ElMessage.warning('请先选择要操作的订单')
    return
  }
  
  ElMessage.confirm(`确定要批量接单 ${selectedOrders.value.length} 个订单吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'info'
  }).then(() => {
    // 移除已选择的订单
    pendingOrders.value = pendingOrders.value.filter(order => !selectedOrders.value.includes(order.id))
    selectedOrders.value = []
    selectAll.value = false
    ElMessage.success('批量接单成功')
  })
}

const handleBatchReject = () => {
  if (selectedOrders.value.length === 0) {
    ElMessage.warning('请先选择要操作的订单')
    return
  }
  
  ElMessage.confirm(`确定要批量拒绝 ${selectedOrders.value.length} 个订单吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 移除已选择的订单
    pendingOrders.value = pendingOrders.value.filter(order => !selectedOrders.value.includes(order.id))
    selectedOrders.value = []
    selectAll.value = false
    ElMessage.success('批量拒绝成功')
  })
}

// 菜单点击处理
const handleMenuClick = (route) => {
  if (route) {
    router.push(route)
  }
}

// 菜单折叠处理
const toggleMenu = (menuId) => {
  menuCollapsed.value[menuId] = !menuCollapsed.value[menuId]
}

// 判断菜单是否展开
const isMenuExpanded = (menuId) => {
  return menuCollapsed.value[menuId] === true
}

// 判断当前页面是否为指定菜单项
const isCurrentPage = (path) => {
  return router.currentRoute.value.path === path
}

// 判断父菜单是否包含当前页面
const isParentActive = (menuItem) => {
  if (!menuItem.children) return false
  return menuItem.children.some(child => isCurrentPage(child.path))
}

// 设置面板处理
const toggleSettingsPanel = () => {
  showSettingsPanel.value = !showSettingsPanel.value
}

onMounted(() => {
  // 初始化菜单状态 - 展开包含当前页面的父菜单
  menuItems.value.forEach(item => {
    if (item.isParent && isParentActive(item)) {
      menuCollapsed.value[item.id] = true
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
            <!-- 父级菜单项 -->
            <div 
              v-if="item.isParent"
              class="menu-item parent-menu"
              :class="{ 
                'active': isParentActive(item),
                'expanded': isMenuExpanded(item.id)
              }"
              @click="toggleMenu(item.id)"
            >
              <div class="menu-content">
                <span class="menu-icon">{{ item.icon }}</span>
                <span class="menu-label">{{ item.label }}</span>
                <span v-if="item.count" class="menu-count">{{ item.count }}</span>
                <span v-if="item.badge" class="menu-badge">{{ item.badge }}</span>
                <el-icon class="expand-icon" :class="{ 'expanded': isMenuExpanded(item.id) }">
                  <ArrowRight />
                </el-icon>
              </div>
            </div>
            
            <!-- 子级菜单项 -->
            <div 
              v-if="item.isParent && isMenuExpanded(item.id)"
              class="submenu-container"
            >
              <div 
                v-for="child in item.children" 
                :key="child.id"
                class="menu-item child-menu"
                :class="{ 'active': isCurrentPage(child.path) }"
                @click="handleMenuClick(child.path)"
              >
                <div class="menu-content">
                  <span class="menu-label">{{ child.label }}</span>
                  <span v-if="child.count" class="menu-count">{{ child.count }}</span>
                  <span v-if="child.badge" class="menu-badge">{{ child.badge }}</span>
                </div>
              </div>
            </div>
            
            <!-- 普通菜单项 -->
            <div 
              v-else-if="!item.isParent"
              class="menu-item"
              :class="{ 'active': isCurrentPage(item.path) }"
              @click="handleMenuClick(item.path)"
            >
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
        <!-- 右侧设置面板切换按钮 -->
        <div class="settings-toggle" @click="toggleSettingsPanel">
          <el-icon><Setting /></el-icon>
          <span>设置</span>
        </div>
        
        <div class="orders-container">
          <!-- 页面标题 -->
          <div class="page-header">
            <h1 class="page-title">待处理订单</h1>
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

          <!-- 批量操作栏 -->
          <div class="batch-actions" v-if="selectedOrders.length > 0">
            <div class="batch-info">
              <el-checkbox v-model="selectAll" @change="handleSelectAll">全选</el-checkbox>
              <span class="selected-count">已选择 {{ selectedOrders.length }} 个订单</span>
            </div>
            <div class="batch-buttons">
              <el-button type="primary" size="small" @click="handleBatchAccept">批量接单</el-button>
              <el-button type="danger" size="small" @click="handleBatchReject">批量拒绝</el-button>
              <el-button size="small" @click="handleExport">批量导出</el-button>
            </div>
          </div>

          <!-- 待处理订单统计 -->
          <div class="pending-stats">
            <div class="stats-card">
              <div class="stats-number">{{ pendingOrders.length }}</div>
              <div class="stats-label">待处理订单</div>
            </div>
            <div class="stats-card urgent">
              <div class="stats-number">{{ pendingOrders.filter(order => order.urgent).length }}</div>
              <div class="stats-label">急单</div>
            </div>
          </div>

          <!-- 订单列表 -->
          <div class="order-list">
            <div v-if="pendingOrders.length === 0" class="empty-state">
              <div class="empty-icon">📋</div>
              <div class="empty-text">暂无待处理订单</div>
              <div class="empty-desc">所有订单都已处理完成</div>
            </div>
            
            <div v-for="order in pendingOrders" :key="order.id" class="order-card pending-order">
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
                      <span class="estimated-time">预计{{ order.estimatedTime }}</span>
                    </div>
                  </div>
                </div>
                <div class="order-actions">
                  <el-button type="primary" size="small" @click="handleAcceptOrder(order)">接单</el-button>
                  <el-button type="danger" size="small" @click="handleRejectOrder(order)">拒绝</el-button>
                  <el-button type="info" size="small" @click="handleViewDetail(order)">详情</el-button>
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
          <div class="pagination-wrapper" v-if="pendingOrders.length > 0">
            <el-pagination
              background
              layout="total, sizes, prev, pager, next, jumper"
              :total="pendingOrders.length"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="20"
              :current-page="1"
            />
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

/* 顶部导航栏 */
.top-navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  background: white;
  border-bottom: 1px solid #e4e7ed;
  padding: 0 24px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-left {
  display: flex;
  align-items: center;
}

.navbar-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-icon {
  font-size: 24px;
}

.title-text {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 24px;
}

.search-input {
  width: 300px;
}

.navbar-item {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  color: #666;
  transition: color 0.3s;
}

.navbar-item:hover {
  color: #409EFF;
}

.navbar-text {
  font-size: 14px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.user-name {
  font-size: 14px;
  color: #333;
}

/* 内容区域 */
.content-wrapper {
  display: flex;
  flex: 1;
}

/* 左侧导航菜单 */
.sidebar {
  width: 200px;
  background: white;
  border-right: 1px solid #e4e7ed;
  padding: 16px 0;
}

.menu-list {
  display: flex;
  flex-direction: column;
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
  color: #409EFF;
}

.menu-item.active .menu-content {
  background-color: #ecf5ff;
  border-left-color: #409EFF;
  color: #409EFF;
}

/* 父级菜单样式 */
.parent-menu .menu-label {
  font-weight: 600;
  font-size: 14px;
  text-align: left;
}

.parent-menu.active .menu-content {
  background-color: #ecf5ff;
  border-left-color: #409EFF;
  color: #409EFF;
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
  color: #409EFF;
}

.child-menu.active .menu-content {
  background-color: #e6f7ff;
  color: #409EFF;
  border-left: 3px solid #409EFF;
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
  background: #ff6600;
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 10px;
  margin-left: 8px;
  min-width: 16px;
  text-align: center;
}

.menu-badge {
  background: #67c23a;
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
  margin-left: 8px;
}

/* 主内容区域 */
.main-content {
  flex: 1;
  padding: 24px;
  position: relative;
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
  z-index: 99;
  transition: all 0.3s;
}

.settings-toggle:hover {
  background: #e55a00;
}

/* 订单容器 */
.orders-container {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 页面标题 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e4e7ed;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
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
  margin-bottom: 20px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 6px;
}

.filter-left {
  display: flex;
  align-items: center;
}

.filter-right {
  display: flex;
  align-items: center;
}

/* 批量操作栏 */
.batch-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #e6f7ff;
  border: 1px solid #91d5ff;
  border-radius: 6px;
  margin-bottom: 16px;
}

.batch-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.selected-count {
  font-size: 14px;
  color: #666;
}

.batch-buttons {
  display: flex;
  gap: 8px;
}

/* 待处理订单统计 */
.pending-stats {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}

.stats-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  min-width: 120px;
}

.stats-card.urgent {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stats-number {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 4px;
}

.stats-label {
  font-size: 14px;
  opacity: 0.9;
}

/* 订单列表 */
.order-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 16px;
  margin-bottom: 8px;
  color: #666;
}

.empty-desc {
  font-size: 14px;
  color: #999;
}

/* 订单卡片 */
.order-card {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  background: white;
  transition: all 0.3s;
}

.order-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.pending-order {
  border-left: 4px solid #E6A23C;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
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
  gap: 12px;
}

.order-no {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.order-time {
  font-size: 14px;
  color: #666;
}

.order-status {
  display: flex;
  align-items: center;
  gap: 12px;
}

.estimated-time {
  font-size: 12px;
  color: #E6A23C;
  font-weight: 500;
}

.order-actions {
  display: flex;
  gap: 8px;
}

.order-content {
  padding: 20px;
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
  color: #333;
}

.customer-contact {
  font-size: 12px;
  color: #666;
}

.customer-address {
  font-size: 12px;
  color: #666;
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
  color: #333;
}

.item-quantity {
  color: #666;
  margin: 0 12px;
}

.item-price {
  color: #f56c6c;
  font-weight: 500;
}

.order-remark {
  padding: 8px 12px;
  background: #f8f9fa;
  border-radius: 4px;
  font-size: 12px;
}

.remark-label {
  color: #666;
  font-weight: 500;
}

.remark-text {
  color: #333;
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
  color: #666;
}

.summary-value {
  color: #333;
}

.summary-row.total .summary-value {
  color: #f56c6c;
}

/* 分页 */
.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #e4e7ed;
}
</style>