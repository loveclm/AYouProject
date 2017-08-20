<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class Order_model extends CI_Model
{

    /**
     * This function is used to get all Tourist Area
     * @return array $result : This is result
     */
    function getBuyOrders($searchType, $name, $stDate, $enDate, $status)
    {
        $this->db->select('bu.id as id, bu.number as number, usr.mobile as mobile, trp.price as price,' .
            'tra.name as tour_area, trp.name as tour_point, sh.name as shop_name, bu.status as status, bu.ordered_time as ordered_time');
        $this->db->from('buy_order as bu');
        $this->db->join('tbl_users as usr', 'bu.userid = usr.userid');
        $this->db->join('tourist_attraction as trp', 'bu.attractionid = trp.id');
        $this->db->join('tourist_area as tra', 'trp.areaid = tra.id');
        $this->db->join('shop as sh', 'bu.shopid = sh.id');
        switch ($searchType) {
            case '0':
                $likeCriteria = "(bu.number  LIKE '%" . $name . "%')";
                break;
            case '1':
                $likeCriteria = "(usr.mobile  LIKE '%" . $name . "%')";
                break;
            case '2':
                $likeCriteria = "(tra.name  LIKE '%" . $name . "%')";
                break;
            case '3':
                $likeCriteria = "(trp.name  LIKE '%" . $name . "%')";
                break;
        }
        $this->db->where($likeCriteria);
        if ($stDate != '') $this->db->where("date(bu.ordered_time) >= '" . date($stDate)."'");
        if ($enDate != '') $this->db->where("date(bu.ordered_time) <= '" . date($enDate)."'");

        if ($status != '0') $this->db->where('bu.status',$status);
        $this->db->order_by('bu.ordered_time','desc');

        $query = $this->db->get();
        $result = $query->result();
        return $result;
    }

    /**
     * This function is used to get all Tourist Area
     * @return array $result : This is result
     */
    function getOrders($searchType, $name, $stDate, $enDate, $status)
    {
        $this->db->select('au.id as id, au.number as number, usr.mobile as mobile, au.code as price,' .
            'tra.name as tour_area, tra.address as tour_point, sh.name as shop_name, au.status as status, au.ordered_time as ordered_time');
        $this->db->from('auth_order as au');
        $this->db->join('authcode as ac', 'au.authid = ac.id');
        $this->db->join('tbl_users as usr', 'au.userid = usr.userid');
        $this->db->join('tourist_area as tra', 'ac.targetid = tra.id');
        $this->db->join('shop as sh', 'ac.shopid = sh.id');
        switch ($searchType) {
            case '0':
                $likeCriteria = "(au.number  LIKE '%" . $name . "%')";
                break;
            case '1':
                $likeCriteria = "(usr.mobile  LIKE '%" . $name . "%')";
                break;
            case '2':
                $likeCriteria = "(tra.name  LIKE '%" . $name . "%')";
                break;
        }
        $this->db->where($likeCriteria);
        if ($stDate != '') $this->db->where("date(au.ordered_time) >= '" . date($stDate)."'");
        if ($enDate != '') $this->db->where("date(au.ordered_time) <= '" . date($enDate)."'");

        if ($status != '0') $this->db->where('au.status',$status);
        $this->db->order_by('au.ordered_time','desc');

        $query = $this->db->get();
        $result = $query->result();
        return $result;
    }

    /**
     * This function is used to get all Tourist Area
     * @return array $result : This is result
     */
    function getOrderTotal($id)
    {
        $this->db->select('*');
        $this->db->from('auth_order');
        $this->db->where('authid', $id);
        $qresult = $this->db->count_all_results();
        return $qresult;
    }

    /**
     * This function is used to get all Tourist Area
     * @return array $result : This is result
     */
    function getOrderCount($id)
    {
        $this->db->select('*');
        $this->db->from('authcode');
        $this->db->where('shopid', $id);
        $query = $this->db->get();
        $qresult = $query->result();
        $result = 0;
        if (count($qresult) > 0) {
            foreach ($qresult as $item) {
                $result += $this->getOrderTotal($item->id);
            }
        }
        return $result;
    }

    /**
     * This function is used to get all Tourist Area
     * @return array $result : This is result
     */
    function getCount()
    {
        $this->db->select('*');
        $this->db->from('auth_order');
        $qresult = $this->db->count_all_results();
        return $qresult;
    }

    /**
     * This function is used to get all Tourist Area
     * @return array $result : This is result
     */
    function getOrderUsed($id)
    {
        $this->db->select('*');
        $this->db->from('auth_order');
        $this->db->where('authid', $id);
        $this->db->where('status', '1');
        $qresult = $this->db->count_all_results();
        return $qresult;
    }

    /**
     * This function is used to get all Tourist Area
     * @return array $result : This is result
     */
    function getAuthOrders($id, $status)
    {
        $this->db->select('id, code, status, ordered_time');
        $this->db->from('auth_order');
        $this->db->where('authid', $id);
        if ($status == '1')
            $this->db->where('status', $status);
        else if ($status != '0')
            $this->db->where("status <> '1'");
        $query = $this->db->get();

        $result = $query->result();
        return $result;
    }

    /**
     * This function is used to get all Tourist Area
     * @return array $result : This is result
     */
    function getAuthOrder($id)
    {
        $this->db->select('au.number, au.code, usr.mobile, au.ordered_time, au.status');
        $this->db->from('auth_order as au');
        $this->db->join('tbl_users as usr', 'au.userid = usr.userid');
        $this->db->where('au.id', $id);
        $query = $this->db->get();
        $result = $query->result();
        return $result['0'];
    }

    /**
     * This function is used to get all Tourist Area
     * @return array $result : This is result
     */
    function updateMoney($id, $money)
    {
        $this->db->select('*');
        $this->db->from('authcode');
        $this->db->where('id', $id);
        $query = $this->db->get();
        $result = $query->result();
        if (count($result) == 0) return FALSE;
        $authInfo = $result['0'];
        $authInfo->money = $money;
        $this->db->select('*');
        $this->db->where('id', $id);
        $this->db->update('authcode', $authInfo);
        return TRUE;
    }

    /**
     * This function is used to add new shop to system
     * @return number $insert_id : This is last inserted id
     */
    function addAuth($authInfo)
    {
        $this->db->trans_start();
        $this->db->insert('authcode', $authInfo);
        $insert_id = $this->db->insert_id();
        $this->db->trans_complete();
        return $insert_id;
    }

    /**
     * This function is used to get init of AuthCode
     * @return int count($result) + 1 : This is init
     */
    function getAuthInit($authInfo)
    {
        $this->db->select('*');
        $this->db->from('authcode');
        $this->db->where('shopid', $authInfo['shopid']);
        $this->db->where('targetid', $authInfo['targetid']);
        $result = $this->db->count_all_results();
        return $result + 1;
    }
}



/* End of file order_model.php */
/* Location: .application/models/order_model.php */
