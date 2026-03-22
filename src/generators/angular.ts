import { BaseGenerator } from './base.js';
import { spinner, success } from '../utils/index.js';

export class AngularGenerator extends BaseGenerator {
  protected async generateBase(): Promise<void> {
    const baseDir = this.getBaseTemplateDir();

    const s = spinner('Configuring Angular 18 + TypeScript');
    s.start();
    await this.renderDirectory(baseDir, this.targetDir);
    s.stop();
    success('Configuring Angular 18 + TypeScript');
  }
}
