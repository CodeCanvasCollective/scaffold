import path from 'node:path';
import fs from 'fs-extra';
import Handlebars from 'handlebars';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Register custom Handlebars helpers
Handlebars.registerHelper('eq', (a: unknown, b: unknown) => a === b);
Handlebars.registerHelper('neq', (a: unknown, b: unknown) => a !== b);
Handlebars.registerHelper('or', (a: unknown, b: unknown) => a || b);
Handlebars.registerHelper('and', (a: unknown, b: unknown) => a && b);
Handlebars.registerHelper('lowercase', (str: string) => str?.toLowerCase());
Handlebars.registerHelper('year', () => new Date().getFullYear());
Handlebars.registerHelper('join', (arr: string[], sep: string) =>
  Array.isArray(arr) ? arr.join(typeof sep === 'string' ? sep : ', ') : '',
);

export function getTemplatesDir(): string {
  // When bundled with tsup, __dirname is dist/ → go up 1 level to project root
  // When running unbundled (vitest), __dirname is src/utils/ → go up 2 levels to project root
  // In both cases, templates live at <projectRoot>/src/templates
  const isBundled =
    __dirname.replace(/\\/g, '/').endsWith('/dist') ||
    __dirname.replace(/\\/g, '/').includes('/dist/');
  const projectRoot = isBundled
    ? path.resolve(__dirname, '..')
    : path.resolve(__dirname, '..', '..');
  return path.resolve(projectRoot, 'src', 'templates');
}

export async function createDir(dirPath: string): Promise<void> {
  await fs.ensureDir(dirPath);
}

export async function writeFile(filePath: string, content: string): Promise<void> {
  await fs.ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, content, 'utf-8');
}

export async function copyFile(src: string, dest: string): Promise<void> {
  await fs.ensureDir(path.dirname(dest));
  await fs.copy(src, dest);
}

export async function renderTemplate(templatePath: string, data: object): Promise<string> {
  const templateContent = await fs.readFile(templatePath, 'utf-8');
  const template = Handlebars.compile(templateContent, { noEscape: true });
  return template(data);
}

export async function renderAndWrite(
  templatePath: string,
  outputPath: string,
  data: object,
): Promise<void> {
  const content = await renderTemplate(templatePath, data);
  await writeFile(outputPath, content);
}

export async function directoryExists(dirPath: string): Promise<boolean> {
  try {
    const stat = await fs.stat(dirPath);
    return stat.isDirectory();
  } catch {
    return false;
  }
}

export async function fileExists(filePath: string): Promise<boolean> {
  try {
    const stat = await fs.stat(filePath);
    return stat.isFile();
  } catch {
    return false;
  }
}

export function getOutputFileName(templateName: string): string {
  return templateName.replace(/\.hbs$/, '');
}
