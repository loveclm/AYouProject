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
        #logo{
            margin: 20px;
            height: 100px
        }
        #logo img{
            float: left;
            width: 25%;
        }
        #logo h3{
            float:left;
            padding-left: 30px;
            padding-top: 15px;
            font-weight: bold;
        }

        .row_item{
            padding: 15px;
            padding-left: 20px;
            margin: 1px;
            background-color: #ffffff;
            height: 60px;
        }

        .row_item h4{
            float: left;
        }

        #btn_guanzhu{
            margin: 20px;
            padding-top: 1px;
            background-color: #0caf0c;
            height: 60px;
            text-align: center;
            color:#ffffff;
            border-radius: 10px;
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
                详细资料
            </h3>
        </div>
        <div id="container"  style="background-color: #f6f6f6">
            <div id="logo">
                <img src="../resource/image/logo.png">
                <h3>A游不错</h3>
            </div>
            <div class="row_item">
                <h4 style="font-weight: bold" >功能介绍</h4>
                <h4 style="padding-left: 35px">足不出户游遍世界!</h4>
            </div>
            <div class="row_item">
                <h4 style="font-weight: bold" >帐号主体</h4>
                <h4 style="padding-left: 35px">北京乐成互动科技有限公司</h4>
            </div>
            <div class="row_item" style="margin-top: 20px;">
                <h4 style="font-weight: bold" >查看历史消息</h4>
            </div>

            <div id="btn_guanzhu" onclick="guanzhuSettings()"><h3 style="font-weight: bold">关注</h3></div>
        </div>
    </div>
</body>
</html>

<script type="text/javascript">
    $(function(){
        resize_guanzhu();
    });
</script>