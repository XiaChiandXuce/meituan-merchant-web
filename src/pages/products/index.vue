<script setup>
import { ref, onMounted } from 'vue'
import { Search, Filter, Refresh, Download, Bell, QuestionFilled, ArrowDown, Setting, Close, ArrowRight, Plus, Edit, Delete } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

// 路由
const router = useRouter()

// 搜索关键词
const searchKeyword = ref('')

// 商品分类筛选
const activeTab = ref('all')
const productTabs = ref([
  { key: 'all', label: '全部商品', count: 156 },
  { key: 'porridge', label: '粥类', count: 45 },
  { key: 'sideDish', label: '小菜', count: 32 },
  { key: 'drink', label: '饮品', count: 28 },
  { key: 'dessert', label: '甜品', count: 18 },
  { key: 'combo', label: '套餐', count: 12 },
  { key: 'seasonal', label: '时令菜', count: 8 },
  { key: 'offline', label: '已下架', count: 13 }
])

// 商品状态筛选
const statusFilter = ref('all')
const statusOptions = [
  { value: 'all', label: '全部状态' },
  { value: 'online', label: '在售' },
  { value: 'offline', label: '下架' },
  { value: 'soldOut', label: '售罄' }
]

// 商品列表数据
const productList = ref([
  {
    id: 'P001',
    name: '招牌瘦肉粥',
    category: '粥类',
    price: 18.0,
    originalPrice: 20.0,
    image: 'https://via.placeholder.com/80x80/FFB800/FFFFFF?text=粥',
    status: 'online',
    statusText: '在售',
    statusColor: '#67C23A',
    sales: 1256,
    stock: 999,
    description: '精选优质大米，慢火熬煮3小时，肉质鲜嫩',
    tags: ['招牌', '热销'],
    createTime: '2024-01-15',
    updateTime: '2024-04-20'
  },
  {
    id: 'P002',
    name: '青菜瘦肉粥',
    category: '粥类',
    price: 16.0,
    originalPrice: 18.0,
    image: 'https://via.placeholder.com/80x80/67C23A/FFFFFF?text=粥',
    status: 'online',
    statusText: '在售',
    statusColor: '#67C23A',
    sales: 892,
    stock: 999,
    description: '新鲜青菜配瘦肉，营养丰富',
    tags: ['健康'],
    createTime: '2024-01-20',
    updateTime: '2024-04-18'
  },
  {
    id: 'P003',
    name: '小菜拼盘',
    category: '小菜',
    price: 12.0,
    originalPrice: 15.0,
    image: 'https://via.placeholder.com/80x80/409EFF/FFFFFF?text=菜',
    status: 'online',
    statusText: '在售',
    statusColor: '#67C23A',
    sales: 567,
    stock: 50,
    description: '四种精选小菜组合，开胃下饭',
    tags: ['组合'],
    createTime: '2024-02-01',
    updateTime: '2024-04-15'
  },
  {
    id: 'P004',
    name: '红豆薏米粥',
    category: '粥类',
    price: 14.0,
    originalPrice: 16.0,
    image: 'https://via.placeholder.com/80x80/F56C6C/FFFFFF?text=粥',
    status: 'soldOut',
    statusText: '售罄',
    statusColor: '#F56C6C',
    sales: 234,
    stock: 0,
    description: '养生粥品，祛湿美容',
    tags: ['养生'],
    createTime: '2024-02-10',
    updateTime: '2024-04-22'
  },
  {
    id: 'P005',
    name: '玉米汁',
    category: '饮品',
    price: 8.0,
    originalPrice: 10.0,
    image: 'https://via.placeholder.com/80x80/E6A23C/FFFFFF?text=饮',
    status: 'offline',
    statusText: '已下架',
    statusColor: '#909399',
    sales: 123,
    stock: 30,
    description: '新鲜玉米现榨，香甜可口',
    tags: ['饮品'],
    createTime: '2024-03-01',
    updateTime: '2024-04-10'
  }
])

// 右侧设置面板
const showSettingsPanel = ref(false)

// 菜单点击处理
const handleMenuClick = (route) => {
  if (route) {
    router.push(route)
  }
}

// 切换设置面板
const toggleSettingsPanel = () => {
  showSettingsPanel.value = !showSettingsPanel.value
}

