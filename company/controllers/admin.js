var Admin = require('../models/admin'),
    config = require('../config/config'),
    request = require('request'),
    async = require('async'),
    email = require("../util/email");



var AdminController = {

    signIn : function(req, res, next) {
        if(typeof req.session.userData !== 'undefined'
            && req.session.userData !==  null) {
            res.redirect('/dashboard');
        } else {
            res.render("admin/signin.html", {});
        }
    },

    signUp : function(req, res, next) {
        if(typeof req.session.userData !== 'undefined'
            && req.session.userData !==  null) {
            res.redirect('/dashboard');
        } else {
            res.render("admin/signup.html", {});
        }
    },

    isLoggedIn : function(req,res,next) {
        if(typeof req.session.userData !== 'undefined'
            && req.session.userData !==  null) {
            next();
        } else {
            req.flash('danger', "User not logged in");
            res.redirect('/');
        }
    },

    dashboard : function(req,res,next) {
        res.render('index.html');
    },

    getUserDetails : function(req,res,next) {
        Admin.findOne({username : req.session.userData.username}, function(err, user) {
            if(!err) {
                res.render("user_profile.html", {user: user})
            } else {
                res.redirect('/dashboard');
            }

        });
        res.render('user_profile.html');
    },

    getUserRole : function( req, res, next) {
        Admin.findOne({_id : req.session.userData.user_id}, function(err, user) {
            if(!err) {
                req.userRole = user.user_role;
                next();
            } else {
                res.redirect('/logout');
            }

        });
    },

    isAdminAllowed : function(req, res, next) {
        Admin.findOne({_id : req.session.userData.user_id, user_role : "admin"}, function(err, user) {
            if(err || !user) {
                res.redirect('/logout');
            } else {
                next();
            }

        });
    },

	login : function(req, res) {
        Admin.findOne({$or: [{username : req.body.username}, {email : req.body.username}, {mobile : req.body.username}]}).exec(function(err,user) {
            if(err || ! user) {
                req.flash('danger', "Something went wrong");
                res.redirect('/');
            } else {
                user.comparePassword(req.body.password, function (err, isMatch) {
                    if (err || !isMatch) {
                        req.flash('danger', "Wrong username or password");
                        res.redirect('/');
                    } else {
                        if (user.is_verified == true) {
                            req.session.userData = {
                                user_id : user.id,
                                username : user.username,
                                first_name : user.first_name,
                                user_role : user.user_role
                            };
                            res.redirect('/dashboard');
                        } else {
                            req.flash('danger', "You need to verify your account");
                            res.redirect('/');
                        }
                    }
                });
            }
        });
	},


    registerUser : function(req, res, next) {
        var info = {},
            data = {},
            query = {};

        if(typeof req.body.username !== "undefined" && req.body.username != ""
            && typeof req.body.password !== "undefined" && req.body.password != ""
            && typeof req.body.confirm_password !== "undefined" && req.body.confirm_password != "") {

            req.body.username = req.body.username.toLowerCase();

            if(req.body.password == req.body.confirm_password) {
                var emailRegex = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i),
                    mobRegex = new RegExp(/^[1-9]\d{9}$/);

                if((emailRegex.test(req.body.email)) && (mobRegex.test(req.body.mobile))){
                    query = {username : req.body.username, email : req.body.email, mobile : req.body.mobile};
                    var verification_code = Math.floor(Math.random()*90000) + 10000;
                    data = {
                        first_name : req.body.first_name,
                        last_name : req.body.last_name,
                        username : req.body.username,
                        password : req.body.password,
                        mobile : req.body.mobile,
                        email : req.body.email,
                        authType : 'local',
                        verification_code : verification_code
                    };
                    AdminController.findAndCreateUser(query, data, res, req, next);

                }  else {
                    req.flash('danger', "Please enter a valid email or mobile");
                    res.redirect('/sign-up');
                }
            } else {
                req.flash('danger', "Password and confirm Password did not match.");
                res.redirect('/sign-up');
            }
        } else {
            req.flash('danger', "Please enter a email or mobile.");
            res.redirect('/sign-up');
        }
    },

    findAndCreateUser : function(query, data, res, req, next) {
        var info = {};
        Admin.findOne(query,(function(err, user){
                if (err) {
                    //@todo : handle error
                    res.redirect('/');
                }
                if (user) {
                    if(user.username == data.username) {
                        req.flash('danger', "A user is already registered with this username");
                    }
                    if (user.mobile == data.mobile) {
                        req.flash('danger', "A user is already registered with this mobile");
                    }
                    if (user.email == data.email) {
                        req.flash('danger', "A user is already registered with this email");
                    }
                    res.redirect('/sign-up');
                } else {
                    var admin = new Admin(data);
                    admin.save(function(err, data) {
                        if (err || !data) {
                            req.flash('danger', "Something went wrong!!");
                            res.redirect('/sign-up');
                        } else {
                            var message = {
                                subject: 'Jobfair | Verification Code',
                                to: [ { email: data.email, type: 'to' } ],
                                global_merge_vars:[ { name: 'verification_code', content: data.verification_code },
                                    { name: 'verification_message', content: config.verification_message }]
                            };
                            email.send("verification_mail_template", message, function(result){
                                console.log("result", result);
                            });
                            res.redirect('/sign-in');
                        }
                    });
                }
            })
        );
    },

    logout :  function(req, res){

        req.session.destroy();
        res.redirect('/');

    }
};
module.exports = AdminController;