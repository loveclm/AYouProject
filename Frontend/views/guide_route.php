<!DOCTYPE html>
<html>
<head lang="en">
    <title>A游不错</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
    <meta name="apple-touch-fullscreen" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <meta name="format-detection" content="telephone=no">

    <link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"/>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.5.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="../css/AdminLTE.min.css">
    <link rel="stylesheet" href="../css/skins/_all-skins.min.css">
    <link rel="stylesheet" href="../css/style.css">
    <style type="text/css">
        #path_type{
            padding-top: 10px;
            height: 45px;
        }
        #path_type div img{ width: 50%;}
        #path_type #walk_button{
            float:left;
            margin-left: 35%;
        }
        #path_type #car_button{
            float:left;
            margin-left: 15%;
            padding-top: 5px
        }
        #custom-map-container{
            border: 1px solid #dad9d6;
        }
        .amap-call, .plan, .planTitle_route{
            display: none!important;
        }
    </style>

    <script src="https://webapi.amap.com/maps?v=1.3&key=0250860ccb5953fa5d655e8acf40ebb7&plugin=AMap.ToolBar,AMap.Walking,AMap.Driving"></script>
    <script type="text/javascript" src="../js/plugins/jquery.min.js"></script>
    <script type="text/javascript" src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
    <script type="text/javascript" src="../js/global.js"></script>
    <script type="text/javascript" src="../js/guide_route.js"></script>
</head>

<body>
    <div id="content">
        <div class="header" id="app_header">
            <h3 style="text-align: center">
                <a href="javascript:history.back()" style="float: left; position: fixed;left: 10px; top: 0px">
                    <img src="../resource/image/left_arrow.png" id="back_img">
                </a>
                导航
            </h3>
        </div>
        <div id="container">
            <div id="path_type">
                <div id="walk_button" onclick="walkPathPlanning()"><img src="../resource/image/map_walk.png"></div>
                <div id="car_button" onclick="drivePathPlanning()"><img src="../resource/image/map_car_n.png"></div>
            </div>
            <div id="custom-map-container"></div>
        </div>
        <div class="footer" id="app_footer">
            footer
        </div>
        <div id="panel" style="display: none"></div>
    </div>
</body>
</html>
