<?php
    require_once "jssdk.php";
    $jssdk = new JSSDK("wxb042726847dca8d3", "70e43300732636e813e59f8b2199dfc9");
    $signPackage = $jssdk->GetSignPackage();
?>
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
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.5.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="css/AdminLTE.min.css">
    <link rel="stylesheet" href="css/skins/_all-skins.min.css">
    <link rel="stylesheet" href="css/style.css"></head>

    <script type="text/javascript" src="js/plugins/jquery.min.js"></script>
    <script type="text/javascript" src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
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
</body>
</html>
<script src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>
<script type="text/javascript">
    function weixinConfigure_morescenic(){
          wx.config({
              debug: false,
              appId: '<?php echo $signPackage["appId"];?>',
              timestamp: <?php echo $signPackage["timestamp"];?>,
              nonceStr: '<?php echo $signPackage["nonceStr"];?>',
              signature: '<?php echo $signPackage["signature"];?>',
	      jsApiList: [
                  // 所有要调用的 API 都要加到这个列表中
                  'checkJsApi',
                  'onMenuShareTimeline',//
                  'onMenuShareAppMessage',
                  'onMenuShareQQ',
                  'onMenuShareWeibo'
              ]
          });
                                                                                                                                                                                                                                                                                                          
          window.share_config = {
              "share": {
                  "imgUrl": "http://www.ayoubc.com/tour/plugin/Wxpay/resource/image/logo.png",//分享图，默认当相对路径处理，所以使用绝对路径的的话，“http://”协议前缀必须在。
                  "desc" : window.location.href,//摘要,如果分享到朋友圈的话，不显示摘要。
                  "title" : 'A游不错(' + document.title + ')',//分享卡片标题
                  "link": window.location.href,//分享出去后的链接，这里可以将链接设置为另一个页面。
                  "success":function(){//分享成功后的回调函数
                      },
                  'cancel': function () {
                      // 用户取消分享后执行的回调函数
                  }
    	     }
          };

          wx.ready(function () {
              // 在这里调用 API
	      wx.onMenuShareAppMessage(share_config.share);//分享给好友
              wx.onMenuShareTimeline(share_config.share);//分享到朋友圈
              wx.onMenuShareQQ(share_config.share);//分享给手机QQ
         });
      }
</script>