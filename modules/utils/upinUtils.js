//------------------------------
//  AUTHOR: jone_santhanaraj
//------------------------------

const crypto = require('crypto');
const qr = require('qrcode');
const fs = require('fs');
const path = require('path');

const print = require('./consoleUtils');

const generateUPIN = () => {
  const length = 4;
  const UPIN = crypto
    .randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);
  print.log(`Generated Unique Pump indentifier: ${UPIN}`);
  return UPIN;
};

const generateQRCode = (data, fileName) => {
  const qrCodesDir = path.join(__dirname, '../../public/qrcodes');
  if (!fs.existsSync(qrCodesDir)) {
    fs.mkdirSync(qrCodesDir);
  }
  const qrCodePath = path.join(qrCodesDir, `${fileName}.png`);
  qr.toFile(
    qrCodePath,
    data,
    // {
    //   version: 10, // Adjust version (1 to 40, where 1 is smallest and 40 is largest)
    // },
    (err) => {
      if (err) {
        print.error(`Error generating QR code for ${fileName} :`, err);
        return;
      }
      print.log(
        `QR Code generated and saved at: ${qrCodesDir}/${fileName}.png for ${fileName}`
      );
      return;
    }
  );
  return qrCodePath;
};

module.exports = { generateUPIN, generateQRCode };
