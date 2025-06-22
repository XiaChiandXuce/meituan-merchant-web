import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// 导入路由模块
import homeRoutes from './modules/home'
import dashboardRoutes from './modules/dashboard'
import ordersRoutes from './modules/orders'
import productsRoutes from './modules/products'
import customersRoutes from './modules/customers'
import financeRoutes from './modules/finance'
import analyticsRoutes from './modules/analytics'

// 合并所有路由
const routes: RouteRecordRaw[] = [
    { path: '/', redirect: '/home' },
    ...homeRoutes,
    ...dashboardRoutes,
    ...ordersRoutes,
    ...productsRoutes,
    ...customersRoutes,
    ...financeRoutes,
    ...analyticsRoutes,
]

const router = createRouter({
    history: createWebHistory(), // hash 模式就用 createWebHashHistory()
    routes,
})

export default router
