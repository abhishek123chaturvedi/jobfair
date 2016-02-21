
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
        State.find({},function(err,response) {
            if(err) {
                res.render('state/state_listing.html',{state : []});
                console.log('error',err);
            } else if(!response) {
                res.render('state/state_listing.html',{state : [],user_role: req.userRole});
            }else {
                res.render('state/state_listing.html',{state : response, user_role: req.userRole})
            }
        });
    },

    getCountryListing : function( req, res, next) {
        Country.find({},function(err,country) {
           if(err) {
               res.send({ status : false, msg : "Something went wrong"});
               return;
           } else if(!country) {
               res.send({ status : true, data : []});
               return;
           } else {
               res.send({ status : true, data : country});
               return;
           }
        });
    },

    getStateDetailsById : function(req, res, next) {

    },

    addStateDetails : function(req, res, next) {
        if(typeof req.body.name !== "undefined" && typeof req.body.country_id !== "undefined" &&
            req.body.name !== null && req.body.name !== "" && req.body.country_id !== null && req.body.country_id !=="") {
            var nameRegex = new RegExp(/^[a-zA-Z ]*$/);
            if(nameRegex.test(req.body.name)) {
                var state_name = (req.body.name).toLowerCase();
                State.findOne({name : state_name},function(err,state) {
                    if(err) {
                        res.send({status : false, msg: "Something went wrong." });
                        return;
                    } else if(!state) {
                        var state = new State({
                            name : state_name,
                            country_id : req.body.country_id,
                            created_by : req.session.userData.user_id,
                            updated_by : req.session.userData.user_id
                        });
                        state.save(function(err,response){
                            if(err || !response) {
                                res.send({status : false, msg: "Cannot save your details . Please try again later" });
                                return;
                            } else {
                                res.send({status : true, msg: "Details added successfully"});
                                return;
                            }
                        });
                    } else {
                        res.send({status : false, msg: "State is already present." });
                        return;
                    }
                });
            } else {
                res.send({status : false, msg: "Name only includes alphabetic characters with no spaces and special symbols." });
                return;
            }
        } else {
            res.send({status : false, msg: "Invalid data." });
            return;
        }
    },

    updateStateDetailsById : function(req, res, next) {

    },

    updateStateStatusById : function(req, res, next) {

    },

    deleteStateById : function(req, res, next) {

    }
};
module.exports = StateController;
