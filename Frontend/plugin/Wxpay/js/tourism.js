/**
 * Created by Administrator on 8/8/2017.
 */
var tourism_list = [];

var bPhoneverified = 0;
var bAuthorizing = 0;
var phone_num = "";


$(function(){
    bPhoneverified = parseInt(localStorage.getItem('phone_verified'));
    if(bPhoneverified == 0)
        localStorage.setItem('phone_number', "");
    else
        phone_num = localStorage.getItem('phone_number');

    check_authCode();
    resize_tourism_course();

    //cur_tourism_id = sessionStorage.getItem('targetid');
    if(cur_tourism_id == "0")   return;
    sessionStorage.removeItem('cur_scenic_area');
    // data request
    getTourismCoursesFromServer();
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
    if( tourism_list == null) {
        // show error message
        $('#tourism-body').html('<div style="text-align: center; color: red;margin-top: 100px">旅游线路不存在！</div>');
        return;
    }
    // show individual tourism data
    for( var i = 0; i < tourism_list.length; i++){
        if( tourism_list[i]['id'] == cur_tourism_id){
            showcourse(i);
            return;
        }
    }
    // show error message
    $('#tourism-body').html('<div style="text-align: center; color: red;margin-top: 100px">这个旅游线路不存在！</div>');
}

function showcourse(index){
    // initialize dialog
    document.title = tourism_list[index]['name'];
    weixinConfigure();
    
    var content_html = "";

    var total_cost = tourism_list[index]['cost'];

    for( var i = 0; i < tourism_list[index]['scenic_areas'].length; i++)
    {
        // loading the infos of the current scenic area
        var attractionCnt = tourism_list[index]['scenic_areas'][i]['attractionCnt'];
        content_html += '<div class="course_column" onclick="showAreaOfCourse('+tourism_list[index]['scenic_areas'][i]['id'] +')">';
        content_html += '   <h5>景区 '+(i+1)+' : ' + tourism_list[index]['scenic_areas'][i]['name']+' ( '+attractionCnt+'个景点 )</h5>';
        content_html += '   <i class="fa fa-fw fa-angle-right" style="float: right; margin: 0px 5px; margin-top: -22px; opacity: 0.3;"></i>';
        content_html += '</div>';
    }

    if(total_cost == 0){
        content_html += '<div style="text-align: center; color: red;margin-top: 100px">您已解锁旅游线路，点击景区开启导游之旅！</div>';
    }else {
        content_html += '<div class="btn-course" onclick="onlinePayment(' + index + ')"><h5>支付' + total_cost.toFixed(2) + '元，解锁线路</h5></div>';
        content_html += '<div class="btn-course-auth" onclick="buy_with_authCode(' + index + ')"><h5>输入授权码</h5></div>';
    }
    $('#tourism-body').html(content_html);


    var body_height = $('#tourism-body').css('height');
    var client_height = document.body.clientHeight;
    var dheight = ( parseInt(client_height) - parseInt(body_height) - 60)/ 2;
    $('.btn-course').css({'margin-top': dheight });
}

// if select a scenic area of the current tourism course, shows the scenic area.
function showAreaOfCourse(area_id){
    sessionStorage.setItem('explain_check', 0);
    var new_scenic_id = area_id;
    sessionStorage.setItem('new_scenic_id', new_scenic_id);

    var geo_scenic_id = sessionStorage.getItem('geo_scenic_id');
    if( geo_scenic_id == new_scenic_id){
        sessionStorage.setItem('movable', 0);
    }else{
        sessionStorage.setItem('movable', 1);
    }
    shopid = sessionStorage.getItem('shopid');
    window.location.href = 'home.php?shopid=' + shopid + '&type=2&targetid=' + new_scenic_id;
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
    var real_cost = cur_tourism['cost'];// * cur_tourism['discount_rate'];

    var payment_data = {
        type : 1,      // 1: tourism course, 2: scenic area,  3: attraction, 4: authorize code
        id : cur_tourism['id'],
        name: cur_tourism['name'],
        image: cur_tourism['image'],
        cost: cur_tourism['cost'],
        real_cost: real_cost
    };

    sessionStorage.setObject('payment_data', payment_data);

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
    //$('#app_header').css({width:width});

    // resize map region
    var map_top = 0; //document.getElementById('app_header').clientHeight;
    var map_width = document.getElementById('content').clientWidth;
    var map_height = document.body.clientHeight - map_top;
    $('#container').css({display:'block',width:map_width, height:map_height, top:map_top, bottom:0});

    var content_margin=(document.body.clientWidth-width)/2;
    $('#back_img').css({position:'fixed',left: content_margin+10});
}
