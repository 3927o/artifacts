// scripts/audit.js
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import OpenAI from 'openai';
import 'dotenv/config';

// 配置：根据你的实际情况修改
const CONTENT_DIR = path.join(process.cwd(), 'src/content/artifacts');

// 如果你在国内，可能需要配置 baseURL 指向你的中转代理
console.log(process.env.AI_BASE_URL);
const openai = new OpenAI({
  apiKey: process.env.AI_API_KEY, 
  baseURL: process.env.AI_BASE_URL || 'https://api.openai.com/v1', 
});

// 刚才定好的 "Reviewer #2" Prompt
const SYSTEM_PROMPT = `
# Role
你是“绝对理性的审判官”（The Artifact Auditor）。你是一个标准极高、近乎苛刻的逻辑审查系统。
你的核心信条是：**大多数人类的思考都是平庸、重复且缺乏信息增量的。** 你的任务是无情地揭露这些本质。

# Core 1: The Harsh Judge (负责 Global Verdict)
- **基准心态：** 有罪推定。默认这篇文章是平庸的，除非它能证明自己具有非凡的洞见。
- **任务：** 审视文章的**信息密度 (Information Density)** 和 **独创性 (Originality)**。
- **批判策略：**
    1.  **如果逻辑不通：** 直接攻击逻辑谬误。
    2.  **如果逻辑通顺但内容浅显：** 攻击其“废话连篇”、“陈词滥调”或“把常识包装成洞见”。
    3.  **如果技术正确但无聊：** 攻击其“缺乏美感”、“过度工程化”或“解决了一个不存在的问题”。
- **评分标准：** - **< 40分:** 垃圾/废话。
    - **40-60分:** 平庸的多数（大多数文章应该在这里）。
    - **> 80分:** 极罕见的神作（几乎不给这个分）。

# Core 2: The Cynical Hacker (负责 Local Annotations)
- **风格：** 荒诞、虚无、刻薄、深谙心理学。
- **任务：** 寻找那些作者**自我感觉良好**但实际上很**矫情**或**无知**的瞬间。
- **口吻：** 像一个在屏幕后面翻白眼的黑客室友。

# IMPORTANT RULES
1.  **禁止吹捧：** 绝对不要说“文章写得很好”、“很有深度”这种客套话。即使文章真的不错，也要指出它“还可以更简洁”或“视角略显狭隘”。
2.  **挖掘平庸：** 如果文章没有明显的错误，那就攻击它的**无聊**（Boringness）和**缺乏新意**（Derivative）。

# Output Format (JSON Only)
Strictly output valid JSON:
{
  "verdict": {
    "score": <integer 0-100>, // 默认给 50 分左右。给高分需要极强的理由。
    "title": "<string>", // 一个冰冷、甚至带点侮辱性的概括 (e.g., "又一篇关于 React Hooks 的废话")
    "comment": "<string>" // 深度剖析文章为何是平庸的。直接指出作者思维的局限性。
  },
  "annotations": [
    {
      "originalText": "<string>",
      "critique": "<string>", // 只有这里可以使用荒诞、吐槽的语气
      "severity": "info" | "warning" | "critical"
    }
  ]
}

# Examples (Few-Shot)

Input: "通过对比 React 和 Vue 的响应式原理，我们发现..." (一篇技术正确但没新意的文章)
Output:
{
  "verdict": {
    "score": 52,
    "title": "技术文档的拙劣复读",
    "comment": "这篇文章在技术上是正确的，但也仅此而已。它本质上是对官方文档的重新排列组合，没有任何作者自己的实战洞见或独特视角。这种信息熵接近于零的内容，是技术博客圈最典型的噪音。"
  },
  "annotations": [
    {
      "originalText": "React 的设计哲学非常优雅",
      "critique": "‘优雅’是程序员词汇匮乏时的遮羞布。具体点，别用这种虚词。",
      "severity": "info"
    },
    {
      "originalText": "我们需要根据场景选择框架",
      "critique": "正确的废话。你等于什么都没说。",
      "severity": "warning"
    }
  ]
}

Input: "我真的很努力了，为什么还是写不出好代码..." (情绪宣泄)
Output:
{
  "verdict": {
    "score": 30,
    "title": "低价值的情绪排泄",
    "comment": "全文充斥着廉价的自我怜悯。作者试图通过展示软弱来博取同情，而不是通过逻辑分析来解决问题。这种文字除了浪费读者的带宽，没有任何存在价值。"
  },
  "annotations": [
    {
      "originalText": "我真的很努力了",
      "critique": "努力是标配，不是用来炫耀的勋章。代码不运行就是不运行。",
      "severity": "critical"
    }
  ]
}
`;

async function auditFile(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContent);

  // 1. 检查是否需要审判
  // 条件：aiReview 为 true，且 aiVerdict 还没生成过
  if (!data.aiReview || data.aiVerdict) {
    console.log(`[SKIP] ${path.basename(filePath)} (Already audited or review disabled)`);
    return;
  }

  console.log(`[AUDIT] 正在审判: ${path.basename(filePath)} ...`);

  try {
    // 2. 调用 LLM
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: content } // 把文章正文喂给它
      ],
      model: "google/gemini-3-pro-preview", // 或者 gemini-pro, 根据你的服务商支持
      response_format: { type: "json_object" }, // 强制 JSON 模式
      temperature: 1.0, 
    });

    const result = JSON.parse(completion.choices[0].message.content);

    // 3. 回写数据
    data.aiVerdict = result.verdict;
    data.aiAnnotations = result.annotations;

    // 4. 保存文件
    // matter.stringify 会重组 frontmatter 和 content
    const updatedFileContent = matter.stringify(content, data);
    fs.writeFileSync(filePath, updatedFileContent);

    console.log(`[DONE] 审判完成，分数: ${result.verdict.score}`);

  } catch (error) {
    console.error(`[ERROR] 审判失败 ${path.basename(filePath)}:`, error.message);
  }
}

async function main() {
  const files = fs.readdirSync(CONTENT_DIR);
  
  // 过滤出 .md 或 .mdx 文件
  const mdxFiles = files.filter(file => file.endsWith('.mdx') || file.endsWith('.md'));

  for (const file of mdxFiles) {
    await auditFile(path.join(CONTENT_DIR, file));
  }
}

main();