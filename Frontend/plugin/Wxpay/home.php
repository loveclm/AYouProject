<?php
    require_once "jssdk.php";
    $jssdk = new JSSDK("wxb042726847dca8d3", "70e43300732636e813e59f8b2199dfc9");
    $signPackage = $jssdk->GetSignPackage();

    $shop_id = 0;
    $type = 0;
    $target_id = 0;

    if(isset($_GET['shopid']))  $shop_id = $_GET['shopid'];
    if(isset($_GET['type']))    $type = $_GET['type'];
    if(isset($_GET['targetid'])) $target_id = $_GET['targetid'];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <title>A游不错</title>
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
    <link rel="stylesheet" href="css/style.css">
    <style type="text/css">
	object{
	    display:none;
	}
    </style>

    <script src="https://webapi.amap.com/maps?v=1.3&key=0250860ccb5953fa5d655e8acf40ebb7&plugin=AMap.ToolBar,AMap.Walking,AMap.Driving"></script>
    <script type="text/javascript" src="js/plugins/jquery.min.js"/>
    <script type="text/javascript" src="js/plugins/bootstrap.min.js"></script>
    <script type="text/javascript" src="js/global.js"></script>
    <script type="text/javascript" src="js/map.js"></script>
    <script type="text/javascript" src="js/main.js"></script>

</head>

