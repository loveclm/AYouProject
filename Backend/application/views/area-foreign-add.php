<!--<link rel="stylesheet" href="http://cache.amap.com/lbs/static/main.css?v=1.0?v=1.0"/>-->
<style type="text/css">
    .gm-style .gm-style-mtc label, .gm-style .gm-style-mtc div {
        font-weight: 400
    }

    #floating-panel {
        position: absolute;
        top: 10px;
        left: 25%;
        z-index: 5;
        background-color: #fff;
        padding: 5px;
        border: 1px solid #999;
        text-align: center;
        font-family: 'Roboto', 'sans-serif';
        line-height: 30px;
        padding-left: 10px;
    }
</style>
<div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <section class="content-header">
        <h1 id="page_Id"><?php echo ($isEdit == '0') ? '新增景区' : '编辑景区'; ?></h1>
    </section>

    <section class="content">
        <input id="custom-base-url" value="<?php echo base_url(); ?>" style="display: none;"/>
        <?php
        if (isset($area)) {
            $areaInfo = json_decode($area->info);
            //var_dump($areaInfo->zoom);
        }
        ?>
        <div class="container">
            <div class="row">
                <div class="col-xs-6 col-sm-6 form-inline">
                    <div class="form-group area-add-view">
                        <label for="exampleInputName2">景区名称:</label>
                        <input type="text" class="form-control" id="areaname" maxlength="20"
                               value="<?php echo isset($area) ? $area->name : ''; ?>"/>
                        <input type="text" id="point-list" style="display:none;"
                               value="<?php echo isset($area) ? $area->id : ''; ?>"/>
                        <div id="custom-error-areaname" class="custom-error" style="display: none;">景区名称要不超过10个字符</div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-xs-6 col-sm-6 form-inline">
                    <div class="form-group area-add-view">
                        <label>上传录音：</label>
                        <a class="btn btn-primary" onclick="uploadAreaAudio()">
                            <span>上传录音</span>
                        </a>
                        <input id="upload-area-audio" type="file" style="display: none"/>
                        <a id="area-audio-file"
                           onclick="$('#area-audio-file').html('');"><?php echo isset($areaInfo) ? $areaInfo->audio : ''; ?></a>
                    </div>
                </div>
            </div>
            <div class="row">
                <div id="tip" class="form-group form-inline">
                    <label for="exampleInputName2">所属地区：</label>
                    <?php
                    $address = isset($area) ? ($area->address) : '';
                    $address_1 = isset($area) ? ($area->address_1) : '';
                    ?>
                    <div class="form-group">
                        <select class="form-control" id="searchContinent">
                            <option value="0" selected>选择洲</option>
                            <option value="1">亚洲</option>
                            <option value="2">美洲</option>
                            <option value="3">非洲</option>
                            <option value="4">欧洲</option>
                            <option value="5">大洋洲</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <select class="form-control" id="searchCountry">
                            <option value="0" selected>选择国家</option>
                        </select>
                    </div>
                    <input id="cityName" style="display: none;" value="<?php echo $address . ',' . $address_1; ?>">
                </div>
                <input id="map_zoom_data" style="display: none;"
                       value="<?= isset($areaInfo->zoom) ? $areaInfo->zoom : '15'; ?>">
                </input>
            </div>
            <div class="row">
                <div class="col-xs-6 col-sm-6 form-inline">
                    <div class="form-group area-add-view">
                        <label>上传图片：</label>
                        <a class="btn btn-primary" onclick="uploadThumb()">
                            <span>上传图片</span>
                        </a>
                        <input id="upload-thumb-file" type="file" style="display: none"/>
                        <img src="<?php
                        $thumb = (isset($areaInfo->thumbnail) ?
                            ($areaInfo->thumbnail != '' ? ('uploads/' . $areaInfo->thumbnail) : ('assets/images/default.png'))
                            : ('assets/images/default.png'));
                        echo base_url() . $thumb;
                        ?>" id="area-thumb-img"
                             style="height: 100px;margin-left: 20px; vertical-align: text-top; border-radius: 3px; cursor: pointer;"
                             onclick="deleteThumb()">
                        <a id="upload-thumb-msg" style="display: none"><?php
                            echo(isset($areaInfo->thumbnail) ? $areaInfo->thumbnail : '');
                            ?></a>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="form-inline">
                    <div class="form-group area-add-view">
                        <label for="exampleInputName2">景区折扣比率:</label>
                        <input type="number" class="form-control" id="arearate"
                               value="<?php echo isset($area) ? (floatval($area->discount_rate) * 100) : ''; ?>">
                        <label">%</label>
                    </div>
                </div>
            </div>
        </div>
        <div class="container">
            <div class="row">
                <div class="row">
                    <div class="col-sm-8">
                        <div class="form-group col-md-12"
                             style="position: absolute; left:110px; top:8px;z-index: 1000; width: 50%;">
                            <input class="btn btn-default" id="city_Name" type="text" placeholder="输入您要定位的地址"
                                   value="<?php echo isset($areaInfo->pointText) != '' ? ($areaInfo->pointText) : ''; ?>"/>

                            <input id="area-position" style="display: none;"
                                   value="<?php echo isset($area) ? json_encode($areaInfo->position) : ''; ?>"/>
                            <a class="btn btn-default" onclick="searchMapArea();">
                                <i class="fa fa-search"></i>
                            </a>
                        </div>
                        <!-- ////////////////////Google Map Part  -->
                        <div id="custom-map-container" style="height: 600px;"></div>
                        <!-- ////////////////////                -->
                    </div>
                    <div id="detail_editing_panel" class="col-sm-3"
                         style="display:<?php echo $isEdit == '0' ? 'none' : 'block'; ?>; border: 1px solid;height: 600px;">

                        <div class="point-list-view">
                            <div class="form-group col-sm-6">
                                <button class="btn btn-primary" type="button" onclick="showAddPoint();">标记景点</button>
                            </div>
                            <div class="form-group col-sm-6">
                                <input id="upload-overlay" type="file" style="display: none;"/>
                                <button class="btn btn-primary" type="button" onclick="uploadOverlay();">上传覆盖图</button>
                                <input id="area-overlay" value="<?php echo isset($area) ? ($areaInfo->overay) : ''; ?>"
                                       style="display: none;"/>
                            </div>
                            <div id="area-image-message" style="text-align: right; margin:20px;"></div>
                            <div class="form-group">
                                <div id="pointList">

                                </div>
                            </div>
                        </div>

                        <div class="point-add-view" style="display: none;">
                            <input id="point-view-index" style="display: none;" value="0"/>

                            <div class="form-group">
                                <label>景点名称：</label>
                                <input type="text" class="form-control" id="pointname" maxlength="20">
                            </div>
                            <div class="form-group">
                                <label>景点简述：</label>
                                <input type="text" class="form-control" id="pointdescription" maxlength="40">
                            </div>

                            <div class="form-group" style="display: none;">
                                <input id="upload-point-image" type="file" style="display: none;">
                                <input id="pointimage" value="" style="display: none;"/>
                                <label>上传图片：</label>
                                <a class="btn btn-primary" onclick="uploadPointImage();">
                                    <span>上传图片</span>
                                </a>
                                <span id="point-image-message"></span>
                            </div>

                            <input id="point-position-temp" value="" style="display: none;">
                            <div class="form-group" style="height: 150px;width: 100%; display: none;">
                                <img id="point-item-image" style="height: 150px;width: 100%; display:none;" src=""/>
                            </div>

                            <div class="form-group">
                                <label>上传录音：</label>
                                <a class="btn btn-primary" onclick="uploadPointAudio();">
                                    <span>上传录音</span>
                                </a>
                                <input id="upload-point-audio" type="file" style="display: none;">
                                <label id="pointaudio" value="" style="display: none"></label>
                                <a id="pointaudio_view"
                                   onclick="$('#pointaudio_view').html('');"></a>
                            </div>

                            <div class="form-group">
                                <label>景点价格：</label>
                                <input type="number" class="form-control" id="pointprice">
                            </div>

                            <div class="form-group">
                                <input type="checkbox" id="pointfree"/> 试听
                            </div>

                            <div class="form-group" style="text-align: center">
                                <button class="btn btn-default" type="button" onclick="addPoint(0);">取消</button>
                                <button class="btn btn-primary" type="button" onclick="addPoint(1);">完成</button>
                            </div>

                        </div>
                    </div>

                </div>
                <div class="col-md-12 form-inline" style="margin-top: 10px;">
                    <input type="button" class="btn btn-primary"
                           onclick="addTouristArea('<?php echo base_url(); ?>', <?php echo isset($area) ? $area->id : 0; ?>);"
                           value="确认"/>
                    <a class="btn btn-default" href="<?php echo base_url() . 'area_foreign' ?>">
                        <span>取消</span>
                    </a>
                </div>

            </div>
        </div>
        <input id="page_loaded_status" value="0" style="display: none;"/>
        <input id="countryList" value='<?php echo json_encode($countryList); ?>' style="display: none">
    </section>
