import type { FrameworkMeta, ProjectConfig } from './config.js';

export interface FeatureDefinition {
  name: string;
  displayName: string;
  description: string;
  default: boolean;
}

export interface ScaffoldPlugin {
  name: string;
  version: string;
  description: string;
  frameworks?: FrameworkMeta[];
  features?: FeatureDefinition[];
  hooks?: {
    beforeGenerate?: (config: ProjectConfig) => Promise<void>;
    afterGenerate?: (config: ProjectConfig, outputPath: string) => Promise<void>;
  };
}
