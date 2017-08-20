<?php defined('BASEPATH') OR exit('No direct script access allowed');
header('Access-Control-Allow-Origin: *');

require_once('./application/libraries/REST_Controller.php');

/**
 * Tourist Area API controller
 *
 * Validation is missign
 */
class Areas extends REST_Controller
{

    public function __construct()
    {
        parent::__construct();
        $this->load->model('area_model');
    }

    public function test_post()
    {
        $variable = $this->post();
        $variable = $variable['pos'];
        $this->response(array('status' => true, 'id' => $variable), 200);
        //$this->response($this->area_model->findAreas());
    }

    public function index_get()
    {
        $this->response($this->area_model->get_all());
        //$this->response($this->area_model->findAreas());
    }

    public function find_post($key = '')
    {
        $this->response($this->area_model->findAreas($key));
    }

    public function edit_post($id = NULL)
    {
        if (!$id) {
            $this->response(array('status' => false, 'error_message' => 'No ID was provided.'), 400);
        }

        $this->response($this->area_model->getAreaById($id));
    }

    public function save_post($id = NULL)
    {
        if (!$id) {
            $postdata = $this->post();
            $new_id = $this->area_model->addNewArea($postdata);

            $pointList = json_decode($postdata['point_list']);

            foreach ($pointList as $point) {
                $pointInfo = array(
                    'areaid' => $new_id,
                    'name' => $point->name,
                    'description' => $point->description,
                    'image' => $point->image,
                    'audio' => $point->audio,
                    'price' => $point->price,
                    'trial' => $point->trial,
                    'position' => $point->position
                );
                $this->area_model->addAttraction($pointInfo);
            }

            $this->response(array('status' => true, 'id' => $new_id, 'message' => sprintf('Area #%d has been created.', $new_id)), 200);
        } else {
            $this->area_model->update($this->post(), $id);
            $this->response(array('status' => true, 'message' => sprintf('Area #%d has been updated.', $id)), 200);
        }
    }

    public function remove_post($id = NULL)
    {
        if ($this->area_model->delete($id)) {
            $this->response(array('status' => true, 'message' => sprintf('Area #%d has been deleted.', $id)), 200);
        } else {
            $this->response(array('status' => false, 'error_message' => 'This Area does not exist!'), 404);
        }
    }

    public function upload_post($id = NULL)
    {

        $error = false;
        $files = array();
        $uploaddir = 'uploads/';
        foreach ($_FILES as $file) {
            if (move_uploaded_file($file['tmp_name'], $uploaddir . basename($file['name']))) {
                $files[] = $file['name'];
            } else {
                $error = true;
            }
            break;
        }
        if (!$error) {
            $this->response(array('status' => true, 'file' => $files[0]), 200);
        } else {
            $this->response(array('status' => false, 'error_message' => 'There was an error uploading your files!'), 404);
        }
    }

///////////////////////////////////////////////////////////
////////////////??????  External APIs
///////////////////////////////////////////////////////////

    public function getAreaIdByPosition_post()
    {
        $request = $this->post();
        $lng = $request['pos'][0];
        $lat = $request['pos'][1];
        $all_areas = $this->area_model->getAreas('', 'all', 0);
        $id = -1;
        if (count($all_areas) > 0) {
            foreach ($all_areas as $item) {
                $pos = json_decode($item->info);
                $pos = $pos->position;
                $lng1 = $pos[0][0];
                $lng2 = $pos[1][0];
                $lat1 = $pos[0][1];
                $lat2 = $pos[1][1];
                if ($lng < $lng1) continue;
                if ($lng > $lng2) continue;
                if ($lat < $lat1) continue;
                if ($lat > $lat2) continue;
                $id = $item->id;
                $name = $item->name;
                break;
            }
        }
        if ($id == -1) $this->response(array('status' => false, 'id' => $id), 200);
        else $this->response(array('status' => true, 'id' => $id, 'name' => $name), 200);
    }

