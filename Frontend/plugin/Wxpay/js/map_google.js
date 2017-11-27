/*
    fileName: map.js
    description: process AMap function and manage Tourist areas
*/

// variables for AMap
var map = null; // AMap pointer
var imageLayer = null;
var kk = 0;

// variables for current location
var geolocation = null;
var location_mark = null;
var location_circle = null;
var timer = null;

var state = 'new';

var infoWindow = null;
// current position
var currentLocation = [40.124315, 124.385689];
var prevLocation = [];
var bcurAudioplaying = 0;

//list for Attraction Mark
var markList = [];
var polyline = null;

/* function: initMap
    param: center // center position of current map view
*/
MyImageOverlay.prototype = new google.maps.OverlayView();


function initMap() {
    if (timer != null) clearInterval(timer);
    // loading gaode map( center = IP location)
    map = new google.maps.Map(document.getElementById('custom-map-container'), {
        zoom: 7,
        center : new google.maps.LatLng(currentLocation[0], currentLocation[1]),
        scrollWheel: true
    });

    // show mark and circle in current location
    location_circle = new google.maps.Circle({
        map: map,
        center: {lat: currentLocation[0], lng: currentLocation[1]},          //设置线覆盖物路径
        radius: 20,
        strokeColor: "#818de9", //边框线颜色
        strokeOpacity: 0.7,       //边框线透明度
        strokeWeight: 1,        //边框线宽
        fillColor: "#818de9", //填充色
        fillOpacity: 0.35//填充透明度
    });

    location_mark = new google.maps.Marker({
        map: map,
        position: {lat: currentLocation[0], lng: currentLocation[1]},
        icon: "resource/image/location.png",
        //anchor: new google.maps.Point(0, 32)
        //offset: new AMap.Pixel(-9, -8),
    });

    infoWindow = new google.maps.InfoWindow();


    // Event that closes the Info Window with a click on the map
    google.maps.event.addListener(map, 'click', function() {
        infoWindow.close();
    });

    // *
    // START INFOWINDOW CUSTOMIZE.
    // The google.maps.event.addListener() event expects
    // the creation of the infowindow HTML structure 'domready'
    // and before the opening of the infowindow, defined styles are applied.
    // *


    if (cur_scenic_data != undefined)
        map.setCenter({lat:cur_scenic_data.position[0], lng:cur_scenic_data.position[1]});

    // get current location using GPS
    timer = setInterval(function () {
        //geolocation.getCurrentPosition();
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var pos = [position.coords.latitude, position.coords.longitude];
                getLocationCompleted(pos);
                //map.setCenter(pos);
            }, function() {
                //handleLocationError(true, infoWindow, map.getCenter());
            });
        } else {
            // Browser doesn't support Geolocation
            //handleLocationError(false, infoWindow, map.getCenter());
        }
    }, 5000);
}

// show overlay image of the current scenic area
function setOverlay() {
    if (cur_scenic_data == null) return;

    if (imageLayer != null) imageLayer.setMap(null);

    var swBound = new google.maps.LatLng(cur_scenic_data.bottom_left[0], cur_scenic_data.bottom_left[1]);
    var neBound = new google.maps.LatLng(cur_scenic_data.top_right[0], cur_scenic_data.top_right[1]);
    var bounds = new google.maps.LatLngBounds(swBound, neBound);

    var srcImage = cur_scenic_data.overlay;

    imageLayer = new MyImageOverlay(bounds, srcImage, map);
}

