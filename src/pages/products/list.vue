<template>
  <div class="product-list-page">
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
        <!-- 顶部操作栏 -->
        <div class="top-actions">
          <div class="action-buttons">
            <el-button type="primary" :icon="Plus" @click="handleAddProduct">新建商品</el-button>
            <el-button :icon="Download" @click="handleImport">批量导入</el-button>
            <el-button :icon="Setting" @click="handleBatchEdit">批量修改/停售</el-button>
            <el-button :icon="Download" @click="handleExport">商品导出</el-button>
          </div>
          <div class="view-options">
            <el-button-group>
              <el-button :class="{ active: viewMode === 'list' }" @click="viewMode = 'list'">列表</el-button>
              <el-button :class="{ active: viewMode === 'grid' }" @click="viewMode = 'grid'">网格</el-button>
            </el-button-group>
          </div>
        </div>

        <!-- 分类标签栏 -->
        <div class="category-tabs">
          <div class="tabs-container">
            <div class="tab-scroll">
              <div 
                v-for="tab in categoryTabs" 
                :key="tab.key"
                :class="['tab-item', { active: activeCategory === tab.key }]"
                @click="activeCategory = tab.key"
              >
                <span class="tab-label">{{ tab.label }}</span>
                <span class="tab-count">{{ tab.count }}</span>
              </div>
            </div>
          </div>
          <div class="tab-actions">
            <el-button text :icon="Setting" @click="handleCategoryManage">分类管理</el-button>
          </div>
        </div>

        <!-- 筛选工具栏 -->
        <div class="filter-toolbar">
          <div class="filter-left">
            <el-input
              v-model="productSearchKeyword"
              placeholder="商品名称/商品编码"
              :prefix-icon="Search"
              style="width: 200px;"
              clearable
              @input="handleProductSearch"
            />
            <el-select v-model="statusFilter" placeholder="商品状态" style="width: 120px; margin-left: 12px;">
              <el-option
                v-for="status in statusOptions"
                :key="status.value"
                :label="status.label"
                :value="status.value"
              />
            </el-select>
            <el-select v-model="sortBy" placeholder="排序方式" style="width: 120px; margin-left: 12px;">
              <el-option
                v-for="sort in sortOptions"
                :key="sort.value"
                :label="sort.label"
                :value="sort.value"
              />
            </el-select>
          </div>
          <div class="filter-right">
            <span class="result-count">共找到 {{ filteredProducts.length }} 个商品</span>
          </div>
        </div>

        <!-- 商品列表 -->
        <div class="product-list" v-if="viewMode === 'list'">
          <div class="list-header">
            <el-checkbox v-model="selectAll" @change="handleSelectAll" />
            <span class="header-item product-info">商品信息</span>
            <span class="header-item price">价格</span>
            <span class="header-item sales">销量</span>
            <span class="header-item stock">库存</span>
            <span class="header-item status">状态</span>
            <span class="header-item actions">操作</span>
          </div>
          
          <div class="list-body">
            <div 
              v-for="product in paginatedProducts" 
              :key="product.id"
              class="product-item"
            >
              <el-checkbox 
                v-model="selectedProducts" 
                :label="product.id"
                @change="handleProductSelect"
              />
              <div class="product-info">
                <img :src="product.image" :alt="product.name" class="product-image" />
                <div class="product-details">
                  <div class="product-name">{{ product.name }}</div>
                  <div class="product-code">商品编码: {{ product.code }}</div>
                  <div class="product-tags">
                    <el-tag 
                      v-for="tag in product.tags" 
                      :key="tag"
                      size="small"
                      class="product-tag"
                    >
                      {{ tag }}
                    </el-tag>
                  </div>
                </div>
              </div>
              <div class="price">
                <div class="current-price">¥{{ product.price.toFixed(2) }}</div>
                <div v-if="product.originalPrice > product.price" class="original-price">
                  ¥{{ product.originalPrice.toFixed(2) }}
                </div>
              </div>
              <div class="sales">{{ product.sales }}</div>
              <div class="stock">
                <span :class="{ 'low-stock': product.stock < 10 }">{{ product.stock }}</span>
              </div>
              <div class="status">
                <el-tag :type="getStatusTagType(product.status)" size="small">
                  {{ getStatusText(product.status) }}
                </el-tag>
              </div>
              <div class="actions">
                <el-button text type="primary" size="small" @click="handleEditProduct(product)">编辑</el-button>
                <el-button text type="warning" size="small" @click="handleToggleStatus(product)">
                  {{ product.status === 'online' ? '下架' : '上架' }}
                </el-button>
                <el-dropdown @command="(command) => handleMoreAction(command, product)">
                  <el-button text size="small">更多<el-icon><ArrowDown /></el-icon></el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item command="copy">复制商品</el-dropdown-item>
                      <el-dropdown-item command="move">移动分类</el-dropdown-item>
                      <el-dropdown-item command="delete" divided>删除</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </div>
          </div>
        </div>

        <!-- 网格视图 -->
        <div class="product-grid" v-else>
          <div 
            v-for="product in paginatedProducts" 
            :key="product.id"
            class="grid-item"
          >
            <div class="grid-item-header">
              <el-checkbox 
                v-model="selectedProducts" 
                :label="product.id"
                @change="handleProductSelect"
              />
              <el-tag :type="getStatusTagType(product.status)" size="small">
                {{ getStatusText(product.status) }}
              </el-tag>
            </div>
            <img :src="product.image" :alt="product.name" class="grid-product-image" />
            <div class="grid-product-info">
              <div class="grid-product-name">{{ product.name }}</div>
              <div class="grid-product-price">
                <span class="current-price">¥{{ product.price.toFixed(2) }}</span>
                <span v-if="product.originalPrice > product.price" class="original-price">
                  ¥{{ product.originalPrice.toFixed(2) }}
                </span>
              </div>
              <div class="grid-product-stats">
                <span>销量: {{ product.sales }}</span>
                <span>库存: {{ product.stock }}</span>
              </div>
            </div>
            <div class="grid-item-actions">
              <el-button text type="primary" size="small" @click="handleEditProduct(product)">编辑</el-button>
              <el-button text type="warning" size="small" @click="handleToggleStatus(product)">
                {{ product.status === 'online' ? '下架' : '上架' }}
              </el-button>
            </div>
          </div>
        </div>

        <!-- 分页 -->
        <div class="pagination-wrapper">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 50, 100]"
            :total="filteredProducts.length"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Search, Filter, Refresh, Download, ArrowRight, Bell, QuestionFilled, ArrowDown, Plus, Setting, Edit, Delete } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'

