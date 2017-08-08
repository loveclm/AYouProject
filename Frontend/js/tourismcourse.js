/**
 * Created by Administrator on 8/8/2017.
 */
var tourism_list = new Array();
var tourismColors = ['#90d4e7','#fc8797','#fdc029','#01c8cf','#acacac']
$(function(){
    display_tourism_data();
});

function display_tourism_data(){
    //------- downloading or loading tourism data
    simulate_tourism_download();
    //------- show the tourism list
    // show the header information
    $('#tourismlist-header').find('h4').html('旅游线路 (共'+ tourism_list.length+'条线路)');
    // show individual tourism data
    var content_html = "";
    var curColor;
    for( var i = 0; i < tourism_list.length; i++){
        if(i > 3){
            curColor = tourismColors[4];
        }
        else{
            curColor = tourismColors[i];
        }
        content_html += '<div class="tourismlist_item" id="tourism_item'+ (i+1) +'">';
        content_html += '<div  style="background-color:' + curColor + '; float:left">'+(i+1)+'</div>';
        content_html += '<h4 style="float: left; padding-left:10px;">'+ tourism_list[i]['name'] +'</h4>';
        content_html += '<img src="../image/more.png" style="float:right; padding:10px"></div>';
        // define eventListener

    }
    $('#tourismlist-body').html(content_html);
}

function simulate_tourism_download(){
    tourism_list[0]={name:'故宫－圆明园－颐和园', id:1};
    tourism_list[1]={name:'故宫－圆明园－颐和园', id:2};
    tourism_list[2]={name:'故宫－长城－明十三陵－颐和园', id:3};
    tourism_list[3]={name:'故宫－长城－明十三陵－颐和园', id:4};
    tourism_list[4]={name:'故宫－长城－明十三陵－颐和园', id:5};
    tourism_list[5]={name:'故宫－长城－明十三陵－颐和园', id:6};
    tourism_list[6]={name:'故宫－长城－明十三陵－颐和园', id:7};
    tourism_list[7]={name:'故宫－长城－明十三陵－颐和园', id:8};
}

function resize_tourism_course(){
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
    $('#container').css({width:map_width, height:map_height, top:map_top, bottom:0});

    var content_margin=(document.body.clientWidth-width)/2;
    $('#back_img').css({position:'fixed',left: content_margin+10});
}

function getDevicePixelRatio() {
    if(window.devicePixelRatio) {
        return window.devicePixelRatio;
    }
    return screen.deviceXDPI / screen.logicalXDPI;
}
