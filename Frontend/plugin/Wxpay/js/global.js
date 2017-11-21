/**
 * Created by Administrator on 8/9/2017.
 */
var SERVER_URL = "http://www.ayoubc.com/backend/";
//var run_mode = "SIMULATE_MODE";   // This means system runs with simulate mode
var run_mode = "REALTIME_MODE";   // This means system runs with real time mode
var sms_code = "";
var shop_id = "";
var cur_scenic_data = null;

// this function is used to the information for course and area manage page
function getMenuAndAreaInfos(){
    $.ajax({
        type: 'POST',
        url: SERVER_URL + 'api/Areas/getFirstDatas', //rest API url
        dataType: 'json',
        //data: { 'phone': phone_num, 'id': order_id}, // set function name and parameters
        success: function (data) {
            if (data.status == false) {
                //alert('服务器错误');
                return;
            }else{
                sessionStorage.setObject('home_data', data.data);
                showHomeData();
            }
        },
        error: function (data) {
            //alert('服务器错误。');
        }
    });

}

// this function is used to get area or course information from string
function searchAreaInfos(type, str){
   var search_type = 0;
    if( type == 0)
        search_type = 2;
    else
        search_type = 3;

    if(str.indexOf('洲') < 0) str = '中国·' + str;

   $.ajax({
       type: 'POST',
       url: SERVER_URL + 'api/Areas/getHotObjectInfos', //rest API url
       dataType: 'json',
       data: {'search_type': search_type, 'search_text': str}, // set function name and parameters( 0-area search, 1- course search)
       success: function (data) {
           if (data.status == false) {
               //alert('服务器错误');
           } else {
               display_area_infos(data.data[0]['data']);
           }
       },
       error: function (data) {
           //alert('服务器错误。');
       }
   });

}

// this function is used to get area or course information from string
function getAreaCourseByText(type, str){
    var search_type = 0;
    if( type == 0)
        search_type = 2;
    else
        search_type = 3;

    $.ajax({
        type: 'POST',
        url: SERVER_URL + 'api/Areas/getAreaCoursesByText', //rest API url
        dataType: 'json',
        data: {'search_type': search_type, 'search_text': str}, // set function name and parameters( 0-area search, 1- course search)
        success: function (data) {
            if (data.status == false) {
                //alert('服务器错误');
            } else {
                display_area_infos(data.data['data']);
            }
        },
        error: function (data) {
            //alert('服务器错误。');
        }
    });

}

// this function is used to get tourism infromation of tourism_id
function getTourismCourseInfo(cur_tourism_id){
    phone = localStorage.getItem('phone_number');
    $.ajax({
        type: 'POST',
        url: SERVER_URL + 'api/Areas/getCourseInfoById',
        dataType: 'json',
        data: {'phone' : phone, 'id' : cur_tourism_id},
        success: function (data) {
            if( run_mode == "SIMULATE_MODE") {
                // simulate data
                //tourism_list = simulate_tourismCourseList();
            }else {
                if (data.status == true) {
                    cur_tourism = data['result'];
                }
            }
            sessionStorage.setObject('cur_course', cur_tourism);
            display_tourism_data();
        },
        error: function (data) {
            sessionStorage.removeObject('cur_course');
            //display_tourism_data();
        }
    });
}


// send cancel order request
function SendOrderCancelRequest() {
    // when user cancels his/her order, must send it to server
    // send ajax request and receive ajax response and so process with the result of the backend
    // If verification is fail, maintain old state.
    $('#confirm').hide();

    var phone_num = localStorage.getItem('phone_number');
    var order_id = sessionStorage.getItem('cancel_order_id');
    if(order_id == null) return;

    $.ajax({
        type: 'POST',
        url: SERVER_URL + 'api/Areas/setCancelOrder', //rest API url
        dataType: 'json',
        data: { 'phone': phone_num, 'id': order_id}, // set function name and parameters
        success: function (data) {
            if (data.status == false) {
                showMessage('取消订单失败。', 2);
                return;
            }else{
                //sessionStorage.setObject('cur_order', data.result[0]);
                window.location.href = 'order.html';
            }
        },
        error: function (data) {
            showMessage('取消订单失败。', 2);
        }
    });
}

