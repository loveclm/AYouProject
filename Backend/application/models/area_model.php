<?php if(!defined('BASEPATH')) exit('No direct script access allowed');

class Area_model extends CI_Model
{
    /**
     * This function is used to get the user listing count
     * @param string $searchText : This is optional search text
     * @param number $page : This is pagination offset
     * @param number $segment : This is pagination limit
     * @return array $result : This is result
     */
    function areaListing($searchText = '', $page, $segment)
    {
        $this->db->select('BaseTbl.userId, BaseTbl.email, BaseTbl.name, BaseTbl.mobile, Role.role');
        $this->db->from('tbl_users as BaseTbl');
        $this->db->join('tbl_roles as Role', 'Role.roleId = BaseTbl.roleId','left');
        if(!empty($searchText)) {
            $likeCriteria = "(BaseTbl.email  LIKE '%".$searchText."%'
                            OR  BaseTbl.name  LIKE '%".$searchText."%'
                            OR  BaseTbl.mobile  LIKE '%".$searchText."%')";
            $this->db->where($likeCriteria);
        }
        $this->db->where('BaseTbl.isDeleted', 0);
        $this->db->where('BaseTbl.roleId !=', 1);
        $this->db->limit($page, $segment);
        $query = $this->db->get();

        $result = $query->result();
        return $result;
    }

    /**
     * This function is used to get all Tourist Area
     * @return array $result : This is result
     */
    function getAreas($name = '', $address = 'all', $status = 0)
    {
        $this->db->select('*');
        $this->db->from('tourist_area');
        if($name != 'all') {
            $likeCriteria = "(name  LIKE '%".$name."%')";
            $this->db->where($likeCriteria);
        }
        if($status == 1) {
            $this->db->where('status', 0);
        } elseif ($status == 2){
            $this->db->where('status', 1);
        }
        if($address != 'all') {
            $likeCriteria = "(address  LIKE '%".$address."%')";
            $this->db->where($likeCriteria);
        }

        $query = $this->db->get();

        $result = $query->result();
        return $result;
    }

    /**
     * This function is used to get Tourist Area by id
     * @return array $result : This is result
     */
    function getAreaById($id)
    {

        $this->db->select('*');
        $this->db->from('tourist_area');
        $this->db->where('id', $id);
        $query = $this->db->get();
        $result = $query->result();
        return $result;
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

    /**
     * This function used to get user information by id
     * @param number $userId : This is user id
     * @return array $result : This is user information
     */
    function getUserInfo($userId)
    {
        $this->db->select('userId, name, email, mobile, roleId');
        $this->db->from('tbl_users');
        $this->db->where('isDeleted', 0);
        $this->db->where('roleId !=', 1);
        $this->db->where('userId', $userId);
        $query = $this->db->get();

        return $query->result();
    }

    /**
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

