<div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <section class="content-header">
        <h1>
            <a href="#" onclick="test_api();">景区管理</a>
        </h1>
    </section>

    <section class="content" style="min-height: 800px;">
        <div class="container">
            <div class="row">
                <div class="col-xs-6 col-sm-4 form-inline">
                    <div class="form-group area-search-name-view">
                        <label>景区名称</label>
                        <input type="text" id="searchName" value="<?php echo $searchName == 'all' ? '': $searchName; ?>" class="form-control">
                    </div>

                </div>

                <div class="col-xs-6 col-sm-4 form-inline">
                    <div class="form-group area-search-area-view">
                        <label>所属地区</label>
                        <select class="form-control" id="searchAddress">
                            <option value="all">请选择</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <select class="form-control" id="searchStatus">
                            <option value="0" <?php if ($searchStatus == 0) echo ' selected'?>>状态</option>
                            <option value="1" <?php if ($searchStatus == 1) echo ' selected'?>>未上架</option>
                            <option value="2" <?php if ($searchStatus == 2) echo ' selected'?>>已上架</option>
                        </select>
                    </div>
                </div>

                <div class="col-xs-6 col-sm-4 form-inline">
                    <div class="form-group area-search-control-view">
                        <button class="btn btn-primary" onclick="searchArea('<?php echo base_url(); ?>');">查询</button>

                        <a class="btn btn-primary" href="<?php echo base_url(); ?>addarea">
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
                            <th>景区名称</th>
                            <th width="100">景点个数</th>
                            <th width="150">景区总价格（元）</th>
                            <th>所属地区</th>
                            <th width="100">状态</th>
                            <th width="300">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php
                            $areaCount = count($areaList);

                            for($i = 0; $i < $areaCount; $i++){
                                $area = $areaList[$i];
                                $points = json_decode($areaList[$i]->point_list);
                                $pointCount = count($points);
                                $price = 0;
                                for ($k = 0; $k < $pointCount; $k++){
                                    $price = $price + intval($points[$k]->price);
                                }
                                ?>
                                <tr>
                                    <td><?php echo $area->name;?></td>
                                    <td><?php echo $pointCount;?></td>
                                    <td><?php echo $price;?></td>
                                    <td><?php echo $area->address;?></td>
                                    <td><?php echo $area->status == 1 ? '已上架': '未上架'; ?></td>
                                    <td>
                                        <a href="editarea/<?php echo $area->id;?>">查看</a>
                                        <?php
                                        if($area->status == 0){
                                            ?>
                                            <a href="#" onclick="deleteAreaConfirm(<?php echo $area->id;?>);">删除</a>
                                        <?php
                                        }
                                        if($area->status == 0){
                                            ?>
                                            <a href="#" onclick="deployAreaConfirm(<?php echo $area->id;?>);">上架</a>
                                            <?php
                                        }else {
                                            ?>
                                            <a href="#" onclick="undeployAreaConfirm(<?php echo $area->id;?>);">下架</a>
                                        <?php
                                        }
                                        ?>
                                    </td>
                                </tr>
                        <?php } ?>
                    </tbody>
                </table>
                <div class="form-group">
                    <div id="custom-confirm-delete-view" style="display:none;">
                        <p>
                            是否要删除此景区？
                        </p>
                        <div class="form-group">
                            <button onclick="deleteArea('<?php echo base_url(); ?>', 0);">取消</button>
                            <button onclick="deleteArea('<?php echo base_url(); ?>', 1);">确定</button>
                        </div>

                    </div>
                    <div id="custom-confirm-deploy-view" style="display:none;">
                        <p>
                            是否要上架此景区？
                        </p>
                        <div class="form-group">
                            <button onclick="deployArea('<?php echo base_url(); ?>', 0);">取消</button>
                            <button onclick="deployArea('<?php echo base_url(); ?>', 1);">确定</button>
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
<script type="text/javascript" src="<?php echo base_url(); ?>assets/js/area.js" charset="utf-8"></script>