/*
    Usage in html
 <script type="text/javascript" src="http://api.map.baidu.com/api?v=2.0&ak=WOR15aX870MejqbOtiNH15rWL3COZxxR"></script>
 <script src="http://libs.baidu.com/jquery/1.9.0/jquery.js"></script>
 <script src="./js/mylocation.js"></script>

 <div id="container"></div>

 */


var map = null;
var geolocation =  null;
var walking = null;
var timer = null;

var interval = 3000;
var zoom = 17;
var previousPoint = null;
var index = 0;  //for test
$(document).ready(function(){

    var map = new AMap.Map('custom-map-container', {
        resizeEnable: true,
        zoom:13,
        center: [116.403322, 39.900255]//地图中心点
    });

    var editor={};
    var isFirst = false;
    var mouseTool = new AMap.MouseTool(map); //在地图中添加MouseTool插件
    var drawRectangle = mouseTool.rectangle(); //用鼠标工具画矩形

    AMap.event.addListener( mouseTool,'draw',function(e){

        if(isFirst) return;
        mouseTool.close();
        isFirst = true;
        var path = e.obj.getPath();

        /*
        editor._polygon=(function(){
            // var arr = [ //构建多边形经纬度坐标数组
          //      [116.403322,39.920255],
          //      [116.410703,39.897555],
          //      [116.402292,39.892353],
          //      [116.389846,39.891365]
          //  ];
            var arr = [ //构建多边形经纬度坐标数组
                [path[0].lng, path[0].lat],
                [path[1].lng, path[1].lat],
                [path[2].lng, path[2].lat],
                [path[3].lng, path[3].lat]
            ];
            return new AMap.Polygon({
                map: map,
                path: arr,
                strokeColor: "#0000ff",
                strokeOpacity: 1,
                strokeWeight: 3,
                fillColor: "#f5deb3",
                fillOpacity: 0.35
            });
        })();

        editor._polygonEditor= new AMap.PolyEditor(map, editor._polygon);
        editor._polygonEditor.open();
*/

        var arr = [
            [path[0].lng, path[0].lat],
            [path[2].lng, path[2].lat]
        ];
        console.log(arr);
        console.log(e.obj.getPath());//获取路径
        $('#area-position').val(JSON.stringify(arr));
    });


    // Variable to store your files
    var files;


    $('#upload-overlay').on('change', prepareUpload);
    function prepareUpload(event)
    {
        event.stopPropagation(); // Stop stuff happening
        event.preventDefault(); // Totally stop stuff happening
        files = event.target.files;

        var data = new FormData();
        $.each(files, function(key, value){
            data.append(key, value);
        });

        //data.append('root', $('#root-path').val());

        $.ajax({
            url: 'api/Areas/upload',
            type: 'POST',
            data: data,
            cache: false,
            dataType: 'json',
            processData: false, // Don't process the files
            contentType: false, // Set content type to false as jQuery will tell the server its a query string request
            success: function(data, textStatus, jqXHR)
            {
                if(typeof data.error === 'undefined')
                {

                    console.log(data);
                    if(data['status'] == true){
                        $('#area-overlay').val(data['file']);
                    }
                }
                else
                {
                    // Handle errors here
                    console.log('ERRORS: ' + data.error);
                }
            },
            error: function(jqXHR, textStatus, errorThrown)
            {
                // Handle errors here
                console.log('ERRORS: ' + textStatus);
                // STOP LOADING SPINNER
            }
        });

    }




});

function theLocation() {
    var city = document.getElementById("cityName").value;
    if(city != ""){
        map.centerAndZoom(city, 17);
    }
}

