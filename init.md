# Project Design Document: Artifacts

## 1\. 项目愿景 (Project Vision)

**"Artifacts"** 是一个基于 **Astro** 构建的个人数字花园与思维实验场。
它的核心概念是：**理性与荒诞共存**。它不是一个传统的博客，而是一个存放“数字遗物（Artifacts）”的仓库。内容涵盖理性的思考、尖锐的自我批判、以及碎片化的情绪输出。

**核心隐喻：**

  * **Artifacts (伪影/遗物):** 所有的内容都是思维的产物，无论是有序的还是混乱的。
  * **Glitch (故障):** 视觉上呈现为信号不稳定的终端风格，暗示思维的不确定性。
  * **Audit (审判):** 核心功能。文章不仅是输出，更是被审视的对象（通过 AI 进行逻辑批判）。

-----

## 2\. 技术栈 (Tech Stack)

  * **Framework:** Astro 4.0+ (以内容驱动，追求极致性能)
  * **UI Integration:** React (用于构建复杂的交互组件，如 AI 批注显示)
  * **Styling:** Tailwind CSS (快速构建 UI) + 自定义 Glitch 动画 CSS
  * **Content:** MDX (支持在 Markdown 中嵌入 React 组件)
  * **Data Management:** Astro Content Collections (利用 Zod 进行强类型校验)

-----

## 3\. 核心需求与数据结构 (Core Requirements & Schema)

### 3.1 内容矩阵 (Content Matrix)

内容被划分为 6 种组合状态（2种格式 x 3种类型）。暂不需要独立的“作品集”板块。

**A. 两个格式维度 (Format):**

1.  **Status (动态):** 短内容，无标题，类似 Tweets，强调此时此刻的状态。
2.  **Article (文章):** 长内容，有标题，深度思考。

**B. 三个类型维度 (Category & Color Code):**

1.  **Thinking (思考):** 理性分析、技术笔记。 -\> **视觉色：黑色 (Blue)**
2.  **Criticism (批判):** 攻击性观点、反直觉言论。 -\> **视觉色：红色 (Red)**
3.  **Emotion (情绪):** 个人碎碎念、无意义的噪音。 -\> **视觉色：紫色 (Purple)**

### 3.2 数据模型 (Zod Schema)

在 `src/content/config.ts` 中定义的结构：

```typescript
const artifactsSchema = z.object({
  // 基础元数据
  title: z.string().optional(), // Status 类型不需要标题
  date: z.date(),
  
  // 核心分类矩阵
  format: z.enum(['article', 'status']),
  category: z.enum(['thinking', 'criticism', 'emotion']),
  
  // 标签系统
  tags: z.array(z.string()).default([]),

  // 核心功能：AI 批判系统
  aiReview: z.boolean().default(false), // 是否开启 AI 审判
  aiAnnotations: z.array(z.object({
    originalText: z.string(),       // 原文中被批判的句子
    critique: z.string(),           // AI 的反驳/评论
    severity: z.enum(['info', 'warning', 'critical']), // 批判等级
  })).optional(),
});
```

-----

## 4\. 核心功能：AI 批判系统 (The AI Critic)

这是本项目的**最核心特性**。

**逻辑流程：**

1.  **构建时/预处理：** 作者撰写 MDX 文章。
2.  **数据注入：** `aiAnnotations` 字段存储了 AI 对文章特定段落的逻辑漏洞分析（可以是手动填入，未来通过脚本自动生成）。
3.  **前端渲染 (The Annotation Component):**
      * 在渲染 MDX 正文时，需要匹配 `originalText`。
      * **视觉表现：** 被批判的文字下方出现**红色波浪线**或**故障抖动效果**。
      * **交互：** \* **Desktop:** 鼠标悬停 (Hover) 时，显示浮层或在行间展开 AI 的批判文字。
          * **Mobile:** 点击高亮文字，弹出批判卡片。
      * **风格：** 批判文字应呈现为“系统警告”或“编译器报错”的样式。

-----

## 5\. UI/UX 设计规范 (Design Guidelines)

### 5.1 整体氛围

  * **主题：** 极暗模式 (Dark Mode Only)。背景纯黑 (`#000000`) 或深灰。
  * **字体：** 全局使用等宽字体 (Monospace)，模拟代码编辑器或终端体验。
  * **装饰：** 适量的 CSS Noise (噪点) 背景，Glitch (故障) 效果用于强调重点。

### 5.2 导航：控制台矩阵 (The Matrix Filter)

页面顶部不使用传统菜单，而是放置一个\*\*“信号过滤器”\*\*。

  * 允许用户通过开关组合筛选内容。
  * *例子：* `[x] Thinking` + `[x] Article` -\> 只显示思考类的长文章。
  * 切换时加入微小的转场动画（如屏幕闪烁）。

### 5.3 列表与阅读

  * **Status (动态):** 瀑布流布局，卡片式，字体较大，无标题。
  * **Article (文章):** 列表展示标题和日期。进入详情页后，排版需沉浸，但要保留“AI 批判”的侵入感。

-----

## 6\. 开发路线图 (Implementation Plan for Windsurf)

**Step 1: 初始化与配置**

  * 初始化 Astro 项目。
  * 安装 Tailwind CSS 和 React 集成。
  * 配置 `src/content/config.ts` 实现上述 Zod Schema。

**Step 2: 基础 UI 框架**

  * 建立全局 Layout (黑色背景, 等宽字体)。
  * 开发“控制台矩阵”筛选器组件 (Filter Component)。

**Step 3: 核心组件开发 (重点)**

  * 开发 `ArtifactCard` (用于列表展示，区分 3 种颜色的边框)。
  * 开发 `CriticismHighlighter` (React 组件)：
      * 接收 `originalText` 和 `critique` 作为 props。
      * 实现文字的高亮和 Tooltip/Popver 交互。
  * 实现 MDX 渲染逻辑，确保能将 `aiAnnotations` 数据传递给前端组件。

**Step 4: 内容填充**

  * 创建几篇测试用的 MDX 文件，覆盖所有分类组合。
  * 手动填入一些 `aiAnnotations` 数据以测试渲染效果。
