
/**
 * Created by anshul on 22/10/15.
 */
var Admin = require('../models/admin'),
    Country = require('../models/country'),
    State = require('../models/state'),
    config = require('../config/config'),
    request = require('request'),
    async = require('async'),
    email = require("../util/email"),
    Util = require("../util/index");



var StateController = {

    getStateListing : function(req, res, next) {
        res.render('state/state_listing.html')
    },

    getStateDetailsById : function(req, res, next) {

    },

    addStateDetails : function(req, res, next) {

    },

    updateStateDetailsById : function(req, res, next) {

    },

    updateStateStatusById : function(req, res, next) {

    },

    deleteStateById : function(req, res, next) {

    }
};
module.exports = StateController;