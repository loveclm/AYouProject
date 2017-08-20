/*
 fileName: area.js
 description: process Tourist Area
 */

// Code included inside $( document ).ready() will only run once the page Document Object Model (DOM) is ready for JavaScript code to execute
$(document).ready(function () {

});

function deleteAreaConfirm(id) {
    $('#custom-confirm-delete-view').show();
    $('#current-areaid').val(id);
}

function deleteArea(url, type) {

    $('#custom-confirm-delete-view').hide();
    if (type == 1) {
        $.post(url + "api/Areas/remove/" + $('#current-areaid').val(), function (result) {
            location.href = url + 'area';
        });
    }
}

function deployAreaConfirm(id) {

    $('#custom-confirm-deploy-view').show();
    $('#current-areaid').val(id);
    $('#current-areastatus').val(1);
}

function undeployAreaConfirm(id) {

    $('#custom-confirm-deploy-view').show();
    $('#current-areaid').val(id);
    $('#current-areastatus').val(0);
}

function deployArea(url, type) {

    $('#custom-confirm-deploy-view').hide();
    if (type == 1) {

        var touristArea = {
            id: $('#current-areaid').val(),
            status: $('#current-areastatus').val()
        };

        $.post(url + "api/Areas/save/" + touristArea['id'], touristArea, function (result) {
            location.href = url + 'area';
        });
    }
}

function searchArea(url) {

    var name = $('#searchName').val();
    var address = $('#searchAddress :selected').val();
    var status = $('#searchStatus :selected').val();
    name = name == '' ? 'all' : name;
    location.href = url + 'area/listing/' + name + '/' + address + '/' + status;
}

function test_api() {
    var posi = [116.404845, 39.898345];
    var id = '21';
    var phone = '9890098988';
    $.ajax({
        type: 'POST',
        url: 'http://192.168.2.18/api/Areas/getAllAreaInfos',
        dataType: 'json',
        username: 'admin',
        password: '1234',
        data: {
            //'pos' : posi

            'id': id,
            'phone': phone
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

