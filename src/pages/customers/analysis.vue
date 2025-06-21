<script setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import { Bell, QuestionFilled, ArrowDown, Search, ArrowRight, Download, Refresh } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

// 路由
const router = useRouter()

// 搜索关键词
const searchKeyword = ref('')

// 时间范围
const dateRange = ref(['2024-04-01', '2024-04-22'])

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

// 顾客分析数据
const customerData = ref({
  totalCustomers: 1234,
  newCustomers: 156,
  returningCustomers: 845,
  avgOrderValue: 45.8,
  customerSatisfaction: 4.8,
  retentionRate: 68.5
})

// 图表实例
let customerTrendChart = null
let ageDistributionChart = null
let orderFrequencyChart = null

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

// 初始化顾客趋势图表
const initCustomerTrendChart = () => {
  const chartDom = document.getElementById('customer-trend-chart')
  if (!chartDom) return
  
  customerTrendChart = echarts.init(chartDom)
  const option = {
    title: {
      text: '顾客增长趋势',
      left: 'left',
      textStyle: {
        fontSize: 16,
        fontWeight: 'normal'
      }
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['新顾客', '回头客'],
      top: 30
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '15%',
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
        name: '新顾客',
        type: 'line',
        data: [25, 32, 28, 35, 42, 38],
        smooth: true,
        lineStyle: {
          color: '#52c41a'
        },
        itemStyle: {
          color: '#52c41a'
        },
        areaStyle: {
          color: 'rgba(82, 196, 26, 0.1)'
        }
      },
      {
        name: '回头客',
        type: 'line',
        data: [65, 72, 68, 75, 82, 78],
        smooth: true,
        lineStyle: {
          color: '#1890ff'
        },
        itemStyle: {
          color: '#1890ff'
        },
        areaStyle: {
          color: 'rgba(24, 144, 255, 0.1)'
        }
      }
    ]
  }
  customerTrendChart.setOption(option)
}

// 初始化年龄分布图表
const initAgeDistributionChart = () => {
  const chartDom = document.getElementById('age-distribution-chart')
  if (!chartDom) return
  
  ageDistributionChart = echarts.init(chartDom)
  const option = {
    title: {
      text: '顾客年龄分布',
      left: 'left',
      textStyle: {
        fontSize: 16,
        fontWeight: 'normal'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'right',
      top: 'middle'
    },
    series: [
      {
        name: '年龄分布',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['40%', '50%'],
        data: [
          { value: 335, name: '18-25岁' },
          { value: 310, name: '26-35岁' },
          { value: 234, name: '36-45岁' },
          { value: 135, name: '46-55岁' },
          { value: 85, name: '55岁以上' }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
  ageDistributionChart.setOption(option)
}

// 初始化订单频次图表
const initOrderFrequencyChart = () => {
  const chartDom = document.getElementById('order-frequency-chart')
  if (!chartDom) return
  
  orderFrequencyChart = echarts.init(chartDom)
  const option = {
    title: {
      text: '订单频次分布',
      left: 'left',
      textStyle: {
        fontSize: 16,
        fontWeight: 'normal'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['1次', '2-3次', '4-6次', '7-10次', '10次以上']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '顾客数量',
        type: 'bar',
        data: [420, 332, 301, 234, 190],
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#FFB800' },
            { offset: 1, color: '#FFA000' }
          ])
        }
      }
    ]
  }
  orderFrequencyChart.setOption(option)
}

// 刷新数据
const refreshData = () => {
  // 模拟数据刷新
  console.log('刷新顾客分析数据')
}

// 导出报告
const exportReport = () => {
  // 模拟导出功能
  console.log('导出顾客分析报告')
}

onMounted(() => {
  // 初始化菜单状态 - 默认展开顾客管理
  menuItems.value.forEach(menu => {
    if (menu.isParent && (isParentActive(menu) || menu.id === 'customers')) {
      menuCollapsed.value[menu.id] = true
    }
  })
  
  // 初始化图表
  setTimeout(() => {
    initNewCustomerChart()
    initNewCustomerTrend()
    initRetentionChart()
    initRetentionTrend()
    initValueChart()
    initValueTrend()
    initPortraitMap()
  }, 500)
  
  // 响应窗口大小变化
  window.addEventListener('resize', () => {
    // 图表自适应调整
  })
})

// 新客获取饼图
const initNewCustomerChart = () => {
  const chartElement = document.getElementById('new-customer-chart')
  if (!chartElement) return
  
  const chart = echarts.init(chartElement)
  const option = {
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      data: [
        { value: 65, name: '线上渠道', itemStyle: { color: '#1890ff' } },
        { value: 25, name: '线下推广', itemStyle: { color: '#52c41a' } },
        { value: 10, name: '口碑推荐', itemStyle: { color: '#faad14' } }
      ],
      label: { show: false },
      emphasis: { scale: false }
    }]
  }
  chart.setOption(option)
}

