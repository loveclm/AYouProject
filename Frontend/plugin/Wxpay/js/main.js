/**
 * Created by Administrator on 8/4/2017.
 */
var initRatio;
var bCommentaryState = 0;
var bAutomaticState = 0;
var bPhoneverified = 0;
var bAuthorizing = 0;

var phone_num = "";

var new_scenic_id = "";
var bMovable = 0;
var bLogin = 0;
window.addEventListener('resize', function(event){
    resize();
});

$(document).ready(function(){
    check_authCode();
    // Check browser support(local storage)
    if (typeof(Storage) === "undefined") {
        document.body.innerHTML = '<div style="position: relative">Can not show web page in current browser.</div>';
        return;
    }
    // resize client region
    resize();

    if(shop_id != 0) {
        sessionStorage.setItem('shopid', shop_id);
        sessionStorage.setItem('targetid', targetid);
    }
    // if targetid is course id then show course else show scenic area
    // this can be check with target_type
    if(target_type == "1"){
        // show course information
        if(targetid !="0"){
            window.location.href = "tourism_new.php?shopid=\'" + shop_id + "\'&targetid=" + targetid + "&map_type=" + map_type;
            sessionStorage.setItem('qr_areaid', targetid);
        }
                        
    }else if(target_type == "2")
    {
        // show scenic area
        if(targetid !="0") {
            sessionStorage.setItem('movable', 1);
            sessionStorage.setItem('new_scenic_id', targetid);
        }
    }
    // loading needed data in local storage
    loadDataFormStorage();

    // if phone was not verified then show verification dialog
    if(bLogin == 0) {
        // if all paid then don't show login dialog

	sessionStorage.setItem('qr_areaid', targetid);
        //$('#login').show();
        //sessionStorage.setItem('login_state', 1);
        showDialogToCenter('login-dialog');
    }
    //  event listener
    // change explaining state with button click event
    $('#btn-commentary').click(function(){
        if(bCommentaryState == 0)
        {
            $('#btn-commentary').css({'background':'url("resource/image/home_commentary_off.png") no-repeat', 'background-size':'contain'});
            explain_area_control("stop");
            showNotification('已关闭景区讲解');
        }else
        {
            explain_attraction_control("stop");
            $('#btn-commentary').css({'background':'url("resource/image/home_commentary_on.png") no-repeat', 'background-size':'contain'});
            explain_area_control("play");
            showNotification('已开启景区讲解');
        }

        bCommentaryState = 1 - bCommentaryState;
        sessionStorage.setItem('explain_check', bCommentaryState);

    });

    // change auto playing state with button click event
    $('#btn-automatic').click(function(){
        if(bAutomaticState == 0)
        {
            showNotification('已关闭景点讲解');
            $('#btn-automatic').css({'background':'url("resource/image/home_automatic_off.png") no-repeat', 'background-size':'contain'});
        }else
        {
            showNotification('已开启景点讲解');
            $('#btn-automatic').css({'background':'url("resource/image/home_automatic_on.png") no-repeat', 'background-size':'contain'});
        }

        bAutomaticState = 1 - bAutomaticState;
        sessionStorage.setItem('auto_explain_check', bAutomaticState);
    });

    // change auto playing state with button click event
    $('#btn-position').click(function(){
        if(bMovable == 1)
        {
            $('#btn-position').css({'background':'url("resource/image/home_position_on.png") no-repeat', 'background-size':'contain'});
        }else
        {
            $('#btn-position').css({'background':'url("resource/image/home_position_off.png") no-repeat', 'background-size':'contain'});
        }

        bMovable = 1 - bMovable;
        sessionStorage.setItem('movable', bMovable);
    });
});

// loading  the data from local storage
function loadDataFormStorage(){
    initialize();

    if(shop_id == 0){
        shop_id = parseInt(sessionStorage.getItem('shopid'));
    }

    bPhoneverified = parseInt(localStorage.getItem('phone_verified'));
    if(bPhoneverified == 0)
        localStorage.setItem('phone_number', "");
    else
        phone_num = localStorage.getItem('phone_number');

    // loading information of the current scenic area
    new_scenic_id = sessionStorage.getItem('new_scenic_id');
    showScenicareaInformation();
}

