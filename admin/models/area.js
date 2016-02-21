/**
 * Created by Abhishek on 22/10/15.
 */
var mongoose = require('mongoose'),
    async = require("async"),
    Schema = mongoose.Schema;

var AreaSchema = new Schema({
    name: {
        type: String,
        required : true,
        trim : true
    },
    slug: {
        type: String,
        required : true,
        trim : true
    },
    city_id : {
        type : Schema.ObjectId,
        ref : 'City'
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

AreaSchema.pre('save', function(next, done) {

    var area = this;
    //Validation Functions to check user details.
    async.series([
        function(callback) {
            // get the current date
            var currentDate = new Date();

            // change the updated_at field to current date
            area.updated_at = currentDate;

            // if created_at doesn't exist, add to that field
            if (!area.created_at)
                area.created_at = currentDate;

            callback();

        }
    ],function(error, result) {
        //All Bits are completed now call next
        next();
    });
});


module.exports = mongoose.model('Area', AreaSchema);
