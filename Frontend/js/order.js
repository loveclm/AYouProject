/**
 * Created by Administrator on 8/8/2017.
 */

var order_List = new Array();

$(function(){
    display_order_data();
});

window.addEventListener('resize', function(event){
    resize_orderlist();
});

function display_order_data(){
    //------- downloading or loading tourism data
    simulate_order_download();
    //------- show the scenic list
    var state_class_List = ['order_using','order_unpaid','order_cancelled','order_expired'];
    var state_string_List = ['使用中','未付款','已取消','已过期'];

    // show individual scenic data
    var content_html_all = "";
    var content_html_unpaid = "";
    var content_html_cancelled = "";
    var content_html_expired = "";
    var tmp_content_html="";

    // show each order information in order list
    for( var i = 0; i < order_List.length; i++){
        tmp_content_html="";
        tmp_content_html += '<div class="order '+state_class_List[order_List[i]['state']-1] +'">';
        tmp_content_html += '<div class="order_header">';
        tmp_content_html += '   <h5>订单编号 : '+ order_List[i]['id']+'</h5>';
        tmp_content_html += '   <h5 class="order_state">'+state_string_List[order_List[i]['state']-1]+'</h5>';
        tmp_content_html += '</div>';
        tmp_content_html += '<div class="order_body" onclick="showOrderDetailInfo('+ i +')">';
        tmp_content_html += '   <img src="'+order_List[i]['image_url']+'">';
        tmp_content_html += '   <div>';
        tmp_content_html += '       <h5>'+order_List[i]['name']+'</h5>';

        if(order_List[i]['pay_method'] == 1)
            tmp_content_html += '   <h5 style="color: red">¥' +order_List[i]['value']+ '</h5>';
        else
            tmp_content_html += '   <h5>授权码 : ' +order_List[i]['value']+ '</h5>';

        tmp_content_html += '</div></div>';

        if(order_List[i]['state'] != 1){
            tmp_content_html += '<div class="order_footer">';

            switch(order_List[i]['state'])
            {
                case 2:
                    tmp_content_html +='    <div><h5>取消订单</h5></div>';
                    tmp_content_html +='    <div><h5>付款</h5></div>';
                    break;
                case 3:
                case 4:
                    tmp_content_html +='    <div><h5>重新购买</h5></div>';
                    break;
            }
            tmp_content_html += '</div>'
        }
        tmp_content_html +='</div>';

        content_html_all += tmp_content_html;
        switch (order_List[i]['state'])
        {
            case 2:
                content_html_unpaid += tmp_content_html;
                break;
            case 3:
                content_html_cancelled += tmp_content_html;
                break;
            case 4:
                content_html_expired += tmp_content_html;
                break;
        }

        $('#tab_all').html(content_html_all);
        $('#tab_unpaid').html(content_html_unpaid);
        $('#tab_cancelled').html(content_html_cancelled);
        $('#tab_expired').html(content_html_expired);
    }
}

function showOrderDetailInfo(index)
{
    window.location.href = '../views/order_detail.html';
}

function simulate_order_download(){
    /* order's data format
    **  id means 订单编号
    **  name means order's name( attraction or scenic area name)
    **  image_url is image's url in server
    **  value is one of the money and the authorize code
    **  state is index of using, unpaid, cancelled, expired
    **  if you pay online then 1(weixin) else 2(code using)
    */
    order_List[0] = {id:'5897427848', name:'鹤山古劳水乡', image_url:'../image/tmp_order.png', value:'30.00', state:1, pay_method:1};
    order_List[1] = {id:'5897427812', name:'王老吉凉茶博物馆', image_url:'../image/tmp_order.png', value:'30.00', state:2, pay_method:1};
    order_List[2] = {id:'5897427834', name:'十里环水乡风景长廊', image_url:'../image/tmp_order.png', value:'37843895', state:3, pay_method:2};
    order_List[3] = {id:'5897427856', name:'树下行人', image_url:'../image/tmp_order.png', value:'30.00', state:4, pay_method:1};
    order_List[4] = {id:'5897427811', name:'胡蝶故居', image_url:'../image/tmp_order.png', value:'8794943', state:4, pay_method:2};
}

function resize_orderlist(){
    initRatio = getDevicePixelRatio();
    var ratio = getDevicePixelRatio()/initRatio;
    var width = window.innerWidth
        || document.documentElement.clientWidth
        || document.body.clientWidth;

    var height = window.innerHeight
        || document.documentElement.clientHeight
        || document.body.clientHeight;
    var scale = Math.min(width/640,height/1010) * ratio;

    width = 640*scale;
    $('#content').css({width:width, height:height});
    $('#app_header').css({width:width});

    // resize map region
    var map_top = document.getElementById('app_header').clientHeight;
    var map_width = document.getElementById('content').clientWidth;
    var map_height = document.body.clientHeight - map_top;
    $('#container').css({display:'block',width:map_width, height:map_height, top:map_top, bottom:0});

    var content_margin=(document.body.clientWidth-width)/2;
    $('#back_img').css({position:'fixed',left: content_margin+10});

    var header_height = document.getElementById('tab_header').clientHeight;
    $('#tab_all').css({height:map_height-header_height-4});
    $('#tab_unpaid').css({height:map_height-header_height-4});
    $('#tab_cancelled').css({height:map_height-header_height-4});
    $('#tab_expired').css({height:map_height-header_height-4});
}
