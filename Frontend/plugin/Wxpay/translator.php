<!DOCTYPE html>
<html lang="en">
<head>
    <title>外语翻译</title>
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
    <script type="text/javascript" src="js/plugins/speech/speech.sdk.bundle.js"></script>
    <script type="text/javascript" src="js/plugins/speech/speechtrans.js"></script>
    <script type="text/javascript" src="js/plugins/speech/BingSpeech.js"></script>
    <script type="text/javascript" src="js/translator.js"></script>

</head>

<body>


<div id="content">
    <div id="main-trans-content">
        <div id="main-contentTxt">
        </div>
        <div class="bottom_space"></div>

    </div>

    <div class="modal custom-modal" id="in_progress">
        <div class="modal-content">
            <div><img src="resource/image/inprogress@3x.png"></div>
            <div><span id="status-message-txt" style="color:white;">录音中</span></div>
            <!--            <div><span id="status-message-txt" style="color:white;">识别中</span></div>-->
        </div>
    </div>

    <div class="modal custom-modal" id="first_hint">
        <div class="modal-content">
            <div><span id="status-message-txt">请点击下方的麦克风按钮<br>使用语音翻译功能.</span></div>
            <!--            <div><span id="status-message-txt" style="color:white;">识别中</span></div>-->
        </div>
    </div>

    <div class="modal custom-modal" id="message_dialog">
        <div class="modal-dialog" id="alert_message_dialog">
            <div class="modal-content" style="border-radius: 12px;">
                <div class="modal-body" style="padding-bottom: 0px;">
                </div>
                <div class="modal-footer" style="border: none; padding-top: 0px;">
                    <button id="msg_cancel" type="button" class="btn_custom btn-default"
                            onclick="$('#message_dialog').hide();" style="display: none;">取消
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

    <div class="translator_footer key">
        <div class="trans-control">
            <img style="left: 0;right: auto;" onclick="backToDefault()"
                 src="resource/image/backkk@3x.png">
            <textarea id="trans-input"
                      class="trans-input" placeholder="请输入文字..."></textarea>
            <div id="getLines"></div>
            <img style="right:0;left:auto;" onclick="sendTranslationContent()"
                 src="resource/image/ggg@3x.png">
        </div>
    </div>

    <div class="translator_footer mic" style="display: none">
        <div class="trans1-select" onclick="transClicked(TRANS.LEFT)">
            <img id="trans1-btn" src="">
        </div>
        <div class="trans-control">
            <div class="lang-select-top">
<span class="lang-control-panel">
<div class="lang-left" onclick="location.href='langselect.php?id=1';">
<img id="lang1Img" src="">
<div id="lang1Txt"></div>
</div>
<div class="lang-exchange" onclick="langExchange()">
<img src="resource/image/trans-inverse.png">
</div>
<div class="lang-right" onclick="location.href='langselect.php?id=2';">
<div id="lang2Txt"></div>
<img id="lang2Img" src="">
</div>
</span>
            </div>
            <div class="lang-select-bottom">
                <img id="trans-mode" src="">
            </div>
        </div>
        <div class="trans2-select" onclick="transClicked(TRANS.RIGHT)">
            <img id="trans2-btn" src="">
        </div>
    </div>
    <!--notification for 10 seconds-->
    <div id="notification"></div>
    <div class="audio_player">
        <div style="position: relative;width:100%;height:100%">
            <audio id="music">
                <source src="" id="audioSource" type="audio/mpeg">
            </audio>
            <audio id="area_music">
                <source src="" id="area_audioSource" type="audio/mpeg">
            </audio>
        </div>
    </div>
    <div id="audio_control">
        <img src="resource/image/pause.png" onclick="playStateChanged()">
        <img class="paused" src="resource/image/pause.png" onclick="playStateChanged()">
        <label></label>
    </div>
</div>
</body>

<?php
/**
 * Created by PhpStorm.
 * User: DEV-15
 * Date: 10/21/2017
 * Time: 11:48 AM
 */
require_once "jssdk.php";
$jssdk = new JSSDK("wxb042726847dca8d3", "70e43300732636e813e59f8b2199dfc9");
$signPackage = $jssdk->GetSignPackage();

?>
<script src="https://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>
<script type="text/javascript">
    /*
    * 注意：
    * 1. 所有的JS接口只能在公众号绑定的域名下调用，公众号开发者需要先登录微信公众平台进入“公众号设置”的“功能设置”里填写“JS接口安全域名”。
    * 2. 如果发现在 Android 不能分享自定义内容，请到官网下载最新的包覆盖安装，Android 自定义分享接口需升级至 6.0.2.58 版本及以上。
    * 3. 常见问题及完整 JS-SDK 文档地址：http://mp.weixin.qq.com/wiki/7/aaa137b55fb2e0456bf8dd9148dd613f.html
    *
    * 开发中遇到问题详见文档“附录5-常见错误及解决办法”解决，如仍未能解决可通过以下渠道反馈：
    * 邮箱地址：weixin-open@qq.com
    * 邮件主题：【微信JS-SDK反馈】具体问题
    * 邮件内容说明：用简明的语言描述问题所在，并交代清楚遇到该问题的场景，可附上截屏图片，微信团队会尽快处理你的反馈。
    */
    if (sessionStorage.getItem('lang') == undefined) {
        $('#first_hint').show();
        $('#first_hint').on("click", function () {
            $(this).hide();
        });
    }

    function weixinConfigure() {
        wx.config({
            debug: false,
            appId: '<?php echo $signPackage["appId"];?>',
            timestamp: <?php echo $signPackage["timestamp"];?>,
            nonceStr: '<?php echo $signPackage["nonceStr"];?>',
            signature: '<?php echo $signPackage["signature"];?>',
            jsApiList: [
                'checkJsApi',
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'onMenuShareQQ',
                'onMenuShareWeibo',
                'hideMenuItems',
                'showMenuItems',
                'hideAllNonBaseMenuItem',
                'showAllNonBaseMenuItem',
                'translateVoice',
                'startRecord',
                'stopRecord',
                'onRecordEnd',
                'playVoice',
                'pauseVoice',
                'stopVoice',
                'uploadVoice',
                'downloadVoice',
                'chooseImage',
                'previewImage',
                'uploadImage',
                'downloadImage',
                'getNetworkType',
                'openLocation',
                'getLocation',
                'hideOptionMenu',
                'showOptionMenu',
                'closeWindow',
                'scanQRCode',
                'chooseWXPay',
                'openProductSpecificView',
                'addCard',
                'chooseCard',
                'openCard'
            ]
        });

// 4.8 监听录音播放停止
        wx.onVoicePlayEnd({
            complete: function (res) {
                alert('录音（' + res.localId + '）播放结束');
            }
        });
    }

    document.addEventListener('touchmove', function (event) {
        event = event.originalEvent || event;
        if (event.scale > 1) {
            event.preventDefault();
        }
    }, false);
</script>
<script src="js/plugins/api-6.1.js"></script>

</html>