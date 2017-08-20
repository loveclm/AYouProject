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
        .order_detail div{
            height: 40px;
            padding: 0px 0px;
            margin-bottom: 2px;
        }
        .footer h5{
            float: left;
            padding: 10px 20px;
        }
        .footer div{
            float: right;
            margin: 0px;
            padding: 0px 10px;
            background-color: #24c6d3;
            color: #ffffff;
        }
        .footer div:active{
            float: right;
            margin: 0px;
            padding: 0px 10px;
            background-color: #89d3d3;
            color: #ffffff;
        }

        .footer{
            padding: 0px 0px;
            border-top: 2px solid;
            border-top-color: rgba(210, 210, 210,0.4);
        }
    </style>

    <script type="text/javascript" src="../js/plugins/jquery.min.js"></script>
    <script type="text/javascript" src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
    <script type="text/javascript" src="../js/global.js"></script>
    <script type="text/javascript" src="../js/purchase.js"></script>
</head>

<body>
<div id="content">
    <div class="header" id="app_header">
        <h3 style="text-align: center">
            <a href="javascript:back()" style="float: left; position: fixed;left: 10px; top: 0px">
                <img src="../resource/image/left_arrow.png" id="back_img">
            </a>
            购买景区
        </h3>
    </div>
    <div id="container"  style="background-color: #f6f6f6">
        <div class="order order_using">
            <div class="order_body">
                <img src="../resource/image/tmp_order.png">
                <div>
                    <h5>鹤山古劳水乡</h5>
                    <h5 style="color: red">¥30.00</h5>
                </div>
            </div>
        </div>
        <div class="order_detail">
            <div style="display: none">
                <img src="../resource/image/payment_icon1.png" style="float: left; width: 25px; margin: 7px">
                <h5 style="float: left; margin-top: 13px">支付宝</h5>
                <img src="../resource/image/payment_choose_n.png" style="float: right; margin-top: 12px">
            </div>
            <div>
                <img src="../resource/image/payment_icon2.png" style="float: left; width: 25px; margin: 7px">
                <h5 style="float: left; margin-top: 13px">微信</h5>
                <img src="../resource/image/payment_choose.png" style="float: right; margin-top: 12px">
            </div>
        </div>
    </div>
    <div class="footer" id="app_footer">
        <h5 style="padding-right: 0px;">支付金额 :</h5>
        <h5 id="real_price" style="color: red">¥19.00</h5>
        <div><h5>开始导游</h5></div>
    </div>
</div>
</body>
</html>
