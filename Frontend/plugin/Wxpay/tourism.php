<?php
    $shop_id = 0;
    $target_id = 0;
    $map_type = 0;

    if(isset($_GET['shopid']))  $shop_id = $_GET['shopid'];
    if(isset($_GET['targetid'])) $target_id = $_GET['targetid'];
    if(isset($_GET['map_type'])) $map_type = $_GET['map_type'];
?>
<!DOCTYPE html>
<html>
<head lang="en">
    <title>旅游线路</title>
    <meta charset="utf-8">
    <link rel="shortcut icon" href="resource/image/logo.png" type="image/x-icon"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
    <meta name="apple-touch-fullscreen" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <meta name="format-detection" content="telephone=no">

    <link rel="stylesheet" type="text/css" href="css/bootstrap.min.css"/>
    <link rel="stylesheet" href="css/font-awesome/css/font-awesome.min.css">
    <link rel="stylesheet" href="css/AdminLTE.min.css">
    <link rel="stylesheet" href="css/skins/_all-skins.min.css">
    <link rel="stylesheet" href="css/style.css">

    <script type="text/javascript" src="js/plugins/jquery.min.js"></script>
    <script type="text/javascript" src="js/plugins/bootstrap.min.js"></script>
</head>

<body>
<div id="content">
    <div id="container"  style="background-image: url('resource/image/bg.png')">
        <div id="tourism-body">
            <!--
                <div class="course_column"><h5>景区 1 : 故宫 (10个景点)</h5></div>
                <div class="course_column"><h5>景区 2 : 圆明园 (10个景点)</h5></div>
                <div class="course_column"><h5>景区 3 : 颐和园 (10个景点)</h5></div>
                <div class="btn-custom btn-course"><h5>支付100元，解锁线路</h5></div>
                <div class="btn-custom btn-course"><h5>输入授权码</h5></div>
            -->
        </div>
    </div>
</div>

<!--phone number verify dialog-->
<div class="modal custom-modal" id="phone_verify">
    <div class="modal-dialog" id="phone_verify_dialog">
        <div class="modal-content" style="height: 100%;border-radius: 12px;">
            <div class="modal-header" id="phone_verify_title" style="padding: 0px; margin: 0px;border: none">
                <button class="close" onclick="phone_verify_dialog_close()">
                    <span aria-hidden="true">×</span>
                </button>
                <img src="resource/image/top.png" style="width: 100%">
                <div style="text-align: center">
                    <img src="resource/image/sign_in.png">
                    <h4>授权登录</h4>
                </div>
            </div>
            <div class="modal-body" id="phone_verify_content">
                <div>
                    <h5 style="float: left">手机号</h5>
                    <input type="text" class="form-control" id="phone_number" placeholder="" style="width: 76%" onkeypress="return event.charCode >= 48 && event.charCode <= 57">
                </div>
                <div>
                    <h5 style="float: left">验证码</h5>
                    <input type="text" class="form-control" id="verify_code" placeholder="验证码" style="width: 35%" onkeypress="return event.charCode >= 48 && event.charCode <= 57">
                    <div class="btn-custom" id="btn_sendSMS" onclick="sendSMSToPhone()"><h5>获取验证码</h5></div>
                </div>
            </div>
            <div class="btn-custom" id="confirm_verify" onclick="confirm_verify_phone()">
                <i class="fa fa-refresh fa-spin" id="loading"></i>
                <h4 style="margin: 5px 0px">立即认证</h4>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div>

<!--code authorization dialog-->
<div class="modal custom-modal" id="code_auth">
    <div class="modal-dialog" id="code_auth_dialog">
        <div class="modal-content" style="height: 100%;border-radius: 12px;">
            <div class="modal-header" id="code_auth_title" style="padding: 0px; margin: 0px;border: none">
                <button class="close" onclick="code_auth_dialog_close()">
                    <span aria-hidden="true">×</span>
                </button>
                <img src="resource/image/top.png" style="width: 100%">
                <div style="text-align: center">
                    <img src="resource/image/activation.png">
                    <h4>授权激活</h4>
                </div>
            </div>
            <div class="modal-body" id="code_auth_content">
                <div style="margin: 20px 0px">
                    <h5 style="float: left; margin-left: 5px; margin-right: 15px">授权码</h5>
                    <input type="text" class="form-control" id="auth_code" placeholder="" style="width: 70%" onkeypress="return event.charCode >= 48 && event.charCode <= 57">
                </div>
            </div>
            <div id="auth_error" style="text-align:center; height:20px; display: none">
                <h4>授权码有误，请重新输入！</h4>
            </div>
            <div style="margin: 10px 20px; height: 50px">
                <div class="btn-custom" id="btn_cancel"  onclick="OnCancelauthcodeVerify()" >
                    <h5 style="margin: 5px 0px">取消</h5>
                </div>
                <div class="btn-custom" id="btn_ok" onclick="OnConfirmauthCode()" >
                    <h5 style="margin: 5px 0px">确认</h5>
                </div>

            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div>
<div class="modal custom-modal" id="message_dialog">
    <div class="modal-dialog" id="alert_message_dialog">
        <div class="modal-content" style="border-radius: 12px;">
            <div class="modal-body" style="padding-bottom: 0px;">
            </div>
            <div class="modal-footer" style="border: none; padding-top: 0px;">
                <button id="msg_cancel" type="button" class="btn_custom btn-default"
                        onclick="$('#message_dialog').modal('hide');">取消
                </button>
                <button id="msg_ok" type="button" class="btn_custom"
                        onclick="onOk()">确定
                </button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div>

</body>

<?php include('footer.php'); ?>

<script type="text/javascript">
    var shop_id = <?php echo $shop_id?>;
    var cur_tourism_id = <?php echo $target_id?>;
    var map_type = <?php echo $map_type?>;

    function buy_course_dialog_close(){
        $('#buy_course').hide();
    }

    function code_auth_dialog_close(){
        $('#code_auth').hide();
    }
</script>
<script type="text/javascript" src="js/global.js"></script>
<script type="text/javascript" src="js/tourism.js"></script>

</html>
