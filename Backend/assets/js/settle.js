/*
 fileName: shop.js
 description: process Shop
 */

// Code included inside $( document ).ready() will only run once the page Document Object Model (DOM) is ready for JavaScript code to execute
$(document).ready(function () {

});

// Search course on Course List Page
function searchBuyOrder(url) {
    var searchType = $("#searchType :selected").val();
    var name = $('#searchName').val();
    var stDate = $('#startDate').val();
    var enDate = $('#endDate').val();
    name = name == '' ? 'ALL' : name;
    stDate = stDate == '' ? '0' : stDate;
    enDate = enDate == '' ? '0' : enDate;

    location.href = url + 'settlebuyListing/' + searchType + '/' +
        name + '/' + stDate + '/' + enDate;
}

// Search course on Course List Page
function searchAuthOrder(url) {
    var searchType = $("#searchTypeAuth :selected").val();
    var name = $('#searchNameAuth').val();
    var stDate = $('#startDateAuth').val();
    var enDate = $('#endDateAuth').val();
    name = name == '' ? 'ALL' : name;
    stDate = stDate == '' ? '0' : stDate;
    enDate = enDate == '' ? '0' : enDate;

    location.href = url + 'settleorderListing/' + searchType + '/' +
        name + '/' + stDate + '/' + enDate;
}

// Search course on Course List Page
function authDetail(url) {
    var name = $('#searchName').val();
    var status = $('#searchStatus :selected').val();
    name = name == '' ? 'all' : name;

    location.href = url + 'authDetail/' + name + '/' + status;
}

// Search course on Course List Page
function authOrderItem(url, id) {
    location.href = url + 'authOrderDetail/' + id;
}

// Search course on Course List Page
function addMoney(url) {
    var money = $('#auth-count').val();
    var id = $('#savingId').html();
    location.href = url + 'authAdd/' + money + '/' + id;
}

//return previos page
function showMoney() {
    $('#custom-generate-auth-view').hide();
    $('#custom-generate-auth-count-view').show();
}

//return previos page
function showSelect(id) {
    $('#custom-generate-auth-view').show();
    $('#savingId').html(id);
}

//return previos page
function cancel(url) {
    if (url == '')
        window.history.back();
    else
        location.href = url + 'settlemanage';
}