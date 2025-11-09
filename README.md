# Motion Test Playground

一个基于 **React 19 + TypeScript + Vite** 的动效实验项目，用于快速验证不同 Motion 手势、画布与交互动效的实现方式。

## 功能特点

- 🔁 **贴纸墙**：拖拽贴纸、点击触发金属扫光、自动置顶管理层级。
- 🌀 **Plaza 画布**：手势 pan 控制的无限画布，卡片按螺旋分布并随中心距离缩放。
- 🔀 **分类浏览**：左侧列表按分类管理示例，便于快速切换与对比。
- ⚙️ **Tailwind CSS + Motion**：Tailwind 提供样式原子化，Motion 负责手势与动效。

## 快速开始

```bash
# 安装依赖
pnpm install

# 本地开发（默认 http://localhost:5173）
pnpm run dev

# 构建产物
pnpm run build
```

> 项目依赖 pnpm，若尚未安装，可执行 `npm install -g pnpm`。

## 目录结构

```
motion-test/
├── src/
│   ├── examples/       # 动效示例（StickerWall、Plaza 等）
│   ├── components/     # 公共组件（示例列表、Viewer）
│   ├── types/          # 类型定义
│   ├── App.tsx         # 入口页面（分类 + 示例渲染）
│   └── index.css       # Tailwind 基础层
├── public/             # 静态资源（贴纸图片等）
├── tailwind.config.js  # Tailwind 配置
├── vite.config.ts      # Vite 配置
└── README.md
```

## 示例说明

| 分类         | 示例 ID        | 说明                                 |
| ------------ | -------------- | ------------------------------------ |
| 交互体验     | sticker-wall   | 贴纸拖拽、点击扫光、层级置顶         |
| 画布实验     | plaza          | Plaza 螺旋布局 + pan 平移画布        |

添加新示例只需两步：

1. 在 `src/examples/` 中编写组件（推荐按分类建子目录）。
2. 在 `src/examples/index.ts` 中注册示例并配置分类。

## 开发约定

- Tailwind 原子类优先，必要时搭配内联 style（如 drag 约束尺寸）。
- 示例尽量自包含，便于在左侧列表快速预览与切换。
- 如需扩展分类，只需在 `categoryConfig` 中新增映射即可。

## License

MIT © motion-test contributors