// show the informations of the attractions and current location
function showAttractionInfos() {
    // delete old informations from the map
    //clearAllMarker();
    // add the marks of the scenic area's attractions and the mark for current location
    markList = [];
    if (cur_scenic_data == null) return;

    for (var i = 0, marker; i < cur_scenic_data.attractions.length; i++) {
        // if phone is verified, show the proper mark along purchased state, but if not then show with unpaid state
        var img_url = 'resource/image/unpaid.png';
        if (bPhoneverified == 1) {
            switch (cur_scenic_data.attractions[i].buy_state) {
                case 1:
                    img_url = 'resource/image/test.png';
                    break;
                case 2:
                    img_url = 'resource/image/paid.png';
                    break;
            }
        } else {
            if (cur_scenic_data.attractions[i].buy_state == 1) {
                img_url = 'resource/image/test.png';
            }
        }

        marker = new google.maps.Marker({
            map: map,
            icon: img_url,
            //offset: new AMap.Pixel(-15, -15),
            position: {lat:cur_scenic_data.attractions[i].position[0], lng:cur_scenic_data.attractions[i].position[1]}
        });
        markList.push(marker);
        google.maps.event.addListener(marker, 'click', function() {
            bcurAudioplaying = 0;

            var bAllpaid = 1;
            var total_cost = 0;
            var index = -1;
            for (var i = 0; i < markList.length; i++) {
                if (markList[i] == this) {
                    index = i;
                }
                if (cur_scenic_data.attractions[i].buy_state == 3) {
                    bAllpaid = 0;
                    total_cost += parseFloat(cur_scenic_data.attractions[i].cost); //* cur_scenic_data.attractions[i].discount_rate;
                }
            }
            total_cost *= parseFloat(cur_scenic_data.discount_rate);

            //实例化信息窗体
            var title = cur_scenic_data.attractions[index].name;
            var cur_attraction_cost = parseFloat(cur_scenic_data.attractions[index].cost); //* parseFloat(cur_scenic_data.discount_rate)
            var contents = [];
            contents.push('<div><h5><b>'+title+'</b></h5></div>')
            if (bAllpaid == 1) {
                if (cur_scenic_data.attractions[index].buy_state == 1)
                    contents.push('<div id="hear_button" class="info-button" onclick="processInfoEvents(1,' + index + ')">开始试听</div>');
                else
                    contents.push('<div id="hear_button" class="info-button" onclick="processInfoEvents(1,' + index + ')">开始解说</div>');

                contents.push('<div class="info-button" onclick="processInfoEvents(2,' + index + ')">为您导航</div>');
            } else {
                switch (cur_scenic_data.attractions[index].buy_state) {
                    case 1:
                        contents.push('<div id="hear_button" class="info-button" onclick="processInfoEvents(1,' + index + ')">开始试听</div>');
                        break;
                    case 2:
                        contents.push('<div id="hear_button" class="info-button" onclick="processInfoEvents(1,' + index + ')">开始解说</div>');
                        break;
                    case 3:
                        contents.push('<div class="info-button" onclick="processInfoEvents(3,' + index + ')">' + cur_attraction_cost.toFixed(2) + '元解锁景点</div>');
                        break;
                }
                contents.push('<div class="info-button" onclick="processInfoEvents(4,' + index + ')">' + total_cost.toFixed(2) + '元解锁景区</div>');
                contents.push('<div class="info-button" onclick="processInfoEvents(2,' + index + ')">为您导航</div>');
                contents.push('<div class="info-button" onclick="processInfoEvents(5,' + index + ')">授权验证</div>');
            }

            infoWindow.setContent(contents.join(''));
            infoWindow.open(map, this);
            // $($('.gm-style-iw').parent().find('img')[1]).attr('style', '');
            // $('.gm-style-iw').parent().css('width', (parseInt($('.gm-style-iw').parent().css('width'))-20)+'px');
            // $('.gm-style-iw').css('width', (parseInt($('.gm-style-iw').css('width'))-37)+'px!important');
        });
        //markerClick(marker);
    }

    // show mark and circle in current location
    location_circle = new google.maps.Circle({
        map: map,
        center: {lat: currentLocation[0], lng: currentLocation[1]},          //设置线覆盖物路径
        radius: 20,
        strokeColor: "#818de9", //边框线颜色
        strokeOpacity: 0.7,       //边框线透明度
        strokeWeight: 1,        //边框线宽
        fillColor: "#818de9", //填充色
        fillOpacity: 0.35//填充透明度
    });
    location_circle.setMap(map);

    location_mark = new google.maps.Marker({
        map: map,
        position: {lat: currentLocation[0], lng: currentLocation[1]},
        icon: "resource/image/location.png",
        //anchor: new google.maps.Point(0, 32)
        //offset: new AMap.Pixel(-9, -8),
    });

    map.setCenter({lat:cur_scenic_data.position[0], lng:cur_scenic_data.position[1]});
    map.setZoom(parseInt(cur_scenic_data.zoom) - 1);
    if (bCommentaryState == 0) explain_area_control('play');
    if (bMovable == 1) {
//        showNotification('您当前不在景区内！');
    }
}

