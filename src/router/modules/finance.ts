import type { RouteRecordRaw } from 'vue-router'

const financeRoutes: RouteRecordRaw[] = [
  {
    path: '/finance',
    name: 'Finance',
    component: () => import('../../pages/finance/index.vue'),
    meta: {
      title: '财务管理'
    }
  },
  {
    path: '/finance/reconciliation',
    name: 'FinanceReconciliation',
    component: () => import('../../pages/finance/reconciliation.vue'),
    meta: {
      title: '对账首页'
    }
  },
  {
    path: '/finance/bill-reconciliation',
    name: 'FinanceBillReconciliation',
    component: () => import('../../pages/finance/bill-reconciliation.vue'),
    meta: {
      title: '账单对账'
    }
  },
  {
    path: '/finance/order-query',
    name: 'OrderQuery',
    component: () => import('../../pages/finance/order-query.vue'),
    meta: {
      title: '订单查询'
    }
  },
  {
    path: '/finance/account-management',
    name: 'AccountManagement',
    component: () => import('../../pages/finance/account-management.vue'),
    meta: {
      title: '账户管理'
    }
  }
]

export default financeRoutes