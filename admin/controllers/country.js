/**
 * Created by anshul on 22/10/15.
 */
var Admin = require('../models/admin'),
    Country = require('../models/country'),
    config = require('../config/config'),
    request = require('request'),
    async = require('async'),
    email = require("../util/email");



var CountryController = {

    getCountryListing : function(req, res, next) {
        res.render('country/country_listing.html',{country : null})
    }
};
module.exports = CountryController;