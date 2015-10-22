var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new Schema({
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
    resume : {
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
        default : 'user', //eg:- admin/employee/employer
        trim: true
    },
    device_info : [
        {
            type : { type: String, trim: true}, // eg. ios/android
            id : { type: String, trim: true},
            created_at: {  type: Date, default : Date.now}
        }
    ],
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

// on every save, add the date
UserSchema.pre('save', function(next) {
    // get the current date
    var currentDate = new Date();

    // change the updated_at field to current date
    this.updated_at = currentDate;

    // if created_at doesn't exist, add to that field
    if (!this.created_at)
        this.created_at = currentDate;

    next();
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);