<div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <section class="content-header">
        <h1>
            景区管理
        </h1>
    </section>

    <section class="content">
        <div class="container">
            <div class="row">
                <div class="col-xs-6 col-sm-4 form-inline">
                    <div class="form-group area-search-name-view">
                        <label for="exampleInputName2">景区名称</label>
                        <input type="text" class="form-control" id="exampleInputName2">
                    </div>

                </div>
                <div class="col-xs-6 col-sm-4 form-inline">
                    <div class="form-group area-search-area-view">
                        <label>所属地区</label>
                        <select class="form-control">
                            <option value="0">请选择</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <select class="form-control">
                            <option value="0">状态</option>
                            <option value="1">未上架</option>
                            <option value="2">已上架</option>
                        </select>
                    </div>

                </div>
                <div class="col-xs-6 col-sm-4 form-inline">
                    <div class="form-group area-search-control-view">
                        <button class="btn btn-primary">查询</button>

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
                        <tr>
                            <th>景区名称</th>
                            <th width="100">景点个数</th>
                            <th width="150">景区总价格（元）</th>
                            <th>所属地区</th>
                            <th width="100">状态</th>
                            <th width="300">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                    <tr> <th scope="row">故宫</th> <td>5</td> <td>20</td><td>北京市</td><td>未上架</td> <td>查看</td> </tr>
                    <tr> <th scope="row">颐和园</th> <td>10</td> <td>15</td> <td>北京市</td><td>已上架</td><td>查看</td> </tr>

                    </tbody>
                </table>
            </div>

        </div>
    </section>
</div>