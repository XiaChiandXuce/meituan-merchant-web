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
          <h1 class="page-title">账单对账</h1>
          <p class="page-description">管理和核对账单信息，确保财务数据准确性</p>
        </div>
        
        <!-- 账单对账概览 -->
        <div class="bill-overview">
          <div class="overview-cards">
            <div class="overview-card">
              <div class="card-icon">📋</div>
              <div class="card-content">
                <div class="card-title">待对账账单</div>
                <div class="card-value">23</div>
                <div class="card-trend">需要处理</div>
              </div>
            </div>
            
            <div class="overview-card">
              <div class="card-icon">✅</div>
              <div class="card-content">
                <div class="card-title">已对账账单</div>
                <div class="card-value">156</div>
                <div class="card-trend">本月完成</div>
              </div>
            </div>
            
            <div class="overview-card">
              <div class="card-icon">⚠️</div>
              <div class="card-content">
                <div class="card-title">异常账单</div>
                <div class="card-value">3</div>
                <div class="card-trend">需要关注</div>
              </div>
            </div>
            
            <div class="overview-card">
              <div class="card-icon">💰</div>
              <div class="card-content">
                <div class="card-title">对账金额</div>
                <div class="card-value">¥45,680</div>
                <div class="card-trend">本月累计</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 筛选和操作区域 -->
        <div class="filter-section">
          <div class="filter-left">
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            />
            <el-select v-model="statusFilter" placeholder="账单状态" style="width: 120px">
              <el-option label="全部" value="" />
              <el-option label="待对账" value="pending" />
              <el-option label="已对账" value="completed" />
              <el-option label="异常" value="exception" />
            </el-select>
            <el-select v-model="typeFilter" placeholder="账单类型" style="width: 120px">
              <el-option label="全部" value="" />
              <el-option label="订单收入" value="order" />
              <el-option label="配送费" value="delivery" />
              <el-option label="服务费" value="service" />
              <el-option label="其他" value="other" />
            </el-select>
            <el-button type="primary" @click="searchBills">查询</el-button>
          </div>
          <div class="filter-right">
            <el-button type="success" @click="batchReconcile">批量对账</el-button>
            <el-button @click="exportBills">导出账单</el-button>
          </div>
        </div>

        <!-- 账单列表 -->
        <div class="bill-list">
          <el-table :data="billList" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" />
            <el-table-column prop="billNo" label="账单编号" width="150" />
            <el-table-column prop="date" label="账单日期" width="120" />
            <el-table-column prop="type" label="账单类型" width="100">
              <template #default="scope">
                <el-tag :type="getBillTypeTag(scope.row.type)">{{ getBillTypeText(scope.row.type) }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="amount" label="账单金额" width="120">
              <template #default="scope">
                <span :class="scope.row.amount > 0 ? 'amount-positive' : 'amount-negative'">
                  {{ scope.row.amount > 0 ? '+' : '' }}¥{{ Math.abs(scope.row.amount).toFixed(2) }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="platformAmount" label="平台金额" width="120">
              <template #default="scope">
                <span :class="scope.row.platformAmount > 0 ? 'amount-positive' : 'amount-negative'">
                  {{ scope.row.platformAmount > 0 ? '+' : '' }}¥{{ Math.abs(scope.row.platformAmount).toFixed(2) }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="difference" label="差异金额" width="120">
              <template #default="scope">
                <span v-if="scope.row.difference !== 0" class="amount-difference">
                  {{ scope.row.difference > 0 ? '+' : '' }}¥{{ scope.row.difference.toFixed(2) }}
                </span>
                <span v-else class="amount-normal">¥0.00</span>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="对账状态" width="100">
              <template #default="scope">
                <el-tag :type="getStatusTag(scope.row.status)">{{ getStatusText(scope.row.status) }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注" min-width="150" />
            <el-table-column label="操作" width="200">
              <template #default="scope">
                <el-button v-if="scope.row.status === 'pending'" type="primary" size="small" @click="reconcileBill(scope.row)">对账</el-button>
                <el-button v-if="scope.row.status === 'exception'" type="warning" size="small" @click="handleException(scope.row)">处理异常</el-button>
                <el-button type="info" size="small" @click="viewDetail(scope.row)">详情</el-button>
              </template>
            </el-table-column>
          </el-table>
          
          <!-- 分页 -->
          <div class="pagination-wrapper">
            <el-pagination
              v-model:current-page="currentPage"
              v-model:page-size="pageSize"
              :page-sizes="[10, 20, 50, 100]"
              :total="total"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Bell, QuestionFilled, ArrowDown, ArrowRight } from '@element-plus/icons-vue'

const router = useRouter()

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

// 筛选条件
const dateRange = ref<[string, string]>(['2024-01-01', '2024-01-31'])
const statusFilter = ref('')
const typeFilter = ref('')

// 分页
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)

// 选中的账单
const selectedBills = ref([])

// 账单列表数据
const billList = ref([
  {
    id: 1,
    billNo: 'B202401150001',
    date: '2024-01-15',
    type: 'order',
    amount: 128.50,
    platformAmount: 128.50,
    difference: 0,
    status: 'completed',
    remark: '正常订单收入'
  },
  {
    id: 2,
    billNo: 'B202401150002',
    date: '2024-01-15',
    type: 'service',
    amount: -12.85,
    platformAmount: -12.85,
    difference: 0,
    status: 'completed',
    remark: '平台服务费'
  },
  {
    id: 3,
    billNo: 'B202401150003',
    date: '2024-01-15',
    type: 'order',
    amount: 89.00,
    platformAmount: 88.50,
    difference: 0.50,
    status: 'exception',
    remark: '金额差异待核实'
  },
  {
    id: 4,
    billNo: 'B202401150004',
    date: '2024-01-15',
    type: 'delivery',
    amount: 6.00,
    platformAmount: 6.00,
    difference: 0,
    status: 'pending',
    remark: '配送费收入'
  },
  {
    id: 5,
    billNo: 'B202401150005',
    date: '2024-01-15',
    type: 'order',
    amount: 156.80,
    platformAmount: 156.80,
    difference: 0,
    status: 'pending',
    remark: '外卖订单收入'
  }
])

// 菜单相关方法
const isMenuExpanded = (menuId: string) => {
  return expandedMenus.value.includes(menuId)
}

const toggleMenu = (menuId: string) => {
  const index = expandedMenus.value.indexOf(menuId)
  if (index > -1) {
    expandedMenus.value.splice(index, 1)
  } else {
    expandedMenus.value.push(menuId)
  }
}

const isCurrentPage = (path: string) => {
  return router.currentRoute.value.path === path
}

const isParentActive = (item: any) => {
  if (!item.children) return false
  return item.children.some((child: any) => isCurrentPage(child.path))
}

const handleMenuClick = (path: string) => {
  router.push(path)
}

// 账单相关方法
const getBillTypeText = (type: string) => {
  const typeMap: Record<string, string> = {
    order: '订单收入',
    delivery: '配送费',
    service: '服务费',
    other: '其他'
  }
  return typeMap[type] || type
}

const getBillTypeTag = (type: string) => {
  const tagMap: Record<string, string> = {
    order: 'success',
    delivery: 'info',
    service: 'warning',
    other: 'info'
  }
  return tagMap[type] || 'info'
}

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: '待对账',
    completed: '已对账',
    exception: '异常'
  }
  return statusMap[status] || status
}

