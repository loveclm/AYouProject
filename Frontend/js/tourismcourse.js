/**
 * Created by Administrator on 8/8/2017.
 */
var tourism_list = [];
var tourismColors = ['#90d4e7','#fc8797','#fdc029','#01c8cf','#acacac'];
var cur_tourism_id;

$(function(){
    resize_tourism_course();
    loadTourismsFromLocalstorage();
});

window.addEventListener('resize', function(event){
    resize_tourism_course();
});

function back(){
    localStorage.removeItem('cur_tourism_id');
    localStorage.removeItem('cur_tourism_cost');

    history.back();
}

function loadTourismsFromLocalstorage(){
    tourism_list = localStorage.getObject('tourism_courses');
    if(tourism_list === null)
        getTourismCoursesFromServer();
    else
        display_tourism_data();
}

function display_tourism_data(){
    //------- show the tourism list
    // show the header information
    $('#tourismlist-header').find('h4').html('旅游线路 (共'+ tourism_list.length+'条线路)');
    // show individual tourism data
    var content_html = "";
    var curColor;
    for( var i = 0; i < tourism_list.length; i++){
        if(i > 3){
            curColor = tourismColors[4];
        }
        else{
            curColor = tourismColors[i];
        }
        content_html += '<div class="tourismlist_item" id="tourism_item'+ (i+1) +'" onclick="showcourse('+i+')">';
        content_html += '<div  style="background-color:' + curColor + '; float:left">'+(i+1)+'</div>';
        content_html += '<h5 style="float: left; padding-left:10px;">'+ tourism_list[i]['name'] +'</h5>';
        content_html += '<img src="../resource/image/more.png" style="float:right; padding:10px"></div>';
    }
    $('#tourismlist-body').html(content_html);
}

function showcourse(index){
    // initialize dialog
    $('#buy_course_title').find('h5').html(tourism_list[index]['name']);

    var content_html = "";
    var total_cost = tourism_list[index]['cost'];
    for( var i = 0; i < tourism_list[index]['scenic_areas'].length; i++)
    {
        // loading the infos of the current scenic area
        var attractionCnt = tourism_list[index]['scenic_areas'][i]['attractionCnt'];
        content_html += '<div class="course_column"><h5>景区 '+(i+1)+' : ' + tourism_list[index]['scenic_areas'][i]['name']+' ( '+attractionCnt+'个景点 )</h5></div>';
    }
    content_html += '<div class="btn-custom btn-course" onclick="onlinePayment('+ index+')"><h5>支付' + total_cost +'元，解锁线路</h5></div>';
    content_html += '<div class="btn-custom btn-course" onclick="buy_with_authCode('+index+')"><h5>输入授权码</h5></div>';

    $('#buy_course_content').html(content_html);
    $('#buy_course').show();
}

// online payment
function  onlinePayment(index) {
    var cur_tourism = tourism_list[index];
    // calculate discount price
    var real_cost = cur_tourism['cost'] * cur_tourism['discount_rate'];

    var payment_data = {
        type : 1,      // 1: tourism course, 2: scenic area,  3: attraction, 4: order
        id : cur_tourism['id'],
        name: cur_tourism['name'],
        image: cur_tourism['image'],
        cost: cur_tourism['cost'],
        real_cost: real_cost
    };

    localStorage.setObject('payment_data', payment_data);
    window.location.href = '../views/purchase.php';
}

function  buy_with_authCode(index){
    var cur_tourism = tourism_list[index];

    $('#buy_course').hide();
    $('#code_auth').show();
}

function OnCancelauthcodeVerify(){
    $('#code_auth').hide();
    $('#auth_code').val("");

    //downloading needed data
}

function OnConfirmauthCode(){
    /*  validate authorization code
    **  If authorization code don't exist in the order lists of backend, verification is fail.
     */
    var auth_code = $('#auth_code').val();
    if(auth_code == "")
    {
        alert('请输入授权码');
        return;
    }

    // send ajax request and receive ajax response and so process with the result of the backend
    // If verification is fail, maintain old state.
    /*
     $.ajax({
         type: 'GET',
         url: 'http://server/backend/dbmanage.php', //rest API url
         dataType: 'json',
         data: {func: 'function_name', info: res}, // set function name and parameters
         }).success(function(data){
             $('#code_auth').hide();
             // change attraction marks along information

         }).fail(function(){
             return;
     });
     */

    //return;
    // simulate progress
    $('#code_auth').hide();
    $('#auth_code').val("");
    // change attraction marks along information
}


function resize_tourism_course(){
    initRatio = getDevicePixelRatio();
    var ratio = getDevicePixelRatio()/initRatio;
    var width = document.body.clientWidth
        || document.documentElement.clientWidth
        || window.innerWidth;

    var height = document.body.clientHeight
        || document.documentElement.clientHeight
        || window.innerHeight;
    var scale = Math.min(width/640,height/1010) * ratio;

    width = 640*scale;
    $('#content').css({width:width, height:height});
    $('#app_header').css({width:width});

    // resize map region
    var map_top = document.getElementById('app_header').clientHeight;
    var map_width = document.getElementById('content').clientWidth;
    var map_height = document.body.clientHeight - map_top;
    $('#container').css({display:'block',width:map_width, height:map_height, top:map_top, bottom:0});

    var content_margin=(document.body.clientWidth-width)/2;
    $('#back_img').css({position:'fixed',left: content_margin+10});
    //$('#buy_course_dialog').css({width:map_width *0.9});
}
