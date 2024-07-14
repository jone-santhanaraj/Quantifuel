//------------------------------
//  AUTHOR: jone_santhanaraj
//------------------------------

const crypto = require('crypto');

const print = require('./consoleUtils');

const generateUFSIN = () => {
  const length = 6;
  const UFSIN = crypto
    .randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);
  print.log(`Generated Unique Fuel Station Indentifier: ${UFSIN}`);
  return UFSIN;
};

module.exports = { generateUFSIN };
