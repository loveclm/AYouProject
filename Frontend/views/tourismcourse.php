<!DOCTYPE html>
<html>
<head lang="en">
    <title>A游不错</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
    <meta name="apple-touch-fullscreen" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <meta name="format-detection" content="telephone=no">

    <link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"/>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.5.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="../css/AdminLTE.min.css">
    <link rel="stylesheet" href="../css/skins/_all-skins.min.css">
    <link rel="stylesheet" href="../css/style.css">

    <script type="text/javascript" src="../js/plugins/jquery.min.js"></script>
    <script type="text/javascript" src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
    <script type="text/javascript" src="../js/global.js"></script>
    <script type="text/javascript" src="../js/tourismcourse.js"></script>
</head>

<body>
    <div id="content">
        <div class="header" id="app_header">
            <h3 style="text-align: center">
                <a href="javascript: back()" style="float: left; position: fixed;left: 10px; top: 0px">
                    <img src="../resource/image/left_arrow.png" id="back_img">
                </a>
                旅游线路
            </h3>
        </div>
        <div id="container">
            <div id="tourismlist-header">
                <h4>旅游线路 (共1条线路)</h4>
            </div>
            <div id="tourismlist-body">
                <!--
                <div class="tourismlist_item">
                    <div  style="background-color: green; float: left">1</div>
                    <h4 style="float: left; padding-left:10px;">旅游名称</h4>
                    <img src="../image/more.png" style="float:right; padding:10px">
                </div>
                -->
            </div>
        </div>
    </div>
    <!-- dialog buying the tourism course-->
    <div class="modal custom-modal" id="buy_course">
        <div class="modal-dialog" id="buy_course_dialog">
            <div class="modal-content">
                <div class="modal-header" id="buy_course_title">
                    <button class="close" onclick="buy_course_dialog_close()">
                        <span aria-hidden="true">×</span>
                    </button>
                    <h5>故宫－圆明园－颐和园</h5>
                </div>
                <div class="modal-body" id="buy_course_content" style="overflow-y: scroll; height: 80%">
                    <div class="course_column"><h5>景区 1 : 故宫 (10个景点)</h5></div>
                    <div class="course_column"><h5>景区 2 : 圆明园 (10个景点)</h5></div>
                    <div class="course_column"><h5>景区 3 : 颐和园 (10个景点)</h5></div>
                    <div class="btn-custom btn-course"><h5>支付100元，解锁线路</h5></div>
                    <div class="btn-custom btn-course"><h5>输入授权码</h5></div>
                </div>
                <div class="modal-footer" style="padding: 0px; border: none">
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
                    <img src="../resource/image/top.png" style="width: 100%">
                    <div style="text-align: center">
                        <img src="../resource/image/activation.png">
                        <h4>授权激活</h4>
                    </div>
                </div>
                <div class="modal-body" id="code_auth_content">
                    <div style="margin: 20px 0px">
                        <h4 style="float: left; margin-left: 5px; margin-right: 15px">授权码</h4>
                        <input type="text" class="form-control" id="auth_code" placeholder="" style="width: 70%" onkeypress="return event.charCode >= 48 && event.charCode <= 57">
                    </div>
                </div>
                <div id="auth_error" style="text-align:center; height:20px; display: none">
                    <h4>授权码有误，请重新输入！</h4>
                </div>
                <div style="margin: 10px 20px; height: 50px">
                    <div class="btn-custom" onclick="OnCancelauthcodeVerify()" style="float: left; margin: 0px 15px; padding: 0px 30px; border-radius: 20px">
                        <h4 style="margin: 5px 0px">取消</h4>
                    </div>
                    <div class="btn-custom" onclick="OnConfirmauthCode()" style="float: left; margin: 0px 15px; padding: 0px 30px; border-radius: 20px">
                        <h4 style="margin: 5px 0px">确认</h4>
                    </div>

                </div>
            </div>
            <!-- /.modal-content -->
        </div>
        <!-- /.modal-dialog -->
    </div>

</body>
</html>

<script type="text/javascript">
    function buy_course_dialog_close(){
        $('#buy_course').hide();
    }

    function code_auth_dialog_close(){
        $('#code_auth').hide();
    }

</script>