function selectAttraction(index) {
    bcurAudioplaying = 0;
    $('#menu-detail').hide();
    var bAllpaid = 1;
    var total_cost = 0;
    for (var i = 0; i < markList.length; i++) {
        if (cur_scenic_data.attractions[i].buy_state == 3) {
            bAllpaid = 0;
            total_cost += parseFloat(cur_scenic_data.attractions[i].cost); //* cur_scenic_data.attractions[i].discount_rate;
        }
    }
    total_cost *= parseFloat(cur_scenic_data.discount_rate);

    //实例化信息窗体
    var title = cur_scenic_data.attractions[index].name;
    var cur_attraction_cost = parseFloat(cur_scenic_data.attractions[index].cost); //* parseFloat(cur_scenic_data.discount_rate)
    var contents = [];
    if (bAllpaid == 1) {
        if (cur_scenic_data.attractions[index].buy_state == 1)
            contents.push('<div id="hear_button" class="info-button" onclick="processInfoEvents(1,' + index + ')">开始试听</div>');
        else
            contents.push('<div id="hear_button" class="info-button" onclick="processInfoEvents(1,' + index + ')">开始解说</div>');

        contents.push('<div class="info-button" onclick="processInfoEvents(2,' + index + ')">为您导航</div>');
    } else {
        switch (cur_scenic_data.attractions[index].buy_state) {
            case 1:
                contents.push('<div id="hear_button" class="info-button" onclick="processInfoEvents(1,' + index + ')">开始试听</div>');
                break;
            case 2:
                contents.push('<div id="hear_button" class="info-button" onclick="processInfoEvents(1,' + index + ')">开始解说</div>');
                break;
            case 3:
                contents.push('<div class="info-button" onclick="processInfoEvents(3,' + index + ')">' + cur_attraction_cost.toFixed(0) + '元解锁景点</div>');
                break;
        }
        contents.push('<div class="info-button" onclick="processInfoEvents(4,' + index + ')">' + total_cost.toFixed(0) + '元解锁景区</div>');
        contents.push('<div class="info-button" onclick="processInfoEvents(2,' + index + ')">为您导航</div>');
        contents.push('<div class="info-button" onclick="processInfoEvents(5,' + index + ')">授权验证</div>');
    }

    var infoWindow = new google.maps.InfoWindow({content:contents.join('<br>')});
    //infoWindow.setContent(contents.join('<br>')); //createInfoWindow(title, content.join('<br>')));
    infoWindow.open(map, markList[index]);
}

