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
                        <input type="text" class="form-control" id="exampleInputName2">
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
                        <input type="text" class="form-control" id="exampleInputName2">
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
                <div id="custom-map-container" style="height: 700px;width: 700px;">

                </div>
            </div>

        </div>
    </section>
</div>

<!-- Baidu Map JS-->
<script src="http://webapi.amap.com/ui/1.0/main.js?v=1.0.10"></script>
<script src="https://webapi.amap.com/maps?v=1.3&key=0250860ccb5953fa5d655e8acf40ebb7&plugin=AMap.PolyEditor,AMap.MouseTool"></script>
<script type="text/javascript" src="<?php echo base_url(); ?>assets/js/map.js" charset="utf-8"></script>