// check current location
function checkCurrentLocation(pos){
      $.ajax({
        type: 'POST',
        url: SERVER_URL + 'api/Areas/getAreaIdByPosition',
        dataType: 'json',
        // username:'admin',
        // password:'1234',
        data: {'pos':pos, 'map_type':map_type },
        success: function (data) {
            if(run_mode == "SIMULATE_MODE"){
                new_scenic_id = 1;
            }else{
                if (data.status == false) {
                    return;
                }
                // in the case that current scenic area exists, compare new scenic id with current scenic id
                if(cur_scenic_data != null) {
                    if ((cur_scenic_data.id == data.id)) return;
                }

                new_scenic_id = data['id'];
            }
            if(bMovable) return;

            sessionStorage.setItem('new_scenic_id', new_scenic_id);
            sessionStorage.setItem('geo_scenic_id', new_scenic_id);

            var shopid = sessionStorage.getItem('shopid');
            window.location.href = 'home.php?shopid=' + shopid + '&type=2&targetid=' + new_scenic_id + '&map_type=' + map_type;
            //getScenicareafromID(new_scenic_id);
        },
        error: function (data) {

        }
    });
}

function preparePayment() {
    phone_num = localStorage.getItem('phone_number');
    shop_id = sessionStorage.getItem('shopid');

    var payment_data = sessionStorage.getObject('payment_data');
    var buy_type = "";
    switch (payment_data['type']){
        case 1:
            buy_type = '购买旅游线路';
            break;
        case 2:
            buy_type = '购买景区';
            break;
        case 3:
            buy_type = '购买景点';
            break;
    }
    
    sessionStorage.setItem('paying', 0);
    if(is_weixin())
        location.href = 'http://www.ayoubc.com/tour/plugin/Wxpay/payment.php?cost='+ parseFloat(payment_data['real_cost']).toFixed(2) + '&type=' + buy_type + '&product='+ payment_data['name'];
    else
        //location.href = 'http://192.168.2.15/h5tourism/plugin/Wxpay/payment_h5.php?cost='+ parseFloat(payment_data['real_cost']).toFixed(2) + '&type=' + buy_type + '&product='+ payment_data['name'];
        location.href = 'http://www.ayoubc.com/tour/plugin/Wxpay/payment_h5.php?cost='+ parseFloat(payment_data['real_cost']).toFixed(2) + '&title=' + buy_type + '&product='+ payment_data['name'];
}

// downloading the detail information of the scenic area from scenic id
function getScenicareafromID(scenic_id){
    // initializing current scenic area information

    sessionStorage.removeItem('cur_scenic_area');
    cur_scenic_data = null;

    // check validation of the scenic id
    if(scenic_id <= 0)  return;

    $.ajax({
        type: 'POST',
        url: SERVER_URL + 'api/Areas/getAreaInfoById',
        dataType: 'json',
        // username:'admin',
        // password:'1234',
        data: {'id': scenic_id, 'phone':phone_num},
        success: function (data) {
            if( run_mode == "SIMULATE_MODE") {
                // simulate data
                cur_scenic_data = simulate_CurrentScenicArea();
                cur_scenic_data.id = scenic_id;
            }else {
                if (data.status == false) return;
                cur_scenic_data = data['CurArea'];
            }

            new_scenic_id = "";
            sessionStorage.setObject('cur_scenic_area', cur_scenic_data);
            sessionStorage.setItem('new_scenic_id', '');
            showScenicareaInformation();
        },
        error: function (data) {

        }
    });
}

