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
        consoleout.success('200 - OK > MongoDB connected successfully!');

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
      consoleout.failed(
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

module.exports = { mongodb, connectMongoose };
