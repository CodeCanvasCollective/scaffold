import path from 'node:path';
import { BaseGenerator } from './base.js';
import { ReactGenerator } from './react.js';
import { NextjsGenerator } from './nextjs.js';
import { AngularGenerator } from './angular.js';
import { ExpressGenerator } from './express.js';
import { spinner, success, createDir, writeFile } from '../utils/index.js';
import type { ProjectConfig } from '../types/index.js';

export class FullstackGenerator extends BaseGenerator {
  protected async generateBase(): Promise<void> {
    const s = spinner('Setting up full-stack monorepo');
    s.start();

    // Create apps directories
    const webDir = path.join(this.targetDir, 'apps', 'web');
    const apiDir = path.join(this.targetDir, 'apps', 'api');
    await createDir(webDir);
    await createDir(apiDir);

    s.stop();
    success('Setting up full-stack monorepo');

    // Generate frontend in apps/web
    const frontendConfig: ProjectConfig = {
      ...this.config,
      type: 'frontend',
      gitInit: false,
    };

    const frontendGen = this.createFrontendGenerator(frontendConfig, webDir);
    await frontendGen.generate();

    // Generate backend in apps/api
    const backendConfig: ProjectConfig = {
      ...this.config,
      type: 'backend',
      framework: 'express',
      gitInit: false,
    };

    const backendGen = new ExpressGenerator(backendConfig, apiDir);
    await backendGen.generate();

    // Write root package.json for workspaces
    const rootPkgPath = path.join(this.targetDir, 'package.json');
    const rootPkg = {
      name: this.config.name,
      private: true,
      workspaces: ['apps/*'],
      scripts: {
        dev: 'npm run --workspaces dev',
        build: 'npm run --workspaces build',
        lint: 'npm run --workspaces lint',
        test: 'npm run --workspaces test',
      },
    };
    await writeFile(rootPkgPath, JSON.stringify(rootPkg, null, 2) + '\n');
  }

  private createFrontendGenerator(config: ProjectConfig, targetDir: string): BaseGenerator {
    switch (config.framework) {
      case 'nextjs':
        return new NextjsGenerator(config, targetDir);
      case 'angular':
        return new AngularGenerator(config, targetDir);
      case 'react':
      default:
        return new ReactGenerator(config, targetDir);
    }
  }
}