//downloading the information of my scenic areas
function getMyScenicAreasFromServer(){
    //initilizing my scenic area information
    sessionStorage.removeItem('my_scenic_areas');
    minescenic_List = null;
    var phone_num = localStorage.getItem('phone_number');

    $.ajax({
        type: 'POST',
        url: SERVER_URL + 'api/Areas/getMyAreaInfos',
        dataType: 'json',
        // username:'admin',
        // password:'1234',
        data: {'phone' : phone_num},
        success: function (data) {
            if( run_mode == "SIMULATE_MODE") {
                // simulate data
                minescenic_List = simulate_MyScenicAreas();
            }else {
                if (data.status == true) {
                    // configure my scenic areas
                    minescenic_List = data['MyAreas'];
                }
            }

            sessionStorage.setObject('my_scenic_areas', minescenic_List);
            display_minescenic_data();
        },
        error: function (data) {
            sessionStorage.setObject('my_scenic_areas', minescenic_List);
            display_minescenic_data();
        }
    });
}

// downloading the information of all the scenic areas
function getAllScenicAreasFromServer(){
    //initilizing all scenic area information
    sessionStorage.removeItem('scenic_areas');
    scenic_list = null;
    var phone_num = localStorage.getItem('phone_number');

    $.ajax({
        type: 'POST',
        url: SERVER_URL + 'api/Areas/getAllAreaInfos',
        dataType: 'json',
        // username:'admin',
        // password:'1234',
        data: {'phone' : phone_num},
        success: function (data) {
            if( run_mode == "SIMULATE_MODE") {
                // simulate data
                scenic_list = simulate_AllScenicAreas();
            }else {
                if (data.status == true){
                   // configuring all scenic data from received data
                    scenic_list = data['Areas'];
                }
            }
            sessionStorage.setObject('scenic_areas', scenic_list);
            display_scenic_data();
        },
        error: function (data) {
            sessionStorage.setObject('scenic_areas', scenic_list);
            display_scenic_data();
        }
    });
}

// downloading the information of all the orders
function getMyOrdersFromServer(){
    //initilizing all orders' information
    sessionStorage.removeItem('cur_orders');
    order_List = null;
    var phone_num = localStorage.getItem('phone_number');

    $.ajax({
        type: 'POST',
        url: SERVER_URL + 'api/Areas/getMyOrderInfos',
        dataType: 'json',
        // username:'admin',
        // password:'1234',
        data: {'phone' : phone_num},
        success: function (data) {
            if( run_mode == "SIMULATE_MODE") {
                // simulate data
                order_List = simulate_MyOrderList();
            }else {
                if (data.status == true) {
                    order_List = data['Orders'];
                }
            }
            sessionStorage.setObject('cur_orders', order_List);
            display_order_data();
        },
        error: function (data) {
            sessionStorage.setObject('cur_orders', order_List);
            display_order_data();
        }
    });
}

// downloading the information of all the tourism courses
function getTourismCoursesFromServer(){
    //initilizing the information of tourism courses
    sessionStorage.removeItem('tourism_courses');
    tourism_list = null;
    var phone_num = localStorage.getItem('phone_number');

    $.ajax({
        type: 'POST',
        url: SERVER_URL + 'api/Areas/getAllCourseInfos',
        dataType: 'json',
        // username:'admin',
        // password:'1234',
        data: {'phone' : phone_num},
        success: function (data) {
            if( run_mode == "SIMULATE_MODE") {
                // simulate data
                tourism_list = simulate_tourismCourseList();
            }else {
                if (data.status == true) {
                    tourism_list = data['Courses'];
                }
            }
            sessionStorage.setObject('tourism_courses', tourism_list);
            display_tourism_data();
        },
        error: function (data) {
            sessionStorage.setObject('tourism_courses', tourism_list);
            display_tourism_data();
        }
    });
}

function showDialogToCenter(id){
    var height = document.body.clientHeight
        || document.documentElement.clientHeight
        || window.innerHeight;
    var dialog_height = $('#'+id).css('height');
    var margin_top = (parseInt(height) - parseInt(dialog_height))/2;
    $('#'+id).css({'margin-top': margin_top});
}

