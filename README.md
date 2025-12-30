# Dawn 🌅

> Occupy your beauty, redefine your start.

一个优雅的 Chrome 新标签页扩展，为你的每一次浏览器开启带来美好体验。

## ✨ 特性

- 🎨 **动态背景** - 支持自定义背景图片，集成 Unsplash 随机美图
- 🎆 **烟花特效** - 可选的烟花动画效果，让你的新标签页更加生动
- 🔍 **快速搜索** - 内置搜索功能，快速访问你想要的内容
- 🌤️ **天气显示** - 实时天气信息展示
- 📝 **任务管理** - 待办事项列表，帮助你管理日常任务
- 💬 **每日一言** - 随机展示励志名言或优美句子
- ⏰ **时间问候** - 根据时间段显示不同的问候语
- 🎯 **拖拽布局** - 支持组件拖拽，自定义你的页面布局
- 💾 **数据持久化** - 使用 IndexedDB 本地存储，数据不丢失

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 加载扩展

1. 打开 Chrome 浏览器，访问 `chrome://extensions/`
2. 开启右上角的「开发者模式」
3. 点击「加载已解压的扩展程序」
4. 选择项目的 `dist` 目录

### 生产构建

```bash
npm run build
```

构建完成后，会在 `release` 目录生成打包好的 `.zip` 文件。

## 🛠️ 技术栈

- **框架**: React 19 + TypeScript
- **构建工具**: Vite 7
- **样式方案**: Tailwind CSS 4
- **状态管理**: Zustand
- **动画库**: Framer Motion + React Spring
- **UI 组件**: Mantine Core
- **拖拽功能**: DnD Kit
- **时间处理**: Luxon
- **Chrome 扩展**: @crxjs/vite-plugin

## 📁 项目结构

```
dawn/
├── src/
│   ├── components/          # React 组件
│   │   ├── Background/      # 背景组件（包含烟花特效）
│   │   ├── common/          # 通用组件（拖拽、输入框等）
│   │   ├── Tasks/           # 任务管理组件
│   │   ├── Header.tsx       # 头部组件
│   │   ├── Footer.tsx       # 底部组件
│   │   ├── Search.tsx       # 搜索组件
│   │   └── Layout.tsx       # 布局组件
│   ├── hooks/               # 自定义 Hooks
│   │   ├── useBackgroundImage.ts  # 背景图片管理
│   │   ├── useWeatherTime.ts     # 天气和时间
│   │   ├── useGreeting.ts        # 问候语
│   │   ├── useQuote.ts           # 每日一言
│   │   └── ...
│   ├── store/               # 状态管理
│   │   └── useSettingStore.ts    # 设置状态
│   ├── utils/               # 工具函数
│   │   ├── idb.ts          # IndexedDB 封装
│   │   └── lib.ts          # 通用工具
│   ├── background/          # 后台服务
│   │   └── index.ts        # Service Worker
│   ├── assets/              # 静态资源
│   │   ├── css/            # 样式文件
│   │   ├── img/            # 图片资源
│   │   └── js/             # 配置文件
│   └── main.tsx            # 入口文件
├── manifest.config.ts       # Chrome 扩展配置
├── vite.config.ts          # Vite 配置
└── package.json            # 项目依赖

```

## 🎯 核心功能

### 背景管理

- 支持自定义上传背景图片
- 集成 Unsplash API 获取随机高质量图片
- 可选烟花动画特效

### 搜索功能

- 快速搜索框
- 支持多种搜索引擎

### 任务管理

- 创建、编辑、删除待办事项
- 任务状态管理
- 数据本地持久化

### 天气信息

- 自动获取地理位置
- 实时天气展示
- 天气图标显示

## 📸 预览

![扩展主界面](screenShot/image.png)

## 🔧 开发说明

### 权限说明

扩展需要以下权限：

- `storage` - 存储用户设置和数据
- `tabs` - 标签页管理
- `search` - 搜索功能
- `alarms` - 定时任务
- `notifications` - 通知功能

### API 集成

- Unsplash API - 获取背景图片
- Quotable API - 获取英文名言
- 一言 API - 获取中文句子
- FreeGeoIP - 获取地理位置信息

## 📝 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

Made with ❤️ by Dawn Team