// 搜索处理
const handleSearch = () => {
  console.log('搜索商品:', searchKeyword.value)
  ElMessage.success('搜索功能开发中')
}

// 刷新处理
const handleRefresh = () => {
  ElMessage.success('数据已刷新')
}

// 导出处理
const handleExport = () => {
  ElMessage.success('导出功能开发中')
}

// 添加商品
const handleAddProduct = () => {
  ElMessage.success('添加商品功能开发中')
}

// 编辑商品
const handleEditProduct = (product) => {
  console.log('编辑商品:', product)
  ElMessage.success('编辑商品功能开发中')
}

// 删除商品
const handleDeleteProduct = (product) => {
  console.log('删除商品:', product)
  ElMessage.warning('删除商品功能开发中')
}

// 切换商品状态
const toggleProductStatus = (product) => {
  if (product.status === 'online') {
    product.status = 'offline'
    product.statusText = '已下架'
    product.statusColor = '#909399'
    ElMessage.success('商品已下架')
  } else if (product.status === 'offline') {
    product.status = 'online'
    product.statusText = '在售'
    product.statusColor = '#67C23A'
    ElMessage.success('商品已上架')
  }
}

// 获取状态颜色
const getStatusColor = (status) => {
  const colorMap = {
    online: '#67C23A',
    offline: '#909399',
    soldOut: '#F56C6C'
  }
  return colorMap[status] || '#909399'
}

// 组件挂载
onMounted(() => {
  console.log('商品管理页面已加载')
})
</script>

