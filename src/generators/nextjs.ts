import { BaseGenerator } from './base.js';
import { spinner, success } from '../utils/index.js';

export class NextjsGenerator extends BaseGenerator {
  protected async generateBase(): Promise<void> {
    const baseDir = this.getBaseTemplateDir();

    const s = spinner('Configuring Next.js + App Router + TypeScript');
    s.start();
    await this.renderDirectory(baseDir, this.targetDir);
    s.stop();
    success('Configuring Next.js + App Router + TypeScript');

    if (this.config.features.testing) {
      success('Configuring Vitest');
    }
  }
}
