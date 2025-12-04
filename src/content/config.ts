import { defineCollection, z } from 'astro:content';

// 3.2 数据模型 (Zod Schema)
const artifacts = defineCollection({
  type: 'content',
  schema: z.object({
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
    aiVerdict: z.object({
      score: z.number(),
      title: z.string(),
      comment: z.string(),
    }).optional(),     // AI 对全篇的综合评价
    aiAnnotations: z.array(z.object({
      originalText: z.string(),       // 原文中被批判的句子
      critique: z.string(),           // AI 的反驳/评论
      severity: z.enum(['info', 'warning', 'critical']), // 批判等级
    })).optional(),
  }),
});

export const collections = {
  artifacts,
};
