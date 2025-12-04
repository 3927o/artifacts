# Artifacts

> **"理性与荒诞共存"**
> 一个基于 Astro 构建的个人数字花园与思维实验场。

![Artifacts Terminal](https://placehold.co/800x400/000000/00ff00?text=Artifacts_Terminal)

## 🌌 愿景 (Vision)

这不是一个传统的博客，而是一个存放“数字遗物（Artifacts）”的仓库。内容涵盖理性的思考、尖锐的自我批判、以及碎片化的情绪输出。

核心概念：
*   **Artifacts (伪影/遗物):** 所有的内容都是思维的产物。
*   **Glitch (故障):** 视觉上呈现为信号不稳定的终端风格。
*   **Audit (审判):** 核心功能。文章不仅是输出，更是被审视的对象（AI 逻辑批判）。

## ✨ 核心特性 (Features)

*   **信号过滤器 (Signal Matrix Filter)**: 首页采用交互式矩阵筛选器，支持按格式 (Article/Status) 和类型 (Thinking/Criticism/Emotion) 组合过滤。
*   **AI 批判系统 (The AI Critic)**:
    *   **AI Comment**: 对整篇文章的综合系统分析。
    *   **Inline Critique**: 针对特定句子的逻辑漏洞分析，视觉上呈现为红色波浪线，鼠标悬停显示批判详情。
*   **双重格式**:
    *   **Article**: 深度长文，点击进入沉浸式阅读。
    *   **Status**: 短状态流，支持首页直接展开阅读。
*   **极致暗黑风**: 全局终端/代码编辑器风格，配合 CSS 噪点背景和 Glitch 动画。

## 🛠️ 技术栈 (Tech Stack)

*   **Framework**: [Astro 5.0](https://astro.build) (Content Collections + MDX)
*   **UI**: [React](https://react.dev) (Interactive Components)
*   **Styling**: [Tailwind CSS v4](https://tailwindcss.com)
*   **Plugins**: Custom Rehype Plugin for AI annotations.

## 📂 项目结构 (Structure)

```text
/
├── src/
│   ├── components/
│   │   ├── ArtifactFeed.tsx      # 首页矩阵筛选与列表组件
│   │   └── CritiqueOverlay.tsx   # AI 批判浮层组件
│   ├── content/
│   │   ├── artifacts/            # MDX 内容文件
│   │   └── config.ts             # Zod 数据校验 Schema
│   ├── layouts/
│   │   └── Layout.astro          # 全局布局
│   ├── pages/
│   │   ├── index.astro           # 首页
│   │   └── artifacts/[id].astro  # 文章详情页
│   └── plugins/
│       └── rehype-critique.mjs   # 自定义 Markdown 处理插件
└── astro.config.mjs              # Astro 配置
```

## 🚀 快速开始 (Getting Started)

1.  **安装依赖**:
    ```sh
    npm install
    ```

2.  **启动开发服务器**:
    ```sh
    npm run dev
    ```

3.  **构建生产版本**:
    ```sh
    npm run build
    ```

## 📝 内容创作指南

在 `src/content/artifacts/` 下创建 `.mdx` 文件：

```yaml
---
title: "文章标题"
date: 2024-05-20
format: "article"       # or "status"
category: "thinking"    # or "criticism", "emotion"
tags: ["tag1", "tag2"]
aiReview: true          # 开启 AI 批判
aiComment: "AI 对整篇文章的评价..."
aiAnnotations:
  - originalText: "原文中被批判的句子"
    critique: "AI 的反驳或逻辑指出"
    severity: "warning" # info, warning, critical
---

正文内容...
```

## 📄 License

MIT
