<script setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import { Bell, QuestionFilled, ArrowDown, Search, ArrowRight } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

// 路由
const router = useRouter()

// 搜索关键词
const searchKeyword = ref('')

// 今日数据
const todayData = ref({
  orderCount: 93,
  orderAmount: 2405.14,
  customerCount: 141,
  waitingCount: 193,
  rating: 4.8,
  oldCustomerRate: 80,
  cancelCount: 0,
  complaintCount: 0,
})

// 昨日数据分析
const yesterdayData = ref({
  oldCustomerRate: 98.6,
  customerCount: 390,
  conversionRate: 53.6
})

// 消息中心数据
const messages = ref([
  { id: 1, content: '直播间：您的新客户商品流量已达3个', time: '04-22', type: 'info' },
  { id: 2, content: '直播间：您的新客户商品流量已达3个', time: '04-22', type: 'info' },
  { id: 3, content: '直播间：您的新客户商品流量已达3个', time: '04-22', type: 'info' },
  { id: 4, content: '直播间：您的新客户商品流量已达3个', time: '04-22', type: 'info' },
  { id: 5, content: '直播间：您的新客户商品流量已达3个', time: '04-22', type: 'info' },
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

// 初始化折线图
const initLineChart = () => {
  const chartDom = document.getElementById('service-trend-chart')
  if (!chartDom) {
    console.log('Chart container not found')
    return
  }
  
  const myChart = echarts.init(chartDom)
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['04-01', '04-05', '04-10', '04-15', '04-20', '04-22']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '服务评分',
        type: 'line',
        data: [4.5, 4.6, 4.8, 4.7, 4.9, 4.8],
        smooth: true,
        lineStyle: {
          color: '#409EFF'
        },
        itemStyle: {
          color: '#409EFF'
        }
      }
    ]
  }
  myChart.setOption(option)
  
  // 响应窗口大小变化
  window.addEventListener('resize', () => {
    myChart.resize()
  })
}

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
  // 初始化菜单状态
  menuItems.value.forEach(menu => {
    if (menu.isParent && isParentActive(menu)) {
      menuCollapsed.value[menu.id] = true
    }
  })
  
  // 初始化图表
  setTimeout(() => {
    initLineChart()
  }, 500)
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
        <!-- 顶部店铺信息 -->
      <div class="top-header">
        <div class="shop-info">
          <div class="shop-avatar">
            <img src="https://via.placeholder.com/60x60/FFB800/FFFFFF?text=店" alt="店铺头像" />
          </div>
          <div class="shop-details">
            <h2 class="shop-name">米已成粥，一碗粥胡同（长春二道店）</h2>
            <div class="shop-rating">
              <el-rate v-model="todayData.rating" disabled size="small" />
              <span class="rating-value">{{ todayData.rating }}</span>
              <span class="rating-desc">真实评分 / 共{{ todayData.customerCount }}条评价</span>
            </div>
          </div>
          <div class="shop-status">
            <el-tag type="success" size="large">营业中</el-tag>
            <div class="status-time">今日营业时间：08:00-22:00</div>
          </div>
        </div>
        <div class="header-actions">
          <el-button type="primary" size="large">店铺装修</el-button>
          <el-button size="large">查看店铺</el-button>
        </div>
      </div>

       <!-- 今日数据概览 -->
       <div class="data-overview">
         <div class="data-grid">
           <div class="data-card">
             <div class="data-header">
               <span class="data-title">今日接单数</span>
             </div>
             <div class="data-content">
               <div class="data-value">{{ todayData.orderCount }}</div>
               <div class="data-unit">单</div>
             </div>
             <div class="data-footer">
               <span class="data-compare">昨日：85</span>
             </div>
           </div>
           
           <div class="data-card">
             <div class="data-header">
               <span class="data-title">今日客流量</span>
             </div>
             <div class="data-content">
               <div class="data-value">{{ todayData.customerCount }}</div>
               <div class="data-unit">人</div>
             </div>
             <div class="data-footer">
               <span class="data-compare">昨日：127</span>
             </div>
           </div>
           
           <div class="data-card highlight">
             <div class="data-header">
               <span class="data-title">今日收入</span>
             </div>
             <div class="data-content">
               <div class="data-value">{{ todayData.orderAmount }}</div>
               <div class="data-unit">元</div>
             </div>
             <div class="data-footer">
               <span class="data-compare">昨日：2278.52</span>
             </div>
           </div>
           
           <div class="data-card">
             <div class="data-header">
               <span class="data-title">今日待处理</span>
             </div>
             <div class="data-content">
               <div class="data-value">{{ todayData.waitingCount }}</div>
               <div class="data-unit">单</div>
             </div>
             <div class="data-footer">
               <span class="data-compare">昨日：175</span>
             </div>
           </div>
           
           <div class="data-card">
             <div class="data-header">
               <span class="data-title">老客户占比</span>
             </div>
             <div class="data-content">
               <div class="data-value">{{ todayData.oldCustomerRate }}</div>
               <div class="data-unit">%</div>
             </div>
             <div class="data-footer">
               <span class="data-compare">昨日：76%</span>
             </div>
           </div>
           
           <div class="data-card">
             <div class="data-header">
               <span class="data-title">取消订单</span>
             </div>
             <div class="data-content">
               <div class="data-value">{{ todayData.cancelCount }}</div>
               <div class="data-unit">单</div>
             </div>
             <div class="data-footer">
               <span class="data-compare">昨日：2</span>
             </div>
           </div>
           
           <div class="data-card">
             <div class="data-header">
               <span class="data-title">投诉订单</span>
             </div>
             <div class="data-content">
               <div class="data-value">{{ todayData.complaintCount }}</div>
               <div class="data-unit">单</div>
             </div>
             <div class="data-footer">
               <span class="data-compare">昨日：1</span>
             </div>
           </div>
         </div>
       </div>

       <!-- 昨日经营分析和消息中心 -->
       <div class="bottom-section">
         <div class="analysis-section">
           <div class="section-card">
             <div class="section-header">
               <h3>昨日经营分析</h3>
               <el-button text type="primary">查看更多数据</el-button>
             </div>
             <div class="analysis-content">
               <div class="analysis-item">
                 <div class="analysis-title">老顾客回头率</div>
                 <div class="progress-container">
                   <div class="progress-circle">
                     <el-progress type="circle" :percentage="yesterdayData.oldCustomerRate" :width="100" stroke-width="8" color="#FFB800" :show-text="false" />
                   </div>
                   <div class="progress-info">
                     <div class="progress-value">{{ yesterdayData.oldCustomerRate }}%</div>
                     <div class="progress-desc">老顾客占比</div>
                   </div>
                 </div>
                 <div class="analysis-desc">全店共有顾客{{ yesterdayData.customerCount }}人</div>
               </div>
               
               <div class="analysis-item">
                 <div class="analysis-title">昨日下单数据</div>
                 <div class="order-data">
                   <div class="order-count">390</div>
                   <div class="order-unit">人</div>
                 </div>
                 <div class="order-detail">
                   <div class="detail-item">
                     <span class="detail-label">浏览人数：</span>
                     <span class="detail-value">728</span>
                   </div>
                   <div class="detail-item">
                     <span class="detail-label">下单人数：</span>
                     <span class="detail-value">390</span>
                   </div>
                 </div>
               </div>
               
               <div class="analysis-item">
                 <div class="analysis-title">昨日客单比</div>
                 <div class="progress-container">
                   <div class="progress-circle">
                     <el-progress type="circle" :percentage="yesterdayData.conversionRate" :width="100" stroke-width="8" color="#67C23A" :show-text="false" />
                   </div>
                   <div class="progress-info">
                     <div class="progress-value">{{ yesterdayData.conversionRate }}%</div>
                     <div class="progress-desc">转化率</div>
                   </div>
                 </div>
                 <div class="analysis-desc">昨日客单价：¥18.5</div>
               </div>
             </div>
           </div>
           
           <!-- 近30日服务表现 -->
           <div class="section-card chart-section">
             <div class="section-header">
               <h3>近30日服务表现</h3>
               <div class="date-range">04-24 ~ 04-22</div>
             </div>
             <div id="service-trend-chart" class="chart-container"></div>
           </div>
         </div>
         
         <!-- 消息中心 -->
         <div class="message-section">
           <div class="section-card">
             <div class="section-header">
               <h3>消息中心 <el-badge :value="messages.length" class="message-badge" /></h3>
               <el-button text type="primary">查看全部</el-button>
             </div>
             <div class="message-list">
               <div v-for="msg in messages" :key="msg.id" class="message-item">
                 <div class="message-icon">
                   <el-icon color="#FFB800"><Bell /></el-icon>
                 </div>
                 <div class="message-content">
                   <div class="message-text">{{ msg.content }}</div>
                   <div class="message-time">{{ msg.time }}</div>
                 </div>
                 <div class="message-action">
                   <el-button text size="small">处理</el-button>
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

