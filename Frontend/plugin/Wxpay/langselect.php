<?php
$pageId = $_GET['id'];
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <title>语言选择</title>
    <meta charset="utf-8">
    <link rel="shortcut icon" href="resource/image/logo.png" type="image/x-icon"/>
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

    <script type="text/javascript" src="js/plugins/jquery.min.js"/>
    <script type="text/javascript" src="js/plugins/bootstrap.min.js"></script>
    <script type="text/javascript" src="js/global.js"></script>
    <script type="text/javascript" src="js/langselect.js"></script>
    <script type="text/javascript">
        var pageId=<?php echo $pageId;?>;
    </script>
</head>

<body>


<div id="content">
    <div id="main-trans-content">
        <div class="lang-bar" style="display:none;">
            <div class="left-lang">
                <div><img id="lang1Img" src=""></div>
                <div class="lang-text"><span id="lang1Txt"></span></div>
            </div>
            <div class="right-lang">
                <div class="lang-text"><span id="lang2Txt"></span></div>
                <div><img id="lang2Img" src=""></div>
            </div>
        </div>
        <div style="text-align: left;margin: calc(100vh*0.09) 0 5px 0;">全部语言
            <a style="float:right; color:red;display: none;"
                  onclick="$('#message_dialog').show();">
                删除翻译记录
            </a>
        </div>
        <div id="lang-select-list">

        </div>
    </div>

    <div class="modal custom-modal" id="message_dialog">
        <div class="modal-dialog" id="alert_message_dialog">
            <div class="modal-content" style="border-radius: 12px;">
                <div class="modal-body" style="padding-bottom: 0px;">是否删除翻译记录？
                </div>
                <div class="modal-footer" style="border: none; padding-top: 0px;">
                    <button id="msg_cancel" type="button" class="btn_custom btn-default"
                            onclick="$('#message_dialog').hide();">取消
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


    <div class="modal custom-modal" id="in_progress">
        <div class="modal-content">
            <div><img src="resource/image/home_icon5.png"></div>
            <div><span style="color:white;">录音中</span></div>
        </div>
    </div>

    <!--notification for 10 seconds-->
    <div id="notification"></div>
</div>
</body>
</html>
