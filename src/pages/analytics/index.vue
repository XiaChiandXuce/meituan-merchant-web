<script setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import { Bell, QuestionFilled, ArrowDown, Search, TrendCharts, DataAnalysis, Monitor, ArrowRight } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

// 路由
const router = useRouter()

// 搜索关键词
const searchKeyword = ref('')

// 图表类型
const chartType = ref('今日')

// 今日实时数据
const todayData = ref({
  revenue: 2443.39, // 营收入
  revenueGrowth: '+28.23',
  sales: 5498.67, // 营业额
  salesGrowth: '+2673.64',
  orders: 143, // 有效订单
  ordersGrowth: '+59',
  exposure: 5681, // 曝光人数
  exposureGrowth: '+177',
  conversionRate: 8.9, // 下单转化率
  conversionGrowth: '+0.7%',
  orderConversionRate: 26.3, // 下单转化率
  orderConversionGrowth: '+0.7%'
})

// 图表数据
const chartData = ref({
  todayRevenue: 2443.39,
  todayProfit: 1914.66,
  todayOrders: 528.73
})

// 历史数据时间段
const historyPeriod = ref('近30日')

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
    path: '/customers'
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

// 初始化图表
const initChart = () => {
  const chartDom = document.getElementById('revenueChart')
  if (!chartDom) return
  
  const myChart = echarts.init(chartDom)
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    legend: {
      data: ['今日', '昨日', '商圈同行均值']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: ['0', '2', '4', '6', '8', '10', '12', '14', '16', '18', '20', '22']
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        name: '今日',
        type: 'line',
        stack: 'Total',
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0, color: 'rgba(64, 158, 255, 0.3)'
            }, {
              offset: 1, color: 'rgba(64, 158, 255, 0.1)'
            }]
          }
        },
        data: [120, 132, 101, 134, 90, 230, 210, 320, 450, 380, 420, 350]
      },
      {
        name: '昨日',
        type: 'line',
        stack: 'Total',
        data: [220, 182, 191, 234, 290, 330, 310, 280, 350, 280, 320, 250]
      },
      {
        name: '商圈同行均值',
        type: 'line',
        stack: 'Total',
        data: [150, 232, 201, 154, 190, 330, 410, 250, 300, 280, 320, 280]
      }
    ]
  }
  myChart.setOption(option)
}

