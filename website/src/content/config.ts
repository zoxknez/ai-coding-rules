import { defineCollection, z } from 'astro:content';

const rulesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum([
      'core',
      'architecture',
      'security',
      'testing',
      'prompting',
      'workflows',
      'performance',
    ]),
    complexity: z.enum(['low', 'medium', 'high']),
    impact: z.enum(['low', 'medium', 'high', 'critical']),
    tags: z.array(z.string()).optional(),
    relatedRules: z.array(z.string()).optional(),
    pubDate: z.date(),
    updatedDate: z.date().optional(),
  }),
});

export const collections = {
  rules: rulesCollection,
};
