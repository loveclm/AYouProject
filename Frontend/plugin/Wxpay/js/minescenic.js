/**
 * Created by Administrator on 8/9/2017.
 */

var minescenic_List = [];


$(function(){
    resize_minesceniclist();
    getMyScenicAreasFromServer();
    //loadmyScenicData();
});

window.addEventListener('resize', function(event){
    resize_minesceniclist();
});

function loadmyScenicData(){
    minescenic_List = sessionStorage.getObject('my_scenic_areas')
    if(minescenic_List == null)
        getMyScenicAreasFromServer();
    else
        display_minescenic_data();
}

function display_minescenic_data(){
    //------- show the scenic list
    var state_class_List = ['order_using', 'order_expired'];
    var state_string_List = ['使用中','已过期'];

    // show individual scenic data
    var content_html_all = "";
    var content_html_using = "";
    var content_html_expired = "";
    var tmp_content_html="";

    $('#tab_all').html(content_html_all);
    $('#tab_using').html(content_html_using);
    $('#tab_expired').html(content_html_expired);

    if(localStorage.getItem('phone_number') == null || localStorage.getItem('phone_number')=="") return;
    if(minescenic_List == null) return;

    // show each order information in order list
    for( var i = 0; i < minescenic_List.length; i++){
        tmp_content_html="";
        tmp_content_html += '<div class="order '+state_class_List[minescenic_List[i]['state']-1] +'">';
        tmp_content_html += '<div class="order_body" onclick="showScenicArea('+ i +')">';
        tmp_content_html += '   <img src="'+minescenic_List[i]['image']+'">';//'   <img src="../resource/image/logo.png">';
        tmp_content_html += '   <div class="scenic_content" style="position: relative">';
        if(minescenic_List[i]['state'] == 1)
            tmp_content_html += '      <h5 style="position: absolute; color: red; right: 0px">'+state_string_List[minescenic_List[i]['state']-1]+'</h5>';
        else
            tmp_content_html += '      <h5 style="position: absolute; right: 0px">'+state_string_List[minescenic_List[i]['state']-1]+'</h5>';
        tmp_content_html += '      <h5>&nbsp</h5>';
        tmp_content_html += '      <h5>'+minescenic_List[i]['name']+'</h5>';
        tmp_content_html += '      <h5>'+minescenic_List[i]['order_time']+ '</h5>';
        tmp_content_html += '</div></div>';

        if(minescenic_List[i]['state'] == 2){
            tmp_content_html += '<div class="order_footer">';
            tmp_content_html +='    <div onclick="purchase_again_Order('+i+')"><h5>重新购买</h5></div>';
            tmp_content_html += '</div>'
        }
        tmp_content_html +='</div>';

        content_html_all += tmp_content_html;
        switch (minescenic_List[i]['state'])
        {
            case 1:
                content_html_using += tmp_content_html;
                break;
            case 2:
                content_html_expired += tmp_content_html;
                break;
        }
    }

    $('#tab_all').html(content_html_all);
    $('#tab_using').html(content_html_using);
    $('#tab_expired').html(content_html_expired);
}

function pay_for_Order(index) {
    // calculate order's price
    var cur_scenic = minescenic_List[index];
    var real_cost = cur_scenic['cost'] ;//* cur_scenic['discount_rate'];

    var payment_data = {
        type : 2,      // 1: tourism course, 2: scenic area, 3: attraction, 4: order
        id : cur_scenic['areaid'],
        name: cur_scenic['name'],
        image: cur_scenic['image'],
        cost: cur_scenic['cost'],
        real_cost: real_cost
    };

    sessionStorage.setObject('payment_data', payment_data);
    //window.location.href = '../views/purchase.html';
    preparePayment();
}

function purchase_again_Order(index) {
    pay_for_Order(index);
}

function showScenicArea(index){
    sessionStorage.setItem('new_scenic_id', minescenic_List[index]['areaid']);
    sessionStorage.setItem('explain_check', 0);

    var new_scenic_id = minescenic_List[index]['areaid'];
    var geo_scenic_id = sessionStorage.getItem('geo_scenic_id');
    if( geo_scenic_id == new_scenic_id){
        sessionStorage.setItem('movable', 0);
    }else{
        sessionStorage.setItem('movable', 1);
    }

    var shopid = sessionStorage.getItem('shopid');
    window.location.href = '../home.php?shopid=' + shopid + '&type=2&targetid=' + new_scenic_id +"&map_type=" + minescenic_List[index].map_type;
}
function resize_minesceniclist(){
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

    // resize map region
    var map_top = 0; //document.getElementById('app_header').clientHeight;
    var map_width = document.getElementById('content').clientWidth;
    var map_height = document.body.clientHeight - map_top;
    $('#container').css({display:'block',width:map_width, height:map_height, top:map_top, bottom:0});

    var content_margin=(document.body.clientWidth-width)/2;
    $('#back_img').css({position:'fixed',left: content_margin+10});

    var header_height = document.getElementById('tab_header').clientHeight;
    $('#tab_all').css({height:map_height-header_height-4});
    $('#tab_using').css({height:map_height-header_height-4});
    $('#tab_expired').css({height:map_height-header_height-4});

    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        var index = $(e.target).closest('li').index();

        sessionStorage.setItem('scenic_tab_index', index);
    });

    var index = sessionStorage.getItem('scenic_tab_index');
    if( index != null)
        $('.nav-tabs li:eq('+index+') a').tab('show');
}
