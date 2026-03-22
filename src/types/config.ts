export type ProjectType = 'frontend' | 'backend' | 'fullstack';

export type FrameworkType = 'react' | 'nextjs' | 'angular' | 'express' | 'fastapi';

export type VariantType = 'base' | 'with-tailwind' | 'with-shadcn' | 'with-auth' | 'with-prisma';

export type PackageManager = 'npm' | 'yarn' | 'pnpm';

export interface FeatureFlags {
  typescript: boolean;
  eslint: boolean;
  prettier: boolean;
  tailwind: boolean;
  shadcn: boolean;
  testing: boolean;
  githubActions: boolean;
  docker: boolean;
  husky: boolean;
  envExample: boolean;
}

export interface ProjectConfig {
  name: string;
  type: ProjectType;
  framework: FrameworkType;
  variant: VariantType;
  features: FeatureFlags;
  packageManager: PackageManager;
  gitInit: boolean;
}

export interface FrameworkMeta {
  name: string;
  displayName: string;
  description: string;
  type: ProjectType;
  variants: VariantType[];
  language: 'typescript' | 'python';
}

export const DEFAULT_FEATURES: FeatureFlags = {
  typescript: true,
  eslint: true,
  prettier: true,
  tailwind: false,
  shadcn: false,
  testing: true,
  githubActions: false,
  docker: false,
  husky: false,
  envExample: false,
};

export const DEFAULT_CONFIG: ProjectConfig = {
  name: '',
  type: 'frontend',
  framework: 'react',
  variant: 'base',
  features: { ...DEFAULT_FEATURES },
  packageManager: 'npm',
  gitInit: true,
};
