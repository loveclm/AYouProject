/**
 * Created by Administrator on 8/4/2017.
 */

var initRatio;
var bCommentaryState = 0;
var bAutomaticState = 0;
var bPhoneverified = 0;
var bAuthorizing = 0;

var phone_num = "";
var sms_code = "";

var new_scenic_id = "";
var cur_scenic_data = null;

var attraction_list = [];

window.addEventListener('resize', function(event){
    resize();
});

$(document).ready(function(){
    // Check browser support(local storage)
    if (typeof(Storage) === "undefined") {
        document.body.innerHTML = '<div style="position: relative">Can not show web page in current browser.</div>';
        return;
    }

    // resize client region
    resize();

    // loading needed data in local storage
    loadDataFormStorage();

    // if phone was not verified then show verification dialog
    if(bPhoneverified == 0)
        $('#login').show();

    //  event listener
    // change explaining state with button click event
    $('#btn-commentary').click(function(){
        if(bCommentaryState == 0)
        {
            $('#btn-commentary').css({'background':'url(\'resource/image/home_commentary_off.png\') no-repeat', 'background-size':'contain'});
            showNotification('已关闭景区讲解');
        }else
        {
            $('#btn-commentary').css({'background':'url(\'resource/image/home_commentary_on.png\') no-repeat', 'background-size':'contain'});
            showNotification('已开启景区讲解');
        }
        bCommentaryState = 1 - bCommentaryState;
        localStorage.setItem('explain_check', bCommentaryState);

    });

    // change auto playing state with button click event
    $('#btn-automatic').click(function(){
        if(bAutomaticState == 0)
        {
            showNotification('已关闭景区讲解');
            $('#btn-automatic').css({'background':'url(\'resource/image/home_automatic_off.png\') no-repeat', 'background-size':'contain'});
        }else
        {
            showNotification('已开启景区讲解');
            $('#btn-automatic').css({'background':'url(\'resource/image/home_automatic_on.png\') no-repeat', 'background-size':'contain'});
        }
        bAutomaticState = 1 - bAutomaticState;
        localStorage.setItem('auto_explain_check', bAutomaticState);
    });

});

function showScenicareaInformation(){
    /*  programming stage
    **   show gaoMap along a location
    **   add overlay image in gaoMap
    **   show all the attraction marks
    **   must consider the phone verification information
     */
    initMap();
}

function initialize(){
    if(bCommentaryState == 0)
        $('#btn-commentary').css({'background':'url(\'resource/image/home_commentary_on.png\') no-repeat', 'background-size':'contain'});
    else
        $('#btn-commentary').css({'background':'url(\'resource/image/home_commentary_off.png\') no-repeat', 'background-size':'contain'});

    if(bAutomaticState == 0)
        $('#btn-automatic').css({'background':'url(\'resource/image/home_automatic_on.png\') no-repeat', 'background-size':'contain'});
    else
        $('#btn-automatic').css({'background':'url(\'resource/image/home_automatic_off.png\') no-repeat', 'background-size':'contain'});

    showScenicareaInformation();
}

function initializeStorage(){
    // if value is null then initialize value
    if(localStorage.getItem('phone_verified') === null)
        localStorage.setItem('phone_verified', 0);

    if(localStorage.getItem('explain_check') === null)
        localStorage.setItem('explain_check', 0);

    if(localStorage.getItem('auto_explain_check') === null)
        localStorage.setItem('auto_explain_check', 0);

    // current verified phone number
    if(localStorage.getItem('phone_number') === null)
        localStorage.setItem('phone_number', "");

    // new scenic area id : this area is the scenic area that exchange with current scenic area
    if(localStorage.getItem('new_scenic_id') === null)
        localStorage.setItem('new_scenic_id', "");
    // current scenic area
}

function loadDataFormStorage(){
    initializeStorage();

    bPhoneverified = parseInt(localStorage.getItem('phone_verified'));
    if(bPhoneverified == 0)
        localStorage.setItem('phone_number', "");
    else
        phone_num = localStorage.getItem('phone_number');

    // loading information related with attraction explain
    bCommentaryState = parseInt(localStorage.getItem('explain_check'));
    bAutomaticState = parseInt(localStorage.getItem('auto_explain_check'));

    // loading information of the current scenic area
    new_scenic_id = localStorage.getItem('new_scenic_id');
    if(new_scenic_id != "") {
        // downloading scenic area information along scenic id
        if(new_scenic_id != -1) {
            getScenicareafromID(new_scenic_id);
        }
        else{
            localStorage.removeItem('cur_scenic_area');
            cur_scenic_data = null;
            initialize();
        }

        //initializing new scenic area information
        localStorage.setItem('new_scenic_id', "");
    }
    else{
        cur_scenic_data = localStorage.getObject('cur_scenic_area');

        if(cur_scenic_data === null){
            //downloading scenic area information along current position
            getScenicareafromPosition();
        }else
        {
            initialize();
        }
    }
}

