var User = require('../models/user'),
    env = process.env.NODE_ENV || 'local',
    bcrypt = require('bcryptjs'),
    config = require('../config/config'),
    request = require('request'),
    async = require('async'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy,
    GoogleStrategy = require('passport-google-oauth2').Strategy;


passport.use(new LocalStrategy(
    function(username, password, done) {
        User.findOne(
            {$or:[{username: username}, {email: username}, {mobile: username}], authType : 'local'},
            (function(err, user){
                if (err) return done(err);
                if (!user) {
                    return done(null, false, {
                        message: 'This user is not registered.'
                    });
                } else {
                    var checkPass = User.authenticate();
                    checkPass(user.username, password, function(err, user) {
                        if(!user) {
                            return done(null, false, {
                                message: 'Invalid credentials.'
                            });
                        } else {
                            return done(null, user);
                        }
                    })
                }
            })
        );
    }
));

passport.use(new FacebookStrategy({
        clientID: config.facebook.clientID,
        clientSecret: config.facebook.clientSecret,
        callbackURL: config.facebook.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
        User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
            // if there is an error, stop everything and return that
            // ie an error connecting to the database
            if (err)
                return done(err);
            // if the user is found, then log them in
            if (user) {
                return done(null, user); // user found, return that user
            } else {
                // if there is no user found with that facebook id, create them
                var data = {
                    'username' : profile.id,
                    'name' : profile.displayName,
                    'facebook.id' :  profile.id,
                    'facebook.token' :  accessToken,
                    'authType' : 'facebook'
                };

                var userData = new User(data);

                // save our user to the database
                userData.save(function(err, userData) {
                    if (err)
                        throw err;

                    // if successful, return the new user
                    return done(null, userData);
                });
            }

        });
    }
));

passport.use(new GoogleStrategy({
        clientID:     "30594493305-uodibq80pttpsteh4g42im7p5vgcf8vj.apps.googleusercontent.com",
        clientSecret: "n-XKzpRJDKvk9sfovhlbTF7e",
        callbackURL: "http://localhost:4000/auth/google/callback",
        passReqToCallback   : true
    },
    function(request, accessToken, refreshToken, profile, done) {
        User.findOne({ 'google.id' : profile.id }, function(err, user) {
            // if there is an error, stop everything and return that
            // ie an error connecting to the database
            if (err)
                return done(err);
            // if the user is found, then log them in
            if (user) {
                return done(null, user); // user found, return that user
            } else {
                // if there is no user found with that facebook id, create them
                var data = {
                    'username' : profile.id,
                    'name' : profile.displayName,
                    'google.id' :  profile.id,
                    'google.token' :  accessToken,
                    'authType' : 'google'
                };

                var userData = new User(data);

                // save our user to the database
                userData.save(function(err, userData) {
                    if (err)
                        throw err;

                    // if successful, return the new user
                    return done(null, userData);
                });
            }

        });
    }
));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


var UserController = {

	login : function(req, res) {
	  	res.send('Hi, This is user');
	},

    /*
     * POST register user.
     */

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
                    mobRegex = new RegExp(/^[1-9]{9}$/);

                if(emailRegex.test(req.body.email) && mobRegex.test(req.body.mobile)){
                    query = {username : req.body.username};
                    data = {
                        first_name : req.body.first_name,
                        last_name : req.body.last_name,
                        username : req.body.username,
                        mobile : req.body.mobile,
                        is_sms_alert : req.body.is_sms_alert,
                        is_mail_alert : req.body.is_mail_alert,
                        email : req.body.email,
                        authType : 'local'
                    };
                    UserController.findAndCreateUser(query, data, res, req, next);

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
        User.findOne(query,(function(err, user){
                if (err) {
                    //@todo : handle error
                    res.redirect('/');
                }
                if (user) {
                    var errMsg = [];
                    if(user.username == data.username) {
                        errMsg.push({username : "A user is already registered with this username"})
                    }
                    if (user.mobile == data.mobile) {
                        errMsg.push({mobile : "A user is already registered with this mobile"})
                    }
                    if (user.email == data.email) {
                        errMsg.push({email : "A user is already registered with this email"})
                    }
                    req.flash('danger', errMsg);
                    res.redirect('/sign-up');
                } else {
                    User.register(new User(data), req.body.password, function(err, user) {
                        if (err) {
                            req.flash('danger', "Something went wrong!!");
                            res.redirect('/signup');
                        } else {
                            passport.authenticate('local', function(err, user, info) {
                                if (err || !user) {
                                    req.flash('danger', info['message']);
                                    res.redirect('/signup');
                                } else {
                                    req.logIn(user, function(err) {
                                        if (err) {
                                            req.flash('danger', info['message']);
                                            res.redirect('/signup');
                                        } else {
                                            next();
                                        }
                                    });
                                }
                            })(req, res, next);
                        }
                    });
                }
            })
        );
    },
    logout :  function(req, res){

        req.session.destroy();
        req.logout();
        res.redirect('/');

    }
};
module.exports = UserController;