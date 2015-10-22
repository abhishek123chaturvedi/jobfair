/**
 * Created by devesh on 21/8/15.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var priceSchema = new Schema({
    price: Number,
    print_size : String,
    paper_type : [
        {
            name: String,
            price : Number
        }
    ],
    default : Boolean,
    is_active : {
        type : Boolean,
        default : true
    }
});

module.exports = mongoose.model('Price', priceSchema);