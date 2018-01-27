<?php
/**
 * Created by PhpStorm.
 * User: DEV-15
 * Date: 10/26/2017
 * Time: 1:14 PM
 */

$serverId = (isset($_POST['serverId'])) ? $_POST['serverId'] : "";

/**
 * Created by PhpStorm.
 * User: DEV-15
 * Date: 10/21/2017
 * Time: 11:48 AM
 */

require_once "jssdk.php";
$jssdk = new JSSDK("wxb042726847dca8d3", "70e43300732636e813e59f8b2199dfc9");
$signPackage = $jssdk->GetSignPackage($serverId);
exit(json_encode(['data' => $signPackage['audio_file']]));

?>