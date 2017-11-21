var map = null;
// moving method
var walking = null;
var driving = null;
// coordinate
var start_pos = null;
var end_pos = null;

var state = -1; // 0: walk, 1: drive

var directionsDisplay = null;
var directionsService = null;


window.addEventListener('resize', function(event){
    resize_route();
});

$(function() {
    resize_route();

    start_pos = sessionStorage.getObject('start_pos');
    end_pos = sessionStorage.getObject('end_pos');

    if (map_type == 0){
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
            policy: AMap.DrivingPolicy.LEAST_TIME,
            map: map,
            panel: "app_footer"
        });


    }else{    // loading gaode map( center = IP location)
        map = new google.maps.Map(document.getElementById('custom-map-container'), {
            zoom: 7,
            center: new google.maps.LatLng(start_pos[0], start_pos[1]),
            scrollWheel: true
        });

        directionsDisplay = new google.maps.DirectionsRenderer;
        directionsService = new google.maps.DirectionsService;

        directionsDisplay.setMap(map);
        directionsDisplay.setPanel(document.getElementById('panel'));

        start_pos = [start_pos[0], start_pos[1]];
        end_pos = [end_pos[0], end_pos[1]];
    }

    walkPathPlanning();
});

function  walkPathPlanning() {
    //根据起终点坐标规划步行路线
    if(state == 0) return;

    if(map_type == 0) {
        map.clearMap();
        $('#walk_button').html('<img src="resource/image/map_walk.png">');
        $('#car_button').html('<img src="resource/image/map_car_n.png">');
        //$('#app_footer').html('&nbspjust a moment ...');
        walking.search(start_pos, end_pos);
    }else{
        directionsService.route({
            origin: {lat: start_pos[0], lng: start_pos[1]},  // Haight.
            destination: {lat: end_pos[0], lng: end_pos[1]},  // Ocean Beach.
            // Note that Javascript allows us to access the constant
            // using square brackets and a string value as its
            // "property."
            travelMode: google.maps.TravelMode['WALKING']
        }, function(response, status) {
            if (status == 'OK') {
                directionsDisplay.setDirections(response);
                $('#app_footer').html($('.adp-summary').html());
            } else {
                $('#app_footer').html('');
                showMessage('抱歉，无法找到导航路线', 2);
            }
        });
    }
}

function drivePathPlanning() {
    //根据起终点坐标规划骑行路线
    if( state == 1) return;
    if(map_type == 0) {
        map.clearMap();
        $('#walk_button').html('<img src="resource/image/map_walk_n.png">');
        $('#car_button').html('<img src="resource/image/map_car.png">');
        //$('#app_footer').html('&nbspjust a moment ...');

        driving.search(start_pos, end_pos);
    }else{
        directionsService.route({
            origin: {lat: start_pos[0], lng: start_pos[1]},  // Haight.
            destination: {lat: end_pos[0], lng: end_pos[1]},  // Ocean Beach.
            // Note that Javascript allows us to access the constant
            // using square brackets and a string value as its
            // "property."
            travelMode: google.maps.TravelMode['DRIVING']
        }, function(response, status) {
            if (status == 'OK') {
                directionsDisplay.setDirections(response);
                $('#app_footer').html($('.adp-summary').html());
            } else {
                $('#app_footer').html('');
                showMessage('抱歉，无法找到导航路线', 2);
            }
        });
    }
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
    //$('#app_header').css({width:width});
    //$('#app_footer').css({width:width});

    // resize map region
    var map_top = 0; //document.getElementById('app_header').clientHeight;
    var map_bottom = 0;//document.getElementById('app_footer').clientHeight;
    var map_width = document.getElementById('content').clientWidth;
    var map_height = document.body.clientHeight - map_top - map_bottom;
    $('#container').css({display:'block',width:map_width, height:map_height, top:map_top, bottom:0});
    $('#custom-map-container').css({width:width, height:map_height-45});

    var content_margin=(document.body.clientWidth-width)/2;
    //$('#back_img').css({position:'fixed',left: content_margin+10});

}
