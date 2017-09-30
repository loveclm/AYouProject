/*
 fileName: area.js
 description: process Tourist Area
 */

// Code included inside $( document ).ready() will only run once the page Document Object Model (DOM) is ready for JavaScript code to execute
$(document).ready(function () {
});

function deleteAreaConfirm_jingqu(id) {
    $('#custom-confirm-delete-view').show();
    $('#current-areaid').val(id);
}

function deleteArea_jingqu(url, type) {

    $('#custom-confirm-delete-view').hide();
    if (type == 1) {//if ok button clicked
        $.post(url + "api/Areas/remove/" + $('#current-areaid').val(), function (result) {
            if (result['status'] == false)
                window.alert(result['message']);
            else
                location.href = url + 'area';
        });
    }
}

function deployAreaConfirm_jingqu(id) {

    $('#custom-confirm-deploy-view').show();
    $('#deployMessage').html("是否要上架此景区?");
    $('#current-areaid').val(id);
    $('#current-areastatus').val(1);
}

function undeployAreaConfirm_jingqu(id) {

    $('#custom-confirm-deploy-view').show();
    $('#deployMessage').html("是否要下架此景区?");
    $('#current-areaid').val(id);
    $('#current-areastatus').val(0);
}

function deployArea_jingqu(url, type) {

    $('#custom-confirm-deploy-view').hide();
    if (type == 1) { // if ok button clicked

        var touristArea = {
            id: $('#current-areaid').val(),
            status: $('#current-areastatus').val()
        };

        $.post(url + "api/Areas/changeStatus/" + touristArea['id'], touristArea, function (result) {
            console.log(result);
            if (result['status'] == false)
                window.alert(result['message']);
            else
                location.href = url + 'area';
        });
    }
}

function searchArea_jingqu(url) {

    var name = $('#searchName').val();
    var status = $('#searchStatus :selected').val();
    name = name == '' ? 'all' : name;
    var provinceText = $('#provinceName').html();
    var cityText = $('#cityName').html();
    var districtText = $('#districtName').html();
    var address = provinceText + "_" + cityText + "_" + districtText;
//    location.href = url + 'area/listing/' + name + '/' + JSON.stringify(address) + '/' + status;

    $.ajax({
        type: 'post',
        url: url + 'area/custom_listing',
        dataType: 'json',
        data: {name: name, address: address, status: status},
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






function test_api375456() {
//    var posi = [116.404845, 39.898345];
    //var id = '00700100002';

    var phone = '18588209031';
    var cost = 1;
//    var type = '3';
    var id = '67013054569';
    var shopid = 26;
    var qr_areaid = 111;
    $.ajax({
        type: 'POST',
        //url: 'http://www.ayoubc.com/backend/api/Areas/getAllCourseInfos',
//        url: 'http://www.ayoubc.com/backend/api/Areas/getMyOrderInfos',
//        url: 'http://192.168.2.18/backend/api/Areas/setPayOrder',
//        url: 'http://192.168.2.18/backend/api/Areas/setAreaBuyOrder',
//        url: 'http://www.ayoubc.com/backend/api/Areas/setAreaBuyOrder',
        url: 'http://www.ayoubc.com/backend/api/Areas/setPayOrder',
        dataType: 'json',
        username: 'admin',
        password: '1234',
        data: {
            'id': id,
            'phone': phone,
            'cost': cost,
//            'type': type,
            'qr_areaid': qr_areaid,
            'shop': shopid,
//            'pos':posi
        },
        success: function (data, textStatus, jqXHR) {
            console.log(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Handle errors here
            console.log('ERRORS: ' + textStatus);
            // STOP LOADING SPINNER
        }
    });
}

function test_api() {
//    var posi = [116.404845, 39.898345];
    //var id = '00700100002';

    var data = [];
    var success = 0;
    var err = 0;
    var time0 = parseInt(Date.now()) / 1000;
    console.log('ajax start_time:' + time0+'s');
    for (var i = 0; i < 500; i++) {
        data[i] = {
            'name': Math.round(Math.random() * 500 + 1).toString(5),
            'phonenumber': Math.round(Math.random() * 500 + 1).toString(5),
            'password': Math.round(Math.random() * 500 + 1).toString(5),
            'address_1': '试听',
        }
//    }
    console.log(data.length);
        $.ajax({
            type: 'POST',
            url: 'http://192.168.2.203/backend/api/Areas/testingAjax',
            dataType: 'json',
            username: 'admin',
            password: '1234',
            data: {
                'data': JSON.stringify(data),
            },
            success: function (data, textStatus, jqXHR) {
                console.log(data);
                success++;
                var time1 = (parseInt(Date.now()) / 1000);

                console.log('end time:' + time1 +'s,\nduration:' + (time1-time0) + 's,success:' + success + ',failed:' + err);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                // Handle errors here
                console.log('ERRORS: ' + textStatus);
                // STOP LOADING SPINNER
                err++;
                var time1 = (parseInt(Date.now()) / 1000);

                console.log('end time:' + time1 +',duration:' + (time1-time0) + ',success:' + success + ',failed:' + err);
            }
        });
    }
}

function test_api2() {
    var posi = [116.404845, 39.898345];
    var id = '11';
    var phone = '24562456245';
    var cost = '00402700012';
    var type = '4';
    var code = '123skla8kso98alk29lkngb23ioemv56';
    $.ajax({
        type: 'GET',
//        url: 'http://116.196.83.125/test/example/jsapi.php',
        url: 'http://www.ayoubc.com/test/example/jsapi.php',
        dataType: 'json',
        username: 'admin',
        password: '1234',
        data: {
            'id': '3'
        },
        success: function (data, textStatus, jqXHR) {
            console.log(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Handle errors here
            console.log('ERRORS: ' + textStatus);
            // STOP LOADING SPINNER
        }
    });
}

