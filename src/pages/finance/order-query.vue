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
          <h1 class="page-title">订单查询</h1>
          <p class="page-description">查询和管理订单信息，跟踪订单状态和收入情况</p>
        </div>
        
        <!-- 订单统计概览 -->
        <div class="order-overview">
          <div class="overview-cards">
            <div class="overview-card">
              <div class="card-icon">📋</div>
              <div class="card-content">
                <div class="card-title">今日订单</div>
                <div class="card-value">156</div>
                <div class="card-trend">+12 较昨日</div>
              </div>
            </div>
            
            <div class="overview-card">
              <div class="card-icon">💰</div>
              <div class="card-content">
                <div class="card-title">今日收入</div>
                <div class="card-value">¥12,580</div>
                <div class="card-trend">+8.5% 较昨日</div>
              </div>
            </div>
            
            <div class="overview-card">
              <div class="card-icon">⏰</div>
              <div class="card-content">
                <div class="card-title">待处理订单</div>
                <div class="card-value">23</div>
                <div class="card-trend">需要关注</div>
              </div>
            </div>
            
            <div class="overview-card">
              <div class="card-icon">📈</div>
              <div class="card-content">
                <div class="card-title">完成率</div>
                <div class="card-value">98.5%</div>
                <div class="card-trend">优秀表现</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 查询筛选区域 -->
        <div class="filter-section">
          <div class="filter-row">
            <div class="filter-group">
              <label class="filter-label">订单编号：</label>
              <el-input v-model="orderNoFilter" placeholder="请输入订单编号" style="width: 200px" clearable />
            </div>
            <div class="filter-group">
              <label class="filter-label">订单状态：</label>
              <el-select v-model="statusFilter" placeholder="请选择状态" style="width: 150px" clearable>
                <el-option label="全部" value="" />
                <el-option label="待接单" value="pending" />
                <el-option label="制作中" value="preparing" />
                <el-option label="配送中" value="delivering" />
                <el-option label="已完成" value="completed" />
                <el-option label="已取消" value="cancelled" />
                <el-option label="已退款" value="refunded" />
              </el-select>
            </div>
            <div class="filter-group">
              <label class="filter-label">支付方式：</label>
              <el-select v-model="paymentFilter" placeholder="请选择支付方式" style="width: 150px" clearable>
                <el-option label="全部" value="" />
                <el-option label="在线支付" value="online" />
                <el-option label="货到付款" value="cod" />
                <el-option label="余额支付" value="balance" />
              </el-select>
            </div>
          </div>
          <div class="filter-row">
            <div class="filter-group">
              <label class="filter-label">下单时间：</label>
              <el-date-picker
                v-model="dateRange"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                format="YYYY-MM-DD HH:mm"
                value-format="YYYY-MM-DD HH:mm:ss"
                style="width: 350px"
              />
            </div>
            <div class="filter-group">
              <label class="filter-label">金额范围：</label>
              <el-input v-model="minAmount" placeholder="最小金额" style="width: 100px" type="number" />
              <span style="margin: 0 8px">-</span>
              <el-input v-model="maxAmount" placeholder="最大金额" style="width: 100px" type="number" />
            </div>
            <div class="filter-actions">
              <el-button type="primary" @click="searchOrders">查询</el-button>
              <el-button @click="resetFilters">重置</el-button>
              <el-button @click="exportOrders">导出</el-button>
            </div>
          </div>
        </div>

        <!-- 订单列表 -->
        <div class="order-list">
          <el-table :data="orderList" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" />
            <el-table-column prop="orderNo" label="订单编号" width="150" fixed="left">
              <template #default="scope">
                <el-link type="primary" @click="viewOrderDetail(scope.row)">{{ scope.row.orderNo }}</el-link>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="下单时间" width="160" />
            <el-table-column prop="customerName" label="顾客姓名" width="120" />
            <el-table-column prop="customerPhone" label="联系电话" width="130" />
            <el-table-column prop="items" label="商品信息" min-width="200">
              <template #default="scope">
                <div class="order-items">
                  <div v-for="(item, index) in scope.row.items" :key="index" class="item-row">
                    <span class="item-name">{{ item.name }}</span>
                    <span class="item-quantity">×{{ item.quantity }}</span>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="totalAmount" label="订单金额" width="120">
              <template #default="scope">
                <span class="amount-text">¥{{ scope.row.totalAmount.toFixed(2) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="paymentMethod" label="支付方式" width="100">
              <template #default="scope">
                <el-tag :type="getPaymentTag(scope.row.paymentMethod)">{{ getPaymentText(scope.row.paymentMethod) }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="订单状态" width="100">
              <template #default="scope">
                <el-tag :type="getStatusTag(scope.row.status)">{{ getStatusText(scope.row.status) }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="deliveryAddress" label="配送地址" min-width="200" show-overflow-tooltip />
            <el-table-column label="操作" width="200" fixed="right">
              <template #default="scope">
                <el-button v-if="scope.row.status === 'pending'" type="success" size="small" @click="acceptOrder(scope.row)">接单</el-button>
                <el-button v-if="scope.row.status === 'preparing'" type="warning" size="small" @click="startDelivery(scope.row)">开始配送</el-button>
                <el-button type="info" size="small" @click="viewOrderDetail(scope.row)">详情</el-button>
                <el-dropdown v-if="scope.row.status !== 'completed'">
                  <el-button type="text" size="small">更多<el-icon><ArrowDown /></el-icon></el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item @click="cancelOrder(scope.row)">取消订单</el-dropdown-item>
                      <el-dropdown-item @click="refundOrder(scope.row)">申请退款</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
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
        id: 'order-query',
        icon: '🔎',
        label: '订单查询',
        path: '/finance/order-query'
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
const orderNoFilter = ref('')
const statusFilter = ref('')
const paymentFilter = ref('')
const dateRange = ref<[string, string]>()
const minAmount = ref('')
const maxAmount = ref('')

// 分页
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)

// 选中的订单
const selectedOrders = ref([])

// 订单列表数据
const orderList = ref([
  {
    id: 1,
    orderNo: 'MT202401150001',
    createTime: '2024-01-15 14:30:25',
    customerName: '张三',
    customerPhone: '138****5678',
    items: [
      { name: '宫保鸡丁', quantity: 1 },
      { name: '米饭', quantity: 2 }
    ],
    totalAmount: 38.50,
    paymentMethod: 'online',
    status: 'completed',
    deliveryAddress: '北京市朝阳区三里屯街道工体北路8号院1号楼101室'
  },
  {
    id: 2,
    orderNo: 'MT202401150002',
    createTime: '2024-01-15 14:25:10',
    customerName: '李四',
    customerPhone: '139****1234',
    items: [
      { name: '麻婆豆腐', quantity: 1 },
      { name: '蛋花汤', quantity: 1 }
    ],
    totalAmount: 28.00,
    paymentMethod: 'cod',
    status: 'delivering',
    deliveryAddress: '北京市海淀区中关村大街27号中关村大厦A座1201室'
  },
  {
    id: 3,
    orderNo: 'MT202401150003',
    createTime: '2024-01-15 14:20:45',
    customerName: '王五',
    customerPhone: '137****9876',
    items: [
      { name: '红烧肉', quantity: 1 },
      { name: '青菜', quantity: 1 },
      { name: '米饭', quantity: 1 }
    ],
    totalAmount: 45.80,
    paymentMethod: 'online',
    status: 'preparing',
    deliveryAddress: '北京市西城区金融街购物中心B1层美食广场'
  },
  {
    id: 4,
    orderNo: 'MT202401150004',
    createTime: '2024-01-15 14:15:30',
    customerName: '赵六',
    customerPhone: '136****5432',
    items: [
      { name: '酸辣土豆丝', quantity: 1 },
      { name: '紫菜蛋花汤', quantity: 1 }
    ],
    totalAmount: 22.50,
    paymentMethod: 'balance',
    status: 'pending',
    deliveryAddress: '北京市东城区王府井大街138号北京APM购物中心4层'
  },
  {
    id: 5,
    orderNo: 'MT202401150005',
    createTime: '2024-01-15 14:10:15',
    customerName: '孙七',
    customerPhone: '135****7890',
    items: [
      { name: '糖醋里脊', quantity: 1 },
      { name: '西红柿鸡蛋', quantity: 1 },
      { name: '米饭', quantity: 2 }
    ],
    totalAmount: 52.00,
    paymentMethod: 'online',
    status: 'cancelled',
    deliveryAddress: '北京市丰台区丽泽商务区丽泽SOHO B座1508室'
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

// 订单相关方法
const getPaymentText = (method: string) => {
  const methodMap: Record<string, string> = {
    online: '在线支付',
    cod: '货到付款',
    balance: '余额支付'
  }
  return methodMap[method] || method
}

const getPaymentTag = (method: string) => {
  const tagMap: Record<string, string> = {
    online: 'success',
    cod: 'warning',
    balance: 'info'
  }
  return tagMap[method] || 'info'
}

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: '待接单',
    preparing: '制作中',
    delivering: '配送中',
    completed: '已完成',
    cancelled: '已取消',
    refunded: '已退款'
  }
  return statusMap[status] || status
}

const getStatusTag = (status: string) => {
  const tagMap: Record<string, string> = {
    pending: 'warning',
    preparing: 'info',
    delivering: 'primary',
    completed: 'success',
    cancelled: 'danger',
    refunded: 'info'
  }
  return tagMap[status] || 'info'
}

const handleSelectionChange = (selection: any[]) => {
  selectedOrders.value = selection
}

const searchOrders = () => {
  // 实现搜索逻辑
  ElMessage.success('查询完成')
}

const resetFilters = () => {
  orderNoFilter.value = ''
  statusFilter.value = ''
  paymentFilter.value = ''
  dateRange.value = undefined
  minAmount.value = ''
  maxAmount.value = ''
  ElMessage.info('筛选条件已重置')
}

const exportOrders = () => {
  // 实现导出逻辑
  ElMessage.success('订单数据导出中...')
}

const viewOrderDetail = (order: any) => {
  // 实现查看订单详情逻辑
  ElMessage.info(`查看订单 ${order.orderNo} 详情`)
}

const acceptOrder = (order: any) => {
  ElMessageBox.confirm(
    `确定要接受订单 ${order.orderNo} 吗？`,
    '接单确认',
    {
      confirmButtonText: '确定接单',
      cancelButtonText: '取消',
      type: 'info'
    }
  ).then(() => {
    order.status = 'preparing'
    ElMessage.success('订单已接受，请及时制作')
  })
}

const startDelivery = (order: any) => {
  ElMessageBox.confirm(
    `确定要开始配送订单 ${order.orderNo} 吗？`,
    '开始配送确认',
    {
      confirmButtonText: '开始配送',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    order.status = 'delivering'
    ElMessage.success('订单已开始配送')
  })
}

const cancelOrder = (order: any) => {
  ElMessageBox.confirm(
    `确定要取消订单 ${order.orderNo} 吗？此操作不可撤销。`,
    '取消订单确认',
    {
      confirmButtonText: '确定取消',
      cancelButtonText: '不取消',
      type: 'error'
    }
  ).then(() => {
    order.status = 'cancelled'
    ElMessage.success('订单已取消')
  })
}

const refundOrder = (order: any) => {
  ElMessageBox.confirm(
    `确定要为订单 ${order.orderNo} 申请退款吗？`,
    '申请退款确认',
    {
      confirmButtonText: '申请退款',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    order.status = 'refunded'
    ElMessage.success('退款申请已提交')
  })
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
  total.value = orderList.value.length
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

/* 订单概览样式 */
.order-overview {
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
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.filter-row {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 16px;
}

.filter-row:last-child {
  margin-bottom: 0;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-label {
  font-size: 14px;
  color: #333;
  white-space: nowrap;
  min-width: 80px;
}

.filter-actions {
  margin-left: auto;
  display: flex;
  gap: 12px;
}

/* 订单列表样式 */
.order-list {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.order-items {
  max-height: 60px;
  overflow-y: auto;
}

.item-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.item-row:last-child {
  margin-bottom: 0;
}

.item-name {
  font-size: 13px;
  color: #333;
  flex: 1;
}

.item-quantity {
  font-size: 12px;
  color: #666;
  margin-left: 8px;
}

.amount-text {
  font-weight: 600;
  color: #333;
}

.pagination-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>