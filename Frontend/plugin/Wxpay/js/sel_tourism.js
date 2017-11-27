var menu_infos = [];
var k = [];
$(function () {
    if (target_type == 0)
        $('#btn_area').trigger('click');
    else
        $('#btn_course').trigger('click');

    page_config();

    weixinConfigure1();

    changeBtnState();
    getMenuAndAreaInfos();
});

function searchSelected(index) {
    target_type = index;
    changeBtnState();
    showHomeData();
}

function showHomeData() {
    var searchData = sessionStorage.getObject('home_data');
    if ((searchData == []) || (searchData == null)) {
        return;
    }

    var data = [];
    menu_infos = searchData[0];
    var flag = 0;
    for( var i = 0; i < menu_infos[1].length; i++) {
        if(menu_infos[1][i].parent == '亚洲') {
            flag = 1; break;
        }
    }
    if (flag == 0) {
        var tmp = {
            'parent': '亚洲',    // contenient
            'child': []
        };
        menu_infos[1].unshift(tmp);
    }
                                                                                            
    var sel_str = searchData[1][0][0]['hot_area_city'];
    var ss = sel_str.split('-');
    sel_str = ss.join('·');


    if (target_type == 0) {
        data = searchData[1];
        $('#btn_range_sel span').html(sel_str);
        data = data[2]['data'];
    } else {
        data = searchData[1];
        $('#btn_range_sel span').html(sel_str);
        $('#btn_area_sel span').html(data[0][0]['hot_course_area']);
        data = data[1]['data'];
    }

    display_area_infos(data);
}

//generate the menus in order to select the location
function display_area_infos(data) {

    var content_html = '';
    for (var i = 0; i < data.length; i++) {
        var tmp_content_html = "";
        cur_cost = parseFloat(data[i]['cost'])*parseFloat(data[i]['discount_rate']);

        if (target_type == 0) {
            tmp_content_html += '<div class="order" style="position:relative;" >';
            tmp_content_html += '<div class="order_body" onclick="showScenicArea(\'' + data[i]['id'] + '\',\'' + data[i]['map_type'] + '\')">';
            tmp_content_html += '   <img src="' + data[i]['image'] + '">';//'   <img src="../resource/image/logo.png">';
            tmp_content_html += '   <div class="scenic_content" style="position: relative">';
            tmp_content_html += '      <h5>' + data[i]['name'] + '</h5>';
            tmp_content_html += '      <h5>&nbsp</h5>';
            tmp_content_html += '      <h5 style="color: red">¥' + parseFloat(cur_cost).toFixed(2) + '</h5>'
            tmp_content_html += '   </div></div>';

            tmp_content_html += '</div>';
        } else {
            tmp_content_html += '<div class="order" style="position:relative;">';
            tmp_content_html += '<div class="order_body" onclick="showTourismCourse(\'' + data[i]['id'] + '\',\'' + data[i]['map_type'] + '\')">';
            tmp_content_html += '   <img src="' + data[i]['image'] + '">';//'   <img src="../resource/image/logo.png">';
            tmp_content_html += '   <div class="scenic_content" style="position: relative">';
            if (data[i]['title'] == '') {
                tmp_content_html += '      <h5>' + data[i]['name'] + '</h5>';
                tmp_content_html += '      <h5>&nbsp</h5>';
            } else {
                tmp_content_html += '      <h5>' + data[i]['title'] + '</h5>';
                tmp_content_html += '      <h5>' + data[i]['name'] + '</h5>';
            }
            tmp_content_html += '      <h5 style="color: red">¥' + parseFloat(cur_cost).toFixed(2) + '</h5>'
            tmp_content_html += '   </div></div>';

            tmp_content_html += '</div>';
        }

        content_html += tmp_content_html;
    }

    $('#container').html(content_html);
}

function showScenicArea(id, type) {
    var shopid = sessionStorage.getItem('shopid');
    window.location.href = 'home.php?shopid=' + shopid + '&type=2&targetid=' + id + "&map_type=" + type;
}

