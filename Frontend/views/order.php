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
    <script type="text/javascript" src="../js/order.js"></script>
</head>

<body>
    <div id="content">
        <div class="header" id="app_header">
            <h3 style="text-align: center">
                <a href="javascript:history.back()" style="float: left; position: fixed;left: 10px; top: 0px">
                    <img src="../resource/image/left_arrow.png" id="back_img">
                </a>
                订单
            </h3>
        </div>
        <div id="container"  style="background-color: #f6f6f6">
            <div class="nav-tabs-custom" id="order_tab">
                <ul class="nav nav-tabs" id="tab_header">
                    <li class="col-xs-3 active"><a href="#tab_all" data-toggle="tab" aria-expanded="true">全部</a></li>
                    <li class="col-xs-3"><a href="#tab_unpaid" data-toggle="tab" aria-expanded="false">未付款</a></li>
                    <li class="col-xs-3"><a href="#tab_cancelled" data-toggle="tab" aria-expanded="false">已取消</a></li>
                    <li class="col-xs-3"><a href="#tab_expired" data-toggle="tab" aria-expanded="false">已过期</a></li>
                </ul>
                <div class="tab-content">
                    <div class="tab-pane active" id="tab_all" >
                        <div class="order order_using">
                            <div class="order_header">
                                <h5>订单编号 : 5897427848</h5>
                                <h5 class="order_state">使用中</h5>
                            </div>
                            <div class="order_body">
                                <img src="../resource/image/tmp_order.png">
                                <div>
                                    <h5>鹤山古劳水乡</h5>
                                    <h5 style="color: red">¥30.00</h5>
                                </div>
                            </div>
                        </div>
                        <div class="order order_unpaid">
                            <div class="order_header">
                                <h5>订单编号 : 5897427845</h5>
                                <h5 class="order_state">未付款</h5>
                            </div>
                            <div class="order_body">
                                <img src="../resource/image/tmp_order.png">
                                <div>
                                    <h5>鹤山古劳水乡</h5>
                                    <h5 style="color: red">¥30.00</h5>
                                </div>
                            </div>
                            <div class="order_footer">
                                <div><h5>取消订单</h5></div>
                                <div><h5>付款</h5></div>
                            </div>
                        </div>
                        <div class="order order_cancelled">
                            <div class="order_header">
                                <h5>订单编号 : 5897427843</h5>
                                <h5 class="order_state">已取消</h5>
                            </div>
                            <div class="order_body">
                                <img src="../resource/image/tmp_order.png">
                                <div>
                                    <h5>鹤山古劳水乡</h5>
                                    <h5>授权码 : 9090129</h5>
                                </div>
                            </div>
                            <div class="order_footer">
                                <div><h5>重新购买</h5></div>
                            </div>
                        </div>
                        <div class="order order_expired">
                            <div class="order_header">
                                <h5>订单编号 : 5897427842</h5>
                                <h5 class="order_state">已过期</h5>
                            </div>
                            <div class="order_body">
                                <img src="../resource/image/tmp_order.png">
                                <div>
                                    <h5>鹤山古劳水乡</h5>
                                    <h5 style="color: red">¥30.00</h5>
                                </div>
                            </div>
                            <div class="order_footer">
                                <div><h5>重新购买</h5></div>
                            </div>
                        </div>
                    </div>
                    <!-- /.tab-pane -->
                    <div class="tab-pane" id="tab_unpaid">
                        <div class="order order_unpaid">
                            <div class="order_header">
                                <h5>订单编号 : 5897427845</h5>
                                <h5 class="order_state">未付款</h5>
                            </div>
                            <div class="order_body">
                                <img src="../resource/image/tmp_order.png">
                                <div>
                                    <h5>鹤山古劳水乡</h5>
                                    <h5 style="color: red">¥30.00</h5>
                                </div>
                            </div>
                            <div class="order_footer">
                                <div><h5>取消订单</h5></div>
                                <div><h5>付款</h5></div>
                            </div>
                        </div>
                    </div>
                    <!-- /.tab-pane -->
                    <div class="tab-pane" id="tab_cancelled">
                        <div class="order order_cancelled">
                            <div class="order_header">
                                <h5>订单编号 : 5897427843</h5>
                                <h5 class="order_state">已取消</h5>
                            </div>
                            <div class="order_body">
                                <img src="../resource/image/tmp_order.png">
                                <div>
                                    <h5>鹤山古劳水乡</h5>
                                    <h5>授权码 : 9090129</h5>
                                </div>
                            </div>
                            <div class="order_footer">
                                <div><h5>重新购买</h5></div>
                            </div>
                        </div>
                    </div>
                    <!-- /.tab-pane -->
                    <div class="tab-pane" id="tab_expired">
                        <div class="order order_expired">
                            <div class="order_header">
                                <h5>订单编号 : 5897427842</h5>
                                <h5 class="order_state">已过期</h5>
                            </div>
                            <div class="order_body">
                                <img src="../resource/image/tmp_order.png">
                                <div>
                                    <h5>鹤山古劳水乡</h5>
                                    <h5 style="color: red">¥30.00</h5>
                                </div>
                            </div>
                            <div class="order_footer">
                                <div><h5>重新购买</h5></div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- /.tab-content -->
            </div>
        </div>
    </div>
</body>
</html>
