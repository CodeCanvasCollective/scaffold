# Plugin Guide

scaffold supports plugins that extend its functionality with new frameworks, features, and lifecycle hooks.

## Plugin Interface

```typescript
interface ScaffoldPlugin {
  name: string;
  version: string;
  description: string;
  frameworks?: FrameworkMeta[];
  features?: FeatureDefinition[];
  hooks?: {
    beforeGenerate?: (config: ProjectConfig) => Promise<void>;
    afterGenerate?: (config: ProjectConfig, outputPath: string) => Promise<void>;
  };
}
```

## Creating a Plugin

### 1. Create a new npm package

Name it with the `scaffold-plugin-` prefix:

```bash
mkdir scaffold-plugin-vue
cd scaffold-plugin-vue
npm init -y
```

### 2. Implement the plugin

```typescript
// index.ts
import type { ScaffoldPlugin } from '@codecanvascollective/scaffold';

const plugin: ScaffoldPlugin = {
  name: 'scaffold-plugin-vue',
  version: '1.0.0',
  description: 'Vue.js template for scaffold',
  frameworks: [
    {
      name: 'vue',
      displayName: 'Vue.js',
      description: 'Vue 3 with Vite and TypeScript',
      type: 'frontend',
      variants: ['base', 'with-tailwind'],
      language: 'typescript',
    },
  ],
  hooks: {
    afterGenerate: async (config, outputPath) => {
      console.log(`Vue project generated at ${outputPath}`);
    },
  },
};

export default plugin;
```

### 3. Publish and use

```bash
npm publish
# In a project using scaffold:
npm install scaffold-plugin-vue
```

Plugins prefixed with `scaffold-plugin-` are automatically discovered from `node_modules`.

## Loading Local Plugins

Use the `--plugin` flag to load a plugin from a local path:

```bash
scaffold create my-app --plugin ./my-local-plugin.js
```

## Lifecycle Hooks

- **beforeGenerate**: Called before any files are generated. Use for validation or config transformation.
- **afterGenerate**: Called after all files are generated. Use for post-processing, running commands, or cleanup.
