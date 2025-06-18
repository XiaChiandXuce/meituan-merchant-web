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
├── public/                          # 静态资源目录
├── src/
│   ├── assets/                      # 图片、图标等资源
│   ├── components/                 # 通用组件库（待扩展）
│   ├── pages/                      # 页面视图组件（每个子模块一个目录）
│   │   ├── analysis/               # 数据分析页面
│   │   ├── customer/               # 顾客管理页面
│   │   ├── dashboard/              # 商家数据看板
│   │   │   └── index.vue
│   │   ├── finance/                # 财务结算页面
│   │   ├── home/                   # 商家首页
│   │   │   └── index.vue
│   │   ├── market/                 # 营销活动管理
│   │   ├── orders/                 # 订单管理页面
│   │   │   └── index.vue
│   │   ├── products/               # 商品管理
│   │   ├── reports/                # 经营报表
│   │   ├── settings/               # 商家设置
│   ├── router/                     # Vue Router 配置模块
│   │   ├── modules/                # 路由模块化配置
│   │   │   ├── analysis.ts
│   │   │   ├── customer.ts
│   │   │   ├── dashboard.ts
│   │   │   ├── finance.ts
│   │   │   ├── home.ts
│   │   │   ├── market.ts
│   │   │   ├── orders.ts
│   │   │   ├── products.ts
│   │   │   ├── report.ts
│   │   │   ├── settiings.ts
│   │   └── index.ts
│   ├── store/                      # Pinia 状态管理
│   │   └── user.ts
│   ├── App.vue                     # 应用根组件
│   ├── main.ts                     # 应用入口
│   ├── style.css                   # 全局样式
│   ├── vite-env.d.ts               # Vite 环境类型声明
├── .env.development
├── .env.production
├── .gitignore
├── index.html                      # 应用 HTML 模板
├── package.json
├── package-lock.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts                 # Vite 构建配置
├── README.md
```

---

## **📌 系统功能模块**

### ✅ 商家首页 `Home`

- 显示今日订单、预计收入、评分、老客占比等核心指标
- 支持昨日对比与行业平均数据趋势图
- 嵌入式消息通知：营销提醒、服务到期、系统公告

### ✅ 数据看板模块 `Dashboard`

- 汇总展示门店核心数据：实时订单、退款率、销售额趋势
- 多维图表分析支持：条形图、折线图、饼图
- 可自定义时间范围筛选、导出分析结果

### ✅ 订单管理模块 `Orders`

- 管理不同订单状态：待接单、已出餐、配送中、退款中
- 支持异常订单上报、手动催单、退款处理流程
- 菜品换购、手动结单、订单备注功能完善

### ✅ 商品管理模块 `Products`

- 商品列表支持编辑、上下架、标记推荐、限时折扣设置
- 支持 Excel 批量导入（条码/无条码）、字段校验
- 草稿商品字段缺失高亮 + 快速补全表单

### ✅ 顾客关系模块 `Customer`

- 展示会员等级、消费次数、LTV 等客户价值指标
- 支持搜索历史订单、客户标签分类管理
- 可对单个顾客发起营销短信或优惠券推送

### ✅ 营销活动模块 `Market`

- 创建满减、折扣、买赠、限时秒杀等多种活动类型
- 可设置活动范围（商品/分类/全部）、目标客户
- 实时查看活动数据：浏览数、参与数、转化率

### ✅ 财务结算模块 `Finance`

- 展示订单收入、退款支出、佣金分成等财务明细
- 支持周期选择与账户类型筛选
- 可导出每月账单 Excel 报表

### ✅ 报表中心 `Reports`

- 导出订单/商品/用户/活动等多类数据
- 支持字段选择 + 筛选条件配置
- 支持表格预览、导出为 Excel 文件

### ✅ 商家设置模块 `Settings`

- 基本信息设置（门店名、电话、地址）
- 营业时间设置、配送范围配置
- 支持店铺 Logo 与首页宣传图自定义上传

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


