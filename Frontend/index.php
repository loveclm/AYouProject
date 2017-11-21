<?php
    $shop_id = 0;
    $type = 0;
    $target_id = 0;
    $map_type = 0;

    if(isset($_GET['shopid']))  $shop_id = $_GET['shopid'];
    if(isset($_GET['type']))    $type = $_GET['type'];
    if(isset($_GET['targetid'])) $target_id = $_GET['targetid'];
    if(isset($_GET['map_type'])) $map_type = $_GET['map_type'];

    $url = 'plugin/Wxpay/home.php?shopid='.$shop_id.'&type='.$type.'&targetid='.$target_id.'&map_type='.$map_type;
?>
<script type="text/javascript">
    window.location.href='<?= $url ?>';
    var shop_id=parseInt('<?php echo $shop_id;?>');
    sessionStorage.setItem('shopid', shop_id);
    alert(shopid);
</script>

