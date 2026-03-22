import { BaseGenerator } from './base.js';
import { spinner, success } from '../utils/index.js';

export class FastAPIGenerator extends BaseGenerator {
  protected async generateBase(): Promise<void> {
    const baseDir = this.getBaseTemplateDir();

    const s = spinner('Configuring FastAPI + Pydantic');
    s.start();
    await this.renderDirectory(baseDir, this.targetDir);
    s.stop();
    success('Configuring FastAPI + Pydantic');

    if (this.config.features.testing) {
      success('Configuring Pytest');
    }
  }

  protected override async applySharedConfigs(): Promise<void> {
    // Python projects don't use ESLint/Prettier/tsconfig
    const path = await import('node:path');
    const sharedDir = path.join(this.templatesDir, 'shared');

    // Still apply gitignore, readme, license
    await this.renderTemplateFile(
      path.join(sharedDir, 'gitignore.hbs'),
      path.join(this.targetDir, '.gitignore'),
    );

    const s = spinner('Generating README.md');
    s.start();
    await this.renderTemplateFile(
      path.join(sharedDir, 'readme.md.hbs'),
      path.join(this.targetDir, 'README.md'),
    );
    s.stop();
    success('Generating README.md');

    await this.renderTemplateFile(
      path.join(sharedDir, 'license.hbs'),
      path.join(this.targetDir, 'LICENSE'),
    );
  }
}