<template>
  <div class="merchant-layout">
    <!-- 顶部导航栏 -->
    <div class="top-navbar">
      <div class="navbar-left">
        <div class="navbar-title">
          <span class="logo-icon">🍜</span>
          <span class="title-text">美团外卖·商家中心</span>
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
          <el-badge :value="5" class="notification-badge">
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

    <!-- 内容包装器 -->
    <div class="content-wrapper">
      <!-- 左侧边栏 -->
      <div class="sidebar">
        <div class="menu-list">
          <div class="menu-item" @click="handleMenuClick('/home')">
             <span class="menu-icon">📊</span>
             <span class="menu-label">商家首页</span>
           </div>
           <div class="menu-item" @click="handleMenuClick('/orders')">
             <span class="menu-icon">📋</span>
             <span class="menu-label">订单管理</span>
             <span class="menu-count">12</span>
           </div>
           <div class="menu-item">
             <span class="menu-icon">⏰</span>
             <span class="menu-label">待处理</span>
             <span class="menu-count">12</span>
           </div>
           <div class="menu-item">
             <span class="menu-icon">📜</span>
             <span class="menu-label">历史订单</span>
           </div>
           <div class="menu-item active">
             <span class="menu-icon">🏪</span>
             <span class="menu-label">商品管理</span>
             <span class="menu-count">1</span>
           </div>
           <div class="menu-item">
             <span class="menu-label">商品列表</span>
           </div>
           <div class="menu-item">
             <span class="menu-label">商品助手</span>
             <span class="menu-count">1</span>
           </div>
           <div class="menu-item">
             <span class="menu-label">规格管理</span>
           </div>
           <div class="menu-item" @click="handleMenuClick('/customers')">
             <span class="menu-icon">👥</span>
             <span class="menu-label">顾客管理</span>
             <span class="menu-badge">新</span>
           </div>
           <div class="menu-item" @click="handleMenuClick('/finance')">
             <span class="menu-icon">💰</span>
             <span class="menu-label">财务管理</span>
           </div>
           <div class="menu-item" @click="handleMenuClick('/analytics')">
             <span class="menu-icon">📊</span>
             <span class="menu-label">经营分析</span>
           </div>
           <div class="menu-item" @click="handleMenuClick('/marketing')">
             <span class="menu-icon">📢</span>
             <span class="menu-label">门店推广</span>
           </div>
           <div class="menu-item" @click="handleMenuClick('/activities')">
             <span class="menu-icon">🎯</span>
             <span class="menu-label">活动中心</span>
             <span class="menu-badge">新</span>
           </div>
           <div class="menu-item">
             <span class="menu-icon">⚙️</span>
             <span class="menu-label">向左收起</span>
           </div>
        </div>
      </div>

      <!-- 主内容区域 -->
      <div class="main-content">
        <!-- 右侧设置面板切换按钮 -->
        <div class="settings-toggle" @click="toggleSettingsPanel">
          <el-icon><Setting /></el-icon>
          <span>设置</span>
        </div>
        
        <div class="products-container">
          <!-- 页面标题 -->
          <div class="page-header">
            <h1 class="page-title">商品管理</h1>
            <div class="header-actions">
              <el-button :icon="Plus" type="primary" @click="handleAddProduct">添加商品</el-button>
              <el-button :icon="Refresh" @click="handleRefresh">刷新</el-button>
              <el-button :icon="Download" @click="handleExport">导出</el-button>
            </div>
          </div>

          <!-- 筛选工具栏 -->
          <div class="filter-toolbar">
            <div class="filter-left">
              <el-select v-model="statusFilter" placeholder="商品状态" style="width: 120px">
                <el-option
                  v-for="option in statusOptions"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
              <el-input
                v-model="searchKeyword"
                placeholder="搜索商品名称"
                :prefix-icon="Search"
                style="width: 200px"
                clearable
              />
            </div>
            <div class="filter-right">
              <el-button :icon="Filter">筛选</el-button>
            </div>
          </div>

          <!-- 商品分类标签 -->
          <div class="product-tabs">
            <div 
              v-for="tab in productTabs" 
              :key="tab.key"
              :class="['tab-item', { active: activeTab === tab.key }]"
              @click="activeTab = tab.key"
            >
              <span class="tab-label">{{ tab.label }}</span>
              <span class="tab-count">({{ tab.count }})</span>
            </div>
          </div>

          <!-- 商品列表 -->
          <div class="product-list">
            <div 
              v-for="product in productList" 
              :key="product.id"
              class="product-card"
            >
              <div class="product-image">
                <img :src="product.image" :alt="product.name" />
                <div class="product-status" :style="{ backgroundColor: getStatusColor(product.status) }">
                  {{ product.statusText }}
                </div>
              </div>
              
              <div class="product-info">
                <div class="product-header">
                  <h3 class="product-name">{{ product.name }}</h3>
                  <div class="product-tags">
                    <el-tag 
                      v-for="tag in product.tags" 
                      :key="tag"
                      size="small"
                      type="warning"
                    >
                      {{ tag }}
                    </el-tag>
                  </div>
                </div>
                
                <div class="product-description">{{ product.description }}</div>
                
                <div class="product-details">
                  <div class="detail-item">
                    <span class="detail-label">分类：</span>
                    <span class="detail-value">{{ product.category }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">销量：</span>
                    <span class="detail-value">{{ product.sales }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">库存：</span>
                    <span class="detail-value" :class="{ 'low-stock': product.stock < 10 }">
                      {{ product.stock }}
                    </span>
                  </div>
                </div>
              </div>
              
              <div class="product-price">
                <div class="current-price">¥{{ product.price.toFixed(2) }}</div>
                <div v-if="product.originalPrice > product.price" class="original-price">
                  ¥{{ product.originalPrice.toFixed(2) }}
                </div>
              </div>
              
              <div class="product-actions">
                <el-button 
                  size="small" 
                  :icon="Edit" 
                  @click="handleEditProduct(product)"
                >
                  编辑
                </el-button>
                <el-button 
                  size="small" 
                  :type="product.status === 'online' ? 'warning' : 'success'"
                  @click="toggleProductStatus(product)"
                >
                  {{ product.status === 'online' ? '下架' : '上架' }}
                </el-button>
                <el-button 
                  size="small" 
                  type="danger" 
                  :icon="Delete"
                  @click="handleDeleteProduct(product)"
                >
                  删除
                </el-button>
              </div>
            </div>
          </div>

          <!-- 分页 -->
          <div class="pagination-wrapper">
            <el-pagination
              background
              layout="prev, pager, next, sizes, total"
              :total="156"
              :page-size="10"
              :page-sizes="[10, 20, 50, 100]"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧设置面板 -->
    <div v-if="showSettingsPanel" class="settings-panel">
      <div class="settings-header">
        <h3>页面设置</h3>
        <el-icon class="close-icon" @click="toggleSettingsPanel"><Close /></el-icon>
      </div>
      <div class="settings-content">
        <div class="setting-item">
          <label>显示密度</label>
          <el-radio-group>
            <el-radio label="compact">紧凑</el-radio>
            <el-radio label="normal">标准</el-radio>
            <el-radio label="loose">宽松</el-radio>
          </el-radio-group>
        </div>
        <div class="setting-item">
          <label>列表样式</label>
          <el-radio-group>
            <el-radio label="card">卡片</el-radio>
            <el-radio label="list">列表</el-radio>
          </el-radio-group>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 整体布局 */
.merchant-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
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

/* 左侧边栏 */
.sidebar {
  width: 200px;
  background: white;
  border-right: 1px solid #e8e8e8;
  overflow-y: auto;
}

.menu-list {
  padding: 0;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.3s;
  border-bottom: 1px solid #f5f5f5;
  color: #333;
}

.menu-item:hover {
  background-color: #f8f9fa;
}

.menu-item.active {
  background-color: #e3f2fd;
  border-right: 3px solid #409EFF;
  color: #409EFF;
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
  background: #ff4d4f;
  color: white;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
}

.menu-badge {
  background: #52c41a;
  color: white;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 2px;
}

/* 主内容区域 */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

.settings-toggle {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  background: white;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 100;
  transition: all 0.3s;
}

.settings-toggle:hover {
  background-color: #f5f5f5;
}

.settings-toggle span {
  margin-left: 4px;
  font-size: 12px;
}

.products-container {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  background: #f5f5f5;
}

/* 页面标题 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 24px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.page-title {
  font-size: 24px;
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
  margin-bottom: 24px;
  padding: 16px 24px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.filter-left {
  display: flex;
  gap: 12px;
  align-items: center;
}

.filter-right {
  display: flex;
  gap: 12px;
}

/* 商品分类标签 */
.product-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  padding: 16px 24px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
}

.tab-item {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  background: white;
  border: 1px solid #e8e8e8;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
  color: #333;
}

.tab-item:hover {
  border-color: #409EFF;
  color: #409EFF;
}

.tab-item.active {
  background: #409EFF;
  border-color: #409EFF;
  color: white;
}

.tab-label {
  font-size: 14px;
}

.tab-count {
  font-size: 12px;
  margin-left: 4px;
  opacity: 0.8;
}

/* 商品列表 */
.product-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
  padding: 24px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.product-card {
  background: #f8f9fa;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 16px;
  transition: all 0.3s;
  display: flex;
  gap: 16px;
}

.product-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #409EFF;
}

