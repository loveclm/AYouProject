/*
    fileName: map.js
    description: process AMap function and manage Tourist areas
*/

// variables for AMap
var map = null; // AMap pointer
var imageLayer = null;
var infoWindow = null; // property window

// variables for current location
var geolocation =  null;
var location_mark = null;
var location_circle = null;
var timer = null;

var state = 'new';

// current position
var currentLocation = [116.396991, 39.91829];
var prevLocation = [];
var bcurAudioplaying = 0;

//list for Attraction Mark
var markList = [];
var polyline = null;

/* function: initMap
    param: center // center position of current map view
*/
function initMap() {
    if(timer != null) clearInterval(timer);

    // loading gaode map( center = IP location)
    map = new AMap.Map('custom-map-container', {
        resizeEnable: true,
        zoom: 15,
        scrollWheel: true
    });

    //add control bar (+/-)
    map.addControl(new AMap.ToolBar({
        liteStyle: true
    }));

    infoWindow = new AMap.InfoWindow({isCustom:true, offset: new AMap.Pixel(16, -30)});

    // add plugin to get current GPS location
    map.plugin('AMap.Geolocation', function() {
        geolocation = new AMap.Geolocation({
            enableHighAccuracy: true,//是否使用高精度定位，默认:true
            timeout: 10000,          //超过10秒后停止定位，默认：无穷大
            buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
            zoomToAccuracy: true      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        });
        //map.addControl(geolocation);
        geolocation.getCurrentPosition();
        AMap.event.addListener(geolocation, 'complete', getLocationCompleted);//返回定位信息
    });

    // show mark and circle in current location
    location_circle = new AMap.Circle({
        map: map,
        center: currentLocation,          //设置线覆盖物路径
        radius: 20,
        strokeColor: "#818de9", //边框线颜色
        strokeOpacity: 0.7,       //边框线透明度
        strokeWeight: 1,        //边框线宽
        fillColor: "#818de9", //填充色
        fillOpacity: 0.35//填充透明度
    });
    location_circle.setMap(map);

    location_mark = new AMap.Marker({
        map: map,
        position: currentLocation,
        icon: "resource/image/location.png",
        offset: new AMap.Pixel(-9, -8),
        autoRotation: true
    });
    location_mark.setMap(map);

    // get current location using GPS
    timer = setInterval(function () {
        if(bMovable == 0) {      // in the case showing the scenic area along current location
            geolocation.getCurrentPosition();
            /*
            var dx = (cur_scenic_data.attractions[0].position[0] - cur_scenic_data.attractions[4].position[0])/30;
            var dy = (cur_scenic_data.attractions[0].position[1] - cur_scenic_data.attractions[4].position[1])/30;
            tmp_pos = [currentLocation[0]+dx, currentLocation[1]+dy];
            onComplete();
            */
        }else{          // if not then don't check current location and show current scenic area
            if(cur_scenic_data == null) return;
            if(prevLocation != cur_scenic_data.position)  map.setCenter(cur_scenic_data.position);
            prevLocation = cur_scenic_data.position;
        }
    }, 5000);

    checkCurrentLocation(currentLocation);
}

// show overlay image of the current scenic area
function  setOverlay() {
    if( cur_scenic_data == null ) return;
    if(imageLayer != null) imageLayer.setMap(null);

    imageLayer = new AMap.ImageLayer({
        url: cur_scenic_data.overlay,
        bounds: new AMap.Bounds(
            cur_scenic_data.bottom_left,   //左下角
            cur_scenic_data.top_right    //右上角
        ),
        zooms: [15, 18]
    });

    imageLayer.setMap(map);
}

// show the informations of the attractions and current location
function  showAttractionInfos() {
    // delete old informations from the map
    //clearAllMarker();

    // add the marks of the scenic area's attractions and the mark for current location
    markList = [];
    if(cur_scenic_data == null) return;

    for (var i = 0, marker; i < cur_scenic_data.attractions.length; i++) {
        // if phone is verified, show the proper mark along purchased state, but if not then show with unpaid state
        var img_url = 'resource/image/unpaid.png';
        if(bPhoneverified == 1){
            switch (cur_scenic_data.attractions[i].buy_state)
            {
                case 1:
                    img_url = 'resource/image/test.png';
                    break;
                case 2:
                    img_url = 'resource/image/paid.png';
                    break;
            }
        }else{
            if(cur_scenic_data.attractions[i].buy_state == 1) {
                img_url = 'resource/image/test.png';
            }
        }

        marker = new AMap.Marker({
            map: map,
            icon: img_url,
            offset: new AMap.Pixel(-15, -15),
            position: cur_scenic_data.attractions[i].position
        });
        marker.setMap(map);
        marker.on('click', markerClick);

        markList.push(marker);
    }

    // show mark and circle in current location
    location_circle = new AMap.Circle({
        map: map,
        center: currentLocation,          //设置线覆盖物路径
        radius: 20,
        strokeColor: "#818de9", //边框线颜色
        strokeOpacity: 0.7,       //边框线透明度
        strokeWeight: 1,        //边框线宽
        fillColor: "#818de9", //填充色
        fillOpacity: 0.35//填充透明度
    });
    location_circle.setMap(map);

    location_mark = new AMap.Marker({
        map: map,
        position: currentLocation,
        icon: "resource/image/location.png",
        offset: new AMap.Pixel(-9, -8),
        autoRotation: true
    });
    location_mark.setMap(map);
    start_explain_area();
    if(bAutomaticState == 1) explain_area_control('stop');
}