function take_location() {

    geolocation.getCurrentPosition(function(r){
        if(this.getStatus() == BMAP_STATUS_SUCCESS){
            var curPoint = r.point;
            var distance = 0;
            ///// For test ///
            //curPoint.lat += index * 0.1;
            //console.log(curPoint);
            //index++;

            //  curPoint.lat = 30.2844280000;
            //  curPoint.lng = 120.0371370000;

            //curPoint.lat = 30.2440880000;
            // curPoint.lng = 120.2168520000;

            if(previousPoint != null) {

                distance = map.getDistance(curPoint,previousPoint);
            }

            //console.log(distance);
            //console.log(map.getDistance(curPoint,tagetPoint));
            ////////

            if(previousPoint == null || distance > 100){

                if(walking) map.clearOverlays();
                walking = new BMap.WalkingRoute(map, {renderOptions:{map: map, autoViewport: true}});
                walking.search(curPoint, tagetPoint);

                walking.setSearchCompleteCallback(function(){
                    var pts = walking.getResults().getPlan(0).getRoute(0).getPath();

                    var polyline = new BMap.Polyline(pts, {strokeColor:"green", strokeWeight:4, strokeOpacity:0.5, strokeStyle:"solid"});
                    map.addOverlay(polyline);

                });


                previousPoint = curPoint;
            }
        }
    },{enableHighAccuracy: true});

}

function addPointShow() {

    $('.point-add-view').show();
    $('.point-list-view').hide();
}

function addPoint(param) {
    var pointName = $('#pointname').val();
    var pointDescription = $('#pointdescription').val();
    var pointPrice = $('#pointprice').val();

    $('.point-add-view').hide();
    $('.point-list-view').show();
    $( "#pointList" ).append( "<li><div class='col-sm-4'>" + pointName + "</div>" +
        "<input style='display: none;' value='" + pointDescription+"'/>" +
        "<input style='display: none;' value='" + pointPrice+"'/>" +
        "<div class='col-sm-4'>编辑</div><div class='col-sm-4'>删除</div></li>" );
}

function addTouristArea() {
    var area = $("#areaname").val();
    var rate = $("#arearate").val();
    var overlay = $('#area-overlay').val();

    var info = {
        overay: overlay,
        position: JSON.parse($('#area-position').val()),
        audio: ''
    };

    var touristArea = {
        name: area, discount_rate: rate, address: '', status: 0, type: 1, info: JSON.stringify(info),
                            point_list: getAttractions()
        };

    $.post("api/Areas/save", touristArea, function(result){

        console.log(result);
    });

    return;
}

function getAttractions() {
    var ret = [];
    var list = document.getElementById('pointList');
    var pointList = list.getElementsByTagName('li');

    for(var i = 0; i < pointList.length; i++){

        var pointInfo = $(pointList[i]).children();
        var pointName = $(pointInfo[0]).text();
        var pointDescription = $(pointInfo[1]).val();
        var pointPrice = $(pointInfo[2]).val();
        var point = {name: pointName, description: pointDescription, price: pointPrice, image: '', audio: '', trial: ''};
        ret.push(point);
    }
    return JSON.stringify(ret);
}

function deleteAreaConfirm(id) {
    $('#custom-confirm-delete-view').show();
    $('#current-areaid').val(id);
}

function deleteArea(url, type) {

    $('#custom-confirm-delete-view').hide();
    if(type == 1){

        $.post(url + "api/Areas/remove/" + $('#current-areaid').val(), function(result){
            location.href = url + 'area';
        });
    }
}

function deployAreaConfirm(id) {

    $('#custom-confirm-deploy-view').show();
    $('#current-areaid').val(id);
    $('#current-areastatus').val(1);
}

function undeployAreaConfirm(id) {

    $('#custom-confirm-deploy-view').show();
    $('#current-areaid').val(id);
    $('#current-areastatus').val(0);
}

function deployArea(url, type) {

    $('#custom-confirm-deploy-view').hide();
    if(type == 1){

        var touristArea = {
            id: $('#current-areaid').val(),
            status: $('#current-areastatus').val()
        };

        $.post(url + "api/Areas/save/" + touristArea['id'], touristArea, function(result){
            location.href = url + 'area';
        });
    }
}

function searchArea(url) {
    var name = $('#searchName').val();
    var address = $('#searchAddress :selected').val();
    var status = $('#searchStatus :selected').val();
    name = name == '' ? 'all': name;

    location.href = url + 'area/listing/' + name+ '/' + address + '/' + status;

}

function uploadOveray() {
    $('#upload-overlay').click();
}