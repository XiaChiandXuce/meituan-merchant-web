import type { RouteRecordRaw } from 'vue-router'

const analyticsRoutes: RouteRecordRaw[] = [
  {
    path: '/analytics',
    name: 'Analytics',
    component: () => import('../../pages/analytics/index.vue'),
    meta: {
      title: '经营分析',
      requiresAuth: true
    }
  }
]

export default analyticsRoutes