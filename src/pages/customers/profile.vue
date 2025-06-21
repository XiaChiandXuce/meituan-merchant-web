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
            <h1 class="page-title">顾客画像</h1>
          </div>
          <div class="header-right">
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              size="default"
              class="date-picker"
            />
          </div>
        </div>
        
        <!-- 顾客画像内容 -->
        <div class="profile-content">
          <!-- 顾客基础信息分析 -->
          <div class="analysis-section">
            <div class="section-header">
              <h2 class="section-title">顾客基础信息分析(4.30-7.28)</h2>
            </div>
            <div class="analysis-row">
              <!-- 跨年龄对比分析 -->
              <div class="analysis-card half-width">
                <div class="card-header">
                  <h3>跨年龄对比分析</h3>
                  <div class="chart-controls">
                    <el-radio-group v-model="ageAnalysisType" size="small">
                      <el-radio-button label="大盘同店对比">大盘同店对比</el-radio-button>
                      <el-radio-button label="同商圈同业态对比">同商圈同业态对比</el-radio-button>
                    </el-radio-group>
                  </div>
                </div>
                <div class="card-content">
                  <div class="chart-section">
                    <div id="age-comparison-chart" class="chart-container"></div>
                  </div>
                  <div class="insight-box">
                    <div class="insight-content">
                      <p>在本周期内，您的顾客年龄分布相对集中在25-35岁年龄段，占比达到42.8%，相比大盘平均水平高出8.5个百分点。建议针对此年龄段顾客制定精准营销策略。</p>
                    </div>
                    <div class="insight-actions">
                      <el-button size="small" type="primary">查看详情</el-button>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 跨年龄对比分析趋势 -->
              <div class="analysis-card half-width">
                <div class="card-header">
                  <h3>跨年龄对比分析趋势</h3>
                </div>
                <div class="card-content">
                  <div class="chart-section">
                    <div id="age-trend-chart" class="chart-container"></div>
                  </div>
                  <div class="insight-box">
                    <div class="insight-content">
                      <p>近期年龄分布趋势显示，25-35岁年龄段顾客占比呈上升趋势，增长了3.2个百分点，同时35-45岁年龄段也有小幅增长。</p>
                    </div>
                    <div class="insight-actions">
                      <el-button size="small" type="primary">查看详情</el-button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 顾客消费对比 -->
          <div class="analysis-section">
            <div class="section-header">
              <h2 class="section-title">顾客消费对比</h2>
            </div>
            <div class="analysis-row">
              <!-- 顾客消费实力对比 -->
              <div class="analysis-card half-width">
                <div class="card-header">
                  <h3>顾客消费实力对比</h3>
                </div>
                <div class="card-content">
                  <div class="chart-section">
                    <div id="consumption-comparison-chart" class="chart-container"></div>
                  </div>
                  <div class="insight-box">
                    <div class="insight-content">
                      <p>您的顾客消费实力分布较为均衡，高消费能力顾客占比28.5%，中等消费能力顾客占比45.2%，低消费能力顾客占比26.3%。</p>
                    </div>
                    <div class="insight-actions">
                      <el-button size="small" type="primary">查看详情</el-button>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 顾客消费对比趋势 -->
              <div class="analysis-card half-width">
                <div class="card-header">
                  <h3>顾客消费对比趋势</h3>
                </div>
                <div class="card-content">
                  <div class="chart-section">
                    <div id="consumption-trend-chart" class="chart-container"></div>
                  </div>
                  <div class="insight-box">
                    <div class="insight-content">
                      <p>消费趋势分析显示，高消费能力顾客占比在近期有所提升，增长了2.1个百分点，表明顾客整体消费能力在提升。</p>
                    </div>
                    <div class="insight-actions">
                      <el-button size="small" type="primary">查看详情</el-button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 顾客地域分布 -->
          <div class="analysis-section">
            <div class="section-header">
              <h2 class="section-title">顾客地域分布(4.30-7.28)</h2>
            </div>
            <div class="location-analysis-card">
              <div class="location-content">
                <!-- 左侧数据列表 -->
                <div class="location-left">
                  <div class="location-tabs">
                    <div class="tab-item active">省市分布排行TOP10</div>
                    <div class="tab-item">门店覆盖排行TOP10</div>
                    <div class="tab-item">顾客来源排行TOP10</div>
                  </div>
                  
                  <!-- 省市分布排行 -->
                  <div class="location-ranking">
                    <div class="ranking-header">
                      <span class="rank-col">排名</span>
                      <span class="name-col">省市</span>
                      <span class="count-col">人数</span>
                    </div>
                    <div class="ranking-list">
                      <div class="ranking-item" v-for="(item, index) in customerLocationData.provinceRanking" :key="index">
                        <span class="rank-number">{{ index + 1 }}</span>
                        <span class="location-name">{{ item.name }}</span>
                        <span class="user-count">{{ item.count }}人</span>
                      </div>
                    </div>
                  </div>
                  
                  <!-- 门店覆盖排行 -->
                  <div class="location-ranking" style="display: none;">
                    <div class="ranking-header">
                      <span class="rank-col">排名</span>
                      <span class="name-col">区域</span>
                      <span class="count-col">人数</span>
                    </div>
                    <div class="ranking-list">
                      <div class="ranking-item" v-for="(item, index) in customerLocationData.storeCoverage" :key="index">
                        <span class="rank-number">{{ index + 1 }}</span>
                        <span class="location-name">{{ item.name }}</span>
                        <span class="user-count">{{ item.stores }}店</span>
                      </div>
                    </div>
                  </div>
                  
                  <!-- 顾客来源排行 -->
                  <div class="location-ranking" style="display: none;">
                    <div class="ranking-header">
                      <span class="rank-col">排名</span>
                      <span class="name-col">来源</span>
                      <span class="count-col">占比</span>
                    </div>
                    <div class="ranking-list">
                      <div class="ranking-item" v-for="(item, index) in customerLocationData.customerSource" :key="index">
                        <span class="rank-number">{{ index + 1 }}</span>
                        <span class="location-name">{{ item.name }}</span>
                        <span class="user-count">{{ item.percentage }}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div class="location-insight">
                    <div class="insight-content">
                      <p>在本周期内，您的顾客主要来源于北京、上海、广州等一线城市，占总顾客数的65.8%。建议加强在这些地区的营销投入，同时关注二三线城市的市场拓展机会。</p>
                    </div>
                    <div class="insight-actions">
                      <el-button size="small" type="primary">查看详情</el-button>
                    </div>
                  </div>
                </div>
                
                <!-- 右侧地图 -->
                <div class="location-right">
                  <div id="location-map" class="map-container"></div>
                  <div class="map-legend">
                    <div class="legend-item">
                      <span class="legend-color" style="background: #1890ff;"></span>
                      <span class="legend-text">高密度区域</span>
                    </div>
                    <div class="legend-item">
                      <span class="legend-color" style="background: #52c41a;"></span>
                      <span class="legend-text">中密度区域</span>
                    </div>
                    <div class="legend-item">
                      <span class="legend-color" style="background: #faad14;"></span>
                      <span class="legend-text">低密度区域</span>
                    </div>
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
import { ref, onMounted } from 'vue'
import { Bell, QuestionFilled, ArrowDown, Search, ArrowRight } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'

