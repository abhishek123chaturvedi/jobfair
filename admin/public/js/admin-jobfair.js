/**
 * Created by anshul on 22/10/15.
 */


var AdminJobfair = function() {

    //adminJobfair class

    this.bindEvents();
};

AdminJobfair.prototype = {


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
                        $('#addCountryModal').modal('hide');
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

        $('.update-status-country').click(function(e){
            var data = {
                id : $(this).attr('data-id')
            };
            $.ajax({
                url: '/update-country-status-by-id',
                data : data,
                type: 'post',
                success: function (res) {
                    if(typeof res.status !== "undefined" && res.status == true) {
                        location.reload();
                    } else {
                        alert(res.msg);
                    }
                }
            });
        });

        $('.delete-country').click(function(e){
            var data = {
                id : $(this).attr('data-id')
            };
            $.ajax({
                url: '/delete-country-by-id',
                data : data,
                type: 'post',
                success: function (res) {
                    if(typeof res.status !== "undefined" && res.status == true) {
                        location.reload();
                    } else {
                        alert(res.msg);
                    }
                }
            });
        });

        /* state jquery*/

        $('.add-state').click(function(e){
            e.preventDefault();
            $("#addStateModal").modal({
                show: true
            });
            $.ajax({
                url: '/get-country-listing-for-state',
                type: 'get',
                success: function (res) {
                    if(typeof res.status !== "undefined" && res.status == true) {
                        var html = '';
                        for(var i = 0; i<res.data.length; i++) {
                            html  += '<option value="'+res.data[i]._id+'">'+res.data[i].name+'</option>';
                        }
                        $(".country-dropdown-for-state").append(html);
                    } else {
                        alert(res.msg)
                    }
                }
            });
        });

        $('#addState').submit(function(e){
            e.preventDefault();
            var data = {
                name : $(".state_name").val(),
                country_id : $('.country-dropdown-for-state').find("option:selected").val()
            };

            $.ajax({
                url: '/add-state-details',
                data : data,
                type: 'post',
                success: function (res) {
                    if(typeof res.status !== "undefined" && res.status == true) {
                        $('#addStateodal').modal('hide');
                        location.reload();
                    } else {
                        alert(res.msg)
                    }
                }
            });
        });

        $('.edit-state').click(function(e){
            e.preventDefault();
            var data = {
                state_id : $(this).attr('data-id')
            };
            $.ajax({
                url: '/get-state-details',
                data : data,
                type: 'post',
                success: function (res) {
                    if(typeof res.status !== "undefined" && res.status == true) {

                    } else {
                        alert(res.msg)
                    }
                }
            });
            $("#editStateModal").modal({
                show: true
            });
        });
    }
};