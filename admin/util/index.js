/**
 * Created by anshul on 22/10/15.
 */
var config = require('../config/config');

var util = {
    setSlug : function(value) {
        var string = (value.trim().replace(/[^a-z0-9]+/gi, '-')).toLowerCase();
        var slug = (string.trim().replace(/^-+|-+$/gi,'')).toLowerCase();
        return slug;
    },


    /**
     * check nameValue is already exist or not
     */

    checkNameExistence : function (model, name, id, type, res, callback) {
        var query = [];
        var nameValue = name;

        switch(type) {
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
                res.send({ status : false, msg : "This "+type+" is already taken"});
                return;
            }
        });
    },

    /**
     * checkSlugExistence
     */

     checkSlugExistence : function(model, slug, id, type, callback, i) {
         var query = [];
         slug = slug.toLowerCase();
         var slugValue = slug;
         if (i != 0) {
             slugValue = slug+'-'+i;
         }

         switch(type) {
             case 'area' :
                 query.push({"areas.slug" : slugValue});
                 (id != null && id != '') ? query.push({'areas._id': { $ne: id }}) : '';
                 break;

             case 'todo' :
                 query.push({"listing.slug" : slugValue});
                 (id != null && id != '') ? query.push({'listing._id': { $ne: id }}) : '';
                 break;

             default :
                 query.push({'slug' : slugValue});
                 (id != null && id != '') ? query.push({'_id': { $ne: id }}) : '';
                 break;
         }
         model.findOne({$and : query }, function(error, data) {
             if (!data) {
                 callback(slugValue);
             } else {
                 util.checkSlugExistence(model, slug, id, type, callback, ++i);
             }
         });
     }
};

module.exports = util;