// 组件挂载
onMounted(() => {
  // 初始化菜单状态
  menuItems.value.forEach(menu => {
    if (menu.isParent && isParentActive(menu)) {
      menuCollapsed.value[menu.id] = true
    }
  })
  
  console.log('经营分析页面已加载')
  setTimeout(() => {
    initChart()
  }, 100)
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
        <!-- 页面标题 -->
        <div class="page-header">
          <h1 class="page-title">经营分析</h1>
          <div class="page-actions">
            <span class="update-time">04-23 08:07更新</span>
          </div>
        </div>

        <!-- 今日实时数据卡片 -->
        <div class="data-cards">
          <div class="data-card highlight">
            <div class="card-header">
              <span class="card-title">营收入</span>
              <el-icon class="card-icon"><Monitor /></el-icon>
            </div>
            <div class="card-value">¥{{ todayData.revenue }}</div>
            <div class="card-growth positive">比昨日同期增长 {{ todayData.revenueGrowth }}</div>
          </div>

          <div class="data-card">
            <div class="card-header">
              <span class="card-title">营业额</span>
              <el-icon class="card-icon"><Monitor /></el-icon>
            </div>
            <div class="card-value">¥{{ todayData.sales }}</div>
            <div class="card-growth positive">比昨日同期增长 {{ todayData.salesGrowth }}</div>
          </div>

          <div class="data-card">
            <div class="card-header">
              <span class="card-title">有效订单</span>
              <el-icon class="card-icon"><Monitor /></el-icon>
            </div>
            <div class="card-value">{{ todayData.orders }}</div>
            <div class="card-growth positive">比昨日同期增长 {{ todayData.ordersGrowth }}</div>
          </div>

          <div class="data-card">
            <div class="card-header">
              <span class="card-title">曝光人数</span>
              <el-icon class="card-icon"><Monitor /></el-icon>
            </div>
            <div class="card-value">{{ todayData.exposure }}</div>
            <div class="card-growth positive">比昨日同期增长 {{ todayData.exposureGrowth }}</div>
          </div>

          <div class="data-card">
            <div class="card-header">
              <span class="card-title">下单转化率</span>
              <el-icon class="card-icon"><Monitor /></el-icon>
            </div>
            <div class="card-value">{{ todayData.conversionRate }}%</div>
            <div class="card-growth positive">比昨日同期增长 {{ todayData.conversionGrowth }}</div>
          </div>

          <div class="data-card">
            <div class="card-header">
              <span class="card-title">下单转化率</span>
              <el-icon class="card-icon"><Monitor /></el-icon>
            </div>
            <div class="card-value">{{ todayData.orderConversionRate }}%</div>
            <div class="card-growth positive">比昨日同期增长 {{ todayData.orderConversionGrowth }}</div>
          </div>
        </div>

        <!-- 图表区域 -->
        <div class="chart-section">
          <div class="chart-header">
            <div class="chart-summary">
              <div class="summary-item">
                <span class="summary-label">营收入</span>
                <span class="summary-value">¥{{ chartData.todayRevenue }}</span>
              </div>
              <div class="summary-divider">=</div>
              <div class="summary-item">
                <span class="summary-label">今日已完成</span>
                <span class="summary-value">¥{{ chartData.todayProfit }}</span>
              </div>
              <div class="summary-divider">+</div>
              <div class="summary-item">
                <span class="summary-label">今日下单进行中</span>
                <span class="summary-value">¥{{ chartData.todayOrders }}</span>
              </div>
            </div>
            <div class="chart-actions">
              <el-button type="text">查看收入人群 ></el-button>
            </div>
          </div>
          
          <div class="chart-container">
            <div class="chart-controls">
              <el-radio-group v-model="chartType" size="small">
                <el-radio-button value="今日">今日</el-radio-button>
                <el-radio-button value="昨日">昨日</el-radio-button>
                <el-radio-button value="商圈同行均值">商圈同行均值</el-radio-button>
              </el-radio-group>
            </div>
            <div id="revenueChart" class="chart"></div>
          </div>
        </div>

        <!-- 历史数据概况 -->
        <div class="history-section">
          <div class="section-header">
            <h2 class="section-title">历史数据概况</h2>
            <div class="section-tabs">
              <el-radio-group v-model="historyPeriod" size="small">
                <el-radio-button value="昨日">昨日</el-radio-button>
                <el-radio-button value="近7日">近7日</el-radio-button>
                <el-radio-button value="近30日">近30日</el-radio-button>
                <el-radio-button value="自定义">自定义</el-radio-button>
                <el-radio-button value="按周">按周</el-radio-button>
                <el-radio-button value="按月">按月</el-radio-button>
              </el-radio-group>
            </div>
          </div>
          
          <div class="history-notice">
            <el-alert
              title="已选时间范围内，部分数据正在计算中，请稍后查看"
              type="warning"
              :closable="false"
              show-icon>
            </el-alert>
            <p class="date-range">已选时间：2023-03-24 至 2023-04-22</p>
          </div>

          <div class="analysis-grid">
            <!-- 营业分析 -->
            <div class="analysis-card">
              <div class="card-header">
                <h3>营业分析</h3>
                <el-button type="text" size="small">查看详情</el-button>
              </div>
              <p class="card-desc">收入 = 营业额 - 支出，点击"营业分析"可查看历史收入明细</p>
              
              <div class="metrics-row">
                <div class="metric-item">
                  <div class="metric-label">收入</div>
                  <div class="metric-value">¥163,737<span class="unit">.29</span></div>
                  <div class="metric-change positive">比前30日 +4,858.02</div>
                </div>
                <div class="metric-item">
                  <div class="metric-label">营业额</div>
                  <div class="metric-value">¥384,464<span class="unit">.90</span></div>
                  <div class="metric-change positive">比前30日 +1,297.44</div>
                </div>
                <div class="metric-item">
                  <div class="metric-label">支出</div>
                  <div class="metric-value">¥220,727<span class="unit">.61</span></div>
                  <div class="metric-change negative">比前30日 -6,155.46</div>
                </div>
              </div>

              <div class="metrics-row">
                <div class="metric-item">
                  <div class="metric-label">有效订单</div>
                  <div class="metric-value">9,768<span class="unit">单</span></div>
                  <div class="metric-change positive">比前30日 +87</div>
                </div>
                <div class="metric-item">
                  <div class="metric-label">实付单均价</div>
                  <div class="metric-value">¥26<span class="unit">.02</span></div>
                  <div class="metric-change positive">比前30日 +0.11</div>
                </div>
                <div class="metric-item">
                  <div class="metric-label">活动补贴</div>
                  <div class="metric-value">¥169,972<span class="unit">.97</span></div>
                  <div class="metric-change negative">比前30日 -7,170.72</div>
                </div>
              </div>

              <div class="promotion-notice">
                <div class="notice-icon">🎯</div>
                <div class="notice-content">
                  <p>近30日您的流量表现低于平均水平，应用市场推广工具，了解更多营销数据，定位店铺瓶颈</p>
                  <el-button type="primary" size="small">去试用</el-button>
                </div>
              </div>
            </div>

            <!-- 流量分析 -->
            <div class="analysis-card">
              <div class="card-header">
                <h3>流量分析</h3>
                <div class="header-badges">
                  <el-tag type="danger" size="small">曝光数据有异常</el-tag>
                  <el-button type="text" size="small">查看详情</el-button>
                </div>
              </div>
              <p class="card-desc">有效订单 = 曝光人数 × 人均转化率 × 下单转化率</p>
              
              <div class="metrics-row">
                <div class="metric-item">
                  <div class="metric-label">曝光人数</div>
                  <div class="metric-value">--</div>
                  <div class="metric-change">比前30日 --</div>
                </div>
                <div class="metric-item">
                  <div class="metric-label">人均转化率</div>
                  <div class="metric-value">--</div>
                  <div class="metric-change">比前30日 --</div>
                </div>
                <div class="metric-item">
                  <div class="metric-label">下单转化率</div>
                  <div class="metric-value">--</div>
                  <div class="metric-change">比前30日 --</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 顾客分析 -->
          <div class="analysis-card full-width">
            <div class="card-header">
              <h3>顾客分析</h3>
              <el-button type="text" size="small">查看详情</el-button>
            </div>
            <p class="card-desc">关注新老客户占比数据，提升下单频率</p>
            
            <div class="metrics-row">
              <div class="metric-item">
                <div class="metric-label">新客人数</div>
                <div class="metric-value">0</div>
                <div class="metric-change">比前30日持平</div>
              </div>
              <div class="metric-item">
                <div class="metric-label">新客占比</div>
                <div class="metric-value">0.0<span class="unit">%</span></div>
                <div class="metric-change">比前30日持平</div>
              </div>
              <div class="metric-item">
                <div class="metric-label">下单频率</div>
                <div class="metric-value">0.00</div>
                <div class="metric-change">比前30日持平</div>
              </div>
            </div>
          </div>

          <!-- 营销分析 -->
          <div class="analysis-card full-width">
            <div class="card-header">
              <h3>营销分析</h3>
              <el-button type="text" size="small">查看详情</el-button>
            </div>
            <p class="card-desc">查看营销活动对门店营业额的贡献，提升下单频率</p>
            
            <div class="metrics-row">
              <div class="metric-item">
                <div class="metric-label">活动订单</div>
                <div class="metric-value">9,703</div>
                <div class="metric-change positive">比前30日 +102</div>
              </div>
              <div class="metric-item">
                <div class="metric-label">商家活动收益</div>
                <div class="metric-value">¥152,317<span class="unit">.26</span></div>
                <div class="metric-change positive">比前30日 +1,297.44</div>
              </div>
              <div class="metric-item">
                <div class="metric-label">投入产出比</div>
                <div class="metric-value">1.66</div>
                <div class="metric-change positive">比前30日 +0.02</div>
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
  flex-direction: column;
  height: 100vh;
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
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
  color: #666;
  font-size: 14px;
}

.navbar-item:hover {
  background-color: #f5f5f5;
  color: #333;
}

.navbar-text {
  font-size: 14px;
  color: #666;
}

.notification-badge {
  margin-right: 4px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.user-info:hover {
  background-color: #f5f5f5;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.user-name {
  font-size: 14px;
  color: #333;
  font-weight: 500;
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
  padding: 10px 0;
}

.menu-item {
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
}

.menu-icon {
  font-size: 16px;
  margin-right: 10px;
  width: 20px;
}

.menu-label {
  flex: 1;
  font-size: 14px;
  text-align: left;
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
  background: #67c23a;
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
  margin-left: 8px;
}

/* 菜单内容 */
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

/* 主内容区域 */
.main-content {
  flex: 1;
  padding: 0;
  background: #f5f5f5;
  overflow-y: auto;
}

/* 页面头部 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 24px 24px 0 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.page-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.update-time {
  color: #666;
  font-size: 14px;
}

/* 数据卡片 */
.data-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
  padding: 0 24px;
}

.data-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.data-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.data-card.highlight {
  border: 2px solid #FFB800;
  background: linear-gradient(135deg, #fff9e6 0%, #ffffff 100%);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.card-title {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.card-icon {
  color: #999;
}

.card-value {
  font-size: 28px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.card-growth {
  font-size: 12px;
  color: #52c41a;
}

.card-growth.positive {
  color: #52c41a;
}

.card-growth.negative {
  color: #ff4d4f;
}

/* 图表区域 */
.chart-section {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin: 0 24px 24px 24px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.chart-summary {
  display: flex;
  align-items: center;
  gap: 16px;
}

.summary-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.summary-label {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.summary-value {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.summary-divider {
  font-size: 16px;
  color: #999;
  margin: 0 8px;
}

.chart-actions {
  display: flex;
  align-items: center;
}

.chart-container {
  position: relative;
}

.chart-controls {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
}

.chart {
  width: 100%;
  height: 300px;
}

/* 历史数据概况样式 */
.history-section {
  margin-top: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.section-tabs .el-radio-group {
  background: #f5f5f5;
  border-radius: 4px;
  padding: 2px;
}

.history-notice {
  margin-bottom: 20px;
}

.date-range {
  margin: 8px 0 0 0;
  font-size: 12px;
  color: #666;
}

.analysis-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.analysis-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.analysis-card.full-width {
  grid-column: 1 / -1;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.card-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.header-badges {
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-desc {
  font-size: 12px;
  color: #666;
  margin: 0 0 16px 0;
  line-height: 1.4;
}

.metrics-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}

.metrics-row:last-child {
  margin-bottom: 0;
}

.metric-item {
  flex: 1;
  text-align: center;
}

.metric-label {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.metric-value {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.metric-value .unit {
  font-size: 14px;
  font-weight: normal;
}

.metric-change {
  font-size: 11px;
  color: #666;
}

.metric-change.positive {
  color: #67c23a;
}

.metric-change.negative {
  color: #f56c6c;
}

.promotion-notice {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: #f8f9fa;
  border-radius: 6px;
  padding: 12px;
  margin-top: 16px;
}

.notice-icon {
  font-size: 16px;
  line-height: 1;
}

.notice-content {
  flex: 1;
}

.notice-content p {
  font-size: 12px;
  color: #666;
  margin: 0 0 8px 0;
  line-height: 1.4;
}
</style>