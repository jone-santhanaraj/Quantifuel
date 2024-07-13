const express = require('express');
const crypto = require('crypto');
const qr = require('qrcode');
const fs = require('fs');
const path = require('path');

const print = require('../utils/consoleUtils');

const Pump = require('../models/Pump');
const FuelStation = require('../models/FuelStation');

const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 3000;

const qrCodesDir = path.join(__dirname, '../../public/qrcodes');
if (!fs.existsSync(qrCodesDir)) {
  fs.mkdirSync(qrCodesDir);
}

const admin = express.Router();

const generateUniqueId = (length) => {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);
};

const generateQRCode = (data, fileName) => {
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

admin.post('/create-fuel-station', async (req, res) => {
  try {
    const { name, address } = req.body;
    if (!name || !address) {
      print.log('Bad request - Name and address required');
      return res
        .status(400)
        .json({ error: 'BAD REQUEST - NAME AND ADDRESS REQUIRED' });
    }
    const ufsin = generateUniqueId(6);
    const fuelStation = new FuelStation({
      ufsin,
      name,
      address,
    });
    await fuelStation.save();

    print.log('Fuel Station created:', fuelStation);

    res.json({ fuelStation });
  } catch (error) {
    console.error('Error creating fuel station:', error);
    res.status(500).json({ error: 'INTERNAL SERVER ERROR' });
  }
});

admin.post('/create-pump', async (req, res) => {
  const { ufsin, fuelType } = req.body;
  if (!ufsin || !fuelType) {
    print.log('Bad request - UFSIN and fuel type required');
    return res
      .status(400)
      .json({ error: 'BAD REQUEST - UFSIN AND FUEL TYPE REQUIRED' });
  }
  const fuelStation = await FuelStation.findOne({ ufsin });
  if (!fuelStation) {
    print.log('Fuel Station not found');
    return res.status(404).json({ error: 'FUEL STATION NOT FOUND' });
  }
  try {
    const upin = `${ufsin}-${generateUniqueId(8)}`;

    generateQRCode(upin, upin);

    const qrUrl = `http://${host}:${port}/public/qrcodes/${upin}.png`;

    const pump = new Pump({
      upin,
      qrUrl,
      fuelType,
      status: 'available',
      fuelStation: fuelStation._id,
    });
    await pump.save();

    print.log(`Pump created successfully: ${pump} at station: ${fuelStation}`);

    res.json({ pump });
  } catch (error) {
    console.error('Error creating pump:', error);
    res.status(500).json({ error: 'INTERNAL SERVER ERROR' });
  }
});

module.exports = admin;
