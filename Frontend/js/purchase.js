/**
 * Created by Administrator on 8/11/2017.
 */
var payment_data = null;
var bPhoneverified = 0;
var phone_num = "";
var new_orderID = "";

$(function(){
    bPhoneverified = parseInt(sessionStorage.getItem('phone_verified'));
    if(bPhoneverified == 0)
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

// send order to server and pay via weixin
function OnPay() {
    if( bPhoneverified == 0){
        sessionStorage.setItem('purchage_state', "payment ready");
        bAuthorizing = 0;
        verifyPhone();
        return;
    }

    sendOrder();
}

function sendOrder(){
    // send the order information to back-end
    var phone_num = localStorage.getItem('phone_number');
    var shop_id = sessionStorage.getItem('shopid');

    $.ajax({
        type: 'POST',
        url: SERVER_URL + 'api/Areas/setAreaBuyOrder',
        dataType: 'json',
        // username:'admin',
        // password:'1234',
        data: {'shop':shop_id,'phone' : phone_num, 'id':payment_data['id'], 'type':payment_data['type'], 'cost':payment_data['real_cost']},
        success: function (data) {
            if (data.status == false) {
                alert('订单取消了。');
                return;
            }
            new_orderID = data['result'];

            // weixin payment
            var buy_type = "";
            switch (payment_data['type']){
                case 1:
                    buy_type = '购买旅游线路';
                    break;
                case 2:
                    buy_type = '购买景区';
                    break;
                case 3:
                    buy_type = '购买景点';
                    break;
            }
            // send payment request
            $.ajax({
                type : 'GET',
                url : '../plugin/Wxpay/payment.php',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                dataType : 'json',
                data : { 'cost': payment_data['real_cost'], 'type': buy_type, 'product': payment_data['name']},
                success: function (data) {
                    if(data['result'] == 'success'){
                        callpay(data['parameters']);
                    }
                },
                error: function (data) {
                }
            });
        },
        error: function (data) {
            alert('订单失败了。');
        }
    });
}

function jsapi_call(param) {
    WeixinJSBridge.invoke(
        'getBrandWCPayRequest',
        param,
        function(res){
            //WeixinJSBridge.log(res.err_msg);
            switch (res.err_msg){
                case 'get_brand_wcpay_request:ok':
                    alert('已付款成功。');
                    sendPaidOrderRequest();
                    break;
                case 'get_brand_wcpay_request:cancel':
                    alert('支付已取消。');
                    break;
                case 'get_brand_wcpay_request:fail':
                    alert('支付失败。');
                    break;
            }
        }
    );
}

function  sendPaidOrderRequest() {
    // send payment state to server
    $.ajax({
        type : 'POST',
        url : SERVER_URL + 'api/Areas/setPayOrder',
        dataType : 'json',
        data : { 'id': new_orderID, 'phone': phone_num},
        success: function (data) {
            new_orderID = "";
            location.href = 'order.html';
        },
        error: function (data) {
            sendPaidOrderRequest();
        }
    });
}
function callpay(param)
{
    if (typeof WeixinJSBridge == "undefined"){
        if( document.addEventListener ){
            document.addEventListener('WeixinJSBridgeReady', jsApiCall, false);
        }else if (document.attachEvent){
            document.attachEvent('WeixinJSBridgeReady', jsApiCall);
            document.attachEvent('onWeixinJSBridgeReady', jsApiCall);
        }
    }else{
        jsapi_call(param);
    }
}


// loading payment page
function display_data(){
    //loading the information of the selected order
    payment_data = sessionStorage.getObject('payment_data');
    if(payment_data == null){
        return;
    }
    //------- show the scenic list
    var header_content_html = "";

    header_content_html = '<h3 style="text-align: center">';
    header_content_html += '   <a href="javascript:back()" style="float: left; position: fixed;left: 10px; top: 0px">';
    header_content_html += '   <img src="../resource/image/left_arrow.png" id="back_img"></a>';

    switch (payment_data['type']){
        case 1:
            header_content_html += '购买旅游线路' + '</h3>';
            document.title = '购买旅游线路';
            break;
        case 2:
            header_content_html += '购买景区' + '</h3>';
            document.title = '购买景区';
            break;
        case 3:
            header_content_html += '购买景点' + '</h3>';
            document.title = '购买景点';
            break;
        default:
            header_content_html += '重新购买订单' + '</h3>';
            document.title = '重新购买订单';
            break;
    }

    $('#app_header').html(header_content_html);

    var content_html = "";

    content_html = '<img src="'+payment_data['image']+'">';
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
    $('#app_header').css({width:width});
    $('#app_footer').css({width:width});

    // resize map region
    var map_top = document.getElementById('app_header').clientHeight;
    var map_width = document.getElementById('content').clientWidth;
    var map_height = document.body.clientHeight - map_top;
    $('#container').css({display:'block',width:map_width, height:map_height, top:map_top, bottom:0});

    var content_margin=(document.body.clientWidth-width)/2;
    $('#back_img').css({position:'fixed',left: content_margin+10});
}
