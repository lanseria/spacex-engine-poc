# 🚀 Rocket Engine Sequence Simulator

一个基于 Web 的火箭发动机点火序列可视化与配置模拟器。该项目允许用户直观地设计、配置并播放不同类型火箭发动机（如 Merlin 1D 海平面版与真空版）的点火时序。

## ✨ 核心特性

- **可视化引擎展示**：
  - 支持 **猎鹰9号(Stage 1)**：经典的 9 机并联布局。
  - 支持 **猎鹰9号(Stage 2)**：二级大喷管单发布局。
  - 动态 SVG 渲染，带流光效果与交互反馈。

- **序列配置系统**：
  - 可视化编辑器：直接点击发动机喷口切换开启/关闭状态。
  - 步骤管理：支持添加、删除序列步骤。
  - 自动保存：配置数据通过 `LocalStorage` 持久化存储，刷新不丢失。
  - **SVG 导出**：支持将当前配置的发动机状态导出为矢量 SVG 文件。

- **播放控制**：
  - 步进式播放点火序列。
  - 实时重置与状态回溯。

- **现代化 UI 设计**：
  - 全暗色模式 (Dark Mode)，太空主题风格。
  - 全局背景网格装饰。
  - 响应式交互动画。

## 🛠 技术栈

本项目基于 [Vitesse for Nuxt](https://github.com/antfu/vitesse-nuxt) 模板构建，采用前沿的前端技术栈：

- **核心框架**: [Nuxt](https://nuxt.com/) + [Vue 3](https://vuejs.org/)
- **语言**: [TypeScript](https://www.typescriptlang.org/)
- **样式方案**: [UnoCSS](https://unocss.dev/) (Atomic CSS engine)
- **状态/逻辑复用**:
  - [VueUse](https://vueuse.org/) (LocalStorage, 交互逻辑)
  - Composition API (Composables)
- **图标**: Iconify (via UnoCSS preset)

## 📦 快速开始

### 环境要求

- Node.js >= 18.0.0
- pnpm >= 8.0.0 (推荐)

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

服务将在 `http://localhost:3000` 启动。

### 构建生产版本

```bash
pnpm build
```

## 📂 目录结构

项目采用了 Nuxt 4 风格的目录结构，主要代码位于 `app/` 目录下：

```bash
.
├── app/
│   ├── components/         # UI 组件
│   │   ├── RocketEngine.vue    # 核心发动机 SVG 组件
│   │   └── EngineConfigModal.vue # 配置弹窗组件
│   ├── composables/        # 组合式函数 (Logic hooks)
│   │   └── useEngineControl.ts # 核心控制逻辑
│   ├── constants/          # 常量定义
│   ├── layouts/            # 页面布局
│   ├── pages/              # 路由页面
│   │   └── index.vue           # 主入口
│   └── types/              # TypeScript 类型定义
│       └── engine.ts           # 引擎相关类型
├── nuxt.config.ts          # Nuxt 配置
├── uno.config.ts           # UnoCSS 配置
└── package.json
```

## 🎮 使用指南

1.  **主界面**：
    - 屏幕中央显示当前选中的发动机布局。
    - 底部显示当前序列进度（Step X / Y）。
    - 点击 **"下一步"** 观察引擎点火状态的变化。

2.  **配置模式**：
    - 点击右上角的 **"配置"** 按钮打开设置面板。
    - **左侧面板**：
      - 切换发动机布局（9机布局 / 二级布局）。
      - 管理序列步骤（添加/删除）。
    - **右侧视图**：
      - 点击圆圈（代表发动机）可切换该步骤下的开启/关闭状态。
      - 点击 **"导出 SVG"** 可下载当前可视化的矢量图。
    - 点击 **"保存并测试"** 应用更改并返回主界面。

## 📝 License

MIT License © 2026
