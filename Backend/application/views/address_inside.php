<div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <section class="content-header">
        <h1 id="page_Id">国内地区</h1>
    </section>

    <section class="content" style="min-height: 800px;">
        <div class="container">
            <div class="row">

                <div class="col-xs-12 col-sm-4 form-inline">
                    <div id="tip" class="form-group area-search-area-view">
                        <?php

                        $address = '';
                        $addrs = explode(',', $address);
                        ?>
                        <select id='province' onchange='search(this)'></select>
                        <select id='city' onchange='search(this)' style="display: none"></select>
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
                                   value="<?php echo isset($area) ? json_encode($areaInfo->position) : ''; ?>"/>
                        </div>
                        <!-- ////////////////////GaoDe Map Part  -->
                        <div id="custom-map-container" style="height: 600px;"></div>
                        <!-- ////////////////////                -->
                    </div>
                </div>

                <div class="col-xs-12 col-sm-8 form-inline">
                    <div class="form-group area-search-control-view">
                        <div class="form-inline" style="display: inline-block">
                            <select class=" select2 select2-hidden-accessible form-control"
                                    id="area_name" data-placeholder="输入需要关联为线路热门的景区"
                                    style="width: 200px;" tabindex="-1" aria-hidden="true">
                            </select>
                            <span class="fa fa-search"
                                  style="float: right;position: absolute;right: 140px;bottom: 8px;font-size: large;">
                            </span>
                        </div>
                        <a class="btn btn-primary"
                           onclick="deployAreaConfirm_jingqu(2,3);">确定</a>
                        <a class="btn btn-primary"
                           onclick="searchArea_jingqu('<?php echo base_url(); ?>');">查询</a>
                    </div>

                </div>
            </div>
        </div>
        <div class="container">
            <div class="row">
                <table class="table table-bordered area-result-view">
                    <thead>
                    <tr style="background-color: lightslategrey;">
                        <th>序号</th>
                        <th width="">省</th>
                        <th width="">市</th>
                        <th>是否是热门景区</th>
                        <th width="">是否是热门线路</th>
                        <th width="">操作</th>
                    </tr>
                    </thead>
                    <tbody id="content_tbl">
                    </tbody>
                </table>
                <div class="form-group">
                    <div id="custom-confirm-deploy-view" style="display:none;">
                        <p id="deployMessage">
                        </p>

                        <div class="form-group">
                            <button class="btn btn-default"
                                    onclick="deployArea_jingqu('<?php echo base_url(); ?>', 0);">取消
                            </button>
                            <button class="btn btn-primary"
                                    onclick="deployArea_jingqu('<?php echo base_url(); ?>', 1);">确定
                            </button>
                            <input id="current-areaid" style="display: none;"/>
                            <input id="current-areastatus" style="display: none;"/>
                        </div>
                    </div>
                </div>
                <div class="clearfix"></div>
            </div>

        </div>
        <input id="hotCourseArea" value='<?php echo $hot_area->hot_area_course; ?>' style="display: none">
        <input id="areaSearchList" value='<?php echo json_encode($area_search_list); ?>' style="display: none">
    </section>
</div>
<script type="text/javascript" src="<?php echo base_url(); ?>assets/js/address_inside.js" charset="utf-8"></script>
<script
        src="http://webapi.amap.com/maps?v=1.3&key=0250860ccb5953fa5d655e8acf40ebb7&plugin=AMap.PolyEditor,AMap.MouseTool,AMap.DistrictSearch"></script>
<script src="http://webapi.amap.com/ui/1.0/main.js?v=1.0.10"></script>
<script type="text/javascript" src="<?php echo base_url(); ?>assets/js/map.js" charset="utf-8"></script>