// 路由
const router = useRouter()

// 搜索关键词
const searchKeyword = ref('')

// 日期范围
const dateRange = ref([])

// 菜单折叠状态
const menuCollapsed = ref({
  customers: true // 默认展开顾客管理菜单
})



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

// 顾客基础信息分析数据
const customerBasicData = ref({
  ageComparison: [
    { age: '18-25岁', thisYear: 1256, lastYear: 1089, growth: 15.3 },
    { age: '26-35岁', thisYear: 2134, lastYear: 1987, growth: 7.4 },
    { age: '36-45岁', thisYear: 987, lastYear: 1123, growth: -12.1 },
    { age: '46-55岁', thisYear: 543, lastYear: 612, growth: -11.3 },
    { age: '55岁以上', thisYear: 234, lastYear: 287, growth: -18.5 }
  ],
  insights: [
    '26-35岁年龄段顾客占比最高，达到41.2%',
    '18-25岁年龄段增长最快，同比增长15.3%',
    '整体顾客年龄呈年轻化趋势'
  ]
})

// 顾客消费对比数据
const customerConsumptionData = ref({
  consumptionComparison: [
    { level: '高消费力', thisYear: 892, lastYear: 756, growth: 18.0 },
    { level: '中等消费力', thisYear: 2341, lastYear: 2198, growth: 6.5 },
    { level: '低消费力', thisYear: 1921, lastYear: 2157, growth: -10.9 }
  ],
  insights: [
    '高消费力顾客增长18%，消费升级趋势明显',
    '中等消费力顾客占比最高，达到45.2%',
    '低消费力顾客占比下降，整体消费水平提升'
  ]
})

