// src/router/modules/orders.ts
import type { RouteRecordRaw } from 'vue-router'

const ordersRoutes: RouteRecordRaw[] = [
    {
        path: '/orders',
        name: 'orders',
        component: () => import('@/pages/orders/index.vue'),
        meta: {
            title: '订单管理',
            icon: 'el-icon-document',
            affix: false,
        },
    },
    {
        path: '/orders/pending',
        name: 'ordersPending',
        component: () => import('@/pages/orders/pending.vue'),
        meta: {
            title: '待处理订单',
            icon: 'el-icon-time',
            affix: false,
        },
    },
    {
        path: '/orders/history',
        name: 'ordersHistory',
        component: () => import('@/pages/orders/history.vue'),
        meta: {
            title: '历史订单',
            icon: 'el-icon-document-copy',
            affix: false,
        },
    },
]

export default ordersRoutes