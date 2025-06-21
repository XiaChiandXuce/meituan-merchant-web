<template>
  <div class="orders-history-page">
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
          <h1 class="page-title">历史订单</h1>
          <div class="header-actions">
            <el-button type="primary" :icon="Download">导出订单</el-button>
            <el-button :icon="Refresh" @click="refreshData">刷新</el-button>
          </div>
        </div>

        <!-- 筛选工具栏 -->
        <div class="filter-toolbar">
          <div class="filter-left">
            <el-input
              v-model="searchKeyword"
              placeholder="搜索订单号、商品名称、顾客手机号"
              :prefix-icon="Search"
              style="width: 300px;"
              clearable
              @input="handleSearch"
            />
            <el-select v-model="statusFilter" placeholder="订单状态" style="width: 120px; margin-left: 12px;">
              <el-option
                v-for="status in statusOptions"
                :key="status.value"
                :label="status.label"
                :value="status.value"
              />
            </el-select>
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="margin-left: 12px;"
              @change="handleDateChange"
            />
          </div>
          <div class="filter-right">
            <el-button :icon="Filter" @click="showAdvancedFilter = !showAdvancedFilter">
              高级筛选
            </el-button>
          </div>
        </div>

        <!-- 高级筛选面板 -->
        <div v-if="showAdvancedFilter" class="advanced-filter">
          <el-row :gutter="16">
            <el-col :span="6">
              <el-select v-model="paymentFilter" placeholder="支付方式" style="width: 100%;">
                <el-option label="全部" value="all" />
                <el-option label="微信支付" value="wechat" />
                <el-option label="支付宝" value="alipay" />
                <el-option label="现金" value="cash" />
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-input-number
                v-model="minAmount"
                placeholder="最低金额"
                :min="0"
                style="width: 100%;"
              />
            </el-col>
            <el-col :span="6">
              <el-input-number
                v-model="maxAmount"
                placeholder="最高金额"
                :min="0"
                style="width: 100%;"
              />
            </el-col>
            <el-col :span="6">
              <el-button type="primary" @click="applyAdvancedFilter">应用筛选</el-button>
              <el-button @click="resetAdvancedFilter">重置</el-button>
            </el-col>
          </el-row>
        </div>

        <!-- 订单统计 -->
        <div class="order-stats">
          <div class="stat-item">
            <div class="stat-value">{{ totalOrders }}</div>
            <div class="stat-label">总订单数</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">¥{{ totalAmount.toFixed(2) }}</div>
            <div class="stat-label">总金额</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">¥{{ avgAmount.toFixed(2) }}</div>
            <div class="stat-label">平均客单价</div>
          </div>
        </div>

        <!-- 订单列表 -->
        <div class="order-list">
          <el-table
            :data="filteredOrders"
            style="width: 100%"
            :loading="loading"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column prop="orderNo" label="订单号" width="180">
              <template #default="{ row }">
                <el-link type="primary" @click="viewOrderDetail(row)">{{ row.orderNo }}</el-link>
              </template>
            </el-table-column>
            <el-table-column label="商品信息" min-width="200">
              <template #default="{ row }">
                <div class="product-info">
                  <div class="product-list">
                    <div v-for="item in row.items.slice(0, 2)" :key="item.id" class="product-item">
                      <img :src="item.image" :alt="item.name" class="product-image" />
                      <div class="product-details">
                        <div class="product-name">{{ item.name }}</div>
                        <div class="product-spec">{{ item.spec }} × {{ item.quantity }}</div>
                      </div>
                    </div>
                    <div v-if="row.items.length > 2" class="more-products">
                      等{{ row.items.length }}件商品
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="customerInfo" label="顾客信息" width="150">
              <template #default="{ row }">
                <div class="customer-info">
                  <div class="customer-name">{{ row.customerInfo.name }}</div>
                  <div class="customer-phone">{{ row.customerInfo.phone }}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="totalAmount" label="订单金额" width="120">
              <template #default="{ row }">
                <div class="amount-info">
                  <div class="total-amount">¥{{ row.totalAmount.toFixed(2) }}</div>
                  <div v-if="row.discountAmount > 0" class="discount-amount">
                    优惠¥{{ row.discountAmount.toFixed(2) }}
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="paymentMethod" label="支付方式" width="100">
              <template #default="{ row }">
                <el-tag :type="getPaymentTagType(row.paymentMethod)" size="small">
                  {{ getPaymentMethodText(row.paymentMethod) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="订单状态" width="100">
              <template #default="{ row }">
                <el-tag :type="getStatusTagType(row.status)" size="small">
                  {{ getStatusText(row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="下单时间" width="160">
              <template #default="{ row }">
                <div class="time-info">
                  <div>{{ formatDate(row.createTime) }}</div>
                  <div class="time-detail">{{ formatTime(row.createTime) }}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120" fixed="right">
              <template #default="{ row }">
                <el-button type="primary" link size="small" @click="viewOrderDetail(row)">
                  查看详情
                </el-button>
                <el-button type="primary" link size="small" @click="printOrder(row)">
                  打印
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 分页 -->
        <div class="pagination-wrapper">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 50, 100]"
            :total="totalOrders"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>

    <!-- 订单详情弹窗 -->
    <el-dialog
      v-model="orderDetailVisible"
      title="订单详情"
      width="800px"
      :before-close="handleCloseDetail"
    >
      <div v-if="selectedOrder" class="order-detail">
        <!-- 订单基本信息 -->
        <div class="detail-section">
          <h3>订单信息</h3>
          <el-row :gutter="16">
            <el-col :span="12">
              <div class="detail-item">
                <label>订单号：</label>
                <span>{{ selectedOrder.orderNo }}</span>
              </div>
              <div class="detail-item">
                <label>下单时间：</label>
                <span>{{ formatDateTime(selectedOrder.createTime) }}</span>
              </div>
              <div class="detail-item">
                <label>订单状态：</label>
                <el-tag :type="getStatusTagType(selectedOrder.status)">
                  {{ getStatusText(selectedOrder.status) }}
                </el-tag>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="detail-item">
                <label>支付方式：</label>
                <span>{{ getPaymentMethodText(selectedOrder.paymentMethod) }}</span>
              </div>
              <div class="detail-item">
                <label>订单金额：</label>
                <span class="amount">¥{{ selectedOrder.totalAmount.toFixed(2) }}</span>
              </div>
              <div v-if="selectedOrder.discountAmount > 0" class="detail-item">
                <label>优惠金额：</label>
                <span class="discount">¥{{ selectedOrder.discountAmount.toFixed(2) }}</span>
              </div>
            </el-col>
          </el-row>
        </div>

        <!-- 顾客信息 -->
        <div class="detail-section">
          <h3>顾客信息</h3>
          <el-row :gutter="16">
            <el-col :span="12">
              <div class="detail-item">
                <label>顾客姓名：</label>
                <span>{{ selectedOrder.customerInfo.name }}</span>
              </div>
              <div class="detail-item">
                <label>联系电话：</label>
                <span>{{ selectedOrder.customerInfo.phone }}</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div v-if="selectedOrder.customerInfo.address" class="detail-item">
                <label>配送地址：</label>
                <span>{{ selectedOrder.customerInfo.address }}</span>
              </div>
              <div v-if="selectedOrder.customerInfo.remark" class="detail-item">
                <label>备注：</label>
                <span>{{ selectedOrder.customerInfo.remark }}</span>
              </div>
            </el-col>
          </el-row>
        </div>

        <!-- 商品明细 -->
        <div class="detail-section">
          <h3>商品明细</h3>
          <el-table :data="selectedOrder.items" style="width: 100%">
            <el-table-column label="商品" min-width="200">
              <template #default="{ row }">
                <div class="product-detail">
                  <img :src="row.image" :alt="row.name" class="product-image" />
                  <div class="product-info">
                    <div class="product-name">{{ row.name }}</div>
                    <div class="product-spec">{{ row.spec }}</div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="price" label="单价" width="100">
              <template #default="{ row }">
                ¥{{ row.price.toFixed(2) }}
              </template>
            </el-table-column>
            <el-table-column prop="quantity" label="数量" width="80" />
            <el-table-column label="小计" width="100">
              <template #default="{ row }">
                ¥{{ (row.price * row.quantity).toFixed(2) }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="orderDetailVisible = false">关闭</el-button>
          <el-button type="primary" @click="printOrder(selectedOrder)">打印订单</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Search, Filter, Refresh, Download, ArrowRight, Bell, QuestionFilled, ArrowDown } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'

// 路由
const router = useRouter()
const route = useRoute()

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
    isParentActive: true,
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
        count: 1,
        path: '/products/helper'
      },
      {
        id: 'spec-management',
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

// 搜索和筛选
const searchKeyword = ref('')
const statusFilter = ref('all')
const paymentFilter = ref('all')
const dateRange = ref([])
const minAmount = ref(null)
const maxAmount = ref(null)
const showAdvancedFilter = ref(false)

// 状态选项
const statusOptions = [
  { value: 'all', label: '全部状态' },
  { value: 'completed', label: '已完成' },
  { value: 'cancelled', label: '已取消' },
  { value: 'refunded', label: '已退款' }
]

// 分页
const currentPage = ref(1)
const pageSize = ref(20)
const loading = ref(false)

// 订单详情
const orderDetailVisible = ref(false)
const selectedOrder = ref(null)
const selectedOrders = ref([])

// 模拟历史订单数据
const historyOrders = ref([
  {
    id: 'H001',
    orderNo: 'MT202404201001',
    items: [
      {
        id: 'I001',
        name: '招牌瘦肉粥',
        spec: '大份',
        price: 18.0,
        quantity: 2,
        image: 'https://via.placeholder.com/60x60/FFB800/FFFFFF?text=粥'
      },
      {
        id: 'I002',
        name: '小菜拼盘',
        spec: '标准',
        price: 12.0,
        quantity: 1,
        image: 'https://via.placeholder.com/60x60/409EFF/FFFFFF?text=菜'
      }
    ],
    customerInfo: {
      name: '张先生',
      phone: '138****5678',
      address: '朝阳区三里屯SOHO 2号楼1001室',
      remark: '不要香菜'
    },
    totalAmount: 48.0,
    discountAmount: 5.0,
    paymentMethod: 'wechat',
    status: 'completed',
    createTime: '2024-04-20 12:30:00',
    completeTime: '2024-04-20 13:15:00'
  },
  {
    id: 'H002',
    orderNo: 'MT202404201002',
    items: [
      {
        id: 'I003',
        name: '青菜瘦肉粥',
        spec: '中份',
        price: 16.0,
        quantity: 1,
        image: 'https://via.placeholder.com/60x60/67C23A/FFFFFF?text=粥'
      }
    ],
    customerInfo: {
      name: '李女士',
      phone: '139****1234',
      address: '海淀区中关村大街1号',
      remark: ''
    },
    totalAmount: 16.0,
    discountAmount: 0,
    paymentMethod: 'alipay',
    status: 'completed',
    createTime: '2024-04-20 11:45:00',
    completeTime: '2024-04-20 12:20:00'
  },
  {
    id: 'H003',
    orderNo: 'MT202404201003',
    items: [
      {
        id: 'I004',
        name: '红豆薏米粥',
        spec: '大份',
        price: 14.0,
        quantity: 3,
        image: 'https://via.placeholder.com/60x60/F56C6C/FFFFFF?text=粥'
      },
      {
        id: 'I005',
        name: '酸菜鱼',
        spec: '标准',
        price: 38.0,
        quantity: 1,
        image: 'https://via.placeholder.com/60x60/E6A23C/FFFFFF?text=鱼'
      }
    ],
    customerInfo: {
      name: '王先生',
      phone: '137****9876',
      address: '东城区王府井大街88号',
      remark: '微辣'
    },
    totalAmount: 80.0,
    discountAmount: 8.0,
    paymentMethod: 'cash',
    status: 'cancelled',
    createTime: '2024-04-19 19:20:00',
    cancelTime: '2024-04-19 19:25:00'
  }
])

// 计算属性
const filteredOrders = computed(() => {
  let filtered = historyOrders.value

  // 搜索筛选
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    filtered = filtered.filter(order => 
      order.orderNo.toLowerCase().includes(keyword) ||
      order.customerInfo.name.toLowerCase().includes(keyword) ||
      order.customerInfo.phone.includes(keyword) ||
      order.items.some(item => item.name.toLowerCase().includes(keyword))
    )
  }

  // 状态筛选
  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(order => order.status === statusFilter.value)
  }

  // 支付方式筛选
  if (paymentFilter.value !== 'all') {
    filtered = filtered.filter(order => order.paymentMethod === paymentFilter.value)
  }

  // 日期范围筛选
  if (dateRange.value && dateRange.value.length === 2) {
    const [startDate, endDate] = dateRange.value
    filtered = filtered.filter(order => {
      const orderDate = new Date(order.createTime)
      return orderDate >= startDate && orderDate <= endDate
    })
  }

  // 金额范围筛选
  if (minAmount.value !== null) {
    filtered = filtered.filter(order => order.totalAmount >= minAmount.value)
  }
  if (maxAmount.value !== null) {
    filtered = filtered.filter(order => order.totalAmount <= maxAmount.value)
  }

  return filtered
})

const totalOrders = computed(() => filteredOrders.value.length)
const totalAmount = computed(() => 
  filteredOrders.value.reduce((sum, order) => sum + order.totalAmount, 0)
)
const avgAmount = computed(() => 
  totalOrders.value > 0 ? totalAmount.value / totalOrders.value : 0
)

// 菜单相关方法
const handleMenuClick = (path) => {
  if (path && path !== route.path) {
    router.push(path)
  }
}

const toggleMenu = (menuId) => {
  menuCollapsed.value[menuId] = !menuCollapsed.value[menuId]
}

const isMenuExpanded = (menuId) => {
  return menuCollapsed.value[menuId] === true
}

const isCurrentPage = (path) => {
  return route.path === path
}

const isParentActive = (item) => {
  if (item.isParentActive) return true
  return item.children?.some(child => isCurrentPage(child.path))
}

// 搜索和筛选方法
const handleSearch = () => {
  currentPage.value = 1
}

const handleDateChange = () => {
  currentPage.value = 1
}

const applyAdvancedFilter = () => {
  currentPage.value = 1
  ElMessage.success('筛选条件已应用')
}

const resetAdvancedFilter = () => {
  paymentFilter.value = 'all'
  minAmount.value = null
  maxAmount.value = null
  currentPage.value = 1
  ElMessage.success('筛选条件已重置')
}

// 分页方法
const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1
}

const handleCurrentChange = (val) => {
  currentPage.value = val
}

// 订单操作方法
const handleSelectionChange = (selection) => {
  selectedOrders.value = selection
}

const viewOrderDetail = (order) => {
  selectedOrder.value = order
  orderDetailVisible.value = true
}

const handleCloseDetail = () => {
  orderDetailVisible.value = false
  selectedOrder.value = null
}

const printOrder = (order) => {
  ElMessage.success(`正在打印订单 ${order.orderNo}`)
  // 这里可以集成打印功能
}

const refreshData = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    ElMessage.success('数据已刷新')
  }, 1000)
}

