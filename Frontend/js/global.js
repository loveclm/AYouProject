/**
 * Created by Administrator on 8/9/2017.
 */
var SERVER_URL = "http://192.168.2.18/";
//var run_mode = "SIMULATE_MODE";   // This means system runs with simulate mode
var run_mode = "REALTIME_MODE";   // This means system runs with real time mode

// check current location
function checkCurrentLocation(pos){
    $.ajax({
        type: 'POST',
        url: SERVER_URL + 'api/Areas/getAreaIdByPosition',
        dataType: 'json',
        // username:'admin',
        // password:'1234',
        data: {'pos':pos},
        success: function (data) {
            if(run_mode == "SIMULATE_MODE"){
                new_scenic_id = 1;
            }else{
                if (data.status == false) return;
                // in the case that current scenic area exists, compare new scenic id with current scenic id
                if(cur_scenic_data != null) {
                    if ((cur_scenic_data.id == data.id)) return;
                }

                new_scenic_id = data['id'];
            }

            bMovable = 1;
            sessionStorage.setItem('new_scenic_id', new_scenic_id);
            sessionStorage.setItem('movable', bMovable);
            sessionStorage.setItem('geo_scenic_id', new_scenic_id);
            getScenicareafromID(new_scenic_id);
        },
        error: function (data) {

        }
    });
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
                if (data.status == false) return;
                // configure my scenic areas
                minescenic_List = data['MyAreas'];
            }

            sessionStorage.setObject('my_scenic_areas', minescenic_List);
            display_minescenic_data();
        },
        error: function (data) {

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
                if (data.status == false) return;
                // configuring all scenic data from received data
                scenic_list = data['Areas'];
            }
            sessionStorage.setObject('scenic_areas', scenic_list);
            display_scenic_data();
        },
        error: function (data) {

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
                if (data.status == false) return;
                order_List = data['Orders'];
            }
            sessionStorage.setObject('cur_orders', order_List);
            display_order_data();
        },
        error: function (data) {

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
                if (data.status == false) return;
                tourism_list = data['Courses'];
            }
            sessionStorage.setObject('tourism_courses', tourism_list);
            display_tourism_data();
        },
        error: function (data) {

        }
    });
}

