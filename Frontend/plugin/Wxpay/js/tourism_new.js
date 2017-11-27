/**
 * Created by Administrator on 10/13/2017.
 */
var tourism_list = [];

var bPhoneverified = 0;
var bAuthorizing = 0;
var phone_num = "";
var cur_tourism_course = null;

$(function () {
    bPhoneverified = parseInt(localStorage.getItem('phone_verified'));
    if (bPhoneverified != 1) {
        phone_num = 'no phone number';
        localStorage.setItem('phone_number', "");
        localStorage.setItem('phone_verified', 0);
    } else
        phone_num = localStorage.getItem('phone_number');

    check_authCode();
    resize_tourism_course();

    //cur_tourism_id = sessionStorage.getItem('targetid');
    if (cur_tourism_id == "0") return;
    sessionStorage.removeItem('cur_course');

    getTourismCourseInfo(cur_tourism_id);

    weixinConfigure();
});

window.addEventListener('resize', function (event) {
    resize_tourism_course();
});

function display_tourism_data() {
    //------- show the tourism list
    cur_tourism_course = sessionStorage.getObject('cur_course');
    // show the header information
    if (cur_tourism_course == null) {
        // show error message
        $('#tourism-body').html('<div style="text-align: center; color: red;margin-top: 100px">这个旅游线路不存在！</div>');
    } else {
        // show individual tourism data

        //showcourse();

         if (!is_weixin()) {
             if (sessionStorage.getItem('loadstate') != '1') {
                 setTimeout(location.reload(), 1000);
                 sessionStorage.setItem('loadstate', 1);
             } else {
                 //sessionStorage.removeItem('loadstate');
                 generatePoints(cur_tourism_course['scenic_areas'].length);
                 showcourse();
             }
         } else {
             generatePoints(cur_tourism_course['scenic_areas'].length);
             showcourse();
        //     if (sessionStorage.getItem('loadstate') != '1') {
        //         setTimeout(showcourse, 1000);
        //         sessionStorage.setItem('loadstate', 1);
        //     } else {
        //         //sessionStorage.removeItem('loadstate');
        //         showcourse();
        //     }
         }
    }
    // show error message
}

function showcourse() {
    // initialize dialog
    document.title = cur_tourism_course['title'];
    //weixinConfigure1();

    var width = parseFloat($('#home_img').css('width'));
    var height = parseFloat($('#home_img').css('height'));

    var content_html = "";
    var total_cost = cur_tourism_course['cost'];

    for (var i = 0; i < cur_tourism_course['scenic_areas'].length; i++) {
        if( (i >2 && i < 6) || (i>13 && i <16))
            content_html += '<span style="position:absolute;font-size:18px; color: #266681; font-family: \'MyWebFont\', Fallback,  DFWawaW5-GB5 ;left:' + ( mPoints[2 * i] + dr + 5) + 'px; top:' + (mPoints[2 * i + 1] - dr / 2) + 'px;"';
        else
            content_html += '<span style="position:absolute;font-size:18px; color: #266681; font-family: \'MyWebFont\', Fallback,  DFWawaW5-GB5 ;right:' + (width - mPoints[2 * i] + dr + 5) + 'px; top:' + (mPoints[2 * i + 1] - dr / 2) + 'px;"';
        content_html += '>' + cur_tourism_course['scenic_areas'][i]['name'] + '</span>';

        content_html += '<img src="' + cur_tourism_course['scenic_areas'][i]['image'] + '" onclick="showAreaOfCourse(' + i + ','+ cur_tourism_course['scenic_areas'][i]['id'] + ')"';
        content_html += ' style="position:absolute; border-radius:50%;border: 3px solid white; width:' + (2 * dr) + 'px; height:' + (2 * dr) + 'px; left:' + (mPoints[2 * i] - dr) + 'px; top:' + (mPoints[2 * i + 1] - dr) + 'px;">';
    }

    $('#tourism-body').css('height', height + 'px');
    $('#tourism-body').html(content_html);

    content_html = '';
    if (total_cost == 0) {
        $('#btn_status').css('display', 'block');
    } else {
        $('#btn_status').css('display', 'none');
        content_html += '<div class="btn-course" onclick="onlinePayment()" style="padding: 1px 10px; margin: 12px 15px;"><h5>支付' + total_cost.toFixed(2) + '元解锁线路</h5></div>';
        content_html += '<div class="btn-course-auth" onclick="buy_with_authCode()" style="padding: 1px 10px; margin: 12px 15px;"><h5>输入授权码</h5></div>';
        $('#btnGroup').html(content_html);
    }
    $('home_img').css('height', (mPoints[2*cur_tourism_course['scenic_areas'].length+1] + 50)+'px');
}

// if select a scenic area of the current tourism course, shows the scenic area.
function showAreaOfCourse(index, area_id) {
    sessionStorage.setItem('explain_check', 0);
    var new_scenic_id = area_id;
    sessionStorage.setItem('new_scenic_id', new_scenic_id);

    var geo_scenic_id = sessionStorage.getItem('geo_scenic_id');
    if (geo_scenic_id == new_scenic_id) {
        sessionStorage.setItem('movable', 0);
    } else {
        sessionStorage.setItem('movable', 1);
    }
    shopid = sessionStorage.getItem('shopid');
    window.location.href = 'home.php?shopid=' + shopid + '&type=2&targetid=' + new_scenic_id + '&map_type=' + cur_tourism_course['scenic_areas'][index]['map_type'];
}

// online payment
function onlinePayment() {


    var cur_tourism = cur_tourism_course;
    // calculate discount price
    var real_cost = cur_tourism['cost'];// * cur_tourism['discount_rate'];

    var payment_data = {
        type: 1,      // 1: tourism course, 2: scenic area,  3: attraction, 4: authorize code
        id: cur_tourism['id'],
        name: cur_tourism['name'],
        image: cur_tourism['image'],
        cost: cur_tourism['cost'],
        real_cost: real_cost
    };

    sessionStorage.setObject('payment_data', payment_data);
    // check phone verification state
    if (bPhoneverified != 1) {
        $('#buy_course').hide();
        bAuthorizing = 0;
        sessionStorage.setItem('purchage_state', 2);
        verifyPhone();
        return;
    }
    preparePayment();
}

function buy_with_authCode() {
    var cur_tourism = cur_tourism_course;

    $('#buy_course').hide();

    // check phone verification state
    if (bPhoneverified == 0) {
        bAuthorizing = 1;
        verifyPhone();
        return;
    }

    $('#code_auth').show();
}

function resize_tourism_course() {
    initRatio = getDevicePixelRatio();
    var ratio = getDevicePixelRatio() / initRatio;
    var width = document.body.clientWidth
        || document.documentElement.clientWidth
        || window.innerWidth;

    var height = document.body.clientHeight
        || document.documentElement.clientHeight
        || window.innerHeight;
    var scale = Math.min(width / 640, height / 1010) * ratio;

    //width = 640*scale;
    $('#content').css({width: width, height: height});
    //$('#app_header').css({width:width});

    // resize map region
    var map_top = 0; //document.getElementById('app_header').clientHeight;
    var map_width = document.getElementById('content').clientWidth;
    var map_height = document.body.clientHeight - map_top;
    $('#container').css({display: 'block', width: map_width, height: map_height, top: map_top, bottom: 0});

    var content_margin = (document.body.clientWidth - width) / 2;
    //$('#back_img').css({position:'fixed',left: content_margin+10});

    var width = parseFloat($('#home_img').css('width'));
    var height = parseFloat($('#home_img').css('height'));

    $('#course_canvas').attr('height', height);
    $('#course_canvas').attr('width', width);
}
