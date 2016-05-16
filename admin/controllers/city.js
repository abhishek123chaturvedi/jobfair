/**
 * Created by anshul on 22/10/15.
 */
var Admin = require('../models/admin'),
    City = require('../models/city'),
    State = require('../models/state'),
    Country = require('../models/country'),
    config = require('../config/config'),
    request = require('request'),
    async = require('async'),
    email = require("../util/email"),
    Util = require("../util/index");



var CityController = {

    getCityListing : function(req, res, next) {
        City.find({}).populate("country_id","name").populate("state_id","name").exec(function(err, cityNames){
            if(err) {
                res.render('city/city_listing.html',{city : []});
            } else if( !cityNames) {
                res.render('city/city_listing.html',{city : [],user_role: req.userRole});
            } else {
                res.render('city/city_listing.html',{city : cityNames, user_role: req.userRole})
            }
        });

    },

    getStateListing : function(req, res, next) {
        if(typeof req.query.country_id !== "undefined" && req.query.country_id !== null) {
            State.find({country_id : req.query.country_id, is_active : true},function(err,response) {
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
        } else {
            res.send({ status : false, msg : "Something went wrong"});
            return;
        }
    },

    getCityDetailsById : function(req, res, next) {
        if(typeof req.body.city_id !== "undefined" && req.body.city_id !== null && req.body.city_id !== "") {
            City.findOne({_id : req.body.city_id}).select("name state_id country_id").exec(function(err, city) {
                if(err || !city) {
                    res.send({status : false, msg : "Something went wrong"});
                    return;
                } else {
                    State.find({country_id : city.country_id, is_active : true}).select("name").exec(function(err,state) {
                        if(err || !state) {
                            res.send({status : false, msg : "Something went wrong"});
                            return;
                        } else {
                            Country.find({is_active : true}).select("name").exec(function(err,country) {
                                if(err || !country) {
                                    res.send({status : false, msg : "Something went wrong"});
                                    return;
                                } else {
                                    res.send({status : true, city : city, country : country, state : state});
                                    return;
                                }
                            });
                        }
                    });
                }
            });
        } else {
            res.send({status : false, msg : "Invalid data"});
            return;
        }
    },

    addCityDetails : function(req, res, next) {
        if(typeof req.body.name !== "undefined" && typeof req.body.state_id !== "undefined" &&
            req.body.name !== null && req.body.name !== "" && req.body.state_id !== null && req.body.state_id !=="" &&
            req.body.country_id !== "undefined" && req.body.country_id !== null) {
            var nameRegex = new RegExp(/^[a-zA-Z ]*$/);
            if(nameRegex.test(req.body.name)) {
                City.findOne({name : req.body.name},function(err,city) {
                    if(err) {
                        res.send({status : false, msg: "Something went wrong" });
                        return;
                    } else if(!city) {
                        Country.findOne({_id : req.body.country_id, is_active : true},function(err,country) {
                            if(err || !country) {
                                res.send({status : false, msg: "Invalid country detail." });
                                return;
                            } else {
                                State.findOne({_id : req.body.state_id, is_active : true},function(err,state) {
                                    if(err || !state) {
                                        res.send({status : false, msg: "Invalid state detail" });
                                        return;
                                    } else {
                                        var slug = Util.setSlug(req.body.name);
                                        if(typeof slug != 'undefined' && slug !== null && slug !== "") {
                                            Util.checkSlugExistence(City, slug, '', 'city', function(slug) {
                                                var city = new City({
                                                    name : req.body.name,
                                                    slug : slug,
                                                    country_id : req.body.country_id,
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
                                            res.send({status : false, msg: "Invali data" });
                                            res.end();
                                            return;
                                        }
                                    }
                                });
                            }
                        });
                    } else {
                        res.send({status : false, msg: "City is already present" });
                        return;
                    }
                });
            } else {
                res.send({status : false, msg: "Name only includes alphabetic characters with no spaces and special symbols" });
                return;
            }
        } else {
            res.send({status : false, msg: "Invalid data"});
            return;
        }

    },

    updateCityDetailsById : function(req, res, next) {
        if(typeof req.body.name !== "undefined" && typeof req.body.state_id !== "undefined" && req.body.id !== null &&
            req.body.name !== null && req.body.name !== "" && req.body.state_id !== null && req.body.state_id !==""
            && typeof req.body.country_id !== "undefined" && req.body.country_id !== null && typeof req.body.id !== "undefined" ) {
            var nameRegex = new RegExp(/^[a-zA-Z ]*$/);
            if(nameRegex.test(req.body.name)) {
                City.findOne({ _id : req.body.id}, function(error, city) {
                    if (error || !city) {
                        res.send({status : false, msg : "Invalid city"});
                        res.end();
                    } else {
                        Country.findOne({_id : req.body.country_id, is_active : true},function(err,country) {
                            if(err || !country) {
                                res.send({status : false, msg: "Invalid country detail" });
                                return;
                            } else {
                                State.findOne({_id : req.body.state_id, is_active : true},function(err,state) {
                                    if(err || !state) {
                                        res.send({status : false, msg: "Invalid state detail" });
                                        return;
                                    } else {
                                        //need to save data
                                        Util.checkNameExistence(City, req.body.name, req.body.id, 'city', res, function(name) {
                                            var slug = Util.setSlug(req.body.name);
                                            if(typeof slug != 'undefined' && slug !== null && slug !== "") {
                                                Util.checkSlugExistence(City, slug, req.body.id, 'city', function(slug) {
                                                    city.name = req.body.name;
                                                    city.slug = slug
                                                    city.country_id = req.body.country_id;
                                                    city.state_id = req.body.state_id;
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
                                                },0);
                                            } else {
                                                res.send({status : false, msg: "Invali data"});
                                                return;
                                            }
                                        });
                                    }
                                });
                            }
                        });
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
        if (typeof req.body.id !== "undefined" && req.body.id !== null && req.body.id =="") {
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
        } else {
            res.send({status : false, msg : "Invalid data"});
            res.end();
        }
    },

    deleteCityById : function(req, res, next) {
        if (typeof req.body.id !== "undefined" && req.body.id !== null && req.body.id =="") {
            City.findOne({_id : req.body.id},function(err,response) {
                if(err|| !response) {
                    res.send({status : false, msg : "Invalid city"});
                    res.end();
                } else {
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
            });
        } else {
            res.send({status : false, msg : "Invalid city"});
            res.end();
        }
    }
};
module.exports = CityController;