// simulate scenic data ( use in the simulation method)
function simulate_CurrentScenicArea(){
    var scenic_area = [];
    var tmp_attractionlist =[
        {
            id : '1',
            name :'王老吉凉茶博物馆',
            position : [116.402635,39.913155],
            cost : 10,
            discount_rate:0.8,
            buy_state : 1,
            audio_files : ['resource/audio/standard.mp3','resource/audio/girl.mp3','resource/audio/boy.mp3'],
            image : 'resource/image/tmp_order.png'

        },
        {
            id : '2',
            name :'胡蝶故居',
            position : [116.391541,39.92223931],
            cost : 20,
            discount_rate:0.8,
            buy_state : 2, // 1: hear testing, 2:paid, 3:unpaid
            audio_files : ['resource/audio/1.mp3','resource/audio/girl.mp3','resource/audio/boy.mp3'],
            image : 'resource/image/tmp_order.png'
        },
        {
            id : '3',
            name :'李家成故居',
            position : [116.391541,39.913155],
            cost : 30,
            discount_rate:0.8,
            buy_state : 2,
            audio_files : ['resource/audio/2.wav','resource/audio/girl.mp3','resource/audio/boy.mp3'],
            image : 'resource/image/tmp_order.png'
        },
        {
            id : '4',
            name :'树下行人',
            position : [116.402635,39.92223931],
            cost : 15,
            discount_rate:0.8,
            buy_state : 3,
            audio_files : ['resource/audio/3.wav','resource/audio/girl.mp3','resource/audio/boy.mp3'],
            image : 'resource/image/tmp_order.png'
        },
        {
            id : '5',
            name :'横海浪荷花世界',
            position : [116.396991, 39.91829],
            cost : 25,
            discount_rate:0.8,
            buy_state : 3,
            audio_files : ['resource/audio/4.wav','resource/audio/girl.mp3','resource/audio/boy.mp3'],
            image : 'resource/image/tmp_order.png'
        }
    ];

    scenic_area ={
        id: '1',
        name : '故宫',
        position : [116.396991, 39.91829],
        top_right : [116.402635,39.92223931],
        bottom_left: [116.391541,39.913155],
        overlay:'resource/image/overlay.png',
        image:'resource/image/palace.png',
        zoom : 2,
        cost:100,
        discount_rate:0.8,
        attractionCnt:5,
        attractions : tmp_attractionlist
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
            image:'../resource/image/tmp_order.png',
            order_time:'2017-08-07 14:30:09',
            state:1,             // 1: using, 2: expired
            type: 1              // 1: all paid, 2: part paid
        },
        {
            id:'5897427834',
            name:'十里环水乡风景长廊',
            cost: '50.00',
            discount_rate:0.7,
            image:'../resource/image/tmp_order.png',
            order_time:'2017-08-05 10:30:09',
            state:1,
            type: 2              // 1: all paid, 2: part paid
        },
        {
            id:'5897427856',
            name:'树下行人',
            cost: '15.00',
            discount_rate:0.9,
            image:'../resource/image/tmp_order.png',
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
            image:'../resource/image/tmp_order.png',
            pay_method: 1,     // 1: online pay, 2: authorization code
            value:'30.00',     // authorization code or buy-money(ex. 30.00)
            cost: 42.00,       // real cost
            discount_rate:0.7,
            order_time:'2017.08.05 13:00:00',
            paid_time:'2017.08.05 13:00:00',
            expiration_date:'2017.08.05-2017.08.20',
            cancelled_time:'',
            state : 1,   // 1: using, 2: unpaid, 3: cancelled, 4:expired
            order_kind : 1     // 1: tourism course, 2: scenic area, 3: attraction
        },
        {
            id:'5897427851',
            name:'王老吉凉茶博物馆', //(course name or scenic area name, attraction name)
            image:'../resource/image/tmp_order.png',
            pay_method: 2, // 1: online pay, 2: authorization code
            value:'4392862',     // authorization code or money(ex. 30.00)
            cost: 35.00,       // real cost
            discount_rate:0.9,
            order_time:'2017.08.07 15:34:00',
            paid_time:'2017.08.07 16:35:00',
            expiration_date:'2017.08.07-2017.08.22',
            cancelled_time:'',
            state : 1,  // 1: using, 2: unpaid, 3: cancelled, 4:expired
            order_kind : 2     // 1: tourism course, 2: scenic area, 3: attraction
        },
        {
            id:'5897427852',
            name:'故宫', //(course name or scenic area name, attraction name)
            image:'../resource/image/tmp_order.png',
            pay_method: 1,           // 1: online pay, 2: authorization code
            value:'50.00',           // authorization code or money(ex. 30.00)
            cost: 63.00,       // real cost
            discount_rate:0.79,
            order_time:'2017.08.06 13:00:00',
            paid_time:'',
            expiration_date:'',
            cancelled_time:'',
            state : 2,   // 1: using, 2: unpaid, 3: cancelled, 4:expired
            order_kind : 2     // 1: tourism course, 2: scenic area, 3: attraction
        },
        {
            id:'5897427834',
            name:'树下行人', //(course name or scenic area name, attraction name)
            image:'../resource/image/tmp_order.png',
            pay_method: 1,      // 1: online pay, 2: authorization code
            value:'20.00',      // authorization code or money(ex. 30.00)
            cost: 31.00,       // real cost
            discount_rate:0.83,
            order_time:'2017.08.05 13:00:00',
            paid_time:'',
            expiration_date:'',
            cancelled_time:'2017.08.07 19:12:00',
            state : 3,  // 1: using, 2: unpaid, 3: cancelled, 4:expired
            order_kind : 2     // 1: tourism course, 2: scenic area, 3: attraction
        },
        {
            id:'5897427821',
            name:'故宫－长城－明十三陵－颐和园', //(course name or scenic area name, attraction name)
            image:'../resource/image/tmp_order.png',
            pay_method: 2, // 1: online pay, 2: authorization code
            value:'12452764',     // authorization code or money(ex. 30.00)
            cost: 250.00,       // real cost
            discount_rate:0.93,
            order_time:'2017.07.05 15:35:00',
            paid_time:'2017.07.06 11:20:00',
            expiration_date:'2017.07.06-2017.07.26',
            cancelled_time:'',
            state : 4,   // 1: using, 2: unpaid, 3: cancelled, 4:expired
            order_kind : 3     // 1: tourism course, 2: scenic area, 3: attraction
        },
        {
            id:'5897427818',
            name:'东坡亭', //(course name or scenic area name, attraction name)
            image:'../resource/image/tmp_order.png',
            pay_method: 1, // 1: online pay, 2: authorization code
            value:'200.00',     // authorization code or money(ex. 30.00)
            cost: 250.00,       // real cost
            discount_rate:0.91,
            order_time:'2016.05.05 17:05:00',
            paid_time:'2016.05.09 08:30:00',
            expiration_date:'2017.05.05-2017.05.25',
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
            image:'../resource/image/palace.png',
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
            image:'../resource/image/palace.png',
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

// calculate expiration date and expired date from any time
function getDetailInfofromTime(tmpTime){
    /* calculate  expiration date and  expired date , state(using, expired ...)
    **  expiration_date : 2017.08-05-2017.08.20
    **  state : if using then 1, if expired then 2
     */
    var info = new Array();
    info['state'] = 1;
    info['expiration_date'] = tmpTime.substr(0,10) + "-";

    var timeStr = tmpTime.replace('.', '-');
    timeStr = timeStr.replace('.', '-');
    timeStr = timeStr.substr(0,10) +"T"+ timeStr.substr(11, 8)+"+08:00";

    var today = new Date();
    var paid_date = new Date(timeStr);
    var expired_date = new Date(timeStr);
    expired_date.setDate(paid_date.getDate() + 15);

    if(expired_date.getTime() < today.getTime()) info['state'] = 2;

    info['expiration_date'] += expired_date.getFullYear() + ".";
    if(expired_date.getMonth()<10) info['expiration_date'] += "0";
    info['expiration_date'] += (expired_date.getMonth()+1) + ".";
    if(expired_date.getDate()<10) info['expiration_date'] += "0";
    info['expiration_date'] += expired_date.getDate();

    return info;
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