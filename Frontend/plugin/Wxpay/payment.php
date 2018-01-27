<?php
header('Access-Control-Allow-Origin: *');
//header('Content-type: text/plain');

    ini_set('date.timezone','Asia/Shanghai');
    //error_reporting(E_ERROR);
    require_once "lib/WxPay.Api.php";
    require_once "WxPay.JsApiPay.php";
    require_once 'log.php';

    //初始化日志
    $logHandler= new CLogFileHandler("logs/".date('Y-m-d').'.log');
    $log = Log::Init($logHandler, 15);

    //①、获取用户openid
    $tools = new JsApiPay();
    $openId = $tools->GetOpenid();
    // get Payment parameter
    $total_fee = floatval($_GET['cost'])*100;
    $buy_type = $_GET['type'];
    $product_name = $_GET['product'];

    //②、统一下单
    $input = new WxPayUnifiedOrder();
    $input->SetBody($buy_type.'('.$product_name.')');
    $input->SetAttach("A游不错");
    $input->SetOut_trade_no(WxPayConfig::MCHID.date("YmdHis"));
    $input->SetTotal_fee($total_fee);
    $input->SetTime_start(date("YmdHis"));
    $input->SetTime_expire(date("YmdHis", time() + 600));
    $input->SetGoods_tag($product_name);
    $input->SetNotify_url('http://www.ayoubc.com/tour/plugin/Wxpay/notify.php');
    $input->SetTrade_type("JSAPI");
    $input->SetOpenid($openId);
    $order = WxPayApi::unifiedOrder($input);

    $jsApiParameters = $tools->GetJsApiParameters($order);
?>

<html>
<head lang="en">
    <title><?= $buy_type ?></title>
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
            cursor: pointer;
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

    <script type="text/javascript" src="js/plugins/jquery.min.js"></script>
    <script type="text/javascript" src="js/plugins/bootstrap.min.js"></script>
    <script type="text/javascript" src="js/global.js"></script>
</head>

<body>
<div id="content">
    <div id="container"  style="background-color: #f6f6f6">
        <div class="order order_using">
            <div class="order_body">
                <img src="resource/image/logo.png">
                <div>
                    <h5>鹤山古劳水乡</h5>
                    <h5 style="color: red">¥30.00</h5>
                </div>
            </div>
        </div>
        <div class="order_detail">
            <div style="display: none">
                <img src="resource/image/payment_icon1.png" style="float: left; width: 25px; margin: 7px">
                <h5 style="float: left; margin-top: 13px">支付宝</h5>
                <img src="resource/image/payment_choose_n.png" style="float: right; margin-top: 12px">
            </div>
            <div>
                <img src="resource/image/payment_icon2.png" style="float: left; width: 25px; margin: 7px">
                <h5 style="float: left; margin-top: 13px">微信</h5>
                <img src="resource/image/payment_choose.png" style="float: right; margin-top: 12px">
            </div>
        </div>
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

    <div class="footer" id="app_footer">
        <h5 style="padding-right: 0px;">支付金额 :</h5>
        <h5 id="real_price" style="color: red">¥19.00</h5>
        <div onclick="sendOrder()"><h5>立即支付</h5></div>
    </div>
</div>
</body>

