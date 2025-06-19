import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from '@/router'
import App from './App.vue'

// 导入Element Plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './style.css'                   // 全局样式

const app = createApp(App)

app
    .use(createPinia()) // 状态管理
    .use(router)        // 路由
    .use(ElementPlus)   // Element Plus组件库
    .mount('#app')
