<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

require APPPATH . '/libraries/BaseController.php';

/**
 * Class : Area (AreaController)
 * Area Class to control all tourist area and course related operations.
 * @author : thejinhu
 * @version : 1.0
 * @since : 8 August 2017
 */
class area_foreign extends BaseController
{
    /**
     * This is default constructor of the class
     */
    public function __construct()
    {
        parent::__construct();
        $this->load->model('area_foreign_model');
        $this->load->model('address_model');
        $this->isLoggedIn();
    }

    /**
     * This function used to load the first screen of the user
     */
    public function index()
    {
        $this->global['pageTitle'] = '景区列表';
        $this->global['areaList'] = $this->area_foreign_model->getAreas();
        $this->global['countryList']=$this->address_model->getCountryNameList();
        $this->global['searchName'] = '';
        $this->global['searchAddress'] = '';
        $this->global['searchStatus'] = 0;
        $this->loadViews("area-foreign", $this->global, NULL, NULL);
    }

    /**
     * This function is used to load the user list
     */
    function listing($name, $address, $status)
    {
        if ($this->isAdmin() == TRUE) {
            $this->loadThis();
        } else {
            $this->global['pageTitle'] = '景区列表';
            $this->global['areaList'] = $this->area_foreign_model->getAreas($name, $address, $status);
            $this->global['searchName'] = $name;
            $this->global['searchAddress'] = $address;
            $this->global['searchStatus'] = $status;

            $this->loadViews("area-foreign", $this->global, NULL, NULL);
        }
    }

    function custom_listing()
    {
        $ret = array(
            'data' => '',
            'status' => 'fail'
        );
        if (!empty($_POST)) {

            $name = $_POST['name'];
            $continent = $_POST['continent'];
            $country = $_POST['country'];
            $status = $_POST['status'];

            $areaList = $this->area_foreign_model->getAreas($name, $continent, $country, $status);
            $ret['data'] = $this->output_area($areaList);
            $ret['status'] = 'success';
        }
        echo json_encode($ret);
    }

    function output_area($areas)
    {
        $output_html = '';
        foreach ($areas as $area):
            $points = json_decode($area->point_list);
            $pointCount = count($points);
            $statusStr = '已上架';
            $addr[0] = $area->address;
            $addr[1] = $area->address_1;
            if ($area->status != '1') $statusStr = '未上架';
            $output_html .= '<tr>';
            $output_html .= '<td>' . $area->name . '</td>';
            $output_html .= '<td>' . $pointCount . '</td>';
            $output_html .= '<td>' . floatval($area->price) * floatval($area->discount_rate) . '</td>';
            $output_html .= '<td>' . $addr[0] . ', &nbsp;' . $addr[1] . '</td>';
            $output_html .= '<td>' . $statusStr . '</td>';
            $output_html .= '<td>';
            if ($area->status == '0') {
                $output_html .= '<a href="' . base_url() . 'editarea_foreign/' . $area->id . '">编辑 &nbsp;</a>';
                $output_html .= '<a  onclick="deleteAreaConfirm_jingqu(' . $area->id . ')">删除 &nbsp;</a>';
            }
            if ($area->status == '0') {
                $output_html .= '<a  onclick="deployAreaConfirm_jingqu(' . $area->id . ')">上架 &nbsp;</a>';
            } else {
                $output_html .= '<a  onclick="undeployAreaConfirm_jingqu(' . $area->id . ')">下架 &nbsp;</a>';
            }
            $output_html .= '</td>';
            $output_html .= '</tr>';
        endforeach;
        return $output_html;
    }

    function course_listing()
    {
        $ret = array(
            'data' => '',
            'status' => 'fail'
        );
        if (!empty($_POST)) {

            $name = $_POST['name'];
            $status = $_POST['status'];

            $courseList = $this->area_foreign_model->getCourses($name, $status);
            $ret['data'] = $this->output_course($courseList);
            $ret['status'] = 'success';
        }
        echo json_encode($ret);
    }

    function output_course($courseList)
    {
        $output_html = '';

        $courseCount = count($courseList);

        for ($i = 0; $i < $courseCount; $i++) {
            $course = $courseList[$i];
            $areas = json_decode($courseList[$i]->point_list);
            $areaCount = count($areas);
            $courseName = '';
            foreach ($areas as $areaItem) {
                if ($courseName == '') $courseName = $areaItem->name;
                else $courseName = $courseName . ' - ' . $areaItem->name;
            }

            $output_html .= '<tr>';
            $output_html .= '<td>' . $course->name . '</td>';
            $output_html .= '<td>' . $courseName . '</td>';
            $output_html .= '<td>' . floatval($course->price) * floatval($course->discount_rate) . '</td>';
            $output_html .= '<td>' . ($course->status == 1 ? '已上架' : '未上架') . '</td>';
            $output_html .= '<td>';
            $output_html .= '<a href="' . base_url() . 'editcourse/' . $course->id . '">查看 &nbsp;</a>';
            if ($course->status == '0') {
                $output_html .= '<a  onclick="deleteAreaConfirm(' . $course->id . ')">删除 &nbsp;</a>';
            }
            if ($course->status == '0') {
                $output_html .= '<a  onclick="deployAreaConfirm(' . $course->id . ')">上架 &nbsp;</a>';
            } else {
                $output_html .= '<a  onclick="undeployAreaConfirm(' . $course->id . ')">下架 &nbsp;</a>';
            }
            $output_html .= '</td>';
            $output_html .= '</tr>';
        }

        return $output_html;
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
            $this->global['countryList']=$this->address_model->getCountryNameList();
            $this->global['isEdit'] = '0';
            $this->global['page_type_name'] = 'area_add_interface';
            $this->loadViews("area-foreign-add", $this->global, NULL, NULL);
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
            $this->global['area'] = $this->area_foreign_model->getAreaById($id);
            $this->global['countryList']=$this->address_model->getCountryNameList();
            $this->global['page_type_name'] = 'area_add_interface';
            $this->global['isEdit'] = '1';

            $this->loadViews("area-foreign-add", $this->global, NULL, NULL);
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