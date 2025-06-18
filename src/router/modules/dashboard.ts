// src/router/modules/dashboard.ts
import type { RouteRecordRaw } from 'vue-router'

const dashboardRoutes: RouteRecordRaw[] = [
    {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('@/pages/dashboard/index.vue'),
        meta: {
            title: '数据看板',
            icon: 'el-icon-data-analysis',
            affix: false,
        },
    },
]

export default dashboardRoutes