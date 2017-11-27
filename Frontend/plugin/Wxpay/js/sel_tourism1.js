
var menu_infos = [];

$(function () {
    if(target_type == 0)
        $('#btn_area').trigger('click');
    else
        $('#btn_course').trigger('click');

    page_config();
    changeBtnState();
    getMenuAndAreaInfos();
    //getLocationInformation();   // simulate method
});

function searchSelected(index) {
    target_type = index;
    changeBtnState();
    showHomeData();
}

function showHomeData(){
    var searchData = sessionStorage.getObject('home_data');
    if((searchData == []) || (searchData == null)) {
        return;
    }

    var data = [];
    menu_infos = searchData[0];
    showMenuInfo();


    if(target_type == 0){
        data = searchData[1];
        $('#btn_range_sel span').html(data[0][0]['hot_area_city']);
        data = data[2]['data'];
    }else{
        data = searchData[1];
        $('#btn_range_sel span').html(data[0][0]['hot_course_city']);
        $('#btn_area_sel span').html(data[0][0]['hot_course_area']);
        data = data[1]['data'];
    }

    display_area_infos(data);
}

//generate the menus in order to select the location
function display_area_infos(data) {

    var content_html = '';
    for (var i = 0; i < data.length; i++) {
        var tmp_content_html="";
        if( target_type == 0) {
            tmp_content_html += '<div class="order">';
            tmp_content_html += '<div class="order_body" onclick="showScenicArea(\'' + data[i]['id'] +'\',\''+ data[i]['map_type']+ '\')">';
            tmp_content_html += '   <img src="'+ data[i]['image'] +'">';//'   <img src="../resource/image/logo.png">';
            tmp_content_html += '   <div class="scenic_content" style="position: relative">';
            tmp_content_html += '      <h5>' + data[i]['name'] + '</h5>';
            tmp_content_html += '      <h5>&nbsp</h5>';
            tmp_content_html += '      <h5 style="color: red">¥' + parseFloat( data[i]['cost']).toFixed(2)+ '</h5>'
            tmp_content_html += '   </div></div>';

            tmp_content_html += '</div>';
        }else{
            tmp_content_html += '<div class="order">';
            tmp_content_html += '<div class="order_body" onclick="showTourismCourse(\'' + data[i]['id'] +'\',\''+ data[i]['map_type']+ '\')">';
            tmp_content_html += '   <img src="'+ data[i]['image'] +'">';//'   <img src="../resource/image/logo.png">';
            tmp_content_html += '   <div class="scenic_content" style="position: relative">';
            if(data[i]['title'] == '') {
                tmp_content_html += '      <h5>' + data[i]['name'] + '</h5>';
                tmp_content_html += '      <h5>&nbsp</h5>';
            }else{
                tmp_content_html += '      <h5>' + data[i]['title'] + '</h5>';
                tmp_content_html += '      <h5>' + data[i]['name'] + '</h5>';
            }
            tmp_content_html += '      <h5 style="color: red">¥' + parseFloat( data[i]['cost']).toFixed(2)+ '</h5>'
            tmp_content_html += '   </div></div>';

            tmp_content_html += '</div>';
        }

        content_html += tmp_content_html;
    }

    $('#container').html(content_html);
}

function showScenicArea(id, type){
    var shopid = sessionStorage.getItem('shopid');
    window.location.href = 'home.php?shopid=' + shopid + '&type=2&targetid=' + id+"&map_type="+type;
}

function showTourismCourse(id, type){
    var shopid = sessionStorage.getItem('shopid');
    window.location.href = 'tourism_new.php?shopid=\''+shopid + "\'&targetid=" + id + "&map_type=" + type;
}

function changeBtnState() {
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
        $('#btn_range_sel').css('width', '40%');
        $('#btn_area_sel').css('width', '30%');
        $('#btn_search').css('width', '30%');
    }
}

// jump searching status
function filter_scenic(search_text) {
    window.location.href = 'search_result.php?type=' + target_type + '&str=\'' + search_text+'\'';
}

