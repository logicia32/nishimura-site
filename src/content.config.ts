import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const zennUrl = z
  .string()
  .url()
  .regex(/^https:\/\/zenn\.dev\/[\w-]+(\/articles\/[\w-]+)?\/?$/, {
    message:
      'article must be a Zenn URL: https://zenn.dev/<user> or https://zenn.dev/<user>/articles/<slug>',
  });

const githubRepoUrl = z
  .string()
  .url()
  .regex(/^https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/?$/, {
    message: 'code must be a GitHub repo URL like https://github.com/<user>/<repo>',
  });

const projects = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/projects' }),
  schema: z.object({
    name: z.string().min(1),
    summary: z.string().min(1),
    tags: z.array(z.string()).min(1),
    evidence: z.array(z.string()).min(1),
    article: zennUrl.nullable().optional(),
    code: githubRepoUrl.nullable().optional(),
    note: z.string().optional(),
    noteReason: z.string().optional(),
    order: z.number().int().default(100),
  }),
});

export const collections = { projects };
