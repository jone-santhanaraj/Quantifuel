//------------------------------
//  AUTHOR: jone_santhanaraj
//------------------------------

const express = require('express');
const crypto = require('crypto');

const print = require('../utils/consoleUtils');

const { generateUFSIN } = require('../utils/ufsinUtils');
const { generateUPIN, generateQRCode } = require('../utils/upinUtils');

const Pump = require('../models/Pump');
const FuelStation = require('../models/FuelStation');

const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 3000;

const admin = express.Router();

admin.post('/create-fuel-station', async (req, res) => {
  try {
    const { name, address } = req.body;
    if (!name || !address) {
      print.log('Bad request - Name and address required');
      return res
        .status(400)
        .json({ error: 'BAD REQUEST - NAME AND ADDRESS REQUIRED' });
    }
    const ufsin = generateUFSIN();
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
    const upin = `${ufsin}-${generateUPIN()}`;

    generateQRCode(upin, upin);

    const qrUrl = `http://${host}:${port}/public/qrcodes/${upin}.png`;

    const pump = new Pump({
      upin,
      qrUrl,
      fuelType,
      status: 'available',
      fuelStation: fuelStation._id,
    });
    const newPump = await pump.save();

    fuelStation.pumps.push(newPump._id);
    await fuelStation.save();

    print.log(`Pump created successfully: ${pump} at station: ${fuelStation}`);

    res.json({ pump });
  } catch (error) {
    console.error('Error creating pump:', error);
    res.status(500).json({ error: 'INTERNAL SERVER ERROR' });
  }
});

module.exports = admin;