<script type="text/javascript">
    var payment_data = null;
    var bPhoneverified = 0;
    var phone_num = "";
    var new_orderID = "";

    //调用微信JS api 支付
    function jsApiCall()
    {
        WeixinJSBridge.invoke(
            'getBrandWCPayRequest',
            <?php echo $jsApiParameters; ?>,
            function(res){
                WeixinJSBridge.log(res.err_msg);
                switch (res.err_msg){
                    case 'get_brand_wcpay_request:ok':
                        sendPaidOrderRequest();
                        break;
                    case 'get_brand_wcpay_request:cancel':
                        showMessage('支付未完成', 2);
                        break;
                    case 'get_brand_wcpay_request:fail':
                        showMessage('支付失败', 2);
                        break;
                }
                //alert(res.err_code+res.err_desc+res.err_msg);
            }
        );
    }

    function callpay()
    {
        if (typeof WeixinJSBridge == "undefined"){
            if( document.addEventListener ){
                document.addEventListener('WeixinJSBridgeReady', jsApiCall, false);
            }else if (document.attachEvent){
                document.attachEvent('WeixinJSBridgeReady', jsApiCall);
                document.attachEvent('onWeixinJSBridgeReady', jsApiCall);
            }
        }else{
            jsApiCall();
        }
    }

    $(function(){
        bPhoneverified = parseInt(localStorage.getItem('phone_verified'));
        if(bPhoneverified != '1')
            localStorage.setItem('phone_number', "");
        else
            phone_num = localStorage.getItem('phone_number');

        display_data();
        resize_buypage();
    });

    window.addEventListener('resize', function(event){
        resize_buypage();
    });

    function back(){
        sessionStorage.removeItem('payment_data');
        history.back();
    }

    function sendOrder(){
        // send the order information to back-end
        var phone_num = localStorage.getItem('phone_number');
        //alert(phone_num);
        var shop_id = sessionStorage.getItem('shopid');

        var order_status = sessionStorage.getItem('order_status');
        
        if(order_status == 'pay'){
            sessionStorage.removeItem('order_status');
            new_orderID = payment_data['id'];
            console.log('order success.' + new_orderID);
            // weixin payment
            callpay();
            return;
        }
        console.log(payment_data);
        $.ajax({
            type: 'POST',
            url: SERVER_URL + 'api/Areas/setAreaBuyOrder',
            dataType: 'json',
            // username:'admin',
            // password:'1234',
            data: {'shop':shop_id,'phone' : phone_num, 'id':payment_data['id'], 'type':payment_data['type'], 'cost':payment_data['real_cost']},
            success: function (data) {
                if (data.status == false) {
                    showMessage('订单取消了。', 2);
                    return;
                }
                new_orderID = data['result'];
                console.log('order success.' + new_orderID);
                // weixin payment
                callpay();
            },
            error: function (data) {
                showMessage('订单失败了。', 2);
            }
        });
    }

var kkkk=0;
    function  sendPaidOrderRequest() {
        var phone_num = localStorage.getItem('phone_number');
        var shop_id = sessionStorage.getItem('shopid');
        var qr_areaid = sessionStorage.getItem('qr_areaid');
        if( qr_areaid == undefined) qr_areaid = 0;
        
        // send payment state to server
        $.ajax({
            type : 'POST',
            url : 'http://www.ayoubc.com/backend/api/Areas/setPayOrder',
            dataType : 'json',
            data : { 'id': new_orderID, 'phone': phone_num, 'shop':shop_id, 'cost':payment_data['real_cost'], 'qr_areaid':qr_areaid},
            success: function (data) {
                new_orderID = "";
                // receive order detail information
                sessionStorage.setObject('cur_order', data.result);
                kkkk=0;
                window.location.href = 'views/payment_success.html';
            }
        }).fail(function(res){
        	kkkk++;
        	if(kkkk<5){
                    setTimeout(function(){setsendPaidOrderRequest();}, 2000);
                }
		else{
		    kkkk=0;
		    showMessage('网络正忙.', 2);
		}    
        });
    }

    // loading payment page
    function display_data(){
        //loading the information of the selected order
        payment_data = sessionStorage.getObject('payment_data');
        if(payment_data == null){
            return;
        }
        //------- show the scenic list
        var content_html = "";

        content_html = '<img src="resource/image/logo.png">';
        content_html += '<div><h5>'+payment_data['name']+'</h5>';
        content_html += '<h5 style="color: red">¥'+parseFloat(payment_data['real_cost']).toFixed(2)+'</h5></div>';

        $('.order_body').html(content_html);
        $('#real_price').html('¥' + parseFloat(payment_data['real_cost']).toFixed(2));
    }

    function resize_buypage(){
        initRatio = getDevicePixelRatio();
        var ratio = getDevicePixelRatio()/initRatio;
        var width = document.body.clientWidth
            || document.documentElement.clientWidth
            || window.innerWidth;

        var height = document.body.clientHeight
            || document.documentElement.clientHeight
            || window.innerHeight;
        var scale = Math.min(width/640,height/1010) * ratio;

        //width = 640*scale;
        $('#content').css({width:width, height:height});
        //$('#app_header').css({width:width});
        $('#app_footer').css({width:width});

        // resize map region
        var map_top = 0;//document.getElementById('app_header').clientHeight;
        var map_width = document.getElementById('content').clientWidth;
        var map_height = document.body.clientHeight - map_top;
        $('#container').css({display:'block',width:map_width, height:map_height, top:map_top, bottom:0});

        var content_margin=(document.body.clientWidth-width)/2;
        $('#back_img').css({position:'fixed',left: content_margin+10});
    }

</script>

</html>