function showNotification(data){
    $('#notification').html(data);

    $('#notification').show();
    setTimeout(function() { $('#notification').hide(); }, 3000);
}

function start_explain(index) {
    // play audio with the setted music type
    var music = document.getElementById('music'); // id for audio element
    $("#audioSource").attr("src", cur_scenic_data.attractions[index].audio_files[cur_voice_type]).detach().appendTo("#music");

    music.load();
    start_explain_control("play");
}

function start_explain_control(data) {
    // play audio with the setted music type
    var music = document.getElementById('music'); // id for audio element
    if(data == "play") {
        $('#music').trigger('play');
        //music.play();
    }else if(data == "stop"){
        $("#music").trigger('pause');
        $("#music").prop("currentTime",0);
        //music.pause();
    }
}


function verifyAuthorizationCode(){
    $('#login').hide();

    if(bPhoneverified == 1)
    {
        $('#code_auth').show();
    }else{
        bAuthorizing = 1;
        verifyPhone();
    }
}

function verifyPhone(){
    $('#login').hide();
    if(bPhoneverified == 1) return;

    $('#phone_verify').show();
}

// send SMS message to user's phone in order to verify user's phone
function sendSMSToPhone(){
    // accomplish along 4 stages
    phone_num = $('#phone_number').val();
    //phone number validation
    if(phone_num == '' || phone_num.length != 11)
    {
        alert('手机号码错了。 再次输入。');
        return;
    }

    // send SMS sending request in backend server.
    $('#loading').css({display:'block'});
    $.ajax({
        type: 'POST',
        url: 'plugin/SMS/sendingSMS.php', //rest API url
        dataType: 'json',
        data: { destination: '+86' + phone_num, sender: 'Tourism company', reference:'', message: '验证码'}, // set function name and parameters
        success: function(data){
            // get SMS code from received data
            $('#loading').css({display:'none'});
            if(data['type'] != "01") {
                sms_code = "";
                alert(data['err']);
            }else{
                sms_code = data['code'];
            }
        },
        fail: function(){
            return;
        }
    });
    //sms_code = "1234";
}

// confirm the phone verification code
function confirm_verify_phone(){
    if(sms_code == "")
    {
        alert('输入手机号。');
        return;
    }
    // verify SMS code accuracy
    var code = $('#verify_code').val();
    if( sms_code != code || code == "") {
        alert('验证码错了。 再次输入。');
        return;
    }

    bPhoneverified = 1;
    $('#phone_verify').hide();
    $('#phone_number').val("");
    $('#verify_code').val("");
    // store phone verification state
    localStorage.setItem('phone_verified', bPhoneverified);

    // If for verifying authorization code verify phone then show authorization code verifying dialog,
    // If else downloading needed infos of the current scenic area, attraction of the current scenic area and so on.
    if(bAuthorizing == 1)
    {
        bAuthorizing = 0;
        $('#code_auth').show();
    }else{
        // change attraction marks along information
        showAttractionInfos();
    }

}

function OnCancelauthcodeVerify(){
    $('#code_auth').hide();
    $('#auth_code').val("");
}

function OnConfirmauthCode(){
    /*  validate authorization code
    **  If authorization code don't exist in the order lists of backend, verification is fail.
     */
    var auth_code = $('#auth_code').val();
    if(auth_code == "")
    {
        alert('请输入授权码');
        return;
    }

    // send ajax request and receive ajax response and so process with the result of the backend
    // If verification is fail, maintain old state.
    /*
     $.ajax({
         type: 'GET',
         url: 'http://server/backend/dbmanage.php', //rest API url
         dataType: 'json',
         data: {func: 'function_name', info: res}, // set function name and parameters
         }).success(function(data){
             $('#code_auth').hide();
             // change attraction marks along information

         }).fail(function(){
             return;
     });
     */

    //return;
    // simulate progress
    $('#code_auth').hide();
    $('#auth_code').val("");

    // change attraction marks along information
    showAttractionInfos();
}

