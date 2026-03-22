import inquirer from 'inquirer';
import type { VariantType, PackageManager, FrameworkType } from '../types/index.js';
import { FRAMEWORKS, VARIANT_DISPLAY_NAMES } from '../constants.js';

export async function promptVariant(framework: FrameworkType): Promise<VariantType> {
  const meta = FRAMEWORKS[framework];

  if (meta.variants.length <= 1) {
    return 'base';
  }

  const { variant } = await inquirer.prompt([
    {
      type: 'list',
      name: 'variant',
      message: 'Select a template variant:',
      choices: meta.variants.map((v) => ({
        name: VARIANT_DISPLAY_NAMES[v],
        value: v,
      })),
    },
  ]);

  return variant;
}

export async function promptPackageManager(): Promise<PackageManager> {
  const { packageManager } = await inquirer.prompt([
    {
      type: 'list',
      name: 'packageManager',
      message: 'Package manager?',
      choices: [
        { name: 'npm', value: 'npm' },
        { name: 'yarn', value: 'yarn' },
        { name: 'pnpm', value: 'pnpm' },
      ],
    },
  ]);

  return packageManager;
}

export async function promptGitInit(): Promise<boolean> {
  const { gitInit } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'gitInit',
      message: 'Initialize git repository?',
      default: true,
    },
  ]);

  return gitInit;
}
