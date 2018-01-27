// JS API

// 1 判断当前版本是否支持指定 JS 接口，支持批量判断
function on_checkJsApi() {
    wx.checkJsApi({
        jsApiList: [
            'getNetworkType',
            'previewImage'
        ],
        success: function (res) {
            alert(JSON.stringify(res));
        }
    });
};

// 2. 分享接口
// 2.1 监听“分享给朋友”，按钮点击、自定义分享内容及分享结果接口
function on_onMenuShareAppMessage() {
    wx.onMenuShareAppMessage({
        title: '互联网之子',
        desc: '在长大的过程中，我才慢慢发现，我身边的所有事，别人跟我说的所有事，那些所谓本来如此，注定如此的事，它们其实没有非得如此，事情是可以改变的。更重要的是，有些事既然错了，那就该做出改变。',
        link: 'http://movie.douban.com/subject/25785114/',
        imgUrl: 'http://img3.douban.com/view/movie_poster_cover/spst/public/p2166127561.jpg',
        trigger: function (res) {
            alert('用户点击发送给朋友');
        },
        success: function (res) {
            alert('已分享');
        },
        cancel: function (res) {
            alert('已取消');
        },
        fail: function (res) {
            alert(JSON.stringify(res));
        }
    });
    alert('已注册获取“发送给朋友”状态事件');
};

// 2.2 监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口
function on_onMenuShareTimeline() {
    wx.onMenuShareTimeline({
        title: '互联网之子',
        link: 'http://movie.douban.com/subject/25785114/',
        imgUrl: 'http://img3.douban.com/view/movie_poster_cover/spst/public/p2166127561.jpg',
        trigger: function (res) {
            alert('用户点击分享到朋友圈');
        },
        success: function (res) {
            alert('已分享');
        },
        cancel: function (res) {
            alert('已取消');
        },
        fail: function (res) {
            alert(JSON.stringify(res));
        }
    });
    alert('已注册获取“分享到朋友圈”状态事件');
};

// 2.3 监听“分享到QQ”按钮点击、自定义分享内容及分享结果接口
function on_onMenuShareQQ() {
    wx.onMenuShareQQ({
        title: '互联网之子',
        desc: '在长大的过程中，我才慢慢发现，我身边的所有事，别人跟我说的所有事，那些所谓本来如此，注定如此的事，它们其实没有非得如此，事情是可以改变的。更重要的是，有些事既然错了，那就该做出改变。',
        link: 'http://movie.douban.com/subject/25785114/',
        imgUrl: 'http://img3.douban.com/view/movie_poster_cover/spst/public/p2166127561.jpg',
        trigger: function (res) {
            alert('用户点击分享到QQ');
        },
        complete: function (res) {
            alert(JSON.stringify(res));
        },
        success: function (res) {
            alert('已分享');
        },
        cancel: function (res) {
            alert('已取消');
        },
        fail: function (res) {
            alert(JSON.stringify(res));
        }
    });
    alert('已注册获取“分享到 QQ”状态事件');
};

// 2.4 监听“分享到微博”按钮点击、自定义分享内容及分享结果接口
function on_onMenuShareWeibo() {
    wx.onMenuShareWeibo({
        title: '互联网之子',
        desc: '在长大的过程中，我才慢慢发现，我身边的所有事，别人跟我说的所有事，那些所谓本来如此，注定如此的事，它们其实没有非得如此，事情是可以改变的。更重要的是，有些事既然错了，那就该做出改变。',
        link: 'http://movie.douban.com/subject/25785114/',
        imgUrl: 'http://img3.douban.com/view/movie_poster_cover/spst/public/p2166127561.jpg',
        trigger: function (res) {
            alert('用户点击分享到微博');
        },
        complete: function (res) {
            alert(JSON.stringify(res));
        },
        success: function (res) {
            alert('已分享');
        },
        cancel: function (res) {
            alert('已取消');
        },
        fail: function (res) {
            alert(JSON.stringify(res));
        }
    });
    alert('已注册获取“分享到微博”状态事件');
};