// 顾客地域分布数据
const customerLocationData = ref({
  provinceRanking: [
    { name: '北京市', count: 3456, percentage: 32.1 },
    { name: '上海市', count: 2134, percentage: 19.8 },
    { name: '广东省', count: 1876, percentage: 17.4 },
    { name: '江苏省', count: 1234, percentage: 11.5 },
    { name: '浙江省', count: 987, percentage: 9.2 }
  ],
  storeCoverage: [
    { name: '朝阳区', stores: 12, coverage: 85.7 },
    { name: '海淀区', stores: 8, coverage: 72.3 },
    { name: '西城区', stores: 6, coverage: 68.9 },
    { name: '东城区', stores: 4, coverage: 45.2 },
    { name: '丰台区', stores: 3, coverage: 38.6 }
  ],
  customerSource: [
    { name: '线上推广', count: 2456, percentage: 45.6 },
    { name: '口碑推荐', count: 1876, percentage: 34.8 },
    { name: '门店引流', count: 987, percentage: 18.3 },
    { name: '其他渠道', count: 67, percentage: 1.3 }
  ],
  insights: [
    '北京市顾客占比最高，达到32.1%',
    '朝阳区门店覆盖率最高，达到85.7%',
    '线上推广是主要获客渠道，占比45.6%'
  ]
})

// 菜单操作方法
const toggleMenu = (menuId) => {
  menuCollapsed.value[menuId] = !menuCollapsed.value[menuId]
}

const isMenuExpanded = (menuId) => {
  return menuCollapsed.value[menuId] || false
}

const handleMenuClick = (path) => {
  if (path) {
    router.push(path)
  }
}

const isCurrentPage = (path) => {
  return router.currentRoute.value.path === path
}

const isParentActive = (menu) => {
  if (!menu.children) return false
  return menu.children.some(child => isCurrentPage(child.path))
}

// 图表初始化
onMounted(() => {
  // 初始化菜单状态 - 默认展开顾客管理
  menuItems.value.forEach(menu => {
    if (menu.isParent && (isParentActive(menu) || menu.id === 'customers')) {
      menuCollapsed.value[menu.id] = true
    }
  })
  
  // 初始化图表
  setTimeout(() => {
    initBasicAnalysisCharts()
    initConsumptionAnalysisCharts()
    initLocationAnalysisCharts()
  }, 500)
})

