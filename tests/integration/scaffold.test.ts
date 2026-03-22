import { describe, it, expect, afterEach } from 'vitest';
import { execSync } from 'node:child_process';
import path from 'node:path';
import fs from 'fs-extra';
import os from 'node:os';

function createTempDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'scaffold-integration-'));
}

const tempDirs: string[] = [];

afterEach(async () => {
  for (const dir of tempDirs) {
    await fs.remove(dir);
  }
  tempDirs.length = 0;
});

const CLI_PATH = path.resolve(__dirname, '../../dist/index.js');

function runCli(args: string, cwd: string): string {
  return execSync(`node "${CLI_PATH}" ${args}`, {
    cwd,
    encoding: 'utf-8',
    stdio: ['pipe', 'pipe', 'pipe'],
  });
}

describe('scaffold CLI', () => {
  it('shows help text', () => {
    const tempDir = createTempDir();
    tempDirs.push(tempDir);
    const output = runCli('--help', tempDir);
    expect(output).toContain('scaffold');
    expect(output).toContain('create');
    expect(output).toContain('list');
    expect(output).toContain('doctor');
  });

  it('shows version', () => {
    const tempDir = createTempDir();
    tempDirs.push(tempDir);
    const output = runCli('--version', tempDir);
    expect(output.trim()).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it('lists available templates', () => {
    const tempDir = createTempDir();
    tempDirs.push(tempDir);
    const output = runCli('list', tempDir);
    expect(output).toContain('React + Vite');
    expect(output).toContain('Next.js');
    expect(output).toContain('Express');
    expect(output).toContain('FastAPI');
    expect(output).toContain('Angular');
  });

  it('creates a React project with --react --yes', () => {
    const tempDir = createTempDir();
    tempDirs.push(tempDir);
    const output = runCli('create my-app --react --yes', tempDir);
    expect(output).toContain('created successfully');

    const projectDir = path.join(tempDir, 'my-app');
    expect(fs.pathExistsSync(path.join(projectDir, 'package.json'))).toBe(true);
    expect(fs.pathExistsSync(path.join(projectDir, 'src', 'App.tsx'))).toBe(true);
    expect(fs.pathExistsSync(path.join(projectDir, 'vite.config.ts'))).toBe(true);
  });

  it('creates an Express project with --express --yes', () => {
    const tempDir = createTempDir();
    tempDirs.push(tempDir);
    const output = runCli('create my-api --express --yes', tempDir);
    expect(output).toContain('created successfully');

    const projectDir = path.join(tempDir, 'my-api');
    expect(fs.pathExistsSync(path.join(projectDir, 'package.json'))).toBe(true);
    expect(fs.pathExistsSync(path.join(projectDir, 'src', 'index.ts'))).toBe(true);
  });

  it('rejects invalid project names', () => {
    const tempDir = createTempDir();
    tempDirs.push(tempDir);
    expect(() => runCli('create "Invalid Name" --react --yes', tempDir)).toThrow();
  });
});
