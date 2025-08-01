# 本地开发指南 / Local Development Guide

## 快速本地测试

由于这是一个纯静态的 H5 应用，您可以通过以下几种方式在本地预览和测试：

### 方法一：直接打开文件（最简单）
1. 下载或克隆代码到本地
2. 直接双击 `index.html` 文件，在浏览器中打开
3. 可以完整测试所有功能，包括会员系统限制

### 方法二：使用 Python 本地服务器（推荐）
```bash
# 在项目根目录运行
python -m http.server 8000

# 或者使用 Python 3
python3 -m http.server 8000
```
然后在浏览器访问：`http://localhost:8000`

### 方法三：使用 Node.js serve
```bash
# 安装 serve (一次性)
npm install -g serve

# 在项目根目录运行
serve -s . -p 8000
```
然后在浏览器访问：`http://localhost:8000`

### 方法四：使用 VS Code Live Server
1. 在 VS Code 中安装 "Live Server" 扩展
2. 右键点击 `index.html` 文件
3. 选择 "Open with Live Server"

## 测试功能列表

### 🔍 主要功能测试
- [ ] 创建账本
- [ ] 添加用户（测试免费用户3人限制）
- [ ] 记录消费（测试费用分摊）
- [ ] 查看结算结果
- [ ] 会员购买页面

### 💎 会员系统测试
- [ ] 免费用户限制：最多3个用户
- [ ] 免费用户限制：最多1个账本
- [ ] 达到限制时的升级提示
- [ ] 会员页面访问和界面
- [ ] "敬请期待"支付按钮

### 📱 响应式测试
- [ ] 桌面端显示效果
- [ ] 移动端显示效果
- [ ] 平板端显示效果

## 数据存储

应用使用 `localStorage` 存储数据，所有数据保存在浏览器本地，可以：
- 清除浏览器数据来重置应用状态
- 在开发者工具中查看 localStorage 数据
- 测试不同会员状态（修改 localStorage 中的 membership 数据）

## 部署验证

在本地测试无误后，将代码合并到 `main` 分支即可自动部署到 GitHub Pages。