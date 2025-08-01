# 智能记账 H5 (Smart Bill H5)

一个支持 PC 和移动端的共享记账 H5 应用，实现多人共享账本和费用分摊功能。

## 🌐 在线体验

**[立即访问 - GitHub Pages 部署版本](https://qqxx6661.github.io/smart_bill_h5/)**

该应用已经部署到 GitHub Pages，可以直接在浏览器中使用，支持手机和电脑访问。

## 功能特性

### 🏠 账本管理
- ✅ 创建新账本并选择参与用户
- ✅ 账本列表展示，包含统计信息
- ✅ 账本详情页面，显示分摊结果和账目记录

### 👥 用户管理
- ✅ 添加新用户（用户名 + 头像选择）
- ✅ 用户列表管理
- ✅ emoji 头像选择器

### 💰 记账功能
- ✅ 添加新账目（金额、描述、付款人、分摊用户）
- ✅ 智能分摊计算（支持等额分摊 AA 制）
- ✅ 账目详情展示
- ✅ 实时计算用户间的应收应付金额

### 💎 会员系统
- ✅ 免费版限制：最多3个用户，1个账本
- ✅ 会员版权益：无限用户数量，无限账本数量
- ✅ 会员购买页面（支付功能敬请期待）
- ✅ 智能限制提醒和升级引导
- ✅ 使用量实时显示（如 3/3 用户，1/1 账本）

### 📱 界面设计
- ✅ 响应式设计，PC 和移动端完美适配
- ✅ Material Design 风格界面
- ✅ 直观的操作流程
- ✅ 加载状态和错误提示

### 💾 数据存储
- ✅ 基于 localStorage 的本地数据持久化
- ✅ 结构化数据模型设计
- ✅ 为未来云端迁移预留接口
- ✅ 会员数据管理和限制逻辑

## 技术架构

### 前端技术栈
- **HTML5**: 语义化标签，移动端适配
- **CSS3**: Flexbox 布局，响应式设计，动画效果
- **原生 JavaScript**: ES6+ 语法，模块化开发
- **localStorage**: 客户端数据持久化

### 项目结构
```
smart_bill_h5/
├── index.html          # 主页面，包含所有页面模板
├── css/
│   ├── reset.css       # CSS 重置样式
│   ├── style.css       # 主要样式文件
│   └── components.css  # 组件样式文件
└── js/
    ├── storage.js      # 数据存储层
    ├── utils.js        # 工具函数
    ├── router.js       # 路由管理
    ├── components.js   # UI 组件渲染
    └── app.js          # 主应用逻辑
```

### 核心模块

#### 数据存储层 (storage.js)
- 用户数据管理
- 账本数据管理  
- 账目数据管理
- 自动计算分摊结果

#### 路由系统 (router.js)
- 基于 hash 的单页面路由
- 页面切换动画
- 后退按钮支持

#### 组件系统 (components.js)
- 可复用的 UI 组件
- 数据驱动的界面渲染
- 统一的样式规范

## 使用说明

## 快速部署

### 🚀 GitHub Pages 自动部署

本项目已配置 GitHub Actions 自动部署到 GitHub Pages：

1. **Fork 本仓库** 到您的 GitHub 账户
2. **启用 GitHub Pages**：
   - 进入仓库 Settings > Pages
   - Source 选择 "GitHub Actions"
3. **推送更改** 到 main 分支即可自动触发部署
4. **访问应用**：部署完成后通过 `https://您的用户名.github.io/smart_bill_h5/` 访问

### 📱 本地开发

#### 快速开始

1. **克隆项目**
   ```bash
   git clone https://github.com/qqxx6661/smart_bill_h5.git
   cd smart_bill_h5
   ```

2. **启动本地服务器**
   ```bash
   # Python 3
   python3 -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   
   # Node.js
   npx serve .
   ```

3. **访问应用**
   打开浏览器访问 `http://localhost:8000`

## 使用说明

### 💼 会员系统说明

**免费版限制：**
- 👥 最多创建 3 个用户
- 📖 最多创建 1 个账本
- ✅ 完整的记账功能

**会员版权益：**
- 👥 无限用户数量
- 📖 无限账本数量
- 📊 未来将支持高级统计功能
- ☁️ 未来将支持云端数据同步

### 📋 操作流程

1. **管理用户**: 点击"管理用户"添加参与记账的用户
2. **创建账本**: 点击"创建账本"新建共享账本，选择参与用户
3. **记录账目**: 在账本详情页点击"记一笔"添加支出记录
4. **查看分摊**: 系统自动计算各用户的应收应付金额
5. **查看详情**: 点击任意账目查看详细的分摊信息
6. **升级会员**: 点击"升级会员"按钮查看会员权益（支付功能敬请期待）

## 数据结构

### 用户数据
```javascript
{
  id: "unique_id",
  name: "用户名",
  avatar: "👤",
  createdAt: "2023-01-01T00:00:00.000Z"
}
```

### 账本数据
```javascript
{
  id: "unique_id",
  name: "账本名称",
  participants: ["user_id_1", "user_id_2"],
  createdAt: "2023-01-01T00:00:00.000Z"
}
```

### 账目数据
```javascript
{
  id: "unique_id",
  bookId: "book_id",
  amount: 100.00,
  description: "支出描述",
  payerId: "user_id",
  splits: [
    { userId: "user_id_1", amount: 50.00 },
    { userId: "user_id_2", amount: 50.00 }
  ],
  createdAt: "2023-01-01T00:00:00.000Z"
}
```

### 会员数据
```javascript
{
  type: "free" | "premium",
  startDate: "2023-01-01T00:00:00.000Z",
  endDate: "2023-12-31T23:59:59.999Z",
  features: {
    maxUsers: 3,      // 免费版: 3, 会员版: Infinity
    maxBooks: 1       // 免费版: 1, 会员版: Infinity
  }
}
```

## 浏览器支持

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ 移动端浏览器

## 开发路线图

### 已完成功能 ✅
- [x] 基础项目架构
- [x] 用户管理功能
- [x] 账本管理功能
- [x] 记账和分摊功能
- [x] 响应式界面设计
- [x] 本地数据存储
- [x] 会员系统和用户限制
- [x] GitHub Pages 自动部署

### 未来规划 🚀
- [ ] 支付系统集成（会员购买）
- [ ] 云端数据同步
- [ ] 用户注册登录
- [ ] 账目分类管理
- [ ] 数据导出功能
- [ ] 消息通知功能
- [ ] 多语言支持
- [ ] 高级统计功能（会员专享）

## 许可证

本项目采用 [Apache License 2.0](LICENSE) 许可证。

## 贡献

欢迎提交 Issue 和 Pull Request 来帮助改进项目！

## 联系方式

如有问题或建议，请通过 GitHub Issues 联系我们。