import type { ProjectConfig } from '../types/index.js';
import { BaseGenerator } from './base.js';
import { ReactGenerator } from './react.js';
import { NextjsGenerator } from './nextjs.js';
import { AngularGenerator } from './angular.js';
import { ExpressGenerator } from './express.js';
import { FastAPIGenerator } from './fastapi.js';
import { FullstackGenerator } from './fullstack.js';

export function createGenerator(config: ProjectConfig, targetDir: string): BaseGenerator {
  if (config.type === 'fullstack') {
    return new FullstackGenerator(config, targetDir);
  }

  switch (config.framework) {
    case 'react':
      return new ReactGenerator(config, targetDir);
    case 'nextjs':
      return new NextjsGenerator(config, targetDir);
    case 'angular':
      return new AngularGenerator(config, targetDir);
    case 'express':
      return new ExpressGenerator(config, targetDir);
    case 'fastapi':
      return new FastAPIGenerator(config, targetDir);
    default:
      throw new Error(`Unknown framework: ${config.framework}`);
  }
}

export { BaseGenerator } from './base.js';