function showTourismCourse(id, type) {
    var shopid = sessionStorage.getItem('shopid');
    window.location.href = 'tourism_new.php?shopid=\'' + shopid + "\'&targetid=" + id + "&map_type=" + type;
}

function changeBtnState() {
    $('#note').hide();
    if (target_type == 0) {
        $('#btn_area').css({
            'background-color': '#24c6d3',
            'color': 'white'
        });
        $('#btn_course').css({
            'background-color': 'white',
            'color': '#24c6d3'
        });

        $('#btn_area_sel').css('display', 'none');
        $('#btn_range_sel').css('width', '60%');
        $('#btn_search').css('width', '40%');

    } else {
        $('#btn_area').css({
            'background-color': 'white',
            'color': '#24c6d3'
        });
        $('#btn_course').css({
            'background-color': '#24c6d3',
            'color': 'white'
        });

        $('#btn_area_sel').css('display', 'initial');
        $('#btn_range_sel').css('width', '45%');
        $('#btn_area_sel').css('width', '33%');
        $('#btn_search').css('width', '22%');
    }
}

// jump searching status
function filter_scenic(search_text) {
    window.location.href = 'search_result.php?type=' + target_type + '&str=\'' + search_text + '\'';
}

function selectItem(sel_str, type) {
    sel_str = sel_str.replace('亚洲·中国·', '');
    sel_str = sel_str.replace('中国·', '');
    if (sel_str.substr(1, 1) != '洲') sel_str = '亚洲·中国·' + sel_str;

    ss = sel_str.split('·');
    var cur_str = '';

    itemClicked('', type, -1, 0);
    var i = 0;
    for (i = 0; i < ss.length; i++) {
        var cur_row = -1;
        switch (i) {
            case 0:
                for (var j = 0; j < menu_infos[1].length; j++) {  // continent information
                    if (menu_infos[1][j]['parent'] == ss[i]) {
                        cur_row = j;
                        break;
                    }
                }
                break;
            case 1:
                if (ss[i] == '中国') {
                    cur_row = 0;
                } else {
                    var childs = menu_infos[1][k[0]]['child'];     // coutry information
                    if (childs.length > 0) {
                        for (var j = 0; j < childs.length; j++) {
                            if (childs[j]['parent'] == ss[i]) {
                                cur_row = j;
                                if (ss[0] == '亚洲') cur_row++;
                                break;
                            }
                        }
                    }
                }
                break;
            case 2:
                if (ss[1] == '中国') {
                    var childs = menu_infos[0];
                    for (var j = 0; j < childs.length; j++) {
                        // var tmp_str = sel_str + '·' + cur_txt;
                        if (childs[j]['parent'] == ss[i]) {
                            cur_row = j;
                            break;
                        }

                    }
                } else {
                    var childs;
                    if (ss[0] == '亚洲')
                        childs = menu_infos[1][k[0]]['child'][k[1] - 1]['child'];     // coutry information
                    else
                        childs = menu_infos[1][k[0]]['child'][k[1]]['child'];     // coutry information

                    if (childs.length > 0) {
                        for (var j = 0; j < childs.length; j++) {
                            if (childs[j] == ss[i]) {
                                cur_row = j;
                                break;
                            }
                        }
                    }

                }
                break;
            case 3:
                var childs = menu_infos[0][k[2]]['child'];
                for (var j = 0; j < childs.length; j++) {
                    if (childs[j] == ss[i]) {
                        cur_row = j;
                        break;
                    }
                }
                break;
        }

        k[i] = cur_row;

        if (i < ss.length - 1)
            itemClicked(cur_str, type, i, cur_row);
        else
            $($('#cmenu_col' + i).children()[cur_row]).addClass('selected');

        if (cur_str != '') cur_str += '·';
        cur_str += ss[i];
    }

}

