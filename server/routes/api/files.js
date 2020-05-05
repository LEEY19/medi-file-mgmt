const router = require('express').Router();
const auth = require('../auth');
const upload = require('../../config/upload.config.js');
const files = require("../../controllers/file.controller.js");

router.post('/upload', auth.required, upload.single("uploadfile"), files.upload)

router.delete('/deletefile/:id', auth.required, files.deletefile)

router.get('/all', auth.required, files.all)

module.exports = router;