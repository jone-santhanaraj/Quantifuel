//------------------------------
//  AUTHOR: jone_santhanaraj
//------------------------------

const express = require('express');

const Router = express.Router();

const print = require('../utils/consoleUtils');
const { generateUniqueId } = require('../utils/uniqueIdUtils');

const User = require('../models/User');

Router.post('/create-user', async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      role,
      preferences,
      status,
      wallet,
      fuelStation,
      assignedPump,
    } = req.body;
    if (!name || !email || !password || !role || !status || !wallet) {
      print.log('Bad request - Name, email and password required');
      return res
        .status(400)
        .json({ error: 'BAD REQUEST - NAME, EMAIL AND PASSWORD REQUIRED' });
    }

    // const uuin = generateUniqueId('uuin');
    const uuin = '9e9bb366';

    const user = new User({
      uuin,
      name,
      email,
      phone,
      password,
      role,
      preferences,
      status,
      wallet,
      fuelStation,
      assignedPump,
    });

    //sample request:
    // {
    //   "name": "John Doe",
    //   "email": "johndoe@example.com",
    //   "phone": "1234567890",
    //   "password": "password",
    //   "role": "customer",
    //   "preferences": {
    //     "invoiceViaSMS": true,
    //     "invoiceViaEmail": true,
    //     "invoiceViaWhatsApp": false,
    //   },
    //   "status": "active",
    //   "wallet": "60c3b1f0d4f2d5001f3d5c1d",
    //   "fuelStation": {                     optional --
    //     "objectId": null,                  optional   |
    //     "ufsin": null,                     optional   | Required for admin users
    //   },                                   optional --
    //   "assignedPump": {                    optional --
    //     "pumpId": null,                    optional   |
    //     "upin": null,                      optional   |
    //   },                                   optional   |
    //  "fuelStationDetails": {               optional   |
    //     "fuelStationId": null,             optional    > Required for Operator users
    //     "ufsin": null,                     optional   |
    //     "ownerId": null,                   optional   |
    //     "ownerUuin": null,                 optional   |
    //   },                                   optional --
    // }

    try {
      await user.save();
      print.log(`User created: ${user.name} - ${user.uuin}`);

      res.json({ user });
    } catch (err) {
      if (err.name === 'MongoServerError' && err.code === 11000) {
        print.error('UUIN already exists. Generating new UUIN');
        user.uuin = generateUniqueId('uuin');
        await user.save();
        print.log(`User created: ${user.name} - ${user.uuin}`);

        res.json({ user });
      } else {
        res.status(500).json({ error: 'INTERNAL SERVER ERROR' });
      }
    }
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'INTERNAL SERVER ERROR' });
  }
});

module.exports = Router;
