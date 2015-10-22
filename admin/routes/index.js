var express = require('express');
var router = express.Router();
var Admin = require('../controllers/admin');
var Country = require('../controllers/country');


/* GET home page. */
router.get(['/','/sign-in'], Admin.signIn);

router.get('/sign-up', Admin.signUp);

router.get('/dashboard', Admin.isLoggedIn,Admin.dashboard);


router.get('/profile', Admin.isLoggedIn,Admin.getUserDetails);
router.get('/country', Admin.isLoggedIn,Country.getCountryListing);



router.get('/logout', Admin.logout);



// POST
router.post('/register', Admin.registerUser);
router.post('/login', Admin.login);

module.exports = router;
