/*
 fileName: area.js
 description: process Tourist Area
 */

// Code included inside $( document ).ready() will only run once the page Document Object Model (DOM) is ready for JavaScript code to execute
$(document).ready(function () {
    searchArea_jingqu(baseURL);
});

function deployAreaConfirm_jingqu(id, type) {
    $('#current-areastatus').val(type);
    type = (type == 1) ? '线路' : '景区'
    $('#custom-confirm-deploy-view').show();
    $('#deployMessage').html("是否要设为热门" + type + "?");
    $('#current-areaid').val(id);
}

function undeployAreaConfirm_jingqu(id, type) {
    $('#current-areastatus').val(type);
    type = (type == 1) ? '线路' : '景区'
    $('#custom-confirm-deploy-view').show();
    $('#deployMessage').html("是否要取消热门" + type + "?");
    $('#current-areaid').val('');
}

function deployArea_jingqu(url, type) {

    $('#custom-confirm-deploy-view').hide();
    if (type == 1) { // if ok button clicked
        var status = parseInt($('#current-areastatus').val())
        if (status == 1)//course
            var city = {city_course: $('#current-areaid').val(),type:'0'};
        else //area
            var city = {city_area: $('#current-areaid').val(),type:'0'};

        $.ajax({
            type: 'post',
            url: url + 'address_inside/updateHotCity',
            dataType: 'json',
            data: {city: JSON.stringify(city)},
            success: function (res) {
                console.log(res);
                if (res.status == true) {
                    searchArea_jingqu(baseURL);
                } else {
                    alert('failed!');
                    console.log(res.data);
                }
            }
        });
    }
}

function searchArea_jingqu(url) {

    var area_name = $('#area_name').val();
    var provinceText = $('#provinceName').html();
    var address = provinceText;
    var pageId=$('#page_Id').html();
    if(pageId == '国外地区')
        url=url+'address_outside/custom_listing'
    else
        url=url+'address_inside/custom_listing'

    $.ajax({
        type: 'post',
        url: url ,
        dataType: 'json',
        data: {address: address, name:area_name},
        success: function (res) {
            if (res.status == 'success') {

                $('#content_tbl').html(res.data);

            } else {
                alert('search failed!');
                console.log(res.data);
            }
        }
    });
}


