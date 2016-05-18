/**
 * Created by Abhishek Chaturvedi on 22/10/15.
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

                        $('#editCountryModal').modal({
                            show: 'true'
                        });
                    } else {
                        alert(res.msg);
                    }
                }
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
                country_id : $(this).attr('data-id')
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
            $(".country-dropdown-for-state").find('option').remove();
            $("#addStateModal").modal({
                show: true
            });
            $.ajax({
                url: '/get-country-listing-for-state',
                type: 'get',
                success: function (res) {
                    if(typeof res.status !== "undefined" && res.status == true) {
                        var html = '';
                            html += '<option value="">Select Country</option>';
                        for(var i = 0; i<res.data.length; i++) {
                            html  += '<option value="'+res.data[i]._id+'">'+res.data[i].name+'</option>';
                        }
                        console
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

        $('.edit-state').click(function(e) {
            e.preventDefault();
            $(".country-dropdown-for-edit-state").find('option').remove();
            var data = {
                state_id : $(this).attr('data-id')
            };
            $.ajax({
                url: '/get-state-details-by-id',
                data : data,
                type: 'post',
                success: function (res) {
                    if(typeof res.status !== "undefined" && res.status == true) {
                        $('.edit_state_id').val(res.state._id);
                        $('.edit_state_name').val(res.state.name);
                        var html = "";
                        if(typeof res.country !== "undefined" && res.country !== null) {
                            html += '<option value="">Select Country</option>';
                            for(var i = 0; i<res.country.length; i++) {
                                if(res.state.country_id._id == res.country[i]._id ) {
                                    html  += '<option selected="selected" value="'+res.country[i]._id+'">'+res.country[i].name+'</option>';
                                } else {
                                    html  += '<option value="'+res.country[i]._id+'">'+res.country[i].name+'</option>';
                                }

                            }
                        }
                        $(".country-dropdown-for-edit-state").append(html);
                        $("#editStateModal").modal({
                            show: true
                        });
                    } else {
                        alert(res.msg)
                    }
                }
            });
        });

        $("#editState").submit(function(e) {
            e.preventDefault();
            var data = {
                id : $(".edit_state_id").val(),
                name : $(".edit_state_name").val(),
                country_id : $('.country-dropdown-for-edit-state').find("option:selected").val()
            };
            $.ajax({
                url: '/update-state-details-by-id',
                data : data,
                type: 'post',
                success: function (res) {
                    if(typeof res.status !== "undefined" && res.status == true) {
                        $('#editState').modal('hide');
                        location.reload();
                    } else {
                        alert(res.msg);
                    }
                }
            });
        });

        $('.update-status-state').click(function(e){
            var data = {
                id : $(this).attr('data-id')
            };
            $.ajax({
                url: '/update-state-status-by-id',
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

        $('.delete-state').click(function(e){
            var data = {
                id : $(this).attr('data-id')
            };
            $.ajax({
                url: '/delete-state-by-id',
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


        /* City listing */

        $('.add-city').click(function(e){
            $("#addCityModal").modal({
                show: true
            });
            $(".stateDropdown").hide();
            $(".country-dropdown-for-city").find('option').remove();
            $.ajax({
                url: '/get-country-listing-for-state',
                type: 'get',
                success: function (res) {
                    if(typeof res.status !== "undefined" && res.status == true) {
                        var html = '<option value="">Select Country</option>';
                        for(var i = 0; i<res.data.length; i++) {
                            html  += '<option value="'+res.data[i]._id+'">'+res.data[i].name+'</option>';
                        }
                        $(".country-dropdown-for-city").append(html);
                    } else {
                        alert(res.msg)
                    }
                }
            });
        });

        $('.country-dropdown-for-city ,.country-dropdown-for-edit-city').change(function(e) {
            e.preventDefault();
            var data = {
                country_id : $('.country-dropdown-for-city , .country-dropdown-for-edit-city').find("option:selected").val()
            };
            $(".state-dropdown-for-city , .state-dropdown-for-edit-city").find('option').remove();
            $.ajax({
                url: '/get-state-listing-by-country-id',
                type: 'get',
                data: data,
                success: function (res) {
                    if(typeof res.status !== "undefined" && res.status == true) {
                        $(".stateDropdown").show();
                        var html = '';
                            html += '<option value="">Select State</option>';
                        for(var i = 0; i<res.data.length; i++) {
                            html  += '<option value="'+res.data[i]._id+'">'+res.data[i].name+'</option>';
                        }
                        $(".state-dropdown-for-city ,.state-dropdown-for-edit-city").append(html);
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
                country_id : $('.country-dropdown-for-city').find("option:selected").val(),
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
            e.preventDefault();
            var data = {
                city_id : $(this).attr('data-id')
            };
            $(".country-dropdown-for-edit-city").find('option').remove();
            $(".state-dropdown-for-edit-city").find('option').remove();
            $.ajax({
                url : '/get-city-detail-by-id',
                type : 'post',
                data : data,
                success : function(res) {
                    if(typeof res.status !== 'undefined' && res.status != false){
                        $('.edit_city_id').val(res.city._id);
                        $('.edit_city_name').val(res.city.name);

                        if(typeof res.country !== "undefined" && res.country !== null) {
                            var html = '';
                            html += '<option value="">Select Country</option>';
                            for(var i = 0; i<res.country.length; i++) {
                                if(res.city.country_id == res.country[i]._id ) {
                                    html  += '<option selected="selected" value="'+res.country[i]._id+'">'+res.country[i].name+'</option>';
                                } else {
                                    html  += '<option value="'+res.country[i]._id+'">'+res.country[i].name+'</option>';
                                }
                            }
                            $('.country-dropdown-for-edit-city').append(html);

                            if(typeof res.state !== "undefined" && res.state !== null) {
                                var stateHtml = '';
                                stateHtml += '<option value="">Select State</option>';
                                for(var i = 0; i<res.state.length; i++) {
                                    if(res.city.state_id == res.state[i]._id ) {
                                        stateHtml  += '<option selected="selected" value="'+res.state[i]._id+'">'+res.state[i].name+'</option>';
                                    } else {
                                        stateHtml  += '<option value="'+res.state[i]._id+'">'+res.state[i].name+'</option>';
                                    }
                                }
                            }
                            $('.state-dropdown-for-edit-city').append(stateHtml);
                        }
                        $('#editCityModal').modal({
                            show: 'true'
                        });
                    } else {
                        alert(res.msg);
                    }
                }

            });
        });

        $("#editCity").submit(function(e) {
            e.preventDefault();
            var data = {
                id : $(".edit_city_id").val(),
                name : $(".edit_city_name").val(),
                country_id : $('.country-dropdown-for-edit-city').find("option:selected").val(),
                state_id : $('.state-dropdown-for-edit-city').find("option:selected").val()
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

        /**
        * CRUD of area start here
        */

        $('.add-area').click(function(e){
            e.preventDefault();
            $(".city-dropdown-for-area").find('option').remove();
            $("#addAreaModal").modal({
                show: true
            });
            $.ajax({
                url: '/get-city-listing-for-area',
                type: 'get',
                success: function (res) {
                    if(typeof res.status !== "undefined" && res.status == true) {
                        var html = '';
                            html += '<option value="">Select City</option>';
                        for(var i = 0; i<res.data.length; i++) {
                            html  += '<option value="'+res.data[i]._id+'">'+res.data[i].name+'</option>';
                        }

                        $(".city-dropdown-for-area").append(html);
                    } else {
                        alert(res.msg)
                    }
                }
            });
        });

        $('#addArea').submit(function(e){
            e.preventDefault();
            var data = {
                name : $(".area_name").val(),
                city_id : $('.city-dropdown-for-area').find("option:selected").val()
            };
            $.ajax({
                url: '/add-area-details',
                data : data,
                type: 'post',
                success: function (res) {
                    if(typeof res.status !== "undefined" && res.status == true) {
                        $('#addAreaModal').modal('hide');
                        location.reload();
                    } else {
                        alert(res.msg)
                    }
                }
            });
        });

        $('.edit-area').click(function(e) {
            e.preventDefault();
            $(".city-dropdown-for-edit-area").find('option').remove();
            var data = {
                area_id : $(this).attr('data-id')
            };
            $.ajax({
                url: '/get-area-details-by-id',
                data : data,
                type: 'post',
                success: function (res) {
                    if(typeof res.status !== "undefined" && res.status == true) {
                        $('.edit_area_id').val(res.state._id);
                        $('.edit_area_name').val(res.state.name);
                        var html = "";
                        if(typeof res.city !== "undefined" && res.city !== null) {
                            html += '<option value="">Select City</option>';
                            for(var i = 0; i<res.city.length; i++) {
                                if(res.area.city_id._id == res.city[i]._id ) {
                                    html  += '<option selected="selected" value="'+res.city[i]._id+'">'+res.city[i].name+'</option>';
                                } else {
                                    html  += '<option value="'+res.city[i]._id+'">'+res.city[i].name+'</option>';
                                }

                            }
                        }
                        $(".city-dropdown-for-edit-area").append(html);
                        $("#editStateModal").modal({
                            show: true
                        });
                    } else {
                        alert(res.msg)
                    }
                }
            });
        });

        $("#editArea").submit(function(e) {
            e.preventDefault();
            var data = {
                id : $(".edit_area_id").val(),
                name : $(".edit_area_name").val(),
                country_id : $('.city-dropdown-for-edit-area').find("option:selected").val()
            };
            $.ajax({
                url: '/update-area-details-by-id',
                data : data,
                type: 'post',
                success: function (res) {
                    if(typeof res.status !== "undefined" && res.status == true) {
                        $('#editArea').modal('hide');
                        location.reload();
                    } else {
                        alert(res.msg);
                    }
                }
            });
        });

        $('.update-status-area').click(function(e){
            var data = {
                id : $(this).attr('data-id')
            };
            $.ajax({
                url: '/update-area-status-by-id',
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

        $('.delete-area').click(function(e){
            var data = {
                id : $(this).attr('data-id')
            };
            $.ajax({
                url: '/delete-area-by-id',
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