// simulate scenic data ( use in the simulation method)
function simulate_CurrentScenicArea(){
    var scenic_area = [];
    var tmp_attractionlist =[
        {
            id : '1',
            name :'王老吉凉茶博物馆',
            position : [39.913155,116.402635],
            cost : 10,
            discount_rate:0.8,
            buy_state : 1,
            audio_files : ['resource/audio/standard.mp3','resource/audio/girl.mp3','resource/audio/boy.mp3'],
            image : 'resource/image/logo.png'

        },
        {
            id : '2',
            name :'胡蝶故居',
            position : [39.92223931, 116.391541],
            cost : 20,
            discount_rate:0.8,
            buy_state : 2, // 1: hear testing, 2:paid, 3:unpaid
            audio_files : ['resource/audio/1.mp3','resource/audio/girl.mp3','resource/audio/boy.mp3'],
            image : 'resource/image/logo.png'
        },
        {
            id : '3',
            name :'李家成故居',
            position : [39.913155, 116.391541],
            cost : 30,
            discount_rate:0.8,
            buy_state : 2,
            audio_files : ['resource/audio/2.wav','resource/audio/girl.mp3','resource/audio/boy.mp3'],
            image : 'resource/image/logo.png'
        },
        {
            id : '4',
            name :'树下行人',
            position : [39.92223931,116.402635],
            cost : 15,
            discount_rate:0.8,
            buy_state : 3,
            audio_files : ['resource/audio/3.wav','resource/audio/girl.mp3','resource/audio/boy.mp3'],
            image : 'resource/image/logo.png'
        },
        {
            id : '5',
            name :'横海浪荷花世界',
            position : [ 39.91829,116.396991],
            cost : 25,
            discount_rate:0.8,
            buy_state : 3,
            audio_files : ['resource/audio/4.wav','resource/audio/girl.mp3','resource/audio/boy.mp3'],
            image : 'resource/image/logo.png'
        }
    ];

    scenic_area ={
        id: '1',
        name : '故宫',
        position : [ 39.91829,116.396991],
        top_right : [39.92223931,116.402635],
        bottom_left: [39.913155, 116.391541],
        overlay:'resource/image/overlay.png',
        image:'resource/image/logo.png',
        audio: 'resource/audio/4.wav',
        zoom : 2,
        cost:100,
        discount_rate:0.8,
        attractionCnt:5,
        attractions : tmp_attractionlist,
        zoom : 15
    };

    return scenic_area;
}

// simulate my scenic areas ( use in the simulation method)
function  simulate_MyScenicAreas() {
    // Important: Only using state and  expried state exists
    // variable "type" can be deleted.
    var tmp_sceniclist = [];
    tmp_sceniclist =[
        {
            id:'5897427848',
            name:'鹤山古劳水乡',
            cost: '30.00',
            discount_rate:0.6,
            image:'../resource/image/logo.png',
            order_time:'2017-08-07 14:30:09',
            state:1,             // 1: using, 2: expired
            type: 1              // 1: all paid, 2: part paid
        },
        {
            id:'5897427834',
            name:'十里环水乡风景长廊',
            cost: '50.00',
            discount_rate:0.7,
            image:'../resource/image/logo.png',
            order_time:'2017-08-05 10:30:09',
            state:1,
            type: 2              // 1: all paid, 2: part paid
        },
        {
            id:'5897427856',
            name:'树下行人',
            cost: '15.00',
            discount_rate:0.9,
            image:'../resource/image/logo.png',
            order_time:'2017-07-07 9:30:09',
            state:2,
            type: 1              // 1: all paid, 2: part paid
        }
    ];

    return tmp_sceniclist;
}

// simulate scenic areas ( if don't use simulation method, write return statement above)
function simulate_AllScenicAreas(){
    var tmp_sceniclist = [];
    tmp_sceniclist = [
        {
          id:'1',
          name:'故宫'
        },
        {
            id : '5',
            name : '王老吉凉茶博物馆'
        },
        {
            id : '2',
            name : '十里环水乡风景长廊'
        },
        {
            id : '3',
            name : '李家成故居'
        },
        {
            id : '4',
            name : '树下行人'
        }
    ];
    return tmp_sceniclist;
}

