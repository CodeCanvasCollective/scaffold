import path from 'node:path';
import fs from 'fs-extra';
import { execSync } from 'node:child_process';
import { createDir, renderAndWrite, getTemplatesDir, spinner, success, debug } from '../utils/index.js';
import type { ProjectConfig } from '../types/index.js';
import type { GeneratorResult } from '../types/generator.js';

export abstract class BaseGenerator {
  protected config: ProjectConfig;
  protected targetDir: string;
  protected templatesDir: string;
  protected result: GeneratorResult = { filesCreated: [], warnings: [] };

  constructor(config: ProjectConfig, targetDir: string) {
    this.config = config;
    this.targetDir = targetDir;
    this.templatesDir = getTemplatesDir();
  }

  async generate(): Promise<GeneratorResult> {
    await this.createProjectDir();
    await this.generateBase();
    await this.applyVariant();
    await this.applySharedConfigs();
    await this.applyFeatures();
    await this.initGit();
    return this.result;
  }

  protected abstract generateBase(): Promise<void>;

  protected async applyVariant(): Promise<void> {
    if (this.config.variant === 'base') return;

    const variantDir = this.getVariantTemplateDir();
    if (await fs.pathExists(variantDir)) {
      const s = spinner(`Applying ${this.config.variant} variant`);
      s.start();
      await this.renderDirectory(variantDir, this.targetDir);
      s.stop();
      success(`Applied ${this.config.variant} variant`);
    }
  }

  protected async applySharedConfigs(): Promise<void> {
    const sharedDir = path.join(this.templatesDir, 'shared');

    if (this.config.features.eslint) {
      const s = spinner('Setting up ESLint + Prettier');
      s.start();
      await this.renderTemplateFile(
        path.join(sharedDir, 'eslint.config.js.hbs'),
        path.join(this.targetDir, 'eslint.config.js'),
      );
      await this.renderTemplateFile(
        path.join(sharedDir, 'prettier.config.js.hbs'),
        path.join(this.targetDir, '.prettierrc'),
      );
      s.stop();
      success('Setting up ESLint + Prettier');
    }

    // Gitignore
    await this.renderTemplateFile(
      path.join(sharedDir, 'gitignore.hbs'),
      path.join(this.targetDir, '.gitignore'),
    );

    // README
    const s2 = spinner('Generating README.md');
    s2.start();
    await this.renderTemplateFile(
      path.join(sharedDir, 'readme.md.hbs'),
      path.join(this.targetDir, 'README.md'),
    );
    s2.stop();
    success('Generating README.md');

    // License
    await this.renderTemplateFile(
      path.join(sharedDir, 'license.hbs'),
      path.join(this.targetDir, 'LICENSE'),
    );
  }

  protected async applyFeatures(): Promise<void> {
    const sharedDir = path.join(this.templatesDir, 'shared');

    if (this.config.features.githubActions) {
      const s = spinner('Creating GitHub Actions workflow');
      s.start();
      await this.renderTemplateFile(
        path.join(sharedDir, 'github-ci.yml.hbs'),
        path.join(this.targetDir, '.github', 'workflows', 'ci.yml'),
      );
      s.stop();
      success('Creating GitHub Actions workflow');
    }

    if (this.config.features.docker) {
      const s = spinner('Adding Docker configuration');
      s.start();
      await this.renderTemplateFile(
        path.join(sharedDir, 'docker', 'Dockerfile.hbs'),
        path.join(this.targetDir, 'Dockerfile'),
      );
      await this.renderTemplateFile(
        path.join(sharedDir, 'docker', 'docker-compose.yml.hbs'),
        path.join(this.targetDir, 'docker-compose.yml'),
      );
      s.stop();
      success('Adding Docker configuration');
    }
  }

  protected async createProjectDir(): Promise<void> {
    const s = spinner('Creating project structure');
    s.start();
    await createDir(this.targetDir);
    s.stop();
    success('Creating project structure');
  }

  protected async initGit(): Promise<void> {
    if (!this.config.gitInit) return;

    const s = spinner('Initializing git repository');
    s.start();
    try {
      execSync('git init', { cwd: this.targetDir, stdio: 'pipe' });
      execSync('git add -A', { cwd: this.targetDir, stdio: 'pipe' });
      execSync('git commit -m "Initial commit from scaffold"', {
        cwd: this.targetDir,
        stdio: 'pipe',
      });
      s.stop();
      success('Initializing git repository');
    } catch {
      s.stop();
      debug('Git initialization skipped (git not available)');
    }
  }

  protected async renderTemplateFile(
    templatePath: string,
    outputPath: string,
  ): Promise<void> {
    const templateData = this.getTemplateData();

    if (await fs.pathExists(templatePath)) {
      await renderAndWrite(templatePath, outputPath, templateData);
      this.result.filesCreated.push(outputPath);
    } else {
      debug(`Template not found: ${templatePath}`);
    }
  }

  protected async renderDirectory(srcDir: string, destDir: string): Promise<void> {
    const entries = await fs.readdir(srcDir, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(srcDir, entry.name);
      const destName = entry.name.replace(/\.hbs$/, '');
      const destPath = path.join(destDir, destName);

      if (entry.isDirectory()) {
        await this.renderDirectory(srcPath, destPath);
      } else if (entry.name.endsWith('.hbs')) {
        await this.renderTemplateFile(srcPath, destPath);
      } else {
        await fs.ensureDir(path.dirname(destPath));
        await fs.copy(srcPath, destPath);
        this.result.filesCreated.push(destPath);
      }
    }
  }

  protected getTemplateData(): object {
    return {
      ...this.config,
      year: new Date().getFullYear(),
    };
  }

  protected getBaseTemplateDir(): string {
    return path.join(this.templatesDir, this.config.framework, 'base');
  }

  protected getVariantTemplateDir(): string {
    return path.join(this.templatesDir, this.config.framework, this.config.variant);
  }
}
