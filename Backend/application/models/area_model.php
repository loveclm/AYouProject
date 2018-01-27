<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class area_model extends CI_Model
{
    /**
     * This function is used to get all Tourist Area
     * @return array $result : This is result
     */
    function getAreas($name = '', $address = 'all', $status = 0)
    {
        $this->db->select('*');
        if ($address != 'all') {
            $addrs = explode("_", $address);
            if (count($addrs) > 1) {
                $this->db->where("address_1 LIKE '%" . $addrs[1] . "%'");
            }
            if (count($addrs) > 0) {
                $this->db->where("address LIKE '%" . $addrs[0] . "%'");
            }
        }
        $this->db->from('tourist_area');
        if ($name != 'all') {
            $likeCriteria = "(name  LIKE '%" . $name . "%')";
            $this->db->where($likeCriteria);
        }
        if ($status == 1) { // if area is available
            $this->db->where('status', 1);
        } elseif ($status == 2) { // if area is disable
            $this->db->where('status', 0);
        }
        $this->db->where('type', 2); //  2-area
        $query = $this->db->get();

        $result = $query->result();
        return $result;
    }

    /**
     * This function is used to get all Tourist Area
     * @return array $result : This is result
     */
    function findAreas($name = '')
    {
        $this->db->select('*');
        $this->db->from('tourist_area');
        if ($name != '') {
            $likeCriteria = "(name  LIKE '%" . $name . "%')";
            $this->db->where($likeCriteria);
        }
        $this->db->where('type', 2); //2-area
        //$this->db->where('isforeign', 1); //1-inside
        $query = $this->db->get();

        $result = $query->result();
        return $result;
    }

    /**
     * This function is used to get all Tourist Area
     * @return array $result : This is result
     */
    function get_all($type = 2)
    {
        $this->db->select('*');
        $this->db->from('tourist_area');

        $this->db->where('type', $type);  // 2-area
        $query = $this->db->get();

        $result = $query->result();
        return $result;
    }

    /**
     * This function is used to get all Tourist Area
     * @return array $result : This is result
     */
    function getCourses($name = '', $status = 0)
    {
        $this->db->select('*');
        $this->db->from('tourist_area');
        if ($name != 'all') {
            $likeCriteria = "(name  LIKE '%" . $name . "%')";
            $this->db->where($likeCriteria);
        }
        if ($status == 1) { // if course is available
            $this->db->where('status', 1);
        } elseif ($status == 2) { // if course is disable
            $this->db->where('status', 0);
        }
        $this->db->where('type', 1); //1-course
        $query = $this->db->get();
        $qresult = $query->result();
        if (count($qresult) > 0) {
            $i = 0;
            foreach ($qresult as $item) {
                $newCourseItem = $item;
                $areaItems = json_decode($item->point_list);
                $newareaItems = array();
                if (count($areaItems) > 0) {
                    foreach ($areaItems as $area) {
                        $newarea = $area;
                        $areaData = $this->getAreaById($area->id);
                        if (count($areaData) > 0) {
                            $newarea->name = $areaData->name;
                            array_push($newareaItems, $newarea);
                        }
                    }
                }
                $newCourseItem->point_list = json_encode($newareaItems);
                $newCourses[$i] = $newCourseItem;
                $i++;
            }
        }
        if (isset($newCourses))
            return $newCourses;
        else
            return NULL;
    }

    /**
     * This function is used to get Tourist Area by id
     * @return array $result : This is result
     */
    function getCourseNameByAreaId($id)
    {
        $courseName = '';
        $areaInfo = $this->getAreaById($id);
        if (isset($areaInfo)) {
            if ($areaInfo->type == '1') {  // if xianlu, make name.
                $areas = json_decode($areaInfo->point_list);
                foreach ($areas as $areaItem) {
                    if ($courseName == '') $courseName = $areaItem->name;
                    else $courseName = $courseName . ' - ' . $areaItem->name;
                }
            } else {  // if jingqu, make name.
                $courseName = $areaInfo->name;
            }
        }
        return $courseName;
    }

    /**
     * This function is used to get Tourist Area by id
     * @return array $result : This is result
     */
    function getAreaStatusByCourseId($id, $status = '')
    {
        $courseInfo = $this->getAreaById($id);
        if (isset($courseInfo)) {
            if ($courseInfo->type == '1') {  // if xianlu, check child status
                $areas = json_decode($courseInfo->point_list);
                foreach ($areas as $item) {
                    $area = $this->getAreaById($item->id);
                    if ($area->status == $status) {
                        return FALSE;
                    }
                }
            }
        }
        return TRUE;
    }

    /**
     * This function is used to get Tourist Area by id
     * @return array $result : This is result
     */
    function getParentCourseByAreaId($id, $status = '')
    {
        $result = FALSE;
        $courses = $this->get_all(1);
        if (count($courses) == 0) return $result;
        foreach ($courses as $item) {
            $course_info = json_decode($item->point_list);
            if (count($course_info) == 0) continue;
            if ($status != '' && $item->status != $status) continue;
            foreach ($course_info as $areainfo) {
                if ($areainfo->id == $id) {
                    $result = TRUE;
                }
            }
        }
        return $result;
    }

    /**
     * This function is used to get Tourist Area by id
     * @return array $result : This is result
     */
    function getAllParentCoursesFromAreaId($areaItems, $addr2 = '')
    {
        $result = array();
        $courses = $this->get_all(1);
        if (count($courses) == 0) return $result;
        foreach ($courses as $item) {
            $course_info = json_decode($item->point_list);
            if (count($course_info) == 0) continue;
            foreach ($course_info as $areainfo) {
//                $areaItem = $this->getAreaById($areainfo->id);
//                if( $addr2!='' && $item->address_1!=$addr2) continue;
//                var_dump($item->name . ',' . $areainfo->name);
                $isExist=0;
                foreach($areaItems as $area) {
                    if ($areainfo->id == $area->id) {
                        array_push($result, $item);
                        $isExist=1;
                        break;
                    }
                }
                if($isExist==1) break;
            }
        }
        return $result;
    }

    /**
     * This function is used to get all Tourist Area
     * @return array $result : This is result
     */
    function getMenuList($searchTxt, $isEnabled = 1, $isForeign = 0)
    {
        $this->db->select('id, name, address, address_1, isforeign');
        $this->db->from('tourist_area');
        $this->db->where('type', 2); // areas
        if ($isForeign != 0)
            $this->db->where('isforeign', $isForeign);
        if ($isEnabled != 0)
            $this->db->where('status', $isEnabled);
        $this->db->order_by('isforeign');
        $this->db->order_by('address');
        $this->db->order_by('address_1');
        $this->db->order_by('name');
        $query = $this->db->get();
        $result1 = $query->result();

        return $result1;
    }

    function getMapTypeFromAddress($address)
    {
        $this->db->from('tourist_area');
        if ($address != '') $this->db->where('address_1', $address);
        $query = $this->db->get();
        $result = $query->result();
        if (count($result) == 0) return '';
        if ($result[0]->isforeign == 1) return '中国';
        else return $result[0]->address;
    }

    /**
     * This function is used to get all Tourist Area
     * @return array $result : This is result
     */
    function getObjectsByText($type, $searchTxt = '') //1-hot course, 2-hot area
    {
        $this->db->from('tbl_addr');
        $query = $this->db->get();
        $result1 = $query->row();
        $ret_data = array();
        $keywd = explode(',', $searchTxt);
        $addr1 = '';
        $addr2 = '';
        $name = '';
        switch (count($keywd)) {
            case 1:
                $addr1 = $keywd[0];
                $addr2 = $keywd[0];
                $name = $keywd[0];
                break;
            case 2:
                $addr1 = $keywd[0];
                $addr2 = $keywd[0];
                $name = $keywd[1];
                break;
            case 3:
                $addr1 = $keywd[0];
                $addr2 = $keywd[1];
                $name = $keywd[2];
                break;
            default:
                break;
        }
        if ($type == 1 || $type == 2) {
            $hot_name = $addr2;
            $this->db->select('*');
            $this->db->from('tourist_area');
            $this->db->where('type', $type);
            $this->db->where('status', 1);
            if ($name != '' || $addr1 != '' || $addr2 != '') $str = "( FALSE ";
            if ($name != '') $str .= " or ( name like '%" . $name . "%' ) ";
            if ($addr1 != '') $str .= " or ( address like '%" . $addr1 . "%' ) ";
            if ($addr2 != '') $str .= " or ( address_1 like '%" . $addr2 . "%' ) ";
            if ($name != '' || $addr1 != '' || $addr2 != '') {
                $str .= " )";
                $this->db->where($str);
            }
            $this->db->order_by('isforeign');
            $this->db->order_by('address');
            $this->db->order_by('address_1');
            $this->db->order_by('name');
            //var_dump($str);
            $query = $this->db->get();
            $result2 = $query->result();
            if (count($result2) == 0)
                return array('hot_name' => $hot_name, 'hot_type' => $type, 'data' => $ret_data);
            foreach ($result2 as $item) {
                $course_name = $this->getCourseNameByAreaId($item->id);
                $itemInfo = json_decode($item->info);
                $thumb = (($type == '2') ?
                    (isset($itemInfo->thumbnail) ? $itemInfo->thumbnail : '') :
                    (isset($itemInfo->overay) ? $itemInfo->overay : ''));
                array_push(
                    $ret_data,
                    array(
                        'id' => $item->id,
                        'title' => $item->name,
                        'name' => $course_name,
                        'phone' => (isset(json_decode($item->info)->phone)?(json_decode($item->info)->phone):''),
                        'image' => base_url() . 'uploads/' . $thumb,
                        'overlay' => base_url() . 'uploads/' . json_decode($item->info)->overay,
                        'cost' => $item->price,
                        'discount_rate' => $item->discount_rate,
                        'origin_price' => $item->price,
                        'map_type' => (intval($item->isforeign) - 1),
                    )
                );
            }
            //var_dump($result2);
            //var_dump($ret_data);
        } else {
            $hot_name = ($name == '') ? $addr2 : $name;
            $areaItems = $this->getAreaBySimilarName($addr1, $addr2, $name);
            //var_dump($areaItems);
            if (count($areaItems) == 0)
                return array('hot_name' => $hot_name, 'hot_type' => $type, 'data' => $ret_data);
            $result2 = $this->get_all(1);
            //if (count($result2) == 0) return array();
            foreach ($result2 as $item) { // course item
                $isExist = 0;
                $co_arItems = json_decode($item->point_list);
                foreach ($co_arItems as $c_aitem) {
                    foreach ($areaItems as $aitem) {
                        if ($c_aitem->id == $aitem->id) {
                            $isExist = 1;
                            break;
                        }
                    }
                    if ($isExist == 1) break;
                }
                if ($isExist == 0) continue;
                array_push(
                    $ret_data,
                    array(
                        'id' => $item->id,
                        'title' => $item->name,
                        'name' => $this->getCourseNameByAreaId($item->id),
                        'phone' => (isset(json_decode($item->info)->phone)?(json_decode($item->info)->phone):''),
                        'image' => base_url() . 'uploads/' . (json_decode($item->info)->overay),
                        'cost' => $item->price,
                        'discount_rate' => $item->discount_rate,
                        'origin_price' => $item->price,
                        'map_type' => (intval($item->isforeign) - 1),
                    )
                );
            }
        }

        return array('hot_name' => $hot_name, 'hot_type' => $type, 'data' => $ret_data);
    }

    /**
     * This function is used to get all Tourist Area
     * @return array $result : This is result
     */

    function getHotObjectList($type, $searchTxt = '') //1-hot course, 2-hot area
    {
        $this->db->from('tbl_addr');
        $query = $this->db->get();
        $result1 = $query->row();
        $ret_data = array();
        if ($type == 0) {
            array_push(
                $ret_data,
                array(
                    'hot_area_city' => ($this->getMapTypeFromAddress($result1->hot_area) . '-' . $result1->hot_area),
                    'hot_course_city' => ($this->getMapTypeFromAddress($result1->hot_course) . '-' . $result1->hot_course),
                    'hot_course_area' => ($result1->hot_area_course),
                )
            );
            return $ret_data;
        }
        $keywd = explode('·', $searchTxt);
        $addr1 = '';
        $addr2 = '';
        $name = '';
        if ($searchTxt == '') {
            if ($type == 1) {
                $addr2 = $result1->hot_course;
            } else if ($type == 2) {
                $addr2 = $result1->hot_area;
            } else {
                $name = $result1->hot_area_course;
            }
        } else {
            switch (count($keywd)) {
                case 1:
                    $addr2 = $keywd[0];
                    break;
                case 2:
                    if ($type == 2) {
                        $addr1 = $keywd[0];
                        $addr2 = $keywd[1];
                    } else {
                        $addr1 = $keywd[0];
                        $addr2 = $keywd[1];
                    }
                    break;
                case 3:
                    $addr1 = $keywd[0];
                    $addr2 = $keywd[1];
                    $name = $keywd[2];
                    break;
                default:
                    break;
            }
        }
        if ($type == 1 || $type == 2) {
            $hot_name = $addr2;
            $this->db->select('*');
            $this->db->from('tourist_area');
            $this->db->where('type', $type);
            $this->db->where('status', 1);
            if ($addr1 != '中国' && $addr1 != '') $this->db->where("address", $addr1);
            if ($addr2 != '') $this->db->where("address_1", $addr2);
            if ($name != '') $this->db->where("name", $name);
            $this->db->order_by('isforeign');
            $this->db->order_by('address');
            $this->db->order_by('address_1');
            $this->db->order_by('name');
            $query = $this->db->get();
            $result2 = $query->result();
            //var_dump($result2);
            if (count($result2) == 0)
                return array('hot_name' => $hot_name, 'hot_type' => $type, 'data' => $ret_data);
            foreach ($result2 as $item) {
                $course_name = $this->getCourseNameByAreaId($item->id);
                $thumb = (($type == 2) ? (json_decode($item->info)->thumbnail) : (json_decode($item->info)->overay));
                array_push(
                    $ret_data,
                    array(
                        'id' => $item->id,
                        'title' => $item->name,
                        'name' => $course_name,
                        'phone' => (isset(json_decode($item->info)->phone)?(json_decode($item->info)->phone):''),
                        'image' => base_url() . 'uploads/' . $thumb,
                        'overlay' => base_url() . 'uploads/' . json_decode($item->info)->overay,
                        'cost' => $item->price,
                        'discount_rate' => $item->discount_rate,
                        'origin_price' => $item->price,
                        'map_type' => (intval($item->isforeign) - 1),
                    )
                );
            }
            //var_dump($result2);
//            var_dump($ret_data);
        } else {
            $hot_name = ($name == '') ? $addr2 : $name;
            $areaItems = $this->getAreaByName($addr1, $addr2, $name);
            if (count($areaItems) == 0)
                return array('hot_name' => $hot_name, 'hot_type' => $type, 'data' => $ret_data);
            $result2 = $this->getAllParentCoursesFromAreaId($areaItems, $addr2);
            //if (count($result2) == 0) return array();
            foreach ($result2 as $item) {
                array_push(
                    $ret_data,
                    array(
                        'id' => $item->id,
                        'title' => $item->name,
                        'name' => $this->getCourseNameByAreaId($item->id),
                        'phone' => (isset(json_decode($item->info)->phone)?(json_decode($item->info)->phone):''),
                        'image' => base_url() . 'uploads/' . (json_decode($item->info)->overay),
                        'cost' => $item->price,
                        'discount_rate' => $item->discount_rate,
                        'origin_price' => $item->price,
                        'map_type' => (intval($item->isforeign) - 1),
                    )
                );
            }
        }

        return array('hot_name' => $hot_name, 'hot_type' => $type, 'data' => $ret_data);
    }

    function calculateCoursePrice($areaid = 0, $areatype = 0)
    {
        // get my selected price
        $price = 0;
        $areaItem = $this->getAreaById($areaid);
        $type = $areaItem->type;
        if ($type == 1) {// course
            $areaInfos = json_decode($areaItem->point_list);

            foreach ($areaInfos as $item) {
                $areaInfo = $this->getAreaById($item->id);
                //if ($this->getBuyStatusById($item->id, 1, $phone) == 1) {
                //$price += floatval($areaInfo->price) * floatval($areaItem->discount_rate);
                $price += $this->calculateCoursePrice($item->id);
                //}
            }
        } else if ($type == 2) { // area
            $pointInfos = json_decode($areaItem->point_list);
            foreach ($pointInfos as $item) {
                    if ($item->trial != 1) $price += floatval($item->price);
                    //  var_dump($price);a
            }
        }
        return $price;
        // get real rest price
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
        if (count($result))
            return $result[0];
        else
            return NULL;
    }


    /**
     * This function is used to get Tourist Area by id
     * @return array $result : This is result
     */
    function getAreaByName($addr1, $addr2, $name)
    {
        $this->db->select('id');
        $this->db->from('tourist_area');
        $this->db->where('status', 1);
        $this->db->where('type', 2);
        //if ($addr1 != '') $this->db->where("address", $addr1);
        if ($addr2 != '') $this->db->where("address_1", $addr2);
        if ($name != '') $this->db->where("name", $name);
        $query = $this->db->get();
        $result = $query->result();
        if (count($result) > 0)
            return $result;
        else
            return NULL;
    }

    /**
     * This function is used to get Tourist Area by id
     * @return array $result : This is result
     */
    function getAreaBySimilarName($addr1, $addr2, $name)
    {
        $this->db->select('*');
        $this->db->from('tourist_area');
        $this->db->where('status', 1);
        $this->db->where('type', 2);
        if ($name != '' || $addr1 != '' || $addr2 != '') $str = "( FALSE ";
        if ($name != '') $str .= " or ( name like '%" . $name . "%' ) ";
        if ($addr1 != '') $str .= " or ( address like '%" . $addr1 . "%' ) ";
        if ($addr2 != '') $str .= " or ( address_1 like '%" . $addr2 . "%' ) ";
        if ($name != '' || $addr1 != '' || $addr2 != '') {
            $str .= " )";
            $this->db->where($str);
        }
        $this->db->order_by('isforeign');
        $this->db->order_by('address');
        $this->db->order_by('address_1');
        $this->db->order_by('name');
        $query = $this->db->get();
        $result = $query->result();
        if (count($result) > 0)
            return $result;
        else
            return NULL;
    }

    /**
     * This function is used to get Tourist Area by id
     * @return array $result : This is result
     */
    function getAreaByAuthId($authid)
    {
        $this->db->select('*');
        $this->db->from('tbl_authcode as au');
        $this->db->join('tourist_area as ta', 'au.targetid = ta.id');
        $this->db->where('au.id', $authid);
        $query = $this->db->get();
        $result = $query->result();
        if (count($result))
            return $result[0];
        else
            return NULL;
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
     * This function is used to add new area to system
     * @return number $insert_id : This is last inserted id
     */
    function addAttraction($pointInfo)
    {
        $this->db->trans_start();
        $this->db->insert('tourist_area', $pointInfo);

        $insert_id = $this->db->insert_id();

        $this->db->trans_complete();

        return $insert_id;
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


/* End of file area_model.php */
/* Location: .application/models/area_model.php */

