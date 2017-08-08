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
        /*


        isFirst = true;
        var path = e.obj.getPath();
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


        console.log(e.obj.getPath());//获取路径
        console.log(e.obj);
        e.obj.Destroy();

    });


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