// 路由
const router = useRouter()
const route = useRoute()

// 搜索关键词
const searchKeyword = ref('')
const productSearchKeyword = ref('')

// 视图模式
const viewMode = ref('list')

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
    isParentActive: true,
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
    icon: '📈',
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
    id: 'activity',
    icon: '🎯',
    label: '营销中心',
    badge: '新',
    path: '/activity'
  },
  {
    id: 'service',
    icon: '🛠️',
    label: '配送服务',
    path: '/service'
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
  products: true // 商品管理默认展开
})

// 分类标签
const categoryTabs = ref([
  { key: 'all', label: '全部商品', count: 458 },
  { key: 'porridge', label: '粥类', count: 156 },
  { key: 'sideDish', label: '小菜', count: 89 },
  { key: 'drink', label: '饮品', count: 67 },
  { key: 'dessert', label: '甜品', count: 45 },
  { key: 'combo', label: '套餐', count: 23 },
  { key: 'seasonal', label: '时令菜', count: 12 },
  { key: 'offline', label: '已下架', count: 66 }
])

const activeCategory = ref('all')

// 筛选选项
const statusFilter = ref('all')
const statusOptions = [
  { value: 'all', label: '全部状态' },
  { value: 'online', label: '在售' },
  { value: 'offline', label: '下架' },
  { value: 'soldOut', label: '售罄' }
]

