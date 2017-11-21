<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

require APPPATH . '/libraries/BaseController.php';

/**
 * Class : Area (AreaController)
 * Area Class to control all tourist area and course related operations.
 * @author : thejinhu
 * @version : 1.0
 * @since : 8 August 2017
 */
class address_outside extends BaseController
{
    /**
     * This is default constructor of the class
     */
    public function __construct()
    {
        parent::__construct();
        $this->load->model('address_model');
        $this->isLoggedIn();
    }

    /**
     * This function used to load the first screen of the user
     */
    public function index()
    {
        $this->global['pageTitle'] = '国外地区';
        $this->global['countryList']=$this->address_model->getCountryNameList();
        $this->global['hot_area']=$this->address_model->getHotArea();
        $this->global['area_search_list']=$this->address_model->getAreaSearchList();
        $this->loadViews("address_outside", $this->global, NULL, NULL);
    }

    function custom_listing()
    {
        $ret = array(
            'data' => '',
            'status' => 'fail'
        );
        if (!empty($_POST)) {

            $continent = $_POST['continent'];
            $country = $_POST['country'];
            $status = 0;

            $countryList = $this->address_model->getCountryLists($continent, $country);
            $ret['data'] = $this->output_area($countryList);
            $ret['status'] = 'success';
        }
        echo json_encode($ret);
    }

    function output_area($areas)
    {
        $output_html = '';
        $i = 0;
        $continentList = ['亚洲', '美洲', '非洲', '欧洲', '大洋洲'];
        foreach ($areas as $area):
            $address[0] = $continentList[$area->continent - 1];
            $address[1] = $area->country;
            if($address[1]=='中国') continue;
            $i++;
            $output_html .= '<tr>';
            $output_html .= '<td>' . $i . '</td>';
            $output_html .= '<td>' . $address[0] . '</td>';
            $output_html .= '<td>' . $address[1] . '</td>';
            $output_html .= '<td>' . (($area->area == 1) ? '是' : '否') . '</td>';
            $output_html .= '<td>' . (($area->course == 1) ? '是' : '否') . '</td>';
            $output_html .= '<td>';


            if (!($area->area == '1' || $area->course == '1')) {
                $output_html .= '<a  ';
                $output_html .= ' onclick="editAreaConfirm_jingqu(' . $area->id . ',';
                $output_html .= $area->continent . ',\'' . $address[1] . '\')">编辑 &nbsp;</a>';
                $output_html .= '<a  onclick="deleteAreaConfirm_jingqu(' . $area->id . ')">删除 &nbsp;</a>';
            } else {
                $output_html .= '<a style="color:darkgrey">编辑 &nbsp;</a>';
                $output_html .= '<a style="color:darkgrey">删除 &nbsp;</a>';
            }

            if ($area->area == '0') {
                $output_html .= '<a  onclick="deployAreaConfirm_jingqu(\'' . $address[1] . '\',2)">设为热门景区 &nbsp;</a>';
            } else if ($area->area == '1') {
                $output_html .= '<a  onclick="undeployAreaConfirm_jingqu(\'' . $address[1] . '\',2)">取消热门景区 &nbsp;</a>';
            } else {
                $output_html .= '<a style="color:darkgrey">设为热门景区 &nbsp;</a>';
            }
            if ($area->course == '0') {
                $output_html .= '<a  onclick="deployAreaConfirm_jingqu(\'' . $address[1] . '\',1)">设为热门线路 &nbsp;</a>';
            } else if ($area->course == '1') {
                $output_html .= '<a  onclick="undeployAreaConfirm_jingqu(\'' . $address[1] . '\',1)">取消热门线路 &nbsp;</a>';
            } else {
                $output_html .= '<a style="color: darkgrey">设为热门线路 &nbsp;</a>';
            }
            $output_html .= '</td>';
            $output_html .= '</tr>';
        endforeach;
        return $output_html;
    }

