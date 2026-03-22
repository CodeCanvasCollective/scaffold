import { describe, it, expect, beforeEach } from 'vitest';
import { registerPlugin, getPlugins } from '../../src/plugins/index.js';
import type { ScaffoldPlugin } from '../../src/types/plugin.js';

describe('Plugin Registry', () => {
  it('registers and retrieves plugins', () => {
    const plugin: ScaffoldPlugin = {
      name: 'test-plugin',
      version: '1.0.0',
      description: 'A test plugin',
    };

    registerPlugin(plugin);
    const plugins = getPlugins();
    const found = plugins.find((p) => p.name === 'test-plugin');

    expect(found).toBeDefined();
    expect(found?.version).toBe('1.0.0');
  });
});
