/**
 * Created by Abhishek on 22/10/15.
 */

var mongoose = require('mongoose'),
    async = require("async"),
    Schema = mongoose.Schema;

var CitySchema = new Schema({
    name: {
        type: String,
        required : true,
        trim : true
    },
    state_id : {
        type : Schema.ObjectId,
        ref : 'State'
    },
    is_active : {
        type : Boolean,
        default : true
    },
    created_at: Date,
    updated_at: Date,
    created_by : {
        type : Schema.ObjectId,
        ref : 'Admin'
    },
    updated_by : {
        type : Schema.ObjectId,
        ref : 'Admin'
    }
});

CitySchema.pre('save', function(next, done) {

    var city = this;
    //Validation Functions to check user details.
    async.series([
        function(callback) {
            // get the current date
            var currentDate = new Date();

            // change the updated_at field to current date
            city.updated_at = currentDate;

            // if created_at doesn't exist, add to that field
            if (!city.created_at)
                city.created_at = currentDate;

            callback();

        }
    ],function(error, result) {
        //All Bits are completed now call next
        next();
    });
});


module.exports = mongoose.model('City', CitySchema);