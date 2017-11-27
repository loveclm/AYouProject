<?php
    $str = "";
    $type = 0;
    if(isset($_GET['str'])) $str = $_GET['str'];
    if(isset($_GET['type'])) $type = $_GET['type'];
?>

<!DOCTYPE html>
<html>
<head lang="en">
    <title>A有不错</title>
    <meta charset="utf-8">
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
    <link rel="stylesheet" href="css/menu.css">

    <script type="text/javascript" src="js/plugins/jquery.min.js"></script>
    <script type="text/javascript" src="js/plugins/bootstrap.min.js"></script>
    <script type="text/javascript" src="js/global.js"></script>
</head>

<style type="text/css">
    #container{
        display: block;
        width: 100%;
        height:100%
        background-color: white;
        margin-top: 2px;
        overflow-y: scroll;
    }
</style>

<body>
    <div id="content" style="background-color: #f6f6f6;height: 100%;width: 100%">
        <div id="container">

        </div>
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
    var target_type = <?php echo $type; ?>;    // 0- national area, 1- foreign area
    var search_str = <?php echo $str; ?>;

    $(function(){
        var title = '';
        if(target_type == 0){
            title = search_str;
        }else{
            var n = search_str.lastIndexOf(',');
            title = search_str.substr(n);
        }
        document.title = title;

        weixinConfigure();

        getAreaCourseByText(target_type, search_str);
    });

    //generate the menus in order to select the location
    function display_area_infos(data) {

        var content_html = '';
        for (var i = 0; i < data.length; i++) {
            var tmp_content_html="";
            if( target_type == 0) {
                tmp_content_html += '<div class="order">';
                tmp_content_html += '<div class="order_body" onclick="showScenicArea(\'' + data[i]['id'] +'\',\''+ data[i]['map_type']+ '\')">';
                tmp_content_html += '   <img src="'+ data[i]['image'] +'">';//'   <img src="../resource/image/logo.png">';
                tmp_content_html += '   <div class="scenic_content" style="position: relative">';
                tmp_content_html += '      <h5>' + data[i]['name'] + '</h5>';
                tmp_content_html += '      <h5>&nbsp</h5>';
                tmp_content_html += '      <h5 style="color: red">¥' + parseFloat( data[i]['cost']).toFixed(2)+ '</h5>'
                tmp_content_html += '   </div></div>';

                tmp_content_html += '</div>';
            }else{
                tmp_content_html += '<div class="order">';
                tmp_content_html += '<div class="order_body" onclick="showTourismCourse(\'' + data[i]['id'] +'\',\''+ data[i]['map_type']+ '\')">';
                tmp_content_html += '   <img src="'+ data[i]['image'] +'">';//'   <img src="../resource/image/logo.png">';
                tmp_content_html += '   <div class="scenic_content" style="position: relative">';
                if(data[i]['title'] == '') {
                    tmp_content_html += '      <h5>' + data[i]['name'] + '</h5>';
                    tmp_content_html += '      <h5>&nbsp</h5>';
                }else{
                    tmp_content_html += '      <h5>' + data[i]['title'] + '</h5>';
                    tmp_content_html += '      <h5>' + data[i]['name'] + '</h5>';
                }
                tmp_content_html += '      <h5 style="color: red">¥' + parseFloat( data[i]['cost']).toFixed(2)+ '</h5>'
                tmp_content_html += '   </div></div>';

                tmp_content_html += '</div>';
            }

            content_html += tmp_content_html;
        }

        $('#container').html(content_html);
    }

    function showScenicArea(id, type){
        var shopid = parseInt(sessionStorage.getItem('shopid'));
        window.location.href = 'home.php?shopid=' + shopid + '&type=2&targetid=' + id+"&map_type="+type;
    }

    function showTourismCourse(id, type){
        var shopid = parseInt(sessionStorage.getItem('shopid'));
        window.location.href = 'tourism_new.php?shopid='+shopid + "&targetid=" + id + "&map_type=" + type;
    }

</script>
</html>
