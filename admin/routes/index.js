var express = require('express');
var router = express.Router();
var Admin = require('../controllers/admin');
var Country = require('../controllers/country');
var State = require('../controllers/state');
var City = require('../controllers/city');
var Area = require('../controllers/area');


/* GET home page. */
router.get(['/','/sign-in'], Admin.signIn);

//router.get('/sign-up', Admin.signUp);

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
router.post('/get-state-details-by-id', Admin.isLoggedIn,State.getStateDetailsById);
router.post('/update-state-details-by-id', Admin.isLoggedIn,State.updateStateDetailsById);
router.post('/update-state-status-by-id', Admin.isLoggedIn,State.updateStateStatusById);
router.post('/delete-state-by-id', Admin.isLoggedIn,Admin.isAdminAllowed, State.deleteStateById);

router.get('/city', Admin.isLoggedIn,Admin.getUserRole, City.getCityListing);
router.get('/get-state-listing-by-country-id', Admin.isLoggedIn, City.getStateListing);
router.post('/add-city-details', Admin.isLoggedIn,City.addCityDetails);
router.post('/get-city-detail-by-id', Admin.isLoggedIn,City.getCityDetailsById);
router.post('/update-city-details-by-id', Admin.isLoggedIn,City.updateCityDetailsById);
router.post('/update-city-status-by-id', Admin.isLoggedIn,City.updateCityStatusById);
router.post('/delete-city-by-id', Admin.isLoggedIn,Admin.isAdminAllowed, City.deleteCityById);

router.get('/area', Admin.isLoggedIn, Admin.getUserRole, Area.getAreaListing);
router.get('/get-city-listing-for-area', Admin.isLoggedIn, Area.getCityListing);
router.post('/add-area-details', Admin.isLoggedIn, Area.addAreaDetails);
router.post('/get-area-details-by-id', Admin.isLoggedIn,Area.getAreaDetailsById);
router.post('/update-area-details-by-id', Admin.isLoggedIn,Area.updateAreaDetailsById);
router.post('/update-area-status-by-id', Admin.isLoggedIn,Area.updateAreaStatusById);
router.post('/delete-area-by-id', Admin.isLoggedIn,Admin.isAdminAllowed, Area.deleteAreaById);


router.get('/logout', Admin.logout);



// POST
router.post('/register', Admin.registerUser);
router.post('/login', Admin.login);

module.exports = router;
