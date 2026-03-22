import { Command } from 'commander';
import path from 'node:path';
import fs from 'fs-extra';
import { runPrompts } from '../prompts/index.js';
import { createGenerator } from '../generators/index.js';
import { validateProjectName, validateDirectory, success, error, newLine, banner } from '../utils/index.js';
import type { ProjectConfig } from '../types/index.js';
import { DEFAULT_CONFIG } from '../types/index.js';

interface CreateOptions {
  react?: boolean;
  nextjs?: boolean;
  angular?: boolean;
  express?: boolean;
  fastapi?: boolean;
  yes?: boolean;
  from?: string;
  force?: boolean;
}

export function createCommand(): Command {
  const cmd = new Command('create')
    .description('Create a new project')
    .argument('<project-name>', 'Name of the project')
    .option('--react', 'Create a React + Vite project')
    .option('--nextjs', 'Create a Next.js project')
    .option('--angular', 'Create an Angular project')
    .option('--express', 'Create an Express.js project')
    .option('--fastapi', 'Create a FastAPI project')
    .option('-y, --yes', 'Skip prompts and use defaults')
    .option('--from <path>', 'Create from a config file')
    .option('--force', 'Overwrite existing directory')
    .action(async (projectName: string, options: CreateOptions) => {
      try {
        await handleCreate(projectName, options);
      } catch (err) {
        error(err instanceof Error ? err.message : String(err));
        process.exit(1);
      }
    });

  return cmd;
}

async function handleCreate(projectName: string, options: CreateOptions): Promise<void> {
  const nameValidation = validateProjectName(projectName);
  if (nameValidation !== true) {
    throw new Error(nameValidation);
  }

  const targetDir = path.resolve(process.cwd(), projectName);

  if (!options.force) {
    const dirValidation = await validateDirectory(targetDir);
    if (dirValidation !== true) {
      throw new Error(dirValidation);
    }
  }

  let config: ProjectConfig;

  if (options.from) {
    config = await loadConfigFromFile(options.from, projectName);
  } else if (options.yes || hasFrameworkFlag(options)) {
    config = buildQuickConfig(projectName, options);
  } else {
    config = await runPrompts(projectName);
  }

  newLine();
  banner(`Creating project "${config.name}"...`);
  newLine();

  const generator = createGenerator(config, targetDir);
  await generator.generate();

  newLine();
  success(`Project "${config.name}" created successfully! 🎉`);
  newLine();
  console.log('Next steps:');
  console.log(`  cd ${config.name}`);

  if (config.framework === 'fastapi') {
    console.log('  pip install -r requirements.txt');
    console.log('  uvicorn app.main:app --reload');
  } else {
    console.log(`  ${config.packageManager} install`);
    console.log(`  ${config.packageManager} run dev`);
  }

  newLine();
  console.log('Happy coding! 🚀');
  newLine();
}

function hasFrameworkFlag(options: CreateOptions): boolean {
  return !!(options.react || options.nextjs || options.angular || options.express || options.fastapi);
}

function buildQuickConfig(projectName: string, options: CreateOptions): ProjectConfig {
  const config: ProjectConfig = { ...DEFAULT_CONFIG, name: projectName };

  if (options.react) {
    config.type = 'frontend';
    config.framework = 'react';
  } else if (options.nextjs) {
    config.type = 'frontend';
    config.framework = 'nextjs';
  } else if (options.angular) {
    config.type = 'frontend';
    config.framework = 'angular';
  } else if (options.express) {
    config.type = 'backend';
    config.framework = 'express';
  } else if (options.fastapi) {
    config.type = 'backend';
    config.framework = 'fastapi';
  }

  return config;
}

async function loadConfigFromFile(configPath: string, projectName: string): Promise<ProjectConfig> {
  const resolvedPath = path.resolve(process.cwd(), configPath);
  const content = await fs.readJSON(resolvedPath);
  return { ...DEFAULT_CONFIG, ...content, name: projectName };
}
