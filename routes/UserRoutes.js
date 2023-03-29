const express = require('express');
const router = express.Router();
const {signup} = require('../controllers/UserController');

router.post('/signup', signup)

module.exports = router;