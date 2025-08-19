import chalk from 'chalk';

const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3
};

class Logger {
  constructor(options = {}) {
    this.level = options.level || 'info';
    this.useColor = options.color !== false;
    this.prefix = options.prefix || '';
  }

  _shouldLog(level) {
    return logLevels[level] <= logLevels[this.level];
  }

  _format(level, message, ..._args) {
    const timestamp = new Date().toISOString();
    const prefix = this.prefix ? `[${this.prefix}] ` : '';

    if (!this.useColor) {
      return `${timestamp} ${level.toUpperCase()} ${prefix}${message}`;
    }

    const levelColors = {
      error: chalk.red,
      warn: chalk.yellow,
      info: chalk.blue,
      debug: chalk.gray,
      success: chalk.green
    };

    const color = levelColors[level] || chalk.white;
    return `${chalk.gray(timestamp)} ${color(level.toUpperCase())} ${prefix}${message}`;
  }

  error(message, ..._args) {
    if (this._shouldLog('error')) {
      console.error(this._format('error', message, ..._args));
    }
  }

  warn(message, ..._args) {
    if (this._shouldLog('warn')) {
      console.warn(this._format('warn', message, ..._args));
    }
  }

  info(message, ..._args) {
    if (this._shouldLog('info')) {
      console.log(this._format('info', message, ..._args));
    }
  }

  debug(message, ..._args) {
    if (this._shouldLog('debug')) {
      console.log(this._format('debug', message, ..._args));
    }
  }

  success(message, ..._args) {
    console.log(this._format('success', message, ..._args));
  }

  section(title) {
    const line = '='.repeat(50);
    console.log(`\n${chalk.cyan(line)}`);
    console.log(chalk.cyan.bold(title.toUpperCase()));
    console.log(`${chalk.cyan(line)}\n`);
  }

  subsection(title) {
    console.log(`\n${chalk.magenta(`▸ ${title}`)}`);
  }

  list(items) {
    items.forEach(item => {
      console.log(chalk.gray('  • ') + item);
    });
  }

  table(data) {
    console.table(data);
  }
}

export function createLogger(options = {}) {
  return new Logger(options);
}

export default createLogger();
