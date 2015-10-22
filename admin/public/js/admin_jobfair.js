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
            $("#addCountryModal").modal({
                show: true
            });
        });

        $('#addCountry').submit(function(e){
            e.preventDefault();
            var data = {
                name : $(".country_name").val()
            };

            $.ajax({
                url: '/add-country-details',
                data : data,
                type: 'post',
                success: function (res) {
                    if(typeof res.status !== "undefined" && res.status == true) {
                        $('#addVendor').modal('hide');
                        location.reload();
                    } else {
                        alert(res.msg)
                    }
                }
            });
        });

        $('.edit-country').click(function(e){
            var data = {
                country_id : $(this).attr('data-id')
            };
            $.ajax({
                url : '/get-country-detail-by-id',
                type : 'post',
                data : data,
                success : function(res) {
                    if(typeof res.status !== 'undefined' && res.status != false){
                        $('.edit_country_id').val(res.country._id);
                        $('.edit_country_name').val(res.country.name);
                    } else {
                        alert(res.msg);
                    }
                }

            });
            $('#editCountryModal').modal({
                show: 'true'
            });
        });

        $("#editCountry").submit(function(e) {
            e.preventDefault();
            var data = {
                id : $(".edit_country_id").val(),
                name : $(".edit_country_name").val()
            };
            $.ajax({
                url: '/update-country-details-by-id',
                data : data,
                type: 'post',
                success: function (res) {
                    if(typeof res.status !== "undefined" && res.status == true) {
                        $('#editCountry').modal('hide');
                        location.reload();
                    } else {
                        alert(res.msg);
                    }
                }
            });
        });


    }
};