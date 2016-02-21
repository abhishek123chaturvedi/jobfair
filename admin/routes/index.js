var express = require('express');
var router = express.Router();
var Admin = require('../controllers/admin');
var Country = require('../controllers/country');
var State = require('../controllers/state');
var City = require('../controllers/city');


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

router.get('/state', Admin.isLoggedIn, Admin.getUserRole, State.getStateListing);
router.get('/get-country-listing-for-state', Admin.isLoggedIn, State.getCountryListing);
router.post('/add-state-details', Admin.isLoggedIn, State.addStateDetails);

router.get('/city', Admin.isLoggedIn,Admin.getUserRole, City.getCityListing);
router.get('/get-state-listing-by-country-id', Admin.isLoggedIn, City.getStateListing);
router.post('/add-city-details', Admin.isLoggedIn,City.addCityDetails);
router.post('/get-city-detail-by-id', Admin.isLoggedIn,City.getCityDetailsById);
router.post('/update-city-details-by-id', Admin.isLoggedIn,City.updateCityDetailsById);
router.post('/update-city-status-by-id', Admin.isLoggedIn,City.updateCityStatusById);
router.post('/delete-city-by-id', Admin.isLoggedIn,Admin.isAdminAllowed, City.deleteCityById);



router.get('/logout', Admin.logout);



// POST
router.post('/register', Admin.registerUser);
router.post('/login', Admin.login);

module.exports = router;