function itemClicked(sel_str, type, col, row) {
    var contents = '';
    var cur_height = 0;
    var cur_txt = ''

    if (row == -1) return;
    var ss = sel_str.split('·');
    // current item select status
    if (col > -1) {
        $('#cmenu_col' + col + '>.cmenu_item').removeClass('selected');
        $($('#cmenu_col' + col).children()[row]).addClass('selected');

        if (col == 1 && row > 0 && ss[1] == '中国')
            cur_txt = $($('#note').children()[col]).children()[row - 1].innerHTML;
        else
            cur_txt = $($('#note').children()[col]).children()[row].innerHTML;

        cur_txt = cur_txt.replace('<span>', '');
        cur_txt = cur_txt.replace('</span>', '');

        k[col] = row;
    }
    for (var i = 0; i <= col; i++) {
        if (type == 0)
            contents += '<div class="col-xs-4" id="cmenu_col' + i + '">';
        else
            contents += '<div class="col-xs-3" id="cmenu_col' + i + '">';

        var h = parseInt($('#cmenu_col' + i).css('height'));
        if (h > cur_height) cur_height = h;
        contents += $('#note').children()[i].innerHTML;
        contents += '</div>'
    }

    var cur_content = '';
    if (type == 0)
        cur_content = '<div class="col-xs-4"  id="cmenu_col' + (col + 1) + '">';
    else
        cur_content = '<div class="col-xs-3"  id="cmenu_col' + (col + 1) + '">';

    switch (col) {
        case -1:
            for (var i = 0; i < menu_infos[1].length; i++) {  // continent information
                cur_content += '<div class="cmenu_item" onclick="itemClicked(\'\',' + type + ', 0,' + i + ')"><span>' + menu_infos[1][i]['parent'] + '</span></div>';
            }
            break;
        case 0:
            var drow = 0;
            if (cur_txt == '亚洲') {
                cur_content += '<div class="cmenu_item" onclick="itemClicked(\'亚洲\',' + type + ', 1, 0)"><span>中国</span></div>';
                drow = 1;
            }
            var childs = menu_infos[1][row]['child'];     // coutry information
            if (childs.length > 0) {
                for (var i = 0; i < childs.length; i++) {
                    cur_content += '<div class="cmenu_item"  onclick="itemClicked(\'' + cur_txt + '\',' + type + ', 1,' + (i + drow) + ')"><span>' + childs[i]['parent'] + '</span></div>';
                }
            }

            sel_str = menu_infos[1][row]['parent'];
            break;
        case 1:
            var tmp_str = sel_str + '·' + cur_txt;

            if (cur_txt == '中国') {
                for (var i = 0; i < menu_infos[0].length; i++) {
                    cur_content += '<div class="cmenu_item" onclick="itemClicked(\'' + tmp_str + '\',' + type + ', 2,' + i + ')"><span>' + menu_infos[0][i]['parent'] + '</span></div>';
                }
            } else {
                if (type == 0) {
                    console.log(type);
                    rangeSelected(tmp_str);
                    return;
                } else {
                    if (ss[0] == '亚洲') row--;
                    var childs = menu_infos[1][k[0]]['child'][row]['child'];
                    for (var i = 0; i < childs.length; i++) {
                        // var tmp_str = sel_str + '·' + cur_txt;
                        cur_content += '<div class="cmenu_item"   onclick="itemClicked(\'' + tmp_str + '\',' + type + ', 2,' + i + ')"><span>' + childs[i] + '</span></div>';
                    }
                }
            }
            break;
        case 2:
            console.log(type);
            if (type == 0) {
                sel_str += '·' + cur_txt;
                rangeSelected(sel_str);
                return;
            } else {
                var tmp_str = sel_str + '·' + cur_txt;
                if (ss[1] != '中国') {
                    areaSelected(sel_str, cur_txt);
                    return;
                } else {
                    childs = menu_infos[0][row]['child'];
                    for (var i = 0; i < childs.length; i++) {
                        cur_content += '<div class="cmenu_item"   onclick="itemClicked(\'' + tmp_str + '\',' + type + ', 3,' + i + ')"><span>' + childs[i] + '</span></div>';
                    }
                }
            }

            break;
        case 3:
            areaSelected(sel_str, cur_txt);
            return;
    }

    cur_content += '</div>';
    contents += cur_content;

    if (type == 0)
        $('#note').html(contents);
    else
        $('#note').html(contents);

    $('#note').show();
    var h = parseInt($('#cmenu_col' + (col + 1)).css('height'));

    for (var i = 0; i <= col + 1; i++) {
        if (h > cur_height) {
            $('#cmenu_col' + i).css('height', h + 'px');
        } else {
            $('#cmenu_col' + (i + 1)).css('height', cur_height + 'px');
        }
    }
}