const sortBy = ref('default')
const sortOptions = [
  { value: 'default', label: '默认排序' },
  { value: 'sales', label: '销量排序' },
  { value: 'price', label: '价格排序' },
  { value: 'stock', label: '库存排序' },
  { value: 'createTime', label: '创建时间' }
]

// 选择相关
const selectAll = ref(false)
const selectedProducts = ref([])

// 分页
const currentPage = ref(1)
const pageSize = ref(20)

// 商品数据
const products = ref([
  {
    id: 'P001',
    name: '新疆兰州拉面金汤白汤火锅（大盒）',
    code: 'SKU001',
    category: 'porridge',
    price: 68.0,
    originalPrice: 78.0,
    image: 'https://via.placeholder.com/80x80/FFB800/FFFFFF?text=面',
    status: 'online',
    sales: 1256,
    stock: 999,
    tags: ['招牌', '热销']
  },
  {
    id: 'P002',
    name: '新疆兰州拉面金汤蜂蜜柚子茶（大盒）',
    code: 'SKU002',
    category: 'drink',
    price: 79.9,
    originalPrice: 89.9,
    image: 'https://via.placeholder.com/80x80/67C23A/FFFFFF?text=茶',
    status: 'online',
    sales: 856,
    stock: 156,
    tags: ['新品']
  },
  {
    id: 'P003',
    name: '正宗海南青菜一斤装（3颗左右）',
    code: 'SKU003',
    category: 'sideDish',
    price: 4.95,
    originalPrice: 6.95,
    image: 'https://via.placeholder.com/80x80/409EFF/FFFFFF?text=菜',
    status: 'online',
    sales: 2341,
    stock: 89,
    tags: ['特价']
  },
  {
    id: 'P004',
    name: '哈密瓜+酸奶杯的组合（650ML）四连杯装',
    code: 'SKU004',
    category: 'dessert',
    price: 24.9,
    originalPrice: 29.9,
    image: 'https://via.placeholder.com/80x80/E6A23C/FFFFFF?text=杯',
    status: 'offline',
    sales: 445,
    stock: 0,
    tags: ['限时']
  },
  {
    id: 'P005',
    name: '红豆薏米粥',
    code: 'SKU005',
    category: 'porridge',
    price: 15.0,
    originalPrice: 18.0,
    image: 'https://via.placeholder.com/80x80/F56C6C/FFFFFF?text=粥',
    status: 'online',
    sales: 678,
    stock: 234,
    tags: ['养生']
  }
])

// 计算属性
const filteredProducts = computed(() => {
  let filtered = products.value

  // 分类筛选
  if (activeCategory.value !== 'all') {
    if (activeCategory.value === 'offline') {
      filtered = filtered.filter(product => product.status === 'offline')
    } else {
      filtered = filtered.filter(product => product.category === activeCategory.value)
    }
  }

  // 状态筛选
  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(product => product.status === statusFilter.value)
  }

  // 搜索筛选
  if (productSearchKeyword.value) {
    const keyword = productSearchKeyword.value.toLowerCase()
    filtered = filtered.filter(product => 
      product.name.toLowerCase().includes(keyword) ||
      product.code.toLowerCase().includes(keyword)
    )
  }

  // 排序
  if (sortBy.value !== 'default') {
    filtered.sort((a, b) => {
      switch (sortBy.value) {
        case 'sales':
          return b.sales - a.sales
        case 'price':
          return a.price - b.price
        case 'stock':
          return b.stock - a.stock
        default:
          return 0
      }
    })
  }

  return filtered
})

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredProducts.value.slice(start, end)
})

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

// 商品操作方法
const handleAddProduct = () => {
  ElMessage.success('跳转到新建商品页面')
}

const handleImport = () => {
  ElMessage.success('批量导入功能')
}

const handleBatchEdit = () => {
  if (selectedProducts.value.length === 0) {
    ElMessage.warning('请先选择商品')
    return
  }
  ElMessage.success('批量修改功能')
}

const handleExport = () => {
  ElMessage.success('商品导出功能')
}

const handleCategoryManage = () => {
  ElMessage.success('分类管理功能')
}

