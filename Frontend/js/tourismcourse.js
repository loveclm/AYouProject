/**
 * Created by Administrator on 8/8/2017.
 */
var tourism_list = [];
var tourismColors = ['#90d4e7','#fc8797','#fdc029','#01c8cf','#acacac'];

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
        content_html += '<img src="../image/more.png" style="float:right; padding:10px"></div>';
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
    content_html += '<div class="btn-custom btn-course"><h5>支付' + total_cost +'元，解锁线路</h5></div>';
    content_html += '<div class="btn-custom btn-course"><h5>输入授权码</h5></div>';

    $('#buy_course_content').html(content_html);
    $('#buy_course').show();

    // store id and cost of the selected tourism course
    var cur_tourism_id = tourism_list[index]['id'];
    var cur_tourism_cost = total_cost;
    localStorage.setItem('cur_tourism_id', cur_tourism_id);
    localStorage.setItem('cur_tourism_cost', cur_tourism_cost);
}

function resize_tourism_course(){
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
    $('#container').css({display:'block',width:map_width, height:map_height, top:map_top, bottom:0});

    var content_margin=(document.body.clientWidth-width)/2;
    $('#back_img').css({position:'fixed',left: content_margin+10});
    $('#buy_course_dialog').css({width:map_width *0.9});
}
