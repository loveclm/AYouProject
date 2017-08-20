<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class Collection_model extends CI_Model
{

    /**
     * This function is used to get all Tourist Area
     * @return array $result : This is result
     */
    function getUserLists($searchType, $name)
    {
        $this->db->select('userId, mobile');
        $this->db->from('tbl_users');
        $this->db->where("userId <> '1'");
        if($name!='') {
            switch ($searchType) {
                case '0':
                    $likeCriteria = "(mobile  LIKE '%" . $name . "%')";
                    break;
            }
            $this->db->where($likeCriteria);
        }
        $this->db->order_by('updatedDtm', 'desc');

        $query = $this->db->get();
        $result = $query->result();
        return $result;
    }

    /**
     * This function is used to get all Tourist Area
     * @return array $result : This is result
     */
    function getBuyOrderPaid($id)
    {
        $this->db->select('*');
        $this->db->from('buy_order');
        $this->db->where('userid', $id);
        $this->db->where('status', '1');
        $qresult = $this->db->count_all_results();

        return $qresult;
    }

    /**
     * This function is used to get all Tourist Area
     * @return array $result : This is result
     */
    function getAuthOrderPaid($id)
    {
        $this->db->select('*');
        $this->db->from('auth_order');
        $this->db->where('userid', $id);
        $this->db->where('status', '1');
        $qresult = $this->db->count_all_results();
        return $qresult;
    }

    /**
     * This function is used to get all Tourist Area
     * @return array $result : This is result
     */
    function getTotalPaid($id)
    {
        return ($this->getAuthOrderPaid($id) + $this->getBuyOrderPaid($id));
    }
}

/* End of file collection_model.php */
/* Location: .application/models/collection_model.php */
