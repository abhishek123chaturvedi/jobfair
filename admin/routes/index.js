var express = require('express');
var router = express.Router();
var Admin = require('../controllers/admin');
var Country = require('../controllers/country');
var State = require('../controllers/state');


/* GET home page. */
router.get(['/','/sign-in'], Admin.signIn);

router.get('/sign-up', Admin.signUp);

router.get('/dashboard', Admin.isLoggedIn,Admin.dashboard);


router.get('/profile', Admin.isLoggedIn,Admin.getUserDetails);
router.get('/country', Admin.isLoggedIn,Admin.getUserRole, Country.getCountryListing);
router.post('/add-country-details', Admin.isLoggedIn,Country.addCountryDetails);
router.post('/get-country-detail-by-id', Admin.isLoggedIn,Country.getCountryDetailsById);
router.post('/update-country-details-by-id', Admin.isLoggedIn,Country.updateCountryDetailsById);
router.post('/update-country-status-by-id', Admin.isLoggedIn,Country.updateCountryStatusById);
router.post('/delete-country-by-id', Admin.isLoggedIn,Admin.isAdminAllowed, Country.deleteCountryById);
router.get('/state', Admin.isLoggedIn,Admin.getUserRole, State.getStateListing);



router.get('/logout', Admin.logout);



// POST
router.post('/register', Admin.registerUser);
router.post('/login', Admin.login);

module.exports = router;