// showing the information of current scenic area
function showScenicareaInformation(){
    bMovable = parseInt(sessionStorage.getItem('movable'));
    if(bMovable == 1)
        $('#btn-position').css({'background':'url("resource/image/home_position_off.png") no-repeat', 'background-size':'contain'});
    else
        $('#btn-position').css({'background':'url("resource/image/home_position_on.png") no-repeat', 'background-size':'contain'});

    if( new_scenic_id != "") {
        sessionStorage.setItem('new_scenic_id', '');
        getScenicareafromID(new_scenic_id);
    }else {
        // change title with the current scenic area name.
        if(cur_scenic_data != null) {
            document.title = cur_scenic_data['name'];

            var real_cost = 0;
            for (var i = 0; i < cur_scenic_data.attractions.length; i++) {
                if (cur_scenic_data.attractions[i].buy_state == 3) {
                    //cost += parseFloat(cur_scenic_data.attractions[i].cost);
                    real_cost += parseFloat(cur_scenic_data.attractions[i].cost); //* parseFloat(cur_scenic_data.attractions[i].discount_rate);
                }
            }
            if (real_cost == 0) {
                sessionStorage.setItem('login_state', 1);
                $('#login').hide();
            }
        }

        start_explain_area();
        if(bCommentaryState == 1) explain_area_control('stop');
        //show attractions
        setOverlay();           // add overlay image in gaoMap
	    weixinConfigure();
        showAttractionInfos();  // show all the attraction marks

        if(DetectIOSDevice())
            setTimeout(showMessage('该浏览器不支持景区简介自动播放，请手动点击右侧的“简介”按钮进行播放。', 2), 1000);

        if(bLogin == 0){
            //sessionStorage.setItem('qr_areaid', targetid);
        }
    }
}

function initialize(){
    initializeStorage();

    // loading information related with attraction explain
    bCommentaryState = parseInt(sessionStorage.getItem('explain_check'));
    bAutomaticState = parseInt(sessionStorage.getItem('auto_explain_check'));
    bMovable = parseInt(sessionStorage.getItem('movable'));
    bLogin = parseInt(sessionStorage.getItem('login_state'));

    if(bCommentaryState == 0)
        $('#btn-commentary').css({'background':'url("resource/image/home_commentary_on.png") no-repeat', 'background-size':'contain'});
    else
        $('#btn-commentary').css({'background':'url("resource/image/home_commentary_off.png") no-repeat', 'background-size':'contain'});

    if(bAutomaticState == 0)
        $('#btn-automatic').css({'background':'url("resource/image/home_automatic_on.png") no-repeat', 'background-size':'contain'});
    else
        $('#btn-automatic').css({'background':'url("resource/image/home_automatic_off.png") no-repeat', 'background-size':'contain'});

    if(bMovable == 1)
        $('#btn-position').css({'background':'url("resource/image/home_position_off.png") no-repeat', 'background-size':'contain'});
    else
        $('#btn-position').css({'background':'url("resource/image/home_position_on.png") no-repeat', 'background-size':'contain'});

    // loading gaode map
    initMap();
}

function initializeStorage(){
    // if value is null then initialize value
    if(localStorage.getItem('phone_verified') === null)
        localStorage.setItem('phone_verified', 0);

    if(sessionStorage.getItem('login_state') === null)
        sessionStorage.setItem('login_state', 0);
    if(sessionStorage.getItem('explain_check') === null)
        sessionStorage.setItem('explain_check', 0);

    if(sessionStorage.getItem('auto_explain_check') === null)
        sessionStorage.setItem('auto_explain_check', 0);

    if(sessionStorage.getItem('movable') === null)
        sessionStorage.setItem('movable', 0);

    // current verified phone number
    if(localStorage.getItem('phone_number') === null)
        localStorage.setItem('phone_number', "");

    if( sessionStorage.getItem('shopid') == null)
        sessionStorage.setItem('shopid', "");

    // new scenic area id : this area is the scenic area that exchange with current scenic area
    if(sessionStorage.getItem('new_scenic_id') === null)
        sessionStorage.setItem('new_scenic_id', "");

}

function showNotification(data){
    $('#notification').html(data);

    $('#notification').show();
    setTimeout(function() { $('#notification').hide(); }, 4100);
}

