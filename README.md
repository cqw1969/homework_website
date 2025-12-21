# 在线商城 — 大作业说明

这是一个基于纯前端（HTML/CSS/JavaScript）的在线商城大作业，使用 localStorage 模拟后端数据存储，并通过模拟 Ajax 请求（setTimeout）演示前后端交互流程。

## 如何运行

1. 直接在本地打开 `index.html`（使用现代浏览器：Chrome/Edge/Firefox）。
2. 无需安装任何服务器或额外依赖。

> 如果答辩或演示需要模拟真实后端，可以把该目录放到本地静态服务器（如 VS Code 的 Live Server 插件）中运行，但并非必须。

## 已实现的主要功能（满足作业要求）

- 首页（`index.html`）
  - 轮播图（CSS+JS 自动轮播，支持鼠标悬停暂停、控制点跳转）
  - 搜索（带防抖和搜索历史）
  - 分类筛选
  - 商品网格展示（从 localStorage 读取，支持 Ajax 模拟）

- 登录/注册（`login.html` / `register.html`）
  - 前端合法性校验（用户名、邮箱、密码等）
  - 注册后自动登录（用户数据保存在 localStorage）
  - 登录后页面顶部会显示用户名并跳转到个人中心

- 商品详情页（`detail.html`）
  - 通过 URL 参数 `?id=` 获取商品详情（模拟 Ajax 获取）
  - 支持选择数量并加入购物车

- 购物车（`cart.html`）
  - 本地持久化（localStorage）购物车
  - 修改数量、删除商品、结算（生成订单并保存到 localStorage）

- 个人中心（`user.html`）
  - 显示用户信息与最近订单（均使用 localStorage）

- 其他
  - 通知浮层（showNotification）用于提示成功/错误信息
  - Ajax 模拟函数 `ajaxRequest`（封装了 GET/POST 模拟）

## 我已经做的修复（本次提交）

- 修复页面脚本依赖：
  - 在 `detail.html` 和 `cart.html` 中添加了 `<script src="js/main.js"></script>`，确保在使用 `ajaxRequest`、`showNotification`、`updateCartCount` 等函数前已经加载了 `main.js`。

## 答辩时可讲解的关键点（示例答辩要点）

- 技术栈：HTML5/CSS3/JavaScript、Ajax（模拟）、JSON、localStorage
- 数据流：前端如何用 localStorage 存储商品、用户、订单、购物车；如何模拟后端接口（`ajaxRequest`）进行异步加载。
- 前端功能实现细节：
  - 轮播图的实现（DOM 操作、定时器、事件绑定）
  - 搜索防抖与历史记录（debounce 与 localStorage）
  - 表单校验（register/login 的校验逻辑）
  - 购物车的增删改查和结算流程（订单生成逻辑）
- 安全说明：项目为教学示例，密码以明文保存在 localStorage（现实中应使用后端加密存储/哈希）。