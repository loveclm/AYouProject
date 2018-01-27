<?php
/**
 * Created by PhpStorm.
 * User: DEV-15
 * Date: 10/26/2017
 * Time: 1:14 PM
 */

if (!empty($_POST)) {
    if (isset($_POST['money'])) onWechatPay();
    else if (isset($_POST['paying'])) onConfirmPay();
}

function get_client_ip()
{
    $ipAddr = '';
    if (getenv('HTTP_CLIENT_IP'))
        $ipAddr = getenv('HTTP_CLIENT_IP');
    else if (getenv('HTTP_X_FORWARDED_FOR'))
        $ipAddr = getenv('HTTP_X_FORWARDED_FOR');
    else if (getenv('HTTP_X_FORWARDED'))
        $ipAddr = getenv('HTTP_X_FORWARDED');
    else if (getenv('HTTP_FORWARDED_FOR'))
        $ipAddr = getenv('HTTP_FORWARDED_FOR');
    else if (getenv('HTTP_FORWARDED'))
        $ipAddr = getenv('HTTP_FORWARDED');
    else if (getenv('REMOTE_ADDR'))
        $ipAddr = getenv('REMOTE_ADDR');

    return $ipAddr;
}

function onWechatPay()
{
    $money = $_POST['money'] * 100; //商品价格
    // 前台请求的参数
    $title = $_POST['title'];       //商品名称
    $orderid = $_POST['orderid'];     //订单id


    $nonce_str = "hcuasduvihasdiovjerjgvujsaru";    //随机字符串
    $appid = "wxb042726847dca8d3";                 //在微信开放平台中的　appid(先要创建一个移动应用)
    $mch_id = "1487647712";                         //商户号，在商户平台中查看
    $key = "wxaewdkj27823skuwsdh843slk29sfxu";   //在微信开放平台中的　
    $notify_url = "http://www.ayoubc.com/tour/plugin/Wxpay/notify.php"; //用户支付完后微信会来触发这个脚本，是处理业务逻辑的地方

    $client_ip = get_client_ip();
    //订单号可以灵活使用，在异步回调的时候方便直接操作用户
    $out_trade_no = $orderid;

    // 下面的参数含义直接看文档
    $tmpArr = array(
        'appid' => $appid,      //不要填成了 公众号原始id
        'mch_id' => $mch_id,
        'nonce_str' => $nonce_str,
        'notify_url' => $notify_url,
        'out_trade_no' => $out_trade_no,
        'attach' => $title,
        'body' => $title,
        'spbill_create_ip' => $client_ip, //$_SERVER['REMOTE_ADDR'],
        'total_fee' => $money,
        'scene_info' => "{'h5_info': {'type':'Wap','wap_url': 'http://www.ayoubc.com/tour/plugin/Wxpay/payment_h5.php','wap_name': 'A游不错'}}",
        'trade_type' => 'MWEB'
    );

    // 签名逻辑官网有说明，签名步骤就不解释了
    ksort($tmpArr);

    $buff = "";
    foreach ($tmpArr as $k => $v) {
        $buff .= $k . "=" . $v . "&";
    }
    $buff = trim($buff, "&");

    $stringSignTemp = $buff . "&key=" . $key;
    $sign = strtoupper(md5($stringSignTemp)); //签名

    $xml = "<xml>
               <appid>" . $appid . "</appid>
               <attach>" . $title . "</attach>
               <body>" . $title . "</body>
               <mch_id>" . $mch_id . "</mch_id>
               <nonce_str>" . $nonce_str . "</nonce_str>
               <notify_url>" . $notify_url . "</notify_url>
               <out_trade_no>" . $out_trade_no . "</out_trade_no>
               <spbill_create_ip>" . $client_ip . "</spbill_create_ip>  
               <total_fee>" . $money . "</total_fee>
               <trade_type>MWEB</trade_type>
               <scene_info>{'h5_info': {'type':'Wap','wap_url': 'http://www.ayoubc.com/tour/plugin/Wxpay/payment_h5.php','wap_name': 'A游不错'}}</scene_info>
               <sign>" . $sign . "</sign>
            </xml> ";

    $posturl = "https://api.mch.weixin.qq.com/pay/unifiedorder";
    $ch = curl_init($posturl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $xml);

    $response = curl_exec($ch);
    curl_close($ch);

    $xmlobj = json_decode(json_encode(simplexml_load_string($response, 'SimpleXMLElement', LIBXML_NOCDATA)));
    exit(json_encode(['url' => $xmlobj->mweb_url, 'return_msg' => json_encode($xmlobj)]));
}

