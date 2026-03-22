import type { ScaffoldPlugin } from './types.js';
import { debug, warn } from '../utils/logger.js';

const pluginRegistry: ScaffoldPlugin[] = [];

export function registerPlugin(plugin: ScaffoldPlugin): void {
  pluginRegistry.push(plugin);
  debug(`Plugin registered: ${plugin.name}@${plugin.version}`);
}

export function getPlugins(): ScaffoldPlugin[] {
  return [...pluginRegistry];
}

export async function loadPluginsFromNodeModules(): Promise<void> {
  // Scan node_modules for scaffold-plugin-* packages
  try {
    const fs = await import('fs-extra');
    const path = await import('node:path');
    const nodeModulesDir = path.join(process.cwd(), 'node_modules');

    if (!(await fs.pathExists(nodeModulesDir))) return;

    const entries = await fs.readdir(nodeModulesDir);
    const pluginDirs = entries.filter((e) => e.startsWith('scaffold-plugin-'));

    for (const dir of pluginDirs) {
      try {
        const pluginPath = path.join(nodeModulesDir, dir);
        const pluginModule = await import(pluginPath);
        const plugin: ScaffoldPlugin = pluginModule.default || pluginModule;
        registerPlugin(plugin);
      } catch (err) {
        warn(`Failed to load plugin ${dir}: ${err}`);
      }
    }
  } catch {
    debug('No plugins directory found');
  }
}

export async function loadPluginFromPath(pluginPath: string): Promise<void> {
  try {
    const path = await import('node:path');
    const resolvedPath = path.resolve(process.cwd(), pluginPath);
    const pluginModule = await import(resolvedPath);
    const plugin: ScaffoldPlugin = pluginModule.default || pluginModule;
    registerPlugin(plugin);
  } catch (err) {
    warn(`Failed to load plugin from ${pluginPath}: ${err}`);
  }
}
