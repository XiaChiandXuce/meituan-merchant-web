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
          <h1 class="page-title">顾客评价</h1>
          <p class="page-description">查看和管理顾客对您店铺的评价，提升服务质量</p>
        </div>
        
        <!-- 评价概览 -->
        <div class="reviews-overview">
          <div class="overview-cards">
            <div class="overview-card">
              <div class="card-icon">⭐</div>
              <div class="card-content">
                <div class="card-title">平均评分</div>
                <div class="card-value">4.6</div>
                <div class="card-trend">+0.2 较上月</div>
              </div>
            </div>
            
            <div class="overview-card">
              <div class="card-icon">💬</div>
              <div class="card-content">
                <div class="card-title">总评价数</div>
                <div class="card-value">2,456</div>
                <div class="card-trend">+156 较上月</div>
              </div>
            </div>
            
            <div class="overview-card">
              <div class="card-icon">👍</div>
              <div class="card-content">
                <div class="card-title">好评率</div>
                <div class="card-value">92.3%</div>
                <div class="card-trend">+1.5% 较上月</div>
              </div>
            </div>
            
            <div class="overview-card">
              <div class="card-icon">⚡</div>
              <div class="card-content">
                <div class="card-title">回复率</div>
                <div class="card-value">85.7%</div>
                <div class="card-trend">+3.2% 较上月</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 评价筛选 -->
        <div class="reviews-filters">
          <div class="filter-section">
            <div class="filter-group">
              <label class="filter-label">评分筛选：</label>
              <el-radio-group v-model="selectedRating" class="rating-filter">
                <el-radio-button label="all">全部</el-radio-button>
                <el-radio-button label="5">5星</el-radio-button>
                <el-radio-button label="4">4星</el-radio-button>
                <el-radio-button label="3">3星</el-radio-button>
                <el-radio-button label="2">2星</el-radio-button>
                <el-radio-button label="1">1星</el-radio-button>
              </el-radio-group>
            </div>
            
            <div class="filter-group">
              <label class="filter-label">回复状态：</label>
              <el-radio-group v-model="selectedReplyStatus" class="reply-filter">
                <el-radio-button label="all">全部</el-radio-button>
                <el-radio-button label="replied">已回复</el-radio-button>
                <el-radio-button label="pending">待回复</el-radio-button>
              </el-radio-group>
            </div>
            
            <div class="filter-group">
              <label class="filter-label">时间范围：</label>
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
            </div>
            
            <div class="filter-group">
              <el-input
                v-model="searchKeyword"
                placeholder="搜索评价内容或顾客昵称"
                :prefix-icon="Search"
                class="search-input"
                clearable
              />
            </div>
          </div>
        </div>

        <!-- 评价列表 -->
        <div class="reviews-list">
          <div class="section-header">
            <h3 class="section-title">评价列表</h3>
            <div class="section-actions">
              <el-button type="primary">批量回复</el-button>
              <el-button>导出数据</el-button>
            </div>
          </div>
          
          <div class="reviews-container">
            <div v-for="review in filteredReviews" :key="review.id" class="review-card">
              <div class="review-header">
                <div class="customer-info">
                  <img :src="review.avatar" alt="顾客头像" class="customer-avatar" />
                  <div class="customer-details">
                    <div class="customer-name">{{ review.customerName }}</div>
                    <div class="review-time">{{ review.createTime }}</div>
                  </div>
                </div>
                <div class="review-rating">
                  <div class="stars">
                    <span v-for="i in 5" :key="i" :class="['star', { filled: i <= review.rating }]">⭐</span>
                  </div>
                  <span class="rating-text">{{ review.rating }}.0分</span>
                </div>
              </div>
              
              <div class="review-content">
                <div class="review-text">{{ review.content }}</div>
                <div v-if="review.images && review.images.length > 0" class="review-images">
                  <img v-for="(image, index) in review.images" :key="index" :src="image" alt="评价图片" class="review-image" />
                </div>
              </div>
              
              <div class="review-order">
                <span class="order-info">订单：{{ review.orderNumber }} | {{ review.orderTime }}</span>
                <span class="order-amount">¥{{ review.orderAmount }}</span>
              </div>
              
              <div v-if="review.reply" class="review-reply">
                <div class="reply-header">
                  <span class="reply-label">商家回复：</span>
                  <span class="reply-time">{{ review.replyTime }}</span>
                </div>
                <div class="reply-content">{{ review.reply }}</div>
              </div>
              
              <div class="review-actions">
                <el-button v-if="!review.reply" type="primary" size="small" @click="replyToReview(review)">回复</el-button>
                <el-button v-else type="text" size="small" @click="editReply(review)">编辑回复</el-button>
                <el-button type="text" size="small" @click="viewOrderDetail(review.orderNumber)">查看订单</el-button>
                <el-dropdown trigger="click">
                  <el-button type="text" size="small">
                    更多
                    <el-icon><ArrowDown /></el-icon>
                  </el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item @click="markAsImportant(review)">标记重要</el-dropdown-item>
                      <el-dropdown-item @click="reportReview(review)">举报评价</el-dropdown-item>
                      <el-dropdown-item divided @click="deleteReview(review)">删除评价</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </div>
          </div>
          
          <!-- 分页 -->
          <div class="pagination-container">
            <el-pagination
              v-model:current-page="currentPage"
              v-model:page-size="pageSize"
              :page-sizes="[10, 20, 50, 100]"
              :total="totalReviews"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 回复对话框 -->
    <el-dialog v-model="replyDialogVisible" title="回复评价" width="600px">
      <div class="reply-dialog">
        <div class="original-review">
          <div class="review-info">
            <span class="customer-name">{{ currentReview?.customerName }}</span>
            <div class="stars">
              <span v-for="i in 5" :key="i" :class="['star', { filled: i <= currentReview?.rating }]">⭐</span>
            </div>
          </div>
          <div class="review-text">{{ currentReview?.content }}</div>
        </div>
        
        <div class="reply-form">
          <el-input
            v-model="replyContent"
            type="textarea"
            :rows="4"
            placeholder="请输入您的回复内容..."
            maxlength="200"
            show-word-limit
          />
          
          <div class="reply-templates">
            <div class="template-label">常用回复模板：</div>
            <div class="template-buttons">
              <el-button size="small" @click="useTemplate('感谢您的好评，我们会继续努力提供更好的服务！')">感谢好评</el-button>
              <el-button size="small" @click="useTemplate('非常抱歉给您带来不好的体验，我们会认真改进，欢迎再次光临！')">道歉改进</el-button>
              <el-button size="small" @click="useTemplate('感谢您的建议，我们会认真考虑并持续改进服务质量。')">接受建议</el-button>
            </div>
          </div>
        </div>
      </div>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="replyDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitReply">发送回复</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Bell, QuestionFilled, ArrowDown, Search, ArrowRight } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

