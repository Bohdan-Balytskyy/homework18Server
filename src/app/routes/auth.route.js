const express = require('express');
const router = express.Router();

const authController = require('./../components/controllers/authController');

router.post('/sign-in', authController.signIn);
     
module.exports = router;