// 工具方法
const getStatusText = (status) => {
  const statusMap = {
    completed: '已完成',
    cancelled: '已取消',
    refunded: '已退款'
  }
  return statusMap[status] || status
}

const getStatusTagType = (status) => {
  const typeMap = {
    completed: 'success',
    cancelled: 'info',
    refunded: 'warning'
  }
  return typeMap[status] || 'info'
}

const getPaymentMethodText = (method) => {
  const methodMap = {
    wechat: '微信支付',
    alipay: '支付宝',
    cash: '现金支付'
  }
  return methodMap[method] || method
}

const getPaymentTagType = (method) => {
  const typeMap = {
    wechat: 'success',
    alipay: 'primary',
    cash: 'warning'
  }
  return typeMap[method] || 'info'
}

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN')
}

const formatTime = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleTimeString('zh-CN', { hour12: false })
}

const formatDateTime = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN', { hour12: false })
}

// 初始化
onMounted(() => {
  // 初始化菜单状态
  menuItems.value.forEach(menu => {
    if (menu.isParent && menu.isParentActive) {
      menuCollapsed.value[menu.id] = true
    }
  })
})
</script>

<style scoped>
.orders-history-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
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

.content-wrapper {
  display: flex;
  min-height: 100vh;
}

/* 左侧边栏样式 */
.sidebar {
  width: 200px;
  background-color: #fff;
  border-right: 1px solid #e4e7ed;
  overflow-y: auto;
}

