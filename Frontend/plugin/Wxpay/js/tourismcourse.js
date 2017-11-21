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
    bPhoneverified = parseInt(localStorage.getItem('phone_verified'));
    if(bPhoneverified == 0)
        localStorage.setItem('phone_number', "");
    else
        phone_num = localStorage.getItem('phone_number');

    check_authCode();
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
    weixinConfigure2();
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
        content_html += '<img src="resource/image/more.png" style="float:right; padding:10px"></div>';
    }
    $('#tourismlist-body').html(content_html);
}

function showcourse(index){
    //sessionStorage.setItem('targetid', tourism_list[index]['id']);
    var shop_id = sessionStorage.getItem('shopid');
    window.location.href = 'tourism.php?shopid=\'' + shop_id + "\'&targetid=" + tourism_list[index]['id'];
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
    var map_height = height - map_top;
    $('#container').css({display:'block',width:map_width, height:map_height, top:map_top, bottom:0});

    var content_margin=(document.body.clientWidth-width)/2;
    $('#back_img').css({position:'fixed',left: content_margin+10});


    var header_height = document.getElementById('tourismlist-header').clientHeight;
    $('#tourismlist-body').css({height:map_height-header_height-4});
}
