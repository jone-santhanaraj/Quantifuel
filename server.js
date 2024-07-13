const express = require('express');
const quantifuel = express();
require('dotenv').config();

const print = require('./modules/utils/consoleUtils');
const { mongodb, connectMongoose } = require('./modules/config/mongoose');

const PROTOCOL = process.env.PROTOCOL || 'http';
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 5344;

const allowedOrigins = process.env.ALLOWED_ORIGINS || 'http://localhost:5345';

const logFileName = process.env.LOG_FILE_NAME;

quantifuel.get('/api', (req, res) => {
  print.log('someone accessed the server');
  res.send('Welcome to QuantiFuel!');
});

quantifuel.get('/api/initTrans', (req, res) => {
  res.send({
    trans_id: '01nhhhad193b1hd8212b',
    pump_id: 'sh113b1i',
    bunk_id: 'asdh112312j',
    bunk_loc_coords: '123123-1231233-4556435-3454634',
    isMultiFuelType: 0,
    fuel_types: ['petrol'],
    user_id: '1021123447',
    user_loc_coords: '1012313-2112312-1231123-3244234',
  });
});

const startServer = async () => {
  consoleout.log('\x1b[32mInitiating...\x1b[0m');
  const mongodbConnectionResponse = await connectMongoose({
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  if (mongodbConnectionResponse.status === 200) {
    consoleout.success(
      '\x1b[35mServer is \x1b[32mup \x1b[35mand \x1b[32mrunning\x1b[35m, listening at',
      `\x1b[34m${PROTOCOL}://${HOST}:${PORT}/\x1b[0m`
    );
  } else if (mongodbConnectionResponse.status === 500) {
    consoleout.failed(
      `\x1b[35mServer is running at: \x1b[34m${PROTOCOL}://${HOST}:${PORT}/\x1b[31m but not ready to accept requests\x1b[0m`
    );
  }
};

const server = quantifuel.listen(PORT, HOST, startServer);

const clearLogFile = () => {
  if (logFileName) {
    const logFilePath = path.join(__dirname, logFileName);

    fs.readFile(logFilePath, 'utf8', (err) => {
      if (err) {
        consoleout.error('Error reading the log file:', err);
      } else {
        fs.truncate(logFilePath, 0, (truncateErr) => {
          if (truncateErr) {
            consoleout.error('Error clearing the log file:', truncateErr);
          } else {
            consoleout.info(
              `Log file "${logFileName}" has been cleared successfully.`
            );
          }
        });
      }
    });
  } else {
    consoleout.warn('Log file name is not set.');
  }
};

const shutdownServer = async () => {
  await setTimeout(async () => {
    await server.close(() => {
      consoleout.log(
        `\x1b[31mServer listening at \x1b[34m${PROTOCOL}://${HOST}:${PORT}/\x1b[31m has been stopped on command.\x1b[0m`
      );
    });
  }, 1000);
  setTimeout(() => {
    process.exit(0);
  }, 1000);
};

const restartServer = async () => {
  await setTimeout(async () => {
    await server.close(() => {
      consoleout.log(
        `\x1b[31mServer listened at \x1b[34m${PROTOCOL}://${HOST}:${PORT}/\x1b[31m has been stopped for a restart.\x1b[0m`
      );
    });
  }, 1000);
  setTimeout(() => {
    consoleout.log(
      '\x1b[33mAttempting to start the server again after restart...\x1b[0m'
    );
  }, 1500);
  setTimeout(async () => {
    await server.listen(PORT, HOST, startServer);
  }, 3000);
};

const processConsoleCommand = (command) => {
  if (command === 'clearlog') {
    clearLogFile();
  } else if (command === 'stop') {
    consoleout.log('\x1b[31mStopping server...\x1b[0m');
    shutdownServer();
  } else if (command === 'restart') {
    consoleout.log('\x1b[31mRestarting server...\x1b[0m');
    restartServer();
  } else if (command === '') {
    consoleout.info('\x1b[31m-\x1b[0m');
  } else {
    consoleout.warn(
      `\x1b[31mUnable to recognize the command: "\x1b[0m${command}\x1b[31m"\x1b[0m`
    );
  }
};

process.stdin.on('data', (data) => {
  const command = data.toString().trim();
  processConsoleCommand(command);
});

// quantifuel.listen(3000, () => {
//   mongodb.connect(
//     process.env.DB_CONNECT,
//     { useNewUrlParser: true, useUnifiedTopology: true },
//     () => {
//       console.log('Database connection suceeded!');
//     }
//   );
//   console.log('Server is running on port 3000');
// });