function showMenuInfo() {
    // make menu for range selection
    var contents = '<a href="#"><span>城市</span><i class="fa fa-fw fa-sort-desc"></i></a>';

    var content_html = '<ul data-length="'+menu_infos[1].length+'">';
    for (var i = 0; i < menu_infos[1].length; i++) {  // continent information
        content_html += '<li><a href="#">' + menu_infos[1][i]['parent'] + '</a>';
        // local country information
        content_html += '   <ul style="top:-' + (i * 35) + 'px;" data-length="'+(menu_infos[1][i]['child'].length+1)+'">';
        if (i == 0) {
            content_html += '       <li><a href="#">中国</a>';

            content_html += '<ul data-length="'+menu_infos[0].length+'">';
            for (var j = 0; j < menu_infos[0].length; j++) {
                    content_html += '<li><a href="#"  onclick="rangeSelected(\''+  menu_infos[0][j]['parent'] + '\')">' + menu_infos[0][j]['parent'] + '</a>';
            }
            content_html += '</ul>';
            content_html += '</li>';
        }

        var childs = menu_infos[1][i]['child'];     // coutry information
        if (childs.length > 0) {
            for (var j = 0; j < childs.length; j++) {
                    content_html += '<li><a href="#" onclick="rangeSelected(\''+ menu_infos[1][i]['parent'] + '.' + childs[j]['parent'] + '\')">' + childs[j]['parent'] + '</a></li>';
            }
        }
        content_html += '   </ul>';
        content_html += '       </li>';
        content_html += '</li>';

    }
    $('#btn_range_sel').html(contents + content_html);


    contents = '<a href="#"><span>景区</span><i class="fa fa-fw fa-sort-desc"></i></a>';

    var content_html = '<ul data-length="'+menu_infos[1].length+'">';
    for (var i = 0; i < menu_infos[1].length; i++) {  // continent information
        content_html += '<li><a href="#">' + menu_infos[1][i]['parent'] + '</a>';

        // local country information
        content_html += '   <ul style="top:-' + (i * 35) + 'px;" data-length="'+(menu_infos[1][i]['child'].length+1)+'">';
        if (i == 0) {
            content_html += '       <li><a href="#">中国</a>';

            content_html += '<ul data-length="'+menu_infos[0].length+'">';
            for (var j = 0; j < menu_infos[0].length; j++) {
                content_html += '<li><a href="#">' + menu_infos[0][j]['parent'] + '</a>';

                content_html += '<ul style="top:-' + (j * 35) + 'px;" data-length="'+menu_infos[0][j]['child'].length+'">';
                childs = menu_infos[0][j]['child'];
                for (var k = 0; k < childs.length; k++) {
                    content_html += '<li><a href="#"  onclick="areaSelected(\'' + menu_infos[0][j]['parent'] + '\',\'' + childs[k] + '\')">' + childs[k] + '</a></li>';
                }
                content_html += '</ul>';
                content_html += '</li>';
            }
            content_html += '</ul>';
            content_html += '</li>';
        }
        var childs = menu_infos[1][i]['child'];     // coutry information
        if (childs.length > 0) {
            for (var j = 0; j < childs.length; j++) {
                content_html += '<li><a href="#">' + childs[j]['parent'] + '</a>';

                if(i == 0)
                    content_html += '<ul style="top:-' + ((j + 1) * 35) + 'px;" data-length="'+childs[j]['child'].length+'">';
                else
                    content_html += '<ul style="top:-' + (j * 35) + 'px;" data-length="'+childs[j]['child'].length+'">';

                var child = childs[j]['child'];
                for (var k = 0; k < child.length; k++) {
                    content_html += '<li><a href="#"  onclick="areaSelected(\'' + menu_infos[1][i]['parent'] + '.' + childs[j]['parent'] + '\',\'' + child[k] + '\')">' + child[k] + '</a></li>';
                }
                content_html += '</ul>';
                content_html += '</li>';
            }
        }
        content_html += '   </ul>';
        content_html += '</li>';

    }
    content_html += '</ul>';

    $('#btn_area_sel').html(contents + content_html);

    init();
}