.product-image {
  position: relative;
  flex-shrink: 0;
}

.product-image img {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
}

.product-status {
  position: absolute;
  top: -5px;
  right: -5px;
  padding: 2px 6px;
  border-radius: 10px;
  color: white;
  font-size: 10px;
  font-weight: bold;
}

.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.product-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.product-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
  line-height: 1.4;
}

.product-tags {
  display: flex;
  gap: 4px;
}

.product-description {
  font-size: 12px;
  color: #666;
  line-height: 1.4;
}

.product-details {
  display: flex;
  gap: 16px;
}

.detail-item {
  font-size: 12px;
}

.detail-label {
  color: #999;
}

.detail-value {
  color: #333;
  font-weight: 500;
}

.detail-value.low-stock {
  color: #ff4d4f;
}

.product-price {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
}

.current-price {
  font-size: 18px;
  font-weight: 600;
  color: #ff4d4f;
}

.original-price {
  font-size: 12px;
  color: #999;
  text-decoration: line-through;
}

.product-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-end;
}

/* 分页 */
.pagination-wrapper {
  display: flex;
  justify-content: center;
  padding: 20px 0;
}

/* 右侧设置面板 */
.settings-panel {
  position: fixed;
  top: 0;
  right: 0;
  width: 300px;
  height: 100vh;
  background: white;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
  z-index: 1001;
  display: flex;
  flex-direction: column;
}

.settings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e8e8e8;
}

.settings-header h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.close-icon {
  cursor: pointer;
  font-size: 18px;
  color: #666;
}

.close-icon:hover {
  color: #333;
}

.settings-content {
  flex: 1;
  padding: 20px;
}

.setting-item {
  margin-bottom: 24px;
}

.setting-item label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #333;
  font-weight: 500;
}
</style>