    public function getAllCourseInfos_post()
    {
        $request = $this->post();
        $all_courses = $this->area_model->getCourses('all', 0);
        if (count($all_courses) == 0) {
            $this->response(array('status' => false, 'Courses' => '-1'), 200);
        } else {
            $i = 0;
            foreach ($all_courses as $item) {
                $all_areas = json_decode($item->info);
                $j = 0;
                $name = '';
                $areas = '';
                if (count($all_areas) > 0) {
                    foreach ($all_areas as $areaItem) {
                        $areaData = $this->area_model->getAreaById($areaItem->id);
                        $j++;
                        if ($j == 1) $name = $areaData->name;
                        else $name = $name . '-' . $areaData->name;
                        $areas[$j] = [
                            'id' => $j,
                            'name' => $areaData->name,
                            'attractionCnt' => count(json_decode($areaData->point_list))
                        ];
                    }
                }
                $i++;
                $course_list[$i] = [
                    'id' => $item->id,
                    'name' => $name,    //  $item->name || $name
                    'image' => base_url().'resource/image/palace.png',
                    'cost' => '150',
                    'discount_rate' => $item->discount_rate,
                    'scenic_areas' => $areas,
                ];
            }
            $this->response(array('status' => true, 'Courses' => $course_list), 200);
        }
    }

    public function getAllAreaInfos_post()
    {
        $request = $this->post();
        $all_areas = $this->area_model->getAreas('', 'all', 0);
        if (count($all_areas) == 0) {
            $this->response(array('status' => false, 'Areas' => '-1'), 200);
        } else {
            $i=0;
            foreach($all_areas as $item)
            {
                $i++;
                $areas[$i]=[
                    'id'=>$item->id,
                    'name'=>$item->name,
                ];
            }
            $this->response(array('status' => true, 'Areas' => $areas), 200);
        }
    }

    public function getMyAreaInfos_post()
    {
        $request = $this->post();
        $id = -1;
        if ($id == -1) $this->response(array('status' => false, 'MyAreas' => $id), 200);
        else $this->response(array('status' => true, 'MyAreas' => $id), 200);
    }

    public function getAreaInfoById_post()
    {
        $request = $this->post();
        $id = $request['id'];
        $phone = $request['phone'];
        $item = $this->area_model->getAreaById($id);
        if (count($item) == 0) {
            $this->response(array('status' => false, 'CurArea' => '-1'), 200);
        } else {
            $itemInfo = json_decode($item->info);
            $attractions = json_decode($item->point_list);
            $i = 0;
            if (count($attractions) > 0) {
                foreach ($attractions as $atts) {
                    $i++;
                    $attractionList[$i] = [
                        'id' => $i,
                        'name' => $atts->name,
                        'position' => $atts->position,
                        'cost' => $atts->price,
                        'discount_rate' => '0.8',
                        'buy_state' => '2',
                        'audio_files' => base_url().'uploads/'.$atts->audio,
                        'image' => base_url().'uploads/'.$atts->image
                    ];
                }
            }
            $scenic_area = [
                'id' => $item->id,
                'name' => $item->name,
                'position' => [($itemInfo->position[0][0] + $itemInfo->position[1][0]) / 2,
                    ($itemInfo->position[0][1] + $itemInfo->position[1][1]) / 2],
                'top_right' => ($itemInfo->position[1]),
                'bottom_left' => ($itemInfo->position[0]),
                'overlay' => (base_url().'uploads/'.$itemInfo->overay),
                'image' => (base_url().'uploads'.$itemInfo->overay),
                'zoom' => '2',
                'cost' => '100',
                'discount_rate' => $item->discount_rate,
                'attractionCnt' => count($attractionList),
                'attractions' => $attractionList
            ];
            $this->response(array('status' => true, 'CurArea' => $scenic_area), 200);
        }
    }


}

/* End of file Areas.php */
/* Location: ./application/controllers/api/Areas.php */