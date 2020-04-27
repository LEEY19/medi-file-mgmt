const express = require('express');
const router = express.Router();
const auth = require('./auth');
const users = require("../controllers/user.controller.js");

router.use('/api/users', require('./api/users'));
router.use('/api/files', require('./api/files'));

module.exports = router;