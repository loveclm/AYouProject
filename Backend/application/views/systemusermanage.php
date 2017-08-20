<div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <section class="content-header">
        <h1>
            人员列表
        </h1>
    </section>
    <section class="content" style="min-height: 800px;">
        <div class="container">
            <div class="row">
                <div class="col-xs-12">
                    <form action="<?php echo base_url() ?>userListing" method="POST" id="searchList">
                        <div class="col-xs-9 col-sm-8 form-inline">
                            <div class="form-group">
                                <select class="form-control" id="searchStatus">
                                    <option value="0" <?php if ($searchStatus == 0) echo ' selected' ?>>手机号</option>
                                </select>
                            </div>
                            <div class="input-group">
                                <input type="text" id="searchName" name="searchText"
                                       value="<?php echo $searchName == 'all' ? '' : $searchName; ?>"
                                       class="form-control pull-right"
                                       placeholder=""/>
                            </div>
                        </div>

                        <div class="col-xs-3 col-sm-4 form-inline">
                            <div class="form-group area-search-control-view">
                                <button class="btn btn-primary searchList"
                                        onclick="searchArea('<?php echo base_url(); ?>');">查询
                                </button>
                            </div>
                        </div>
                    </form>
                    <div class="col-xs-12 box-header">
                        <a class="btn btn-primary" href="<?php echo base_url(); ?>addNew">
                            添加人员
                        </a>
                    </div>
                </div>
            </div>
            <div class="container">
                <div class="row">
                    <table class="table area-result-view table-bordered table-hover">
                        <thead>
                        <tr style="background-color: lightslategrey;">
                            <th width="100">序号</th>
                            <th>账号</th>
                            <th>姓名</th>
                            <th width="150">角色</th>
                            <th width="150">新增时间</th>
                            <th width="250">操作</th>
                        </tr>
                        </thead>
                        <tbody>
                        <?php
                        if (!empty($userRecords)) {
                            foreach ($userRecords as $record) {
                                ?>
                                <tr>
                                    <td><?php echo $record->userId ?></td>
                                    <td><?php echo $record->name ?></td>
                                    <td><?php echo $record->email ?></td>
                                    <td><?php echo $record->role ?></td>
                                    <td><?php echo $record->mobile ?></td>
                                    <td class="text-center">
                                        <a href="<?php echo base_url() . 'editOld/' . $record->userId; ?>">
                                            编辑 &nbsp;
                                        </a>
                                        <a href="#" data-userid="<?php echo $record->userId; ?>">
                                            删除 &nbsp;
                                        </a>
                                        <a href="#" data-userid="<?php echo $record->userId; ?>">
                                            重置密码 &nbsp;
                                        </a>
                                    </td>
                                </tr>
                                <?php
                            }
                        }
                        ?>
                        </tbody>
                    </table>
                    <div class="col-xs-12">
                        <div class="clearfix">
                            <?php echo $this->pagination->create_links(); ?>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</div>
<script type="text/javascript" src="<?php echo base_url(); ?>assets/js/common.js" charset="utf-8"></script>
<script type="text/javascript">
    jQuery(document).ready(function () {
        $('.treeview-menu').show();
        jQuery('ul.pagination li a').click(function (e) {
            e.preventDefault();
            var link = jQuery(this).get(0).href;
            var value = link.substring(link.lastIndexOf('/') + 1);
            jQuery("#searchList").attr("action", baseURL + "userListing/" + value);
            jQuery("#searchList").submit();
        });
    });
</script>
