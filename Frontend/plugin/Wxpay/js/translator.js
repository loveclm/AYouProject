/**
 * Created by Administrator on 8/4/2017.
 */

var T_SERVER_URL = 'https://www.ayoubc.com/backend/';
var TranData = {
    'transMode': TRANS.MIC_MODE,
    'lang1Txt': '汉语',
    'lang1Img': 'resource/image/map_car.png',
    'lang1Code': 'zh-CN',
    'lang1TextCode': 'zhCN_Male',
    'lang2Txt': '英语',
    'lang2Img': 'resource/image/overlay.png',
    'lang2Code': 'en-US',
    'lang2TextCode': 'enUS_Male',
    'srcLangCode': 'en-US',
    'targetLangCode': 'en-US',
    'tempFile': '',
    'timeoutID': 0
};

var browserSupported = TRANS.DISABLED;

window.addEventListener('resize', function (event) {
    resize();
});

$(document).ready(function () {
    if (sessionStorage.getItem('lang') == undefined)
        clearTranslatorHistory();
    else
        sessionStorage.removeItem('lang')

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
    var main_html = '';
    var history = sessionStorage.getItem('trans_history');
    if (history != undefined) {
        history = JSON.parse(history);
        for (var i = 0; i < history.length; i++) {
            var item = history[i];
            main_html += showTranslationItem(i,
                item.type,
                item.message1,
                item.message2,
                item.langCode
            );
        }
        $("#main-contentTxt").html(main_html);
    }

    $('#trans-mode').on('click', function () {
        if (TranData.transMode == TRANS.MIC_MODE) {
            TranData.transMode = TRANS.KEY_MODE;
        } else {
            TranData.transMode = TRANS.MIC_MODE;
        }
        setMainContent();
    })

    $('textarea').on('input', function () {
        $('#getLines').html($('#trans-input').val().replace(/\r*\n/g, '<br/>'));
// $('#getLines').html($('#getLines').css('height'));
        if (parseInt($('#getLines').css('height')) < 70) {
            $('#trans-input').css({'height': $('#getLines').css('height')});
            setMainContent();
        }
    })

    $('.translator_footer.mic').show();
    setMainContent();
    $('.bottom_space').css({'height': 100});
    $('#in_progress').css({'bottom': 100});

}

function backToDefault() {
    $('.translator_footer.mic').show();
    $('.translator_footer.key').hide();
    setMainContent();
}

function langExchange() {
    var tmpTxt = TranData.lang1Txt;
    var tmpImg = TranData.lang1Img;
    var tmpCode = TranData.lang1Code;
    var tmpTextCode = TranData.lang1TextCode;
    TranData.lang1Img = TranData.lang2Img;
    TranData.lang1Txt = TranData.lang2Txt;
    TranData.lang1Code = TranData.lang2Code;
    TranData.lang1TextCode = TranData.lang2TextCode;
    TranData.lang2Img = tmpImg;
    TranData.lang2Txt = tmpTxt;
    TranData.lang2Code = tmpCode;
    TranData.lang2TextCode = tmpTextCode;
    setMainContent();
}

function setMainContent() {
    if (TranData.transMode == TRANS.KEY_MODE) {
        $('#trans-mode').attr('src', TRANS.MODE_KEY_IMG);
        $('#trans1-btn').attr('src', TRANS.LEFT_KEY_IMG);
        $('#trans2-btn').attr('src', TRANS.RIGHT_KEY_IMG);
    } else {
        $('#trans-mode').attr('src', TRANS.MODE_MIC_IMG);
        $('#trans1-btn').attr('src', TRANS.LEFT_MIC_IMG);
        $('#trans2-btn').attr('src', TRANS.RIGHT_MIC_IMG);
    }

    $('#lang1Txt').html(TranData.lang1Txt);
    $('#lang1Img').attr('src', TranData.lang1Img);
    $('#lang2Txt').html(TranData.lang2Txt);
    $('#lang2Img').attr('src', TranData.lang2Img);

    var bottomHeight = $('.translator_footer.mic').css('height');
    if ($('.translator_footer.key').css('display') != 'none')
        bottomHeight = $('.translator_footer.key').css('height');
    console.log(bottomHeight);

    var height = window.innerHeight;
// || document.documentElement.clientHeight
// || ;
// var height = document.body.clientHeight
// || document.documentElement.clientHeight
// || window.innerHeight;

    $('#main-trans-content').css({'height': 'calc(100vh - ' + parseInt(bottomHeight) + ')'});

// alert(bottomHeight);

    $('.bottom_space').css({'height': bottomHeight});
//    $('.bottom_space').css({'height': (parseInt(bottomHeight) - 10)});
    $('#in_progress').css({'bottom': bottomHeight});

    sessionStorage.setObject('trans_data', TranData);

}

function transClicked(type) {

    if (type == TRANS.LEFT) {
        TranData.srcLangCode = TranData.lang1Code;
        TranData.targetLangCode = TranData.lang2Code;
    } else {
        TranData.srcLangCode = TranData.lang2Code;
        TranData.targetLangCode = TranData.lang1Code;
    }
    if (TranData.transMode == TRANS.MIC_MODE) {
        console.log($('#in_progress').css('display'));
        if ($('#in_progress').css('display') == 'none') {
            Speech2Text(type);
        } else {
            if (browserSupported == TRANS.WEIXIN_ENABLED) {
                if ($('#status-message-txt').html() != '识别中') {
                    clearTimeout(TranData.timeoutID);
                    $('#status-message-txt').html('识别中');
                    on_stopRecord();
                }
            }
//StopSpeech(type);
        }
    } else {
        $('.translator_footer.mic').hide();
        $('.translator_footer.key').show();
        $('#trans-input').val('');
        $('#getLines').html('');
        $('#trans-input').attr('placeholder', PREV_TXT[TranData.srcLangCode]);
        $('#trans-input').css({'height': '10px'});

        setMainContent();
    }
    console.log(type);
}

function sendTranslationContent() {
    var msg = document.getElementById('trans-input').value;
    if (msg.length == 0) return;
    msg = msg.replace(/[\r\n]/g, ', ');
    msg = msg.replace(/\s{2,10}/g, ' ');

    performTranslation(msg);
}

function performTranslation(msg) {

    if (msg == "" || msg == undefined) {
        return;
    }

    $('#status-message-txt').html('识别中');

    $.ajax({
        type: 'POST',
        url: './lib/TranslateMethod.php', //rest API url
        dataType: 'json',
        data: {
            'secretKey': TRANS.TXT2TXT_KEY,
            'srcLang': TranData.srcLangCode,
            'targetLang': TranData.targetLangCode,
            'srcMessage': msg
        }, // set function name and parameters
        success: function (data) {
            console.log(data);
            if (data.status == false) {
                alert('服务器错误');
            } else {

//Translate msg to translated

                var main_html = $("#main-contentTxt").html();
                var translated = "";

// translated = PREV_TXT[TranData.targetLangCode];
                translated = data.targetMessage;
                var transMode = (TranData.srcLangCode == TranData.lang1Code) ?
                    (TRANS.LEFT) : (TRANS.RIGHT);
                var T2SCode = (TranData.srcLangCode == TranData.lang1Code) ?
                    (TranData.lang2TextCode) : (TranData.lang1TextCode);

                var idd = (new Date).getSeconds() + '' + (new Date).getMilliseconds() + parseInt(Math.random() * 1000);
                main_html += showTranslationItem(idd, transMode, msg, translated, T2SCode);
                $("#main-contentTxt").html(main_html);

                makeSessionItem(transMode, msg, translated, T2SCode);

                $('#trans-input').val('');
                $('#getLines').html('');
                $('#trans-input').css({'height': '10px'});
                objDiv = document.getElementById('main-trans-content');
                objDiv.scrollTop = objDiv.scrollHeight;
                StopSpeech();
                setMainContent();
            }
        },
        error: function (data) {
            console.log('Error : \n' + JSON.stringify(data));
//alert('服务器错误。');
        }
    });
}

// showing the information
function showTranslationItem(id, type, message1, message2, langCode) {
    var content_html = '';

    if ((typeof message1) == 'object') {
        message1 = '警告：翻译API功能已过期.';
    }
    if ((typeof message2) == 'object') {
        message2 = '警告：翻译API功能已过期.';
    }

    content_html += '<div class="trans-item ' + type + '">';

    content_html += '<div class="item ' + type + '">';
    content_html += '<div class="top">' + message1
        + '</div>';
    var nameTxt = "speaker1@3x.png";
    if (type == TRANS.RIGHT) {
        nameTxt = "speaker2@3x.png";
    }

    content_html += '<div class="bottom">' + message2
        + '<img class="txt2speechicon" id="txt2speechicon_' + id + '" src="resource/image/' + nameTxt + '"'
        + ' onclick="Text2Speech(\'' + langCode + '\',\'' + message2.toString().replace("'", "%") + '\',\'' + id + '\')">'
        + '</div>';
    content_html += '</div>';
    content_html += '</div>';

    return content_html;
}

// showing the information
function makeSessionItem(type, message1, message2, langCode) {
    var content_html = {
        'type': type,
        'message1': message1,
        'message2': message2,
        'langCode': langCode
    };
    var history = sessionStorage.getItem('trans_history');
    if (type == 0) return (history);
    if (history != undefined) history = JSON.parse(history);
    else history = [];
    history.push(content_html);
    sessionStorage.setItem('trans_history', JSON.stringify(history));

    return history;
}

function initializeStorage() {

    var langList = sessionStorage.getObject('lang_list').lang;
// new scenic area id : this area is the scenic area that exchange with current scenic area
    if (sessionStorage.getObject('trans_data') === null) {
        sessionStorage.setItem('trans_data', "");
        if (langList.length > 1) {
            TranData.lang1Txt = langList[0].lang_text;
            TranData.lang1Img = T_SERVER_URL + langList[0].flag;
            TranData.lang1Code = langList[0].speech_text_code;
            TranData.lang1TextCode = langList[0].text_speech_code;
            TranData.lang2Txt = langList[1].lang_text;
            TranData.lang2Img = T_SERVER_URL + langList[1].flag;
            TranData.lang2Code = langList[1].speech_text_code;
            TranData.lang2TextCode = langList[1].text_speech_code;
            TranData.transMode = TRANS.MIC_MODE;
        }
    } else {
        TranData = sessionStorage.getObject('trans_data');
    }

    if (langList.length > 1) {
        var isExist1 = false;
        var isExist2 = false;
        for (var i = 0; i < langList.length; i++) {
            if (TranData.lang1Txt == langList[i].lang_text) {
                isExist1 = true;
                TranData.lang1Txt = langList[i].lang_text;
                TranData.lang1Img = T_SERVER_URL + langList[i].flag;
                TranData.lang1Code = langList[i].speech_text_code;
                TranData.lang1TextCode = langList[i].text_speech_code;
            } else if (TranData.lang2Txt == langList[i].lang_text) {
                isExist2 = true;
                TranData.lang2Txt = langList[i].lang_text;
                TranData.lang2Img = T_SERVER_URL + langList[i].flag;
                TranData.lang2Code = langList[i].speech_text_code;
                TranData.lang2TextCode = langList[i].text_speech_code;
            }
        }
        if (!isExist1) {
            TranData.lang1Txt = langList[0].lang_text;
            TranData.lang1Img = T_SERVER_URL + langList[0].flag;
            TranData.lang1Code = langList[0].speech_text_code;
            TranData.lang1TextCode = langList[0].text_speech_code;
        } else if (!isExist2) {
            TranData.lang2Txt = langList[1].lang_text;
            TranData.lang2Img = T_SERVER_URL + langList[1].flag;
            TranData.lang2Code = langList[1].speech_text_code;
            TranData.lang2TextCode = langList[1].text_speech_code;
        }
    }
    sessionStorage.setObject('trans_data', TranData);
    console.log(TranData);

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

// Translator Configure

var bingClientTTS = new BingSpeech.TTSClient(TRANS.TXT2SPEECH_KEY);


function Text2Speech(langCode, msg, id) {
    $('#txt2speechicon_' + id).css({'width': '16px'});
    msg = msg.replace("%", "'");

    bingClientTTS.multipleXHR = true;
// alert('synthesize started');
    bingClientTTS.synthesize(msg, BingSpeech.SupportedLocales[langCode]);

// alert('synthesize finished');

    if (browserSupported == TRANS.WEIXIN_ENABLED) {
        clearTimeout(TranData.timeoutID);
        TranData.timeoutID = setTimeout(function () {
            $('.txt2speechicon_').css({'width': '12px'});
        }, 5000);
    }
}

var key;
var SDK;
var recognizer;

function Speech2Text(type) {

    if (browserSupported != TRANS.DISABLED) {        // show notify
        $('#in_progress').show();
        $('#status-message-txt').html('');
        clearTimeout();
        setTimeout(function () {
            $('#status-message-txt').html('录音中');
        }, 500);
        if (browserSupported == TRANS.WEIXIN_ENABLED) {
            on_startRecord();
            clearTimeout(TranData.timeoutID);
            TranData.timeoutID = setTimeout(function () {
                if ($('#in_progress').css('display') != 'none' &&
                    $('#status-message-txt').html() != '识别中') {
                    $('#status-message-txt').html('识别中');
                    on_stopRecord();
                }
            }, 10000);
        } else {
            Setup();
            RecognizerStart(SDK, recognizer);
        }
    }
    if (browserSupported == TRANS.DISABLED) {        // show notify
        clearTimeout(TranData.timeoutID);
        if (is_weixin()) {
            var content_html = '';
            content_html += '<center><img src="resource/image/browserhelp@3x.jpg" '
                + 'style="width:calc(80vw); height:auto;float:none;"></center><br>';
            $('.modal-body').html(content_html);
            $('#message_dialog').show();
        }
        else {
            var content_html = '';
            content_html += '<center>这种浏览器不支持语音翻译功能,<br> 请使用文字模式.<br><center>';
            $('.modal-body').html(content_html);
            $('#message_dialog').show();
        }
        $('#in_progress').hide();
    }
}

function onOk() {

    $('#message_dialog').hide();

    enableWebAudioContextForTrans();

    Initialize(function (speechSdk) {
        SDK = speechSdk;
        console.log("initialized");
//alert("audio enabled");
// startBtn.disabled = false;
    });
}

function StopSpeech(type) {
    console.log('StopSpeech Called.');
    clearTimeout();
    $('#in_progress').hide();
}

document.addEventListener("DOMContentLoaded", function () {
// startBtn = document.getElementById("startBtn");
// stopBtn = document.getElementById("stopBtn");
// phraseDiv = document.getElementById("phraseDiv");
// hypothesisDiv = document.getElementById("hypothesisDiv");
// statusDiv = document.getElementById("statusDiv");
// key = document.getElementById("key");
// languageOptions = document.getElementById("languageOptions");
// formatOptions = document.getElementById("formatOptions");
// inputSource = document.getElementById("inputSource");
// recognitionMode = document.getElementById("recognitionMode");
// filePicker = document.getElementById('filePicker');
//
// startBtn.addEventListener("click", function () {
//     if (key.value == "" || key.value == "YOUR_BING_SPEECH_API_KEY") {
//         alert("Please enter your Bing Speech subscription key!");
//         return;
//     }
//     if (!recognizer || previousSubscriptionKey != key.value) {
//         previousSubscriptionKey = key.value;
//         Setup();
//     }
//
//     hypothesisDiv.innerHTML = "";
//     phraseDiv.innerHTML = "";
//     RecognizerStart(SDK, recognizer);
//     startBtn.disabled = true;
//     stopBtn.disabled = false;
// });
//
// stopBtn.addEventListener("click", function () {
//     RecognizerStop(SDK, recognizer);
//     startBtn.disabled = false;
//     stopBtn.disabled = true;
// });

    enableWebAudioContextForTrans();

    Initialize(function (speechSdk) {
        SDK = speechSdk;
        console.log("initialized");
//alert("audio enabled");
// startBtn.disabled = false;
    });
});

function Setup() {
    if (recognizer != null) {
        RecognizerStop(SDK, recognizer);
    }
    console.log(TranData.srcLangCode);
    recognizer = RecognizerSetup(SDK, 'Interactive', TranData.srcLangCode, SDK.SpeechResultFormat['Simple'], TRANS.SPEECH2TXT_KEY);
}

function UpdateStatus(status) {
    console.log(status);
}

function UpdateRecognizedHypothesis(text, append) {
//alert(text);
    if (append)
        console.log('end_txt \n' + text);
    else
        console.log('appending_txt \n' + text);

// var length = hypothesisDiv.innerHTML.length;
// if (length > 403) {
//     hypothesisDiv.innerHTML = "..." + hypothesisDiv.innerHTML.substr(length - 400, length);
// }
}

function OnSpeechEndDetected() {
// StopSpeech();
    console.log('Speech end detected')
//stopBtn.disabled = true;
}

function UpdateRecognizedPhrase(json) {
// hypothesisDiv.innerHTML = "";
//alert((JSON.parse(json)).DisplayText);
    console.log('json_result:\n' + TranData.srcLangCode + json + '\n');
    if ((JSON.parse(json)).DisplayText != undefined) {
        performTranslation((JSON.parse(json)).DisplayText);
    } else {
        if (browserSupported != TRANS.DISABLED) {
            $('#status-message-txt').html('无音频输入');
            $('#in_progress').show();
            clearTimeout(TranData.timeoutID);
            TranData.timeoutID = setTimeout(function () {
                StopSpeech();
            }, 1000)
        }
    }
// phraseDiv.innerHTML += json + "\n";
}

function OnComplete() {
// StopSpeech();
    console.log('completed');
// startBtn.disabled = false;
// stopBtn.disabled = true;
}

function enableWebAudioContextForTrans() {

    var AudioContext = window.AudioContext || window.webkitAudioContext;
    var context = new AudioContext();
    var processor = context.createScriptProcessor(1024, 1, 1);
    processor.connect(context.destination);
    browserSupported = TRANS.DISABLED;
    try {

        var handleSuccess = function (stream) {
            browserSupported = TRANS.ENABLED; // 0:browser supported, 1:unavailable

            var input = context.createMediaStreamSource(stream);
            input.connect(processor);
            console.log(stream);
// processor.onaudioprocess = function (e) {
//     // Do something with the data, i.e Convert this to WAV
//     //console.log(e.inputBuffer);
// };
        };

//    navigator.mediaDevices.getUserMedia({audio: true, video: false}).then(handleSuccess);
        navigator.getUserMedia = navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia;

        navigator.getUserMedia({audio: true, video: false},
            handleSuccess,
            function (err) {
//alert('此浏览器不支持麦克风输入.');
                console.log("UserMedia failed");
                browserSupported = TRANS.DISABLED;
                if (is_weixin()) {
                    weixinConfigure();
                    browserSupported = TRANS.WEIXIN_ENABLED;
                }
            }
        )
    } catch (e) {
//alert(e);
        console.log(e);
        browserSupported = TRANS.DISABLED;
        if (is_weixin()) {
            weixinConfigure();
            browserSupported = TRANS.WEIXIN_ENABLED;
        }
    }
}