/**
 * Created by devesh on 4/8/15.
 */
var mongoose = require('mongoose'),
    config = require('./config');

mongoose.connect(config['dbUrl']);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    console.log("Database connection opened...!!")
});

module.exports = db;