function display_attraction_data() {
    //------- show the attraction list
    // show individual tourism data
    var content_html = '<div id="search_attraction">';
    content_html += '   <div class="has-feedback">';
    content_html += '   <input type="text" class="form-control input-sm" onchange="filter_attraction(this.value)" placeholder="请输入景点">';
    content_html += '   <span class="fa fa-search form-control-feedback"></span>';
    content_html += '</div></div>';
    $('#detail_content_search').html(content_html);

    content_html = '<div id="attraction_list">';
    if (cur_scenic_data != null) {
        for (var i = 0; i < cur_scenic_data['attractions'].length; i++) {

            content_html += '   <div class="attraction_item" id="attraction_item' + (i + 1) + '" onclick="selectAttraction(' + i + ')">';
            content_html += '   <img src="resource/image/attraction.png" style="float: left; height:100%">';
            content_html += '   <h5 style="float: left; font-weight: bold; margin-top:5px; margin-left:10px ">' + cur_scenic_data['attractions'][i]['name'] + '</h5></div>';
        }
    }
    content_html += '</div>';

    var footer_height = $('#app_footer').css('height');

    $('#detail_content_data').html(content_html);
    $('.has-feedback input').focus(function () {
        $('#menu-detail-dialog').css({bottom: 0});
        $('#app_footer').hide();
    });
    $('.has-feedback input').blur(function () {
        $('#app_footer').show();
        $('#menu-detail-dialog').css({bottom:footer_height});
        resize();
    });
}

function filter_attraction(search_text){
    if(cur_scenic_data == null) return;

    var content_html = '<div id="attraction_list">';
    for( var i = 0; i < cur_scenic_data['attractions'].length; i++){
        if(cur_scenic_data['attractions'][i]['name'].indexOf(search_text)>=0) {
            content_html += '   <div class="attraction_item" id="attraction_item' + (i+1) +'" onclick="selectAttraction('+ i +')">';
            content_html += '   <img src="resource/image/attraction.png" style="float: left; height:100%">';
            content_html += '   <h5 style="float: left; font-weight: bold; margin-top:5px; margin-left:10px ">' + cur_scenic_data['attractions'][i]['name'] + '</h5></div>';
        }
    }
    content_html += '</div>';
    $('#detail_content_data').html(content_html);
}

/*****************************************
 resize display
 ****************************************/
function resize(){
    initRatio = getDevicePixelRatio();
    var ratio = getDevicePixelRatio()/initRatio;
    var width = document.body.clientWidth
        || document.documentElement.clientWidth
        || window.innerWidth;

    var height = document.body.clientHeight
        || document.documentElement.clientHeight
        || window.innerHeight;
    var scale = Math.min(width/640,height/1010) * ratio;

    //width = 640*scale
    $('#content').css({width:width, height:height});
    $('#app_footer').css({width:width});
    if(height < 450){
        $('.amap-zoomcontrol').css({display:'none'});
        //$('.menu-image').hide();
        $('#app_footer').hide();
    }else{
        $('.amap-zoomcontrol').css({display:'block'});
        //$('.menu-image').show();
        $('#app_footer').show();
    }
    // resize map region
    var map_bottom = document.getElementById('app_footer').clientHeight;
    var map_width = document.getElementById('content').clientWidth;
    var map_height = document.body.clientHeight - map_bottom;
    var map_top = 0;
    $('#custom-map-container').css({display:'block',width:map_width, height:map_height, top:map_top, bottom:map_bottom});

    // redistribution buttons
    $('#btn-help').show();
    var content_margin=(document.body.clientWidth-width)/2;
    var btn_height = document.getElementById('btn-help').clientHeight;
    var dh = btn_height+10;
    var delta = 10;

    btn_height  = map_height/10;
    delta = 5;
    dh = btn_height + delta;

    //$('#btn-help').css({display:'block', top:map_top + delta, right:content_margin, width: btn_height, height: btn_height});
    //$('#btn-follow').css({display:'block', top:map_top + dh + delta, right:content_margin, width: btn_height, height: btn_height});
    $('#btn-order').css({display:'block', top:map_top + dh + delta, right:content_margin, width: btn_height, height: btn_height});
    $('#btn-scenic').css({display:'block', top:map_top + dh*2 + delta, right:content_margin, width: btn_height, height: btn_height});
    $('#btn-login').css({display:'block', bottom:map_bottom + 2*dh + delta, right:content_margin, width: btn_height, height: btn_height});
    $('#btn-commentary').css({display:'block', bottom:map_bottom + dh + delta/2, right:content_margin, width: btn_height, height: btn_height});
    $('#btn-automatic').css({display:'block', bottom:map_bottom + delta, right:content_margin, width: btn_height, height: btn_height});
    //$('#btn-position').css({display:'block', bottom:map_bottom + delta, right:content_margin, width: btn_height, height: btn_height});

    //set margin of login modal dialog
    $('.custom-modal').css({'margin-left':content_margin,'margin-right':content_margin});

    // set bottom of the menu detail dialog
    $('#menu-detail-dialog').css({bottom: map_bottom, width:map_width});
    $('#menu-detail').css({bottom:map_bottom});
}