// 新客趋势图
const initNewCustomerTrend = () => {
  const chartElement = document.getElementById('new-customer-trend')
  if (!chartElement) return
  
  const chart = echarts.init(chartElement)
  const option = {
    grid: { top: 20, right: 20, bottom: 40, left: 40 },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月'],
      axisLine: { show: false },
      axisTick: { show: false }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: '#f0f0f0' } }
    },
    series: [{
      type: 'line',
      data: [1200, 1100, 1300, 1234, 1150, 1280],
      smooth: true,
      lineStyle: { color: '#52c41a', width: 3 },
      areaStyle: { color: 'rgba(82, 196, 26, 0.1)' },
      symbol: 'circle',
      symbolSize: 6
    }]
  }
  chart.setOption(option)
}

// 客户留存饼图
const initRetentionChart = () => {
  const chartElement = document.getElementById('retention-chart')
  if (!chartElement) return
  
  const chart = echarts.init(chartElement)
  const option = {
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      data: [
        { value: 68.9, name: '留存', itemStyle: { color: '#1890ff' } },
        { value: 31.1, name: '流失', itemStyle: { color: '#ff4d4f' } }
      ],
      label: { show: false },
      emphasis: { scale: false }
    }]
  }
  chart.setOption(option)
}

// 留存趋势图
const initRetentionTrend = () => {
  const chartElement = document.getElementById('retention-trend')
  if (!chartElement) return
  
  const chart = echarts.init(chartElement)
  const option = {
    grid: { top: 20, right: 20, bottom: 40, left: 40 },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月'],
      axisLine: { show: false },
      axisTick: { show: false }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: '#f0f0f0' } }
    },
    series: [{
      type: 'line',
      data: [65.2, 67.1, 66.8, 68.9, 67.5, 69.2],
      smooth: true,
      lineStyle: { color: '#1890ff', width: 3 },
      areaStyle: { color: 'rgba(24, 144, 255, 0.1)' },
      symbol: 'circle',
      symbolSize: 6
    }]
  }
  chart.setOption(option)
}

// 客户价值饼图
const initValueChart = () => {
  const chartElement = document.getElementById('value-chart')
  if (!chartElement) return
  
  const chart = echarts.init(chartElement)
  const option = {
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      data: [
        { value: 45, name: '高价值', itemStyle: { color: '#52c41a' } },
        { value: 35, name: '中价值', itemStyle: { color: '#1890ff' } },
        { value: 20, name: '低价值', itemStyle: { color: '#faad14' } }
      ],
      label: { show: false },
      emphasis: { scale: false }
    }]
  }
  chart.setOption(option)
}

// 价值趋势图
const initValueTrend = () => {
  const chartElement = document.getElementById('value-trend')
  if (!chartElement) return
  
  const chart = echarts.init(chartElement)
  const option = {
    grid: { top: 20, right: 20, bottom: 40, left: 40 },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月'],
      axisLine: { show: false },
      axisTick: { show: false }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: '#f0f0f0' } }
    },
    series: [{
      type: 'line',
      data: [145000, 152000, 148000, 156789, 151000, 159000],
      smooth: true,
      lineStyle: { color: '#722ed1', width: 3 },
      areaStyle: { color: 'rgba(114, 46, 209, 0.1)' },
      symbol: 'circle',
      symbolSize: 6
    }]
  }
  chart.setOption(option)
}

