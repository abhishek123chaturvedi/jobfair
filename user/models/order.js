/**
 * Created by devesh on 24/8/15.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OrderSchema = new Schema({
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
    mode : {
        type : String
    },
    images : [{
        path : String,
        thumb_path : String,
        print_size : {
            type :String,
            default : '6x4'
        },
        print_price : {
            type : Number,
            default : 10
        },
        print_copies :{
            type : Number,
            default : 1
        },
        paper_type : {
            type : String,
            default : 'matte'
        },
        disk_size : String
    }],
    order_status : {
        type : String,
        default: 'draft'
    },
    payment_logs : [
        {
            payment_details : Schema.Types.Mixed,
            date_of_payment : {
                type : Date,
                default : Date.now()
            }
        }
    ],
    invoice_details: {
        generated_on : Date,
        invoice_path : String
    },
    address_details : {
        name : String,
        email : String,
        mobile : String,
        landmark : String,
        pincode : String,
        address : String
    },

    track_logs : [{
        date : Date,
        status : String
    }],
    is_active : {
        type : Boolean,
        default : true
    }
});

module.exports = mongoose.model('Order', OrderSchema);