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
  },
  {
    path: '/customers/profile',
    name: 'CustomerProfile',
    component: () => import('../../pages/customers/profile.vue'),
    meta: {
      title: '顾客画像'
    }
  },
  {
    path: '/customers/precision-marketing',
    name: 'PrecisionMarketing',
    component: () => import('../../pages/customers/precision-marketing.vue'),
    meta: {
      title: '精准营销'
    }
  }
]

export default customersRoutes