.menu-list {
  padding: 0;
}

.menu-item {
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
}

.menu-content {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  color: #606266;
  text-decoration: none;
  transition: all 0.3s ease;
}

.menu-item:hover .menu-content {
  background-color: #f5f7fa;
  color: #409eff;
}

.menu-item.active .menu-content {
  background-color: #ecf5ff;
  color: #409eff;
  border-right: 2px solid #409eff;
}

.menu-icon {
  font-size: 16px;
  margin-right: 8px;
  width: 20px;
  text-align: center;
}

.menu-label {
  flex: 1;
  font-size: 14px;
  text-align: left;
}

.menu-count {
  background-color: #f56c6c;
  color: white;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 10px;
  margin-left: 8px;
  min-width: 18px;
  text-align: center;
}

.menu-badge {
  background-color: #67c23a;
  color: white;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 10px;
  margin-left: 8px;
}

.parent-menu {
  position: relative;
}

.submenu-container {
  background-color: #fafafa;
}

.child-menu {
  padding-left: 20px;
}

.child-menu .menu-content {
  padding-left: 40px;
  font-size: 13px;
}

.expand-icon {
  margin-left: 8px;
  transition: transform 0.3s ease;
  font-size: 12px;
}

.expand-icon.expanded {
  transform: rotate(90deg);
}

