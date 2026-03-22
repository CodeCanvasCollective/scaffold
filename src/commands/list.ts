import { Command } from 'commander';
import chalk from 'chalk';
import { FRAMEWORKS, VARIANT_DISPLAY_NAMES } from '../constants.js';
import type { FrameworkType } from '../types/index.js';
import { newLine } from '../utils/logger.js';

export function listCommand(): Command {
  return new Command('list').description('List all available templates').action(() => {
    newLine();
    console.log(chalk.bold.cyan('Available Templates'));
    console.log(chalk.gray('─'.repeat(60)));
    newLine();

    const categories = {
      Frontend: ['react', 'nextjs', 'angular'] as FrameworkType[],
      Backend: ['express', 'fastapi'] as FrameworkType[],
    };

    for (const [category, frameworks] of Object.entries(categories)) {
      console.log(chalk.bold.white(`  ${category}`));
      newLine();

      for (const fw of frameworks) {
        const meta = FRAMEWORKS[fw];
        console.log(
          `  ${chalk.green(meta.displayName.padEnd(25))} ${chalk.gray(meta.description)}`,
        );

        for (const variant of meta.variants) {
          const label = VARIANT_DISPLAY_NAMES[variant];
          console.log(`    ${chalk.gray('•')} ${label}`);
        }
        newLine();
      }
    }

    console.log(chalk.gray('─'.repeat(60)));
    console.log(
      chalk.gray('  Use'),
      chalk.cyan('scaffold create <name> --<framework>'),
      chalk.gray('for quick setup'),
    );
    newLine();
  });
}
