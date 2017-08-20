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
    <link rel="stylesheet" href="../css/style.css"></head>

    <script type="text/javascript" src="../js/plugins/jquery.min.js"></script>
    <script type="text/javascript" src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
    <script type="text/javascript" src="../js/global.js"></script>
    <script type="text/javascript" src="../js/morescenic.js"></script>
</head>

<body>
    <div id="content">
        <div class="header" id="app_header">
            <h3 style="text-align: center">
                <a href="javascript:history.back()" style="float: left; position: fixed;left: 10px; top: 0px">
                    <img src="../resource/image/left_arrow.png" id="back_img">
                </a>
                更多景区
            </h3>
        </div>
        <div id="container" style="background-color: #f6f6f6">
            <div id="search_scenic">
                <div class="has-feedback">
                    <input type="text" class="form-control input-sm" onchange="filter_scenic(this.value)" placeholder="请输入景区">
                    <span class="glyphicon glyphicon-search form-control-feedback"></span>
                </div>
            </div>
            <div id="scenic_list">
                <div class="scenic_item">
                    <img src="../resource/image/voice.png" style="float: left; height:100%">
                    <h5 style="float: left; padding-left: 15px; font-weight: bold">景区名称</h5>
                </div>
            </div>
        </div>
    </div>
</body>
</html>