// 3 智能接口
var voice = {
    localId: '',
    serverId: ''
};

// 3.1 识别音频并返回识别结果
function on_translateVoice() {
    if (voice.localId == '') {
        alert('请先使用 startRecord 接口录制一段声音');
        return;
    }
    wx.translateVoice({
        localId: voice.localId,
        isShowProgressTips: 0, // 默认为1，显示进度提示
        complete: function (res) {
            if (res.hasOwnProperty('translateResult')) {
                performTranslation(res.translateResult);
                //alert('识别结果：' + res.translateResult);
            } else {
                UpdateRecognizedPhrase('{"id":"0"}');
                //alert('无法识别');
            }
        }
    });
};

// 4 音频接口
// 4.2 开始录音
function on_startRecord() {
    wx.startRecord({
        success: function (res) {
            // alert(
            // res);
        },
        cancel: function () {
            alert('用户拒绝授权录音');
        },
        fail: function () {
            clearTimeout();
            browserSupported = TRANS.DISABLED;
            Speech2Text();
        }
    });
};

// 4.3 停止录音
function on_stopRecord() {
    wx.stopRecord({
        success: function (res) {
            voice.localId = res.localId;
            if(TranData.srcLangCode=='zh-CN'){
                on_translateVoice();
            }else{
                on_uploadVoice();
            }
        },
        fail: function (res) {
            alert(JSON.stringify(res));
        }
    });
};

// 4.4 监听录音自动停止
wx.onVoiceRecordEnd({
    complete: function (res) {
        voice.localId = res.localId;
        alert('录音时间已超过一分钟');
    }
});

// 4.5 播放音频
function on_playVoice() {
    if (voice.localId == '') {
        alert('请先使用 startRecord 接口录制一段声音');
        return;
    }

    wx.playVoice({
        localId: voice.localId
    });
};

// 4.6 暂停播放音频
function on_pauseVoice() {
    wx.pauseVoice({
        localId: voice.localId
    });
};

// 4.7 停止播放音频
function on_stopVoice() {
    wx.stopVoice({
        localId: voice.localId
    });
};


// 4.8 上传语音
function on_uploadVoice() {
    if (voice.localId == '') {
        alert('请先使用 startRecord 接口录制一段声音');
        return;
    }
    wx.uploadVoice({
        localId: voice.localId,
        isShowProgressTips: 0, // 默认为1，显示进度提示
        success: function (res) {
            //alert('上传语音成功，serverId 为' + res.serverId);
            voice.serverId = res.serverId;
            $.ajax({
                type: 'POST',
                url: 'https://www.ayoubc.com/tour/plugin/Wxpay/get_audio.php', //rest API url
                dataType: 'json',
                data: {'serverId': res.serverId}, // set function name and parameters
                success: function (data) {
                    //successfully downloaded
                    // alert(data);
                    if(data.data!=""){
                    TranData.tempFile=data.data;
                    Setup();
                    }else{
                        browserSupported=TRANS.DISABLED;
                    }

                },
                error: function (data) {
                    alert('服务器错误。');
                }
            });
        }
    });
};

// 4.9 下载语音
function on_downloadVoice() {
    if (voice.serverId == '') {
        alert('请先使用 uploadVoice 上传声音');
        return;
    }
    wx.downloadVoice({
        serverId: voice.serverId,
        success: function (res) {
            alert('下载语音成功，localId 为' + res.localId);
            voice.localId = res.localId;
        }
    });
};

// 5 图片接口
// 5.1 拍照、本地选图
var images = {
    localId: [],
    serverId: []
};

function on_chooseImage() {
    wx.chooseImage({
        success: function (res) {
            images.localId = res.localIds;
            alert('已选择 ' + res.localIds.length + ' 张图片');
        }
    });
};

