# 智能记账 H5 (Smart Bill H5)

一个支持 PC 和移动端的共享记账 H5 应用，实现多人共享账本和费用分摊功能。

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

### 📱 界面设计
- ✅ 响应式设计，PC 和移动端完美适配
- ✅ Material Design 风格界面
- ✅ 直观的操作流程
- ✅ 加载状态和错误提示

### 💾 数据存储
- ✅ 基于 localStorage 的本地数据持久化
- ✅ 结构化数据模型设计
- ✅ 为未来云端迁移预留接口

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

### 快速开始

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

### 操作流程

1. **管理用户**: 点击"管理用户"添加参与记账的用户
2. **创建账本**: 点击"创建账本"新建共享账本，选择参与用户
3. **记录账目**: 在账本详情页点击"记一笔"添加支出记录
4. **查看分摊**: 系统自动计算各用户的应收应付金额
5. **查看详情**: 点击任意账目查看详细的分摊信息

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

### 未来规划 🚀
- [ ] 云端数据同步
- [ ] 用户注册登录
- [ ] 账目分类管理
- [ ] 数据导出功能
- [ ] 消息通知功能
- [ ] 多语言支持

## 许可证

本项目采用 [Apache License 2.0](LICENSE) 许可证。

## 贡献

欢迎提交 Issue 和 Pull Request 来帮助改进项目！

## 联系方式

如有问题或建议，请通过 GitHub Issues 联系我们。