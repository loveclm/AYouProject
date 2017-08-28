var map = null;
// moving method
var walking = null;
var driving = null;
// coordinate
var start_pos = null;
var end_pos = null;

var state = -1; // 0: walk, 1: drive

window.addEventListener('resize', function(event){
    resize_route();
});

$(function(){
    resize_route();

    map = new AMap.Map('custom-map-container', {
        resizeEnable: true,
        zoom: 15,
        scrollWheel: true
    });

    //add control bar (+/-)
    map.addControl(new AMap.ToolBar({
        liteStyle: true
    }));

    walking = new AMap.Walking({
        map: map,
        panel: "app_footer"
    });
    driving = new AMap.Driving({
        policy : AMap.DrivingPolicy.LEAST_TIME,
        map: map,
        panel: "app_footer"
    });

    start_pos = sessionStorage.getObject('start_pos');
    end_pos = sessionStorage.getObject('end_pos');
    walkPathPlanning();
});

function  walkPathPlanning() {
    //根据起终点坐标规划步行路线
    if(state == 0) return;
    map.clearMap();
    $('#walk_button').html('<img src="../resource/image/map_walk.png">');
    $('#car_button').html('<img src="../resource/image/map_car_n.png">');
    $('#app_footer').html('&nbspjust a moment ...');
    walking.search(start_pos, end_pos);
}

function drivePathPlanning() {
    //根据起终点坐标规划骑行路线
    if( state == 1) return;
    map.clearMap();
    $('#walk_button').html('<img src="../resource/image/map_walk_n.png">');
    $('#car_button').html('<img src="../resource/image/map_car.png">');
    $('#app_footer').html('&nbspjust a moment ...');

    driving.search(start_pos, end_pos);
}

// resize window
function resize_route() {
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
    $('#app_header').css({width:width});
    $('#app_footer').css({width:width});

    // resize map region
    var map_top = document.getElementById('app_header').clientHeight;
    var map_bottom = document.getElementById('app_footer').clientHeight;
    var map_width = document.getElementById('content').clientWidth;
    var map_height = document.body.clientHeight - map_top - map_bottom;
    $('#container').css({display:'block',width:map_width, height:map_height, top:map_top, bottom:0});
    $('#custom-map-container').css({width:width, height:map_height-45});

    var content_margin=(document.body.clientWidth-width)/2;
    $('#back_img').css({position:'fixed',left: content_margin+10});

}
