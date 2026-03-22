import { describe, it, expect, afterEach } from 'vitest';
import path from 'node:path';
import fs from 'fs-extra';
import os from 'node:os';
import { createGenerator } from '../../src/generators/index.js';
import type { ProjectConfig } from '../../src/types/index.js';
import { DEFAULT_CONFIG } from '../../src/types/index.js';

function createTempDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'scaffold-test-'));
}

const tempDirs: string[] = [];

afterEach(async () => {
  for (const dir of tempDirs) {
    await fs.remove(dir);
  }
  tempDirs.length = 0;
});

function makeConfig(overrides: Partial<ProjectConfig> = {}): ProjectConfig {
  return {
    ...DEFAULT_CONFIG,
    name: 'test-project',
    gitInit: false,
    ...overrides,
  };
}

describe('createGenerator', () => {
  it('returns a ReactGenerator for react framework', () => {
    const config = makeConfig({ framework: 'react' });
    const gen = createGenerator(config, '/tmp/test');
    expect(gen.constructor.name).toBe('ReactGenerator');
  });

  it('returns a NextjsGenerator for nextjs framework', () => {
    const config = makeConfig({ framework: 'nextjs' });
    const gen = createGenerator(config, '/tmp/test');
    expect(gen.constructor.name).toBe('NextjsGenerator');
  });

  it('returns an AngularGenerator for angular framework', () => {
    const config = makeConfig({ framework: 'angular' });
    const gen = createGenerator(config, '/tmp/test');
    expect(gen.constructor.name).toBe('AngularGenerator');
  });

  it('returns an ExpressGenerator for express framework', () => {
    const config = makeConfig({ framework: 'express', type: 'backend' });
    const gen = createGenerator(config, '/tmp/test');
    expect(gen.constructor.name).toBe('ExpressGenerator');
  });

  it('returns a FastAPIGenerator for fastapi framework', () => {
    const config = makeConfig({ framework: 'fastapi', type: 'backend' });
    const gen = createGenerator(config, '/tmp/test');
    expect(gen.constructor.name).toBe('FastAPIGenerator');
  });

  it('returns a FullstackGenerator for fullstack type', () => {
    const config = makeConfig({ type: 'fullstack' });
    const gen = createGenerator(config, '/tmp/test');
    expect(gen.constructor.name).toBe('FullstackGenerator');
  });
});

describe('ReactGenerator', () => {
  it('generates a React project with expected files', async () => {
    const tempDir = createTempDir();
    tempDirs.push(tempDir);
    const targetDir = path.join(tempDir, 'my-react-app');

    const config = makeConfig({ framework: 'react', name: 'my-react-app' });
    const gen = createGenerator(config, targetDir);
    await gen.generate();

    expect(await fs.pathExists(path.join(targetDir, 'package.json'))).toBe(true);
    expect(await fs.pathExists(path.join(targetDir, 'vite.config.ts'))).toBe(true);
    expect(await fs.pathExists(path.join(targetDir, 'tsconfig.json'))).toBe(true);
    expect(await fs.pathExists(path.join(targetDir, 'index.html'))).toBe(true);
    expect(await fs.pathExists(path.join(targetDir, 'src', 'App.tsx'))).toBe(true);
    expect(await fs.pathExists(path.join(targetDir, 'src', 'main.tsx'))).toBe(true);
    expect(await fs.pathExists(path.join(targetDir, 'README.md'))).toBe(true);
    expect(await fs.pathExists(path.join(targetDir, '.gitignore'))).toBe(true);

    const pkgJson = await fs.readJSON(path.join(targetDir, 'package.json'));
    expect(pkgJson.name).toBe('my-react-app');
    expect(pkgJson.dependencies.react).toBeDefined();
  });
});

describe('ExpressGenerator', () => {
  it('generates an Express project with expected files', async () => {
    const tempDir = createTempDir();
    tempDirs.push(tempDir);
    const targetDir = path.join(tempDir, 'my-api');

    const config = makeConfig({
      framework: 'express',
      type: 'backend',
      name: 'my-api',
    });
    const gen = createGenerator(config, targetDir);
    await gen.generate();

    expect(await fs.pathExists(path.join(targetDir, 'package.json'))).toBe(true);
    expect(await fs.pathExists(path.join(targetDir, 'tsconfig.json'))).toBe(true);
    expect(await fs.pathExists(path.join(targetDir, 'src', 'index.ts'))).toBe(true);
    expect(await fs.pathExists(path.join(targetDir, 'src', 'routes', 'index.ts'))).toBe(true);
    expect(await fs.pathExists(path.join(targetDir, 'src', 'middleware', 'errorHandler.ts'))).toBe(
      true,
    );

    const pkgJson = await fs.readJSON(path.join(targetDir, 'package.json'));
    expect(pkgJson.name).toBe('my-api');
    expect(pkgJson.dependencies.express).toBeDefined();
  });
});

describe('NextjsGenerator', () => {
  it('generates a Next.js project with expected files', async () => {
    const tempDir = createTempDir();
    tempDirs.push(tempDir);
    const targetDir = path.join(tempDir, 'my-next-app');

    const config = makeConfig({ framework: 'nextjs', name: 'my-next-app' });
    const gen = createGenerator(config, targetDir);
    await gen.generate();

    expect(await fs.pathExists(path.join(targetDir, 'package.json'))).toBe(true);
    expect(await fs.pathExists(path.join(targetDir, 'next.config.ts'))).toBe(true);
    expect(await fs.pathExists(path.join(targetDir, 'src', 'app', 'layout.tsx'))).toBe(true);
    expect(await fs.pathExists(path.join(targetDir, 'src', 'app', 'page.tsx'))).toBe(true);

    const pkgJson = await fs.readJSON(path.join(targetDir, 'package.json'));
    expect(pkgJson.name).toBe('my-next-app');
    expect(pkgJson.dependencies.next).toBeDefined();
  });
});

describe('FastAPIGenerator', () => {
  it('generates a FastAPI project with expected files', async () => {
    const tempDir = createTempDir();
    tempDirs.push(tempDir);
    const targetDir = path.join(tempDir, 'my-fastapi');

    const config = makeConfig({
      framework: 'fastapi',
      type: 'backend',
      name: 'my-fastapi',
      features: {
        ...DEFAULT_CONFIG.features,
        eslint: false,
        prettier: false,
        typescript: false,
      },
    });
    const gen = createGenerator(config, targetDir);
    await gen.generate();

    expect(await fs.pathExists(path.join(targetDir, 'requirements.txt'))).toBe(true);
    expect(await fs.pathExists(path.join(targetDir, 'pyproject.toml'))).toBe(true);
    expect(await fs.pathExists(path.join(targetDir, 'app', 'main.py'))).toBe(true);
    expect(await fs.pathExists(path.join(targetDir, 'README.md'))).toBe(true);
  });
});
