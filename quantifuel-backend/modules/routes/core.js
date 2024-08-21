//------------------------------
//  AUTHOR: jone_santhanaraj
//------------------------------

const express = require('express');

const Router = express.Router();

const print = require('../utils/consoleUtils');
const { generateUniqueId } = require('../utils/uniqueIdUtils');

const User = require('../models/User');
const Pump = require('../models/Pump');
const FuelStation = require('../models/FuelStation');

Router.get('/getPump', async (req, res) => {
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
    res.status(200).json({ pump });
  } catch (error) {
    print.error(error);
    res.status(500).json({ error: 'INTERNAL SERVER ERROR' });
  }
});

Router.post('/init-transaction', async (req, res) => {
  const { uuin, upin, amount } = req.body;
  if (!uuin || !upin || !amount) {
    print.log('Bad request - UUIN, UPIN and amount required');
    return res
      .status(400)
      .json({ error: 'BAD REQUEST - UUIN, UPIN AND AMOUNT REQUIRED' });
  }
  let utin = generateUniqueId('utin', uuin, upin);
  res.status(200).json({ utin });
});

Router.get('/getFuelStationName', async (req, res) => {
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

module.exports = Router;
