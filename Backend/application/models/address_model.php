<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class address_model extends CI_Model
{
    /**
     * This function is used to get all Tourist Area
     * @return array $result : This is result
     */
    function getLists($name, $address = '')
    {
        $sql = 'SELECT id, address, address_1, 0 as area, 0 as course FROM tourist_area ';
        $sql .= ' WHERE ( isforeign = 1 ) ';
        if ($address != '') {
            $sql .= " AND ( address LIKE '%" . $address . "%' ) ";
        }
        if ($name != '') {
            $sql .= " AND ( name LIKE '%" . $name . "%' ) ";
        }
        $sql .= ' GROUP BY address_1 ';
        $sql .= ' ORDER BY address';
        $query = $this->db->query($sql);
        $result1 = $query->result();

        $this->db->select('*');
        $this->db->from('tbl_addr');
        $query = $this->db->get();
        $result2 = $query->row();
        if (count($result2) > 0) {
            foreach ($result1 as $item) {
                if ($result2->hot_area != '') {
                    if (strstr($item->address_1, $result2->hot_area) != FALSE)
                        $item->area = 1;
                    else
                        $item->area = 2;
                }
                if ($result2->hot_course != '') {
                    if (strstr($item->address_1, $result2->hot_course) != FALSE)
                        $item->course = 1;
                    else
                        $item->course = 2;
                }
            }

        }
        return $result1;
    }

    /**
     * This function is used to get all Tourist Area
     * @return array $result : This is result
     */
    function getCountryLists($continent = 0, $country = '')
    {
        $this->db->select('id, continent, country, type as area, type as course ');
        $this->db->from('tbl_foreign');
        if ($continent != 0)
            $this->db->where('continent', $continent);
        if ($country != '')
            $this->db->where('country LIKE \'' . $country . '\'');
        $this->db->order_by('continent');
        $query = $this->db->get();

        $result1 = $query->result();

        $this->db->select('*');
        $this->db->from('tbl_addr');
        $query = $this->db->get();
        $result2 = $query->row();
        if (count($result2) > 0) {
            foreach ($result1 as $item) {
                $item->area = 0;
                $item->course = 0;
                if ($result2->hot_area != '') {
                    if (strstr($item->country, $result2->hot_area) != FALSE)
                        $item->area = 1;
                    else
                        $item->area = 2;
                }
                if ($result2->hot_course != '') {
                    if (strstr($item->country, $result2->hot_course) != FALSE)
                        $item->course = 1;
                    else
                        $item->course = 2;
                }
            }
        }

        return $result1;
    }

    function getCountryNameList()
    {
        $this->db->select('*');
        $this->db->from('tbl_foreign');
        $this->db->order_by('continent');
        $this->db->order_by('id');
        $query = $this->db->get();
        $result = $query->result();
        return $result;
    }

    function getHotArea()
    {
        $this->db->select('*');
        $this->db->from('tbl_addr');
        $query = $this->db->get();
        $result = $query->result();
        return $result[0];
    }

    function getAreaSearchList()
    {
        $this->db->select('*');
        $this->db->from('tourist_area');
        $this->db->where('status', 1);
        $this->db->where('type', 2);
        $query = $this->db->get();
        $result = $query->result();
        return $result;
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
    function addCountry2DB($itemInfo, $id)
    {
        if ($id == '')
            $this->db->where('country', $itemInfo['country']);
        else
            $this->db->where('id', $id);
        $this->db->from('tbl_foreign');
        $query = $this->db->get();
        $result = $query->row();
        if (count($result) > 0) {
            $this->updateCountry2DB($itemInfo, $result->id);
            $insert_id = $result->id;
        } else {
            $this->db->trans_start();
            $this->db->insert('tbl_foreign', $itemInfo);
            $insert_id = $this->db->insert_id();
            $this->db->trans_complete();
        }
        return $insert_id;
    }

    /*
     * This function is used to update the area information
     * @param array $areaInfo : This is users updated information
     * @param number $areaId : This is area id
     */
    function updateCountry2DB($itemInfo, $id)
    {
        $this->db->where('id', $id);
        $this->db->update('tbl_foreign', $itemInfo);
        return TRUE;
    }

    /**
     * This function is used to delete the user information
     * @param number $userId : This is user id
     * @return boolean $result : TRUE / FALSE
     */
    function deleteCountry($id)
    {
        $this->db->where('id', $id);
        $this->db->delete('tbl_foreign');
        return TRUE;
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

