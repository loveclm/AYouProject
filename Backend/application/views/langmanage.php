<div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <section class="content-header">
        <h1>
            <a>语种列表</a>
        </h1>
    </section>

    <section class="content" style="min-height: 800px;">
        <div class="container">
            <div class="row">
                <div class="col-xs-12 col-sm-2 form-inline">
                    <div class="form-group area-search-control-view" style="float: left;">
                        <a class="btn btn-primary" onclick="editItem(0);">
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
                        <th>序号</th>
                        <th width="">国旗</th>
                        <th width="">语言</th>
                        <th width="">操作</th>
                    </tr>
                    </thead>
                    <tbody id="content_tbl">
                    </tbody>
                </table>
                <div class="form-group">
                    <div id="custom-confirm-delete-view" style="display:none;">
                        <p>
                            是否要删除此语言？
                        </p>

                        <div class="form-group">
                            <button class="btn btn-default" onclick="deleteItem('<?php echo base_url(); ?>', 0);">取消
                            </button>
                            <button class="btn btn-primary" onclick="deleteItem('<?php echo base_url(); ?>', 1);">确定
                            </button>
                        </div>

                    </div>
                    <div id="custom-confirm-deploy-view" style="display:none;">
                        <div class="row">
                            <div class="col-xs-12 col-sm-12">
                                <div class="form-group area-add-view" style="text-align: left;padding:0;">
                                    <label>国旗 ：</label>
                                    <a class="btn btn-primary" onclick="uploadThumb()">
                                        <span>上传图片</span>
                                    </a>
                                </div>
                                <div class="col-sm-12" style="text-align: right;">
                                    <input id="upload-thumb-file" type="file" style="display: none"/>
                                    <img src="<?php $thumb = (isset($areaInfo->thumbnail) ?
                                        ($areaInfo->thumbnail != '' ? ('uploads/' . $areaInfo->thumbnail) : ('assets/images/default.png'))
                                        : ('assets/images/default.png'));
                                    echo base_url() . $thumb;
                                    ?>" id="area-thumb-img"
                                         style="width:170px;height: 100px;margin-left: 20px; border-radius: 3px; cursor: pointer; display: inline-block;"
                                         onclick="deleteThumb()">
                                    <a id="upload-thumb-msg" style="display: none"><?php
                                        echo(isset($areaInfo->thumbnail) ? $areaInfo->thumbnail : '');
                                        ?></a>
                                </div>
                            </div>
                        </div>
                        <div class="row" style="text-align: left;margin: 20px -15px;">
                            <div class="col-xs-12 col-sm-12">
                                <label>语种 : </label>
                                <select id="lang-select">
                                </select>
                            </div>
                        </div>

                        <div class="form-group">
                            <button class="btn btn-default" style="margin: 0 15px;"
                                    onclick="updateItem('<?php echo base_url(); ?>', 0);">取消
                            </button>
                            <button class="btn btn-primary" style="margin: 0 15px;"
                                    onclick="updateItem('<?php echo base_url(); ?>', 1);">确定
                            </button>
                            <input id="current-areaid" style="display: none;"/>
                            <input id="current-areastatus" style="display: none;"/>
                        </div>
                    </div>
                </div>
                <div class="clearfix"></div>
            </div>

        </div>
        <input id="page_loaded_status" value="0" style="display: none;"/>

    </section>
</div>
<script type="text/javascript" src="<?php echo base_url(); ?>assets/js/lang.js" charset="utf-8"></script>