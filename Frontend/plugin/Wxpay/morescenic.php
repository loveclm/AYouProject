<!DOCTYPE html>
<html>
<head lang="en">
    <title>更多景区</title>
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
    <link rel="stylesheet" href="css/style.css"></head>

    <script type="text/javascript" src="js/plugins/jquery.min.js"></script>
    <script type="text/javascript" src="js/plugins/bootstrap.min.js"></script>
    <script type="text/javascript" src="js/global.js"></script>
    <script type="text/javascript" src="js/morescenic.js"></script>
</head>

<body>
    <div id="content">
        <div id="container" style="background-color: #f6f6f6">
            <div id="search_scenic">
                <div class="has-feedback">
                    <input type="text" class="form-control input-sm" onchange="filter_scenic(this.value)" placeholder="请输入景区">
                    <span class="fa fa-search form-control-feedback"></span>
                </div>
            </div>
            <div id="scenic_list" style="overflow-y: scroll;">
                <!--
                <div class="scenic_item">
                    <img src="resource/image/voice.png" style="float: left; height:100%">
                    <h5 style="float: left; padding-left: 15px; font-weight: bold">景区名称</h5>
                </div> -->
            </div>
        </div>
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

</html>
