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
          <h1 class="page-title">对账首页</h1>
          <p class="page-description">查看账单对账状态，确保财务数据准确无误</p>
        </div>
        
        <!-- 对账状态概览 -->
        <div class="reconciliation-overview">
          <div class="overview-cards">
            <div class="overview-card status-normal">
              <div class="card-icon">✅</div>
              <div class="card-content">
                <div class="card-title">对账状态</div>
                <div class="card-value">正常</div>
                <div class="card-trend">最近更新：2024-01-15 18:00</div>
              </div>
            </div>
            
            <div class="overview-card">
              <div class="card-icon">📊</div>
              <div class="card-content">
                <div class="card-title">今日对账金额</div>
                <div class="card-value">¥12,580.50</div>
                <div class="card-trend">已完成对账</div>
              </div>
            </div>
            
            <div class="overview-card">
              <div class="card-icon">⏰</div>
              <div class="card-content">
                <div class="card-title">待对账订单</div>
                <div class="card-value">3</div>
                <div class="card-trend">需要处理</div>
              </div>
            </div>
            
            <div class="overview-card">
              <div class="card-icon">📈</div>
              <div class="card-content">
                <div class="card-title">对账准确率</div>
                <div class="card-value">99.8%</div>
                <div class="card-trend">本月平均</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 对账操作区 -->
        <div class="reconciliation-actions">
          <div class="section-header">
            <h3 class="section-title">对账操作</h3>
            <div class="section-actions">
              <el-button type="primary" @click="startReconciliation">开始对账</el-button>
              <el-button @click="downloadReport">下载对账报告</el-button>
            </div>
          </div>
          
          <div class="action-tabs">
            <el-tabs v-model="activeTab" class="reconciliation-tabs">
              <el-tab-pane label="自动对账" name="auto">
                <div class="tab-content">
                  <div class="auto-reconciliation">
                    <div class="reconciliation-card">
                      <div class="card-header">
                        <h4>系统自动对账</h4>
                        <el-switch v-model="autoReconciliationEnabled" @change="toggleAutoReconciliation" />
                      </div>
                      <div class="card-body">
                        <p>系统将自动对账订单金额与平台结算金额，发现异常时会及时通知您。</p>
                        <div class="reconciliation-settings">
                          <div class="setting-item">
                            <label>对账频率：</label>
                            <el-select v-model="reconciliationFrequency" placeholder="请选择">
                              <el-option label="每小时" value="hourly" />
                              <el-option label="每日" value="daily" />
                              <el-option label="每周" value="weekly" />
                            </el-select>
                          </div>
                          <div class="setting-item">
                            <label>异常阈值：</label>
                            <el-input v-model="errorThreshold" placeholder="请输入金额" style="width: 120px;">
                              <template #append>元</template>
                            </el-input>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </el-tab-pane>
              
              <el-tab-pane label="手动对账" name="manual">
                <div class="tab-content">
                  <div class="manual-reconciliation">
                    <div class="reconciliation-form">
                      <div class="form-row">
                        <div class="form-item">
                          <label>对账日期：</label>
                          <el-date-picker
                            v-model="reconciliationDate"
                            type="date"
                            placeholder="选择日期"
                            format="YYYY-MM-DD"
                            value-format="YYYY-MM-DD"
                          />
                        </div>
                        <div class="form-item">
                          <label>对账类型：</label>
                          <el-select v-model="reconciliationType" placeholder="请选择">
                            <el-option label="订单对账" value="order" />
                            <el-option label="结算对账" value="settlement" />
                            <el-option label="退款对账" value="refund" />
                          </el-select>
                        </div>
                        <div class="form-item">
                          <el-button type="primary" @click="startManualReconciliation">开始对账</el-button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </el-tab-pane>
              
              <el-tab-pane label="异常处理" name="exception">
                <div class="tab-content">
                  <div class="exception-handling">
                    <div class="exception-list">
                      <div v-for="exception in exceptions" :key="exception.id" class="exception-item">
                        <div class="exception-info">
                          <div class="exception-type">{{ exception.type }}</div>
                          <div class="exception-desc">{{ exception.description }}</div>
                          <div class="exception-time">{{ exception.time }}</div>
                        </div>
                        <div class="exception-amount">{{ exception.amount }}</div>
                        <div class="exception-actions">
                          <el-button size="small" type="primary" @click="handleException(exception.id)">处理</el-button>
                          <el-button size="small" @click="ignoreException(exception.id)">忽略</el-button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>

        <!-- 对账历史 -->
        <div class="reconciliation-history">
          <div class="section-header">
            <h3 class="section-title">对账历史</h3>
            <el-button type="text" @click="viewAllHistory">查看全部</el-button>
          </div>
          
          <div class="history-table">
            <el-table :data="reconciliationHistory" style="width: 100%">
              <el-table-column prop="date" label="对账日期" width="120" />
              <el-table-column prop="type" label="对账类型" width="100" />
              <el-table-column prop="totalAmount" label="对账金额" width="120" />
              <el-table-column prop="orderCount" label="订单数量" width="100" />
              <el-table-column prop="status" label="状态" width="100">
                <template #default="scope">
                  <el-tag :type="getStatusType(scope.row.status)">{{ scope.row.status }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="operator" label="操作人" width="100" />
              <el-table-column label="操作" width="150">
                <template #default="scope">
                  <el-button size="small" type="text" @click="viewDetails(scope.row.id)">查看详情</el-button>
                  <el-button size="small" type="text" @click="downloadRecord(scope.row.id)">下载</el-button>
                </template>
              </el-table-column>
            </el-table>
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
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const route = useRoute()

// 展开的菜单项
const expandedMenus = ref<string[]>(['finance'])

// 活动标签页
const activeTab = ref('auto')

// 自动对账设置
const autoReconciliationEnabled = ref(true)
const reconciliationFrequency = ref('daily')
const errorThreshold = ref('10')

// 手动对账设置
const reconciliationDate = ref('')
const reconciliationType = ref('order')

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

// 异常数据
const exceptions = ref([
  {
    id: 1,
    type: '金额不符',
    description: '订单 #202401150001 实际收款与系统记录不符',
    time: '2024-01-15 14:30',
    amount: '差额：-¥5.50'
  },
  {
    id: 2,
    type: '订单缺失',
    description: '平台结算中存在系统未记录的订单',
    time: '2024-01-15 13:45',
    amount: '¥128.00'
  },
  {
    id: 3,
    type: '重复记录',
    description: '订单 #202401150003 存在重复结算记录',
    time: '2024-01-15 12:20',
    amount: '¥89.50'
  }
])

// 对账历史数据
const reconciliationHistory = ref([
  {
    id: 1,
    date: '2024-01-15',
    type: '自动对账',
    totalAmount: '¥12,580.50',
    orderCount: 156,
    status: '已完成',
    operator: '系统'
  },
  {
    id: 2,
    date: '2024-01-14',
    type: '手动对账',
    totalAmount: '¥11,234.80',
    orderCount: 142,
    status: '已完成',
    operator: '张三'
  },
  {
    id: 3,
    date: '2024-01-13',
    type: '自动对账',
    totalAmount: '¥13,456.20',
    orderCount: 168,
    status: '有异常',
    operator: '系统'
  },
  {
    id: 4,
    date: '2024-01-12',
    type: '自动对账',
    totalAmount: '¥10,987.60',
    orderCount: 134,
    status: '已完成',
    operator: '系统'
  },
  {
    id: 5,
    date: '2024-01-11',
    type: '手动对账',
    totalAmount: '¥14,123.40',
    orderCount: 178,
    status: '已完成',
    operator: '李四'
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

// 获取状态类型
const getStatusType = (status: string) => {
  switch (status) {
    case '已完成':
      return 'success'
    case '有异常':
      return 'warning'
    case '处理中':
      return 'info'
    default:
      return 'info'
  }
}

// 对账操作方法
const startReconciliation = () => {
  ElMessage.success('开始自动对账...')
}

const downloadReport = () => {
  ElMessage.success('正在生成对账报告...')
}

const toggleAutoReconciliation = (value: boolean) => {
  ElMessage.success(value ? '已开启自动对账' : '已关闭自动对账')
}

const startManualReconciliation = () => {
  if (!reconciliationDate.value) {
    ElMessage.warning('请选择对账日期')
    return
  }
  ElMessage.success('开始手动对账...')
}

const handleException = (id: number) => {
  ElMessage.success('正在处理异常...')
}

const ignoreException = (id: number) => {
  ElMessageBox.confirm('确定要忽略此异常吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('已忽略异常')
  })
}

const viewAllHistory = () => {
  ElMessage.info('跳转到对账历史页面')
}

const viewDetails = (id: number) => {
  ElMessage.info(`查看对账详情 ID: ${id}`)
}

const downloadRecord = (id: number) => {
  ElMessage.success(`下载对账记录 ID: ${id}`)
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

/* 对账概览样式 */
.reconciliation-overview {
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

.overview-card.status-normal .card-icon {
  background: linear-gradient(135deg, #67c23a, #85ce61);
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

/* 对账操作样式 */
.reconciliation-actions {
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

.section-actions {
  display: flex;
  gap: 12px;
}

.action-tabs {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.tab-content {
  margin-top: 20px;
}

.reconciliation-card {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: #f8f9fa;
  border-bottom: 1px solid #e4e7ed;
}

.card-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.card-body {
  padding: 20px;
}

.card-body p {
  margin: 0 0 16px 0;
  color: #666;
  line-height: 1.6;
}

.reconciliation-settings {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.setting-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.setting-item label {
  font-size: 14px;
  color: #333;
  white-space: nowrap;
}

.reconciliation-form {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
}

.form-row {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}

.form-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-item label {
  font-size: 14px;
  color: #333;
  white-space: nowrap;
}

.exception-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.exception-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: #fff9f9;
  border: 1px solid #fde2e2;
  border-radius: 8px;
}

.exception-info {
  flex: 1;
}

.exception-type {
  font-size: 14px;
  font-weight: 600;
  color: #f56c6c;
  margin-bottom: 4px;
}

.exception-desc {
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
}

.exception-time {
  font-size: 12px;
  color: #999;
}

.exception-amount {
  font-size: 16px;
  font-weight: 600;
  color: #f56c6c;
  margin: 0 16px;
}

.exception-actions {
  display: flex;
  gap: 8px;
}

/* 对账历史样式 */
.reconciliation-history {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.history-table {
  margin-top: 16px;
}

/* Element Plus 组件样式覆盖 */
:deep(.reconciliation-tabs .el-tabs__header) {
  margin: 0;
}

:deep(.reconciliation-tabs .el-tabs__nav-wrap::after) {
  display: none;
}

:deep(.reconciliation-tabs .el-tabs__active-bar) {
  background-color: #ff6600;
}

:deep(.reconciliation-tabs .el-tabs__item.is-active) {
  color: #ff6600;
}

:deep(.el-table th.el-table__cell) {
  background-color: #f8f9fa;
}
</style>