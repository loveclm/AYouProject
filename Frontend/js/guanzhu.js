/**
 * Created by Administrator on 8/8/2017.
 */

$(function(){
    resize_guanzhu();
});

window.addEventListener('resize', function(event){
    resize_guanzhu();
});

function guanzhuSettings(){
    // implement the process for 关注

    // if 关注 is successful then jump to success page
    window.location.href = '../views/guanzhu_success.html';
}

function showMainpage(){
    window.location.href = '../index.php';
}

function resize_guanzhu(){
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

    // resize map region
    var map_top = document.getElementById('app_header').clientHeight;
    var map_width = document.getElementById('content').clientWidth;
    var map_height = document.body.clientHeight - map_top;
    $('#container').css({display:'block',width:map_width, height:map_height, top:map_top, bottom:0});

    var content_margin=(document.body.clientWidth-width)/2;
    $('#back_img').css({position:'fixed',left: content_margin+10});
}
