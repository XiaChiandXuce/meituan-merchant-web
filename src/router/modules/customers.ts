import type { RouteRecordRaw } from 'vue-router'

const customersRoutes: RouteRecordRaw[] = [
  {
    path: '/customers',
    name: 'Customers',
    component: () => import('../../pages/customers/index.vue'),
    meta: {
      title: '顾客管理'
    }
  },
  {
    path: '/customers/analysis',
    name: 'CustomerAnalysis',
    component: () => import('../../pages/customers/analysis.vue'),
    meta: {
      title: '顾客分析'
    }
  }
]

export default customersRoutes