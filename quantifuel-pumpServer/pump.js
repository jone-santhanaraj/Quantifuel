//------------------------------
//  AUTHOR: jone_santhanaraj
//------------------------------

const express = require('express');
const cron = require('node-cron');
const http = require('http');
const axios = require('axios');
const socketIo = require('socket.io');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { Gpio } = require('pigpio'); // Use pigpio instead of onoff
const mongoose = require('mongoose');

dotenv.config();

const MONGODB_USERNAME = encodeURIComponent(process.env.MONGODB_USERNAME);
const MONGODB_PASSWORD = encodeURIComponent(process.env.MONGODB_PASSWORD);
const MONGODB_HOST = process.env.MONGODB_HOST || 'localhost';
const MONGODB_PORT = process.env.MONGODB_PORT || '27017';
const MONGODB_DATABASE = process.env.MONGODB_DATABASE || 'Quantifuel';
const MONGODB_AUTHMECHANISM =
  process.env.MONGODB_AUTHMECHANISM || 'SCRAM-SHA-256';
const MONGODB_AUTHSOURCE = process.env.MONGODB_AUTHSOURCE || 'Quantifuel';

let mongodb;

const connectMongoose = async (params) => {
  if (typeof params === 'object') {
    try {
      console.log(
        `Connecting to MongoDB...\n   Host:       ${MONGODB_HOST}\n   Port:       ${MONGODB_PORT}\n   Database:   ${MONGODB_DATABASE}\n   Username:   ${MONGODB_USERNAME}\n`
      );
      await mongoose.connect(
        // `mongodb://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_DATABASE}?authMechanism=${MONGODB_AUTHMECHANISM}&authSource=${MONGODB_AUTHSOURCE}`,
        `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@${MONGODB_HOST}/${MONGODB_DATABASE}?retryWrites=true&w=majority&appName=quantifuel`,
        params
      );
      // await mongoose.connect(
      //   `mongodb://${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_DATABASE}?authMechanism=${MONGODB_AUTHMECHANISM}&authSource=${MONGODB_AUTHSOURCE}`,
      //   params
      // );

      const { connection } = mongoose;

      if (connection.readyState === 1) {
        console.log('200 - OK > MongoDB connected successfully!');

        mongodb = mongoose;

        return {
          status: 200,
          isSuccess: true,
          connection,
          host: MONGODB_HOST,
          port: MONGODB_PORT,
          database: MONGODB_DATABASE,
          username: MONGODB_USERNAME,
          password: MONGODB_PASSWORD,
          authMechanism: MONGODB_AUTHMECHANISM,
          authSource: MONGODB_AUTHSOURCE,
        };
      }
      console.log(
        '500 - INTERNAL SERVER ERROR > An error occurred while trying to connect DB:\n',
        'Connection failed!'
      );

      mongodb = undefined;

      return {
        status: 500,
        isSuccess: false,
        error,
        host: MONGODB_HOST,
        port: MONGODB_PORT,
        database: MONGODB_DATABASE,
        username: MONGODB_USERNAME,
        password: MONGODB_PASSWORD,
        authMechanism: MONGODB_AUTHMECHANISM,
        authSource: MONGODB_AUTHSOURCE,
      };
    } catch (error) {
      console.log(
        '500 - INTERNAL SERVER ERROR > An error occurred while trying to connect DB:',
        error.codeName ? error.codeName : error
      );

      mongodb = undefined;

      return {
        status: 500,
        isSuccess: false,
        error,
        host: MONGODB_HOST,
        port: MONGODB_PORT,
        database: MONGODB_DATABASE,
        username: MONGODB_USERNAME,
        password: MONGODB_PASSWORD,
        authMechanism: MONGODB_AUTHMECHANISM,
        authSource: MONGODB_AUTHSOURCE,
      };
    }
  }
  return new Error('Expected an object as parameter.');
};

const pump = express();

const server = http.createServer(pump);
const pumpIO = socketIo(server);

// const { mongodb, connectMongoose } = require('./modules/config/mongoose');
// const { console } = require('inspector');

const PROTOCOL = process.env.PROTOCOL || 'http';
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 8080;

const allowedOrigins = process.env.ALLOWED_ORIGINS || 'http://localhost:5345';

const logFileName = process.env.LOG_FILE_NAME;

let MongodbState = 0;

const fuelPrices = {};

pump.use(express.json());

pumpIO.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Use pigpio to control GPIO 4
const gpio4 = new Gpio(4, { mode: Gpio.OUTPUT });

const startServer = async () => {
  console.log('Initiating...');
  const mongodbConnectionResponse = await connectMongoose({});
  if (mongodbConnectionResponse.status === 200) {
    console.log(
      'Pump is up and running, listening at',
      `${PROTOCOL}://${HOST}:${PORT}/`
    );
    MongodbState = 1;

    gpio4.digitalWrite(1); // Turn on GPIO 4 using pigpio
  } else if (mongodbConnectionResponse.status === 500) {
    console.log(
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
        console.log('log reading the log file:', err);
      } else {
        fs.truncate(logFilePath, 0, (truncateErr) => {
          if (truncateErr) {
            console.log('Error clearing the log file:', truncateErr);
          } else {
            console.log(
              `Log file "${logFileName}" has been cleared successfully.`
            );
          }
        });
      }
    });
  } else {
    console.log('Log file name is not set.');
  }
};

const shutdownServer = async () => {
  await setTimeout(async () => {
    MongodbState = 0;
    gpio4.digitalWrite(0); // Turn off GPIO 4 using pigpio
    gpio4.mode(Gpio.INPUT); // Reset GPIO pin to input mode
    await server.close(() => {
      console.log(
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
      console.log(
        `Pump listened at ${PROTOCOL}://${HOST}:${PORT}/ has been stopped for a restart.`
      );
    });
  }, 1000);
  setTimeout(() => {
    console.log('Attempting to start the server again after restart...');
  }, 1500);
  setTimeout(async () => {
    await server.listen(PORT, HOST, startServer);
  }, 3000);
};

const processConsoleCommand = (command) => {
  if (command === 'clearlog') {
    clearLogFile();
  } else if (command === 'stop') {
    console.log('Stopping server...');
    shutdownServer();
  } else if (command === 'restart') {
    console.log('Restarting server...');
    restartServer();
  } else if (command === '') {
    console.log('-');
  } else {
    console.log(`Unable to recognize the command: "${command}"`);
  }
};

process.stdin.on('data', (data) => {
  const command = data.toString().trim();
  processConsoleCommand(command);
});