function rangeSelected(str) {
    $('#btn_area_sel').trigger('mouseleave');
    $('#btn_range_sel>ul').hide();
    $('#note').css('height','0px');
    //$('#note').trigger('click');
    //$('#note').blur();

    $('#btn_range_sel span').html(str);
    if(target_type == 1)  $('#btn_area_sel span').html('景区');
    str = str.replace('.', ',');

    searchAreaInfos(target_type, str);
}

function areaSelected(range_str, str) {
    $('#btn_area_sel').trigger('mouseleave');
    $('#btn_area_sel>ul').hide();
    $('#note').css('height','0px');
    //$('#note').trigger('click');
    //$('#note').blur();

    $('#btn_range_sel span').html(range_str);
    $('#btn_area_sel span').html(str);

    range_str = range_str.replace(',', '.');
    searchAreaInfos(target_type, range_str + ',' + str);
}


function init(){
    var width = document.body.clientWidth
        || document.documentElement.clientWidth
        || window.innerWidth;

    $('#btn_range_sel').hover(function () {
        $('#container').css('display', 'block');
        $('#search_scenic').css('display', 'none');
        $('#note').css('height', parseInt($(this.children[1]).attr('data-length')) *35);

        $('#btn_range_sel>ul').show();
        $('#btn_range_sel a i').attr('class', 'fa fa-fw fa-sort-up');
        $('#btn_area_sel a i').attr('class', 'fa fa-fw fa-sort-desc');
        $('#btn_search a i').attr('class', 'fa fa-fw fa-sort-desc');
    }, function () {
        $('#btn_range_sel a i').attr('class', 'fa fa-fw fa-sort-desc');
        $('#note').css('height','0px');
    });

    $('#btn_area_sel').hover(function () {
        $('#container').css('display', 'block');
        $('#search_scenic').css('display', 'none');
        $('#note').css('height', parseInt($(this.children[1]).attr('data-length')) *35);

        $('#btn_area_sel>ul').show();
        $('#btn_range_sel a i').attr('class', 'fa fa-fw fa-sort-desc');
        $('#btn_area_sel a i').attr('class', 'fa fa-fw fa-sort-up');
        $('#btn_search a i').attr('class', 'fa fa-fw fa-sort-desc');
        $('#btn_area_sel > ul').css('left', -parseFloat(width) * 0.4);
    }, function () {
        $('#btn_area_sel a i').attr('class', 'fa fa-fw fa-sort-desc');
        $('#btn_area_sel > ul').css('left', '-9999px');
        $('#note').css('height','0px');
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
        $('#note').css('height','0px');
    });


    $('#top_menu ul').css('left', 0);
    $('#cssmenu ul ul').css('width', parseFloat(width) / 4);
    $('#cssmenu ul ul').css('z-index', 200);
    $('#cssmenu ul ul li').css('z-index', 200);
    $('#cssmenu ul ul li a').css('z-index', 200);

    $('#cssmenu ul ul li').hover(function () {
        if(this.children[1]== undefined) return;
        if($(this.firstChild).css('display') == 'none') return;

        var cur_height = parseInt($('#note').css('height'));
        var tmp_height = parseInt($(this.children[1]).attr('data-length')) *35;

        if( cur_height < tmp_height)
            $('#note').css('height', tmp_height);

    });
}

function page_config() {
    var width = document.body.clientWidth
        || document.documentElement.clientWidth
        || window.innerWidth;

    $('#search_scenic').css('height', parseInt($('#container').css('bottom')) + parseInt($('#search_scenic').css('height')));
    $('#container').css('max-height', $('#search_scenic').css('height'));

    weixinConfigure_tourism();
}

