<template>
  <div class="account-management">
    <!-- 顶部导航栏 -->
    <div class="top-nav">
      <div class="nav-left">
        <div class="logo">
          <span class="logo-icon">🍃</span>
          <span class="logo-text">美团外卖</span>
        </div>
        <span class="nav-title">商家中心</span>
      </div>
      <div class="nav-right">
        <div class="search-box">
          <input type="text" placeholder="订单号/会员号/手机号/商品名称/地址" />
          <button class="search-btn">🔍</button>
        </div>
        <div class="user-info">
          <span class="username">张三</span>
          <span class="dropdown-arrow">▼</span>
        </div>
      </div>
    </div>

    <div class="main-container">
      <!-- 左侧导航菜单 -->
      <div class="sidebar">
        <div class="menu-item" v-for="menu in menuItems" :key="menu.id" :class="{ active: menu.id === 'finance' }">
          <div class="menu-header" @click="toggleMenu(menu.id)">
            <span class="menu-icon">{{ menu.icon }}</span>
            <span class="menu-label">{{ menu.label }}</span>
            <span class="expand-icon" v-if="menu.children" :class="{ expanded: expandedMenus.includes(menu.id) }">▶</span>
          </div>
          <div class="submenu" v-if="menu.children && expandedMenus.includes(menu.id)">
            <div class="submenu-item" v-for="child in menu.children" :key="child.id" :class="{ active: child.id === 'account-management' }">
              <span class="submenu-icon">{{ child.icon }}</span>
              <span class="submenu-label">{{ child.label }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 主内容区域 -->
      <div class="content">
        <!-- 页面标题 -->
        <div class="page-header">
          <h1>账户管理</h1>
          <div class="breadcrumb">
            <span>财务管理</span> > <span class="current">账户管理</span>
          </div>
        </div>

        <!-- 账户概览 -->
        <div class="account-overview">
          <div class="overview-card">
            <div class="card-header">
              <h3>账户余额</h3>
              <span class="refresh-btn" @click="refreshBalance">🔄</span>
            </div>
            <div class="balance-info">
              <div class="balance-item">
                <span class="label">可用余额</span>
                <span class="amount available">¥ {{ accountInfo.availableBalance.toLocaleString() }}</span>
              </div>
              <div class="balance-item">
                <span class="label">冻结金额</span>
                <span class="amount frozen">¥ {{ accountInfo.frozenAmount.toLocaleString() }}</span>
              </div>
              <div class="balance-item">
                <span class="label">总余额</span>
                <span class="amount total">¥ {{ accountInfo.totalBalance.toLocaleString() }}</span>
              </div>
            </div>
          </div>

          <div class="overview-card">
            <div class="card-header">
              <h3>今日统计</h3>
            </div>
            <div class="stats-info">
              <div class="stat-item">
                <span class="label">今日收入</span>
                <span class="amount income">¥ {{ todayStats.income.toLocaleString() }}</span>
              </div>
              <div class="stat-item">
                <span class="label">今日支出</span>
                <span class="amount expense">¥ {{ todayStats.expense.toLocaleString() }}</span>
              </div>
              <div class="stat-item">
                <span class="label">交易笔数</span>
                <span class="count">{{ todayStats.transactionCount }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 操作区域 -->
        <div class="action-section">
          <div class="action-buttons">
            <button class="btn btn-primary" @click="showRechargeModal = true">充值</button>
            <button class="btn btn-secondary" @click="showWithdrawModal = true">提现</button>
            <button class="btn btn-secondary" @click="exportTransactions">导出明细</button>
          </div>
          
          <div class="filter-section">
            <div class="filter-item">
              <label>交易类型：</label>
              <select v-model="filters.transactionType">
                <option value="">全部</option>
                <option value="income">收入</option>
                <option value="expense">支出</option>
                <option value="recharge">充值</option>
                <option value="withdraw">提现</option>
              </select>
            </div>
            <div class="filter-item">
              <label>时间范围：</label>
              <input type="date" v-model="filters.startDate" />
              <span>至</span>
              <input type="date" v-model="filters.endDate" />
            </div>
            <button class="btn btn-primary" @click="searchTransactions">查询</button>
            <button class="btn btn-secondary" @click="resetFilters">重置</button>
          </div>
        </div>

        <!-- 交易明细列表 -->
        <div class="transaction-list">
          <div class="list-header">
            <h3>交易明细</h3>
            <div class="list-actions">
              <span class="total-count">共 {{ totalTransactions }} 条记录</span>
            </div>
          </div>

          <div class="table-container">
            <table class="transaction-table">
              <thead>
                <tr>
                  <th>交易时间</th>
                  <th>交易类型</th>
                  <th>交易金额</th>
                  <th>余额变动</th>
                  <th>交易描述</th>
                  <th>交易状态</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="transaction in transactions" :key="transaction.id">
                  <td>{{ formatDateTime(transaction.createTime) }}</td>
                  <td>
                    <span class="transaction-type" :class="transaction.type">
                      {{ getTransactionTypeText(transaction.type) }}
                    </span>
                  </td>
                  <td>
                    <span class="amount" :class="transaction.type">
                      {{ transaction.type === 'income' || transaction.type === 'recharge' ? '+' : '-' }}
                      ¥{{ Math.abs(transaction.amount).toLocaleString() }}
                    </span>
                  </td>
                  <td>¥{{ transaction.balanceAfter.toLocaleString() }}</td>
                  <td>{{ transaction.description }}</td>
                  <td>
                    <span class="status" :class="transaction.status">
                      {{ getStatusText(transaction.status) }}
                    </span>
                  </td>
                  <td>
                    <button class="btn btn-link" @click="viewTransactionDetail(transaction)">详情</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- 分页 -->
          <div class="pagination">
            <button class="btn btn-secondary" :disabled="currentPage === 1" @click="changePage(currentPage - 1)">上一页</button>
            <span class="page-info">第 {{ currentPage }} 页，共 {{ totalPages }} 页</span>
            <button class="btn btn-secondary" :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)">下一页</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 充值弹窗 -->
    <div class="modal" v-if="showRechargeModal" @click="showRechargeModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>账户充值</h3>
          <button class="close-btn" @click="showRechargeModal = false">×</button>
        </div>
        <div class="modal-body">
          <div class="form-item">
            <label>充值金额：</label>
            <input type="number" v-model="rechargeAmount" placeholder="请输入充值金额" />
          </div>
          <div class="form-item">
            <label>支付方式：</label>
            <select v-model="paymentMethod">
              <option value="alipay">支付宝</option>
              <option value="wechat">微信支付</option>
              <option value="bank">银行卡</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="showRechargeModal = false">取消</button>
          <button class="btn btn-primary" @click="confirmRecharge">确认充值</button>
        </div>
      </div>
    </div>

    <!-- 提现弹窗 -->
    <div class="modal" v-if="showWithdrawModal" @click="showWithdrawModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>账户提现</h3>
          <button class="close-btn" @click="showWithdrawModal = false">×</button>
        </div>
        <div class="modal-body">
          <div class="form-item">
            <label>提现金额：</label>
            <input type="number" v-model="withdrawAmount" placeholder="请输入提现金额" />
            <span class="hint">可提现余额：¥{{ accountInfo.availableBalance.toLocaleString() }}</span>
          </div>
          <div class="form-item">
            <label>提现账户：</label>
            <select v-model="withdrawAccount">
              <option value="bank1">招商银行 ****1234</option>
              <option value="bank2">工商银行 ****5678</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="showWithdrawModal = false">取消</button>
          <button class="btn btn-primary" @click="confirmWithdraw">确认提现</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AccountManagement',
  data() {
    return {
      // 菜单展开状态
      expandedMenus: ['finance'],
      
      // 账户信息
      accountInfo: {
        availableBalance: 15680.50,
        frozenAmount: 2340.00,
        totalBalance: 18020.50
      },
      
      // 今日统计
      todayStats: {
        income: 3250.80,
        expense: 1180.30,
        transactionCount: 28
      },
      
      // 筛选条件
      filters: {
        transactionType: '',
        startDate: '',
        endDate: ''
      },
      
      // 交易记录
      transactions: [
        {
          id: 1,
          createTime: '2024-01-15 14:30:25',
          type: 'income',
          amount: 128.50,
          balanceAfter: 15680.50,
          description: '订单收入 - 订单号：MT20240115001',
          status: 'completed'
        },
        {
          id: 2,
          createTime: '2024-01-15 13:45:12',
          type: 'expense',
          amount: -25.00,
          balanceAfter: 15552.00,
          description: '平台服务费',
          status: 'completed'
        },
        {
          id: 3,
          createTime: '2024-01-15 12:20:08',
          type: 'recharge',
          amount: 1000.00,
          balanceAfter: 15577.00,
          description: '账户充值',
          status: 'completed'
        },
        {
          id: 4,
          createTime: '2024-01-15 11:15:33',
          type: 'withdraw',
          amount: -500.00,
          balanceAfter: 14577.00,
          description: '提现到银行卡',
          status: 'processing'
        },
        {
          id: 5,
          createTime: '2024-01-15 10:30:45',
          type: 'income',
          amount: 89.80,
          balanceAfter: 15077.00,
          description: '订单收入 - 订单号：MT20240115002',
          status: 'completed'
        }
      ],
      
      // 分页信息
      currentPage: 1,
      pageSize: 10,
      totalTransactions: 156,
      
      // 弹窗状态
      showRechargeModal: false,
      showWithdrawModal: false,
      
      // 充值提现表单
      rechargeAmount: '',
      paymentMethod: 'alipay',
      withdrawAmount: '',
      withdrawAccount: 'bank1',
      
      // 菜单数据
      menuItems: [
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
          path: '/orders'
        },
        {
          id: 'products',
          icon: '🛍️',
          label: '商品管理',
          path: '/products'
        },
        {
          id: 'customers',
          icon: '👥',
          label: '顾客管理',
          path: '/customers'
        },
        {
          id: 'finance',
          icon: '💰',
          label: '财务管理',
          path: '/finance',
          children: [
            {
              id: 'reconciliation',
              icon: '📊',
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
            },
            {
              id: 'bill-reconciliation',
              icon: '📋',
              label: '账单对账',
              path: '/finance/bill-reconciliation'
            },
            {
              id: 'order-query',
              icon: '🔍',
              label: '订单查询',
              path: '/finance/order-query'
            },
            {
              id: 'account-management',
              icon: '🏦',
              label: '账户管理',
              path: '/finance/account-management'
            }
          ]
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
        }
      ]
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalTransactions / this.pageSize)
    }
  },
  methods: {
    // 切换菜单展开状态
    toggleMenu(menuId) {
      const index = this.expandedMenus.indexOf(menuId)
      if (index > -1) {
        this.expandedMenus.splice(index, 1)
      } else {
        this.expandedMenus.push(menuId)
      }
    },
    
    // 刷新余额
    refreshBalance() {
      // 模拟刷新余额
      console.log('刷新账户余额')
    },
    
    // 搜索交易记录
    searchTransactions() {
      console.log('搜索交易记录', this.filters)
      // 这里应该调用API搜索交易记录
    },
    
    // 重置筛选条件
    resetFilters() {
      this.filters = {
        transactionType: '',
        startDate: '',
        endDate: ''
      }
      this.searchTransactions()
    },
    
    // 导出交易明细
    exportTransactions() {
      console.log('导出交易明细')
      // 这里应该调用API导出交易明细
    },
    
    // 确认充值
    confirmRecharge() {
      if (!this.rechargeAmount || this.rechargeAmount <= 0) {
        alert('请输入有效的充值金额')
        return
      }
      console.log('充值', this.rechargeAmount, this.paymentMethod)
      // 这里应该调用充值API
      this.showRechargeModal = false
      this.rechargeAmount = ''
    },
    
    // 确认提现
    confirmWithdraw() {
      if (!this.withdrawAmount || this.withdrawAmount <= 0) {
        alert('请输入有效的提现金额')
        return
      }
      if (this.withdrawAmount > this.accountInfo.availableBalance) {
        alert('提现金额不能超过可用余额')
        return
      }
      console.log('提现', this.withdrawAmount, this.withdrawAccount)
      // 这里应该调用提现API
      this.showWithdrawModal = false
      this.withdrawAmount = ''
    },
    
    // 查看交易详情
    viewTransactionDetail(transaction) {
      console.log('查看交易详情', transaction)
      // 这里可以打开详情弹窗或跳转到详情页
    },
    
    // 切换页码
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page
        this.searchTransactions()
      }
    },
    
    // 格式化日期时间
    formatDateTime(dateTime) {
      return dateTime
    },
    
    // 获取交易类型文本
    getTransactionTypeText(type) {
      const typeMap = {
        income: '收入',
        expense: '支出',
        recharge: '充值',
        withdraw: '提现'
      }
      return typeMap[type] || type
    },
    
    // 获取状态文本
    getStatusText(status) {
      const statusMap = {
        completed: '已完成',
        processing: '处理中',
        failed: '失败',
        cancelled: '已取消'
      }
      return statusMap[status] || status
    }
  },
  
  mounted() {
    // 初始化时设置默认日期范围
    const today = new Date()
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    this.filters.endDate = today.toISOString().split('T')[0]
    this.filters.startDate = lastWeek.toISOString().split('T')[0]
  }
}
</script>