<style scoped>
/* 整体布局 */
.merchant-layout {
  display: flex;
  min-height: 100vh;
  background-color: #f5f5f5;
}

/* 整体布局 */
.merchant-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

/* 内容包装器 */
.content-wrapper {
  display: flex;
  flex: 1;
  overflow: hidden;
  margin-top: 16px;
}

/* 左侧导航 */
.sidebar {
  width: 200px;
  background: white;
  color: #333;
  overflow-y: auto;
  flex-shrink: 0;
  border-right: 1px solid #e8e8e8;
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
  padding: 0;
  background: #f5f5f5;
  overflow-y: auto;
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

.navbar-right {
  display: flex;
  align-items: center;
  gap: 16px;
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

/* 顶部店铺信息 */
.top-header {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin: 20px 20px 20px 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.shop-info {
  display: flex;
  align-items: center;
}

.shop-avatar {
  margin-right: 16px;
}

.shop-avatar img {
  width: 60px;
  height: 60px;
  border-radius: 8px;
}

.shop-details {
  margin-right: 40px;
}

.shop-name {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #333;
}

.shop-rating {
  display: flex;
  align-items: center;
}

.rating-value {
  margin: 0 8px;
  color: #FFB800;
  font-weight: bold;
  font-size: 16px;
}

.rating-desc {
  color: #999;
  font-size: 14px;
}

.shop-status {
  text-align: center;
}

.status-time {
  margin-top: 8px;
  color: #666;
  font-size: 12px;
}

.header-actions {
  display: flex;
  gap: 12px;
}

/* 数据概览 */
.data-overview {
  margin: 0 20px 20px 20px;
}

.data-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 16px;
}

.data-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.data-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.data-card.highlight {
  background: linear-gradient(135deg, #FFB800 0%, #FF8F00 100%);
  color: white;
  position: relative;
  z-index: 1;
}

.data-header {
  margin-bottom: 12px;
}

.data-title {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.data-card.highlight .data-title {
  color: rgba(255, 255, 255, 0.9);
}

.data-content {
  display: flex;
  align-items: baseline;
  justify-content: center;
  margin-bottom: 8px;
}

.data-value {
  font-size: 28px;
  font-weight: bold;
  color: #333;
}

.data-card.highlight .data-value {
  color: white;
}

.data-unit {
  font-size: 14px;
  color: #999;
  margin-left: 4px;
}

.data-card.highlight .data-unit {
  color: rgba(255, 255, 255, 0.8);
}

.data-footer {
  font-size: 12px;
  color: #999;
}

.data-card.highlight .data-footer {
  color: rgba(255, 255, 255, 0.7);
}

/* 底部区域 */
.bottom-section {
  display: flex;
  gap: 20px;
  margin: 20px 20px 20px 20px;
}

.analysis-section {
  flex: 2;
}

.message-section {
  flex: 1;
}

.section-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.section-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
}

.message-badge {
  margin-left: 8px;
}

.date-range {
  font-size: 12px;
  color: #999;
}

/* 昨日经营分析 */
.analysis-content {
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
}

.analysis-item {
  text-align: center;
  flex: 1;
}

.analysis-title {
  font-size: 14px;
  color: #666;
  margin-bottom: 16px;
  font-weight: 500;
}

.progress-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 12px;
  position: relative;
  overflow: hidden;
}

.progress-circle {
  position: relative;
  display: inline-block;
}

.progress-info {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  pointer-events: none;
  z-index: 0;
  white-space: nowrap;
}

.progress-value {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  line-height: 1;
}

.progress-desc {
  font-size: 12px;
  color: #999;
  margin-top: 2px;
}

.analysis-desc {
  font-size: 12px;
  color: #999;
}

.order-data {
  display: flex;
  justify-content: center;
  align-items: baseline;
  margin: 16px 0;
}

.order-count {
  font-size: 32px;
  font-weight: bold;
  color: #FFB800;
}

.order-unit {
  font-size: 14px;
  color: #666;
  margin-left: 4px;
}

.order-detail {
  font-size: 12px;
  text-align: left;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
  padding: 0 20px;
}

.detail-label {
  color: #999;
}

.detail-value {
  color: #333;
  font-weight: 500;
}

/* 图表区域 */
.chart-section {
  margin-top: 20px;
}

.chart-container {
  height: 300px;
  width: 100%;
}

/* 消息中心 */
.message-list {
  max-height: 400px;
  overflow-y: auto;
}

.message-item {
  display: flex;
  align-items: flex-start;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  transition: all 0.3s;
}

.message-item:hover {
  background-color: #fafafa;
  margin: 0 -12px;
  padding: 12px;
  border-radius: 6px;
}

.message-item:last-child {
  border-bottom: none;
}

.message-icon {
  margin-right: 12px;
  margin-top: 2px;
}

.message-content {
  flex: 1;
}

.message-text {
  font-size: 14px;
  color: #333;
  line-height: 1.4;
  margin-bottom: 4px;
}

.message-time {
  font-size: 12px;
  color: #999;
}

.message-action {
  margin-left: 12px;
}
</style>