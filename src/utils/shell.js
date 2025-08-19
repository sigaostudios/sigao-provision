import { execa } from 'execa';
import chalk from 'chalk';
import ora from 'ora';

export async function runCommand(command, args = [], options = {}) {
  const {
    sudo = false,
    silent = false,
    cwd = process.cwd(),
    env = process.env,
    shell = false,
    timeout = 300000, // 5 minutes default timeout
    stdio = undefined
  } = options;

  const fullCommand = sudo ? ['sudo', command, ...args] : [command, ...args];
  const [cmd, ...cmdArgs] = fullCommand;

  try {
    const result = await execa(cmd, cmdArgs, {
      cwd,
      env,
      shell,
      reject: false,
      timeout,
      killSignal: 'SIGTERM',
      stdio
    });

    // When stdio is inherit, result might not have stdout/stderr
    if (stdio === 'inherit') {
      // For inherit mode, exitCode 0 means success
      if (result && result.exitCode === 0) {
        return result;
      } else if (result && result.exitCode !== 0) {
        throw new Error(`Command failed with exit code ${result.exitCode}`);
      }
      // If no result object, assume success
      return { exitCode: 0 };
    }

    if (result.exitCode !== 0) {
      throw new Error(`Command failed: ${result.stderr || result.stdout}`);
    }

    return result;
  } catch (error) {
    if (error.timedOut) {
      const timeoutMsg = `Command timed out after ${timeout / 1000}s: ${fullCommand.join(' ')}`;
      if (!silent) {
        console.error(chalk.red(timeoutMsg));
      }
      throw new Error(timeoutMsg);
    }

    if (error.killed || error.signal) {
      const killMsg = `Command was interrupted: ${fullCommand.join(' ')}`;
      if (!silent) {
        console.error(chalk.yellow(killMsg));
      }
      throw new Error(killMsg);
    }

    if (!silent) {
      console.error(chalk.red(`Failed to run: ${fullCommand.join(' ')}`));
      console.error(chalk.red(error.message));
    }
    throw error;
  }
}

export async function runCommandWithLiveOutput(command, args = [], options = {}) {
  const {
    sudo = false,
    silent = false,
    cwd = process.cwd(),
    env = process.env,
    timeout = 300000,
    onOutput = null
  } = options;

  const fullCommand = sudo ? ['sudo', command, ...args] : [command, ...args];
  const [cmd, ...cmdArgs] = fullCommand;

  try {
    const subprocess = execa(cmd, cmdArgs, {
      cwd,
      env,
      timeout,
      killSignal: 'SIGTERM',
      buffer: false
    });

    if (onOutput && subprocess.stdout) {
      subprocess.stdout.on('data', data => {
        const text = data.toString();
        onOutput(text);
      });
    }

    if (onOutput && subprocess.stderr) {
      subprocess.stderr.on('data', data => {
        const text = data.toString();
        onOutput(text, true); // true indicates stderr
      });
    }

    const result = await subprocess;
    return result;
  } catch (error) {
    if (error.timedOut) {
      const timeoutMsg = `Command timed out after ${timeout / 1000}s: ${fullCommand.join(' ')}`;
      if (!silent) {
        console.error(chalk.red(timeoutMsg));
      }
      throw new Error(timeoutMsg);
    }

    if (error.killed || error.signal) {
      const killMsg = `Command was interrupted: ${fullCommand.join(' ')}`;
      if (!silent) {
        console.error(chalk.yellow(killMsg));
      }
      throw new Error(killMsg);
    }

    if (!silent) {
      console.error(chalk.red(`Failed to run: ${fullCommand.join(' ')}`));
      console.error(chalk.red(error.message));
    }
    throw error;
  }
}

export async function runWithSpinner(message, fn) {
  const spinner = ora(message).start();

  // Handle Ctrl+C during spinner
  const onSignal = () => {
    spinner.stop();
    console.log(chalk.yellow('\nOperation interrupted'));
  };

  process.once('SIGINT', onSignal);
  process.once('SIGTERM', onSignal);

  try {
    const result = await fn(spinner);
    spinner.succeed();
    return result;
  } catch (error) {
    if (error.message.includes('interrupted')) {
      spinner.warn(chalk.yellow('Operation was interrupted'));
    } else {
      spinner.fail();
    }
    throw error;
  } finally {
    process.removeListener('SIGINT', onSignal);
    process.removeListener('SIGTERM', onSignal);
  }
}

export async function runWithProgressiveSpinner(initialMessage, fn) {
  const spinner = ora(initialMessage).start();

  // Handle Ctrl+C during spinner
  const onSignal = () => {
    spinner.stop();
    console.log(chalk.yellow('\nOperation interrupted'));
  };

  process.once('SIGINT', onSignal);
  process.once('SIGTERM', onSignal);

  // Progress updater function
  const updateProgress = message => {
    spinner.text = message;
  };

  try {
    const result = await fn(spinner, updateProgress);
    spinner.succeed();
    return result;
  } catch (error) {
    if (error.message.includes('interrupted')) {
      spinner.warn(chalk.yellow('Operation was interrupted'));
    } else {
      spinner.fail();
    }
    throw error;
  } finally {
    process.removeListener('SIGINT', onSignal);
    process.removeListener('SIGTERM', onSignal);
  }
}

export async function checkCommandExists(command) {
  try {
    // Use appropriate command existence check based on platform
    if (process.platform === 'win32') {
      await execa('where', [command]);
    } else {
      await execa('which', [command]);
    }
    return true;
  } catch {
    return false;
  }
}

export function runShellScript(script, options = {}) {
  // Trim the script to remove leading/trailing whitespace
  const normalizedScript = script.trim();

  // Preserve the script structure for proper shell execution
  // Only trim each line but maintain line breaks for shell constructs
  const cleanScript = normalizedScript
    .split('\n')
    .map(line => line.trim())
    .join('\n');

  // Use bash -c with the full multi-line script
  // Bash can handle multi-line scripts properly when passed to -c
  return runCommand('bash', ['-c', cleanScript], { ...options, shell: false });
}

export function createCommandRunner(defaults = {}) {
  return {
    run: (command, args, options) => runCommand(command, args, { ...defaults, ...options }),
    runSudo: (command, args, options) => runCommand(command, args, { ...defaults, ...options, sudo: true }),
    runScript: (script, options) => runShellScript(script, { ...defaults, ...options }),
    exists: checkCommandExists
  };
}
