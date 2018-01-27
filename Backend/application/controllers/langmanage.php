<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

require APPPATH . '/libraries/BaseController.php';

/**
 * Class : Area (AreaController)
 * Area Class to control all tourist area and course related operations.
 * @author : thejinhu
 * @version : 1.0
 * @since : 8 August 2017
 */
class langmanage extends BaseController
{
    /**
     * This is default constructor of the class
     */
    public function __construct()
    {
        parent::__construct();
        $this->load->model('lang_model');
        $this->isLoggedIn();
    }

    /**
     * This function used to load the first screen of the user
     */
    public function index()
    {
        $this->global['pageTitle'] = '语种列表';
        $this->global['langList'] = $this->lang_model->getList();
        $this->global['searchName'] = '';
        $this->global['searchAddress'] = '';
        $this->global['searchStatus'] = 0;
        $this->loadViews("langmanage", $this->global, NULL, NULL);
    }

    function custom_listing()
    {
        $ret = array(
            'data' => '',
            'all_data' => '',
            'status' => 'fail'
        );

//            $country = $_POST['country'];

        $langList = $this->lang_model->getList();
        $ret['data'] = $this->output_listing($langList);
        $ret['all_data'] = $this->output_all_listing($langList);
        $ret['status'] = 'success';
        echo json_encode($ret);
    }

    function output_listing($Items)
    {
        $output_html = '';
        $i = 0;
        foreach ($Items as $item):
            if ($item->isSelected == 0 || $item->text_speech_code == NULL || $item->text_speech_code == NULL) continue;
            $i++;
            $output_html .= '<tr>';
            $output_html .= '<td>' . $i . '</td>';
            $output_html .= '<td><img src="' . ($item->flag == NULL ? ('assets/images/default.png') : (base_url() . '/' . $item->flag)) . '" style="width:120px;height:70px;"></td>';
            $output_html .= '<td>' . $item->lang_text . '</td>';
            $output_html .= '<td>';
            $output_html .= '<a onclick="editItem(' . $item->id . ');">编辑 &nbsp;</a>';
            $output_html .= '<a onclick="deleteItemConfirm(' . $item->id . ')">删除 &nbsp;</a>';
            $output_html .= '<input id="lang_flag_' . $item->id
                . '" value="' . ($item->flag == NULL ? ('') : ($item->flag)) . '"'
                . ' style="display:none">';
            $output_html .= '</td>';
            $output_html .= '</tr>';
        endforeach;
        return $output_html;
    }

    function output_all_listing($Items)
    {
        $output_html = '';
        $i = 0;
        $output_html .= '<option value="0">请选择</option>';
        foreach ($Items as $item):
            if ($item->text_speech_code == NULL || $item->text_speech_code == NULL) continue;
            $i++;
            $output_html .= '<option value="' . $item->id . '" class="added_lang_' . $item->isSelected . '">';
            $output_html .= $item->lang_text;
            $output_html .= '</option>';
        endforeach;
        return $output_html;
    }

    /**
     * This function is used to load the edit form
     */
    function editItem()
    {
        $id = $_POST['id'];
        $status = isset($_POST['status']) ? $_POST['status'] : 0;
        $flag = isset($_POST['flag']) ? "uploads/" . $_POST['flag'] : "";
        $this->global['area'] = $this->lang_model->update($id, $status, $flag);

        $this->custom_listing();
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