var express = require('express');
var router = express.Router();

/* GET dashboard. */
router.get('/', function(req, res, next) {
    res.render(__base__views + 'pages/dashboard/index', { title: 'Dashboard' });
});

module.exports = router;