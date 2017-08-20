<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

require APPPATH . '/libraries/BaseController.php';

/**
 * Class : Shop (ShopController)
 * Area Class to control all shop related operations.
 * @author : The jin hu
 * @version : 1.0
 * @since : 12 August 2017
 */
class Ordermanage extends BaseController
{
    /**
     * This is default constructor of the class
     */
    public function __construct()
    {
        parent::__construct();
        $this->load->model('order_model');
        $this->isLoggedIn();
    }

    /**
     * This function used to load the first screen of the user
     */
    public function index()
    {
        $this->buyListing('0', 'ALL', '', '', '0');
    }

    /**
     * This function is used to load the user list
     */
    function buyListing($searchType, $name, $stDate, $enDate, $status)
    {
        if ($this->isAdmin() == TRUE) {
            $this->loadThis();
        } else {
            $this->global['pageTitle'] = '订单管理';
            if ($name == 'ALL') $name = '';
            if ($stDate == '0') $stDate = '';
            if ($enDate == '0') $enDate = '';
            $this->global['buyList'] = $this->order_model->getBuyOrders($searchType, $name, $stDate, $enDate, $status);
            $this->global['authList']=$this->global['buyList'];
            $this->global['showList'] = '1';
            $this->global['searchType'] = $searchType;
            $this->global['searchName'] = $name;
            $this->global['startDate'] = $stDate;
            $this->global['endDate'] = $enDate;
            $this->global['searchStatus'] = $status;
            $this->global['searchTypeAuth'] = $searchType;
            $this->global['searchNameAuth'] = $name;
            $this->global['startDateAuth'] = $stDate;
            $this->global['endDateAuth'] = $enDate;
            $this->global['searchStatusAuth'] = $status;
            $this->loadViews("ordermanage", $this->global, NULL, NULL);
        }
    }

    /**
     * This function is used to load the user list
     */
    function authListing($searchType, $name, $stDate, $enDate, $status)
    {
        if ($this->isAdmin() == TRUE) {
            $this->loadThis();
        } else {
            $this->global['pageTitle'] = '订单管理';
            if ($name == 'ALL') $name = '';
            if ($stDate == '0') $stDate = '';
            if ($enDate == '0') $enDate = '';
            $this->global['authList'] = $this->order_model->getOrders($searchType, $name, $stDate, $enDate, $status);
            $this->global['buyList']=$this->global['authList'];
            $this->global['showList'] = '2';
            $this->global['searchType'] = $searchType;
            $this->global['searchName'] = $name;
            $this->global['startDate'] = $stDate;
            $this->global['endDate'] = $enDate;
            $this->global['searchStatus'] = $status;
            $this->global['searchTypeAuth'] = $searchType;
            $this->global['searchNameAuth'] = $name;
            $this->global['startDateAuth'] = $stDate;
            $this->global['endDateAuth'] = $enDate;
            $this->global['searchStatusAuth'] = $status;
            $this->loadViews("ordermanage", $this->global, NULL, NULL);
        }
    }

    function pageNotFound()
    {
        $this->global['pageTitle'] = 'CodeInsect : 404 - Page Not Found';

        $this->loadViews("404", $this->global, NULL, NULL);
    }
}

/* End of file ordermanage.php */
/* Location: .application/controllers/ordermanage.php */


?>