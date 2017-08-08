/**
 * Created by Administrator on 8/4/2017.
 */

/*****************************************
 resize display
 ****************************************/
var initRatio;
var bCommentaryState = 0;
var bAutomaticState = 0;
var attraction_list = new Array();

window.addEventListener('resize', function(event){
    resize();
});

$(document).ready(function(){
    //  event listener
    $('#btn-commentary').mousedown(function(){
        if(bCommentaryState == 0)
        {
            $('#btn-commentary').css({'background':'url(\'image/home_commentary_off.png\') no-repeat', 'background-size':'contain'});
        }else
        {
            $('#btn-commentary').css({'background':'url(\'image/home_commentary_on.png\') no-repeat', 'background-size':'contain'});
        }
        bCommentaryState = 1 - bCommentaryState;

    });

    $('#btn-automatic').mousedown(function(){
        if(bAutomaticState == 0)
        {
            $('#btn-automatic').css({'background':'url(\'image/home_automatic_off.png\') no-repeat', 'background-size':'contain'});
        }else
        {
            $('#btn-automatic').css({'background':'url(\'image/home_automatic_on.png\') no-repeat', 'background-size':'contain'});
        }
        bAutomaticState = 1 - bAutomaticState;
    });
});

function display_attraction_data(){
    //------- downloading or loading attraction data
    simulate_attraction_data();
    //------- show the attraction list
    // show individual tourism data
    var content_html = '<div id="search_attraction">';
    content_html += '<div class="has-feedback">';
    content_html += '<input type="text" class="form-control input-sm" placeholder="请输入景点" style="width: 100%;border-radius: 20px;">';
    content_html += '<span class="glyphicon glyphicon-search form-control-feedback"></span>';
    content_html += '</div></div><div id="attraction_list">';

    for( var i = 0; i < attraction_list.length; i++){

        content_html += '<div class="attraction_item" id="attraction_item'+ (i+1) +'">';
        content_html += '<img src="image/attraction.png" style="float: left; height:100%">';
        content_html += '<h4 style="float: left; font-weight: bold; margin-top:5px; margin-left:10px ">'+ attraction_list[i]['name'] +'</h4></div>';
        // define eventListener

    }
    content_html += '</div>';
    $('#menu-detail-content').html(content_html);
}

function simulate_attraction_data(){
    attraction_list[0]={name:'王老吉凉茶博物馆', id:1};
    attraction_list[1]={name:'十里环水乡风景长廊', id:2};
    attraction_list[2]={name:'李家成故居', id:3};
    attraction_list[3]={name:'树下行人', id:4};
    attraction_list[4]={name:'东坡亭', id:5};
    attraction_list[5]={name:'胡蝶故居', id:6};
    attraction_list[6]={name:'横海浪荷花世界', id:7};
}

function resize(){
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
    $('#app_footer').css({width:width});

    // resize map region
    var map_top = document.getElementById('app_header').clientHeight;
    var map_bottom = document.getElementById('app_footer').clientHeight;
    var map_width = document.getElementById('content').clientWidth;
    var map_height = document.body.clientHeight - map_top - map_bottom;
    $('#container').css({width:map_width, height:map_height, top:map_top, bottom:map_bottom});

     // redistribution buttons
    var content_margin=(document.body.clientWidth-width)/2;
    var btn_height = document.getElementById('btn-help').clientHeight;
    var dh = btn_height+10;
    $('#btn-help').css({top:map_top + 10, right:content_margin +10});
    $('#btn-follow').css({top:map_top + dh + 10, right:content_margin +10});
    $('#btn-order').css({top:map_top + dh*2 + 10, right:content_margin +10});
    $('#btn-scenic').css({top:map_top + dh*3 + 10, right:content_margin +10});
    $('#btn-commentary').css({bottom:map_bottom + dh + 10, right:content_margin +10});
    $('#btn-automatic').css({bottom:map_bottom + 10, right:content_margin +10});

    //set margin of login modal dialog
    var header_height = document.getElementById('app_header').clientHeight;

    $('.custom-modal').css({'margin-left':content_margin,'margin-right':content_margin});
    $('#btn-close').css({position:'fixed', width:map_width*0.06,right:map_width*0.15+content_margin-map_width*0.03, top:height*0.25+map_width*21/160-map_width*0.03});

    // set bottom of the menu detail dialog
    $('#menu-detail-dialog').css({bottom: map_bottom, width:map_width});
    $('#menu-detail').css({bottom:map_bottom});

    var menu_detail_content_top = document.getElementById('menu-detail-content').clientTop;
    //$('#menu-detail-content').css({height: height-menu_detail_content_top - map_bottom});
}

function getDevicePixelRatio() {
    if(window.devicePixelRatio) {
        return window.devicePixelRatio;
    }
    return screen.deviceXDPI / screen.logicalXDPI;
}

