/**
 * Created by Administrator on 8/11/2017.
 */


$(function(){
    display_data();
    resize_buypage();
});

window.addEventListener('resize', function(event){
    resize_buypage();
});

function back(){
    localStorage.removeItem('cur_order');
    history.back();
}

function display_data(){
    //loading the information of the selected order
    var payment_data = localStorage.getObject('payment_data');
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
            break;
        case 2:
            header_content_html += '购买景区' + '</h3>';
            break;
        case 3:
            header_content_html += '购买景点' + '</h3>';
            break;
        case 4:
            header_content_html += '重新购买订单' + '</h3>';
            break;
    }

    $('#app_header').html(header_content_html);

    var content_html = "";

    content_html = '<img src="'+payment_data['image']+'">';
    content_html += '<div><h5>'+payment_data['name']+'</h5>';
    content_html += '<h5 style="color: red">¥'+parseFloat(payment_data['cost']).toFixed(2)+'</h5></div>';

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

    width = 640*scale;
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
