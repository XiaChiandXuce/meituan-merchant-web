import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from '@/router'          // 等下第 3 步会新建
import App from './App.vue'

import 'element-plus/dist/index.css'   // 若引入 Element-Plus
import './style.css'                   // 你自己的全局样式

const app = createApp(App)

app
    .use(createPinia()) // 状态管理
    .use(router)        // 路由
    .mount('#app')
