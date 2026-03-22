# scaffold

[![CI](https://github.com/CodeCanvasCollective/scaffold/actions/workflows/ci.yml/badge.svg)](https://github.com/CodeCanvasCollective/scaffold/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@codecanvascollective/scaffold)](https://www.npmjs.com/package/@codecanvascollective/scaffold)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> Interactive CLI tool for scaffolding modern full-stack projects.

Generate production-ready project structures for React, Next.js, Angular, Express, and FastAPI — with TypeScript, ESLint, Prettier, testing, and CI/CD pre-configured.

## Quick Start

```bash
npx @codecanvascollective/scaffold create my-app
```

Or use quick mode to skip prompts:

```bash
npx @codecanvascollective/scaffold create my-app --react
npx @codecanvascollective/scaffold create my-app --nextjs
npx @codecanvascollective/scaffold create my-app --express
```

## Supported Frameworks

| Framework | Type | Variants |
|-----------|------|----------|
| React + Vite | Frontend | Base, Tailwind, shadcn/ui |
| Next.js (App Router) | Frontend | Base, NextAuth, Prisma |
| Angular 18 | Frontend | Base |
| Express.js | Backend | Base, Prisma |
| FastAPI | Backend | Base |

## Features

- **Interactive prompts** — guided project setup with framework, features, and config selection
- **Quick mode** — skip prompts with `--react`, `--nextjs`, `--express` flags
- **Template variants** — choose between base setup and pre-configured add-ons
- **Feature selection** — ESLint, Prettier, Tailwind, testing, Docker, GitHub Actions, and more
- **Plugin system** — extend with custom templates and hooks
- **Multiple package managers** — npm, yarn, or pnpm

## Commands

```bash
scaffold create <name>          # Interactive project creation
scaffold create <name> --react  # Quick mode (skip prompts)
scaffold create <name> -y       # Use all defaults
scaffold create <name> --from config.json  # From config file
scaffold list                   # List available templates
scaffold doctor                 # Check system dependencies
scaffold --version              # Show version
scaffold --help                 # Show help
```

## Contributing

See [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) for development setup and contribution guidelines.

## Plugin System

Extend scaffold with custom plugins. See [docs/PLUGIN_GUIDE.md](docs/PLUGIN_GUIDE.md).

## License

MIT — [CodeCanvas Collective](https://codecanvascollective.com)
