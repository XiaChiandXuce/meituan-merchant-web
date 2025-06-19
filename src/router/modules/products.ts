import type { RouteRecordRaw } from 'vue-router'

const productsRoutes: RouteRecordRaw[] = [
    {
        path: '/products',
        name: 'products',
        component: () => import('@/pages/products/index.vue'),
        meta: {
            title: '商品管理',
            icon: 'el-icon-goods',
            affix: false,
        },
    },
]

export default productsRoutes