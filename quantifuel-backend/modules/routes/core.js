//------------------------------
//  AUTHOR: jone_santhanaraj
//------------------------------

const express = require('express');

const core = express.Router();

const print = require('../utils/consoleUtils');
const { generateUniqueId } = require('../utils/uniqueIdUtils');

const User = require('../models/User');
const Pump = require('../models/Pump');
const FuelStation = require('../models/FuelStation');
const Transaction = require('../models/Transaction');

function getRandomDoubleInRange(min, max) {
  const randomValue = Math.random() * (max - min) + min;
  return parseFloat(randomValue.toFixed(2));
}

core.get('/getPump', async (req, res) => {
  const { uuin, upin } = req.query;
  if (!upin) {
    print.log('Bad request - Pump ID required');
    return res.status(400).json({ error: 'BAD REQUEST - PUMP ID REQUIRED' });
  } else if (!uuin) {
    print.log('Bad request - UUIN required');
    return res.status(400).json({ error: 'BAD REQUEST - UUIN REQUIRED' });
  }
  try {
    const user = await User.findOne({ uuin });
    if (!user) {
      print.log('User not found');
      return res.status(404).json({ error: 'USER NOT FOUND' });
    }
    const pump = await Pump.findOne({ upin });
    if (!pump) {
      print.log('Pump not found');
      return res.status(404).json({ error: 'PUMP NOT FOUND' });
    }
    print.log(`pump info fetched by ${uuin} for ${upin}`);
    var operator = pump.operator._id.toString();
    // print.log(operator);
    var opsUser = await User.findOne({ _id: operator }, { name: 1 });
    // print.log(opsUser.name);
    pump.operatorName = opsUser.name;
    // print.log(pump);
    var pumpData = {
      _id: pump._id,
      upin: pump.upin,
      ufsin: pump.ufsin,
      pin: pump.pin,
      fuelType: pump.fuelType,
      status: pump.status,
      currentTransaction: null,
      fuelStation: pump.fuelStation,
      operator: pump.operator,
      operatorName: pump.operatorName,
      createdAt: pump.createdAt,
      updatedAt: pump.updatedAt,
      __v: pump.__v,
      qrUrl: pump.qrUrl,
    };
    // print.log(pumpData);

    res.status(200).json({ pumpData });
  } catch (error) {
    print.error(error);
    res.status(500).json({ error: 'INTERNAL SERVER ERROR' });
  }
});

core.get('/getFuelStationName', async (req, res) => {
  const { ufsin } = req.query;

  if (!ufsin) {
    print.log('Bad request - UFSIN required');
    return res.status(400).json({ error: 'BAD REQUEST - UFSIN REQUIRED' });
  }

  try {
    const fuelStation = await FuelStation.findOne(
      { ufsin: ufsin },
      { name: 1 }
    );

    if (!fuelStation) {
      return res.status(404).json({ error: 'Fuel Station not found' });
    }
    print.log('Fuel station name fetched for UFSIN:', ufsin);
    return res.status(200).json({ name: fuelStation.name });
  } catch (err) {
    print.error('Error fetching fuel station name:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

core.get('/getPricePerLitre', async (req, res) => {
  const { fuelType } = req.query;
  // try {
  // } catch (err) {}
  if (!fuelType) {
    print.log('Bad request - Fuel type required');
    return res.status(400).json({ error: 'BAD REQUEST - FUEL TYPE REQUIRED' });
  }
  var pricePerLitre;
  try {
    if (fuelType === 'Petrol') {
      pricePerLitre = getRandomDoubleInRange(100.0, 115.0);
      print.log(`Price per litre fetched for petrol: ${pricePerLitre}`);
      return res.status(200).json({ pricePerLitre });
    } else if (fuelType === 'Diesel') {
      pricePerLitre = getRandomDoubleInRange(90.0, 105.0);
      print.log(`Price per litre fetched for diesel: ${pricePerLitre}`);
      return res.status(200).json({ pricePerLitre });
    } else {
      print.log('Fuel type not found');
      return res.status(404).json({ error: 'FUEL TYPE NOT FOUND' });
    }
  } catch (error) {
    print.error(error);
    return res.status(500).json({ error: 'INTERNAL SERVER ERROR' });
  }
});

core.post('/init-transaction', async (req, res) => {
  const { uuin, upin, fuelQuantityInLitres, pricePerLitre, fuelType } =
    req.body;
  if (!uuin || !upin || !fuelQuantityInLitres || !pricePerLitre || !fuelType) {
    print.log('Bad request - UUIN, UPIN and amount required');
    return res
      .status(400)
      .json({ error: 'BAD REQUEST - UUIN, UPIN AND AMOUNT REQUIRED' });
  }
  let utin = generateUniqueId('utin', uuin, upin);
  const user = await User.findOne({ uuin });
  if (!user) {
    print.log('User not found');
    return res.status(404).json({ error: 'USER NOT FOUND' });
  }
  const pump = await Pump.findOne({ upin });
  if (!pump) {
    print.log('Pump not found');
    return res.status(404).json({ error: 'PUMP NOT FOUND' });
  }
  const fuelStation = await FuelStation.findOne({ _id: pump.fuelStation });
  if (!fuelStation) {
    print.log('Fuel station not found');
    return res.status(404).json({ error: 'FUEL STATION NOT FOUND' });
  }
  const operator = await User.findOne({ _id: pump.operator });
  if (!operator) {
    print.log('Operator not found');
    return res.status(404).json({ error: 'OPERATOR NOT FOUND' });
  }
  var data = {
    utin: utin,
    user: user._id,
    pump: pump._id,
    fuelStation: fuelStation._id,
    operator: operator._id,
    fuelQuantityInLitre: fuelQuantityInLitres,
    pricePerLitre: pricePerLitre,
    fuelType: fuelType,
  };
  // print.log(data);
  const transaction = new Transaction(data);
  await transaction.save();
  print.log(`Transaction initiated for ${utin}`);
  res.status(200).json({
    utin,
    fuelQuantityInLitre: fuelQuantityInLitres,
    pricePerLitre,
    fuelType,
    statusCode: 200,
  });
});

core.get('/get-transaction-status', async (req, res) => {
  const { utin } = req.query;
  if (!utin) {
    print.log('Bad request - UTIN required');
    return res.status(400).json({ error: 'BAD REQUEST - UTIN REQUIRED' });
  }
  try {
    const transaction = await Transaction.findOne({ utin });
    if (!transaction) {
      print.log('Transaction not found');
      return res.status(404).json({ error: 'TRANSACTION NOT FOUND' });
    }
    print.log(`Transaction status fetched for ${utin}`);
    return res.status(200).json({ transaction });
  } catch (error) {
    print.error(error);
    return res.status(500).json({ error: 'INTERNAL SERVER ERROR' });
  }
});

module.exports = core;