// 客户画像地图
const initPortraitMap = () => {
  const mapElement = document.getElementById('portrait-map')
  if (!mapElement) return
  
  mapElement.innerHTML = '<div style="text-align: center; color: #999; font-size: 14px; line-height: 400px;">客户地域分布图</div>'
}
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
        <!-- 页面头部 -->
        <div class="page-header">
          <div class="header-left">
            <h1 class="page-title">顾客分析</h1>
          </div>
          <div class="header-actions">
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              class="date-picker"
            />
            <el-button @click="refreshData" :icon="Refresh">刷新</el-button>
            <el-button type="primary" @click="exportReport" :icon="Download">导出报告</el-button>
          </div>
        </div>
        
        <!-- 数据分析内容 -->
        <div class="analysis-content">
          <!-- 新客获取 -->
          <div class="analysis-card">
            <div class="card-header">
              <h3 class="card-title">新客获取</h3>
              <div class="card-date">2024-04-22</div>
              <div class="card-actions">
                <el-button size="small">数据详情</el-button>
                <el-button size="small" type="primary">查看报告</el-button>
              </div>
            </div>
            <div class="card-content">
              <div class="metrics-row">
                <div class="metric-item">
                  <div class="metric-label">新客获取数(个)</div>
                  <div class="metric-value">1,234</div>
                  <div class="metric-trend positive">环比 +1.0%</div>
                </div>
                <div class="metric-item">
                  <div class="metric-label">新客转化率</div>
                  <div class="metric-value">12.5%</div>
                  <div class="metric-trend positive">环比 +2.1%</div>
                </div>
                <div class="metric-item">
                  <div class="metric-label">获客成本(元)</div>
                  <div class="metric-value">45.6</div>
                  <div class="metric-trend negative">环比 -1.8%</div>
                </div>
                <div class="pie-chart">
                  <div id="new-customer-chart" class="chart-container"></div>
                </div>
              </div>
              <div class="chart-section">
                <div id="new-customer-trend" class="trend-chart"></div>
              </div>
            </div>
          </div>

          <!-- 客户留存 -->
          <div class="analysis-card">
            <div class="card-header">
              <h3 class="card-title">客户留存</h3>
              <div class="card-date">2024-04-22</div>
              <div class="card-actions">
                <el-button size="small">数据详情</el-button>
                <el-button size="small" type="primary">查看报告</el-button>
              </div>
            </div>
            <div class="card-content">
              <div class="metrics-row">
                <div class="metric-item">
                  <div class="metric-label">留存客户数(个)</div>
                  <div class="metric-value">2,856</div>
                  <div class="metric-trend positive">环比 +3.2%</div>
                </div>
                <div class="metric-item">
                  <div class="metric-label">留存率</div>
                  <div class="metric-value">68.9%</div>
                  <div class="metric-trend positive">环比 +1.5%</div>
                </div>
                <div class="metric-item">
                  <div class="metric-label">流失率</div>
                  <div class="metric-value">31.1%</div>
                  <div class="metric-trend negative">环比 -1.5%</div>
                </div>
                <div class="pie-chart">
                  <div id="retention-chart" class="chart-container"></div>
                </div>
              </div>
              <div class="chart-section">
                <div id="retention-trend" class="trend-chart"></div>
              </div>
            </div>
          </div>

          <!-- 客户价值 -->
          <div class="analysis-card">
            <div class="card-header">
              <h3 class="card-title">客户价值</h3>
              <div class="card-date">2024-04-22</div>
              <div class="card-actions">
                <el-button size="small">数据详情</el-button>
                <el-button size="small" type="primary">查看报告</el-button>
              </div>
            </div>
            <div class="card-content">
              <div class="metrics-row">
                <div class="metric-item">
                  <div class="metric-label">客户总价值(元)</div>
                  <div class="metric-value">156,789</div>
                  <div class="metric-trend positive">环比 +5.8%</div>
                </div>
                <div class="metric-item">
                  <div class="metric-label">客单价(元)</div>
                  <div class="metric-value">89.5</div>
                  <div class="metric-trend positive">环比 +2.3%</div>
                </div>
                <div class="metric-item">
                  <div class="metric-label">复购率</div>
                  <div class="metric-value">42.8%</div>
                  <div class="metric-trend positive">环比 +1.2%</div>
                </div>
                <div class="pie-chart">
                  <div id="value-chart" class="chart-container"></div>
                </div>
              </div>
              <div class="chart-section">
                <div id="value-trend" class="trend-chart"></div>
              </div>
            </div>
          </div>

          <!-- 客户画像分析 -->
          <div class="analysis-card full-width">
            <div class="card-header">
              <h3 class="card-title">客户画像分析</h3>
              <div class="card-tabs">
                <el-button size="small" type="primary">年龄</el-button>
                <el-button size="small">性别</el-button>
                <el-button size="small">地域</el-button>
                <el-button size="small">消费</el-button>
                <el-button size="small">偏好</el-button>
              </div>
              <div class="card-actions">
                <el-button size="small">查看更多</el-button>
              </div>
            </div>
            <div class="card-content portrait-content">
              <div class="portrait-left">
                <div class="portrait-list">
                  <div class="portrait-item">
                    <div class="portrait-rank">1</div>
                    <div class="portrait-info">
                      <div class="portrait-label">25-30岁</div>
                      <div class="portrait-bar">
                        <div class="bar-fill" style="width: 85%"></div>
                      </div>
                    </div>
                  </div>
                  <div class="portrait-item">
                    <div class="portrait-rank">2</div>
                    <div class="portrait-info">
                      <div class="portrait-label">31-35岁</div>
                      <div class="portrait-bar">
                        <div class="bar-fill" style="width: 72%"></div>
                      </div>
                    </div>
                  </div>
                  <div class="portrait-item">
                    <div class="portrait-rank">3</div>
                    <div class="portrait-info">
                      <div class="portrait-label">18-24岁</div>
                      <div class="portrait-bar">
                        <div class="bar-fill" style="width: 68%"></div>
                      </div>
                    </div>
                  </div>
                  <div class="portrait-item">
                    <div class="portrait-rank">4</div>
                    <div class="portrait-info">
                      <div class="portrait-label">36-40岁</div>
                      <div class="portrait-bar">
                        <div class="bar-fill" style="width: 45%"></div>
                      </div>
                    </div>
                  </div>
                  <div class="portrait-item">
                    <div class="portrait-rank">5</div>
                    <div class="portrait-info">
                      <div class="portrait-label">41-45岁</div>
                      <div class="portrait-bar">
                        <div class="bar-fill" style="width: 38%"></div>
                      </div>
                    </div>
                  </div>
                  <div class="portrait-item">
                    <div class="portrait-rank">6</div>
                    <div class="portrait-info">
                      <div class="portrait-label">46-50岁</div>
                      <div class="portrait-bar">
                        <div class="bar-fill" style="width: 25%"></div>
                      </div>
                    </div>
                  </div>
                  <div class="portrait-item">
                    <div class="portrait-rank">7</div>
                    <div class="portrait-info">
                      <div class="portrait-label">50岁以上</div>
                      <div class="portrait-bar">
                        <div class="bar-fill" style="width: 15%"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="portrait-right">
                <div id="portrait-map" class="map-container"></div>
              </div>
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
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.header-left {
  flex: 1;
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

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.date-picker {
  width: 280px;
}

/* 数据分析内容样式 */
.analysis-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.analysis-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.analysis-card.full-width {
  width: 100%;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  background: #fafafa;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.card-date {
  font-size: 12px;
  color: #999;
}

.card-tabs {
  display: flex;
  gap: 8px;
}

.card-actions {
  display: flex;
  gap: 8px;
}

.card-content {
  padding: 20px;
}

.metrics-row {
  display: flex;
  align-items: flex-start;
  gap: 40px;
  margin-bottom: 20px;
}

.metric-item {
  flex: 1;
}

.metric-label {
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
}

.metric-value {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 4px;
}

.metric-trend {
  font-size: 12px;
}

.metric-trend.positive {
  color: #52c41a;
}

.metric-trend.negative {
  color: #ff4d4f;
}

.pie-chart {
  width: 120px;
  height: 120px;
  flex-shrink: 0;
}

.chart-section {
  height: 200px;
}

.trend-chart {
  width: 100%;
  height: 100%;
}

.chart-container {
  width: 100%;
  height: 100%;
}

/* 客户画像分析样式 */
.portrait-content {
  display: flex;
  gap: 40px;
  height: 400px;
}

.portrait-left {
  flex: 1;
}

.portrait-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.portrait-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.portrait-rank {
  width: 24px;
  height: 24px;
  background: #1890ff;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  flex-shrink: 0;
}

.portrait-info {
  flex: 1;
}

.portrait-label {
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
}

.portrait-bar {
  width: 100%;
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #1890ff, #40a9ff);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.portrait-right {
  flex: 1;
}

.map-container {
  width: 100%;
  height: 100%;
  background: #f5f5f5;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 14px;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .metrics-row {
    flex-direction: column;
    gap: 20px;
  }
  
  .portrait-content {
    flex-direction: column;
    height: auto;
  }
  
  .portrait-right {
    height: 300px;
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .card-tabs {
    order: 1;
  }
  
  .card-actions {
    order: 2;
  }
}

.data-overview {
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

.charts-section {
  margin-bottom: 32px;
}

.chart-row {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.chart-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid #f0f0f0;
  flex: 1;
}

.chart-card.half {
  flex: 0 0 calc(50% - 8px);
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.insights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 16px;
}

.insight-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid #f0f0f0;
  display: flex;
  gap: 16px;
}

.insight-icon {
  font-size: 32px;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #52c41a, #389e0d);
  border-radius: 12px;
  flex-shrink: 0;
}

.insight-content {
  flex: 1;
}

.insight-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.insight-desc {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin: 0 0 12px 0;
}

.insight-action {
  text-align: right;
}
</style>