// 顾客基础信息分析图表
const initBasicAnalysisCharts = () => {
  // 年龄对比分析图表
  const ageChartElement = document.getElementById('age-comparison-chart')
  if (ageChartElement) {
    const chart = echarts.init(ageChartElement)
    const option = {
      grid: { top: 20, right: 20, bottom: 40, left: 60 },
      xAxis: {
        type: 'category',
        data: customerBasicData.value.ageComparison.map(item => item.age),
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
        name: '今年',
        type: 'bar',
        data: customerBasicData.value.ageComparison.map(item => item.thisYear),
        itemStyle: { color: '#1890ff' },
        barWidth: '30%'
      }, {
        name: '去年',
        type: 'bar',
        data: customerBasicData.value.ageComparison.map(item => item.lastYear),
        itemStyle: { color: '#91d5ff' },
        barWidth: '30%'
      }]
    }
    chart.setOption(option)
  }
  
  // 年龄趋势图表
  const ageTrendElement = document.getElementById('age-trend-chart')
  if (ageTrendElement) {
    const chart = echarts.init(ageTrendElement)
    const option = {
      grid: { top: 20, right: 20, bottom: 40, left: 60 },
      xAxis: {
        type: 'category',
        data: customerBasicData.value.ageComparison.map(item => item.age),
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
        data: customerBasicData.value.ageComparison.map(item => item.growth),
        smooth: true,
        lineStyle: { color: '#52c41a', width: 3 },
        areaStyle: { color: 'rgba(82, 196, 26, 0.1)' },
        symbol: 'circle',
        symbolSize: 6
      }]
    }
    chart.setOption(option)
  }
}

// 顾客消费对比分析图表
const initConsumptionAnalysisCharts = () => {
  // 消费实力对比图表
  const consumptionChartElement = document.getElementById('consumption-comparison-chart')
  if (consumptionChartElement) {
    const chart = echarts.init(consumptionChartElement)
    const option = {
      grid: { top: 20, right: 20, bottom: 40, left: 60 },
      xAxis: {
        type: 'category',
        data: customerConsumptionData.value.consumptionComparison.map(item => item.level),
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
        name: '今年',
        type: 'bar',
        data: customerConsumptionData.value.consumptionComparison.map(item => item.thisYear),
        itemStyle: { color: '#52c41a' },
        barWidth: '30%'
      }, {
        name: '去年',
        type: 'bar',
        data: customerConsumptionData.value.consumptionComparison.map(item => item.lastYear),
        itemStyle: { color: '#b7eb8f' },
        barWidth: '30%'
      }]
    }
    chart.setOption(option)
  }
  
  // 消费趋势图表
  const consumptionTrendElement = document.getElementById('consumption-trend-chart')
  if (consumptionTrendElement) {
    const chart = echarts.init(consumptionTrendElement)
    const option = {
      grid: { top: 20, right: 20, bottom: 40, left: 60 },
      xAxis: {
        type: 'category',
        data: customerConsumptionData.value.consumptionComparison.map(item => item.level),
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
        data: customerConsumptionData.value.consumptionComparison.map(item => item.growth),
        smooth: true,
        lineStyle: { color: '#faad14', width: 3 },
        areaStyle: { color: 'rgba(250, 173, 20, 0.1)' },
        symbol: 'circle',
        symbolSize: 6
      }]
    }
    chart.setOption(option)
  }
}

// 顾客地域分布分析图表
const initLocationAnalysisCharts = () => {
  // 地域分布地图
  const mapElement = document.getElementById('location-map')
  if (mapElement) {
    mapElement.innerHTML = '<div style="text-align: center; color: #999; font-size: 14px; line-height: 300px;">北京市地域分布图</div>'
  }
}
</script>

<style scoped>
/* 基础布局样式 */
.merchant-layout {
  min-height: 100vh;
  background: #f5f5f5;
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
  font-size: 12px;
  color: #666;
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

/* 内容区域样式 */
.content-wrapper {
  display: flex;
  margin-top: 64px;
  min-height: calc(100vh - 64px);
}

/* 左侧导航样式 */
.sidebar {
  width: 240px;
  background: white;
  border-right: 1px solid #e8e8e8;
  overflow-y: auto;
}

.menu-list {
  padding: 16px 0;
}

.menu-item {
  margin: 0 12px 4px;
  border-radius: 6px;
  overflow: hidden;
  transition: all 0.2s;
}

.menu-item:hover {
  background: #f5f5f5;
}

.menu-item.active {
  background: #e6f7ff;
  border: 1px solid #91d5ff;
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
  text-align: left;
}

.menu-count {
  background: #ff4d4f;
  color: white;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 10px;
  margin-left: 8px;
}

.menu-badge {
  background: #52c41a;
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
  color: #000;
}

.expand-icon.expanded {
  transform: rotate(90deg);
}

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

/* 主内容区域样式 */
.main-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  background: white;
  padding: 20px 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.date-picker {
  width: 300px;
}

/* 顾客画像内容样式 */
.profile-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.profile-overview {
  margin-bottom: 24px;
}

.overview-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
}