//解析定位结果
function getLocationCompleted(data) {
    var cur_pos = [data.position.getLng(), data.position.getLat()];
    // move location mark and circle to new location
    // when set first location, set mark location with current location
    // and after, move mark along path(from previous location to current location)
    if(prevLocation.length == 0) {
        location_mark.setPosition(cur_pos);
    }else{
        var distance = Math.pow(parseFloat(cur_pos[0])-parseFloat(currentLocation[0]),2) + Math.pow(parseFloat(cur_pos[1])-parseFloat(currentLocation[1]),2);
        if(distance < 2.129e-8) return;

        var path = [currentLocation, cur_pos];
        if(polyline != null ) polyline.setMap(null);
        polyline = new AMap.Polyline({
            map: map,
            path: path,
            strokeColor: "#00A",  //线颜色
            strokeOpacity: 0,     //线透明度
            strokeWeight: 3,      //线宽
            // strokeStyle: "solid"  //线样式
        });
        location_mark.moveAlong(path,2000);
    }
    location_circle.setCenter(cur_pos);

    prevLocation = currentLocation;
    currentLocation = cur_pos;
    // control map view to show the current location
    map.setCenter(currentLocation);

    // search a attraction near 20 meters and if exists then check options and play the attraction's audio
    for( var i = 0; i < markList.length; i++){
        if(location_circle.contains(markList[i].getPosition())){
            if(bAutomaticState == 0 && bCommentaryState == 0){
                start_explain_attraction(i);
            }
            break;
        }
    }

    // get scenic area id from current position
    checkCurrentLocation(currentLocation);
}

function markerClick(e) {
    bcurAudioplaying = 0;

    var bAllpaid = 1;
    var total_cost = 0;
    var index = -1;
    for( var i = 0; i < markList.length; i++){
        if(markList[i] == e.target){
            index = i;
        }
        if(cur_scenic_data.attractions[i].buy_state == 3) {
            bAllpaid = 0;
            total_cost += parseFloat( cur_scenic_data.attractions[i].cost); //* cur_scenic_data.attractions[i].discount_rate;
        }
    }
    total_cost *= parseFloat( cur_scenic_data.discount_rate);

    //实例化信息窗体
    var title = cur_scenic_data.attractions[index].name;
    var cur_attraction_cost = parseFloat(cur_scenic_data.attractions[index].cost) * parseFloat(cur_scenic_data.attractions[index].discount_rate)
    content = [];
    if(bAllpaid == 1){
        content.push('<div id="hear_button" class="info-button" onclick="processInfoEvents(1,'+ index+')">开始试听</div>');
        content.push('<div class="info-button" onclick="processInfoEvents(2,'+ index+')">为您导航</div>');
    }else{
        switch (cur_scenic_data.attractions[index].buy_state){
            case 1:
            case 2:
                content.push('<div id="hear_button" class="info-button" onclick="processInfoEvents(1,'+ index+')">开始试听</div>');
                break;
            case 3:
                content.push('<div class="info-button" onclick="processInfoEvents(3,'+ index+')">' + cur_attraction_cost.toFixed(0) + '元解锁景点</div>');
                break;
        }
        content.push('<div class="info-button" onclick="processInfoEvents(4,'+ index+')">' + total_cost.toFixed(0) + '元解锁景区</div>');
        content.push('<div class="info-button" onclick="processInfoEvents(2,'+ index+')">为您导航</div>');
        content.push('<div class="info-button" onclick="processInfoEvents(5,'+ index+')">授权验证</div>');
    }
    infoWindow.setContent(createInfoWindow(title, content.join('<br>')));
    infoWindow.open(map, e.target.getPosition());
}