// simulate orders ( use in the simulation method)
function  simulate_MyOrderList() {
    // main is that data processing is accomplish in server and only use them in app
    // so, should use any method?
    var tmp_orderlist = [];
    tmp_orderlist =[
        {
            id:'5897427848',
            name:'鹤山古劳水乡', //(course name or scenic area name, attraction name)
            image:'../resource/image/logo.png',
            pay_method: 1,     // 1: online pay, 2: authorization code
            value:'30.00',     // authorization code or buy-money(ex. 30.00)
            cost: 42.00,       // real cost
            discount_rate:0.7,
            order_time:'2017.08.05 13:00:00',
            paid_time:'2017.08.05 13:00:00',
            expiration_time:'2017.08.05-2017.08.20',
            cancelled_time:'',
            state : 1,   // 1: using, 2: unpaid, 3: cancelled, 4:expired
            order_kind : 1     // 1: tourism course, 2: scenic area, 3: attraction
        },
        {
            id:'5897427851',
            name:'王老吉凉茶博物馆', //(course name or scenic area name, attraction name)
            image:'../resource/image/logo.png',
            pay_method: 2, // 1: online pay, 2: authorization code
            value:'4392862',     // authorization code or money(ex. 30.00)
            cost: 35.00,       // real cost
            discount_rate:0.9,
            order_time:'2017.08.07 15:34:00',
            paid_time:'2017.08.07 16:35:00',
            expiration_time:'2017.08.07-2017.08.22',
            cancelled_time:'',
            state : 1,  // 1: using, 2: unpaid, 3: cancelled, 4:expired
            order_kind : 2     // 1: tourism course, 2: scenic area, 3: attraction
        },
        {
            id:'5897427852',
            name:'故宫', //(course name or scenic area name, attraction name)
            image:'../resource/image/logo.png',
            pay_method: 1,           // 1: online pay, 2: authorization code
            value:'50.00',           // authorization code or money(ex. 30.00)
            cost: 63.00,       // real cost
            discount_rate:0.79,
            order_time:'2017.08.06 13:00:00',
            paid_time:'',
            expiration_time:'',
            cancelled_time:'',
            state : 2,   // 1: using, 2: unpaid, 3: cancelled, 4:expired
            order_kind : 2     // 1: tourism course, 2: scenic area, 3: attraction
        },
        {
            id:'5897427834',
            name:'树下行人', //(course name or scenic area name, attraction name)
            image:'../resource/image/logo.png',
            pay_method: 1,      // 1: online pay, 2: authorization code
            value:'20.00',      // authorization code or money(ex. 30.00)
            cost: 31.00,       // real cost
            discount_rate:0.83,
            order_time:'2017.08.05 13:00:00',
            paid_time:'',
            expiration_time:'',
            cancelled_time:'2017.08.07 19:12:00',
            state : 3,  // 1: using, 2: unpaid, 3: cancelled, 4:expired
            order_kind : 2     // 1: tourism course, 2: scenic area, 3: attraction
        },
        {
            id:'5897427821',
            name:'故宫－长城－明十三陵－颐和园', //(course name or scenic area name, attraction name)
            image:'../resource/image/logo.png',
            pay_method: 2, // 1: online pay, 2: authorization code
            value:'12452764',     // authorization code or money(ex. 30.00)
            cost: 250.00,       // real cost
            discount_rate:0.93,
            order_time:'2017.07.05 15:35:00',
            paid_time:'2017.07.06 11:20:00',
            expiration_time:'2017.07.06-2017.07.26',
            cancelled_time:'',
            state : 4,   // 1: using, 2: unpaid, 3: cancelled, 4:expired
            order_kind : 3     // 1: tourism course, 2: scenic area, 3: attraction
        },
        {
            id:'5897427818',
            name:'东坡亭', //(course name or scenic area name, attraction name)
            image:'../resource/image/logo.png',
            pay_method: 1, // 1: online pay, 2: authorization code
            value:'200.00',     // authorization code or money(ex. 30.00)
            cost: 250.00,       // real cost
            discount_rate:0.91,
            order_time:'2016.05.05 17:05:00',
            paid_time:'2016.05.09 08:30:00',
            expiration_time:'2017.05.05-2017.05.25',
            cancelled_time:'',
            state : 4,   // 1: using, 2: unpaid, 3: cancelled, 4:expired
            order_kind : 3     // 1: tourism course, 2: scenic area, 3: attraction
        }
    ];

    return tmp_orderlist;
}

