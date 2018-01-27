var PREV_TXT = {
    'ar-EG': 'الرجاء إدخال النص ...',
    'ca-ES': 'Introduïu text ...',
    'da-DK': 'Indtast venligst tekst...',
    'de-DE': 'Bitte Text eingeben...',
    'en-AU': 'Please input text...',
    'en-CA': 'Please input text...',
    'en-GB': 'Please input text...',
    'en-IN': 'Please input text...',
    'en-NZ': 'Please input text...',
    'en-US': 'Please input text...',
    'es-ES': 'Por favor ingrese el texto...',
    'es-MX': 'Por favor ingrese el texto...',
    'fi-FI': 'Syötä tekstiä...',
    'fr-CA': 'S\'il vous plaît entrer le texte...',
    'fr-FR': 'S\'il vous plaît entrer le texte...',
    'hi-IN': 'कृपया इनपुट पाठ करें...',
    'it-IT': 'Si prega di inserire il testo...',
    'ja-JP': 'テキストを入力してください...',
    'ko-KR': '본문을 입력하십시오...',
    'nb-NO': 'Vennligst skriv inn tekst...',
    'nl-NL': 'Voer tekst in...',
    'pl-PL': 'Proszę wpisać tekst...',
    'pt-BR': 'Por favor insira texto...',
    'pt-PT': 'Por favor insira texto...',
    'ru-RU': 'Введите текст...',
    'sv-SE': 'Vänligen skriv in text...',
    'zh-CN': '请输入文字...',
    'zh-HK': '请输入文字...',
    'zh-TW': '請輸入文字...',
}


function Initialize(onComplete) {
    if (!!window.SDK) {
        // document.getElementById('content').style.display = 'block';
        // document.getElementById('warning').style.display = 'none';
        onComplete(window.SDK);
    }
}

// Setup the recognizer
function RecognizerSetup(SDK, recognitionMode, language, format, subscriptionKey) {

    switch (recognitionMode) {
        case "Interactive":
            recognitionMode = SDK.RecognitionMode.Interactive;
            break;
        case "Conversation":
            recognitionMode = SDK.RecognitionMode.Conversation;
            break;
        case "Dictation":
            recognitionMode = SDK.RecognitionMode.Dictation;
            break;
        default:
            recognitionMode = SDK.RecognitionMode.Interactive;
    }

    var recognizerConfig = new SDK.RecognizerConfig(
        new SDK.SpeechConfig(
            new SDK.Context(
                new SDK.OS(navigator.userAgent, "Browser", null),
                new SDK.Device("SpeechSample", "SpeechSample", "1.0.00000"))),
        recognitionMode,
        language, // Supported languages are specific to each recognition mode. Refer to docs.
        format); // SDK.SpeechResultFormat.Simple (Options - Simple/Detailed)


    var useTokenAuth = false;

    var authentication = function () {
        if (!useTokenAuth)
            return new SDK.CognitiveSubscriptionKeyAuthentication(subscriptionKey);

        var callback = function () {
            var tokenDeferral = new SDK.Deferred();
            try {
                var xhr = new (XMLHttpRequest || ActiveXObject)('MSXML2.XMLHTTP.3.0');
                xhr.open('GET', '/token', 1);
                xhr.onload = function () {
                    if (xhr.status === 200) {
                        tokenDeferral.Resolve(xhr.responseText);
                    } else {
                        tokenDeferral.Reject('Issue token request failed.');
                    }
                };
                xhr.send();
            } catch (e) {
                window.console && console.log(e);
                tokenDeferral.Reject(e.message);
            }
            return tokenDeferral.Promise();
        }

        return new SDK.CognitiveTokenAuthentication(callback, callback);
    }();

    // var files = document.getElementById('filePicker').files;
    if (browserSupported == TRANS.WEIXIN_ENABLED) {
        var audioUrl = "https://www.ayoubc.com/tour/plugin/Wxpay/"+TranData.tempFile;
        fetch(audioUrl)
            .then(response => response.blob())
            .then(blob => {
                let files = new File([blob], audioUrl, {
                    type: "audio/x-wav", lastModified: (new Date()).getTime()
                });
                // do stuff with `file`
                console.log(files);
                recognizer = SDK.CreateRecognizerWithFileAudioSource(recognizerConfig, authentication, files);

                RecognizerStart(SDK, recognizer);
            })
            .catch(err => alert(err));
        return null;
    } else {
        return SDK.CreateRecognizer(recognizerConfig, authentication);
    }
}

// Start the recognition
function RecognizerStart(SDK, recognizer) {
    recognizer.Recognize((event) => {
        /*
         Alternative syntax for typescript devs.
         if (event instanceof SDK.RecognitionTriggeredEvent)
        */
        switch (event.Name) {
            case "RecognitionTriggeredEvent":
                UpdateStatus("Initializing");
                break;
            case "ListeningStartedEvent":
                UpdateStatus("Listening");
                break;
            case "RecognitionStartedEvent":
                UpdateStatus("Listening_Recognizing");
                break;
            case "SpeechStartDetectedEvent":
                UpdateStatus("Listening_DetectedSpeech_Recognizing");
                console.log(JSON.stringify(event.Result)); // check console for other information in result
                break;
            case "SpeechHypothesisEvent":
                UpdateRecognizedHypothesis(event.Result.Text, false);
                console.log(JSON.stringify(event.Result)); // check console for other information in result
                break;
            case "SpeechFragmentEvent":
                UpdateRecognizedHypothesis(event.Result.Text, true);
                console.log(JSON.stringify(event.Result)); // check console for other information in result
                break;
            case "SpeechEndDetectedEvent":
                OnSpeechEndDetected();
                UpdateStatus("Processing_Adding_Final_Touches");
                console.log(JSON.stringify(event.Result)); // check console for other information in result
                break;
            case "SpeechSimplePhraseEvent":
                UpdateRecognizedPhrase(JSON.stringify(event.Result, null, 3));
                break;
            case "SpeechDetailedPhraseEvent":
                UpdateRecognizedPhrase(JSON.stringify(event.Result, null, 3));
                break;
            case "RecognitionEndedEvent":
                OnComplete();
                UpdateStatus("Idle");
                console.log(JSON.stringify(event)); // Debug information
                break;
            default:
                console.log(JSON.stringify(event)); // Debug information
        }
    })
        .On(() => {
                // The request succeeded. Nothing to do here.
            },
            (error) => {
                console.error(error);
            });
}

// Stop the Recognition.
function RecognizerStop(SDK, recognizer) {
    // recognizer.AudioSource.Detach(audioNodeId) can be also used here. (audioNodeId is part of ListeningStartedEvent)
    recognizer.AudioSource.TurnOff();
}