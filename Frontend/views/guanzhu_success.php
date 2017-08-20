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
        .i_button{
            text-align: center;
            border:1px solid;
            border-radius: 15px;
            border-color: #17b5dc;
            color: #17b5dc;
        }
        .i_button:active{
            text-align: center;
            border:1px solid;
            border-radius: 15px;
            border-color: #17b5dc;
            color: #ffffff;
            background-color: #17b5dc;
        }
    </style>

    <script type="text/javascript" src="../js/plugins/jquery.min.js"></script>
    <script type="text/javascript" src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
    <script type="text/javascript" src="../js/global.js"></script>
    <script type="text/javascript" src="../js/guanzhu.js"></script>
</head>

<body>
    <div id="content">
        <div class="header" id="app_header">
            <h3 style="text-align: center">
                <a href="javascript:history.back()" style="float: left; position: fixed;left: 10px; top: 0px">
                    <img src="../resource/image/left_arrow.png" id="back_img">
                </a>
                关注成功
            </h3>
        </div>
        <div id="container">
            <div style="text-align: center; margin-top: 100px">
                <img src="../resource/image/success.png">
                <h3 style="font-weight: bold">关注成功</h3>
            </div>
            <div class="row" style="margin-top: 20%">
                <div class="col-xs-4 col-xs-offset-1 i_button"><h4>进入公众号</h4></div>
                <div class="col-xs-4 col-xs-offset-2 i_button" onclick="showMainpage()"><h4>返回景区</h4></div>
            </div>
        </div>
    </div>
</body>
</html>