// 5.2 图片预览
function on_previewImage() {
    wx.previewImage({
        current: 'http://img5.douban.com/view/photo/photo/public/p1353993776.jpg',
        urls: [
            'http://img3.douban.com/view/photo/photo/public/p2152117150.jpg',
            'http://img5.douban.com/view/photo/photo/public/p1353993776.jpg',
            'http://img3.douban.com/view/photo/photo/public/p2152134700.jpg'
        ]
    });
};

// 5.3 上传图片
function on_uploadImage() {
    if (images.localId.length == 0) {
        alert('请先使用 chooseImage 接口选择图片');
        return;
    }
    var i = 0, length = images.localId.length;
    images.serverId = [];

    function upload() {
        wx.uploadImage({
            localId: images.localId[i],
            success: function (res) {
                i++;
                alert('已上传：' + i + '/' + length);
                images.serverId.push(res.serverId);
                if (i < length) {
                    upload();
                }
            },
            fail: function (res) {
                alert(JSON.stringify(res));
            }
        });
    }

    upload();
};

// 5.4 下载图片
function on_downloadImage() {
    if (images.serverId.length === 0) {
        alert('请先使用 uploadImage 上传图片');
        return;
    }
    var i = 0, length = images.serverId.length;
    images.localId = [];

    function download() {
        wx.downloadImage({
            serverId: images.serverId[i],
            success: function (res) {
                i++;
                alert('已下载：' + i + '/' + length);
                images.localId.push(res.localId);
                if (i < length) {
                    download();
                }
            }
        });
    }

    download();
};

// 6 设备信息接口
// 6.1 获取当前网络状态
function on_getNetworkType() {
    wx.getNetworkType({
        success: function (res) {
            alert(res.networkType);
        },
        fail: function (res) {
            alert(JSON.stringify(res));
        }
    });
};

// 7 地理位置接口
// 7.1 查看地理位置
function on_openLocation() {
    wx.openLocation({
        latitude: 23.099994,
        longitude: 113.324520,
        name: 'TIT 创意园',
        address: '广州市海珠区新港中路 397 号',
        scale: 14,
        infoUrl: 'http://weixin.qq.com'
    });
};

// 7.2 获取当前地理位置
function on_getLocation() {
    wx.getLocation({
        success: function (res) {
            alert(JSON.stringify(res));
        },
        cancel: function (res) {
            alert('用户拒绝授权获取地理位置');
        }
    });
};

// 8 界面操作接口
// 8.1 隐藏右上角菜单
function on_hideOptionMenu() {
    wx.hideOptionMenu();
};

// 8.2 显示右上角菜单
function on_showOptionMenu() {
    wx.showOptionMenu();
};

// 8.3 批量隐藏菜单项
function on_hideMenuItems() {
    wx.hideMenuItems({
        menuList: [
            'menuItem:readMode', // 阅读模式
            'menuItem:share:timeline', // 分享到朋友圈
            'menuItem:copyUrl' // 复制链接
        ],
        success: function (res) {
            alert('已隐藏“阅读模式”，“分享到朋友圈”，“复制链接”等按钮');
        },
        fail: function (res) {
            alert(JSON.stringify(res));
        }
    });
};

// 8.4 批量显示菜单项
function on_showMenuItems() {
    wx.showMenuItems({
        menuList: [
            'menuItem:readMode', // 阅读模式
            'menuItem:share:timeline', // 分享到朋友圈
            'menuItem:copyUrl' // 复制链接
        ],
        success: function (res) {
            alert('已显示“阅读模式”，“分享到朋友圈”，“复制链接”等按钮');
        },
        fail: function (res) {
            alert(JSON.stringify(res));
        }
    });
};

// 8.5 隐藏所有非基本菜单项
function on_hideAllNonBaseMenuItem() {
    wx.hideAllNonBaseMenuItem({
        success: function () {
            alert('已隐藏所有非基本菜单项');
        }
    });
};

