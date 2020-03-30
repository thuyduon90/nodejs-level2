var express = require('express');
var router = express.Router();


router.use('/', require('./home'));
router.use('/items', require('./items'));
router.use('/dashboard', require('./dashboard'));

module.exports = router;