# Contributing to scaffold

Thanks for your interest in contributing! This guide will help you get started.

## Prerequisites

- Node.js 20+
- git
- npm

## Setup

```bash
# Fork and clone the repo
git clone https://github.com/YOUR-USERNAME/scaffold.git
cd scaffold

# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test
```

## Development

```bash
# Watch mode (rebuilds on changes)
npm run dev

# Test the CLI locally
node dist/index.js create my-app --react --yes

# Run tests in watch mode
npm run test:watch
```

## Adding a New Template

1. Create a directory under `src/templates/<framework>/base/`
2. Add Handlebars template files (`.hbs` extension)
3. Create a generator class in `src/generators/<framework>.ts` extending `BaseGenerator`
4. Register it in `src/generators/index.ts` and `src/constants.ts`
5. Add tests in `tests/unit/generators.test.ts`
6. See [TEMPLATE_GUIDE.md](./TEMPLATE_GUIDE.md) for detailed instructions

## Adding a New Feature Option

1. Add the feature flag to `FeatureFlags` in `src/types/config.ts`
2. Add the prompt option in `src/prompts/features.ts`
3. Update `DEFAULT_FEATURES` in `src/types/config.ts`
4. Handle the feature in the appropriate generator(s)
5. Add shared templates if needed in `src/templates/shared/`

## Creating a Plugin

See [PLUGIN_GUIDE.md](./PLUGIN_GUIDE.md) for instructions on building custom plugins.

## Code Style

- TypeScript strict mode
- ESLint + Prettier enforced
- Run `npm run lint` and `npm run format` before committing

## Pull Request Process

1. Create a feature branch from `main`
2. Make your changes with tests
3. Ensure all tests pass: `npm test`
4. Ensure linting passes: `npm run lint`
5. Submit a PR with a clear description
6. Address review feedback

## Commit Messages

Use clear, descriptive commit messages:

- `feat: add Vue.js template`
- `fix: correct tsconfig path resolution`
- `docs: update contributing guide`
- `test: add Express generator tests`
