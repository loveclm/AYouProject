/**
 * Created by Administrator on 8/9/2017.
 */

//downloading the information of my scenic areas
function getMyScenicAreasFromServer(){
    //initilizing my scenic area information
    localStorage.removeItem('my_scenic_areas');
    minescenic_List = null;

    var tmp_sceniclist = [];
    /*
     $.ajax({
         type: 'GET',
         url: 'http://server/backend/dbmanage.php', //rest API url
         dataType: 'json',
         data: {func: 'function_name', info: res}, // set function name and parameters
         }).success(function(data){
             // configuring scenic data from received data

             minescenic_List = tmp_attractionlist;

             localStorage.setObject('my_scenic_areas', minescenic_List);
             display_minescenic_data();
         }).fail(function(){
             return;
     });
     */

    //return;
    // simulate my scenic areas ( if don't use simulation method, write return statement above)
    // Important: Only using state and  expried state exists
    // variable "type" can be deleted.
    tmp_sceniclist =[
        {
            id:'5897427848',
            name:'鹤山古劳水乡',
            cost: '30.00',
            discount_rate:0.6,
            image_url:'../image/tmp_order.png',
            order_time:'2017-08-07 14:30:09',
            state:1,             // 1: using, 2: expired
            type: 1              // 1: all paid, 2: part paid
        },
        {
            id:'5897427834',
            name:'十里环水乡风景长廊',
            cost: '50.00',
            discount_rate:0.7,
            image_url:'../image/tmp_order.png',
            order_time:'2017-08-05 10:30:09',
            state:1,
            type: 2              // 1: all paid, 2: part paid
        },
        {
            id:'5897427856',
            name:'树下行人',
            cost: '15.00',
            discount_rate:0.9,
            image_url:'../image/tmp_order.png',
            order_time:'2017-07-07 9:30:09',
            state:2,
            type: 1              // 1: all paid, 2: part paid
        }
    ];

    minescenic_List = tmp_sceniclist;
    localStorage.setObject('my_scenic_areas', minescenic_List);
    display_minescenic_data();
}

