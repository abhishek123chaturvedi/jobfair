/**
 * Created by anshul on 22/10/15.
 */
var Admin = require('../models/admin'),
    Country = require('../models/country'),
    config = require('../config/config'),
    request = require('request'),
    async = require('async'),
    email = require("../util/email"),
    Util = require("../util/index");



var CountryController = {

    getCountryListing : function(req, res, next) {
        Country.find({},function(err, countryNames){
            if(err) {
                res.render('country/country_listing.html',{country : []});
                console.log('error',err);
            } else if( !countryNames) {
                res.render('country/country_listing.html',{country : [],user_role: req.userRole});
            } else {
                res.render('country/country_listing.html',{country : countryNames, user_role: req.userRole})
            }
        });

    },

    getCountryDetailsById : function(req, res, next) {
        Country.findOne({_id : req.body.country_id},function(err, country){
            if(err || !country) {
                console.log("error",err);
                res.send({status : false, msg : "Something went wrong"});
                return;
            } else {
                res.send({status : true, country : country});
                return;
            }
        });
    },

    addCountryDetails : function(req, res, next) {
        var nameRegex = new RegExp(/^[a-zA-Z ]*$/);
        if(nameRegex.test(req.body.name)){
            var country_name = (req.body.name).toLowerCase();
            Country.findOne({name : country_name},function(err,country) {
                if(err) {
                    res.send({status : false, msg: "Something went wrong." });
                    return;
                } else if(!country) {
                    var country = new Country({
                        name : country_name,
                        created_by : req.session.userData.user_id,
                        updated_by : req.session.userData.user_id
                    });
                    country.save(function(err,response){
                        if(err || !response) {
                            res.send({status : false, msg: "Cannot save your details . Please try again later" });
                            return;
                        } else {
                            res.send({status : true, msg: "Details added successfully"});
                            return;
                        }
                    });
                } else {
                    res.send({status : false, msg: "Country is already present." });
                    return;
                }
            });
        } else {
            res.send({status : false, msg: "Name only includes alphabetic characters with no spaces and special symbols." });
            return;
        }



    },

    updateCountryDetailsById : function(req, res, next) {
        var nameRegex = new RegExp(/^[a-zA-Z ]*$/);
        if(nameRegex.test(req.body.name)){
            var country_name = (req.body.name).toLowerCase();
            Country.findOne({ _id : req.body.id}, function(error, country) {
                if (error || !country) {
                    res.send({status : false, msg : "Invalid country"});
                    res.end();
                } else {
                    if(typeof country_name != 'undefined'){
                        //need to save data
                        Util.checkNameExistence(Country, country_name, req.body.id, 'country', res, function(name) {
                            country.name = country_name;
                            country.updated_at = Date.now();
                            country.updated_by = req.session.userData.user_id;
                            country.save(function(err, response) {
                                if(err || !response) {
                                    res.send({status : false, msg: "Cannot save your details . Please try again later" });
                                    return;
                                } else {
                                    res.send({status : true, msg: "Details added successfully"});
                                    return;
                                }
                            });
                        });
                    } else {
                        res.send({status : false, message : "Please enter name.",data:[]});
                        res.end();
                    }

                }
            });
        } else {
            res.send({status : false, msg: "Name only includes alphabetic characters with no spaces and special symbols." });
            return;
        }

    },

    updateCountryStatusById : function(req, res, next) {
        Country.findOne({_id : req.body.id},function(err,response) {
            if(err|| !response) {
                res.send({status : false, msg : "Invalid country"});
                res.end();
            } else {
                response.is_active = !response.is_active;
                response.updated_at = Date.now();
                response.updated_by = req.session.userData.user_id;
                response.save(function(err,data){
                    if(err || !data) {
                        res.send({status : false, msg: "Cannot update status . Please try again later" });
                        return;
                    } else {
                        res.send({status : true, msg: "status updated successfully"});
                        return;
                    }
                });
            }
        });
    },

    deleteCountryById : function(req, res, next) {
        Country.remove({_id : req.body.id},function(err,response) {
            if(err || !response) {
                res.send({status : false, msg : "Invalid country"});
                res.end();
            } else {
                res.send({status : true, msg: "Country deleted successfully"});
                return;
            }
        });
    }
};
module.exports = CountryController;