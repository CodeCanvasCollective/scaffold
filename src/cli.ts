import { Command } from 'commander';
import { createCommand } from './commands/create.js';
import { listCommand } from './commands/list.js';
import { doctorCommand } from './commands/doctor.js';
import { setVerbose } from './utils/logger.js';

export function createCli(): Command {
  const program = new Command();

  program
    .name('scaffold')
    .description('CLI tool for scaffolding modern full-stack projects')
    .version('0.1.1')
    .option('--verbose', 'Enable verbose output')
    .hook('preAction', (thisCommand) => {
      const opts = thisCommand.opts();
      if (opts.verbose) {
        setVerbose(true);
      }
    });

  program.addCommand(createCommand());
  program.addCommand(listCommand());
  program.addCommand(doctorCommand());

  return program;
}
