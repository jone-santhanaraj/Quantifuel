//------------------------------
//  AUTHOR: jone_santhanaraj
//------------------------------

const mongoose = require('mongoose');

const print = require('../utils/consoleUtils');

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
      print.log(
        `\x1b[35mConnecting to MongoDB...\n   \x1b[34mHost:       \x1b[36m${MONGODB_HOST}\n   \x1b[34mPort:       \x1b[36m${MONGODB_PORT}\n   \x1b[34mDatabase:   \x1b[36m${MONGODB_DATABASE}\n   \x1b[34mUsername:   \x1b[36m${MONGODB_USERNAME}\n`
      );
      await mongoose.connect(
        // `mongodb://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_DATABASE}?authMechanism=${MONGODB_AUTHMECHANISM}&authSource=${MONGODB_AUTHSOURCE}`,
        `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@${MONGODB_HOST}/?retryWrites=true&w=majority&appName=Quantifuel-backend`,
        params
      );
      // await mongoose.connect(
      //   `mongodb://${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_DATABASE}?authMechanism=${MONGODB_AUTHMECHANISM}&authSource=${MONGODB_AUTHSOURCE}`,
      //   params
      // );

      const { connection } = mongoose;

      if (connection.readyState === 1) {
        consoleout.success(
          '\x1b[32m200 - OK >\x1b[35m MongoDB connected \x1b[32msuccessfully\x1b[35m!\x1b[0m'
        );

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
      consoleout.failed(
        '\x1b[31m500 - INTERNAL SERVER ERROR >\x1b[0m An error occurred while trying to connect DB:\x1b[0m\n',
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
      consoleout.failed(
        '\x1b[31m500 - INTERNAL SERVER ERROR >\x1b[0m An error occurred while trying to connect DB:\x1b[0m',
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

module.exports = { mongodb, connectMongoose };
