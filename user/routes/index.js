var express = require('express');
var router = express.Router();
var User = require('../controllers/user');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index.html');
});

router.get('/about', function(req, res) {
  res.render('user/about.html');
});

router.get('/contact', function(req, res) {
  res.render('user/contact.html');
});

router.get('/sign-in', function(req, res) {
  res.render('user/signin.html');
});

router.get('/sign-up', function(req, res) {
  res.render('user/signup.html');
});

// POST
router.post('/register', User.registerUser);


module.exports = router;
