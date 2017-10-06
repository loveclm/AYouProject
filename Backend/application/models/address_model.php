<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class address_model extends CI_Model
{
    /**
     * This function is used to get all Tourist Area
     * @return array $result : This is result
     */
    function getLists($name, $address = '')
    {

        $sql = 'select id, address, 0 as area, 0 as course from tourist_area ';
        $sql .= ' where type = 2 ';
        if ($address != '') {
            $sql .= " and (address LIKE '%" . $address . "%') ";
        }
        if ($name != '') {
            $sql .= " and (name LIKE '%" . $name . "%') ";
        }
        $sql .= ' group by LEFT( address, 8) ';
        $sql .= ' order by address';
        $query = $this->db->query($sql);

        $result1 = $query->result();
        $this->db->select('*');
        $this->db->from('tbl_addr');
        $query = $this->db->get();
        $result2 = $query->row();
        if (count($result2) > 0) {
            foreach ($result1 as $item) {
                if ($result2->city_area != '') {
                    if (strstr($item->address, $result2->city_area) != FALSE)
                        $item->area = 1;
                    else
                        $item->area = 2;
                }
                if ($result2->city_course != '') {
                    if (strstr($item->address, $result2->city_course) != FALSE)
                        $item->course = 1;
                    else
                        $item->course = 2;
                }
            }

        }
        return $result1;
    }

    function updateHotCity($city)
    {
        $this->db->where('type', 0);
        $this->db->update('tbl_addr', $city);
        return true;
    }

    /**
     * This function is used to add new area to system
     * @return number $insert_id : This is last inserted id
     */
    function addNewArea($areainfo)
    {

        $this->db->trans_start();
        $this->db->insert('tourist_area', $areainfo);
        $insert_id = $this->db->insert_id();
        $this->db->trans_complete();

        return $insert_id;
    }

    /*
     * This function is used to update the area information
     * @param array $areaInfo : This is users updated information
     * @param number $areaId : This is area id
     */
    function update($areaInfo, $areaId)
    {
        $this->db->where('id', $areaId);
        $this->db->update('tourist_area', $areaInfo);
        return TRUE;
    }

    /**
     * This function is used to delete the user information
     * @param number $userId : This is user id
     * @return boolean $result : TRUE / FALSE
     */
    function delete($areaId)
    {
        $this->db->where('id', $areaId);
        $this->db->delete('tourist_area');
        return TRUE;
    }
}


/* End of file address_model.php */
/* Location: .application/models/address_model.php */