function display_attraction_data(){
    //------- show the attraction list
    // show individual tourism data
    var content_html = '<div id="search_attraction">';
    content_html += '   <div class="has-feedback">';
    content_html += '   <input type="text" class="form-control input-sm" onchange="filter_attraction(this.value)" placeholder="请输入景点">';
    content_html += '   <span class="glyphicon glyphicon-search form-control-feedback"></span>';
    content_html += '</div></div>';
    $('#detail_content_search').html(content_html);

    content_html = '<div id="attraction_list">';
    for( var i = 0; i < cur_scenic_data['attractions'].length; i++){

        content_html += '   <div class="attraction_item" id="attraction_item'+ (i+1) +'" onclick="selectAttraction('+ i +')">';
        content_html += '   <img src="resource/image/attraction.png" style="float: left; height:100%">';
        content_html += '   <h4 style="float: left; font-weight: bold; margin-top:5px; margin-left:10px ">'+ cur_scenic_data['attractions'][i]['name'] +'</h4></div>';
    }
    content_html += '</div>';
    $('#detail_content_data').html(content_html);
}

function filter_attraction(search_text){
    var content_html = '<div id="attraction_list">';
    for( var i = 0; i < cur_scenic_data['attractions'].length; i++){
        if(cur_scenic_data['attractions'][i]['name'].indexOf(search_text)>=0) {
            content_html += '   <div class="attraction_item" id="attraction_item' + (i+1) +'" onclick="selectAttraction('+ i +')">';
            content_html += '   <img src="resource/image/attraction.png" style="float: left; height:100%">';
            content_html += '   <h4 style="float: left; font-weight: bold; margin-top:5px; margin-left:10px ">' + cur_scenic_data['attractions'][i]['name'] + '</h4></div>';
        }
    }
    content_html += '</div>';
    $('#detail_content_data').html(content_html);
}

function selectAttraction(index){
    // when user clicks attraction, must select the attraction mark
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
    $('#app_header').css({display:'block', width:width});
    $('#app_footer').css({width:width});
    if(height < 450){
        $('.amap-zoomcontrol').css({display:'none'});
        $('.menu-image').hide();
    }else{
        $('.amap-zoomcontrol').css({display:'block'});
        $('.menu-image').show();
    }
    // resize map region
    var map_top = document.getElementById('app_header').clientHeight;
    var map_bottom = document.getElementById('app_footer').clientHeight;
    var map_width = document.getElementById('content').clientWidth;
    var map_height = document.body.clientHeight - map_top - map_bottom;
    $('#custom-map-container').css({display:'block',width:map_width, height:map_height, top:map_top, bottom:map_bottom});

    // redistribution buttons
    $('#btn-help').show();
    var content_margin=(document.body.clientWidth-width)/2;
    var btn_height = document.getElementById('btn-help').clientHeight;
    var dh = btn_height+10;
    var delta = 10;
    if(height < 600){
        btn_height  = map_height/8;
        delta = 5;
        dh = btn_height + delta;
    }

    $('#btn-help').css({display:'block', top:map_top + delta, right:content_margin, width: btn_height, height: btn_height});
    $('#btn-follow').css({display:'block', top:map_top + dh + delta, right:content_margin, width: btn_height, height: btn_height});
    $('#btn-order').css({display:'block', top:map_top + dh*2 + delta, right:content_margin, width: btn_height, height: btn_height});
    $('#btn-scenic').css({display:'block', top:map_top + dh*3 + delta, right:content_margin, width: btn_height, height: btn_height});
    $('#btn-commentary').css({display:'block', bottom:map_bottom + dh + delta, right:content_margin, width: btn_height, height: btn_height});
    $('#btn-automatic').css({display:'block', bottom:map_bottom + delta, right:content_margin, width: btn_height, height: btn_height});

    //set margin of login modal dialog
    var header_height = document.getElementById('app_header').clientHeight;

    $('.custom-modal').css({'margin-left':content_margin,'margin-right':content_margin});

    // set bottom of the menu detail dialog
    $('#menu-detail-dialog').css({bottom: map_bottom, width:map_width});
    $('#menu-detail').css({bottom:map_bottom});

    var menu_detail_content_top = document.getElementById('menu-detail-content').clientTop;
}
