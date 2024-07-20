//------------------------------
//  AUTHOR: jone_santhanaraj
//------------------------------

const express = require('express');

const Router = express.Router();

const print = require('../utils/consoleUtils');
const { generateUniqueId } = require('../utils/uniqueIdUtils');

const User = require('../models/User');

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

module.exports = Router;