// 8.6 显示所有被隐藏的非基本菜单项
function on_showAllNonBaseMenuItem() {
    wx.showAllNonBaseMenuItem({
        success: function () {
            alert('已显示所有非基本菜单项');
        }
    });
};

// 8.7 关闭当前窗口
function on_closeWindow() {
    wx.closeWindow();
};

// 9 微信原生接口
// 9.1.1 扫描二维码并返回结果
function on_scanQRCode0() {
    wx.scanQRCode({
        desc: 'scanQRCode desc'
    });
};

// 9.1.2 扫描二维码并返回结果
function on_scanQRCode1() {
    wx.scanQRCode({
        needResult: 1,
        desc: 'scanQRCode desc',
        success: function (res) {
            alert(JSON.stringify(res));
        }
    });
};

// 10 微信支付接口
// 10.1 发起一个支付请求
function on_chooseWXPay() {
    wx.chooseWXPay({
        timestamp: 1414723227,
        nonceStr: 'noncestr',
        package: 'addition=action_id%3dgaby1234%26limit_pay%3d&bank_type=WX&body=innertest&fee_type=1&input_charset=GBK&notify_url=http%3A%2F%2F120.204.206.246%2Fcgi-bin%2Fmmsupport-bin%2Fnotifypay&out_trade_no=1414723227818375338&partner=1900000109&spbill_create_ip=127.0.0.1&total_fee=1&sign=432B647FE95C7BF73BCD177CEECBEF8D',
        paySign: 'bd5b1933cda6e9548862944836a9b52e8c9a2b69'
    });
};

// 11.3  跳转微信商品页
function on_openProductSpecificView() {
    wx.openProductSpecificView({
        productId: 'pDF3iY_m2M7EQ5EKKKWd95kAxfNw'
    });
};

// 12 微信卡券接口
// 12.1 添加卡券
function on_addCard() {
    wx.addCard({
        cardList: [
            {
                cardId: 'pDF3iY9tv9zCGCj4jTXFOo1DxHdo',
                cardExt: '{"code": "", "openid": "", "timestamp": "1418301401", "signature":"64e6a7cc85c6e84b726f2d1cbef1b36e9b0f9750"}'
            },
            {
                cardId: 'pDF3iY9tv9zCGCj4jTXFOo1DxHdo',
                cardExt: '{"code": "", "openid": "", "timestamp": "1418301401", "signature":"64e6a7cc85c6e84b726f2d1cbef1b36e9b0f9750"}'
            }
        ],
        success: function (res) {
            alert('已添加卡券：' + JSON.stringify(res.cardList));
        }
    });
};

// 12.2 选择卡券
function on_chooseCard() {
    wx.chooseCard({
        cardSign: '97e9c5e58aab3bdf6fd6150e599d7e5806e5cb91',
        timestamp: 1417504553,
        nonceStr: 'k0hGdSXKZEj3Min5',
        success: function (res) {
            alert('已选择卡券：' + JSON.stringify(res.cardList));
        }
    });
};

// 12.3 查看卡券
function on_openCard() {
    alert('您没有该公众号的卡券无法打开卡券。');
    wx.openCard({
        cardList: []
    });
};

//
// var shareData = {
//     title: '微信JS-SDK Demo',
//     desc: '微信JS-SDK,帮助第三方为用户提供更优质的移动web服务',
//     link: 'http://demo.open.weixin.qq.com/jssdk/',
//     imgUrl: 'http://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRt8Qia4lv7k3M9J1SKqKCImxJCt7j9rHYicKDI45jRPBxdzdyREWnk0ia0N5TMnMfth7SdxtzMvVgXg/0'
// };
// wx.onMenuShareAppMessage(shareData);
// wx.onMenuShareTimeline(shareData);

wx.error(function (res) {
    alert(res.errMsg);
});
