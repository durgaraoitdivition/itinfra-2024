<?php
$con = mysqli_connect("10.60.1.25", "devteam", "Boss@8055","itinfra") or die("Could not connect.");


$getattend = mysqli_query($con,"select ItInfraItemDetailsId, ItInfrastructure.itInfraid,ItInfraItems.itItemName, itItemGrpid, ItInfrastructure.itItemGroup,ItInfraItemDetails.itItemId, InstId, CampusName, itItemLocation, itItemSubLocation, itInfraItemSerialNo, userId,ItInfraItemDetails.createdAt, ItInfraItemDetails.updatedAt,itInfraItemSimpleSpec,itInfraItemDetailedSpec from ItInfraItemDetails,ItInfraItems,ItInfraItemGroup,ItInfrastructure  where ItInfraItemDetails.itItemId =ItInfraItems.itItemId and ItInfraItemGroup.itItemGrpName=ItInfraItems.itItemGroup and ItInfrastructure.itInfraid=ItInfraItemDetails.itInfraid and ItInfraItemDetails.itItemId>0 and itemSatus=1 order by ItInfraItemDetails.itItemId asc");

while($getattendlist = mysqli_fetch_array($getattend))
 {
  
  
  $manage = json_decode($getattendlist['itInfraItemSimpleSpec'], true);
  
  //print_r($getattendlist['itInfraItemDetailedSpec']);exit;
  
  $simpleconfig = $getattendlist['itInfraItemSimpleSpec'];
  $simpleconfig = json_encode($simpleconfig);
  
 $fullconfig = $getattendlist['itInfraItemDetailedSpec'];
 //echo  $fullconfig = json_encode($fullconfig);exit;
  
 
  
  
  
  $conc = mysqli_query($con,"insert ignore into Assets (unoNumber,stockEntryNo,itemId,ItemName,ItemGroupId,ItemGroupName,brandName,modelNo,serialNo,macId,instituteid,campusName,assetLocationGroup,assetLocationName,assetStatus,assetTicketStatus,lastTicketNumber,purchaseFrom,purchaseDate,warrantyUpto,userId,createdAt,updatedAt,simpleConfig,fullConfig) values ('".$getattendlist['ItInfraItemDetailsId']."','".$getattendlist['itInfraid']."','".$getattendlist['itItemId']."','".$getattendlist['itItemName']."','".$getattendlist['itItemGrpid']."','".$getattendlist['itItemGroup']."','".$manage['cpu']['brand']."','".$manage['cpu']['model']."','".$getattendlist['itInfraItemSerialNo']."','".$manage['net'][0]['mac']."','".$getattendlist['InstId']."','".$getattendlist['CampusName']."','".$getattendlist['itItemLocation']."','".$getattendlist['itItemSubLocation']."',1,'','','','','','".$getattendlist['userId']."','".$getattendlist['createdAt']."','".$getattendlist['updatedAt']."','$simpleconfig','$fullconfig')");
   
 }


echo "completed";
?>