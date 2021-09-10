const express = require('express');
const router = express.Router();
const userController = require('../components/controllers/userController');
const authenticate = require('../components/my_modules/passport').authenticateJwt;

const upload = require('../components/my_modules/upload');  //+

router.get('/history/:id', authenticate, userController.getHistory);
router.get('/statistic/:id',  authenticate, userController.getStatistic);
router.get('/:id', authenticate, userController.getById);
router.patch('/:id', authenticate, userController.patch);
router.patch('/personal/:id', authenticate, upload.single('image'),  userController.update);

module.exports = router;