const getStatusTag = (status: string) => {
  const tagMap: Record<string, string> = {
    pending: 'warning',
    completed: 'success',
    exception: 'danger'
  }
  return tagMap[status] || 'info'
}

const handleSelectionChange = (selection: any[]) => {
  selectedBills.value = selection
}

const searchBills = () => {
  // 实现搜索逻辑
  ElMessage.success('查询完成')
}

const batchReconcile = () => {
  if (selectedBills.value.length === 0) {
    ElMessage.warning('请选择要对账的账单')
    return
  }
  
  ElMessageBox.confirm(
    `确定要对 ${selectedBills.value.length} 条账单进行批量对账吗？`,
    '批量对账确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // 实现批量对账逻辑
    ElMessage.success('批量对账完成')
  })
}

const exportBills = () => {
  // 实现导出逻辑
  ElMessage.success('账单导出中...')
}

const reconcileBill = (bill: any) => {
  ElMessageBox.confirm(
    `确定要对账单 ${bill.billNo} 进行对账吗？`,
    '对账确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info'
    }
  ).then(() => {
    // 实现单个对账逻辑
    bill.status = 'completed'
    ElMessage.success('对账完成')
  })
}

const handleException = (bill: any) => {
  // 实现异常处理逻辑
  ElMessage.info('跳转到异常处理页面')
}

const viewDetail = (bill: any) => {
  // 实现查看详情逻辑
  ElMessage.info(`查看账单 ${bill.billNo} 详情`)
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  // 重新加载数据
}

const handleCurrentChange = (page: number) => {
  currentPage.value = page
  // 重新加载数据
}

onMounted(() => {
  total.value = billList.value.length
})
</script>

<style scoped>
/* 基础布局样式 */
.app-container {
  min-height: 100vh;
  background: #f5f7fa;
}

/* 顶部导航栏样式 */
.navbar {
  height: 60px;
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.navbar-left {
  display: flex;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-icon {
  font-size: 24px;
}

.logo-text {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 24px;
}

.navbar-item {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 6px;
  transition: background-color 0.3s;
}

.navbar-item:hover {
  background: #f5f7fa;
}

.navbar-text {
  font-size: 14px;
  color: #606266;
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
  padding: 16px 0;
}

.menu-item {
  margin: 0 12px 4px;
  border-radius: 6px;
  overflow: hidden;
  transition: all 0.3s;
}

.menu-item:hover {
  background: #f5f7fa;
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
  background: #ff6600;
  color: white;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 10px;
  margin-left: 8px;
}

.menu-badge {
  background: #f56c6c;
  color: white;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 10px;
  margin-left: 8px;
}

.expand-icon {
  margin-left: 8px;
  transition: transform 0.3s;
}

.expand-icon.expanded {
  transform: rotate(90deg);
}

.submenu-container {
  background: #fafafa;
  border-top: 1px solid #e4e7ed;
}

.child-menu {
  margin: 0;
  border-radius: 0;
}

.child-menu .menu-content {
  padding-left: 48px;
}

.child-menu .menu-label {
  text-align: left;
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

/* 账单概览样式 */
.bill-overview {
  margin-bottom: 24px;
}

.overview-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
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

/* 筛选区域样式 */
.filter-section {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.filter-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.filter-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* 账单列表样式 */
.bill-list {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.amount-positive {
  color: #67c23a;
  font-weight: 600;
}

.amount-negative {
  color: #f56c6c;
  font-weight: 600;
}

.amount-difference {
  color: #e6a23c;
  font-weight: 600;
}

.amount-normal {
  color: #909399;
}

.pagination-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>