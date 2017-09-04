/**
 * Created by Administrator on 8/8/2017.
 */
var tourism_list = [];
var tourismColors = ['#90d4e7','#fc8797','#fdc029','#01c8cf','#acacac'];
var cur_tourism_id;

var bPhoneverified = 0;
var bAuthorizing = 0;
var phone_num = "";


$(function(){
    bPhoneverified = parseInt(sessionStorage.getItem('phone_verified'));
    if(bPhoneverified == 0)
        localStorage.setItem('phone_number', "");
    else
        phone_num = localStorage.getItem('phone_number');

    resize_tourism_course();
    getTourismCoursesFromServer();
    //loadTourismsFromLocalstorage();
});

window.addEventListener('resize', function(event){
    resize_tourism_course();
});

function back(){
    sessionStorage.removeItem('cur_tourism_id');
    sessionStorage.removeItem('cur_tourism_cost');

    history.back();
}

function loadTourismsFromLocalstorage(){
    tourism_list = sessionStorage.getObject('tourism_courses');
    if(tourism_list === null)
        getTourismCoursesFromServer();
    else
        display_tourism_data();
}

function display_tourism_data(){
    //------- show the tourism list
    // show the header information
    var cnt = 0;
    if( tourism_list != null) cnt = tourism_list.length;
    $('#tourismlist-header').find('h4').html('旅游线路 (共'+ cnt+'条线路)');
    // show individual tourism data
    var content_html = "";
    $('#tourismlist-body').html(content_html);
    if(tourism_list == null) return;

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
    var total_cost = tourism_list[index]['cost']*tourism_list[index]['discount_rate'];
    for( var i = 0; i < tourism_list[index]['scenic_areas'].length; i++)
    {
        // loading the infos of the current scenic area
        var attractionCnt = tourism_list[index]['scenic_areas'][i]['attractionCnt'];
        content_html += '<div class="course_column" onclick="showAreaOfCourse('+tourism_list[index]['scenic_areas'][i]['id'] +')"><h5>景区 '+(i+1)+' : ' + tourism_list[index]['scenic_areas'][i]['name']+' ( '+attractionCnt+'个景点 )</h5></div>';
    }
    content_html += '<div class="btn-custom btn-course" onclick="onlinePayment('+ index+')"><h5>支付' + total_cost.toFixed(2) +'元，解锁线路</h5></div>';
    content_html += '<div class="btn-custom btn-course" onclick="buy_with_authCode('+index+')"><h5>输入授权码</h5></div>';

    $('#buy_course_content').html(content_html);
    $('#buy_course').show();
}

// if select a scenic area of the current tourism course, shows the scenic area.
function showAreaOfCourse(area_id){
    var new_scenic_id = area_id;
    sessionStorage.setItem('new_scenic_id', new_scenic_id);

    var geo_scenic_id = sessionStorage.getItem('geo_scenic_id');
    if( geo_scenic_id == new_scenic_id){
        sessionStorage.setItem('movable', 0);
    }else{
        sessionStorage.setItem('movable', 1);
    }
    window.location.href = '../index.php';
}

// online payment
function  onlinePayment(index) {
    // check phone verification state
    if(bPhoneverified == 0) {
        $('#buy_course').hide();
        bAuthorizing = 0;
        verifyPhone();
        return;
    }

    var cur_tourism = tourism_list[index];
    // calculate discount price
    var real_cost = cur_tourism['cost'] * cur_tourism['discount_rate'];

    var payment_data = {
        type : 1,      // 1: tourism course, 2: scenic area,  3: attraction, 4: authorize code
        id : cur_tourism['id'],
        name: cur_tourism['name'],
        image: cur_tourism['image'],
        cost: cur_tourism['cost'],
        real_cost: real_cost
    };

    sessionStorage.setObject('payment_data', payment_data);

    //window.location.href = '../views/purchase.html';
    preparePayment();
}

function  buy_with_authCode(index){
    var cur_tourism = tourism_list[index];

    $('#buy_course').hide();

    // check phone verification state
    if(bPhoneverified == 0) {
        bAuthorizing = 1;
        verifyPhone();
        return;
    }

    $('#code_auth').show();
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

    //width = 640*scale;
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
