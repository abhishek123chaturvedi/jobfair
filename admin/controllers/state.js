
/**
 * Created by Abhishek on 22/10/15.
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
        State.find({}).populate("country_id","name").exec(function(err,response) {
            if(err) {
                res.render('state/state_listing.html',{state : []});
            } else if(!response) {
                res.render('state/state_listing.html',{state : [],user_role: req.userRole});
            } else {

                res.render('state/state_listing.html',{state : response, user_role: req.userRole})
            }
        });
    },



    getStateDetailsById : function(req, res, next) {
        State.findOne({_id : req.body.state_id}).select("name country_id").populate("country_id","name").exec(function(err, state){
            if(err || !state) {
                res.send({status : false, msg : "Something went wrong"});
                return;
            } else {
                Country.find({is_active : true}).select("name").exec(function(err,country) {
                    //console.log(JSON.stringify(country));
                    if(err && !country) {
                        res.send({status : false, msg : "Something went wrong"});
                        return;
                    } else {
                        res.send({status : true, state : state, country : country});
                        return;
                    }
                });
            }
        });
    },

    getCountryListing : function( req, res, next) {
        Country.find({is_active : true}).select("name").exec(function(err,country) {
            //console.log(JSON.stringify(country));
            if(err && !country) {
                res.send({status : false, msg : "Something went wrong"});
                return;
            } else {
                res.send({status : true, data : country});
                return;
            }
        });
    },

    addStateDetails : function(req, res, next) {
        if(typeof req.body.name !== "undefined" && typeof req.body.country_id !== "undefined" &&
            req.body.name !== null && req.body.name !== "" && req.body.country_id !== null && req.body.country_id !=="") {
            var nameRegex = new RegExp(/^[a-zA-Z ]*$/);
            if(nameRegex.test(req.body.name)) {
                State.findOne({name : req.body.name},function(err,state) {
                    if(err) {
                        res.send({status : false, msg: "Something went wrong." });
                        return;
                    } else if(!state) {
                        Country.findOne({_id : req.body.country_id, is_active : true},function(err,country) {
                            if(err || !country) {
                                res.send({status : false, msg: "Invalid country detail." });
                                return;
                            } else {
                                var slug = Util.setSlug(req.body.name);
                                if(typeof slug != 'undefined' && slug !== null && slug !== "") {
                                    Util.checkSlugExistence(State, slug, '', 'state', function(slug) {
                                        var state = new State({
                                            name : req.body.name,
                                            slug : slug,
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
                                    },0);
                                } else {
                                    res.send({status : false, msg: "Invali data." });
                                    return;
                                }
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
        if(typeof req.body.name !== "undefined" && req.body.name != null && req.body.name !== "" && typeof req.body.id !== "undefined" &&
        typeof req.body.country_id !=="undefined") {
            var nameRegex = new RegExp(/^[a-zA-Z ]*$/);
            if(nameRegex.test(req.body.name)) {
                State.findOne({ _id : req.body.id}, function(error, state) {
                    if (error || !state) {
                        res.send({status : false, msg : "Invalid state"});
                        res.end();
                    } else {
                        Country.findOne({_id : req.body.country_id, is_active : true},function(err,country) {
                            if(err || !country) {
                                res.send({status : false, msg: "Invalid country detail." });
                                return;
                            } else {
                                //need to save data
                                Util.checkNameExistence(State, req.body.name, req.body.id, 'state', res, function(name) {
                                    var slug = Util.setSlug(req.body.name);
                                    if(typeof slug != 'undefined' && slug !== null && slug !== "") {
                                        Util.checkSlugExistence(State, slug, req.body.id, 'state', function(slug) {
                                            state.name = name;
                                            state.slug = slug;
                                            state.country_id = req.body.country_id;
                                            state.updated_at = Date.now();
                                            state.updated_by = req.session.userData.user_id;
                                            state.save(function(err, response) {
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
                                        res.send({status : false, msg: "Invali data."});
                                        return;
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
            res.send({status : false, msg: "Invalid data."});
            return;
        }
    },

    updateStateStatusById : function(req, res, next) {
        if(typeof req.body.id !== "undefined" && req.body.id != null && req.body.id !== "") {
            State.findOne({_id : req.body.id},function(err,response) {
                if(err|| !response) {
                    res.send({status : false, msg : "Invalid state"});
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

    deleteStateById : function(req, res, next) {
        if(typeof req.body.id !== "undefined" && req.body.id != null && req.body.id !== "") {
            State.findOne({_id : req.body.id},function(err,response) {
                if(err && !response) {
                    res.send({status : false, msg : "Invalid state"});
                    res.end();
                } else {
                    State.remove({_id : req.body.id},function(err,response) {
                        if(err || !response) {
                            res.send({status : false, msg : "Invalid state"});
                            res.end();
                        } else {
                            res.send({status : true, msg: "State deleted successfully"});
                            return;
                        }
                    });
                }
            });
        } else {
            res.send({status : false, msg: "Invalid data."});
            return;
        }
    }
};
module.exports = StateController;
