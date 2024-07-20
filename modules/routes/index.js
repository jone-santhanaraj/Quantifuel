//------------------------------
//  AUTHOR: jone_santhanaraj
//------------------------------

const express = require('express');

const admin = require('./admin');
const user = require('./user');
const core = require('./core');

const router = express.Router();

router.use('/admin', admin);
router.use('/user', user);
router.use('/system', core);

module.exports = router;
