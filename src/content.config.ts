import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/projects' }),
  schema: z.object({
    name: z.string(),
    summary: z.string(),
    tags: z.array(z.string()).min(1),
    evidence: z.array(z.string()).min(1),
    article: z.string().url().nullable().optional(),
    code: z.string().url().nullable().optional(),
    note: z.string().optional(),
    noteReason: z.string().optional(),
    order: z.number().default(100),
  }),
});

export const collections = { projects };