//解析定位结果
function getLocationCompleted(data) {
    var cur_pos = data;
    if (bMovable == 1) {
        currentLocation = cur_pos;
        location_mark.setMap(null);
        location_circle.setMap(null);

        // check whether current location contains in the scenic area range
        if ((cur_scenic_data.bottom_left[0] < currentLocation[0]) && (cur_scenic_data.top_right[0] > currentLocation[0])
            && (cur_scenic_data.bottom_left[1] < currentLocation[1]) && (cur_scenic_data.top_right[1] > currentLocation[1])) {
            bMovable = 0;
            sessionStorage.setItem('movable', bMovable);
            //showNotification('您当前在景区内！');
        } else {
            if (kk == 0)
                showNotification('您当前不在景区内！');
            kk = 1;
        }
    } else {
        // check whether current location contains in the scenic area range
        if ((cur_scenic_data.bottom_left[0] < currentLocation[0]) && (cur_scenic_data.top_right[0] > currentLocation[0])
            && (cur_scenic_data.bottom_left[1] < currentLocation[1]) && (cur_scenic_data.top_right[1] > currentLocation[1])) {
            bMovable = 0;
        } else {

            bMovable = 1;
            sessionStorage.setItem('movable', bMovable);
            showNotification('您当前不在景区内！');
            //return;
        }
        location_circle.setMap(map);
        location_mark.setMap(map);
    }
    // move location mark and circle to new location
    // when set first location, set mark location with current location
    // and after, move mark along path(from previous location to current location)
    // if (prevLocation.length == 0) {
    //     location_mark.setPosition(cur_pos);
    // } else {
    //     var distance = Math.pow(parseFloat(cur_pos[0]) - parseFloat(currentLocation[0]), 2) + Math.pow(parseFloat(cur_pos[1]) - parseFloat(currentLocation[1]), 2);
    //     if (distance < 2.129e-8) return;
    //
    //     var path = [currentLocation, cur_pos];
    //     if (polyline != null) polyline.setMap(null);
    //     polyline = new AMap.Polyline({
    //         map: map,
    //         path: path,
    //         strokeColor: "#00A",  //线颜色
    //         strokeOpacity: 0,     //线透明度
    //         strokeWeight: 3      //线宽
    //         // strokeStyle: "solid"  //线样式
    //     });
    //     location_mark.moveAlong(path, 2000);
    // }
    var prevPosn = location_mark.getPosition();
    location_mark.setPosition({lat:data[0], lng:data[1]});
    location_mark.setIcon({
        path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
        rotation: google.maps.geometry.spherical.computeHeading(prevPosn, location_mark.getPosition())
    });

    location_circle.setCenter({lat:data[0], lng:data[1]});

    prevLocation = currentLocation;
    currentLocation = cur_pos;
    // control map view to show the current location
    if (bMovable == 0) map.setCenter({lat:currentLocation[0], lng:currentLocation[1]});

    // search a attraction near 20 meters and if exists then check options and play the attraction's audio
    for (var i = 0; i < markList.length; i++) {
        if (location_circle.containsLocation(markList[i].getPosition())) {
            if (bCommentaryState == 0) {
                start_explain_attraction(i);
            }
            break;
        }
    }


    // get scenic area id from current position
    if (bMovable == 1)
        checkCurrentLocation(currentLocation);
}