    /**
     * This function is used to load the add Course form
     */
    function updateHotCity()
    {
        if ($this->isAdmin() == TRUE) {
            $this->loadThis();
        } else {
            $city = json_decode($_POST['city']);
            $result = $this->address_model->updateHotCity($city);
            echo json_encode(['status' => $result]);
        }
    }

    /**
     * This function is used to load the add Course form
     */
    function addCountry2DB()
    {
        if ($this->isAdmin() == TRUE) {
            $this->loadThis();
        } else {
            $id = $_POST['id'];
            $countryInfo = [
                'continent' => $_POST['continent'],
                'country' => $_POST['country'],
                'type' => $_POST['type'],
            ];
            $result = $this->address_model->addCountry2DB($countryInfo, $id);
            echo json_encode(['status' => true, 'message' => $result]);
        }
    }

    function removeCountry($id = NULL)
    {
        if (false) {//$this->address_model->getParentCourseByAreaId($id)) {
            $this->response(array('status' => false, 'message' => sprintf('Country #%d is using now.', $id)), 200);
        } else {
            if ($this->address_model->deleteCountry($id)) {
                $this->response(array('status' => true, 'message' => sprintf('Country #%d has been deleted.', $id)), 200);
            } else {
                $this->response(array('status' => false, 'message' => 'This Country does not exist!'), 404);
            }
        }
    }

    /**
     * This function is used to load the add new form
     */
    function addNew()
    {
        if ($this->isAdmin() == TRUE) {
            $this->loadThis();
        } else {
            $this->global['pageTitle'] = '新增景区';
            $this->global['isEdit'] = '0';
            $this->global['page_type_name'] = 'area_add_interface';
            $this->loadViews("area-add", $this->global, NULL, NULL);
        }
    }

    /**
     * This function is used to load the edit form
     */
    function edit($id)
    {
        if ($this->isAdmin() == TRUE) {
            $this->loadThis();
        } else {

            $this->global['pageTitle'] = '编辑景区';
            $this->global['area'] = $this->area_model->getAreaById($id);
            $this->global['page_type_name'] = 'area_add_interface';
            $this->global['isEdit'] = '1';

            $this->loadViews("area-add", $this->global, NULL, NULL);
        }
    }

    /**
     * This function used to load the first screen of the course
     */
    public
    function course()
    {
        $this->global['pageTitle'] = '旅游线路管理';
        $this->global['courseList'] = $this->area_model->getCourses();
        $this->global['searchName'] = '';
        $this->global['searchStatus'] = 0;
        $this->loadViews("course", $this->global, NULL, NULL);
    }

    /**
     * This function is used to load the add Course form
     */
    function addCourse()
    {
        if ($this->isAdmin() == TRUE) {
            $this->loadThis();
        } else {
            $this->global['pageTitle'] = '新增旅游线路';
            $this->global['areaList'] = $this->area_model->getAreas('', 'all', '1');
            $this->loadViews("course-add", $this->global, NULL, NULL);
        }
    }

    /**
     * This function is used to load the user list
     */
    function courselisting($name, $status)
    {
        if ($this->isAdmin() == TRUE) {
            $this->loadThis();
        } else {
            $this->global['pageTitle'] = '旅游线路管理';
            $this->global['courseList'] = $this->area_model->getCourses($name, $status);
            $this->global['searchName'] = $name;
            $this->global['searchStatus'] = $status;

            $this->loadViews("course", $this->global, NULL, NULL);
        }
    }

    /**
     * This function is used to load the edit form
     */
    function editcourse($id)
    {
        if ($this->isAdmin() == TRUE) {
            $this->loadThis();
        } else {
            $this->global['pageTitle'] = '编辑旅游线路';
            $this->global['areaList'] = $this->area_model->getAreas('', 'all', '1');
            $this->global['course'] = $this->area_model->getAreaById($id);

            $this->loadViews("course-add", $this->global, NULL, NULL);
        }
    }


    function pageNotFound()
    {
        $this->global['pageTitle'] = '404 - Page Not Found';

        $this->loadViews("404", $this->global, NULL, NULL);
    }
}

/* End of file area.php */
/* Location: .application/controllers/area.php */


?>