<div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <section class="content-header">
        <h1>
            查看商家
        </h1>
    </section>

    <section class="content">
        <div class="container">
            <div class="row custom-info-row">
                <label class="col-sm-2">商家名称:</label>
                <label class="col-sm-4" id="shopname"><?php echo isset($shop) ? $shop->name : ''; ?></label>

                <div id="custom-error-shopname" class="custom-error col-sm-4" style="display: none;">不超过10个字符</div>
            </div>

            <div class="row custom-info-row">
                <label class="col-sm-2">商家账号:</label>
                <label class="col-sm-4" id="shopid"><?php echo isset($shop) ? $shop->phonenumber : ''; ?></label>

                <div id="custom-error-shopid" class="custom-error col-sm-4" style="display: none;">账号使用手机号，只能是11位</div>
            </div>

            <div class="row custom-info-row">
                <label class="col-sm-2">初始密码:</label>
                <label class="col-sm-4" id="shoppassword"><?php echo isset($shop) ? $shop->password : ''; ?></label>

            </div>

            <div id="tip" class="row custom-info-row">
                <label class="col-sm-2"> 所属国家:</label>
                <?php
                if ($shop->isforeign == 1) $address = '亚洲 中国 ';
                else $address = $shop->address . ' ' . $shop->address_1;
                //$address = isset($shop) ? ($prefix . $shop->address . ' ' . $shop->address_1) : '';
                ?>
                <label class="col-sm-4" id="shoppassword"><?php echo isset($address) ? $address : ''; ?></label>
            </div>
            <?php
            if ($shop->isforeign == 1) {
                ?>
                <div id="tip" class="row custom-info-row">
                    <label class="col-sm-2"> 所属地区:</label>
                    <?php
                    if ($shop->isforeign == 1) $prefix = '亚洲 中国 ';
                    else $prefix = '';
                    $address = isset($shop) ? ($shop->address . ' ' . $shop->address_1) : '';
                    ?>
                    <label class="col-sm-4" id="shoppassword"><?php echo isset($address) ? $address : ''; ?></label>
                </div>
            <?php }
            ?>

            <div class="row custom-info-row">
                <label class="col-sm-2"> 商家类型:</label>
                <label class="col-sm-4" id="shoptype">
                    <?php echo isset($shop) && $shop->type == '1' ? '旅行社' : '渠道商'; ?>
                </label>
            </div>

            <div class="row custom-info-row">
                <label class="col-sm-2">订单分成比率:</label>
                <label class="col-sm-4"
                       id="shoprate"><?php echo isset($shop) ? (floatval($shop->discount_rate) * 100) : ''; ?>
                    %</label>
            </div>

            <div class="row custom-info-row">
                <label class="col-sm-2">二维码:</label>

                <div class="col-sm-10">
                    <?php
                    if (isset($shopqrcode)) {
                        $count = count($shopqrcode);
                        if ($count > 0) {
                            $i = 0;
                            foreach ($shopqrcode as $item) {
                                $areaName = $this->area_model->getCourseNameByAreaId($item->targetid);
                                $areaInfo = $this->area_model->getAreaById($item->targetid);
                                if ($areaName == '') continue;
                                ?>
                                <div class="col-sm-6" style="text-align: center;">
                                    <div class="form-inline" id="qr-view-<?php echo $i; ?>"></div>
                                    <input id="qr-data-url-<?php echo $i; ?>" style="display: none;"
                                           value='<?php echo("?shopid=" . $item->shopid .
                                               "&type=" . $item->type . "&targetid=" . $item->targetid .
                                               "&map_type=" . (intval($areaInfo->isforeign) - 1)); ?>'/>
                                    <label class="form-inline"><?php echo $areaName; ?></label>
                                </div>
                                <?php
                                $i++;
                            }
                        }
                    } ?>
                </div>
                <div id="qrcount" style="display:none"><?php echo $count; ?></div>
            </div>

            <div class="row custom-info-row">
                <label class="col-sm-2">授权码:</label>

                <div class="col-sm-4">
                    <table class="table table-bordered area-result-view">
                        <thead>
                        <tr style="background-color: lightslategrey;">
                            <th>序号</th>
                            <th>授权码</th>
                        </tr>
                        </thead>
                        <tbody id="content_tbl">
                        <?php
                        $authCount = count($shopauthcode);
                        if ($authCount > 0) {
                            $i = 0;
                            foreach ($shopauthcode as $item) {
                                if (!isset($item)) continue;
                                $i++;
                                ?>
                                <tr>
                                    <td><?php echo $i; ?></td>
                                    <td><?php echo $item['value']; ?></td>
                                </tr>
                                <?php
                            }
                        }
                        ?>
                        </tbody>
                    </table>
                    <div class="clearfix"></div>
                </div>
            </div>

        </div>
        <div class="container">
            <div class="row">
                <div class="col-sm-offset-2 custom-course-control-view">
                    <input type="button" class="btn btn-primary" onclick="location.href=baseURL+'shop';"
                           value="返回"/>
                </div>
            </div>
        </div>
    </section>
</div>


<!-- Course Management JS-->
<script type="text/javascript" src="<?php echo base_url(); ?>assets/js/shop.js" charset="utf-8"></script>
<script type="text/javascript" src="<?php echo base_url(); ?>assets/js/jquery.qrcode.js" charset="utf-8"></script>
<script type="text/javascript" src="<?php echo base_url(); ?>assets/js/qrcode.js" charset="utf-8"></script>

<script type="text/javascript">
    $(document).ready(function () {
        var count;
        if ((document.getElementById("qrcount")) != null) {
            count = $("#qrcount").html();
            for (var i = 0; i < count; i++) {
                console.log(($('#qr-data-url-' + i).val()));
                $('#qr-view-' + i).qrcode({text: 'http://www.ayoubc.com/tour/index.php' + $('#qr-data-url-' + i).val()}, {
                    width: 128,
                    height: 128
                });
            }
        }
    });
</script>