function getLocationInformation() {
    menu_infos = [
        [       // local data
            {
                'parent': '北京',     // city
                'child':             // sceinic area
                    ['故宫', '颐和园', '长城', '圆明园']
            },
            {
                'parent': '北京',     // city
                'child':             // sceinic area
                    ['故宫1', '颐和园1', '长城1', '圆明园1']
            },
            {
                'parent': '北京',     // city
                'child':             // sceinic area
                    ['故宫2', '颐和园2', '长城2', '圆明园2']
            },
            {
                'parent': '北京',     // city
                'child':             // sceinic area
                    ['故宫3', '颐和园3', '长城3', '圆明园3']
            }
        ],

        [   // foreign data
            {
                'parent': '亚洲',    // contenient
                'child': [
                    {
                        'parent': '日本',   // range
                        'child':         // sceinic area
                            ['故宫', '颐和园', '长城', '圆明园']
                    }, {
                        'parent': '韩国',   // range
                        'child':         // sceinic area
                            ['故宫', '颐和园', '长城', '圆明园']
                    }, {
                        'parent': '泰国',   // range
                        'child':        // sceinic area
                            ['故宫', '颐和园', '长城', '圆明园']
                    }, {
                        'parent': '印度',   // range
                        'child':         // sceinic area
                            ['故宫', '颐和园', '长城', '圆明园']
                    }
                ]
            },
            {
                'parent': '美洲',    // contenient
                'child': [
                    {
                        'parent': '日本',   // range
                        'child':         // sceinic area
                            ['故宫', '颐和园', '长城', '圆明园']
                    }, {
                        'parent': '韩国',   // range
                        'child':         // sceinic area
                            ['故宫', '颐和园', '长城', '圆明园']
                    }, {
                        'parent': '泰国',   // range
                        'child':         // sceinic area
                            ['故宫', '颐和园', '长城', '圆明园']
                    }, {
                        'parent': '印度',   // range
                        'child':         // sceinic area
                            ['故宫', '颐和园', '长城', '圆明园']

                    }
                ]
            }, {
            'parent': '非洲',    // contenient
            'child': [
                {
                    'parent':
                        '日本',   // range
                    'child':         // sceinic area
                        ['故宫', '颐和园', '长城', '圆明园']
                }, {
                    'parent':
                        '韩国',   // range
                    'child':         // sceinic area
                        ['故宫', '颐和园', '长城', '圆明园']
                }, {
                    'parent':
                        '泰国',   // range
                    'child':         // sceinic area
                        ['故宫', '颐和园', '长城', '圆明园']
                }, {
                    'parent':
                        '印度',   // range
                    'child':         // sceinic area
                        ['故宫', '颐和园', '长城', '圆明园']
                }
            ]
        }, {
            'parent': '欧洲',    // contenient
            'child': [
                {
                    'parent':
                        '日本',   // range
                    'child':         // sceinic area
                        ['故宫', '颐和园', '长城', '圆明园']
                }, {
                    'parent':
                        '韩国',   // range
                    'child':         // sceinic area
                        ['故宫', '颐和园', '长城', '圆明园']
                }, {
                    'parent':
                        '泰国',   // range
                    'child':         // sceinic area
                        ['故宫', '颐和园', '长城', '圆明园']
                }, {
                    'parent':
                        '印度',   // range
                    'child':         // sceinic area
                        ['故宫', '颐和园', '长城', '圆明园']
                }
            ]
        }, {
            'parent': '大洋洲',    // contenient
            'child': [
                {
                    'parent':
                        '日本',   // range
                    'child':         // sceinic area
                        ['故宫', '颐和园', '长城', '圆明园']
                }, {
                    'parent':
                        '韩国',   // range
                    'child':         // sceinic area
                        ['故宫', '颐和园', '长城', '圆明园']
                }, {
                    'parent':
                        '泰国',   // range
                    'child':         // sceinic area
                        ['故宫', '颐和园', '长城', '圆明园']
                }, {
                    'parent':
                        '印度',   // range
                    'child':         // sceinic area
                        ['故宫', '颐和园', '长城', '圆明园']
                }
            ]
        }
        ]
    ];
    showMenuInfo();
}

