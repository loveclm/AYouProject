/**
 * Created by Administrator on 8/8/2017.
 */

var scenic_list = [];
var filter_str = "";

$(function(){
    resize_scenic();
    loadScenicAreas();
});

window.addEventListener('resize', function(event){
    resize_scenic();
});

function loadScenicAreas(){
    scenic_list = localStorage.getObject('scenic_areas');
    if(scenic_list === null)
        getScenicAreasFromServer();
    else
        display_scenic_data();
}

function display_scenic_data(){
    //------- show the scenic list
    // show individual scenic data
    var content_html = "";
    for( var i = 0; i < scenic_list.length; i++){
        if(scenic_list[i]['name'].indexOf(filter_str) >= 0) {
            content_html += '<div class="scenic_item" id="scenic_item' + (i + 1) + '" onclick="selectScenicArea(' + i + ')">';
            content_html += '<img src="../resource/image/voice.png" style="float: left; height:100%">';
            content_html += '<h5 style="float: left; padding-left: 15px; font-weight: bold">' + scenic_list[i]['name'] + '</h5></div>';
            // define eventListener
        }
    }
    $('#scenic_list').html(content_html);
}

function selectScenicArea(index){
    var new_scenic_id = scenic_list[index]['id'];
    localStorage.setItem('new_scenic_id', new_scenic_id);

    window.location.href = '../index.php';
}

function filter_scenic(search_text){
    filter_str = search_text;

    display_scenic_data();
}

function resize_scenic(){
    initRatio = getDevicePixelRatio();
    var ratio = getDevicePixelRatio()/initRatio;
    var width = document.body.clientWidth
        || document.documentElement.clientWidth
        || window.innerWidth;

    var height = document.body.clientHeight
        || document.documentElement.clientHeight
        || window.innerHeight;
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

}
