<?php 
include_once ('dbclass.php');
$mydb = new dbc();

$amount =$mydb->qry("select COUNT(*) AS ititemqty,  campusName, 	ItemName, 	ItemGroupName, 	 assetLocationGroup, 	assetLocationName, 	userId from Assets where campusName='".$_POST['campusname']."' GROUP BY  assetLocationGroup, 	assetLocationName");

$cmpinfo =$mydb->qry("select * from ItInfraCampusMaster where id=".$_POST['campusid']);

date_default_timezone_set('Asia/Kolkata');
$todate = date('d-m-Y');

//print_r($amount); exit;
 $n = rand(0,100000);
                   
  
  
  $file_to_attach = $_FILES['resumepath']['tmp_name'];
  $filename=$_FILES['resumepath']['name'];
  
  $myfile = explode(".",$filename);
  
  $target = "uploads/".$cmpinfo[0]['campus_name']."-".$n.".".$myfile[1];
 // echo $target; exit;
  if(empty($errors)==true){
         move_uploaded_file($file_to_attach,$target);
         //echo "Success";
      }else{
         print_r($errors);
      }
	  
$result='';
$result = '<table  width="100%" border="1" cellspacing="0" cellpadding="5" align="center" style="border:1px solid #000; border-collapse:collapse;">
	<thead>
		<tr style="background-color:#1E88E5; color:#ffffff;">
			<td colspan="5">
				<div style="float:left"><h2 style="margin:0">'.$cmpinfo[0]['campus_name'].'</h2> '.$cmpinfo[0]['campus_city'].', '.$cmpinfo[0]['campus_address'].'</div>
				<div style="float:right"><strong>Date :</strong> '.$todate.'</div>
			</td>
		</tr>
		<tr>
			<th>Location</th>
			<th>Sub Location</th>
			<th>Item Group</th>
			<th>Item Name</th>
			<th>Item Quntity</th>
		</tr>
	</thead>';
	


    // output data of each row
	$tmp=0;
    for($i=0;$i<count($amount);$i++) { 
			$tmp=$tmp+$amount[$i]['ititemqty'];
	$result .='
       <tbody>
		<tr>
			<td>'.$amount[$i]['assetLocationGroup'].'</td>
			<td>'.$amount[$i]['assetLocationName'].'</td>
			<td>'.$amount[$i]['ItemGroupName'].'</td>
			<td>'.$amount[$i]['ItemName'].'</td>
			<td align="right">'.$amount[$i]['ititemqty'].'</td>
		</tr>
		
	</tbody>';
   }
 
$result .='<tfoot><tr>
			<th colspan="4" align="right">Total Items</th>
			<th align="right">'.$tmp.'</th>
		</tr></tfoot></table>';

//echo $result; exit;

require 'phpmailer/PHPMailerAutoload.php';
             
					 $mail = new PHPMailer;

                    $mail->isSMTP();

                    $mail->Host = 'smtp.gmail.com';

                    $mail->Port = 587;

                    $mail->SMTPSecure = 'tls';

                    $mail->SMTPAuth = true;

                    $mail->Username = 'website@aditya.ac.in';

                    $mail->Password = 'Intel@8055';

                    $mail->setFrom('website@aditya.ac.in', 'Student WET Result');

                    $mail->addReplyTo('website@aditya.ac.in');

                    $mail->addAddress('itinfra@aditya.ac.in');

                    $mail->Subject = 'It Infra';
					
					$mail->AddAttachment($target);// $path: is your file path which you want to attach like $path = "reload.png";
					
                    $mail->msgHTML($result);
  
  	
		 if($mail->send()){
			
		header("Location: https://analysis.aditya.ac.in/itinfra/index.html");
	
	}

?>



         



