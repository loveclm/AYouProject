<div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <section class="content-header">
        <h1 id="page_Id"><?php echo isset($shop) ? '编辑' : '新增'; ?>商家</h1>
    </section>

    <section class="content" style="height: 750px;">
        <div class="container" style="vertical-align: baseline">
            <div class="row custom-info-row form-inline">
                <label class="col-sm-2" style="text-align: right; margin-top: 8px;">*商家名称 : </label>
                <input type="text" class="col-sm-2 form-control" id="shopname" maxlength="20"
                       value="<?php echo isset($shop) ? $shop->name : ''; ?>"/>

                <div id="custom-error-shopname" class="custom-error col-sm-4" style="display: none;">商家名称要不超过10个字符</div>
            </div>

            <div class="row custom-info-row form-inline">
                <label class="col-sm-2" style="text-align: right; margin-top:8px;">*商家账号 : </label>
                <input type="text" class="col-sm-2 form-control" id="shopid" maxlength="11"
                       value="<?php echo isset($shop) ? $shop->phonenumber : ''; ?>"/>

                <div id="custom-error-shopid" class="custom-error col-sm-4" style="display: none;">账号使用手机号，只能是11位</div>
            </div>

            <div class="row custom-info-row form-inline">
                <label class="col-sm-2" style="text-align: right; margin-top: 8px;">*初始密码 : </label>
                <input type="text" class="col-sm-2 form-control" id="shoppassword" disabled
                       value="<?php echo rand(100000, 999999); ?>"/>
            </div>

            <div class="row custom-info-row form-inline">
                <label class="col-sm-2" style="text-align: right;margin-top: 8px;">所属国家 : </label>
                <?php
                $address = isset($shop) ? ($shop->address) : '';
                $address_1 = isset($shop) ? ($shop->address_1) : '';
                $st = isset($shop) ? ($shop->isforeign) : 0;
                ?>
                <div class="form-group">
                    <select class="form-control" id="searchContinent" style="height: 30px;">
                        <option value="0" <?php echo($st != 1 ? 'selected' : ''); ?> >选择洲</option>
                        <option value="1" <?php echo($st == 1 ? 'selected' : ''); ?> >亚洲</option>
                        <option value="2">美洲</option>
                        <option value="3">非洲</option>
                        <option value="4">欧洲</option>
                        <option value="5">大洋洲</option>
                    </select>
                </div>
                <div class="form-group">
                    <select class="form-control" id="searchCountry" style="height: 30px;">
                        <option value="0" selected>选择国家</option>
                    </select>
                </div>
                <input id="address_2" style="display: none;"
                       value="<?php echo $address . ',' . $address_1 . ',' . $st; ?>">
            </div>
            <div id="detail_addr" class="row custom-info-row form-inline" style="display: none;">
                <label class="col-sm-2" style="text-align: right;margin-top: 8px;">所属地区 : </label>
                <div id="tip" class="form-group area-search-area-view">
                    <?php

                    if ($st != 0) $addrs = [$address, $address_1, ''];
                    else $addrs = ['', '', ''];
                    ?>
                    <select id='province' onchange='search(this)'  style="height: 30px; width: auto;"></select>
                    <select id='city' onchange='search(this)' style="height: 30px;"></select>
                    <select id='district' onchange='search(this)' style="display: none"></select>
                    <select id='street' onchange='setCenter(this)' style="display: none;"></select>

                    <div id="provinceName"
                         style="display: none;"><?php echo $address != '' ? ($addrs[0]) : ''; ?></div>
                    <div id="cityName" style="display: none;"><?php echo $address != '' ? ($addrs[1]) : ''; ?></div>
                    <div id="districtName"
                         style="display: none;"><?php echo $address != '' ? ($addrs[2]) : ''; ?></div>
                </div>
                <div class="col-sm-8" style="display:none;">
                    <input id="city_Name" class="form-control" type="text" placeholder="输入需要关联为线路热门的景区"
                           value="" style="width:230px"/>
                    <div class="form-group col-md-12" style="position: absolute; z-index: 1000;">
                        <input id="area-position" style="display: none;"
                               value="<?php echo isset($shop) ? '' : ''; ?>"/>
                    </div>
                    <!-- ////////////////////GaoDe Map Part  -->
                    <div id="custom-map-container" style="height: 600px;"></div>
                    <!-- ////////////////////                -->
                </div>
            </div>

            <div class="row custom-info-row form-inline">
                <label class="col-sm-2" style="text-align: right; margin-top: 8px;"> *商家类型 : </label>
                <select class="form-control" id="shoptype" style="height: 30px;">
                    <option value="0">请选择</option>
                    <option value="1" <?php echo isset($shop) && $shop->type == '1' ? 'selected' : ''; ?>>旅行社</option>
                    <option value="2" <?php echo isset($shop) && $shop->type == '2' ? 'selected' : ''; ?>>渠道商</option>
                </select>
            </div>

            <div class="row custom-info-row form-inline">
                <label class="col-sm-2" style="text-align: right; margin-top: 8px;">*订单分成比率 : </label>
                <input style="text-align: right;" type="number" min="0" class="col-sm-2 form-control" id="shoprate"
                       value="<?php echo isset($shop) ? (floatval($shop->discount_rate) * 100) : ''; ?>">
                <label style="margin-top:8px; "> % </label>
            </div>
        </div>
        <div class="container">
            <div class="row">
                <div class="col-sm-offset-2 custom-course-control-view">
                    <input type="button" class="btn btn-default" onclick="location.href='<?php echo base_url()?>shop';"
                           value="取消"/>
                    <input type="button" class="btn btn-primary"
                           onclick="processShop('<?php echo base_url(); ?>' , '<?php echo isset($shop) ? $shop->id : 0; ?>');"
                           value="确定"/>
                </div>
            </div>
        </div>
        <input id="page_loaded_status" value="0" style="display: none;"/>
        <input id="countryList" value='<?php echo json_encode($countryList); ?>' style="display: none">
    </section>
</div>

<!-- Course Management JS-->
<script type="text/javascript" src="<?php echo base_url(); ?>assets/js/shop.js" charset="utf-8"></script>
<script
        src="https://webapi.amap.com/maps?v=1.3&key=0250860ccb5953fa5d655e8acf40ebb7&plugin=AMap.PolyEditor,AMap.MouseTool,AMap.DistrictSearch">
</script>
<script src="http://webapi.amap.com/ui/1.0/main.js?v=1.0.10"></script>
<script type="text/javascript" src="<?php echo base_url(); ?>assets/js/map.js" charset="utf-8"></script>