<body>
    <div id="content">
        <div id="custom-map-container">
        </div>
        <div class="btn-right" id="btn-help" style="display: none" onclick="showhelp()"></div>
        <div class="btn-right" id="btn-follow" style="display: none;" onclick="settingGuanzhu()"></div>
        <div class="btn-right" id="btn-order" onclick="showOrderList()"></div>
        <div class="btn-right" id="btn-scenic" onclick="showMineScenicAreas()"></div>
        <div class="btn-right" id="btn-commentary"></div>
        <div class="btn-right" id="btn-automatic"></div>
        <div class="btn-right" id="btn-position" style="display: none;"></div>

        <!--phone number authorization dialog-->
        <div class="modal custom-modal" id="login">
            <div class="modal-dialog" id="login-dialog">
                <div class="modal-content" style="background: rgba(0,0,0,0);box-shadow: none">
                    <div class="modal-header" style="padding: 0px">
                        <img src="resource/image/bg1.png" id="top-logo" style="width: 100%">
                        <img src="resource/image/close.png" id="btn-close" onclick="Login_dialog_close()" style="cursor: pointer;">
                    </div>
                    <div class="modal-body" style="background: #ffffff">
                        <p>世界这么大， 一起去看看呗</p>
                        <p>让我带着你， 你带着钱, 现在就出发</p>
                        <p>哎呦不错， 我们的旅途从这里开始...</p>
                    </div>
                    <div class="modal-footer">
                        <div class="text-button" style="border-bottom-left-radius: 7px" onclick="verifyAuthorizationCode()">授权认证</div>
                        <div class="text-button" id="btn_online_pay" style="border-bottom-right-radius: 7px" onclick="processInfoEvents(4,0)">立即购买</div>
                    </div>
                </div>
                <!-- /.modal-content -->
            </div>
            <!-- /.modal-dialog -->
        </div>

        <!--phone number verify dialog-->
        <div class="modal custom-modal" id="phone_verify">
            <div class="modal-dialog" id="phone_verify_dialog">
                <div class="modal-content" style="height: 100%;border-radius: 12px;">
                    <div class="modal-header" id="phone_verify_title" style="padding: 0px; margin: 0px;border: none">
                        <button class="close" onclick="phone_verify_dialog_close()">
                            <span aria-hidden="true">×</span>
                        </button>
                        <img src="resource/image/top.png" style="width: 100%">
                        <div style="text-align: center">
                            <img src="resource/image/sign_in.png">
                            <h4>授权登录</h4>
                        </div>
                    </div>
                    <div class="modal-body" id="phone_verify_content">
                        <div>
                            <h5 style="float: left">手机号</h5>
                            <input type="text" class="form-control" id="phone_number" placeholder="" style="width: 76%" onkeypress="return event.charCode >= 48 && event.charCode <= 57">
                        </div>
                        <div>
                            <h5 style="float: left">验证码</h5>
                            <input type="text" class="form-control" id="verify_code" placeholder="验证码" style="width: 35%" onkeypress="return event.charCode >= 48 && event.charCode <= 57">
                            <div class="btn-custom" id="btn_sendSMS" onclick="sendSMSToPhone()"><h5>获取验证码</h5></div>
                        </div>
                    </div>
                    <div class="btn-custom" id="confirm_verify" onclick="confirm_verify_phone()">
                        <i class="fa fa-refresh fa-spin" id="loading"></i>
                        <h4 style="margin: 5px 0px">立即验证</h4>
                    </div>
                </div>
                <!-- /.modal-content -->
            </div>
            <!-- /.modal-dialog -->
        </div>

        <!--code authorization dialog-->
        <div class="modal custom-modal" id="code_auth">
            <div class="modal-dialog" id="code_auth_dialog">
                <div class="modal-content" style="height: 100%;border-radius: 12px;">
                    <div class="modal-header" id="code_auth_title" style="padding: 0px; margin: 0px;border: none">
                        <button class="close" onclick="code_auth_dialog_close()">
                            <span aria-hidden="true">×</span>
                        </button>
                        <img src="resource/image/top.png" style="width: 100%">
                        <div style="text-align: center">
                            <img src="resource/image/activation.png">
                            <h4>授权激活</h4>
                        </div>
                    </div>
                    <div class="modal-body" id="code_auth_content">
                        <div style="margin: 20px 0px">
                            <h5 style="float: left; margin-left: 5px; margin-right: 15px">授权码</h5>
                            <input type="text" class="form-control" id="auth_code" placeholder="" style="width: 70%" onkeypress="return event.charCode >= 48 && event.charCode <= 57">
                        </div>
                    </div>
                    <div id="auth_error" style="text-align:center; height:20px; display: none">
                        <h4>授权码有误，请重新输入！</h4>
                    </div>
                    <div style="margin: 10px 20px; height: 50px">
                        <div class="btn-custom" id="btn_cancel" onclick="OnCancelauthcodeVerify()">
                            <h5 style="margin: 5px 0px">取消</h5>
                        </div>
                        <div class="btn-custom" id="btn_ok" onclick="OnConfirmauthCode()">
                            <h5 style="margin: 5px 0px">确认</h5>
                        </div>

                    </div>
                </div>
                <!-- /.modal-content -->
            </div>
            <!-- /.modal-dialog -->
        </div>

        <!--property popup window along with selected menu item-->
        <div class="modal custom-modal" id="menu-detail">
            <div class="modal-dialog" id="menu-detail-dialog">
                <div class="modal-content" style="height: 100%">
                    <div class="modal-header" id="menu-detail-title" style="padding: 0px; margin: 0px">
                        <button class="close" onclick="Menu_detail_dialog_close()">
                            <span aria-hidden="true">×</span>
                        </button>
                        <h5 style="margin:5px; font-weight: bold; padding-left: 20px">景点列表</h5>
                    </div>
                    <div class="modal-body" id="menu-detail-content" style="height: 90%; padding-top: 5px">
                        <div id="detail_content_search"></div>
                        <div id="detail_content_data" style="overflow-y: scroll; height: 90%"></div>
                    </div>
                    <div class="modal-footer" style="padding: 0px; border: none">
                    </div>
                </div>
                <!-- /.modal-content -->
            </div>
            <!-- /.modal-dialog -->
        </div>

        <!--property popup window along with selected menu item-->
        <div class="modal custom-modal" id="help">
            <div class="modal-dialog" id="help-dialog">
                <div class="modal-content" style="height: 100%">
                    <div class="modal-header" id="help-dialog-title" style="padding: 5px; margin: 0px">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close" onclick="Help_dialog_close()">
                            <span aria-hidden="true">×</span>
                        </button>
                        <h3 style="font-weight: bold; text-align: center">帮助中心</h3>
                    </div>
                    <div class="modal-body" id="help-content" style="overflow-y: scroll; padding: 0px 10px">
                        <h5 style="line-height: 1.5">1. 进入景区页面， 点击“景点讲解”小图标,即可收听景点语音讲解。</h5>
                        <img src="resource/image/help1.png" style="width: 95%">
                        <h5 style="line-height: 1.5">2. 如该景区是还没有授权过的,点击“讲解”时，就会出现“授激活”的弹框，若您有购买过授权码的“输入授权码”即可;如果没有购买过该景区的授权码，您可以点击“立即购买”按钮讲行购买。</h5>
                    </div>
                    <div class="modal-footer" style="padding: 0px; border: none">
                    </div>
                </div>
                <!-- /.modal-content -->
            </div>
            <!-- /.modal-dialog -->
        </div>

        <div class="footer" id="app_footer">
            <div class="menu-item" id="menu-item1" onclick="menuClicked(1)">
                <img src="resource/image/home_icon1.png" class="menu-image">
                <h5>旅游线路</h5>
            </div>
            <div class="menu-item" id="menu-item2" onclick="menuClicked(2)">
                <img src="resource/image/home_icon2.png" class="menu-image">
                <h5>景点列表</h5>
            </div>
            <div class="menu-item" id="menu-item3" onclick="menuClicked(3)">
                <img src="resource/image/home_icon3.png" class="menu-image">
                <h5>语音类型</h5>
            </div>
            <div class="menu-item" id="menu-item4" onclick="menuClicked(4)">
                <img src="resource/image/home_icon4.png" class="menu-image">
                <h5>更多景区</h5>
            </div>
        </div>
        <!--notification for 10 seconds-->
        <div id="notification"></div>
        <div class="audio_player" >
            <div style="position: relative;width:100%;height:100%">
                <audio id="music">
                    <source src="" id="audioSource" type="audio/mpeg">
                </audio>
                <audio id="area_music" >
                    <source src="" id="area_audioSource" type="audio/mpeg">
                </audio>
            </div>
        </div>
        <div id="audio_control">
            <img src="resource/image/pause.png" onclick="playStateChanged()">
            <label></label>
        </div>
    </div>
