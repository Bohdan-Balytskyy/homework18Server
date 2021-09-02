const express = require('express');
const router = express.Router();
const userController = require('../components/controllers/userController');
const authenticate = require('../components/my_modules/passport').authenticateJwt;

router.get('/history/:id', authenticate, userController.getHistory);
router.get('/statistic/:id',  authenticate, userController.getStatistic);
router.get('/:id', authenticate, userController.getById);
router.patch('/:id', authenticate, userController.patch);

module.exports = router;