function processInfoEvents(index, data) {
    /* explain events
    **  1: testing hear, 2: path planning, 3: buy attraction
    **  4: buy scenic area, 5: verify with authorization code
     */
    var payment_data;
    var real_cost = 0, cost = 0;
    switch (index){
        case 1:
            // play audio and exchange button title
            switch (bcurAudioplaying){
                case 0:
                    $('#hear_button').html('暂停试听');
                    bcurAudioplaying = 1;
                    start_explain_attraction(data);
                    break;
                case 1:
                    $('#hear_button').html('继续解说');
                    bcurAudioplaying = 2;
                    explain_attraction_control("stop");
                    break;
                case 2:
                    $('#hear_button').html('暂停试听');
                    bcurAudioplaying = 1;
                    explain_attraction_control("play");
                    break;
            }
            break;
        case 2:
            // jump guide route page
            sessionStorage.setObject('start_pos',currentLocation);
            sessionStorage.setObject('end_pos', cur_scenic_data.attractions[data].position);

            closeInfoWindow();
            window.location.href = "views/guide_route.html";
            break;
        case 3:
            // check phone verification state
            if(bPhoneverified == 0) {
                bAuthorizing = 0;
                verifyPhone();
                return;
            }
            // buy attraction
            real_cost = parseFloat(cur_scenic_data.attractions[data].cost) * parseFloat(cur_scenic_data.attractions[data].discount_rate);
            payment_data = {
                type : 3,      // 1: tourism course, 2: scenic area,  3: attraction, 4: authorize code
                id : cur_scenic_data.attractions[data].id,
                name: cur_scenic_data.attractions[data].name,
                image: cur_scenic_data.attractions[data].image,
                cost: cur_scenic_data.attractions[data].cost,
                real_cost: real_cost
            };
            sessionStorage.setObject('payment_data', payment_data);

            closeInfoWindow();
            //window.location.href = 'views/purchase.html';
            preparePayment();
            break;
        case 4:
            // check phone verification state
            if(bPhoneverified == 0) {
                bAuthorizing = 0;
                verifyPhone();
                return;
            }
            // buy scenic area
            for( var i = 0; i < cur_scenic_data.attractions.length; i++)
            {
                if(cur_scenic_data.attractions[i].buy_state == 3){
                    cost += parseFloat(cur_scenic_data.attractions[i].cost);
                    real_cost += parseFloat( cur_scenic_data.attractions[i].cost) * parseFloat( cur_scenic_data.attractions[i].discount_rate);
                }
            }
            payment_data = {
                type : 2,      // 1: tourism course, 2: scenic area,  3: attraction, 4: authorize code
                id : cur_scenic_data.id,
                name: cur_scenic_data.name,
                image: cur_scenic_data.image,
                cost: cost,
                real_cost: real_cost
            };
            sessionStorage.setObject('payment_data', payment_data);

            closeInfoWindow();
            //window.location.href = 'views/purchase.html';
            preparePayment();
            break;
        case 5:
            // verify authorization code
            closeInfoWindow();
            verifyAuthorizationCode();
            break;
    }
}
//构建自定义信息窗体
function createInfoWindow(title, content) {
    var info = document.createElement("div");
    info.className = "info";

    //可以通过下面的方式修改自定义窗体的宽高
    //info.style.width = "400px";
    // 定义顶部标题
    var top = document.createElement("div");
    var titleD = document.createElement("div");
    var closeX = document.createElement("img");
    top.className = "info-top";
    titleD.innerHTML = title;
    closeX.src = "https://webapi.amap.com/images/close2.gif";
    closeX.onclick = closeInfoWindow;

    top.appendChild(titleD);
    top.appendChild(closeX);
    info.appendChild(top);

    // 定义中部内容
    var middle = document.createElement("div");
    middle.className = "info-middle";
    middle.style.backgroundColor = 'white';
    middle.innerHTML = content;
    info.appendChild(middle);

    // 定义底部内容
    var bottom = document.createElement("div");
    bottom.className = "info-bottom";
    bottom.style.position = 'relative';
    bottom.style.top = '0px';
    bottom.style.margin = '0 auto';
    var sharp = document.createElement("img");
    sharp.src = "https://webapi.amap.com/images/sharp.png";
    bottom.appendChild(sharp);
    info.appendChild(bottom);
    return info;
}

//关闭信息窗体
function closeInfoWindow() {
    map.clearInfoWindow();
    //explain_attraction_control('stop');
}

function  clearAllMarker() {
    location_circle.setMap(null);
    location_mark.setMap(null);

    return;
    if(markList.length > 0){
        var marker = null;
        for( marker in markList){
            marker.setMap(null);
            marker = null;
        }

        location_mark.setMap(null);
        location_mark = null;

        location_circle.setMap(null);
        location_circle = null;
    }
}