function rangeSelected(str) {
    $('#note').hide();

    if (target_type == 1) $('#btn_area_sel span').html('景区');

    var ss;
    if (str.substr(0, 5) == '亚洲·中国') {
        ss = str.split('·');
        str = ss[2];
    }
    ss = str.split('·');
    searchAreaInfos(target_type, ss.join('·'));
    $('#btn_range_sel span').html(str);

    if (target_type == 0)
        $('#btn_range_sel a i').attr('class', 'fa fa-fw fa-sort-desc');
    else
        $('#btn_area_sel a i').attr('class', 'fa fa-fw fa-sort-desc');
}

function areaSelected(range_str, str) {
    $('#note').hide();

    var ss;
    if (range_str.substr(0, 5) == '亚洲·中国') {
        ss = range_str.split('·');
        range_str = ss[2];
    }
    ss = range_str.split('·');
    searchAreaInfos(target_type, ss.join('·') + '·' + str);
    $('#btn_range_sel span').html(ss.join('·'));
    $('#btn_area_sel span').html(str);

    $('#btn_area_sel a i').attr('class', 'fa fa-fw fa-sort-desc');
}


function init() {
    $('#btn_range_sel').click(function () {
        $('#container').css('display', 'block');
        $('#search_scenic').css('display', 'none');
        selectItem($('#btn_range_sel span').html(), 0);

        $('#btn_range_sel a i').attr('class', 'fa fa-fw fa-sort-up');
        $('#btn_area_sel a i').attr('class', 'fa fa-fw fa-sort-desc');
        $('#btn_search a i').attr('class', 'fa fa-fw fa-sort-desc');
    });

    $('#btn_area_sel').hover(function () {
        $('#container').css('display', 'block');
        $('#search_scenic').css('display', 'none');

        var ss = $('#btn_area_sel span').html();
        ss = $('#btn_range_sel span').html() + '·' + ss;

        selectItem(ss, 1);

        $('#btn_range_sel a i').attr('class', 'fa fa-fw fa-sort-desc');
        $('#btn_area_sel a i').attr('class', 'fa fa-fw fa-sort-up');
        $('#btn_search a i').attr('class', 'fa fa-fw fa-sort-desc');
    });

    $('#btn_search').hover(function () {
        $('#container').css('display', 'none');
        $('#search_scenic').css('display', 'block');
        $('#search_scenic input').val('');

        $('#btn_range_sel a i').attr('class', 'fa fa-fw fa-sort-desc');
        $('#btn_area_sel a i').attr('class', 'fa fa-fw fa-sort-desc');
        $('#btn_search a i').attr('class', 'fa fa-fw fa-sort-up');
    }, function () {
        $('#btn_search a i').attr('class', 'fa fa-fw fa-sort-desc');
    });
}

function page_config() {
    var width = document.body.clientWidth
        || document.documentElement.clientWidth
        || window.innerWidth;

    $('#search_scenic').css('height', parseInt($('#container').css('bottom')) + parseInt($('#search_scenic').css('height')));
    //$('#container').css('max-height', $('#search_scenic').css('height'));

    init();
}

