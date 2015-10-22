/**
 * Created by anshul on 22/10/15.
 */


var adminJobfair = function() {

    //adminPrinta class

    this.bindEvents();
};

adminJobfair.prototype = {


    bindEvents: function() {

        $('.add-country').click(function(e){
            alert("hi");
        });
    }
};