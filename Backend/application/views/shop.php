<div class="content-wrapper" style="min-height: 100%">
    <!-- Content Header (Page header) -->
    <style type="text/css">

        #tip {
            background-color: transparent;
            border: transparent;
            padding: 0 10px;
            position: relative;
            font-size: inherit;
            left: 0px;
            top: 0px;
            border-radius: 3px;
            line-height: 36px;
        }

        #tip select {
            width: 100px;
            height: 30px;
        }
    </style>
    <section class="content-header">
        <h1 id="page_Id" onclick="location.href='test/test.php';" style="color:dodgerblue; cursor:pointer">商家列表</h1>
    </section>

    <section class="content" style="min-height: 800px;">
        <div class="container">
            <div class="row">
                <div class="col-xs-6 col-sm-4 form-inline">
                    <div class="form-group area-search-name-view">
                        <label>商家名称</label>
                        <input type="text" id="searchName" style="height: 30px;"
                               value="<?php echo $searchName == 'all' ? '' : $searchName; ?>"
                               class="form-control">
                    </div>
                </div>

                <div class="col-xs-6 col-sm-6 form-inline">
                    <label class="col-sm-3" style="text-align: right; margin-top: 10px;">所属地区</label>
                    <div class="form-group">
                        <select class="form-control" id="searchContinent" style="height:30px;">
                            <option value="0" selected>选择洲</option>
                            <option value="1" >亚洲</option>
                            <option value="2">美洲</option>
                            <option value="3">非洲</option>
                            <option value="4">欧洲</option>
                            <option value="5">大洋洲</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <select class="form-control" id="searchCountry" style="height:30px;">
                            <option value="0" selected>选择国家</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <select class="form-control" id="searchStatus"  style="height: 30px;">
                            <option value="0" <?php if ($searchStatus == 0) echo ' selected' ?>>状态</option>
                            <option value="1" <?php if ($searchStatus == 1) echo ' selected' ?>>未禁用</option>
                            <option value="2" <?php if ($searchStatus == 2) echo ' selected' ?>>已禁用</option>
                        </select>
                    </div>
                </div>

                <div class="col-xs-6 col-sm-2 form-inline">
                    <div class="form-group area-search-control-view">
                        <a class="btn btn-primary" onclick="searchShop('<?php echo base_url(); ?>');">
                            <span>查询</span>
                        </a>
                        <?php
                        if ($shop_manager_number == '') {
                            ?>
                            <a class="btn btn-primary" href="<?php echo base_url(); ?>addshop">
                                <span>新增</span>
                            </a>
                            <?php
                        } ?>

                    </div>
                </div>
            </div>
        </div>
        <div class="container">
            <div class="row">
                <table class="table table-bordered area-result-view">
                    <thead>
                    <tr style="background-color: lightslategrey;">
                        <th>商家名称</th>
                        <th width="">商家类型</th>
                        <th width="">景区数</th>
                        <th width="">旅游线路数</th>
                        <th width="">授权码数</th>
                        <th>所属国家</th>
                        <th width="">状态</th>
                        <th width="">操作</th>
                    </tr>
                    </thead>
                    <tbody id="content_tbl">

                    </tbody>
                </table>
                <div class="form-group">
                    <div id="custom-confirm-delete-view" style="display:none;">
                        <p>
                            是否要删除此商家？
                        </p>

                        <div class="form-group">
                            <button class="btn btn-default" onclick="$('#custom-confirm-delete-view').hide();">取消
                            </button>
                            <button class="btn btn-primary" onclick="deleteShop('<?php echo base_url(); ?>', 1);">确定
                            </button>
                        </div>

                    </div>
                    <div id="custom-confirm-deploy-view" style="display:none;">
                        <p id="deployMessage">
                            是否要禁用此商家？
                        </p>

                        <div class="form-group">
                            <button class="btn btn-default" onclick="$('#custom-confirm-deploy-view').hide();">取消
                            </button>
                            <button class="btn btn-primary" onclick="deployShop('<?php echo base_url(); ?>', 1);">确定
                            </button>
                            <input id="current-areaid" style="display: none;"/>
                            <input id="current-areastatus" style="display: none;"/>
                            <input id="current-type" style="display: none;"/>
                            <input id="current-codetype" style="display: none;"/>
                            <input id="current-targetid" style="display: none;"/>
                            <input id="current-isforeign" style="display: none;"/>
                        </div>
                    </div>

                    <div id="custom-generate-auth-view" style="display:none;">
                        <div class="form-group">
                            <label>选择类型 </label>
                            <select id="auth-select" onchange="changeAuthType();">
                                <option value="0">请选择</option>
                                <option value="2">景区</option>
                                <option value="1">旅游线路</option>
                            </select>
                        </div>
                        <div class="form-group" id="custom-auth-area-view" style="display:none;">
                            <label>景区名称 </label>
                            <select id="auth-select-area">
                                <option value="0">请选择</option>
                                <?php
                                $areaCount = count($areaList);
                                for ($i = 0; $i < $areaCount; $i++) {
                                    $areaInfo = $areaList[$i];
                                    ?>
                                    <option value="<?php echo $areaInfo->id; ?>"><?php echo $areaInfo->name; ?></option>
                                    <?php
                                }
                                ?>
                            </select>
                        </div>
                        <div class="form-group" id="custom-auth-course-view" style="display:none;">
                            <label>旅游线路名称 </label>
                            <select id="auth-select-course">
                                <option value="0">请选择</option>
                                <?php
                                $courseCount = count($courseList);
                                for ($i = 0; $i < $courseCount; $i++) {
                                    $courseInfo = $courseList[$i];
                                    ?>
                                    <option
                                            value="<?php echo $courseInfo->id; ?>"><?php echo $courseInfo->name; ?></option>
                                    <?php
                                }
                                ?>
                            </select>
                        </div>
                        <div class="form-group">
                            <button class="btn btn-default" onclick="cancel('<?php echo base_url(); ?>');">取消</button>
                            <button class="btn btn-primary" onclick="generateAuth('<?php echo base_url(); ?>');">确定
                            </button>
                        </div>
                    </div>

                    <div id="custom-generate-auth-count-view" style="display:none;">
                        <div class="form-group">
                            <label>发放数量 </label>
                            <input id="auth-count" style="width: 30%;"/>个
                        </div>

                        <div class="form-group">
                            <button class="btn btn-default" onclick="cancel('<?php echo base_url(); ?>');">取消</button>
                            <button class="btn btn-primary" onclick="generateAuthFinal('<?php echo base_url(); ?>');">
                                确定
                            </button>
                        </div>
                    </div>
                    <div id="custom-generate-qr-view" style="min-width:350px; display:none;">
                        <div class="form-group">
                            <div id="qr-view"></div>
                            <button style="position: absolute; top: 3px; right: 3px;border: none;background: none;"
                                    onclick="cancel('<?php echo base_url(); ?>');">
                                <img src="<?php echo base_url(); ?>assets/images/close.png" style="width: 30px;">
                            </button>
                        </div>
                    </div>
                    <div class="clearfix"></div>
                </div>

            </div>
        </div>
            <input id="page_loaded_status" value="0" style="display: none;"/>
            <input id="countryList" value='<?php echo json_encode($countryList); ?>' style="display: none">
    </section>
</div>
<script type="text/javascript" src="<?php echo base_url(); ?>assets/js/shop.js" charset="utf-8"></script>
<script type="text/javascript" src="<?php echo base_url(); ?>assets/js/jquery.qrcode.js" charset="utf-8"></script>
<script type="text/javascript" src="<?php echo base_url(); ?>assets/js/qrcode.js" charset="utf-8"></script>
