
/**
 * Created by Abhishek on 22/10/15.
 */
var Admin = require('../models/admin'),
    area = require('../models/area'),
    city = require('../models/city'),
    config = require('../config/config'),
    request = require('request'),
    async = require('async'),
    email = require("../util/email"),
    Util = require("../util/index");



var AreaController = {

    getAreaListing : function(req, res, next) {
        area.find({}).populate("city_id","name").exec(function(err,response) {
            if(err) {
                res.render('area/area_listing.html',{area : []});
            } else if(!response) {
                res.render('area/area_listing.html',{area : [],user_role: req.userRole});
            } else {

                res.render('area/area_listing.html',{area : response, user_role: req.userRole})
            }
        });
    },

    getAreaDetailsById : function(req, res, next) {
        if(typeof req.body.area_id !== "undefined" && req.body.area_id !== null && req.body.area_id !== "") {
            area.findOne({_id : req.body.area_id}).select("name city_id").populate("city_id","name").exec(function(err, area){
                if(err || !area) {
                    res.send({status : false, msg : "Something went wrong"});
                    return;
                } else {
                    city.find({is_active : true}).select("name").exec(function(err,city) {
                        //console.log(JSON.stringify(country));
                        if(err && !city) {
                            res.send({status : false, msg : "Something went wrong"});
                            return;
                        } else {
                            res.send({status : true, area : area, city : city});
                            return;
                        }
                    });
                }
            });
        } else {
            res.send({status : false, msg : "Invalid data"});
            return;
        }
    },

    getCityListing : function( req, res, next) {
        city.find({is_active : true}).select("name").exec(function(err,city) {
            //console.log(JSON.stringify(country));
            if(err && !city) {
                res.send({status : false, msg : "Something went wrong"});
                return;
            } else {
                res.send({status : true, data : city});
                return;
            }
        });
    },

    addAreaDetails : function(req, res, next) {
        if(typeof req.body.name !== "undefined" && typeof req.body.city_id !== "undefined" &&
            req.body.name !== null && req.body.name !== "" && req.body.city_id !== null && req.body.city_id !=="") {
            var nameRegex = new RegExp(/^[a-zA-Z ]*$/);
            if(nameRegex.test(req.body.name)) {
                area.findOne({name : req.body.name},function(err,area) {
                    if(err) {
                        res.send({status : false, msg: "Something went wrong" });
                        return;
                    } else if(!area) {
                        city.findOne({_id : req.body.city_id, is_active : true},function(err,city) {
                            if(err || !city) {
                                res.send({status : false, msg: "Invalid city detail" });
                                return;
                            } else {
                                var slug = Util.setSlug(req.body.name);
                                if(typeof slug != 'undefined' && slug !== null && slug !== "") {
                                    Util.checkSlugExistence(area, slug, '', 'area', function(slug) {
                                        var area = new area({
                                            name : req.body.name,
                                            slug : slug,
                                            city_id : req.body.city_id,
                                            created_by : req.session.userData.user_id,
                                            updated_by : req.session.userData.user_id
                                        });
                                        area.save(function(err,response){
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
                                    return;
                                }
                            }
                        });
                    } else {
                        res.send({status : false, msg: "Area is already present" });
                        return;
                    }
                });
            } else {
                res.send({status : false, msg: "Name only includes alphabetic characters with no spaces and special symbols" });
                return;
            }
        } else {
            res.send({status : false, msg: "Invalid data" });
            return;
        }
    },

    updateAreaDetailsById : function(req, res, next) {
        if(typeof req.body.name !== "undefined" && req.body.name != null && req.body.name !== "" && typeof req.body.id !== "undefined" &&
        typeof req.body.city_id !== "undefined" && req.body.city_id !== null) {
            var nameRegex = new RegExp(/^[a-zA-Z ]*$/);
            if(nameRegex.test(req.body.name)) {
                area.findOne({ _id : req.body.id}, function(error, area) {
                    if (error || !area) {
                        res.send({status : false, msg : "Invalid area"});
                        res.end();
                    } else {
                        city.findOne({_id : req.body.city_id, is_active : true},function(err,city) {
                            if(err || !city) {
                                res.send({status : false, msg: "Invalid city detail" });
                                return;
                            } else {
                                //need to save data
                                Util.checkNameExistence(area, req.body.name, req.body.id, 'area', res, function(name) {
                                    var slug = Util.setSlug(req.body.name);
                                    if(typeof slug != 'undefined' && slug !== null && slug !== "") {
                                        Util.checkSlugExistence(area, slug, req.body.id, 'area', function(slug) {
                                            area.name = name;
                                            area.slug = slug;
                                            area.city_id = req.body.city_id;
                                            area.updated_at = Date.now();
                                            area.updated_by = req.session.userData.user_id;
                                            area.save(function(err, response) {
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
            } else {
                res.send({status : false, msg: "Name only includes alphabetic characters with no spaces and special symbols." });
                return;
            }
        } else {
            res.send({status : false, msg: "Invalid data."});
            return;
        }
    },

    updateAreaStatusById : function(req, res, next) {
        if(typeof req.body.id !== "undefined" && req.body.id != null && req.body.id !== "") {
            area.findOne({_id : req.body.id},function(err,response) {
                if(err|| !response) {
                    res.send({status : false, msg : "Invalid area"});
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

    deleteAreaById : function(req, res, next) {
        if(typeof req.body.id !== "undefined" && req.body.id != null && req.body.id !== "") {
            area.findOne({_id : req.body.id},function(err,response) {
                if(err && !response) {
                    res.send({status : false, msg : "Invalid area"});
                    res.end();
                } else {
                    area.remove({_id : req.body.id},function(err,response) {
                        if(err || !response) {
                            res.send({status : false, msg : "Invalid area"});
                            res.end();
                        } else {
                            res.send({status : true, msg: "Area deleted successfully"});
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
module.exports = AreaController;
