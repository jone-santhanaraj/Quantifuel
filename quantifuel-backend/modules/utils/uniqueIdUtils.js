//------------------------------
//  AUTHOR: jone_santhanaraj
//------------------------------

const crypto = require('crypto');
const qr = require('qrcode');
const fs = require('fs');
const path = require('path');

const print = require('./consoleUtils');

const generateUniqueId = (type, uuin, upin) => {
  const length = {
    uuin: 8,
    ufsin: 6,
    upin: 4,
    utin: 8,
  };

  const generateId = (field, length) => {
    const id = crypto
      .randomBytes(Math.ceil(length / 2))
      .toString('hex')
      .slice(0, length);

    print.log(`Generated new ${field}: ${id}`);
    return id;
  };

  const generateUTIN = (UUIN, UPIN, length) => {
    const UnqiueIdentifier = `${UUIN}-${UPIN}-${crypto
      .randomBytes(Math.ceil(length / 2))
      .toString('hex')
      .slice(0, length)}`;
    print.log(`Generated new UTIN: ${UnqiueIdentifier}`);
    return UnqiueIdentifier;
  };

  if (type === 'utin' || type === 'UTIN')
    return generateUTIN(uuin, upin, length[type]);
  if (
    type === 'uuin' ||
    type === 'UUIN' ||
    type === 'upin' ||
    type === 'UPIN' ||
    type === 'ufsin' ||
    type === 'UFSIN'
  )
    return generateId(type, length[type]);

  print.error('Invalid type provided');
  return null;
};

// const isUnique = async (model, field, value) => {
//   const query = {};
//   query[field] = value;
//   try {
//     const isExisting = await model.findOne(query);
//     return isExisting ? false : true;
//   } catch (err) {
//     print.error('Error checking uniqueness:', err);
//     return err;
//   }
// };

// const generateUUIN = async () => {
//   loopBreaker++;

//   const length = 8;
//   const UUIN = crypto
//     .randomBytes(Math.ceil(length / 2))
//     .toString('hex')
//     .slice(0, length);

//   try {
//     const isUniqueUUIN = await isUnique(User, 'uuin', UUIN);
//   } catch (err) {
//     print.error('Error generating UUIN:', err);
//     loopBreaker = 0;
//     return err;
//   }
//   if (!isUniqueUUIN || loopBreaker < 10) {
//     print.error('UUIN already exists. Generating new UUIN');
//     return generateUUIN();
//   } else if (loopBreaker >= 10) {
//     print.error('Loopbreaker tripped. Unable to generate UUIN');
//     loopBreaker = 0;
//     return null;
//   }

//   print.log(`Generated Unique Fuel Station Indentifier: ${UUIN}`);
//   loopBreaker = 0;
//   return UUIN;
// };

// const generateUFSIN = async () => {
//   loopBreaker++;

//   const length = 6;
//   const UFSIN = crypto
//     .randomBytes(Math.ceil(length / 2))
//     .toString('hex')
//     .slice(0, length);

//   try {
//     const isUniqueUFSIN = await isUnique(FuelStation, 'ufsin', UFSIN);
//   } catch (err) {
//     print.error('Error generating UFSIN:', err);
//     loopBreaker = 0;
//     return err;
//   }
//   if (!isUniqueUFSIN || loopBreaker < 10) {
//     print.error('UFSIN already exists. Generating new UFSIN');
//     return generateUFSIN();
//   } else if (loopBreaker >= 10) {
//     print.error('Loopbreaker tripped. Unable to generate UFSIN');
//     loopBreaker = 0;
//     return null;
//   }

//   print.log(`Generated Unique Fuel Station Indentifier: ${UFSIN}`);
//   loopBreaker = 0;
//   return UFSIN;
// };

// const generateUPIN = async () => {
//   loopBreaker++;

//   const length = 4;
//   const UPIN = crypto
//     .randomBytes(Math.ceil(length / 2))
//     .toString('hex')
//     .slice(0, length);

//   try {
//     const isUniqueUPIN = await isUnique(Pump, 'upin', UPIN);
//   } catch (err) {
//     print.error('Error generating UPIN:', err);
//     loopBreaker = 0;
//     return err;
//   }
//   if (!isUniqueUPIN || loopBreaker < 10) {
//     print.error('UPIN already exists. Generating new UPIN');
//     return generateUPIN();
//   } else if (loopBreaker >= 10) {
//     print.error('Loopbreaker tripped. Unable to generate UPIN');
//     loopBreaker = 0;
//     return null;
//   }

//   print.log(`Generated Unique Pump indentifier: ${UPIN}`);
//   loopBreaker = 0;
//   return UPIN;
// };

const generateQRCode = async (data, fileName) => {
  const qrCodesDir = path.join(__dirname, '../../public/qrcodes');
  if (!fs.existsSync(qrCodesDir)) {
    fs.mkdirSync(qrCodesDir);
  }
  const qrCodePath = path.join(qrCodesDir, `${fileName}.png`);
  try {
    await qr.toFile(qrCodePath, data);
    print.log(
      `QR Code generated and saved at: ${qrCodesDir}/${fileName}.png for ${fileName}`
    );
    return qrCodePath;
  } catch (err) {
    print.error(`Error generating QR code for ${fileName} :`, err);
    throw err; // rethrow the error after logging it
  }
};

// const generateUTIN = (uuin, ufsin, upin) => {
//   const length = 8;
//   const UTIN = `${uuin}-${ufsin}-${upin}-${crypto
//     .randomBytes(Math.ceil(length / 2))
//     .toString('hex')
//     .slice(0, length)}`;
//   print.log(`Generated Unique Transaction Indentifier: ${UTIN}`);
//   return UTIN;
// };

module.exports = {
  generateUniqueId,
  generateQRCode,
};
