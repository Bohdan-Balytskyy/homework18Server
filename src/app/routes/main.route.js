const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.route');
router.use('/auth/', authRoutes);

const userRoutes = require('./user.route');
router.use('/users/', userRoutes);

module.exports = router;
