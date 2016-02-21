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
            $(".country-dropdown-for-state").find('option').remove();
            $.ajax({
                url: '/get-country-listing-for-state',
                type: 'get',
                success: function (res) {
                    if(typeof res.status !== "undefined" && res.status == true) {
                        var html = '<option value="">Select Country</option>';
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


        /* City listing */

        $('.add-city').click(function(e){
            $("#addCityModal").modal({
                show: true
            });
            $(".stateDropdown").hide();
            $(".country-dropdown-for-state").find('option').remove();
            $.ajax({
                url: '/get-country-listing-for-state',
                type: 'get',
                success: function (res) {
                    if(typeof res.status !== "undefined" && res.status == true) {
                        var html = '<option value="">Select Country</option>';
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

        $('.country-dropdown-for-state').change(function() {
            var data = {
                country_id : $('.country-dropdown-for-state').find("option:selected").val()
            };
            $(".state-dropdown-for-city").find('option').remove();
            $.ajax({
                url: '/get-state-listing-by-country-id',
                type: 'get',
                data: data,
                success: function (res) {
                    if(typeof res.status !== "undefined" && res.status == true) {
                        $(".stateDropdown").show();
                        var html = '<option value="">Select State</option>';
                        for(var i = 0; i<res.data.length; i++) {
                            html  += '<option value="'+res.data[i]._id+'">'+res.data[i].name+'</option>';
                        }
                        $(".state-dropdown-for-city").append(html);
                    } else {
                        alert(res.msg)
                    }
                }
            });
        });

        $('#addCity').submit(function(e){
            e.preventDefault();
            var data = {
                name : $(".city_name").val(),
                state_id : $('.state-dropdown-for-city').find("option:selected").val()
            };

            $.ajax({
                url: '/add-city-details',
                data : data,
                type: 'post',
                success: function (res) {
                    if(typeof res.status !== "undefined" && res.status == true) {
                        $('#addCityModal').modal('hide');
                        location.reload();
                    } else {
                        alert(res.msg)
                    }
                }
            });
        });

        $('.edit-city').click(function(e){
            var data = {
                city_id : $(this).attr('data-id')
            };
            $.ajax({
                url : '/get-city-detail-by-id',
                type : 'post',
                data : data,
                success : function(res) {
                    console.log(res)
                    if(typeof res.status !== 'undefined' && res.status != false){
                        $('.edit_city_id').val(res.city._id);
                        $('.edit_city_name').val(res.city.name);
                    } else {
                        alert(res.msg);
                    }
                }

            });
            $('#editCityModal').modal({
                show: 'true'
            });
        });

        $("#editCity").submit(function(e) {
            e.preventDefault();
            var data = {
                id : $(".edit_city_id").val(),
                name : $(".edit_city_name").val()
            };
            $.ajax({
                url: '/update-city-details-by-id',
                data : data,
                type: 'post',
                success: function (res) {
                    if(typeof res.status !== "undefined" && res.status == true) {
                        $('#editCity').modal('hide');
                        location.reload();
                    } else {
                        alert(res.msg);
                    }
                }
            });
        });

        $('.update-status-city').click(function(e){
            var data = {
                id : $(this).attr('data-id')
            };
            $.ajax({
                url: '/update-city-status-by-id',
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

        $('.delete-city').click(function(e){
            var data = {
                id : $(this).attr('data-id')
            };
            $.ajax({
                url: '/delete-city-by-id',
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

    }
};
