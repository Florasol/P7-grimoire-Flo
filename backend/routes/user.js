const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user'); // associe les fonctions aux différentes routes

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;