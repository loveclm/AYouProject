<div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <section class="content-header">
        <h1 id="page_Id"><?php echo isset($course) ? '编辑' : '新增'; ?>旅游线路</h1>
    </section>

    <section class="content">
        <div class="container">
            <div class="row custom-info-row">
                <label class="col-sm-2" style="text-align: right;">旅游线路名称：</label>
                <input type="text" class="col-sm-4" id="coursename" maxlength="20"
                       value="<?php echo isset($course) ? $course->name : ''; ?>"/>
                <input type="text" class="col-sm-4" id="courseprice" maxlength="10"
                       value="<?php echo isset($course) ? $course->price : ''; ?>" style="display: none;"/>
                <div id="custom-error-coursename" class="custom-error col-sm-4" style="display: none;">线路名称要不超过10个字符
                </div>
            </div>
            <div class="row custom-info-row">
                <label class="col-sm-2" style="text-align: right;">旅游线路折扣比率：</label>
                <input style="text-align: right;" type="text"
                       class="col-sm-1" id="courserate"
                       value="<?php echo isset($course) ? (floatval($course->discount_rate) * 100) : ''; ?>">
                <label>%</label>
            </div>
            <div class="row custom-info-row form-inline">
                <label class="col-sm-2" style="text-align: right;">所属国家：</label>
                <?php
                $address = isset($course) ? ($course->address) : '';
                $address_1 = isset($course) ? ($course->address_1) : '';
                $st = isset($course) ? ($course->isforeign) : 0;
                ?>
                <div class="form-group">
                    <select class="form-control" id="searchContinent" style="height:30px;">
                        <option value="0" <?php echo($st != 1 ? 'selected' : ''); ?> >选择洲</option>
                        <option value="1" <?php echo($st == 1 ? 'selected' : ''); ?> >亚洲</option>
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
                <input id="address_2" style="display: none;"
                       value="<?php echo $address . ',' . $address_1 . ',' . $st; ?>">
            </div>
            <div id="detail_addr" class="row custom-info-row form-inline"  style="display: none;">
                <label class="col-sm-2" style="text-align: right;">所属地区：</label>
                <div id="tip" class="form-group area-search-area-view">
                    <?php
                    $courseInfo = json_decode(isset($course->info)?$course->info:'');

                    if ($st != 0) $addrs = [$address, $address_1, ''];
                    else $addrs = ['', '', ''];
                    ?>
                    <select id='province' onchange='search(this)' style="height:30px; width: auto;"></select>
                    <select id='city' onchange='search(this)' style="height:30px;"></select>
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
                               value="<?php echo isset($course) ? '' : ''; ?>"/>
                    </div>
                    <!-- ////////////////////GaoDe Map Part  -->
                    <div id="custom-map-container" style="height: 600px;"></div>
                    <!-- ////////////////////                -->
                </div>
            </div>
            <div class="row  custom-info-row">
                <label class="col-sm-2 " style="text-align: right;">上传图片：</label>
                <div class="form-group area-add-view">
                    <a class="btn btn-primary" onclick="uploadThumb()">
                        <span>上传图片</span>
                    </a>
                    <input id="upload-thumb-file" type="file" style="display: none"/>
                    <img src="<?php
                    $thumb = (isset($courseInfo->overay) ?
                        ($courseInfo->overay != '' ? ('uploads/' . $courseInfo->overay) : ('assets/images/default.png'))
                        : ('assets/images/default.png'));
                    echo base_url() . $thumb;
                    ?>" id="area-thumb-img"
                         style="height: 100px;margin-left: 20px; vertical-align: text-top; border-radius: 3px; cursor: pointer;"
                         onclick="deleteThumb()">
                    <a id="upload-thumb-msg" style="display: none"><?php
                        echo(isset($courseInfo->overay) ? $courseInfo->overay : '');
                        ?></a>
                </div>
            </div>
        </div>
        <div class="container">
            <div class="row">
                <div class="col-sm-2">
                    <label>选择景区：</label>
                </div>
                <div class="col-sm-10 custom-course-itemlist-view">
                    <div class="col-sm-5" style="height: 100%; padding: 10px;">
                        <div class="area-list-view">
                            <input class="btn btn-default" id="course-search" placeholder="搜索景区"/>
                            <a class="btn btn-default" onclick="findAreaInList('<?php echo base_url(); ?>');">
                                <i class="fa fa-search"></i>
                            </a>
                            <!--                            <input class"fa fa-search" type="button" value="" onclick=""/>-->
                            <div class="form-group">
                                <ul id="courseList">
                                    <?php
                                    $areaCount = count($areaList);
                                    for ($i = 0; $i < $areaCount; $i++) {
                                        $area = $areaList[$i];
                                        ?>
                                        <li class="custom-areaitem" id="areaitem-<?php echo $area->id; ?>"
                                            onclick="selectCourse(<?php echo $area->id; ?>);">
                                            <div id="areatitle-<?php echo $area->id; ?>"><?php echo $area->name; ?></div>
                                            <div id="areaprice-<?php echo $area->id; ?>"
                                                 style="display: none;"><?php echo $area->price; ?></div>
                                        </li>
                                        <?php
                                    }
                                    ?>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-2">
                        <div class="custom-course-itemlist-control">
                            <div class="form-group">
                                <input type="button" value="添加>>" onclick="addAreaToCourse();"/>
                            </div>
                            <div class="form-group">
                                <input type="button" value="<<删除" onclick="removeAreaFromCourse();"/>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-5" style="height: 100%; padding: 10px;">
                        <div class="course-item-view">

                            <ul id="courseItems">
                                <?php
                                if (isset($course)) {
                                    $itemList = json_decode($course->point_list);
                                    $itemCount = count($itemList);
                                    for ($i = 0; $i < $itemCount; $i++) {
                                        $item = $itemList[$i];
                                        $areaTmp = $this->area_model->getAreaById($item->id);
                                        if (count($areaTmp) == 0) $item->name = $item->name . '被删除. 请删除这个线路，并重新创建它.';
                                        ?>
                                        <li class="custom-courseitem" data-id="<?php echo $item->id; ?>"
                                            style="color:<?php echo count($areaTmp) != 0 ? 'black' : 'red'; ?>"
                                            onclick="selectedCourseItem(this);">
                                            <div><?php echo $item->name; ?></div>
                                        </li>
                                        <?php
                                    }
                                }
                                ?>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="container">
            <div class="row">
                <div class="col-sm-offset-2 custom-course-control-view">
                    <input type="button" class="btn btn-default" onclick="cancel('<?php echo base_url(); ?>');"
                           value="取消"/>
                    <input type="button" class="btn btn-primary" onclick="processCourse('<?php echo base_url(); ?>' ,
                            '<?php echo isset($course) ? $course->id : 0; ?>');" value="确认"/>
                </div>
            </div>
        </div>
        <input id="page_loaded_status" value="0" style="display: none;"/>
        <input id="countryList" value='<?php echo json_encode($countryList); ?>' style="display: none">
        <input id="all_area_list" value='<?php echo json_encode($areaList); ?>' style="display: none">
    </section>
</div>

<!-- Course Management JS-->
<script type="text/javascript" src="<?php echo base_url(); ?>assets/js/course.js" charset="utf-8"></script>
<script
        src="http://webapi.amap.com/maps?v=1.3&key=0250860ccb5953fa5d655e8acf40ebb7&plugin=AMap.PolyEditor,AMap.MouseTool,AMap.DistrictSearch"></script>
<script src="http://webapi.amap.com/ui/1.0/main.js?v=1.0.10"></script>
<script type="text/javascript" src="<?php echo base_url(); ?>assets/js/map.js" charset="utf-8"></script>