/**
 * Created by devesh on 5/9/15.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var contactUsSchema = new Schema({
    name: String,
    email : String,
    message : String,
    create_at : {
        type : Date,
        default : Date.now()
    }
});

module.exports = mongoose.model('contactUs', contactUsSchema);