// 路由
const router = useRouter()

// 筛选条件
const selectedRating = ref('all')
const selectedReplyStatus = ref('all')
const dateRange = ref([])
const searchKeyword = ref('')

// 分页
const currentPage = ref(1)
const pageSize = ref(20)
const totalReviews = ref(2456)

// 回复对话框
const replyDialogVisible = ref(false)
const currentReview = ref(null)
const replyContent = ref('')

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
    isParent: true,
    children: [
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

// 评价数据
const reviews = ref([
  {
    id: 1,
    customerName: '张三',
    avatar: 'https://via.placeholder.com/40x40/409EFF/FFFFFF?text=张',
    rating: 5,
    content: '味道很好，配送也很快，包装很用心，下次还会再来的！',
    images: ['https://via.placeholder.com/80x80/FF6600/FFFFFF?text=图1', 'https://via.placeholder.com/80x80/FF6600/FFFFFF?text=图2'],
    createTime: '2024-01-15 18:30',
    orderNumber: 'MT202401150001',
    orderTime: '2024-01-15 17:45',
    orderAmount: 45.8,
    reply: '感谢您的好评，我们会继续努力提供更好的服务！',
    replyTime: '2024-01-15 19:00'
  },
  {
    id: 2,
    customerName: '李四',
    avatar: 'https://via.placeholder.com/40x40/67C23A/FFFFFF?text=李',
    rating: 4,
    content: '整体不错，就是配送稍微慢了一点，希望能改进。',
    images: [],
    createTime: '2024-01-15 16:20',
    orderNumber: 'MT202401150002',
    orderTime: '2024-01-15 15:30',
    orderAmount: 32.5,
    reply: null,
    replyTime: null
  },
  {
    id: 3,
    customerName: '王五',
    avatar: 'https://via.placeholder.com/40x40/E6A23C/FFFFFF?text=王',
    rating: 3,
    content: '味道一般，价格偏贵，性价比不高。',
    images: [],
    createTime: '2024-01-15 14:10',
    orderNumber: 'MT202401150003',
    orderTime: '2024-01-15 13:20',
    orderAmount: 28.0,
    reply: null,
    replyTime: null
  },
  {
    id: 4,
    customerName: '赵六',
    avatar: 'https://via.placeholder.com/40x40/F56C6C/FFFFFF?text=赵',
    rating: 5,
    content: '非常满意！菜品新鲜，口味正宗，配送员态度也很好。',
    images: ['https://via.placeholder.com/80x80/FF6600/FFFFFF?text=图3'],
    createTime: '2024-01-15 12:45',
    orderNumber: 'MT202401150004',
    orderTime: '2024-01-15 12:00',
    orderAmount: 52.3,
    reply: '谢谢您的认可，我们会保持高质量的服务！',
    replyTime: '2024-01-15 13:15'
  },
  {
    id: 5,
    customerName: '孙七',
    avatar: 'https://via.placeholder.com/40x40/909399/FFFFFF?text=孙',
    rating: 2,
    content: '配送太慢了，等了一个多小时，菜都凉了。',
    images: [],
    createTime: '2024-01-15 11:30',
    orderNumber: 'MT202401150005',
    orderTime: '2024-01-15 10:15',
    orderAmount: 38.8,
    reply: null,
    replyTime: null
  }
])

// 菜单折叠状态
const expandedMenus = ref(['customers'])

// 计算属性：筛选后的评价
const filteredReviews = computed(() => {
  let filtered = reviews.value
  
  // 评分筛选
  if (selectedRating.value !== 'all') {
    filtered = filtered.filter(review => review.rating === parseInt(selectedRating.value))
  }
  
  // 回复状态筛选
  if (selectedReplyStatus.value !== 'all') {
    if (selectedReplyStatus.value === 'replied') {
      filtered = filtered.filter(review => review.reply)
    } else if (selectedReplyStatus.value === 'pending') {
      filtered = filtered.filter(review => !review.reply)
    }
  }
  
  // 关键词搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    filtered = filtered.filter(review => 
      review.content.toLowerCase().includes(keyword) ||
      review.customerName.toLowerCase().includes(keyword)
    )
  }
  
  return filtered
})

