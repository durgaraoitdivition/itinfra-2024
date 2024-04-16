<?php
session_start();
include_once ('dbclass.php');
$mydb = new dbc();
$data = json_decode(file_get_contents("php://input"), true);


if($_GET['action']=="logindata"){
    
 
  $amount =$mydb->qry("select * from ItInfraUsers where userEmail='".$_GET["email"]."' and UserPwd='".$_GET["password"]."'");
  
 
  echo json_encode($amount);

 }

 



?>