function onConfirmPay()
{
    $nonce_str = "hcuasduvihasdiovjerjgvujsaru";    //随机字符串
    $appid = "wxb042726847dca8d3";                 //在微信开放平台中的　appid(先要创建一个移动应用)
    $mch_id = "1487647712";                         //商户号，在商户平台中查看
    $key = "wxaewdkj27823skuwsdh843slk29sfxu";   //在微信开放平台中的　

    $out_trade_no = $_POST['orderid'];
    // 下面的参数含义直接看文档
    $tmpArr = array(
        'appid' => $appid,      //不要填成了 公众号原始id
        'mch_id' => $mch_id,
        'nonce_str' => $nonce_str,
        'out_trade_no' => $out_trade_no,
    );

    // 签名逻辑官网有说明，签名步骤就不解释了
    ksort($tmpArr);

    $buff = "";
    foreach ($tmpArr as $k => $v) {
        $buff .= $k . "=" . $v . "&";
    }
    $buff = trim($buff, "&");

    $stringSignTemp = $buff . "&key=" . $key;
    $sign = strtoupper(md5($stringSignTemp)); //签名

    $xml = "<xml>
               <appid>" . $appid . "</appid>
               <mch_id>" . $mch_id . "</mch_id>
               <nonce_str>" . $nonce_str . "</nonce_str>
               <out_trade_no>" . $out_trade_no . "</out_trade_no>
               <sign>" . $sign . "</sign>
            </xml> ";


    $posturl = "https://api.mch.weixin.qq.com/pay/orderquery";
    $ch = curl_init($posturl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $xml);

    $response = curl_exec($ch);
    curl_close($ch);

    $xmlobj = json_decode(json_encode(simplexml_load_string($response, 'SimpleXMLElement', LIBXML_NOCDATA)));

    exit(json_encode($xmlobj));
}

?>

<html>
<head>
    <meta charset="UTF-8">
    <link rel="shortcut icon" href="resource/image/logo.png" type="image/x-icon"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
    <meta name="apple-touch-fullscreen" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <meta name="format-detection" content="telephone=no">

    <link rel="stylesheet" type="text/css" href="css/bootstrap.min.css"/>
    <link rel="stylesheet" href="css/style.css">
    <style type="text/css">
        .order_detail div {
            height: 40px;
            padding: 0px 0px;
            margin-bottom: 2px;
        }

        .footer h5 {
            float: left;
            padding: 10px 20px;
        }

        .footer div {
            float: right;
            margin: 0px;
            padding: 0px 10px;
            background-color: #24c6d3;
            color: #ffffff;
            cursor: pointer;
        }

        .footer div:active {
            float: right;
            margin: 0px;
            padding: 0px 10px;
            background-color: #89d3d3;
            color: #ffffff;
        }

        .footer {
            padding: 0px 0px;
            border-top: 2px solid;
            border-top-color: rgba(210, 210, 210, 0.4);
        }
    </style>

    <script type="text/javascript" src="js/plugins/jquery.min.js"></script>
    <script type="text/javascript" src="js/plugins/bootstrap.min.js"></script>
