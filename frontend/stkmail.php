
<?php
		    header('Access-Control-Allow-Origin: *');
			header("Access-Control-Allow-Credentials: true");
			header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
			header('Access-Control-Max-Age: 1000');
			header('Access-Control-Allow-Headers: Content-Type, Content-Range, Content-Disposition, Content-Description');
			
			
		  
		  
		  
		  $strJsonFileContents = file_get_contents("php://input");
		  
		  $resultarray = json_decode($strJsonFileContents,true); // show contents
		  
		 
		//print_r($resultarray); exit;
		$sendermail = $resultarray[0]['useremail'];
		
		$result = '<table  border="1" cellpadding="3" style="line-height:20px; margin-bottom:10px; border-collapse: collapse;" cellspacing="0" width="100%"><thead>
		<tr style="background-color:#1E88E5; color:#ffffff;">
			<td colspan="5">
				<h2 style="padding:8px; margin:0;">'.$resultarray[0]['campusname'].'</h2>
			</td>
		</tr>
											  <tr>
												<th>#</th>
												<th>Item Group</th>
												<th>Item Name</th>
												<th>Quantity</th>
											  </tr>
											</thead>';
		for($i=0; $i<count($resultarray); $i++){
		$myi=$i+1;
		$result .= '<tbody><tr>';
		$result .= '<td>'.$myi.'</td>
					
					<td>'.$resultarray[$i]['itemgroup'].'</td>
					<td>'.$resultarray[$i]['itemname'].'</td>
					<td>'.$resultarray[$i]['quantity'].'</td>';
		$result .= '</tr></tbody>';			
		}
        $result .= '</table>';         
          //  print_r($result);   
		  
		  
		    require 'phpmailer/PHPMailerAutoload.php';
             
					 $mail = new PHPMailer;

                    $mail->isSMTP();

                    $mail->Host = 'smtp.gmail.com';

                    $mail->Port = 587;

                    $mail->SMTPSecure = 'tls';

                    $mail->SMTPAuth = true;

                    $mail->Username = 'website@aditya.ac.in';

                    $mail->Password = 'Intel@8055';

                    $mail->setFrom('website@aditya.ac.in', 'IT Infrastructure');

                    $mail->addReplyTo('website@aditya.ac.in');

                    $mail->addAddress('$sendermail');

                    $mail->Subject = 'Item has been dispatched from the It division';
					
					 //$mail->AddAttachment($target);// $path: is your file path which you want to attach like $path = "reload.png";
					
                    $mail->msgHTML($result);
  
  	
		 if($mail->send()){
			
		echo "success";
	
	}
		  
		  
		  
		  
        ?>
		

