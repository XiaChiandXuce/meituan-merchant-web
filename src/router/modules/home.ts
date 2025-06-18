// src/router/modules/home.ts
import type { RouteRecordRaw } from 'vue-router'

const homeRoutes: RouteRecordRaw[] = [
    {
        path: '/home',
        name: 'home',
        component: () => import('@/pages/home/index.vue'),
        meta: {
            title: '商家首页',
            icon: 'el-icon-house',
            affix: true,
        },
    },
]

export default homeRoutes
