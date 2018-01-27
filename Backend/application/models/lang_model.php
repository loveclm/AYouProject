<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class lang_model extends CI_Model
{
    /**
     * This function is used to get all Tourist Area
     * @return array $result : This is result
     */
    function getList($name = '', $continent = 0, $country = '', $status = 0)
    {
        $this->db->select('*');
        $this->db->from('tbl_lang');

        $query = $this->db->get();

        $result = $query->result();
        return $result;
    }

    /**
     * This function is used to get all Tourist Area
     * @return array $result : This is result
     */
    function getLangList()
    {
        $this->db->select('*');
        $this->db->from('tbl_lang');
        $this->db->where('isSelected',1);

        $query = $this->db->get();

        $result = $query->result();
        return $result;
    }

    /**
     * This function is used to get all Tourist Area
     * @return array $result : This is result
     */
    function getLangHistory($mobile = '')
    {
        if($mobile=='') return '';
        $this->db->select('*');
        $this->db->from('user');
        $this->db->where('mobile',$mobile);

        $query = $this->db->get();

        $result = $query->result();
        if(count($result)==0) return '';
        return $result[0]->info;
    }

    /**
     * This function is used to get all Tourist Area
     * @return array $result : This is result
     */
    function setLangHistory($mobile = '', $info='')
    {
        if($mobile=='') return FALSE;

        $historyInfo =[
            'mobile'=>$mobile,
            'info'=>$info
        ];
        $this->db->where('mobile', $mobile);
        $this->db->update('user', $historyInfo);

        return TRUE;
    }

    /**
     * This function is used to add new area to system
     * @return number $insert_id : This is last inserted id
     */
    function addNewLang($langinfo)
    {
        $this->db->trans_start();
        $this->db->insert('tbl_lang', $langinfo);

        $insert_id = $this->db->insert_id();

        $this->db->trans_complete();

        return $insert_id;
    }

    /**
     * This function is used to update the area information
     * @param array $areaInfo : This is users updated information
     * @param number $areaId : This is area id
     */
    function update($langId, $status=0, $flag="")
    {
        $langInfo =[
            'flag'=>$flag,
            'isSelected'=>$status
        ];
        $this->db->where('id', $langId);
        $this->db->update('tbl_lang', $langInfo);
        return TRUE;
    }

    /**
     * This function is used to delete the user information
     * @param number $userId : This is user id
     * @return boolean $result : TRUE / FALSE
     */
    function delete($langId)
    {
        $this->db->where('id', $langId);
        $this->db->delete('tbl_lang');
        return TRUE;
    }
}


/* End of file area_model.php */
/* Location: .application/models/area_model.php */

