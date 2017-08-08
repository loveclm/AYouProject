/**
 * Created by Administrator on 8/8/2017.
 */

var order_List = new Array();

$(function(){
    //display_order_data();
});

function display_order_data(){
    //------- downloading or loading tourism data
    simulate_order_download();
    //------- show the scenic list
    // show individual scenic data
    var content_html = "";
    for( var i = 0; i < order_List.length; i++){
        content_html += '<div class="scenic_item" id="scenic_item'+ (i+1) +'">';
        content_html += '<img src="../image/voice.png" style="float: left; height:100%">';
        content_html += '<h4 style="float: left; padding-left: 15px; font-weight: bold">' +order_List[i]['name'] +'</h4></div>';
        // define eventListener
    }
    $('#order_List').html(content_html);
}

function simulate_order_download(){
    /* order's data format
    **  id means 订单编号
    **  name means order's name( attraction or scenic area name)
    **  image_url is
    */
    order_List[0] = {id:'5897427848', name:'', image_url:'', value:'', state:1}
    order_List[0]={name:'王老吉凉茶博物馆', id:1};
    order_List[1]={name:'十里环水乡风景长廊', id:2};
    order_List[2]={name:'李家成故居', id:3};
    order_List[3]={name:'树下行人', id:4};
}



function resize_orderlist(){
    initRatio = getDevicePixelRatio();
    var ratio = getDevicePixelRatio()/initRatio;
    var width = window.innerWidth
        || document.documentElement.clientWidth
        || document.body.clientWidth;

    var height = window.innerHeight
        || document.documentElement.clientHeight
        || document.body.clientHeight;
    var scale = Math.min(width/640,height/1010) * ratio;

    width = 640*scale;
    $('#content').css({width:width, height:height});
    $('#app_header').css({width:width});

    // resize map region
    var map_top = document.getElementById('app_header').clientHeight;
    var map_width = document.getElementById('content').clientWidth;
    var map_height = document.body.clientHeight - map_top;
    $('#container').css({width:map_width, height:map_height, top:map_top, bottom:0});

    var content_margin=(document.body.clientWidth-width)/2;
    $('#back_img').css({position:'fixed',left: content_margin+10});

    var header_height = document.getElementById('tab_header').clientHeight;
    $('#tab_all').css({height:map_height-header_height-4});
    $('#tab_unpaid').css({height:map_height-header_height-4});
    $('#tab_cancelled').css({height:map_height-header_height-4});
    $('#tab_expired').css({height:map_height-header_height-4});
}

function getDevicePixelRatio() {
    if(window.devicePixelRatio) {
        return window.devicePixelRatio;
    }
    return screen.deviceXDPI / screen.logicalXDPI;
}

