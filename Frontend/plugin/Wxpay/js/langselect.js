/**
 * Created by Administrator on 8/4/2017.
 */
var T_SERVER_URL='https://www.ayoubc.com/backend/';
var TranData = {
    // 'transMode': TRANS.MIC_MODE,
    // 'lang1Txt': '汉语',
    // 'lang1Img': 'resource/image/map_car.png',
    // 'lang1Code': 'zh-CN',
    // 'lang1TextCode': 'zhCN_Male',
    // 'lang2Txt': '英语',
    // 'lang2Img': 'resource/image/overlay.png',
    // 'lang2Code': 'en-US',
    // 'lang2TextCode': 'enUS_Male',
    // 'srcLangCode': 'en-US',
    // 'targetLangCode': 'en-US',
};

window.addEventListener('resize', function (event) {
    resize();
});

$(document).ready(function () {
    sessionStorage.setItem('lang','1');
    getLangDataFromServer();
});

function getLangDataFromServer() {
    $.ajax({
        type: 'POST',
        url: T_SERVER_URL + 'api/Areas/getLangData', //rest API url
        dataType: 'json',
        data: {'phone': ""}, // set function name and parameters
        success: function (data) {
            if (data.status == false) {
                //alert('服务器错误');
                return;
            } else {
                console.log(data.data);
                sessionStorage.setObject('lang_list', data.data);
                showContents();
            }
        },
        error: function (data) {
            //alert('服务器错误。');
        }
    });
}

function showContents() {
    initializeStorage();
    setMainContent();

    $('.lang-bar').show();

    $('.lang-bar .left-lang').on('click', function () {
        pageId = 1;
        setMainContent();
    })
    $('.lang-bar .right-lang').on('click', function () {
        pageId = 2;
        setMainContent();
    })
}

function setMainContent() {

    if (pageId == 1) {
        $('.lang-bar .left-lang').css({background: '#dd2828'});
        $('.lang-bar .right-lang').css({background: 'white'});
        $('#lang1Txt').css({color: 'white'});
        $('#lang2Txt').css({color: 'black'});
    } else {
        $('.lang-bar .left-lang').css({background: 'white'});
        $('.lang-bar .right-lang').css({background: '#28c7d7'});
        $('#lang1Txt').css({color: 'black'});
        $('#lang2Txt').css({color: 'white'});
    }

    var main_html = "";
    var langList = (sessionStorage.getObject('lang_list')).lang;
    for (var i = 0; i < langList.length; i++) {
        var isSelected = '';
        if (langList[i].speech_text_code == TranData.lang1Code && pageId == 1) isSelected = TRANS.LEFT;
        else if (langList[i].speech_text_code == TranData.lang2Code && pageId == 2) isSelected = TRANS.RIGHT;

        main_html += showLangItem(i, langList[i], isSelected);
    }
    main_html += '';

    $("#lang-select-list").html(main_html);
    $('#lang1Txt').html(TranData.lang1Txt);
    $('#lang1Img').attr('src', TranData.lang1Img);
    $('#lang2Txt').html(TranData.lang2Txt);
    $('#lang2Img').attr('src', TranData.lang2Img);
}

function onSelectLang(langId) {
    var langList = (sessionStorage.getObject('lang_list')).lang
    for (var i = 0; i < langList.length; i++) {
        var item = langList[i];
        if (pageId == 1) {
            if (i == langId && item.speech_text_code != TranData.lang2Code) {
                TranData.lang1Txt = item.lang_text;
                TranData.lang1Img = T_SERVER_URL + '/' + item.flag;
                TranData.lang1Code = item.speech_text_code;
                TranData.lang1TextCode = item.text_speech_code;
            }
        } else {
            if (i == langId && item.speech_text_code != TranData.lang1Code) {
                TranData.lang2Txt = item.lang_text;
                TranData.lang2Img = T_SERVER_URL + '/' + item.flag;
                TranData.lang2Code = item.speech_text_code;
                TranData.lang2TextCode = item.text_speech_code;
            }
        }
    }
    sessionStorage.setObject('trans_data',TranData);
    setMainContent();
}

// showing the information
function showLangItem(langId, langItem, isSelected) {
    var content_html = '';
    content_html += '<div class="lang-select-item" onclick="onSelectLang(' + langId + ')">';

    content_html += '<span><img id="flag-img" src="' + T_SERVER_URL + '/' + langItem.flag + '"></span>';
    content_html += '<span class="lang-text">' + langItem.lang_text + '</span>';
    if (isSelected == TRANS.LEFT) {
        content_html += '<span class="select-check">'
            + '<img src="resource/image/check_left@3x.png">'
            + '</span>';
    } else if (isSelected == TRANS.RIGHT) {
        content_html += '<span class="select-check">'
            + '<img src="resource/image/check_right@3x.png">'
            + '</span>';
    } else {
        content_html += '<span class="select-check">'
            + '<img src="resource/image/check_no@3x.png">'
            + '</span>';
    }
    content_html += '</div>';
    return content_html;
}

function onOk(){
    clearTranslatorHistory();
    $('#message_dialog').hide();
}

function initializeStorage() {
    TranData = sessionStorage.getObject('trans_data');
}

function showNotification(data) {
    $('#notification').html(data);

    $('#notification').show();
    setTimeout(function () {
        $('#notification').hide();
    }, 4100);
}

/*****************************************
 resize display
 ****************************************/
function resize() {
    initRatio = getDevicePixelRatio();
    var ratio = getDevicePixelRatio() / initRatio;
    var width = document.body.clientWidth
        || document.documentElement.clientWidth
        || window.innerWidth;

    var height = document.body.clientHeight
        || document.documentElement.clientHeight
        || window.innerHeight;
    var scale = Math.min(width / 640, height / 1010) * ratio;

}