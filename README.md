# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).

---

# **🚀 Meituan Merchant Admin - README**

> **“一个优秀的后台系统，必须先服务好创造价值的人。”**
> —— **夏驰和徐策**

> **“界面是假的，数据才是真的；体验是假的，效率才是真的。”**
> —— **夏驰和徐策**

---

## **📌 项目介绍**

本项目是一个仿美团外卖商家端后台管理系统，基于 Vue3 + Vite 构建，全面还原真实商家页面的业务逻辑与界面交互。

涵盖订单接单、商品上传、门店分析、经营数据统计等完整业务流程，支持组件解耦、页面分模块开发，适用于中大型前端项目训练或作品集展示。

---

## **📌 项目结构**

```
meituan-merchant-web/
├── public/                  公共资源目录（图标、模板等）
├── src/
│   ├── assets/              图片、字体资源
│   ├── components/          公共 UI 组件（图表卡片、订单列表项等）
│   ├── pages/               页面模块（dashboard, orders, products 等）
│   │   ├── dashboard/       商家首页数据看板
│   │   ├── orders/          订单管理模块
│   │   ├── products/        商品管理与批量导入
│   │   ├── analysis/        经营分析与漏斗图展示
│   │   ├── reports/         报表导出功能
│   │   └── settings/        门店设置与运营配置（预留）
│   ├── router/              路由配置
│   ├── store/               Pinia 状态管理
│   ├── services/            接口 API 封装
│   ├── utils/               通用工具函数（格式化、导出等）
│   ├── App.vue              应用根组件
│   └── main.ts              应用入口文件
├── .env.development         开发环境配置
├── .env.production          生产环境配置
├── vite.config.ts           构建配置
└── package.json             项目依赖与脚本定义
```

---

## **📌 系统功能模块**

### ✅ 商家首页 Dashboard

* 显示今日订单、预计收入、评分、老客占比等核心指标
* 昨日数据对比与行业排名
* 消息中心推送：营销活动提醒、服务到期等

### ✅ 订单管理模块

* 管理不同订单状态：待接单、待出餐、出餐异常、退款处理
* 快速催单、异常上报、菜品换购、顾客退单处理

### ✅ 商品管理模块

* 商品列表管理：编辑、上下架、标记推荐
* 批量上传 Excel 模板，支持条码/无条码商品
* 草稿商品支持字段缺失高亮与批量创建

### ✅ 经营分析模块

* 展示近 30 日营业趋势、转化率、顾客流量
* 使用漏斗图呈现浏览 → 下单 → 成交全流程
* 支持时间选择与图表导出

### ✅ 报表导出中心

* 可按字段导出：订单数据、商品数据、粉丝数据等
* 支持导出模板下载与 Excel 批量生成

---

## **📌 技术特点**

| 类别     | 技术选型                    |
| ------ | ----------------------- |
| 框架     | Vue 3 + Vite            |
| UI 组件  | Element Plus            |
| 状态管理   | Pinia                   |
| 数据可视化  | ECharts                 |
| 网络请求   | Axios + 拦截器封装           |
| 表格上传导入 | Element Upload + XLSX解析 |
| 图表组件封装 | 漏斗图、折线图模块化封装            |

---

## **📌 快速启动**

```bash
# 克隆仓库
git clone https://github.com/XiaChiandXuce/meituan-merchant-web.git
cd meituan-merchant-web

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

---

## **📌 开发计划与优化方向**

* 🔧 模块解耦 + 微前端容器集成
* 📱 H5 / App 客户端共用组件架构
* 🚚 骑手端 + 配送中心端系统对接
* 📈 经营报表动态更新与图表主题切换
* 🧠 接入后端智能推荐（商品排序 / 活动推荐）
* 🌐 国际化支持 + 多语言版本适配

---

## **📌 贡献者**

* **架构设计 / 系统功能规划**：夏驰和徐策
* **界面还原 / 模块化拆分**：夏驰和徐策
* **图表分析 / 商品上传系统设计**：夏驰和徐策
* **文档撰写 / README 规范整理**：夏驰和徐策

---


