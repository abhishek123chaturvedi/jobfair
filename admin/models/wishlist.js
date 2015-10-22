
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var WishlistSchema = new Schema({
    user_id : {
        type: Schema.ObjectId,
        ref: 'User'
    },
    created_at : {
        type : Date,
        default : Date.now()
    },
    updated_at : {
        type : Date
    },
    images : [{
        path : String,
        thumb_path : String
    }],
    is_active : {
        type : Boolean,
        default : true
    }
});

module.exports = mongoose.model('Wishlist', WishlistSchema);