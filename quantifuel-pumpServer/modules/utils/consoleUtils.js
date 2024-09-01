//------------------------------
//  AUTHOR: jone_santhanaraj
//------------------------------

const fs = require('fs');
const path = require('path');
const CircularJSON = require('circular-json');

const { getCurrentDateTime } = require('./dateUtils');

const logToFile = process.env.LOG_TO_FILE || 'False';
const logFileName = process.env.LOG_FILE_NAME;

const logPrefix = '[log]';
const errorPrefix = '[error]';
const warnPrefix = '[warning]';
const infoPrefix = '[Quantifuel]';
const successPrefix = '[success]';
const failedPrefix = '[failure]';

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
        `[${getCurrentDateTime()}]`
      )} ${removeAnsiEscapeCodes(logPrefix)} ${args
        .map((arg) => removeAnsiEscapeCodes(arg))
        .join(' ')}\n\n`
    );
    console.log.apply(console, [
      `${infoPrefix} [${getCurrentDateTime()}] ${logPrefix}`,
      ...args,
    ]);
  };
  const error = (...args) => {
    writeToLog(
      `${removeAnsiEscapeCodes(infoPrefix)} ${removeAnsiEscapeCodes(
        `[${getCurrentDateTime()}]`
      )} ${removeAnsiEscapeCodes(errorPrefix)} ${args
        .map((arg) => removeAnsiEscapeCodes(arg))
        .join(' ')}\n\n`
    );
    console.error.apply(console, [
      `${infoPrefix} [${getCurrentDateTime()}] ${errorPrefix}`,
      ...args,
    ]);
  };
  const warn = (...args) => {
    console.warn.apply(console, [
      `${infoPrefix} [${getCurrentDateTime()}] ${warnPrefix}`,
      ...args,
    ]);
  };
  const info = (...args) => {
    console.info.apply(console, [
      `${infoPrefix} [${getCurrentDateTime()}]`,
      ...args,
    ]);
  };
  const success = (...args) => {
    writeToLog(
      `${removeAnsiEscapeCodes(infoPrefix)} ${removeAnsiEscapeCodes(
        `[${getCurrentDateTime()}]`
      )} ${removeAnsiEscapeCodes(successPrefix)} ${args
        .map((arg) => removeAnsiEscapeCodes(arg))
        .join(' ')}\n\n`
    );
    console.log.apply(console, [
      `${infoPrefix} [${getCurrentDateTime()}] ${successPrefix}`,
      ...args,
    ]);
  };
  const failed = (...args) => {
    writeToLog(
      `${removeAnsiEscapeCodes(infoPrefix)} ${removeAnsiEscapeCodes(
        `[${getCurrentDateTime()}]`
      )} ${removeAnsiEscapeCodes(failedPrefix)} ${args
        .map((arg) => removeAnsiEscapeCodes(arg))
        .join(' ')}\n\n`
    );
    console.log.apply(console, [
      `${infoPrefix} [${getCurrentDateTime()}] ${failedPrefix}`,
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
