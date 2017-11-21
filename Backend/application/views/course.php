<div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <section class="content-header">
        <h1 id="page_Id">旅游线路列表</h1>
    </section>

    <section class="content" style="min-height: 800px;">
        <div class="container">
            <div class="row">
                <div class="col-xs-6 col-sm-6 form-inline">
                    <div class="form-group area-search-name-view">
                        <label>旅游线路名称</label>
                        <input type="text" id="searchName" value="<?php echo $searchName == 'all' ? '': $searchName; ?>" class="form-control">
                    </div>

                </div>

                <div class="col-xs-6 col-sm-2 form-inline">
                    <div class="form-group">
                        <select class="form-control" id="searchStatus">
                            <option value="0" <?php if ($searchStatus == 0) echo ' selected'?>>状态</option>
                            <option value="2" <?php if ($searchStatus == 2) echo ' selected'?>>未上架</option>
                            <option value="1" <?php if ($searchStatus == 1) echo ' selected'?>>已上架</option>
                        </select>
                    </div>
                </div>

                <div class="col-xs-6 col-sm-4 form-inline">
                    <div class="form-group area-search-control-view">
                        <button class="btn btn-primary" onclick="searchCourse('<?php echo base_url(); ?>');">查询</button>

                        <a class="btn btn-primary" href="<?php echo base_url(); ?>addcourse">
                            <span>新增</span>
                        </a>

                    </div>
                </div>
            </div>
        </div>
        <div class="container">
            <div class="row">
                <table class="table table-bordered area-result-view">
                    <thead>
                    <tr style="background-color: lightslategrey;">
                        <th>旅游线路名称</th>
                        <th width="">具体线路</th>
                        <th width="">所属国家</th>
                        <th width="">所属地区</th>
                        <th width="">价格</th>
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
                            是否要删除此线路？
                        </p>
                        <div class="form-group">
                            <button class="btn btn-default" onclick="deleteArea('<?php echo base_url(); ?>', 0);">取消</button>
                            <button class="btn btn-primary" onclick="deleteArea('<?php echo base_url(); ?>', 1);">确定</button>
                        </div>

                    </div>
                    <div id="custom-confirm-deploy-view" style="display:none;">
                        <p id="deployMessage">
                            是否要上架此线路？
                        </p>
                        <div class="form-group">
                            <button class="btn btn-default" onclick="deployArea('<?php echo base_url(); ?>', 0);">取消</button>
                            <button class="btn btn-primary" onclick="deployArea('<?php echo base_url(); ?>', 1);">确定</button>
                            <input id="current-areaid" style="display: none;"/>
                            <input id="current-areastatus" style="display: none;"/>
                        </div>
                    </div>
                </div>
                <div class="clearfix"></div>
            </div>

        </div>
    </section>
</div>
<script type="text/javascript" src="<?php echo base_url(); ?>assets/js/course.js" charset="utf-8"></script>