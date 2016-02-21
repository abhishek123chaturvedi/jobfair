/**
 * Created by Abhishek Chaturvedi on 19/10/15.
 */
var mongoose = require('mongoose'),
    async = require("async"),
    bcrypt = require('bcryptjs'),
    SALT_WORK_FACTOR = 10,
    Schema = mongoose.Schema;

var AdminSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    first_name : {
        type: String
    },
    last_name : {
        type: String
    },
    user_image : {
        type: String,
        trim: true
    },
    mobile : {
        type: String
    },
    alternate_mobile: {
        type: String,
        trim: true
    },
    password :{
        type: String
    },
    address :  {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    alternate_email: {
        type: String,
        trim: true
    },
    user_role: {
        type: String,
        required: true,
        default : 'admin', //eg:- admin/employee/employer/manager
        trim: true
    },
    verification_code : {
        type : Number,
        default : 0
    },
    verified_via:{
        type: String,
        trim:true,
        default : "phone"
    },
    is_verified : {
        type : Boolean,
        default :false
    },
    is_active : {
        type : Boolean,
        default :true
    },
    is_sms_alert : {
        type : Boolean,
        default :true
    },
    is_mail_alert : {
        type : Boolean,
        default :true
    },
    authType : {
        type: String
    },
    facebook : {
        id : String,
        token : String
    },
    google : {
        id : String,
        token : String
    },
    last_login: {
        type: Date,
        required: false,
        trim: true
    },
    created_at: Date,
    updated_at: Date
});


function encryptPassword(admin, done, callback) {
    // only hash the password if it has been modified (or is new)
    if (!admin.isModified('password')) {
        callback();
    }
    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return callback(err);
        // hash the password using our new salt
        bcrypt.hash(admin.password, salt, function(err, hash) {
            if (err) return callback(err);

            // override the cleartext password with the hashed one
            admin.password = hash;
            callback();
        });
    });
    return;
};


// on every save, add the date
AdminSchema.pre('save', function(next, done) {

    var admin = this;
    //Validation Functions to check user details.
    async.series([
        function(callback) {
            encryptPassword(admin, done, callback);
        },
        function(callback) {
            // get the current date
            var currentDate = new Date();

            // change the updated_at field to current date
            admin.updated_at = currentDate;

            // if created_at doesn't exist, add to that field
            if (!admin.created_at)
                admin.created_at = currentDate;

            callback();

        }
    ],function(error, result) {
        //All Bits are completed now call next
        next();
    });
});

/**
 * compare password
 *
 * @param userEncryptedPassword
 * @param callback
 */
AdminSchema.methods.comparePassword = function(userEncryptedPassword, callback) {
    bcrypt.compare(userEncryptedPassword, this.password, function(err, isMatch) {
        if (err) return callback(err);
        callback(null, isMatch);
    });
};


module.exports = mongoose.model('Admin', AdminSchema);