</div>

<!-- Baidu Map JS-->
<!--//////////////////////////-->
<script type="text/javascript"
<!--        src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBmofwXO4eBxqJY_GxcWJqoVtUnb4GtQAs&sensor=false&language=zh-CN&libraries=places"></script>-->
        src="http://ditu.google.cn/maps/api/js?key=AIzaSyBmofwXO4eBxqJY_GxcWJqoVtUnb4GtQAs&sensor=false&language=zh-CN&libraries=places"></script>


<!--<script type="text/javascript" charset="UTF-8" src="http://maps.google.cn/maps-api-v3/api/js/30/9/common.js"></script>-->
<!--<script type="text/javascript" charset="UTF-8" src="http://maps.google.cn/maps-api-v3/api/js/30/9/map.js"></script>-->
<!--<script type="text/javascript" charset="UTF-8" src="http://maps.google.cn/maps-api-v3/api/js/30/9/util.js"></script>-->
<!--<script type="text/javascript" charset="UTF-8" src="http://maps.google.cn/maps-api-v3/api/js/30/9/marker.js"></script>-->
<!--<script type="text/javascript" charset="UTF-8" src="http://maps.google.cn/maps-api-v3/api/js/30/9/geometry.js"></script>-->
<!--<script type="text/javascript" charset="UTF-8" src="http://maps.google.cn/maps-api-v3/api/js/30/9/poly.js"></script>-->
<!--<script type="text/javascript" charset="UTF-8" src="http://maps.google.cn/maps-api-v3/api/js/30/9/onion.js"></script>-->
<!--<script type="text/javascript" charset="UTF-8" src="http://maps.google.cn/maps-api-v3/api/js/30/9/controls.js"></script>-->
<!--<script type="text/javascript" charset="UTF-8" src="http://maps.google.cn/maps-api-v3/api/js/30/9/stats.js"></script>-->

<script type="text/javascript" src="<?php echo base_url(); ?>assets/js/map_google.js" charset="utf-8"></script>

<!--////////////////////////// -->