const handleProductSearch = () => {
  currentPage.value = 1
}

const handleSelectAll = (val) => {
  if (val) {
    selectedProducts.value = paginatedProducts.value.map(p => p.id)
  } else {
    selectedProducts.value = []
  }
}

const handleProductSelect = () => {
  selectAll.value = selectedProducts.value.length === paginatedProducts.value.length
}

const handleEditProduct = (product) => {
  ElMessage.success(`编辑商品: ${product.name}`)
}

const handleToggleStatus = (product) => {
  const newStatus = product.status === 'online' ? 'offline' : 'online'
  product.status = newStatus
  ElMessage.success(`商品已${newStatus === 'online' ? '上架' : '下架'}`)
}

const handleMoreAction = (command, product) => {
  switch (command) {
    case 'copy':
      ElMessage.success(`复制商品: ${product.name}`)
      break
    case 'move':
      ElMessage.success(`移动商品: ${product.name}`)
      break
    case 'delete':
      ElMessage.confirm('确定删除该商品吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const index = products.value.findIndex(p => p.id === product.id)
        if (index > -1) {
          products.value.splice(index, 1)
          ElMessage.success('删除成功')
        }
      })
      break
  }
}

// 分页方法
const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1
}

const handleCurrentChange = (val) => {
  currentPage.value = val
}

// 工具方法
const getStatusTagType = (status) => {
  switch (status) {
    case 'online':
      return 'success'
    case 'offline':
      return 'info'
    case 'soldOut':
      return 'warning'
    default:
      return 'info'
  }
}

const getStatusText = (status) => {
  switch (status) {
    case 'online':
      return '在售'
    case 'offline':
      return '下架'
    case 'soldOut':
      return '售罄'
    default:
      return '未知'
  }
}

onMounted(() => {
  // 初始化菜单状态
  menuItems.value.forEach(menu => {
    if (menu.isParent && isParentActive(menu)) {
      menuCollapsed.value[menu.id] = true
    }
  })
})
</script>

