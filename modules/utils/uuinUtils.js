//------------------------------
//  AUTHOR: jone_santhanaraj
//------------------------------

const crypto = require('crypto');

const print = require('./consoleUtils');

const generateUUIN = () => {
  const length = 8;
  const UUIN = crypto
    .randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);
  print.log(`Generated Unique Fuel Station Indentifier: ${UUIN}`);
  return UUIN;
};

module.exports = { generateUUIN };
