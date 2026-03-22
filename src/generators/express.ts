import { BaseGenerator } from './base.js';
import { spinner, success } from '../utils/index.js';

export class ExpressGenerator extends BaseGenerator {
  protected async generateBase(): Promise<void> {
    const baseDir = this.getBaseTemplateDir();

    const s = spinner('Configuring Express 5 + TypeScript');
    s.start();
    await this.renderDirectory(baseDir, this.targetDir);
    s.stop();
    success('Configuring Express 5 + TypeScript');

    if (this.config.features.testing) {
      success('Configuring Vitest');
    }
  }
}
