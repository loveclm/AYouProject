/**
 * Created by Administrator on 8/9/2017.
 */

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
            cost:150,
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
            cost : 200,
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
            buy_state : 1,
            audio_files : ['audio/standard.mp3','audio/girl.mp3','audio/boy.mp3'],
            image : 'image/tmp_order.png'

        },
        {
            id : '2',
            name :'胡蝶故居',
            position : {x:116.354,y:39.914585},
            cost : 20,
            buy_state : 1, // 1: hear testing, 2:paid, 3:unpaid
            audio_files : ['audio/standard.mp3','audio/girl.mp3','audio/boy.mp3'],
            image : 'image/tmp_order.png'
        },
        {
            id : '3',
            name :'李家成故居',
            position : {x:116.364,y:39.914685},
            cost : 30,
            buy_state : 1,
            audio_files : ['audio/standard.mp3','audio/girl.mp3','audio/boy.mp3'],
            image : 'image/tmp_order.png'
        },
        {
            id : '4',
            name :'树下行人',
            position : {x:116.324,y:39.915},
            cost : 15,
            buy_state : 1,
            audio_files : ['audio/standard.mp3','audio/girl.mp3','audio/boy.mp3'],
            image : 'image/tmp_order.png'
        },
        {
            id : '5',
            name :'横海浪荷花世界',
            position : {x:116.4,y:39.914885},
            cost : 25,
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
    return JSON.parse(val);
}