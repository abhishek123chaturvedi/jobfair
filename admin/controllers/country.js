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
        Country.find({}).select("name").exec(function(err, countryNames){
            if(err) {
                res.render('country/country_listing.html',{country : []});
            } else if( !countryNames) {
                res.render('country/country_listing.html',{country : [],user_role: req.userRole});
            } else {
                res.render('country/country_listing.html',{country : countryNames, user_role: req.userRole})
            }
        });

    },

    getCountryDetailsById : function(req, res, next) {
        if(typeof req.body.country_id !== "undefined" && req.body.country_id !== null) {
            Country.findOne({_id : req.body.country_id}).select("name").exec(function(err, country){
                if(err || !country) {
                    res.send({status : false, msg : "Something went wrong"});
                    return;
                } else {
                    res.send({status : true, country : country});
                    return;
                }
            });
        } else {
            res.send({status : false, msg : "Invalid data"});
            return;
        }
    },

    addCountryDetails : function(req, res, next) {
        if(typeof req.body.name !== "undefined" && req.body.name != null && req.body.name !== "") {
            var nameRegex = new RegExp(/^[a-zA-Z ]*$/);
            if(nameRegex.test(req.body.name)) {
                Country.findOne({name : req.body.name},function(err,country) {
                    if(err) {
                        res.send({status : false, msg: "Something went wrong." });
                        return;
                    } else if(!country) {
                        var slug = Util.setSlug(req.body.name);
                        if(typeof slug != 'undefined' && slug !== null && slug !== "") {
                            Util.checkSlugExistence(Country, slug, '', 'country', function(slug) {
                                var country = new Country({
                                    name : req.body.name,
                                    slug : slug,
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
                            },0);
                        } else {
                            res.send({status : false, msg: "Invali data." });
                            return;
                        }
                    } else {
                        res.send({status : false, msg: "Country is already present." });
                        return;
                    }
                });
            } else {
                res.send({status : false, msg: "Name only includes alphabetic characters with no spaces and special symbols." });
                return;
            }
        } else {
            res.send({status : false, msg: "Invalid data."});
            return;
        }
    },

    updateCountryDetailsById : function(req, res, next) {
        if(typeof req.body.name !== "undefined" && req.body.name != null && req.body.name !== "" && typeof req.body.id !== "undefined") {
            var nameRegex = new RegExp(/^[a-zA-Z ]*$/);
            if(nameRegex.test(req.body.name)) {
                Country.findOne({ _id : req.body.id}, function(error, country) {
                    if (error || !country) {
                        res.send({status : false, msg : "Invalid country"});
                        res.end();
                    } else {
                        //need to save data
                        Util.checkNameExistence(Country, req.body.name, req.body.id, 'country', res, function(name) {
                            var slug = Util.setSlug(req.body.name);
                            if(typeof slug != 'undefined' && slug !== null && slug !== "") {
                                Util.checkSlugExistence(Country, slug, req.body.id, 'country', function(slug) {
                                    country.name = name;
                                    country.slug = slug
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
                                },0);
                            } else {
                                res.send({status : false, msg: "Invali data." });
                                return;
                            }
                        });
                    }
                });
            } else {
                res.send({status : false, msg: "Name only includes alphabetic characters with no spaces and special symbols." });
                return;
            }
        } else {
            res.send({status : false, msg: "Invalid data."});
            return;
        }
    },

    updateCountryStatusById : function(req, res, next) {
        if(typeof req.body.id !== "undefined" && req.body.id != null && req.body.id !== "") {
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
        } else {
            res.send({status : false, msg: "Invalid data."});
            return;
        }
    },

    deleteCountryById : function(req, res, next) {
        if(typeof req.body.country_id !== "undefined" && req.body.country_id != null && req.body.country_id !== "") {
            Country.findOne({_id : req.body.id},function(err,response) {
                if(err && !response) {
                    res.send({status : false, msg: "Invalid country"});
                    return;
                } else {
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
            });
        } else {
            res.send({status : false, msg: "Invalid data"});
            return;
        }
    }
};
module.exports = CountryController;