// simulate tourism courses data ( use in the simulation method)
function simulate_tourismCourseList(){
    var tmp_tourismlist = [];
    tmp_tourismlist = [
        {
            id: '1',
            name:'故宫－圆明园－颐和园',
            image:'../resource/image/logo.png',
            cost:150,
            discount_rate:0.8,
            scenic_areas : [
                {
                    id : '1',
                    name : '故宫',
                    attractionCnt : 10
                },
                {
                    id : '2',
                    name : '圆明园',
                    attractionCnt : 7
                },
                {
                    id : '3',
                    name : '颐和园',
                    attractionCnt : 11
                }
            ]
        },
        {
            id: '2',
            name : '故宫－长城－明十三陵－颐和园',
            image:'../resource/image/logo.png',
            cost : 200,
            discount_rate:0.8,
            scenic_areas : [
                {
                    id : '1',
                    name : '故宫',
                    attractionCnt : 10
                },
                {
                    id : '2',
                    name : '长城',
                    attractionCnt : 5
                },
                {
                    id : '3',
                    name : '明十三陵',
                    attractionCnt : 8
                },
                {
                    id : '4',
                    name : '颐和园',
                    attractionCnt : 4
                }
            ]
        }
    ];

    return tmp_tourismlist;
}


function verifyAuthorizationCode(){
    $('#login').hide();
    sessionStorage.setItem('login_state', 1);

    if(bPhoneverified == 1)
    {
        $('#code_auth').show();
        showDialogToCenter('code_auth_dialog');
    }else{
        bAuthorizing = 1;
        verifyPhone();
    }
}

function verifyPhone(){
    $('#login').hide();
    if(bPhoneverified == 1) return;

    $('#phone_verify').show();
    check_verifyCode();
    showDialogToCenter('phone_verify_dialog');
}

// send SMS message to user's phone in order to verify user's phone
var time_counter= 0;
var timerID = undefined;
function calculateRemainTime(){
    time_counter--;
    if(time_counter == 0) {
        clearInterval(timerID);
        timerID = undefined;

        $('#btn_sendSMS').attr({
            'onclick' : 'sendSMSToPhone()'
        });
        $('#btn_sendSMS h5').html('获取验证码');
        $('#btn_sendSMS').css({
            'border-color': '#90d4e7',
            'background-color': '#ffffff',
            'color': '#90d4e7'
        });
        $('#btn_sendSMS:active').css({
            'border-color': '#90d4e7',
            'background-color': '#90d4e7',
            'color': '#ffffff'
        });
        return;
    }
    $('#btn_sendSMS h5').html(time_counter + '秒可重发');
}

