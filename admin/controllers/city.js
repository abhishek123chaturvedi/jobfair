/**
 * Created by anshul on 22/10/15.
 */
var Admin = require('../models/admin'),
    City = require('../models/city'),
    State = require('../models/state'),
    config = require('../config/config'),
    request = require('request'),
    async = require('async'),
    email = require("../util/email"),
    Util = require("../util/index");



var CityController = {

    getCityListing : function(req, res, next) {
        City.find({},function(err, cityNames){
            if(err) {
                res.render('city/city_listing.html',{city : []});
                console.log('error',err);
            } else if( !cityNames) {
                res.render('city/city_listing.html',{city : [],user_role: req.userRole});
            } else {
                res.render('city/city_listing.html',{city : cityNames, user_role: req.userRole})
            }
        });

    },

    getStateListing : function(req, res, next) {
        State.find({country_id : req.query.country_id},function(err,response) {
            console.log(err,response)
            if(err) {
                res.send({ status : false, msg : "Something went wrong"});
                return;
            } else if(!response) {
                res.send({ status : true, data : []});
                return;
            } else {
                res.send({ status : true, data : response});
                return;
            }
        });
    },

    getCityDetailsById : function(req, res, next) {
        City.findOne({_id : req.body.city_id}).select("name state_id").exec(function(err, city){
            if(err || !city) {
                res.send({status : false, msg : "Something went wrong"});
                return;
            } else {
                State.findOne({_id : city.state_id}).select("country_id").exec(function(err,data) {
                    if(err || !data) {
                        res.send({status : false, msg : "Something went wrong"});
                        return;
                    } else {
                        res.send({status : true, city : city, country : data});
                        return;
                    }
                });
            }
        });
    },

    addCityDetails : function(req, res, next) {
        if(typeof req.body.name !== "undefined" && typeof req.body.state_id !== "undefined" &&
            req.body.name !== null && req.body.name !== "" && req.body.state_id !== null && req.body.state_id !=="") {
            var nameRegex = new RegExp(/^[a-zA-Z ]*$/);
            if(nameRegex.test(req.body.name)) {
                City.findOne({name : req.body.name},function(err,city) {
                    if(err) {
                        res.send({status : false, msg: "Something went wrong." });
                        return;
                    } else if(!city) {
                        var slug = Util.setSlug(req.body.name);
                        if(typeof slug != 'undefined' && slug !== null && slug !== "") {
                            Util.checkSlugExistence(City, slug, '', 'city', function(slug) {
                                var city = new City({
                                    name : req.body.name,
                                    slug : slug,
                                    state_id : req.body.state_id,
                                    created_by : req.session.userData.user_id,
                                    updated_by : req.session.userData.user_id
                                });
                                city.save(function(err,response){
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
                            res.end();
                            return;
                        }
                    } else {
                        res.send({status : false, msg: "City is already present." });
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

    updateCityDetailsById : function(req, res, next) {
        if(typeof req.body.name !== "undefined" && typeof req.body.state_id !== "undefined" &&
            req.body.name !== null && req.body.name !== "" && req.body.state_id !== null && req.body.state_id !=="") {
            var nameRegex = new RegExp(/^[a-zA-Z ]*$/);
            if(nameRegex.test(req.body.name)) {
                City.findOne({ _id : req.body.id}, function(error, city) {
                    if (error || !city) {
                        res.send({status : false, msg : "Invalid city"});
                        res.end();
                    } else {
                        if(typeof req.body.name != 'undefined'){
                            //need to save data
                            Util.checkNameExistence(City, req.body.name, req.body.id, 'city', res, function(name) {
                                city.name = req.body.name;
                                city.updated_at = Date.now();
                                city.updated_by = req.session.userData.user_id;
                                city.save(function(err, response) {
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
        } else {
            res.send({status : false, msg: "Invalid data." });
            return;
        }
    },

    updateCityStatusById : function(req, res, next) {
        City.findOne({_id : req.body.id},function(err,response) {
            if(err|| !response) {
                res.send({status : false, msg : "Invalid city"});
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

    deleteCityById : function(req, res, next) {
        City.remove({_id : req.body.id},function(err,response) {
            if(err || !response) {
                res.send({status : false, msg : "Invalid city"});
                res.end();
            } else {
                res.send({status : true, msg: "City deleted successfully"});
                return;
            }
        });
    }
};
module.exports = CityController;
