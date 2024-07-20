//------------------------------
//  AUTHOR: jone_santhanaraj
//------------------------------

const express = require('express');
const crypto = require('crypto');

const print = require('../utils/consoleUtils');
const { generateUniqueId, generateQRCode } = require('../utils/uniqueIdUtils');

const Pump = require('../models/Pump');
const FuelStation = require('../models/FuelStation');
const User = require('../models/User');

const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 3000;

const admin = express.Router();

admin.post('/create-fuel-station', async (req, res) => {
  try {
    const { name, address, ownerUUIN } = req.body;
    if (!name || !address || !ownerUUIN) {
      print.log('Bad request - Name and address required');
      return res
        .status(400)
        .json({ error: 'BAD REQUEST - NAME, ADDRESS AND OWNER UUIN REQUIRED' });
    }

    const ufsin = await generateUniqueId('ufsin');

    const owner = await User.findOne({ uuin: ownerUUIN });
    if (!owner) {
      print.log('Owner not found');
      return res
        .status(400)
        .json({ error: 'BAD REQUEST - INVALID OWNER UUIN' });
    }

    const fuelStation = new FuelStation({
      ufsin,
      name,
      address,
      owner: owner._id,
    });

    try {
      await fuelStation.save();
      print.log('Fuel Station created:', fuelStation);
      res.json({ fuelStation });
    } catch (err) {
      if (err.name === 'MongoError' && err.code === 11000) {
        print.error('UFSIN already exists. Generating new UFSIN');
        fuelStation.ufsin = await generateUniqueId('ufsin');
        await fuelStation.save();
        print.log('Fuel Station created after retry:', fuelStation);
        res.json({ fuelStation });
      } else {
        throw err; // Re-throw the error if not a duplicate key error
      }
    }
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

  let qrUrl;

  try {
    const fuelStation = await FuelStation.findOne({ ufsin });
    if (!fuelStation) {
      print.log('Fuel Station not found');
      return res.status(404).json({ error: 'FUEL STATION NOT FOUND' });
    }

    let upin = await generateUniqueId('upin');
    // let upin = '85e8';
    let qrData = `${ufsin}-${upin}`;

    const pump = new Pump({
      upin: qrData,
      ufsin,
      fuelType,
      pin: upin,
      status: 'available',
      fuelStation: fuelStation._id,
    });

    try {
      const newPump = await pump.save();
      fuelStation.pumps.push(newPump._id);
      await fuelStation.save();

      qrUrl = await generateQRCode(qrData, `${qrUrl}`);
      print.log(`QR Code generated for pump: ${qrUrl}`);

      try {
        const result = await Pump.updateOne(
          { upin: qrData }, // Query to find the document
          { $set: { qrUrl: qrUrl } } // Update operation
        );

        if (result.modifiedCount === 0) {
          print.error('No pump found with the provided UPIN');
        } else {
          print.log('Pump updated successfully');
        }
      } catch (error) {
        print.error('Error updating pump with QR code:', error);
      }

      print.log(
        `Pump created successfully: ${newPump} at station: ${fuelStation}`
      );
      res.status(200).json({ pump: newPump });
    } catch (err) {
      if (err.name === 'MongoServerError' && err.code === 11000) {
        print.error('UPIN already exists. Generating new UPIN');
        upin = await generateUniqueId('upin');
        qrData = `${ufsin}-${upin}`;
        pump.upin = qrData;
        pump.pin = upin;
        const newPump = await pump.save();
        fuelStation.pumps.push(newPump._id);
        await fuelStation.save();

        qrUrl = await generateQRCode(qrData, `${upin}`);
        print.log(`QR Code generated for pump: ${qrUrl}`);

        try {
          const result = await Pump.updateOne(
            { upin: qrData }, // Query to find the document
            { $set: { qrUrl: qrUrl } } // Update operation
          );

          if (result.modifiedCount === 0) {
            print.error('No pump found with the provided UPIN');
          } else {
            print.log('Pump updated successfully');
          }
        } catch (error) {
          print.error('Error updating pump with QR code:', error);
        }

        print.log(
          `Pump created successfully after retry: ${newPump} at station: ${fuelStation}`
        );
        res.status(200).json({ pump: newPump });
      } else {
        throw err; // Re-throw the error if not a duplicate key error
      }
    }
  } catch (error) {
    console.error('Error creating pump:', error);
    res.status(500).json({ error: 'INTERNAL SERVER ERROR' });
  }
});

module.exports = admin;
