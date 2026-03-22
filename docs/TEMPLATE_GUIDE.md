# Template Guide

How to add new framework templates to scaffold.

## Directory Structure

Templates are organized under `src/templates/`:

```
src/templates/
├── <framework>/
│   ├── base/           # Minimal template (required)
│   │   ├── package.json.hbs
│   │   ├── tsconfig.json.hbs
│   │   └── src/
│   │       └── ...
│   ├── with-tailwind/  # Optional variant (overlay)
│   │   └── ...
│   └── with-auth/      # Optional variant (overlay)
│       └── ...
└── shared/             # Shared across all frameworks
    ├── gitignore.hbs
    ├── readme.md.hbs
    └── ...
```

## Writing Templates

Templates use [Handlebars](https://handlebarsjs.com/) with `.hbs` extension.

### Available Data

Every template receives the full `ProjectConfig` object:

```handlebars
{
  "name": "{{name}}",
  "version": "0.1.0"
}
```

### Conditionals

```handlebars
{{#if features.testing}}
"test": "vitest run",
{{/if}}
```

### Custom Helpers

| Helper | Usage | Description |
|--------|-------|-------------|
| `eq` | `{{#if (eq framework "react")}}` | Equality check |
| `neq` | `{{#if (neq framework "fastapi")}}` | Not-equal check |
| `or` | `{{#if (or features.eslint features.prettier)}}` | Logical OR |
| `and` | `{{#if (and features.tailwind features.shadcn)}}` | Logical AND |
| `year` | `{{year}}` | Current year |
| `lowercase` | `{{lowercase name}}` | Lowercase string |

## Adding a New Framework

### Step 1: Create templates

```bash
mkdir -p src/templates/vue/base/src
```

Add `.hbs` template files for the framework's essential files.

### Step 2: Create the generator

Create `src/generators/vue.ts`:

```typescript
import { BaseGenerator } from './base.js';
import { spinner, success } from '../utils/index.js';

export class VueGenerator extends BaseGenerator {
  protected async generateBase(): Promise<void> {
    const baseDir = this.getBaseTemplateDir();
    const s = spinner('Configuring Vue.js + Vite + TypeScript');
    s.start();
    await this.renderDirectory(baseDir, this.targetDir);
    s.stop();
    success('Configuring Vue.js + Vite + TypeScript');
  }
}
```

### Step 3: Register the framework

In `src/constants.ts`, add to `FRAMEWORKS` and the appropriate array.

In `src/generators/index.ts`, add the case to `createGenerator()`.

### Step 4: Add tests

Add test cases in `tests/unit/generators.test.ts`.

### Step 5: Test manually

```bash
npm run build
node dist/index.js create test-vue --vue --yes
```

## Adding a Variant

Variants use the **overlay** pattern — they contain only files that differ from `base/`. The generator merges base + variant automatically.

1. Create the variant directory: `src/templates/<framework>/with-<feature>/`
2. Add only the override files
3. Register the variant in `FRAMEWORKS[framework].variants` in `src/constants.ts`