// downloading the information of all the orders
function getOrdersFromServer(){
    //initilizing all orders' information
    localStorage.removeItem('cur_orders');
    order_List = null;

    var tmp_orderlist = [];
    /*
     $.ajax({
         type: 'GET',
         url: 'http://server/backend/dbmanage.php', //rest API url
         dataType: 'json',
         data: {func: 'function_name', info: res}, // set function name and parameters
         }).success(function(data){
             // configuring scenic data from received data

             cur_orders = tmp_attractionlist;

             localStorage.setObject('scenic_areas', scenic_list);
             display_order_data();
         }).fail(function(){
             return;
     });
     */

    //return;

    // simulate orders ( if don't use simulation method, write return statement above)
    // main is that data processing is accomplish in server and only use them in app
    // so, should use any method?
    tmp_orderlist =[
        {
            id:'5897427848',
            name:'鹤山古劳水乡', //(course name or scenic area name, attraction name)
            image:'../image/tmp_order.png',
            pay_method: 1,     // 1: online pay, 2: authorization code
            value:'30.00',     // authorization code or buy-money(ex. 30.00)
            cost: 42.00,       // real cost
            discount_rate:0.7,
            order_time:'2017.08.05 13:00:00',
            paid_time:'2017.08.05 13:00:00',
            expiration_date:'2017.08.05-2017.08.20',
            cancelled_time:'',
            state : 1   // 1: using, 2: unpaid, 3: cancelled, 4:expired
        },
        {
            id:'5897427851',
            name:'王老吉凉茶博物馆', //(course name or scenic area name, attraction name)
            image:'../image/tmp_order.png',
            pay_method: 2, // 1: online pay, 2: authorization code
            value:'4392862',     // authorization code or money(ex. 30.00)
            cost: 35.00,       // real cost
            discount_rate:0.9,
            order_time:'2017.08.07 15:34:00',
            paid_time:'2017.08.07 16:35:00',
            expiration_date:'2017.08.07-2017.08.22',
            cancelled_time:'',
            state : 1   // 1: using, 2: unpaid, 3: cancelled, 4:expired
        },
        {
            id:'5897427852',
            name:'故宫', //(course name or scenic area name, attraction name)
            image:'../image/tmp_order.png',
            pay_method: 1,           // 1: online pay, 2: authorization code
            value:'50.00',           // authorization code or money(ex. 30.00)
            cost: 63.00,       // real cost
            discount_rate:0.79,
            order_time:'2017.08.06 13:00:00',
            paid_time:'',
            expiration_date:'',
            cancelled_time:'',
            state : 2   // 1: using, 2: unpaid, 3: cancelled, 4:expired
        },
        {
            id:'5897427834',
            name:'树下行人', //(course name or scenic area name, attraction name)
            image:'../image/tmp_order.png',
            pay_method: 1,      // 1: online pay, 2: authorization code
            value:'20.00',      // authorization code or money(ex. 30.00)
            cost: 31.00,       // real cost
            discount_rate:0.83,
            order_time:'2017.08.05 13:00:00',
            paid_time:'',
            expiration_date:'',
            cancelled_time:'2017.08.07 19:12:00',
            state : 3   // 1: using, 2: unpaid, 3: cancelled, 4:expired
        },
        {
            id:'5897427821',
            name:'故宫－长城－明十三陵－颐和园', //(course name or scenic area name, attraction name)
            image:'../image/tmp_order.png',
            pay_method: 2, // 1: online pay, 2: authorization code
            value:'12452764',     // authorization code or money(ex. 30.00)
            cost: 250.00,       // real cost
            discount_rate:0.93,
            order_time:'2017.07.05 15:35:00',
            paid_time:'2017.07.06 11:20:00',
            expiration_date:'2017.07.06-2017.07.26',
            cancelled_time:'',
            state : 4   // 1: using, 2: unpaid, 3: cancelled, 4:expired
        },
        {
            id:'5897427818',
            name:'东坡亭', //(course name or scenic area name, attraction name)
            image:'../image/tmp_order.png',
            pay_method: 1, // 1: online pay, 2: authorization code
            value:'200.00',     // authorization code or money(ex. 30.00)
            cost: 250.00,       // real cost
            discount_rate:0.91,
            order_time:'2016.05.05 17:05:00',
            paid_time:'2016.05.09 08:30:00',
            expiration_date:'2017.05.05-2017.05.25',
            cancelled_time:'',
            state : 4   // 1: using, 2: unpaid, 3: cancelled, 4:expired
        }
    ];
    order_List = tmp_orderlist;
    localStorage.setObject('cur_orders', order_List);

    display_order_data();
}

