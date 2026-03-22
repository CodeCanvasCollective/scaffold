import type { ProjectConfig } from '../types/index.js';
import { promptProjectType, promptFramework } from './framework.js';
import { promptFeatures } from './features.js';
import { promptVariant, promptPackageManager, promptGitInit } from './config.js';

export async function runPrompts(projectName: string): Promise<ProjectConfig> {
  const type = await promptProjectType();
  const framework = await promptFramework(type);
  const variant = await promptVariant(framework);
  const features = await promptFeatures(type, framework);

  const isPython = framework === 'fastapi';
  const packageManager = isPython ? 'npm' : await promptPackageManager();
  const gitInit = await promptGitInit();

  return {
    name: projectName,
    type,
    framework,
    variant,
    features,
    packageManager,
    gitInit,
  };
}