</body>
</html>
<script src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>
<script type="text/javascript">
    var cur_menu_index = 0;
    var cur_voice_type = 1;
    var shop_id = <?php echo $shop_id?>;
    var target_type = <?php echo $type?>;
    var targetid = <?php echo $target_id?>;

function weixinConfigure(){
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
	    "desc" : window.location.href, //摘要,如果分享到朋友圈的话，不显示摘要。
	    "title" : 'A游不错(' + document.title + ')', //分享卡片标题
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
    
    function play_area_explain() {
        var audio = $('#area_music');
        var cur_scenic_area = sessionStorage.getObject('cur_scenic_area');
        var audio_src = cur_scenic_area['audio'];

        audio.attr('src', audio_src);
        audio[0].load();
        var autoplay = sessionStorage.getItem('explain_check');
        if(autoplay == 0) audio[0].play();
    }

    function start_explain_area(){
        //play_area_explain();
        document.addEventListener("WeixinJSBridgeReady", function () {
            WeixinJSBridge.invoke('getNetworkType', {}, function (e) {
                //network = e.err_msg.split(":")[1];  //结果在这里
                play_area_explain();
            });
        }, false);
    }

    function explain_area_control(data){
        if(data =="play"){
            $('#area_music').trigger('play');
        }else{
            $("#area_music").prop("currentTime",0);
            $('#area_music').trigger('pause');
        }
    }

    function play_attraction_explain(index) {
    //alert('1');
        var audio = $('#music');
        var cur_scenic_area = sessionStorage.getObject('cur_scenic_area');
        var audio_src = cur_scenic_area.attractions[index].audio_files[0];

        audio.attr('src', audio_src);
        audio[0].load();
        var autoplay = sessionStorage.getItem('auto_explain_check');
        if(autoplay == 0) audio[0].play();
    }

    function start_explain_attraction(index) {
        // play audio with the setted music type
        //play_attraction_explain(index);

        //document.addEventListener("WeixinJSBridgeReady", function () {
        //    WeixinJSBridge.invoke('getNetworkType', {}, function (e) {
                //network = e.err_msg.split(":")[1];  //结果在这里
                play_attraction_explain(index);
        //    });
        //}, false);
    }

    function explain_attraction_control(data) {
        // play audio with the setted music type
        if(data =="play"){
            $('#music').trigger('play');
        }else{
            $('#music').trigger('pause');
        }
    }

    function menuClicked(index) {
        // show the details along with menu item
        /*  1 :  show the list of tourism course ==> emit tourism course list page
        **  2 :  show the list of all the attractions in the current Scenic area
        **  3 :  show the selection voice type list
        **  4 :  show the list of all the remain scenic areas within this company ==> emit scenic area list page
        */

        clearMenuSelection();

        cur_menu_index = index;

        $('#menu-item'+index).css({color:'#24c6d3'});
        $('#menu-item'+index).children().attr('src', 'resource/image/home_icon'+index +'_n.png');

        switch(index)
        {
            case 1:  // click 旅游线路 menu item
                $('#menu-detail').hide();
                window.location.href = "tourismcourse.php";
                //clearMenuSelection();
                break;
            case 2:  // click 景点列表 menu item
                $('#menu-detail').show();
                $('#menu-detail-title').find('h5').html('景点列表');
                // get attractions within current scenic area
                display_attraction_data();

                break;
            case 3:  // click 语音类型 menu item
                $('#menu-detail').show();
                $('#menu-detail-title').find('h5').html('语音类型');

                // configure content of the voice type selection dialog
                var content_html = "";
                var captionListOfvoiceType = ['原声','美女','帅哥'];
                for( var i= 1; i < 2; i++)
                {
                    content_html += '<div style="float:left; margin: 5px; cursor:pointer;" id="voiceType'+ i +'" onclick="voiceSelected('+ i +')">'
                    content_html += '<img src="resource/image/voice' + i +'.png" style="width:40px; height:40px">';
                    content_html += '<h5 style="text-align: center">' + captionListOfvoiceType[i-1] + '</h5></div>';
                }

                $('#detail_content_data').html(content_html);
                $('#detail_content_search').html('');

                // show previous state
                if(cur_voice_type != 0)
                    $('#voiceType'+cur_voice_type).css({color:'#24c6d3'});

                break;
            case 4:  // click 更多景区 menu item
                $('#menu-detail').hide();
                window.location.href = "morescenic.php";
                //clearMenuSelection();
                break
        }
    }

    function voiceSelected(index){

        if(cur_voice_type != 0)
        {
            $('#voiceType'+cur_voice_type).css({color:'#000000'});
        }

        cur_voice_type = index
        $('#voiceType'+index).css({color:'#24c6d3'});
    }

    function Login_dialog_close(){
        $('#login').hide();
        sessionStorage.setItem('login_state', 1);
    }

    function clearMenuSelection(){
        if(cur_menu_index != 0)
        {
            $('#menu-item'+cur_menu_index).css({color:'#000000'});
            $('#menu-item'+cur_menu_index).children().attr('src', 'resource/image/home_icon'+cur_menu_index +'.png');
        }

        cur_menu_index = 0;
    }

    function Menu_detail_dialog_close(){
        $('#menu-detail').hide();
        clearMenuSelection();
    }

    function settingGuanzhu(){
        // check phone verification state
        // window.location.href = 'views/guanzhu.html';
    }

    function showOrderList(){
        // check phone verification state
        if(bPhoneverified == 0) {
            bAuthorizing = 0;
            verifyPhone();
            return;
        }
        window.location.href = 'views/order.html';
    }

    function showMineScenicAreas(){
        // check phone verification state
        if(bPhoneverified == 0) {
            bAuthorizing = 0;
            verifyPhone();
            return;
        }
        window.location.href = 'views/minescenic.html';
    }

    function showhelp(){
        $('#help').show();

        var help_header_height = $('#help-dialog-title').css('height');
        var help_dialog_height = $('#help-dialog').css('height');
        var content_height = parseInt(help_dialog_height) - parseInt(help_header_height);
        $('#help-content').css({height: content_height-10});
        showDialogToCenter('help-dialog');
    }

    function Help_dialog_close(){
        $('#help').hide();
    }
</script>
