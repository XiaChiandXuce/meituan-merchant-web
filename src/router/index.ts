import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// 导入路由模块
import homeRoutes from './modules/home'
import dashboardRoutes from './modules/dashboard'
import ordersRoutes from './modules/orders'

// 合并所有路由
const routes: RouteRecordRaw[] = [
    { path: '/', redirect: '/home' },
    ...homeRoutes,
    ...dashboardRoutes,
    ...ordersRoutes,
]

const router = createRouter({
    history: createWebHistory(), // hash 模式就用 createWebHashHistory()
    routes,
})

export default router
