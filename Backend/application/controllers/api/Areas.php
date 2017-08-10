<?php defined('BASEPATH') OR exit('No direct script access allowed');

require_once('./application/libraries/REST_Controller.php');

/**
 * Tourist Area API controller
 *
 * Validation is missign
 */
class Areas extends REST_Controller {

    public function __construct()
    {
        parent::__construct();

        $this->load->model('area_model');
    }

    public function index_get()
    {
        $this->response($this->area_model->get_all());
    }

    public function edit_get($id = NULL)
    {
        if ( ! $id)
        {
            $this->response(array('status' => false, 'error_message' => 'No ID was provided.'), 400);
        }

        $this->response($this->area_model->get($id));
    }

    public function save_post($id = NULL)
    {
        if ( ! $id)
        {
            $new_id = $this->area_model->addNewArea($this->post());
            $this->response(array('status' => true, 'id' => $new_id, 'message' => sprintf('Area #%d has been created.', $new_id)), 200);
        }
        else
        {
            $this->area_model->update($this->post(), $id);
            $this->response(array('status' => true, 'message' => sprintf('Area #%d has been updated.', $id)), 200);
        }
    }

    public function remove_post($id = NULL)
    {
        if ($this->area_model->delete($id))
        {
            $this->response(array('status' => true, 'message' => sprintf('Area #%d has been deleted.', $id)), 200);
        }
        else
        {
            $this->response(array('status' => false, 'error_message' => 'This Area does not exist!'), 404);
        }
    }

    public function upload_post($id = NULL)
    {

        $error = false;
        $files = array();
        $uploaddir = 'uploads/';
        foreach($_FILES as $file)
        {
            if(move_uploaded_file($file['tmp_name'], $uploaddir .basename($file['name'])))
            {
                $files[] = $file['name'];
            }
            else
            {
                $error = true;
            }
            break;
        }
        if (!$error)
        {
            $this->response(array('status' => true, 'file' => $files[0]), 200);
        }
        else
        {
            $this->response(array('status' => false, 'error_message' => 'There was an error uploading your files!'), 404);
        }
    }

}

/* End of file Areas.php */
/* Location: ./application/controllers/api/Areas.php */