<?php
$db = mysql_connect("localhost", "root", "boss8055") or die("Could not connect.");
//$db = mysql_connect("10.60.1.143", "devteam", "Boss@8055") or die("Could not connect.");
        if(!$db) 

	      die("no db");

        if(!mysql_select_db("ItInfrastructure",$db))

 	      die("No database selected.");
		  


   //$infradata = mysql_query("select 	CampusId,CampusName from ItInfrastructure");
   $cmpdata = mysql_query("select id,campus_name,inst_id from ItInfraCampusMaster");
   
   while($rcmpdata = mysql_fetch_array($cmpdata)){
   	  //$infradata = mysql_query("update ItInfrastructure set CampusName='".$rcmpdata['campus_name']."' where CampusId=".$rcmpdata['id']);
      $infradata = mysql_query("update ItInfrastructure set InstId=".$rcmpdata['inst_id']." where CampusId=".$rcmpdata['id']);
   }
   
  echo "success";
   
   


?>





