import path from 'node:path';
import { BaseGenerator } from './base.js';
import { spinner, success } from '../utils/index.js';

export class ReactGenerator extends BaseGenerator {
  protected async generateBase(): Promise<void> {
    const baseDir = this.getBaseTemplateDir();

    const s = spinner('Configuring React + Vite + TypeScript');
    s.start();
    await this.renderDirectory(baseDir, this.targetDir);
    s.stop();
    success('Configuring React + Vite + TypeScript');

    if (this.config.features.testing) {
      success('Configuring Vitest');
    }
  }

  private getVariantPath(variant: string): string {
    return path.join(this.templatesDir, 'react', variant);
  }
}
