var express = require('express');
var router = express.Router();
const rcpController = require('../controllers/rcpController');

router.get('/politics', function(req, res, next) {
  rcpController.getStories()
    .then(stories => {
      res.send(stories);
    })
    .catch(err => {
      console.log(err);
    })
});

router.get('/polls', function(req, res, next) {
  rcpController.getPollData()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      console.log(err);
    })
})

router.get('/recentPolls', function(req, res, next) {
  rcpController.getRecentPolls()
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      console.log(err)
    })
})

module.exports = router;