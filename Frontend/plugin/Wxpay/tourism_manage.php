<?php
require_once "jssdk.php";
$jssdk = new JSSDK("wxb042726847dca8d3", "70e43300732636e813e59f8b2199dfc9");
$signPackage = $jssdk->GetSignPackage();

$type = 0;
$shop_id = 0;
if (isset($_GET['type'])) $type = $_GET['type'];
if (isset($_GET['shopid'])) $shop_id = $_GET['shopid'];
?>

<!DOCTYPE html>
<html>
<head lang="en">
    <title>A游不错</title>
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
    <link rel="stylesheet" href="css/menu.css">

    <script type="text/javascript" src="js/plugins/jquery.min.js"></script>
    <script type="text/javascript" src="js/plugins/bootstrap.min.js"></script>
    <script type="text/javascript" src="js/global.js"></script>
    <script type="text/javascript" src="js/sel_tourism.js"></script>
</head>
<style type="text/css">
    #search_scenic {
        display: none;
        width: 100%;
        margin: 2px 0px 0px 0px;
        padding: 20px;
        padding-top: 20px;
        background-color: white;
    }

    #container {
        display: block;
        width: 100%;
        background-color: white;
        margin-top: 2px;
        overflow-y: auto;
    }
</style>
<body>
<div id="content" style="background-color: #f6f6f6;height: 100%;width: 100%; position: absolute">
    <div class="row" id="content_header" style="width: 100%; margin: auto;">
        <span id="btn_area" onclick="searchSelected(0)">景区游</span>
        <span id="btn_course" onclick="searchSelected(1)">线路游</span>
    </div>
    <input id="test_sel" type="hidden">
    <div id="cssmenu">
        <ul>
            <li class="top_menu" id="btn_range_sel"><a><span>城市</span><i class="fa fa-fw fa-sort-desc"></i></a></li>
            <li class="top_menu" id="btn_area_sel"><a><span>景区</span><i class="fa fa-fw fa-sort-desc"></i></a></li>
            <li class="top_menu" id="btn_search"><a>搜索<i class="fa fa-fw fa-sort-desc"></i></a></li>
        </ul>
    </div>
    <div id="search_scenic" style="height: 100%;">
        <div class="has-feedback">
            <input type="text" class="form-control input-sm" onchange="filter_scenic(this.value)" placeholder="请输入景区"
                   style="background-color: #f6f6f6">
            <span class="fa fa-search form-control-feedback"></span>
        </div>
    </div>
    <div id="container" style="position: absolute;">

    </div>
    <div id="note" class="row" style="position: absolute; background-color: white; z-index: 1;width: 100%;padding: 1px;"></div>
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
</div>
</body>

<script src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>

<script type="text/javascript">
    var target_type = <?php echo $type; ?>;    // 0- national area, 1- foreign area
    var shop_id = parseInt('<?php echo $shop_id;?>');
    sessionStorage.setItem('shopid', shop_id);

    function weixinConfigure1() {
        wx.config({
            debug: false,
            appId: "<?php echo $signPackage['appId'];?>",
            timestamp: "<?php echo $signPackage['timestamp'];?>",
            nonceStr: "<?php echo $signPackage['nonceStr'];?>",
            signature: "<?php echo $signPackage['signature'];?>",
            jsApiList: [
                "checkJsApi",
                "onMenuShareTimeline",
                "onMenuShareAppMessage",
                "onMenuShareQQ",
                "onMenuShareWeibo"
            ]
        });

        window.share_config = {
            share: {
                imgUrl: "http://www.ayoubc.com/tour/plugin/Wxpay/resource/image/logo.png",
                desc: location.href,//"https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzI5MDQwMDg0NA==&scene=124#wechat_redirect",
                title: "A游不错",
                link: location.href,//"https://mp.weixin.qq.com/mp/profile_ext?action=home",
//link : "https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzI5MDQwMDg0NA==&scene=124#wechat_redirect",
                success: function () {
                },
                cancel: function () {
                }
            }
        };

        wx.ready(function () {
            wx.onMenuShareAppMessage(share_config.share);
            wx.onMenuShareTimeline(share_config.share);
            wx.onMenuShareQQ(share_config.share);
        });
    }

</script>
</html>
