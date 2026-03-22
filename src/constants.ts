import type { FrameworkMeta, FrameworkType, VariantType } from './types/index.js';

export const FRAMEWORKS: Record<FrameworkType, FrameworkMeta> = {
  react: {
    name: 'react',
    displayName: 'React + Vite',
    description: 'React 19 with Vite and TypeScript',
    type: 'frontend',
    variants: ['base', 'with-tailwind', 'with-shadcn'],
    language: 'typescript',
  },
  nextjs: {
    name: 'nextjs',
    displayName: 'Next.js (App Router)',
    description: 'Next.js 15 with App Router and TypeScript',
    type: 'frontend',
    variants: ['base', 'with-auth', 'with-prisma'],
    language: 'typescript',
  },
  angular: {
    name: 'angular',
    displayName: 'Angular 18',
    description: 'Angular 18 standalone with TypeScript',
    type: 'frontend',
    variants: ['base'],
    language: 'typescript',
  },
  express: {
    name: 'express',
    displayName: 'Express.js',
    description: 'Express 5 with TypeScript',
    type: 'backend',
    variants: ['base', 'with-prisma'],
    language: 'typescript',
  },
  fastapi: {
    name: 'fastapi',
    displayName: 'FastAPI',
    description: 'FastAPI with Pydantic and Python',
    type: 'backend',
    variants: ['base'],
    language: 'python',
  },
};

export const FRONTEND_FRAMEWORKS: FrameworkType[] = ['react', 'nextjs', 'angular'];
export const BACKEND_FRAMEWORKS: FrameworkType[] = ['express', 'fastapi'];

export const VARIANT_DISPLAY_NAMES: Record<VariantType, string> = {
  base: 'Base (minimal setup)',
  'with-tailwind': 'With Tailwind CSS',
  'with-shadcn': 'With shadcn/ui',
  'with-auth': 'With NextAuth.js',
  'with-prisma': 'With Prisma ORM',
};