/* 主内容区域样式 */
.main-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

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
  background: white;
  padding: 16px;
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

/* 高级筛选面板 */
.advanced-filter {
  background: white;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 订单统计 */
.order-stats {
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
}

.stat-item {
  background: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  flex: 1;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.stat-value {
  font-size: 28px;
  font-weight: 600;
  color: #409eff;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #909399;
}

/* 订单列表 */
.order-list {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.product-info {
  display: flex;
  flex-direction: column;
}

.product-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.product-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.product-image {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  object-fit: cover;
}

.product-details {
  flex: 1;
}

.product-name {
  font-size: 14px;
  color: #303133;
  margin-bottom: 2px;
}

.product-spec {
  font-size: 12px;
  color: #909399;
}

.more-products {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

.customer-info {
  display: flex;
  flex-direction: column;
}

.customer-name {
  font-size: 14px;
  color: #303133;
  margin-bottom: 4px;
}

.customer-phone {
  font-size: 12px;
  color: #909399;
}

.amount-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.total-amount {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.discount-amount {
  font-size: 12px;
  color: #67c23a;
  margin-top: 2px;
}

.time-info {
  display: flex;
  flex-direction: column;
}

.time-detail {
  font-size: 12px;
  color: #909399;
  margin-top: 2px;
}

/* 分页 */
.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}

/* 订单详情弹窗 */
.order-detail {
  max-height: 600px;
  overflow-y: auto;
}

.detail-section {
  margin-bottom: 24px;
}

.detail-section h3 {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16px;
  border-bottom: 1px solid #e4e7ed;
  padding-bottom: 8px;
}

.detail-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.detail-item label {
  width: 80px;
  font-size: 14px;
  color: #606266;
  margin-right: 12px;
}

.detail-item span {
  font-size: 14px;
  color: #303133;
}

.detail-item .amount {
  font-weight: 600;
  color: #f56c6c;
}

.detail-item .discount {
  color: #67c23a;
}

.product-detail {
  display: flex;
  align-items: center;
  gap: 12px;
}

.product-detail .product-image {
  width: 50px;
  height: 50px;
}

.product-detail .product-info {
  flex: 1;
}

.product-detail .product-name {
  font-size: 14px;
  color: #303133;
  margin-bottom: 4px;
}

.product-detail .product-spec {
  font-size: 12px;
  color: #909399;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>