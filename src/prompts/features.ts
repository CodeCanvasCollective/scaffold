import inquirer from 'inquirer';
import type { FeatureFlags, ProjectType, FrameworkType } from '../types/index.js';

interface FeatureChoice {
  name: string;
  value: keyof FeatureFlags;
  checked: boolean;
  disabled?: string | false;
}

export async function promptFeatures(
  projectType: ProjectType,
  framework: FrameworkType,
): Promise<FeatureFlags> {
  const isPython = framework === 'fastapi';

  const choices: FeatureChoice[] = [
    {
      name: 'TypeScript',
      value: 'typescript',
      checked: true,
      disabled: isPython ? 'N/A for Python' : false,
    },
    {
      name: 'ESLint + Prettier',
      value: 'eslint',
      checked: !isPython,
      disabled: isPython ? 'N/A for Python' : false,
    },
    { name: 'Tailwind CSS', value: 'tailwind', checked: false },
    { name: 'shadcn/ui components', value: 'shadcn', checked: false },
    { name: isPython ? 'Pytest testing' : 'Vitest testing', value: 'testing', checked: true },
    { name: 'GitHub Actions CI/CD', value: 'githubActions', checked: false },
    { name: 'Docker setup', value: 'docker', checked: false },
    {
      name: 'Husky pre-commit hooks',
      value: 'husky',
      checked: false,
      disabled: isPython ? 'N/A for Python' : false,
    },
    { name: '.env example file', value: 'envExample', checked: false },
  ];

  // Filter out frontend-only features for backend projects
  const filteredChoices =
    projectType === 'backend'
      ? choices.filter((c) => !['tailwind', 'shadcn'].includes(c.value))
      : choices;

  const { features } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'features',
      message: 'Select features:',
      choices: filteredChoices,
    },
  ]);

  const selectedFeatures = features as (keyof FeatureFlags)[];

  return {
    typescript: !isPython && selectedFeatures.includes('typescript'),
    eslint: !isPython && selectedFeatures.includes('eslint'),
    prettier: !isPython && selectedFeatures.includes('eslint'),
    tailwind: selectedFeatures.includes('tailwind'),
    shadcn: selectedFeatures.includes('shadcn'),
    testing: selectedFeatures.includes('testing'),
    githubActions: selectedFeatures.includes('githubActions'),
    docker: selectedFeatures.includes('docker'),
    husky: !isPython && selectedFeatures.includes('husky'),
    envExample: selectedFeatures.includes('envExample'),
  };
}
