<?php if(!defined('BASEPATH')) exit('No direct script access allowed');

require APPPATH . '/libraries/BaseController.php';

/**
 * Class : Shop (ShopController)
 * Area Class to control all shop related operations.
 * @author : The jin hu
 * @version : 1.0
 * @since : 12 August 2017
 */
class authmanage extends BaseController
{
    /**
     * This is default constructor of the class
     */
    public function __construct()
    {
        parent::__construct();
        $this->load->model('auth_model');
        $this->isLoggedIn();
    }

    /**
     * This function used to load the first screen of the user
     */
    public function index()
    {
        $this->listing('0','','0');
    }

    /**
     * This function is used to load the user list
     */
    function listing($searchType, $name, $status)
    {
        if($this->isAdmin() == TRUE)
        {
            $this->loadThis();
        }
        else
        {
            $this->global['pageTitle'] = '授权码管理';
            $this->global['authList'] =$this->auth_model->getAuths($searchType, $name, $status);
            $this->global['searchType'] = $searchType;
            $this->global['searchName'] = $name == 'ALL'?'':$name;
            $this->global['searchStatus'] = $status;
            $this->loadViews("authmanage", $this->global, NULL , NULL);
        }
    }

    /**
     * This function is used to load the edit form
     */
    function detail($id, $status)
    {
        if($this->isAdmin() == TRUE)
        {
            $this->loadThis();
        }
        else
        {
            $this->global['pageTitle'] = '查看详情';
            $this->global['authList'] = $this->auth_model->getAuthOrders($id, $status);
            $this->global['searchStatus'] = $status;
            $this->global['authid'] = $id;

            $this->loadViews("authdetail", $this->global, NULL, NULL);
        }
    }

    /**
     * This function is used to load the edit form
     */
    function addmoney($money, $id)
    {
        if($this->isAdmin() == TRUE)
        {
            $this->loadThis();
        }
        else
        {
            $result = $this->auth_model->updateMoney($id, $money);
            return redirect('authmanage');
        }
    }

    /**
     * This function is used to load the edit form
     */
    function orderdetail($id)
    {
        if($this->isAdmin() == TRUE)
        {
            $this->loadThis();
        }
        else
        {
            $this->global['pageTitle'] = '订单详情';
            $this->global['orderitem'] = $this->auth_model->getAuthOrder($id);

            $this->loadViews("authorderdetail", $this->global, NULL, NULL);
        }
    }

    function pageNotFound()
    {
        $this->global['pageTitle'] = 'CodeInsect : 404 - Page Not Found';

        $this->loadViews("404", $this->global, NULL, NULL);
    }
}

/* End of file authmanage.php */
/* Location: .application/controllers/authmanage.php */


?>