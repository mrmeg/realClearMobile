var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/politics', function(req, res, next) {
  console.log('Backend')
});

module.exports = router;
