# React Dashboard Template

一个现代化的React仪表板模板，使用最新的技术栈构建，提供丰富的图表展示和响应式设计。

## 🚀 技术栈

- **React 19** - 最新的React版本
- **TypeScript** - 类型安全的JavaScript
- **Material-UI (MUI) 7** - Google Material Design组件库
- **Recharts** - 基于React的图表库
- **Axios** - HTTP客户端
- **Emotion** - CSS-in-JS解决方案

## ✨ 功能特性

- 🎨 现代化Material Design界面
- 📱 完全响应式设计，支持移动端和桌面端
- 📊 多种图表类型：折线图、柱状图、饼图
- 🔄 可折叠侧边栏导航
- 📈 实时数据展示卡片
- 🎯 模拟API调用示例
- 🌙 可扩展的主题系统

## 🛠️ 安装和运行

### 前提条件
- Node.js 18+ 
- npm 或 yarn

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm start
```

应用将在 [http://localhost:3000](http://localhost:3000) 打开

### 构建生产版本
```bash
npm run build
```

### 运行测试
```bash
npm test
```

## 📁 项目结构

```
src/
├── App.tsx          # 主应用组件
├── index.tsx        # 应用入口点
├── index.css        # 全局样式
└── ...
```

## 🎯 主要组件

### 侧边栏导航
- Dashboard - 主仪表板
- Analytics - 分析页面
- Reports - 报告页面
- Trends - 趋势页面

### 数据展示
- 用户统计卡片
- 收入统计卡片
- 活跃用户卡片
- 转化率卡片

### 图表组件
- **折线图**: 月度趋势分析
- **饼图**: 设备分布统计
- **柱状图**: 产品销售表现

## 🔧 自定义配置

### 主题定制
在 `App.tsx` 中修改 `theme` 对象来自定义颜色、字体等：

```typescript
const theme = createTheme({
  palette: {
    primary: {
      main: '#your-color',
    },
    // 更多配置...
  },
});
```

### 添加新图表
使用Recharts组件轻松添加新的图表类型：

```typescript
import { AreaChart, Area } from 'recharts';

<AreaChart data={data}>
  <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" />
</AreaChart>
```

### API集成
替换模拟数据为真实API调用：

```typescript
const fetchStats = async () => {
  try {
    const response = await axios.get('/api/stats');
    setStats(response.data);
  } catch (error) {
    console.error('Error fetching stats:', error);
  }
};
```

## 📱 响应式设计

- **移动端**: 侧边栏自动折叠，触摸友好的界面
- **平板端**: 优化的布局和触摸体验
- **桌面端**: 完整的侧边栏和宽屏布局

## 🎨 设计原则

- **Material Design**: 遵循Google Material Design规范
- **一致性**: 统一的颜色、字体和间距系统
- **可访问性**: 支持键盘导航和屏幕阅读器
- **性能**: 优化的渲染和状态管理

## 🔮 未来计划

- [ ] 暗色主题支持
- [ ] 更多图表类型
- [ ] 数据导出功能
- [ ] 国际化支持
- [ ] 实时数据更新
- [ ] 用户认证系统

## 🤝 贡献

欢迎提交Issue和Pull Request来改进这个项目！

## 📄 许可证

MIT License

## 📞 支持

如果您有任何问题或建议，请创建Issue或联系项目维护者。
