const fs = require('fs');
const path = require('path');
const CircularJSON = require('circular-json');

const { getCurrentDateTime } = require('./dateUtils');

const logToFile = process.env.LOG_TO_FILE || 'False';
const logFileName = process.env.LOG_FILE_NAME;

const logPrefix = '\x1b[36m[log]\x1b[0m';
const errorPrefix = '\x1b[31m[error]\x1b[0m';
const warnPrefix = '\x1b[33m[warning]\x1b[0m';
const infoPrefix = '\x1b[31m[Quantifuel]\x1b[0m';
const successPrefix = '\x1b[32m[success]\x1b[0m';
const failedPrefix = '\x1b[31m[failure]\x1b[0m';

const removeAnsiEscapeCodes = (str) => {
  const typeOfStr = typeof str;
  // consoleout.info(typeOfStr);
  if (typeOfStr === 'object') return CircularJSON.stringify(str, null, 2);
  if (typeOfStr === 'function') return str;
  if (typeOfStr === 'boolean') {
    if (str) {
      return 'true';
    }
    return 'false';
  }
  if (typeOfStr === 'bigint') return `${str}`;
  if (typeOfStr === 'number') return `${str}`;
  if (typeOfStr === 'symbol') return `${str}`;
  if (typeOfStr === 'string') return str.replace(/\x1B\[\d+m/gi, '');
  if (typeOfStr === 'null') return 'null';
  return 'undefined';
};

const customConsoleFunction = () => {
  const log = (...args) => {
    writeToLog(
      `${removeAnsiEscapeCodes(infoPrefix)} ${removeAnsiEscapeCodes(
        `\x1b[33m[${getCurrentDateTime()}]\x1b[0m`
      )} ${removeAnsiEscapeCodes(logPrefix)} ${args
        .map((arg) => removeAnsiEscapeCodes(arg))
        .join(' ')}\n\n`
    );
    console.log.apply(console, [
      `${infoPrefix} \x1b[33m[${getCurrentDateTime()}]\x1b[0m ${logPrefix}`,
      ...args,
    ]);
  };
  const error = (...args) => {
    writeToLog(
      `${removeAnsiEscapeCodes(infoPrefix)} ${removeAnsiEscapeCodes(
        `\x1b[33m[${getCurrentDateTime()}]\x1b[0m`
      )} ${removeAnsiEscapeCodes(errorPrefix)} ${args
        .map((arg) => removeAnsiEscapeCodes(arg))
        .join(' ')}\n\n`
    );
    console.error.apply(console, [
      `${infoPrefix} \x1b[33m[${getCurrentDateTime()}]\x1b[0m ${errorPrefix}`,
      ...args,
    ]);
  };
  const warn = (...args) => {
    console.warn.apply(console, [
      `${infoPrefix} \x1b[33m[${getCurrentDateTime()}]\x1b[0m ${warnPrefix}`,
      ...args,
    ]);
  };
  const info = (...args) => {
    console.info.apply(console, [
      `${infoPrefix} \x1b[33m[${getCurrentDateTime()}]\x1b[0m`,
      ...args,
    ]);
  };
  const success = (...args) => {
    writeToLog(
      `${removeAnsiEscapeCodes(infoPrefix)} ${removeAnsiEscapeCodes(
        `\x1b[33m[${getCurrentDateTime()}]\x1b[0m`
      )} ${removeAnsiEscapeCodes(successPrefix)} ${args
        .map((arg) => removeAnsiEscapeCodes(arg))
        .join(' ')}\n\n`
    );
    console.log.apply(console, [
      `${infoPrefix} \x1b[33m[${getCurrentDateTime()}]\x1b[0m ${successPrefix}`,
      ...args,
    ]);
  };
  const failed = (...args) => {
    writeToLog(
      `${removeAnsiEscapeCodes(infoPrefix)} ${removeAnsiEscapeCodes(
        `\x1b[33m[${getCurrentDateTime()}]\x1b[0m`
      )} ${removeAnsiEscapeCodes(failedPrefix)} ${args
        .map((arg) => removeAnsiEscapeCodes(arg))
        .join(' ')}\n\n`
    );
    console.log.apply(console, [
      `${infoPrefix} \x1b[33m[${getCurrentDateTime()}]\x1b[0m ${failedPrefix}`,
      ...args,
    ]);
  };
  return {
    log,
    error,
    failed,
    info,
    success,
    warn,
  };
};

const consoleout = customConsoleFunction();

global.consoleout = consoleout;

const logStream = logFileName
  ? fs.createWriteStream(path.join(__dirname, `../../${logFileName}`), {
      flags: 'a',
    })
  : undefined;

const writeToLog = (log) => {
  if (logFileName) {
    if (logToFile === 'True') {
      logStream.write(log, (err) => {
        if (err) {
          consoleout.error('Error writing to the log file:', err);
        }
      });
    }
  } else {
    consoleout.warn('Log file name is not set. Not logging to file.');
  }
};

module.exports = consoleout;
