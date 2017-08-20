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

    <script type="text/javascript" src="../js/plugins/jquery.min.js"></script>
    <script type="text/javascript" src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
    <script type="text/javascript" src="../js/global.js"></script>
    <script type="text/javascript" src="../js/minescenic.js"></script>
</head>

<body>
<div id="content">
    <div class="header" id="app_header">
        <h3 style="text-align: center">
            <a href="javascript:history.back()" style="float: left; position: fixed;left: 10px; top: 0px">
                <img src="../resource/image/left_arrow.png" id="back_img">
            </a>
            我的景区
        </h3>
    </div>
    <div id="container"  style="background-color: #f6f6f6">
        <div class="nav-tabs-custom">
            <ul class="nav nav-tabs" id="tab_header">
                <li class="col-xs-4 active"><a href="#tab_all" data-toggle="tab" aria-expanded="true">全部</a></li>
                <li class="col-xs-4"><a href="#tab_using" data-toggle="tab" aria-expanded="false">使用中</a></li>
                <li class="col-xs-4"><a href="#tab_expired" data-toggle="tab" aria-expanded="false">已过期</a></li>
            </ul>
            <div class="tab-content">
                <div class="tab-pane active" id="tab_all" >
                    <div class="order order_using">
                        <div class="order_body">
                            <img src="../resource/image/tmp_order.png">
                            <div class="scenic_content">
                                <h5 style="text-align: right; color: red">使用中</h5>
                                <h5>鹤山古劳水乡</h5>
                                <h5>2017-08-07 14:30:09</h5>
                            </div>
                        </div>
                    </div>
                    <div class="order order_expired">
                        <div class="order_body">
                            <img src="../resource/image/tmp_order.png">
                            <div class="scenic_content">
                                <h5 style="text-align: right">已过期</h5>
                                <h5>鹤山古劳水乡</h5>
                                <h5>2017-07-04 15:09:33</h5>
                            </div>
                        </div>
                        <div class="order_footer">
                            <div><h5>重新购买</h5></div>
                        </div>
                    </div>
                </div>
                <!-- /.tab-pane -->
                <div class="tab-pane" id="tab_using">
                    <div class="order order_using">
                        <div class="order_body">
                            <img src="../resource/image/tmp_order.png">
                            <div class="scenic_content">
                                <h5 style="text-align: right; color: red">使用中</h5>
                                <h5>鹤山古劳水乡</h5>
                                <h5>2017-08-07 14:30:09</h5>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- /.tab-pane -->
                <div class="tab-pane" id="tab_expired">
                    <div class="order order_expired">
                        <div class="order_body">
                            <img src="../resource/image/tmp_order.png">
                            <div class="scenic_content">
                                <h5 style="text-align: right">已过期</h5>
                                <h5>鹤山古劳水乡</h5>
                                <h5>2017-07-04 15:09:33</h5>
                            </div>
                        </div>
                        <div class="order_footer">
                            <div><h5>重新购买</h5></div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- /.tab-content -->
        </div>
    </div>
</div>
</body>
</html>
