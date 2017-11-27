<?php
    $map_type = 0;
    if (isset($_GET['map_type'])) $map_type = $_GET['map_type'];
?>
<!DOCTYPE html>
<html>
<head lang="en">
    <title>导航</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
    <meta name="apple-touch-fullscreen" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <meta name="format-detection" content="telephone=no">

    <link rel="stylesheet" type="text/css" href="css/bootstrap.min.css"/>
    <link rel="stylesheet" href="css/font-awesome/css/font-awesome.min.css">
    <link rel="stylesheet" href="css/AdminLTE.min.css">
    <link rel="stylesheet" href="css/skins/_all-skins.min.css">
    <link rel="stylesheet" href="css/style.css">
    <style type="text/css">
        #path_type{
            padding-top: 10px;
            height: 45px;
        }
        #path_type div img{ width: 50%;}
        #path_type #walk_button{
            float:left;
            margin-left: 35%;
            cursor: pointer;
        }
        #path_type #car_button{
            float:left;
            margin-left: 15%;
            padding-top: 5px;
            cursor: pointer;
        }
        #custom-map-container{
            border: 1px solid #dad9d6;
        }
        .amap-call, .plan, .planTitle_route{
            display: none!important;
        }
        .amap-touch-toolbar .amap-zoomcontrol {
            bottom: -70px;
        }
    </style>
    <?php
    if($map_type == 0) {
        ?>
        <script src="https://webapi.amap.com/maps?v=1.3&key=0250860ccb5953fa5d655e8acf40ebb7&plugin=AMap.ToolBar,AMap.Walking,AMap.Driving"></script>
        <?php
    }else{
        ?>
	<script type="text/javascript" src="http://maps.google.cn/maps/api/js?key=AIzaSyBmofwXO4eBxqJY_GxcWJqoVtUnb4GtQAs&amp;sensor=false&amp;language=zh-CN&amp;libraries=places"></script>

        <?php
    }
    ?>
    <script type="text/javascript" src="js/plugins/jquery.min.js"></script>
    <script type="text/javascript" src="js/plugins/bootstrap.min.js"></script>
    <script type="text/javascript" src="js/global.js"></script>
    <script type="text/javascript" src="js/guide_route.js"></script>
</head>

<body>
    <div id="content">
        <div id="container">
            <div id="path_type">
                <div id="walk_button" onclick="walkPathPlanning()"><img src="resource/image/map_walk.png"></div>
                <div id="car_button" onclick="drivePathPlanning()"><img src="resource/image/map_car_n.png"></div>
            </div>
            <div id="custom-map-container"></div>
        </div>
        <div class="footer" id="app_footer">
        </div>
        <?php
        if($map_type == 0) {
            ?>
            <div id="panel" style="display: none"></div>
            <?php
        }else {
            ?>
            <div id="panel" style="left; 1000px;"></div>
            <?php
        }
        ?>
    </div>
    <div class="modal custom-modal" id="message_dialog">
        <div class="modal-dialog" id="alert_message_dialog">
            <div class="modal-content" style="border-radius: 12px;">
                <div class="modal-body" style="padding-bottom: 0px;">
                </div>
                <div class="modal-footer" style="border: none; padding-top: 0px;">
                    <button id="msg_cancel" type="button" class="btn_custom btn-default"
                            onclick="$('#message_dialog').modal('hide');">取消
                    </button>
                    <button id="msg_ok" type="button" class="btn_custom"
                            onclick="onOk()">确定
                    </button>
                </div>
            </div>
            <!-- /.modal-content -->
        </div>
        <!-- /.modal-dialog -->
    </div>
</body>
<?php include('footer.php'); ?>
<script type="text/javascript">
    var map_type = <?php echo $map_type; ?>;
</script>
</html>
