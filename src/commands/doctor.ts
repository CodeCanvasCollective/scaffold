import { Command } from 'commander';
import { execSync } from 'node:child_process';
import chalk from 'chalk';
import { newLine } from '../utils/logger.js';

interface Check {
  name: string;
  command: string;
  versionFlag?: string;
  required: boolean;
}

const CHECKS: Check[] = [
  { name: 'Node.js', command: 'node', versionFlag: '--version', required: true },
  { name: 'npm', command: 'npm', versionFlag: '--version', required: false },
  { name: 'yarn', command: 'yarn', versionFlag: '--version', required: false },
  { name: 'pnpm', command: 'pnpm', versionFlag: '--version', required: false },
  { name: 'git', command: 'git', versionFlag: '--version', required: true },
  { name: 'Python', command: 'python3', versionFlag: '--version', required: false },
];

export function doctorCommand(): Command {
  return new Command('doctor').description('Check system dependencies').action(() => {
    newLine();
    console.log(chalk.bold.cyan('System Check'));
    console.log(chalk.gray('─'.repeat(40)));
    newLine();

    let allGood = true;

    for (const check of CHECKS) {
      try {
        const version = execSync(`${check.command} ${check.versionFlag ?? '--version'}`, {
          encoding: 'utf-8',
          stdio: ['pipe', 'pipe', 'pipe'],
        }).trim();

        const versionStr = version.split('\n')[0];
        console.log(`  ${chalk.green('✔')} ${check.name.padEnd(12)} ${chalk.gray(versionStr)}`);
      } catch {
        if (check.required) {
          console.log(
            `  ${chalk.red('✖')} ${check.name.padEnd(12)} ${chalk.red('not found (required)')}`,
          );
          allGood = false;
        } else {
          console.log(
            `  ${chalk.yellow('–')} ${check.name.padEnd(12)} ${chalk.gray('not found (optional)')}`,
          );
        }
      }
    }

    newLine();

    if (allGood) {
      console.log(chalk.green('  All required dependencies are installed!'));
    } else {
      console.log(chalk.red('  Some required dependencies are missing.'));
    }

    newLine();
  });
}