function sendSMSToPhone(){
    // accomplish along 4 stages
    phone_num = $('#phone_number').val();
    //phone number validation
    if(phone_num == '' || phone_num.length != 11)
    {
        showMessage('手机号码错了。 再次输入。', 2);
        return;
    }

    time_counter = 60;
    timerID = setInterval(function () {calculateRemainTime()}, 1000);
    $('#btn_sendSMS').attr({
        'onclick' : ''
    });
    $('#btn_sendSMS').css({
        'border-color': 'grey',
        'background-color': '#ffffff',
        'color': 'grey'
    });
    $('#btn_sendSMS:active').css({
        'border-color': 'grey',
        'background-color': 'white',
        'color': 'grey'
    });

    $('#btn_sendSMS h5').html('60秒可重发');

    // send SMS sending request in backend server.
    $('#loading').css({display:'block'});
    $.ajax({
	 type: 'POST',
         url: 'http://www.ayoubc.com/tour/plugin/SMS/SendTemplateSMS.php', //rest API url
         dataType: 'json',
         data: {'phone_num':  phone_num}, // set function name and parameters
         success: function(data){
             // get SMS code from received data
             $('#loading').css({display:'none'});
             if(data['result'] == "success") {
                 sms_code = data['code'];
             }else{
                 sms_code = "";
                 showMessage(data.error['0'], 2);
             }
         },
         fail: function(){
             return;
         }
    });
    sms_code = "1234";
}

// confirm the phone verification code
function confirm_verify_phone(){
    if(sms_code == "")
    {
        showMessage('请确认您正确输入手机号码并重新发送请求。再次击点"获取验证码"。', 2);
        return;
    }
    // verify SMS code accuracy
    var code = $('#verify_code').val();
    if( sms_code != code || code == "") {
        showMessage('验证码错了。 再次输入。', 2);
        return;
    }

    bPhoneverified = 1;
    // store phone verification state
    localStorage.setItem('phone_verified', bPhoneverified);
    localStorage.setItem('phone_number', phone_num);

    $('#phone_verify').hide();
    $('#phone_number').val("");
    $('#verify_code').val("");

    // if purcharge state then jump to weixin payment state
    var state = sessionStorage.getItem('purchage_state');
    if (state == 1){
        processInfoEvents(4, 0);
        sessionStorage.removeItem('purchage_state');
    }else if(state == 2){
	preparePayment();
    }

    // If for verifying authorization code verify phone then show authorization code verifying dialog,
    // If else downloading needed infos of the current scenic area, attraction of the current scenic area and so on.
    if(bAuthorizing == 1)
    {
        bAuthorizing = 0;
        $('#code_auth').show();
        showDialogToCenter('code_auth_dialog');
    }else{
        // change attraction marks along information
        if(cur_scenic_data != null)
            getScenicareafromID(cur_scenic_data.id);
    }
}

function OnCancelauthcodeVerify(){
    $('#code_auth').hide();
    $('#auth_code').val("");
}

function OnConfirmauthCode(){
    /*  validate authorization code
    **  If authorization code don't exist in the order lists of backend, verification is fail.
     */
    var auth_code = $('#auth_code').val();
    var shop_id = sessionStorage.getItem('shopid');

    if(auth_code == "")
    {
        showMessage('请输入授权码。', 2);
        return;
    }

    // send the order information to back-end
    $.ajax({
        type: 'POST',
        url: SERVER_URL + 'api/Areas/setAreaBuyOrder',
        dataType: 'json',
        // username:'admin',
        // password:'1234',
        data: { 'shop' : shop_id ,'phone' : phone_num, 'id': auth_code, 'type' : 4, 'cost':''},
        success: function (data) {
            if (data.status == false) {
                showMessage('授权码有误，请重新输入!', 2);
                return;
            }
            $('#code_auth').hide();
            $('#auth_code').val("");

            if(cur_scenic_data != null) {
                getScenicareafromID(cur_scenic_data.id);
                showMessage('您已解锁景区，点击景区开启导游之旅！', 2);
            }
            location.reload(true);
        },
        error: function (data) {
            showMessage('授权失败。', 2);
        }
    });
}

function phone_verify_dialog_close(){
    $('#phone_verify').hide();
}

function code_auth_dialog_close(){
    $('#code_auth').hide();
    bAuthorizing = 0;
}

function check_authCode() {
    // check authrization code input state
    $('#auth_code').on('input', function (e) {
        var auth_code = $('#auth_code').val();
        if(auth_code.length == 12){
            $('#btn_ok').attr({
                'style' :'background-color: #90d4e7; border-color:#90d4e7; color:white'
            });
        }else if(auth_code.length > 12){
            $('#auth_code').val(auth_code.substr(0,12));
        }else{
            $('#btn_ok').attr({
                'style' :'background-color: #ddf1f8; border-color:#ddf1f8; color:black'
            });
        }
    });
}