function markerClick(marker) {
    bcurAudioplaying = 0;

    var bAllpaid = 1;
    var total_cost = 0;
    var index = -1;
    for (var i = 0; i < markList.length; i++) {
        if (markList[i] == marker) {
            index = i;
        }
        if (cur_scenic_data.attractions[i].buy_state == 3) {
            bAllpaid = 0;
            total_cost += parseFloat(cur_scenic_data.attractions[i].cost); //* cur_scenic_data.attractions[i].discount_rate;
        }
    }
    total_cost *= parseFloat(cur_scenic_data.discount_rate);

    //实例化信息窗体
    var title = cur_scenic_data.attractions[index].name;
    var cur_attraction_cost = parseFloat(cur_scenic_data.attractions[index].cost); //* parseFloat(cur_scenic_data.discount_rate)
    var contents = [];
    contents.push('<div><h5>'+title+'</h5></div>')
    if (bAllpaid == 1) {
        if (cur_scenic_data.attractions[index].buy_state == 1)
            contents.push('<div id="hear_button" class="info-button" onclick="processInfoEvents(1,' + index + ')">开始试听</div>');
        else
            contents.push('<div id="hear_button" class="info-button" onclick="processInfoEvents(1,' + index + ')">开始解说</div>');

        contents.push('<div class="info-button" onclick="processInfoEvents(2,' + index + ')">为您导航</div>');
    } else {
        switch (cur_scenic_data.attractions[index].buy_state) {
            case 1:
                contents.push('<div id="hear_button" class="info-button" onclick="processInfoEvents(1,' + index + ')">开始试听</div>');
                break;
            case 2:
                contents.push('<div id="hear_button" class="info-button" onclick="processInfoEvents(1,' + index + ')">开始解说</div>');
                break;
            case 3:
                contents.push('<div class="info-button" onclick="processInfoEvents(3,' + index + ')">' + cur_attraction_cost.toFixed(2) + '元解锁景点</div>');
                break;
        }
        contents.push('<div class="info-button" onclick="processInfoEvents(4,' + index + ')">' + total_cost.toFixed(2) + '元解锁景区</div>');
        contents.push('<div class="info-button" onclick="processInfoEvents(2,' + index + ')">为您导航</div>');
        contents.push('<div class="info-button" onclick="processInfoEvents(5,' + index + ')">授权验证</div>');
    }

    var infoWindow = new google.maps.InfoWindow({content:contents.join('<br>')})
    marker.addListener('click', function(){
        infoWindow.open(map, marker);
    });
}

