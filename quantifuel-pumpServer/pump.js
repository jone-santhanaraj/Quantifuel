const express = require('express');
const cron = require('node-cron');
const http = require('http');
const axios = require('axios');
const socketIo = require('socket.io');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const Gpio = require('onoff').Gpio;

const pump = express();
dotenv.config();

const print = require('./modules/utils/consoleUtils');
const server = http.createServer(pump);
const pumpIO = socketIo(server);

const { mongodb, connectMongoose } = require('./modules/config/mongoose');

const PROTOCOL = process.env.PROTOCOL || 'http';
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 8080;

const allowedOrigins = process.env.ALLOWED_ORIGINS || 'http://localhost:5345';

const logFileName = process.env.LOG_FILE_NAME;

let MongodbState = 0;

const fuelPrices = {};

pump.use(express.json());

pumpIO.on('connection', (socket) => {
  print.log('A user connected');
  socket.on('disconnect', () => {
    print.log('A user disconnected');
  });
});

const startServer = async () => {
  consoleout.log('Initiating...');
  const mongodbConnectionResponse = await connectMongoose({
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  });
  if (mongodbConnectionResponse.status === 200) {
    consoleout.success(
      'Pump is up and running, listening at',
      `${PROTOCOL}://${HOST}:${PORT}/`
    );
    MongodbState = 1;
  } else if (mongodbConnectionResponse.status === 500) {
    consoleout.failed(
      `Pump is running at: ${PROTOCOL}://${HOST}:${PORT}/ but not ready to accept requests`
    );
    MongodbState = 0;
  }
  // fetchFuelPrices();
  // getFuelPrices();
  // print.log(fuelPrices);
};

server.listen(PORT, startServer);

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
    MongodbState = 0;
    await server.close(() => {
      consoleout.log(
        `Pump listening at ${PROTOCOL}://${HOST}:${PORT}/ has been stopped on command.`
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
        `Pump listened at ${PROTOCOL}://${HOST}:${PORT}/ has been stopped for a restart.`
      );
    });
  }, 1000);
  setTimeout(() => {
    consoleout.log('Attempting to start the server again after restart...');
  }, 1500);
  setTimeout(async () => {
    await server.listen(PORT, HOST, startServer);
  }, 3000);
};

const processConsoleCommand = (command) => {
  if (command === 'clearlog') {
    clearLogFile();
  } else if (command === 'stop') {
    consoleout.log('Stopping server...');
    shutdownServer();
  } else if (command === 'restart') {
    consoleout.log('Restarting server...');
    restartServer();
  } else if (command === '') {
    consoleout.info('-');
  } else {
    consoleout.warn(`Unable to recognize the command: "${command}"`);
  }
};

process.stdin.on('data', (data) => {
  const command = data.toString().trim();
  processConsoleCommand(command);
});