// 菜单操作方法
const toggleMenu = (menuId) => {
  const index = expandedMenus.value.indexOf(menuId)
  if (index > -1) {
    expandedMenus.value.splice(index, 1)
  } else {
    expandedMenus.value.push(menuId)
  }
}

const isMenuExpanded = (menuId) => {
  return expandedMenus.value.includes(menuId)
}

const isCurrentPage = (path) => {
  return router.currentRoute.value.path === path
}

const isParentActive = (item) => {
  return item.children?.some(child => isCurrentPage(child.path))
}

const handleMenuClick = (path) => {
  if (path) {
    router.push(path)
  }
}

// 评价操作方法
const replyToReview = (review) => {
  currentReview.value = review
  replyContent.value = ''
  replyDialogVisible.value = true
}

const editReply = (review) => {
  currentReview.value = review
  replyContent.value = review.reply
  replyDialogVisible.value = true
}

const useTemplate = (template) => {
  replyContent.value = template
}

const submitReply = () => {
  if (!replyContent.value.trim()) {
    ElMessage.warning('请输入回复内容')
    return
  }
  
  // 更新评价回复
  const review = reviews.value.find(r => r.id === currentReview.value.id)
  if (review) {
    review.reply = replyContent.value
    review.replyTime = new Date().toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  ElMessage.success('回复成功')
  replyDialogVisible.value = false
}

const viewOrderDetail = (orderNumber) => {
  ElMessage.info(`查看订单：${orderNumber}`)
}

const markAsImportant = (review) => {
  ElMessage.success('已标记为重要评价')
}

const reportReview = (review) => {
  ElMessage.info('举报功能开发中')
}

const deleteReview = (review) => {
  ElMessageBox.confirm('确定要删除这条评价吗？', '确认删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const index = reviews.value.findIndex(r => r.id === review.id)
    if (index > -1) {
      reviews.value.splice(index, 1)
      ElMessage.success('删除成功')
    }
  }).catch(() => {
    // 取消删除
  })
}

