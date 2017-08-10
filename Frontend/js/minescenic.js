/**
 * Created by Administrator on 8/9/2017.
 */

var minescenic_List = new Array();


$(function(){
    display_minescenic_data();
});

window.addEventListener('resize', function(event){
    resize_minesceniclist();
});

function display_minescenic_data(){
    //------- downloading or loading tourism data
    simulate_minescenic_download();
    //------- show the scenic list
    var state_class_List = ['order_using', 'order_expired'];
    var state_string_List = ['使用中','已过期'];

    // show individual scenic data
    var content_html_all = "";
    var content_html_using = "";
    var content_html_expired = "";
    var tmp_content_html="";

    // show each order information in order list
    for( var i = 0; i < minescenic_List.length; i++){
        tmp_content_html="";
        tmp_content_html += '<div class="order '+state_class_List[minescenic_List[i]['state']-1] +'">';
        tmp_content_html += '<div class="order_body">';
        tmp_content_html += '   <img src="'+minescenic_List[i]['image_url']+'">';
        tmp_content_html += '   <div class="scenic_content">';
        if(minescenic_List[i]['state'] == 1)
            tmp_content_html += '      <h5 style="position: absolute; color: red; right: 20px">'+state_string_List[minescenic_List[i]['state']-1]+'</h5>';
        else
            tmp_content_html += '      <h5 style="position: absolute; right: 20px">'+state_string_List[minescenic_List[i]['state']-1]+'</h5>';
        tmp_content_html += '      <h5>&nbsp</h5>';
        tmp_content_html += '      <h5>'+minescenic_List[i]['name']+'</h5>';
        tmp_content_html += '      <h5>'+minescenic_List[i]['order_time']+ '</h5>';
        tmp_content_html += '</div></div>';

        if(minescenic_List[i]['state'] == 2){
            tmp_content_html += '<div class="order_footer">';
            tmp_content_html +='    <div><h5>重新购买</h5></div>';
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

        $('#tab_all').html(content_html_all);
        $('#tab_using').html(content_html_using);
        $('#tab_expired').html(content_html_expired);
    }
}

function simulate_minescenic_download(){
    /* order's data format
     **  id means scenic area identification index(景区编号)
     **  name means scenic area's name( attraction or scenic area name)
     **  image_url is image's url in server
     **  order_time is the time that you order scenic area.
     **  state is index of using,, expired
     */
    minescenic_List[0] = {id:'5897427848', name:'鹤山古劳水乡', image_url:'../image/tmp_order.png', order_time:'2017-08-07 14:30:09', state:1};
    minescenic_List[1] = {id:'5897427834', name:'十里环水乡风景长廊', image_url:'../image/tmp_order.png', order_time:'2017-08-05 10:30:09', state:1};
    minescenic_List[2] = {id:'5897427856', name:'树下行人', image_url:'../image/tmp_order.png', order_time:'2017-07-07 9:30:09', state:2};
}

function resize_minesceniclist(){
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
    $('#tab_using').css({height:map_height-header_height-4});
    $('#tab_expired').css({height:map_height-header_height-4});
}