// downloading the information of all the scenic areas
function getScenicAreasFromServer(){
    //initilizing all scenic area information
    localStorage.removeItem('scenic_areas');
    scenic_list = null;

    var tmp_sceniclist = [];
    /*
     $.ajax({
         type: 'GET',
         url: 'http://server/backend/dbmanage.php', //rest API url
         dataType: 'json',
         data: {func: 'function_name', info: res}, // set function name and parameters
         }).success(function(data){
             // configuring scenic data from received data

             cur_scenic_data = tmp_attractionlist;

             localStorage.setObject('scenic_areas', scenic_list);
             display_scenic_data();
         }).fail(function(){
             return;
     });
     */

    //return;

    // simulate scenic areas ( if don't use simulation method, write return statement above)
    tmp_sceniclist = [
        {
            id : '1',
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
    scenic_list = tmp_sceniclist;
    localStorage.setObject('scenic_areas', scenic_list);

    display_scenic_data();
}

// downloading the information of all the tourism courses
function getTourismCoursesFromServer(){
    //initilizing the information of tourism courses
    localStorage.removeItem('tourism_courses');
    tourism_list = null;

    var tmp_tourismlist = [];
    /*
     $.ajax({
     type: 'GET',
     url: 'http://server/backend/dbmanage.php', //rest API url
     dataType: 'json',
     data: {func: 'function_name', info: res}, // set function name and parameters
     }).success(function(data){
         // configuring scenic data from received data

         tourism_list = tmp_tourismlist;

         localStorage.setObject('tourism_courses', tourism_list);
         display_tourism_data();
     }).fail(function(){
         return;
     });
     */

    //return;

    // simulate tourism courses data ( if don't use simulation method, write return statement above)
    tmp_tourismlist = [
        {
            id: '1',
            name:'故宫－圆明园－颐和园',
            image:'../image/palace.png',
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
            image:'../image/palace.png',
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

    tourism_list = tmp_tourismlist;
    localStorage.setObject('tourism_courses', tourism_list);

    display_tourism_data();
}

// downloading the detail information of the scenic area from scenic id
function getScenicareafromID(scenic_id){
    // initializing current scenic area information
    localStorage.removeItem('cur_scenic_area');
    cur_scenic_data = null;

    // check validation of the scenic id
    if(scenic_id <= 0)  return;

    var scenic_area = [];
    /*
     $.ajax({
     type: 'GET',
     url: 'http://server/backend/dbmanage.php', //rest API url
     dataType: 'json',
     data: {func: 'function_name', info: res}, // set function name and parameters
     }).success(function(data){
         // configuring scenic data from received data

         cur_scenic_data = tmp_attractionlist;

         localStorage.setObject('cur_scenic_area', cur_scenic_data);
         initialize();
     }).fail(function(){
     return;
     });
     */

    //return;

    // simulate scenic data ( if don't use simulation method, write return statement above)
    var tmp_attractionlist =[
        {
            id : '1',
            name :'王老吉凉茶博物馆',
            position : {x:116.354,y:39.914585},
            cost : 10,
            discount_rate:0.8,
            buy_state : 1,
            audio_files : ['audio/standard.mp3','audio/girl.mp3','audio/boy.mp3'],
            image : 'image/tmp_order.png'

        },
        {
            id : '2',
            name :'胡蝶故居',
            position : {x:116.354,y:39.914585},
            cost : 20,
            discount_rate:0.8,
            buy_state : 1, // 1: hear testing, 2:paid, 3:unpaid
            audio_files : ['audio/standard.mp3','audio/girl.mp3','audio/boy.mp3'],
            image : 'image/tmp_order.png'
        },
        {
            id : '3',
            name :'李家成故居',
            position : {x:116.364,y:39.914685},
            cost : 30,
            discount_rate:0.8,
            buy_state : 1,
            audio_files : ['audio/standard.mp3','audio/girl.mp3','audio/boy.mp3'],
            image : 'image/tmp_order.png'
        },
        {
            id : '4',
            name :'树下行人',
            position : {x:116.324,y:39.915},
            cost : 15,
            discount_rate:0.8,
            buy_state : 1,
            audio_files : ['audio/standard.mp3','audio/girl.mp3','audio/boy.mp3'],
            image : 'image/tmp_order.png'
        },
        {
            id : '5',
            name :'横海浪荷花世界',
            position : {x:116.4,y:39.914885},
            cost : 25,
            discount_rate:0.8,
            buy_state : 1,
            audio_files : ['audio/standard.mp3','audio/girl.mp3','audio/boy.mp3'],
            image : 'image/tmp_order.png'
        }
    ];

    scenic_area ={
        id: scenic_id,
        name : '故宫',
        position : {x:116.404, y:39.915},
        top_left : {x:116.304,y:39.914285},
        bottom_right: {x:116.404,y:39.915285},
        overlay:'image/overlay.png',
        image:'image/palace.png',
        zoom : 2,
        cost:100,
        discount_rate:0.8,
        attractionCnt:5,
        attractions : tmp_attractionlist
    };

    cur_scenic_data = scenic_area;
    localStorage.setObject('cur_scenic_area', cur_scenic_data);

    scenic_area = localStorage.getObject('cur_scenic_area');
    initialize();
}

function getScenicareafromPosition(){
    // Here, receive the scenic area id that exists in current position from backend server
    var scenic_id = 0;
    /*
     $.ajax({
     type: 'GET',
     url: 'http://server/backend/dbmanage.php', //rest API url
     dataType: 'json',
     data: {func: 'function_name', info: res}, // set function name and parameters
     }).success(function(data){
        // get scenic id from received data

        getScenicareafromID(scenic_id);
     }).fail(function(){
        return;
     });
     */

    //return;

    //simulate scenic id ( if don't use simulation method, write return statement above)
    scenic_id = 1;
    getScenicareafromID(scenic_id);
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