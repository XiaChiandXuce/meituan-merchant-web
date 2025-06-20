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
    {
        path: '/products/list',
        name: 'productsList',
        component: () => import('@/pages/products/list.vue'),
        meta: {
            title: '商品列表',
            icon: 'el-icon-goods',
            affix: false,
        },
    },
]

export default productsRoutes