function processInfoEvents(index, data) {
    /* explain events
    **  1: testing hear, 2: path planning, 3: buy attraction
    **  4: buy scenic area, 5: verify with authorization code
     */
    sessionStorage.setItem('login_state', 1);

    var payment_data;
    var real_cost = 0, cost = 0;
    switch (index) {
        case 1:
            // play audio and exchange button title
            switch (bcurAudioplaying) {
                case 0:
                    if (cur_scenic_data.attractions[data].buy_state == 1)
                        $('#hear_button').html('暂停试听');
                    else
                        $('#hear_button').html('暂停解说');

                    bcurAudioplaying = 1;
                    start_explain_attraction(data);
                    $('#audio_control img').attr("src", "resource/image/pause.png");
                    $('#audio_control label').html(cur_scenic_data.attractions[data].name);
                    $('#audio_control').css({'display': 'block'});

                    $('#btn-commentary').css({
                        'background': 'url("resource/image/home_commentary_off.png") no-repeat',
                        'background-size': 'contain'
                    });
                    bCommentaryState = 1;
                    sessionStorage.setItem('explain_check', bCommentaryState);
                    explain_area_control('stop');
                    break;
                case 1:
                    if (cur_scenic_data.attractions[data].buy_state == 1)
                        $('#hear_button').html('继续试听');
                    else
                        $('#hear_button').html('继续解说');

                    bcurAudioplaying = 2;
                    explain_attraction_control("stop");
                    $('#audio_control img').attr("src", "resource/image/play.png");
                    break;
                case 2:
                    if (cur_scenic_data.attractions[data].buy_state == 1)
                        $('#hear_button').html('暂停试听');
                    else
                        $('#hear_button').html('暂停解说');

                    bcurAudioplaying = 1;
                    explain_attraction_control("play");
                    $('#audio_control img').attr("src", "resource/image/pause.png");
                    break;
            }
            break;
        case 2:
            // jump guide route page
            sessionStorage.setObject('start_pos', currentLocation);
            sessionStorage.setObject('end_pos', cur_scenic_data.attractions[data].position);

            //closeInfoWindow();
            window.location.href = "guide_route.php?map_type=1";
            break;
        case 3:
            // buy attraction
            real_cost = parseFloat(cur_scenic_data.attractions[data].cost); //* parseFloat(cur_scenic_data.discount_rate);
            payment_data = {
                type: 3,      // 1: tourism course, 2: scenic area,  3: attraction, 4: authorize code
                id: cur_scenic_data.attractions[data].id,
                name: cur_scenic_data.attractions[data].name,
                image: cur_scenic_data.attractions[data].image,
                cost: cur_scenic_data.attractions[data].cost,
                real_cost: real_cost
            };
            sessionStorage.setObject('payment_data', payment_data);

            // check phone verification state
            if (bPhoneverified == 0) {
                bAuthorizing = 0;
                sessionStorage.setItem('purchage_state', 2);
                verifyPhone();
                return;
            }
            closeInfoWindow();
            //window.location.href = 'views/purchase.html';
            preparePayment();
            break;
        case 4:
            // check phone verification state
            if (bPhoneverified == 0) {
                bAuthorizing = 0;
                sessionStorage.setItem('purchage_state', 1);
                verifyPhone();
                return;
            }
            if (cur_scenic_data == undefined) {
                return;
            }
            // buy scenic area
            for (var i = 0; i < cur_scenic_data.attractions.length; i++) {
                if (cur_scenic_data.attractions[i].buy_state == 3) {
                    cost += parseFloat(cur_scenic_data.attractions[i].cost);
                }
                real_cost = cost * parseFloat(cur_scenic_data.discount_rate);
            }
            if (real_cost == 0) {
                $('#login').hide();
                return;
            }

            payment_data = {
                type: 2,      // 1: tourism course, 2: scenic area,  3: attraction, 4: authorize code
                id: cur_scenic_data.id,
                name: cur_scenic_data.name,
                image: cur_scenic_data.image,
                cost: cost,
                real_cost: real_cost
            };
            sessionStorage.setObject('payment_data', payment_data);
            sessionStorage.setItem('login_state', 1);
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

    // var content = '<div id="iw-container">' +
    //     '<div class="iw-title">'+ title +'</div>' +
    //     '<div class="iw-content">' + content + '</div>' +
    //     '<div class="iw-bottom-gradient"></div>' +
    //     '</div>';
    //
    // return content;

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
    infoWindow.close();
    explain_attraction_control('stop');
    $('#audio_control').css({'display': 'none'});
}

function playStateChanged() {
    processInfoEvents(1, 0);
}

function clearAllMarker() {
    location_circle.setMap(null);
    location_mark.setMap(null);

    return;
    if (markList.length > 0) {
        var marker = null;
        for (marker in markList) {
            marker.setMap(null);
            marker = null;
        }

        location_mark.setMap(null);
        location_mark = null;

        location_circle.setMap(null);
        location_circle = null;
    }
}

function MyImageOverlay(bounds, image, map) {
    this.bounds_ = bounds;
    this.image_ = image;
    this.map_ = map;
    this.div_ = null;
    this.setMap(map);
}

MyImageOverlay.prototype.onAdd = function () {

    var div = document.createElement('div');
    div.style.borderStyle = 'none';
    div.style.borderWidth = '0px';
    div.style.position = 'absolute';
    var img = document.createElement('img');
    img.src = this.image_;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.opacity = '1';
    img.style.position = 'absolute';
    //img.style.border = '3px solid #38abff';
    //img.style.borderRadius = '15px'
    div.appendChild(img);
    this.div_ = div;
    var panes = this.getPanes();
    panes.overlayLayer.appendChild(div);
};

MyImageOverlay.prototype.draw = function () {
    var overlayProjection = this.getProjection();
    var sw = overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());
    var ne = overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());
    var div = this.div_;
    div.style.left = sw.x + 'px';
    div.style.top = ne.y + 'px';
    div.style.width = (ne.x - sw.x) + 'px';
    div.style.height = (sw.y - ne.y) + 'px';
};

MyImageOverlay.prototype.updateBounds = function (bounds) {
    this.bounds_ = bounds;
    this.draw();
};

MyImageOverlay.prototype.onRemove = function () {
    this.div_.parentNode.removeChild(this.div_);
    this.div_ = null;
};