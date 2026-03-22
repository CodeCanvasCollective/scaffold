import inquirer from 'inquirer';
import type { ProjectType, FrameworkType } from '../types/index.js';

export async function promptProjectType(): Promise<ProjectType> {
  const { projectType } = await inquirer.prompt([
    {
      type: 'list',
      name: 'projectType',
      message: 'What type of project?',
      choices: [
        { name: 'Frontend (React, Next.js, Angular)', value: 'frontend' },
        { name: 'Backend (Express, FastAPI)', value: 'backend' },
        { name: 'Full-Stack (Frontend + Backend)', value: 'fullstack' },
      ],
    },
  ]);

  return projectType;
}

export async function promptFramework(projectType: ProjectType): Promise<FrameworkType> {
  if (projectType === 'frontend') {
    const { framework } = await inquirer.prompt([
      {
        type: 'list',
        name: 'framework',
        message: 'Which frontend framework?',
        choices: [
          { name: 'React + Vite', value: 'react' },
          { name: 'Next.js (App Router)', value: 'nextjs' },
          { name: 'Angular 18', value: 'angular' },
        ],
      },
    ]);
    return framework;
  }

  if (projectType === 'backend') {
    const { framework } = await inquirer.prompt([
      {
        type: 'list',
        name: 'framework',
        message: 'Which backend framework?',
        choices: [
          { name: 'Express.js', value: 'express' },
          { name: 'FastAPI (Python)', value: 'fastapi' },
        ],
      },
    ]);
    return framework;
  }

  // fullstack — prompt for frontend (we'll use express as the backend)
  const { framework } = await inquirer.prompt([
    {
      type: 'list',
      name: 'framework',
      message: 'Which frontend framework?',
      choices: [
        { name: 'React + Vite', value: 'react' },
        { name: 'Next.js', value: 'nextjs' },
        { name: 'Angular 18', value: 'angular' },
      ],
    },
  ]);
  return framework;
}