.overview-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  background: #fafafa;
}

.card-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.card-content {
  padding: 20px;
}

.chart-container {
  width: 100%;
  height: 200px;
  margin-bottom: 16px;
}

.age-stats,
.gender-stats,
.consumption-stats {
  display: flex;
  justify-content: space-between;
}

.stat-item {
  text-align: center;
}

.stat-label {
  display: block;
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.stat-value {
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

/* 分析卡片样式 */
.analysis-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.header-actions {
  display: flex;
  gap: 8px;
}

/* 地域分布样式 */
.analysis-section {
  margin-bottom: 24px;
}

.section-header {
  margin-bottom: 16px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.location-analysis-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
}

.location-content {
  display: flex;
  gap: 40px;
  min-height: 400px;
}

.location-left {
  flex: 1;
}

.location-tabs {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.tab-item {
  padding: 8px 16px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}

.tab-item.active {
  color: #1890ff;
  border-bottom-color: #1890ff;
}

.location-ranking {
  margin-bottom: 24px;
}

.ranking-header {
  display: flex;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 12px;
  font-size: 12px;
  color: #666;
  font-weight: 600;
}

.rank-col {
  width: 60px;
}

.name-col {
  flex: 1;
}

.count-col {
  width: 80px;
  text-align: right;
}

.ranking-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ranking-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
  font-size: 14px;
}

.rank-number {
  width: 60px;
  color: #333;
  font-weight: 600;
}

.location-name {
  flex: 1;
  color: #333;
}

.user-count {
  width: 80px;
  text-align: right;
  color: #333;
  font-weight: 500;
}

.location-insight {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
  margin-top: 20px;
}

.insight-content {
  margin-bottom: 12px;
}

.insight-content p {
  margin: 0;
  font-size: 14px;
  color: #333;
  line-height: 1.6;
}

.insight-actions {
  display: flex;
  justify-content: flex-end;
}

.location-right {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.map-container {
  flex: 1;
  background: #f5f5f5;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 14px;
  margin-bottom: 16px;
}

.map-legend {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.legend-text {
  font-size: 12px;
  color: #666;
}

/* 消费偏好样式 */
.preference-tabs {
  display: flex;
  gap: 8px;
}

.preference-content {
  min-height: 300px;
}

.preference-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
}

.preference-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 20px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  transition: all 0.2s;
}

.preference-item:hover {
  border-color: #1890ff;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.1);
}

.preference-icon {
  font-size: 32px;
  margin-bottom: 12px;
}

.preference-info {
  margin-bottom: 16px;
}

.preference-name {
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
}

.preference-stats {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
  color: #666;
}

.preference-chart {
  width: 40px;
  height: 60px;
  position: relative;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.chart-bar {
  position: absolute;
  bottom: 0;
  width: 100%;
  background: linear-gradient(180deg, #1890ff, #40a9ff);
  border-radius: 4px 4px 0 0;
  transition: height 0.3s ease;
}

/* 用户标签样式 */
.tags-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.tag-category {
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 20px;
}

.category-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px 0;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-item {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f5f5f5;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  transition: all 0.2s;
}

.tag-item:hover {
  background: #e6f7ff;
  border: 1px solid #91d5ff;
}

.tag-name {
  color: #333;
}

.tag-count {
  color: #666;
  background: white;
  padding: 2px 6px;
  border-radius: 8px;
  font-size: 10px;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .overview-cards {
    grid-template-columns: 1fr;
  }
  
  .location-content {
    flex-direction: column;
    height: auto;
  }
  
  .location-right {
    height: 300px;
  }
  
  .preference-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .tags-grid {
    grid-template-columns: 1fr;
  }
}
</style>