function check_verifyCode() {
    // check authrization code input state
    $('#verify_code').on('input', function (e) {
        var auth_code = $('#verify_code').val();
        if(auth_code.length == 6){
            $('#confirm_verify').attr({
                'style' :'background-color: #90d4e7; border-color:#90d4e7; color:white'
            });
        }else if(auth_code.length > 6){
            $('#verify_code').val(auth_code.substr(0,6));
        }else{
            $('#confirm_verify').attr({
                'style' :'background-color: #ddf1f8; border-color:#ddf1f8; color:black'
            });
        }
    });
}

// calculate expiration date and expired date from any time
function getDetailInfofromTime(tmpTime){
    /* calculate  expiration date and  expired date , state(using, expired ...)
    **  expiration_time : 2017.08-05-2017.08.20
    **  state : if using then 1, if expired then 2
     */
    var info = new Array();
    info['state'] = 1;
    info['expiration_time'] = tmpTime.substr(0,10) + "-";

    var timeStr = tmpTime.replace('.', '-');
    timeStr = timeStr.replace('.', '-');
    timeStr = timeStr.substr(0,10) +"T"+ timeStr.substr(11, 8)+"+08:00";

    var today = new Date();
    var paid_date = new Date(timeStr);
    var expired_date = new Date(timeStr);
    expired_date.setDate(paid_date.getDate() + 15);

    if(expired_date.getTime() < today.getTime()) info['state'] = 2;

    info['expiration_time'] += expired_date.getFullYear() + ".";
    if(expired_date.getMonth()<10) info['expiration_time'] += "0";
    info['expiration_time'] += (expired_date.getMonth()+1) + ".";
    if(expired_date.getDate()<10) info['expiration_time'] += "0";
    info['expiration_time'] += expired_date.getDate();

    return info;
}


function DetectIOSDevice(){
    if( is_weixin()) return false;
        
    var uagent = navigator.userAgent.toLowerCase();
    if (uagent.search("iphone") > -1)
        return true;
    else if (uagent.search("ipad") > -1)
        return true;
    else if (uagent.search("ipod") > -1)
        return true;
    else
        return false;
}
                                                            
function is_weixin(){
    var ua = navigator.userAgent.toLowerCase();
    if(ua.match(/MicroMessenger/i)=="micromessenger") {
        return true;
    } else {
        return false;
    }
}

function showMessage(message, isShowbtn) {
    if(isShowbtn==2){
        $('#msg_cancel').hide();
        $('#msg_ok').attr('onclick',"$('#message_dialog').hide();");
    }else{
        $('#msg_cancel').show();
        $('#msg_ok').attr('onclick',"onOk();");
    }
    isShowbtn = (isShowbtn == undefined) ? false : true;
    message = (isShowbtn == false) ? message = '<br>' + message : message;
    $('#message_dialog .modal-body').html('<br><b><center>' + message + '</center></b><br>');
    $('#message_dialog').show();
    if (!isShowbtn) {
        $('#message_dialog .modal-footer').css({'display': 'none'});
        clearTimeout(app_data.notifyTimer);
        app_data.notifyTimer = setTimeout(function () {
            $('#message_dialog').hide();
        }, 3000);
    } else {
        $('#message_dialog .modal-footer').css({'display': 'block'});
    }

    showDialogToCenter('alert_message_dialog');
}

// In this part, get Device Screen Information
function getDevicePixelRatio() {
    if(window.devicePixelRatio) {
        return window.devicePixelRatio;
    }
    return screen.deviceXDPI / screen.logicalXDPI;
}

// This is the part that store and load the object in localStorage
Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
}
Storage.prototype.getObject = function(key) {
    var val = this.getItem(key);
    if(val == "" || val == null) return null;
    return JSON.parse(val);
}