<style scoped>
.product-list-page {
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

/* 内容区域 */
.content-wrapper {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* 左侧边栏 */
.sidebar {
  width: 200px;
  background: #fff;
  border-right: 1px solid #e8e8e8;
  overflow-y: auto;
  flex-shrink: 0;
}

.menu-list {
  padding: 12px 0;
}

.menu-item {
  margin: 2px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  color: #333;
}

.menu-item:hover {
  background: #f5f5f5;
}

.menu-item.active {
  background: #e8f4fd;
  color: #409eff;
}

.menu-content {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  color: #333;
}

.parent-menu .menu-content {
  font-weight: 500;
}

.parent-menu.active .menu-content {
  color: #409eff;
  background: #e8f4fd;
}

.child-menu {
  margin-left: 24px;
  margin-right: 12px;
}

.child-menu .menu-content {
  padding: 8px 16px;
  font-size: 14px;
  color: #666;
}

.child-menu:hover .menu-content {
  background: #f0f9ff;
}

.child-menu.active .menu-content {
  background: #e8f4fd;
  color: #409eff;
}

.submenu-container {
  margin-top: 4px;
  margin-bottom: 4px;
}

.expand-icon {
  margin-left: auto;
  transition: transform 0.3s;
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
  display: flex;
  flex-direction: column;
}

/* 顶部操作栏 */
.top-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.view-options .el-button-group .el-button {
  padding: 8px 16px;
}

.view-options .el-button-group .el-button.active {
  background: #409eff;
  color: white;
  border-color: #409eff;
}

/* 分类标签栏 */
.category-tabs {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
}

.tabs-container {
  flex: 1;
  overflow: hidden;
}

.tab-scroll {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.tab-item {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 16px;
  border-radius: 20px;
  background: #f5f5f5;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
  flex-shrink: 0;
  color: #333;
}

.tab-item:hover {
  background: #e8f4fd;
}

.tab-item.active {
  background: #409eff;
  color: white;
}

.tab-label {
  font-size: 14px;
  color: #333;
}

.tab-count {
  font-size: 12px;
  background: rgba(255, 255, 255, 0.3);
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 20px;
  text-align: center;
}

.tab-item.active .tab-count {
  background: rgba(255, 255, 255, 0.3);
}

.tab-actions {
  margin-left: 16px;
}

/* 筛选工具栏 */
.filter-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
}

.filter-left {
  display: flex;
  align-items: center;
}

.result-count {
  font-size: 14px;
  color: #666;
}

/* 商品列表 */
.product-list {
  flex: 1;
  background: #fff;
  margin: 0 20px 20px;
  border-radius: 8px;
  overflow: hidden;
}

.list-header {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  background: #f8f9fa;
  border-bottom: 1px solid #e8e8e8;
  font-weight: 500;
  color: #666;
}

.list-header .el-checkbox {
  margin-right: 20px;
}

.header-item {
  display: flex;
  align-items: center;
}

.header-item.product-info {
  flex: 1;
  min-width: 300px;
}

.header-item.price {
  width: 100px;
  justify-content: center;
}

.header-item.sales {
  width: 80px;
  justify-content: center;
}

.header-item.stock {
  width: 80px;
  justify-content: center;
}

.header-item.status {
  width: 80px;
  justify-content: center;
}

.header-item.actions {
  width: 150px;
  justify-content: center;
}

.list-body {
  max-height: calc(100vh - 400px);
  overflow-y: auto;
}

.product-item {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  transition: all 0.3s;
}

.product-item:hover {
  background: #fafafa;
}

.product-item .el-checkbox {
  margin-right: 20px;
}

.product-info {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 300px;
}

.product-image {
  width: 60px;
  height: 60px;
  border-radius: 6px;
  object-fit: cover;
  margin-right: 12px;
}

.product-details {
  flex: 1;
}

.product-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
  line-height: 1.4;
}

.product-code {
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
}

.product-tags {
  display: flex;
  gap: 4px;
}

.product-tag {
  font-size: 10px;
}

.price {
  width: 100px;
  text-align: center;
}

.current-price {
  font-size: 16px;
  font-weight: 600;
  color: #ff6600;
}

.original-price {
  font-size: 12px;
  color: #999;
  text-decoration: line-through;
  margin-top: 2px;
}

.sales {
  width: 80px;
  text-align: center;
  font-size: 14px;
  color: #333;
}

.stock {
  width: 80px;
  text-align: center;
  font-size: 14px;
  color: #333;
}

.low-stock {
  color: #f56c6c;
  font-weight: 500;
}

.status {
  width: 80px;
  text-align: center;
}

.actions {
  width: 150px;
  display: flex;
  justify-content: center;
  gap: 8px;
}

/* 网格视图 */
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
  padding: 20px;
  flex: 1;
}

.grid-item {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #e8e8e8;
  transition: all 0.3s;
}

.grid-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.grid-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.grid-product-image {
  width: 100%;
  height: 160px;
  border-radius: 6px;
  object-fit: cover;
  margin-bottom: 12px;
}

.grid-product-info {
  margin-bottom: 12px;
}

.grid-product-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.grid-product-price {
  margin-bottom: 8px;
}

.grid-product-price .current-price {
  font-size: 16px;
  font-weight: 600;
  color: #ff6600;
  margin-right: 8px;
}

.grid-product-price .original-price {
  font-size: 12px;
  color: #999;
  text-decoration: line-through;
}

.grid-product-stats {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #666;
}

.grid-item-actions {
  display: flex;
  justify-content: space-between;
  gap: 8px;
}

/* 分页 */
.pagination-wrapper {
  display: flex;
  justify-content: center;
  padding: 20px;
  background: #fff;
  margin: 0 20px 20px;
  border-radius: 8px;
}

/* 响应式 */
@media (max-width: 1200px) {
  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}

@media (max-width: 768px) {
  .sidebar {
    width: 180px;
  }
  
  .top-actions {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
  
  .category-tabs {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
  
  .filter-toolbar {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
  
  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  }
}
</style>