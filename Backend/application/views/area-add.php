<div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <section class="content-header">
        <h1>
            新增景区
        </h1>
    </section>

    <section class="content">
            <div class="container">
                <div class="row">
                    <div class="col-xs-6 col-sm-4 form-inline">
                        <div class="form-group area-add-view">
                            <label for="exampleInputName2">景区名称:</label>
                            <input type="text" class="form-control" id="areaname" name="areaname">
                        </div>
                    </div>

                </div>
                <div class="row">
                    <div class="col-xs-6 col-sm-4 form-inline">
                        <div class="form-group area-add-view">
                            <label for="exampleInputName2">上传录音：</label>
                            <a class="btn btn-primary" href="<?php echo base_url(); ?>addarea">
                                <span>上传录音</span>
                            </a>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-xs-6 col-sm-4 form-inline">
                        <div class="form-group area-add-view">
                            <label for="exampleInputName2">景区折扣比率:</label>
                            <input type="text" class="form-control" id="arearate" name="arearate">
                            <label">%</label>
                        </div>
                    </div>

                </div>
            </div>
            <div class="container">
                <div class="row">
                    <div>
                        <input id="cityName" type="text" />
                        <input type="button" value="find" onclick="theLocation()" />
                    </div>
                    <div class="col-sm-7">
                        <div id="custom-map-container" style="height: 600px;">
                            <input id="area-position" style="display: none;" name="position"/>
                        </div>
                    </div>
                    <div class="col-sm-3" style="border: 1px solid;height: 600px;">

                        <div class="point-list-view">
                            <div class="form-group">
                                <input id="upload-overlay" type="file" style="display: none;"/>
                                <button type="button" onclick="uploadOveray();">上传覆盖图</button>
                                <input id="area-overlay" value="" style="display: none;"/>
                            </div>
                            <div class="form-group">
                                <button type="button" onclick="addPointShow();">标记景点</button>
                            </div>
                            <div class="form-group">
                                <ul id="pointList">

                                </ul>
                            </div>
                        </div>

                        <div class="point-add-view" style="display: none;">
                            <div class="form-group">
                                <label>景点名称：</label>
                                <input type="text" class="form-control" id="pointname">
                            </div>
                            <div class="form-group">
                                <label>景点简述：</label>
                                <input type="text" class="form-control" id="pointdescription">
                            </div>
                            <div class="form-group">
                                <label>景点价格：</label>
                                <input type="text" class="form-control" id="pointprice">
                            </div>
                            <div class="form-group">
                                <button type="button" onclick="addPoint(0);">取消</button>
                                <button type="button" onclick="addPoint(1);">完成</button>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
            <input type="button" class="btn btn-primary" onclick="addTouristArea();" value="Submit" />

    </section>
</div>

<!-- Baidu Map JS-->
<script src="https://webapi.amap.com/maps?v=1.3&key=0250860ccb5953fa5d655e8acf40ebb7&plugin=AMap.PolyEditor,AMap.MouseTool"></script>
<script type="text/javascript" src="<?php echo base_url(); ?>assets/js/map.js" charset="utf-8"></script>