<style scoped>
.account-management {
  min-height: 100vh;
  background-color: #f5f5f5;
}

/* 顶部导航栏样式 */
.top-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 0 20px;
  height: 60px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 20px;
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
  font-weight: bold;
  color: #333;
}

.nav-title {
  font-size: 16px;
  color: #666;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.search-box {
  display: flex;
  align-items: center;
  background: #f8f9fa;
  border-radius: 20px;
  padding: 8px 16px;
  width: 300px;
}

.search-box input {
  border: none;
  background: none;
  outline: none;
  flex: 1;
  font-size: 14px;
}

.search-btn {
  border: none;
  background: none;
  cursor: pointer;
  font-size: 16px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.username {
  font-size: 14px;
  color: #333;
}

.dropdown-arrow {
  font-size: 12px;
  color: #666;
}

/* 主容器样式 */
.main-container {
  display: flex;
  min-height: calc(100vh - 60px);
}

/* 侧边栏样式 */
.sidebar {
  width: 200px;
  background: white;
  border-right: 1px solid #e0e0e0;
  padding: 20px 0;
}

.menu-item {
  margin-bottom: 4px;
}

.menu-header {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.menu-header:hover {
  background-color: #f8f9fa;
}

.menu-item.active .menu-header {
  background-color: #fff7e6;
  border-right: 3px solid #ffa940;
}

.menu-icon {
  font-size: 16px;
  margin-right: 8px;
}

.menu-label {
  flex: 1;
  font-size: 14px;
  color: #333;
}

.expand-icon {
  font-size: 12px;
  color: #666;
  transition: transform 0.2s;
}

.expand-icon.expanded {
  transform: rotate(90deg);
}

.submenu {
  background-color: #f8f9fa;
}

.submenu-item {
  display: flex;
  align-items: center;
  padding: 10px 20px 10px 40px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submenu-item:hover {
  background-color: #e9ecef;
}

.submenu-item.active {
  background-color: #fff7e6;
  border-right: 3px solid #ffa940;
}

.submenu-icon {
  font-size: 14px;
  margin-right: 8px;
}

.submenu-label {
  font-size: 13px;
  color: #555;
}

/* 内容区域样式 */
.content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.page-header {
  margin-bottom: 20px;
}

.page-header h1 {
  font-size: 24px;
  color: #333;
  margin: 0 0 8px 0;
}

.breadcrumb {
  font-size: 14px;
  color: #666;
}

.breadcrumb .current {
  color: #ffa940;
}

/* 账户概览样式 */
.account-overview {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.overview-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.card-header h3 {
  font-size: 16px;
  color: #333;
  margin: 0;
}

.refresh-btn {
  cursor: pointer;
  font-size: 16px;
  color: #666;
  transition: color 0.2s;
}

.refresh-btn:hover {
  color: #ffa940;
}

.balance-info, .stats-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.balance-item, .stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.label {
  font-size: 14px;
  color: #666;
}

.amount {
  font-size: 18px;
  font-weight: bold;
}

.amount.available {
  color: #52c41a;
}

.amount.frozen {
  color: #fa8c16;
}

.amount.total {
  color: #1890ff;
}

.amount.income {
  color: #52c41a;
}

.amount.expense {
  color: #ff4d4f;
}

.count {
  font-size: 18px;
  font-weight: bold;
  color: #1890ff;
}

/* 操作区域样式 */
.action-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.action-buttons {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.filter-section {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-item label {
  font-size: 14px;
  color: #333;
  white-space: nowrap;
}

.filter-item select,
.filter-item input {
  padding: 6px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
}

/* 交易列表样式 */
.transaction-list {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.list-header h3 {
  font-size: 16px;
  color: #333;
  margin: 0;
}

.total-count {
  font-size: 14px;
  color: #666;
}

.table-container {
  overflow-x: auto;
  margin-bottom: 16px;
}

.transaction-table {
  width: 100%;
  border-collapse: collapse;
}

.transaction-table th,
.transaction-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #f0f0f0;
}

.transaction-table th {
  background-color: #fafafa;
  font-weight: 500;
  color: #333;
  font-size: 14px;
}

.transaction-table td {
  font-size: 14px;
  color: #666;
}

.transaction-type {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.transaction-type.income {
  background-color: #f6ffed;
  color: #52c41a;
}

.transaction-type.expense {
  background-color: #fff2f0;
  color: #ff4d4f;
}

.transaction-type.recharge {
  background-color: #e6f7ff;
  color: #1890ff;
}

.transaction-type.withdraw {
  background-color: #fff7e6;
  color: #fa8c16;
}

.status {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.status.completed {
  background-color: #f6ffed;
  color: #52c41a;
}

.status.processing {
  background-color: #fff7e6;
  color: #fa8c16;
}

.status.failed {
  background-color: #fff2f0;
  color: #ff4d4f;
}

.status.cancelled {
  background-color: #f5f5f5;
  color: #999;
}

/* 分页样式 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
}

.page-info {
  font-size: 14px;
  color: #666;
}

/* 按钮样式 */
.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background-color: #ffa940;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #ff9c1a;
}

.btn-secondary {
  background-color: #f5f5f5;
  color: #333;
  border: 1px solid #d9d9d9;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #e6f7ff;
  border-color: #91d5ff;
}

.btn-link {
  background: none;
  color: #1890ff;
  padding: 4px 8px;
}

.btn-link:hover {
  color: #40a9ff;
  text-decoration: underline;
}

/* 弹窗样式 */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 400px;
  max-width: 90vw;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.modal-header h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #999;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #666;
}

.modal-body {
  padding: 20px;
}

.form-item {
  margin-bottom: 16px;
}

.form-item label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #333;
}

.form-item input,
.form-item select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

.hint {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  color: #999;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid #f0f0f0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-container {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
    order: 2;
  }
  
  .content {
    order: 1;
  }
  
  .account-overview {
    grid-template-columns: 1fr;
  }
  
  .filter-section {
    flex-direction: column;
    align-items: stretch;
  }
  
  .action-buttons {
    flex-wrap: wrap;
  }
}
</style>