</head>
<body>
<div id="content">
    <div id="container" style="background-color: #f6f6f6">
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
    <div class="footer" id="app_footer">
        <h5 style="padding-right: 0px;">支付金额 :</h5>
        <h5 id="real_price" style="color: red">¥19.00</h5>
        <div onclick="sendOrder()"><h5>立即支付</h5></div>
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
</div>
</body>
<script type="text/javascript" src="js/global.js"></script>
<script type="text/javascript">
    var payment_data = null;
    var new_orderID = "";

    window.addEventListener('resize', function (event) {
        resize_buypage();
    });


    $(function () {
        var money = parseFloat(<?= isset($_GET['cost']) ? $_GET['cost'] : 0; ?>);
        console.log(money);

        display_data();
        resize_buypage();

        var status = sessionStorage.getItem('paying');
        //if (parseFloat(money) == 0) {
        if (status == '1') {
            setTimeout(confirmPay, 2000);
        }
        //}
    });

    function preparePay() {
        var str = "<?= isset($_GET['title']) ? $_GET['title'] : ''; ?>";
        if (str != '') document.title = str;

        console.log('pay start');

        var payInfo = {};

        payInfo.orderid = new_orderID;
        
        payInfo.title = document.title;
        payInfo.money = <?= isset($_GET['cost']) ? $_GET['cost'] : 0.01;?>;
        console.log(payInfo);

        sessionStorage.removeItem('paying');
        sessionStorage.removeItem('pay_orderID');
        $.ajax({
            url: "payment_h5.php",
            type: "post",
            dataType: 'json',
            data: {
                'orderid': payInfo.orderid,
                'title': payInfo.title,
                'money': payInfo.money
            },
            success: function (result) {
                console.log(result);
                var res = JSON.parse(result.return_msg);
                if (result.url != '' || result.url != null) {
                    if (res.return_code == 'FAIL') {
                        console.log('payment failed.( result_code = fail)');
                        showMessage("支付失败。", 2);
                        return;
                    }

                    var redirect_url = 'http://www.ayoubc.com/tour/plugin/Wxpay/payment_h5.php';
                    //alert(result.url);
                    location.href = result.url+ '&redirect_url=' + encodeURI(redirect_url);

		    sessionStorage.setItem('userpaying',0);
		    sessionStorage.setItem('history', 1);
                    sessionStorage.setItem('paying', 1);
                    sessionStorage.setItem('pay_orderID', payInfo.orderid);
                    //setTimeout(funtion(){confirmPay();}, 1500);
                } else {
                    console.log('payment failed.( mweb_url empty)');
                    showMessage("支付失败。", 2);
                }
            },
            fail: function (result) {
                console.log('request fail');
                showMessage(result, 2);
            }
        });
    }

    function confirmPay() {
        //alert('confirm');
        console.log('confirm');
        new_orderID = sessionStorage.getItem('pay_orderID');

        $.ajax({
            url: "payment_h5.php",
            type: "post",
            dataType: 'json',
            data: {
                'paying': 1,
                'orderid': new_orderID
            },
            success: function (result) {
                console.log(result);
                //alert(JSON.stringify(result));

                if (result.return_code == 'FAIL') {
                    console.log(result.return_msg);
                    //alert(result.return_msg);
                    return;
                } else if (result.result_code == 'FAIL') {
                    console.log('wechat system error');
                    //alert(result.return_msg);
                    reConfirmPay();
                    return;
                }
                //alert(result.trade_state);
                switch (result.trade_state) {
                    case 'SUCCESS':
                        sessionStorage.removeItem('paying');
                        //sessionStorage.removeItem('pay_orderID');
                        showMessage('微信支付成功。', 2);
                        sendPaidOrderRequest();
                        console.log('pay success : ' + result.trade_state);
                        break;
                    case 'NOTPAY':
                        var userpaying = sessionStorage.getItem('userpaying');
                        if (userpaying == '0') {
                            //alert('取消支付！');
                            if (sessionStorage.getItem('history') == '1') {
                                sessionStorage.removeItem('history');
                                history.go(-2);
                            }
                            reConfirmPay();
                        } else {
                            //alert('取消支付！');
                            sessionStorage.removeItem('userpaying');
                        }
                        console.log('pay cancel : ' + result.trade_state);
                        //history.go(-2);
                        break;
                    case 'USERPAYING':
                        showMessage('reconfirm', 2);
                        sessionStorage.setItem('userpaying', 1);
                        reConfirmPay();
                        console.log('reconfirm pay status : ' + result.trade_state);
                        break;
                    case 'REFUND':
                    case 'CLOSED':
                    case 'REVOKED':
                    case 'PAYERROR':
                        console.log('pay error : ' + result.trade_state);
                        //alert('支付失败。');
                        break;
                }
            },
            fail: function (result) {
                showMessage(result, 2);
            }
        });
    }

    function reConfirmPay() {
        confirmPay();
    }

    function sendOrder() {
        // send the order information to back-end
        var phone_num = localStorage.getItem('phone_number');
        //alert(phone_num);
        var shop_id = sessionStorage.getItem('shopid');

        var order_status = sessionStorage.getItem('order_status');

        if (order_status == 'pay') {
            sessionStorage.removeItem('order_status');
            new_orderID = payment_data['id'];
            console.log('order success.' + new_orderID);
            // weixin payment
            preparePay();
            return;
        }
        console.log(payment_data);
        $.ajax({
            type: 'POST',
            url: SERVER_URL + 'api/Areas/setAreaBuyOrder',
            dataType: 'json',
            data: {
                'shop': shop_id,
                'phone': phone_num,
                'id': payment_data['id'],
                'type': payment_data['type'],
                'cost': payment_data['real_cost']
            },
            success: function (data) {
                if (data.status == false) {
                    showMessage('订单取消了。', 2);
                    return;
                }
                new_orderID = data['result'];
                console.log('order success.' + new_orderID);
                // weixin payment
                preparePay();
            },
            error: function (data) {
                showMessage('订单失败了。');
            }
        });
    }

    var kkkk = 0;

    function sendPaidOrderRequest() {
        var phone_num = localStorage.getItem('phone_number');
        var shop_id = sessionStorage.getItem('shopid');
        var qr_areaid = sessionStorage.getItem('qr_areaid');
        if (qr_areaid == undefined) qr_areaid = 0;

        // send payment state to server
        $.ajax({
            type: 'POST',
            url: 'http://www.ayoubc.com/backend/api/Areas/setPayOrder',
            dataType: 'json',
            data: {
                'id': new_orderID,
                'phone': phone_num,
                'shop': shop_id,
                'cost': payment_data['real_cost'],
                'qr_areaid': qr_areaid
            },
            success: function (data) {
                new_orderID = "";
                // receive order detail information
                sessionStorage.setObject('cur_order', data.result);
                kkkk = 0;
                window.location.href = 'views/payment_success.html';
            }
        }).fail(function (res) {
            kkkk++;
            //sessionStorage.removeItem('pay_orderID');  // param[ weixin out_trade_no ]
            if (kkkk < 5) {
                setTimeout(function () {
                    setsendPaidOrderRequest();
                }, 2000);
            }
            else {
                kkkk = 0;
                alert('网络正忙.');
            }
        });
    }

    // loading payment page
    function display_data() {
        //loading the information of the selected order
        payment_data = sessionStorage.getObject('payment_data');
        if (payment_data == null) {
            return;
        }
        //------- show the scenic list
        var content_html = "";

        content_html = '<img src="resource/image/logo.png">';
        content_html += '<div><h5>' + payment_data['name'] + '</h5>';
        content_html += '<h5 style="color: red">¥' + parseFloat(payment_data['real_cost']).toFixed(2) + '</h5></div>';

        $('.order_body').html(content_html);
        $('#real_price').html('¥' + parseFloat(payment_data['real_cost']).toFixed(2));
    }

    function resize_buypage() {
        var width = document.body.clientWidth
            || document.documentElement.clientWidth
            || window.innerWidth;

        var height = document.body.clientHeight
            || document.documentElement.clientHeight
            || window.innerHeight;


        $('#content').css({width: width, height: height});
        $('#app_footer').css({width: width});

        // resize map region
        var map_top = 0;//document.getElementById('app_header').clientHeight;
        var map_width = document.getElementById('content').clientWidth;
        var map_height = document.body.clientHeight - map_top;
        $('#container').css({display: 'block', width: map_width, height: map_height, top: map_top, bottom: 0});

        var content_margin = (document.body.clientWidth - width) / 2;
    }

</script>
</html>
