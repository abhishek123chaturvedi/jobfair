/**
 * Created by anshul on 22/10/15.
 */
var config = require('../config/config');

var util = {
    /**
     * check slug is already exist or not
     *
     * @param model
     * @param slug
     * @param id
     * @param type
     * @param callback
     * @param i
     */
    checkNameExistence : function (model, name, id, type, res, callback) {
        var query = [];
        name = name.toLowerCase();
        var nameValue = name;

        switch(type) {
            case 'area' :
                query.push({"areas.slug" : nameValue});
                (id != null && id != '') ? query.push({'areas._id': { $ne: id }}) : '';
                break;

            case 'todo' :
                query.push({"listing.slug" : nameValue});
                (id != null && id != '') ? query.push({'listing._id': { $ne: id }}) : '';
                break;

            default :
                query.push({'name' : nameValue});
                (id != null && id != '') ? query.push({'_id': { $ne: id }}) : '';
                break;
        }
        model.findOne({$and : query }, function(error, data) {
            if (!data) {
                callback(nameValue);
            } else {
                res.send({ status : false, msg : "This is already taken"})
            }
        });
    }
};

module.exports = util;
