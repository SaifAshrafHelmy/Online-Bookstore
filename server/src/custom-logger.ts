import chalk from 'chalk';
const logger = {
  info: (...args) => {
    const processedArgs = args.map((arg) => {
      if (typeof arg === 'object') {
        return JSON.stringify(arg, null, 2); // Pretty print nested objects
      }
      return arg;
    });

    console.log(
      `${new Date().toLocaleTimeString()}`,
      chalk.bold.green('(INFO)    : ', ...processedArgs),
    );
  },

  data: (...args) => {
    const processedArgs = args.map((arg) => {
      if (typeof arg === 'object') {
        return JSON.stringify(arg, null, 2); // Pretty print nested objects
      }
      return arg;
    });

    console.log(
      `${new Date().toLocaleTimeString()}`,
      chalk.bold.blue('(DATA)    : '),
      chalk.bold.bgWhite.blue(...processedArgs),
    );
  },
  warn: (...args) => {
    const processedArgs = args.map((arg) => {
      if (typeof arg === 'object') {
        return JSON.stringify(arg, null, 2); // Pretty print nested objects
      }
      return arg;
    });
    console.log(
      `${new Date().toLocaleTimeString()}`,
      chalk.hex('#FFA500')('(WARNING) : ', ...processedArgs),
    );
  },
  error: (...args) => {
    const processedArgs = args.map((arg) => {
      if (typeof arg === 'object') {
        return JSON.stringify(arg, null, 2); // Pretty print nested objects
      }
      return arg;
    });
    const error = args.find(
      (arg) => typeof arg === 'object' && arg instanceof Error,
    );
    const errorStack = error ? error.stack : '';

    console.log(
      `${new Date().toLocaleTimeString()}`,
      chalk.bold.red('(ERROR)   : ', ...processedArgs),
    );
    console.log(chalk.bold.bgWhite.red(errorStack));
  },
  log: (...args) => {
    logger.info(...args);
  },
  debug: (...args) => {
    logger.data(...args);
  },
};

export default logger;