// 分页方法
const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1
}

const handleCurrentChange = (val) => {
  currentPage.value = val
}

// 页面初始化
onMounted(() => {
  // 初始化数据
})
</script>

<style scoped>
/* 基础布局样式 */
.app-container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

/* 顶部导航栏样式 */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 24px;
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  flex-shrink: 0;
  z-index: 1000;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
}

.navbar-left {
  display: flex;
  align-items: center;
  flex: 1;
  max-width: 600px;
  gap: 20px;
}

.logo {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 8px;
}

.logo-icon {
  font-size: 24px;
  margin-right: 8px;
}

.logo-text {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  white-space: nowrap;
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
  color: #ff6600;
}

.navbar-text {
  font-size: 14px;
  font-weight: 500;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 20px;
  background: #f8f9fa;
  transition: all 0.3s;
  cursor: pointer;
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

/* 评价概览样式 */
.reviews-overview {
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
.reviews-filters {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.filter-section {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: center;
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
}

.rating-filter,
.reply-filter {
  display: flex;
  gap: 4px;
}

.date-picker {
  width: 240px;
}

.search-input {
  width: 240px;
}

/* 评价列表样式 */
.reviews-list {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 20px 0;
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

.reviews-container {
  padding: 20px;
}

.review-card {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 16px;
  transition: box-shadow 0.3s;
}

.review-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.review-card:last-child {
  margin-bottom: 0;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.customer-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.customer-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.customer-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.customer-name {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.review-time {
  font-size: 12px;
  color: #999;
}

.review-rating {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stars {
  display: flex;
  gap: 2px;
}

.star {
  font-size: 14px;
  color: #ddd;
}

.star.filled {
  color: #ff6600;
}

.rating-text {
  font-size: 12px;
  color: #666;
}

.review-content {
  margin-bottom: 12px;
}

.review-text {
  font-size: 14px;
  color: #333;
  line-height: 1.5;
  margin-bottom: 8px;
}

.review-images {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.review-image {
  width: 80px;
  height: 80px;
  border-radius: 4px;
  object-fit: cover;
  cursor: pointer;
  transition: transform 0.3s;
}

.review-image:hover {
  transform: scale(1.05);
}

.review-order {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: #f8f9fa;
  border-radius: 4px;
  margin-bottom: 12px;
}

.order-info {
  font-size: 12px;
  color: #666;
}

.order-amount {
  font-size: 12px;
  font-weight: 600;
  color: #ff6600;
}

.review-reply {
  background: #f0f9ff;
  border-left: 3px solid #409eff;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 12px;
}

.reply-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.reply-label {
  font-size: 12px;
  font-weight: 600;
  color: #409eff;
}

.reply-time {
  font-size: 12px;
  color: #999;
}

.reply-content {
  font-size: 14px;
  color: #333;
  line-height: 1.5;
}

.review-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

/* 分页样式 */
.pagination-container {
  display: flex;
  justify-content: center;
  padding: 20px;
  border-top: 1px solid #e4e7ed;
}

/* 回复对话框样式 */
.reply-dialog {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.original-review {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
}

.review-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.reply-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.reply-templates {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.template-label {
  font-size: 14px;
  color: #666;
}

.template-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .content-wrapper {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
    height: auto;
  }
  
  .main-content {
    padding: 16px;
  }
  
  .overview-cards {
    grid-template-columns: 1fr;
  }
  
  .filter-section {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-group {
    flex-direction: column;
    align-items: stretch;
  }
  
  .date-picker,
  .search-input {
    width: 100%;
  }
  
  .section-header {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
  
  .review-header {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
  
  .review-order {
    flex-direction: column;
    gap: 4px;
    align-items: stretch;
  }
  
  .review-actions {
    flex-wrap: wrap;
  }
}
</style>