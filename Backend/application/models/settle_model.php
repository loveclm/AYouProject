<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class Settle_model extends CI_Model
{

    /**
     * This function is used to get all Tourist Area
     * @return array $result : This is result
     */
    function getBuyOrders($searchType, $name, $stDate, $enDate)
    {
        $this->db->select('bu.id as id, bu.settlement_date as settle_date, sh.phonenumber as shopcode, '.
            'sh.name as shopname, bu.sum as price, sh.status as status');
        $this->db->from('buy_settlement as bu');
        $this->db->join('shop as sh', 'bu.shopid = sh.id');
        switch ($searchType) {
            case '0':
                $likeCriteria = "(sh.phonenumber  LIKE '%" . $name . "%')";
                break;
            case '1':
                $likeCriteria = "(sh.name  LIKE '%" . $name . "%')";
                break;
        }
        $this->db->where($likeCriteria);
        if ($stDate != '') $this->db->where("date(bu.settlement_date) >= '" . date($stDate)."'");
        if ($enDate != '') $this->db->where("date(bu.settlement_date) <= '" . date($enDate)."'");

        $this->db->order_by('bu.settlement_date','desc');

        $query = $this->db->get();
        $result = $query->result();
        return $result;
    }

    /**
     * This function is used to get all Tourist Area
     * @return array $result : This is result
     */
    function getOrders($searchType, $name, $stDate, $enDate)
    {
        $this->db->select('au.id as id, sh.phonenumber as shopcode, sh.name as shopname, '.
            'au.money as price, au.status as status');
        $this->db->from('auth_settlement as au');
        $this->db->join('shop as sh', 'au.shopid = sh.id');
        switch ($searchType) {
            case '0':
                $likeCriteria = "(sh.phonenumber  LIKE '%" . $name . "%')";
                break;
            case '1':
                $likeCriteria = "(sh.name  LIKE '%" . $name . "%')";
                break;
        }
        $this->db->where($likeCriteria);
        if ($stDate != '') $this->db->where("date(au.settlement_date) >= '" . date($stDate)."'");
        if ($enDate != '') $this->db->where("date(au.settlement_date) <= '" . date($enDate)."'");

        $this->db->order_by('au.settlement_date','desc');

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

/* End of file settle_model.php */
/* Location: .application/models/settle_model.php */
?>