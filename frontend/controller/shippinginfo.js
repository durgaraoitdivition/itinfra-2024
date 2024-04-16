angular.module('stock').controller('shippinginfo',function($scope,$http,$filter, $cookies,$window,$route,$rootScope,apiurl, analysiapi){


			var apiurl = apiurl.getUrl();
			var analysis = analysiapi.getUrl();
			$scope.adshipid=$route.current.params.adshipid;
			
			// console.log($scope.userdata[0]);
			
			
			//var apiurl = "http://10.60.1.19:3000/api/";

			$scope.inwordshow = 0;
			$scope.CampusMaster = function(){
				$http.get(apiurl+"ItInfraCampusMasters").success(function(data){
							//console.log(data);
							$scope.campuslist = data;
						});	
				 }
			
			$scope.vendormaster = function(){
				$http.get(apiurl+"Vendordetails").success(function(data){
					//console.log(data);
					$scope.vendorslist = data;
				});	
			}
							 
			$scope.getcmplist = function(insid){
				$http.get(apiurl+"ItInfraCampusMasters?filter=%7B%22where%22%3A%7B%22instId%22%3A%22"+insid+"%22%7D%7D").success(function(data){
							//console.log(data);
							$scope.getcampuslist = data;
						});	
				 }
		 
			$scope.InstMaster = function(){
				$http.get(apiurl+"ItInfraInstMasters").success(function(data){
							//console.log(data);
							$scope.Instlist = data;
						});	
				 }
		 
			$scope.InfraItems = function(){
				$http.get(apiurl+"TicketMaster/itemsgroupby").success(function(data){
							//console.log(data);
							
							$scope.itemslist = data;
							
						});	
				 }
				 
			$scope.getitemname = function(itemgrp){
				$http.get(apiurl+"ItInfraItems?filter=%7B%22where%22%3A%7B%22ititemgroup%22%3A%22"+itemgrp+"%22%7D%7D").success(function(data){
							//console.log(data);
							$scope.totalitems = data;
						});	
		 
		 	}
			
			
			 $scope.sendshipsms = (obj) =>{
				// console.log(obj);
				$http.post(analysis+"sms/sendsms", obj).success(function(data){
					// console.log(data);
					return data;
				});	
			 } 
			
			$scope.sippeditems = [];
		//console.log($scope.employees);
		
		//console.log($scopefinalres.userdata);
		$scope.addItems = function (obj) {
			//Add the new item to the Array.
			$http.get(apiurl+"dbreports/LastShipId").success(function(data){
				// console.log(data);
				$scope.lastshipid = parseInt(data[0].ADSHPid);
				$http.get(apiurl+"ItInfraCampusMasters?filter=%7B%22where%22%3A%7B%22campusName%22%3A%22"+obj.campusname+"%22%7D%7D").success(function(cinfo){
					// console.log(cinfo);
					$scope.todetail = cinfo;
					$http.get(apiurl+"dbreports/UserInfobyCPid?CampusId="+cinfo[0].id).success(function(userinfo){
						console.log(userinfo);
						$scope.tonumber = userinfo.filter(e=>e.UserType==2);
						var additem = {
							/*SNo: $scope.sippeditems.length+1,*/
							shipid : 0,
							neworold : obj.neworold,
							adshpid : $scope.lastshipid+1,
							campusid : cinfo[0].id,
							instid : obj.instid,
							campusname : obj.campusname,
							itemgroup : obj.ititemgroup,
							itemname : obj.ititemname,
							quantity : obj.qunatityNo,
							senderCampusId : $scope.defaultid,
							senderid : $scope.userdata[0].userid,
							SenderName: $scope.allotedcmp[0].campusName,
							ReceiverId : userinfo[0].userId,
							useremail : userinfo[0].userEmail,
							userphone : userinfo[0].userPhone,
							currentdate : new Date(),
							receiveddate : null
						};
						$scope.sippeditems.push(additem);
						$scope.it.qunatityNo = 0;
						$scope.it.ititemgroup = '';
						$scope.it.ititemname = '';
						//console.log($scope.sippeditems);
					});	
				});
			});
		}

		$scope.removeRow = function (index) {
			//Find the record using Index from Array.
			var name = $scope.sippeditems[index].itemname;
			if ($window.confirm("Do you want to delete: " + name)) {
				//Remove the item from Array using Index.
				$scope.sippeditems.splice(index, 1);
			}
		}
		
		$scope.itemssubmit = function(itm,crf){
			console.log(itm);
			///itm.forEach(function(v){ delete v.SNo });campusName
			
			for(var i=0; i<itm.length; i++){
				itm[i].couriername =  crf.couriername;
				itm[i].crrefno =  crf.crrefno;
				itm[i].shipmentmsg = crf.infomsg;
			}
			
			
			
			$http.post(apiurl+"ItInfraShipments",itm).success(function(data){
						
				// $http.post("stkmail.php",itm).success(function(data){
				// 	console.log(data);	
					
				// });
				// window.location.href = "index.html#/trackshipment"
				$scope.tonumber = $scope.tonumber.filter(e=>e.UserType==2)
				// var userPhones = $scope.tonumber.map(entry => entry.userPhone);
				// var userPhonesStr = userPhones.join(',');
				// if($scope.todetail[0].campusPhone!=null){
				// 	userPhonesStr = userPhonesStr+','+$scope.todetail[0].campusPhone
				// }
				let userPhonesStr = $scope.todetail[0].campusPhone.replace(/\s/g, '')
				$http.get(apiurl+"ItInfraCampusMasters?filter=%7B%22where%22%3A%7B%22id%22%3A%22"+$scope.userdata[0].campusid+"%22%7D%7D").success(function(frominfo){
					if(crf.couriername=='Our Staff'){
						var crnewname = crf.couriername+' '+crf.crrefno
					} else {
						var crnewname = crf.couriername;
					}
				let smsobj  = {
					"mobile": userPhonesStr,
					"senderid": "ADIACY",
					"message": "Your computer indent No:"+itm[0].adshpid+" Shipped to "+$scope.todetail[0].campusName+" through "+crnewname+" - from "+frominfo[0].campusName+" -ADITYA."
					// "message": "The Parcel Shipped to "+$scope.todetail[0].campusName+" with Track No:"+itm[0].adshpid+" through "+crf.couriername+" from "+frominfo[0].campusName+"-ADITYA"
				}
				// console.log(smsobj)
				$scope.sendshipsms(smsobj);
				window.location.href = "index.html#/trackshipment"
				})
			});
			
		}
		$scope.printdiv = (branch, sendercmpid, shipid, couriername) =>{
			// console.log(sendercmpid);
			$http.get(apiurl+"ItInfraCampusMasters?filter=%7B%22where%22%3A%7B%22campusName%22%3A%22"+branch+"%22%7D%7D").success(function(cinfo){
				// console.log(cinfo);
				$scope.todetail = cinfo;
				$http.get(apiurl+"dbreports/UserInfobyCPid?CampusId="+cinfo[0].id).success(function(userinfo){
					//console.log(userinfo);
					$scope.tonumber = userinfo;
					$http.get(apiurl+"ItInfraShipments?filter=%7B%22where%22%3A%7B%22adshpid%22%3A%22"+shipid+"%22%7D%7D").success(function(data){
						// console.log(data);
							if(data.length>0){
								$http.get(apiurl+"ItInfraCampusMasters?filter=%7B%22where%22%3A%7B%22id%22%3A%22"+sendercmpid+"%22%7D%7D").success(function(frominfo){
									// console.log(frominfo);
									$scope.fromadress = frominfo;
									$scope.adidwiselist = data;	
									$scope.couriername = couriername;
									$scope.shipmentid = shipid;
									setTimeout(() => {
										window.print()
									}, 1000);
								});
								
								// window.print()	
							}
					});
				});	
			});
			
		}
		
		$scope.shippinglist = function(){
				$http.get(apiurl+"ItInfraShipments?filter=%7B%22where%22%3A%7B%22senderCampusId%22%3A%22"+$scope.userdata[0].campusid+"%22%7D%7D").success(function(data){
							console.log(data);
							$scope.shiplist = data;
							if($scope.userdata[0].username!='admin'){
								$scope.shiplist = $scope.shiplist.filter(e=>e.senderid==$scope.userdata[0].userid)
							}
							const resultArray = $scope.shiplist.map(item => ({
								itemgroup: item.itemgroup,
								itemname: item.itemname,
								quantity: item.quantity,
								adshpid : item.adshpid
							}));
							$scope.unqshipids = $filter('unique')($scope.shiplist,'adshpid');
							//console.log($scope.unqshipids);
							$scope.finalsplist = [];
							
							for(var x=0;x<$scope.unqshipids.length;x++){
								
								//console.log($scope.unqshipids[x]);
								var uniqcount=0;
								var branch = '';
								for(var i=0; i<$scope.shiplist.length; i++){
									//console.log($scope.shiplist[i].quantity);
									if($scope.unqshipids[x]==$scope.shiplist[i].adshpid){
										  uniqcount = uniqcount+$scope.shiplist[i].quantity;
										  CampusId = $scope.shiplist[i].campusid;
										  branch = $scope.shiplist[i].campusname;
										  senderCampusId = $scope.shiplist[i].senderCampusId;
										  crrefno = $scope.shiplist[i].crrefno;
										  curdate = $scope.shiplist[i].currentdate;
										  curname = $scope.shiplist[i].couriername;
										  status = $scope.shiplist[i].received;
										  items = resultArray.filter(e=>e.adshpid==$scope.shiplist[i].adshpid);
									}
									
								}
							
							 //  console.log(uniqcount,branch);
							   					
								$scope.finalsplist[x] = {
									"Branch": branch,
									"CampusId": CampusId,
									"senderCampusId" : senderCampusId,
									"Shipmentid": $scope.unqshipids[x],
									"Itemcount" : uniqcount,
									"CurPickId" : crrefno,
									"CurrentDate" : curdate,
									"CourierName" : curname,
									"Status" : status,
									items
								}
							
							}
							
							
					
							//console.log($scope.finalsplist);
							
						});	
			}
			
		$scope.cmpwiseshiplist = function(){
				$http.get(apiurl+"dbreports/getrcvitemsbyids?CampusId="+$scope.userdata[0].campusid).success(function(data){
							// console.log(data);
							$scope.cmpshiplist = data;
							const resultArray = data.map(item => ({
								itemgroup: item.itemgroup,
								itemname: item.itemname,
								quantity: item.quantity,
								adshpid : item.adshpid
							}));
							$scope.cmpunqshipids = $filter('unique')($scope.cmpshiplist,'ADSHPid');
							//console.log($scope.cmpunqshipids);
							$scope.finalarray = [];
							
							for(var x=0;x<$scope.cmpunqshipids.length;x++){
								
								//console.log($scope.unqshipids[x]);
								var cmpuniqcount=0;
								var nwbranch = '';
								for(var i=0; i<$scope.cmpshiplist.length; i++){
									//console.log($scope.shiplist[i].quantity);
									if($scope.cmpunqshipids[x]==$scope.cmpshiplist[i].ADSHPid){
										  cmpuniqcount = cmpuniqcount+$scope.cmpshiplist[i].Quantity;
										  nwbranch = $scope.cmpshiplist[i].CampusName;
										  CampusId = $scope.cmpshiplist[i].CampusId;
										  crrefno = $scope.cmpshiplist[i].crRefNo;
										  CourierName = $scope.cmpshiplist[i].CourierName
										  status = $scope.cmpshiplist[i].Received;
										  senderCampusId = $scope.cmpshiplist[i].senderCampusId
										  items = resultArray.filter(e=>e.adshpid==$scope.cmpshiplist[i].adshpid)
									}
									
								}
							
							 //console.log(status);
							   					
								$scope.finalarray[x] = {
									"Branch": nwbranch,
									"CampusId" : CampusId,
									"Shipmentid": $scope.cmpunqshipids[x],
									"Itemcount" : cmpuniqcount,
									"CourierName" : CourierName,
									"CurPickId" : crrefno,
									"Status" : status,
									"senderCampusId" : senderCampusId,
									items
								}
							
							}
							$timeout(function() {
								//$("#noCampaignData").hide();
								var rowCount = $("#outward tr").length;
								//console.log("Row count value is"+rowCount);
								if (rowCount >= 0) {
								  // console.log("Entered into Sorting");
								   $("#outward").dataTable({
										"bPaginate": true,
										"bLengthChange": true,
										"bFilter": true,
										"bSort": true,
										"bInfo": true,
										"bAutoWidth": true,
										"pageLength": 50
								   });
								}
							 }, 400)
			
							// console.log($scope.finalarray);
							
						});	
			}	
			
		$scope.shipmentsms = (order, curstatus) =>{
			$http.get(apiurl+"ItInfraCampusMasters?filter=%7B%22where%22%3A%7B%22id%22%3A%22"+order.CampusId+"%22%7D%7D").success(function(toinfo){
				
				$http.get(apiurl+"ItInfraCampusMasters?filter=%7B%22where%22%3A%7B%22id%22%3A%22"+order.senderCampusId+"%22%7D%7D").success(function(frominfo){
					if(curstatus=='In Transit'){
						var userPhonesStr = toinfo[0].campusPhone.replace(/\s/g, '');
					}
					if(curstatus=='Received'){
						var userPhonesStr = frominfo[0].campusPhone.replace(/\s/g, '');
					}
					if(order.CourierName=='Our Staff'){
						var crnewname = order.CourierName+' '+order.crrefno
					} else {
						var crnewname = order.CourierName;
					}
					let smsobj  = {
						"mobile": userPhonesStr,
						"senderid": "ADIACY",
						"message": "Your computer indent No:"+order.Shipmentid+" "+curstatus+" to "+toinfo[0].campusName+" through "+crnewname+" - from "+frominfo[0].campusName+" -ADITYA."
						//"message": "The Parcel "+curstatus+" to "+toinfo[0].campusName+" with Track No:"+order.Shipmentid+" through "+order.CourierName+" from "+frominfo[0].campusName+"-ADITYA"
					}
					// console.log(smsobj);
					$scope.sendshipsms(smsobj);
				});
			})
		}
		
		$scope.updatecrid = function(itemdata){
			// console.log(itemdata);
			//var obj = "adshipid="+adid+"&curshipid="+cuid;
			var obj = {"adshipid":itemdata.Shipmentid,"curshipid":itemdata.curid}
			//console.log(obj);
			$http.post(apiurl+"dbreports/UpdateCid",obj).success(function(data){
				//console.log('success');
				$scope.shipmentsms(itemdata, 'In Transit')
				location.reload();
			});
		}
		
		$scope.updatercvstatus = function(orderinfo){
			var obj = {"AdShipId":orderinfo.Shipmentid,"Received":1}
			//console.log(obj);
			$http.post(apiurl+"dbreports/UpdateRcvStatus",obj).success(function(data){
				//console.log('success');
				$scope.shipmentsms(orderinfo, 'Received')
				location.reload();
			});
		}
		
		$scope.adshipidWise = function(){
			$http.get(apiurl+"ItInfraShipments?filter=%7B%22where%22%3A%7B%22adshpid%22%3A%22"+$scope.adshipid+"%22%7D%7D").success(function(data){
					console.log(data);
					$scope.adidwiselist = data;		
			});
		}
		$scope.msg = '';
		$scope.addItem = function(itemdata){
			
			   itemdata.ititemid = 0;
			   $http.post(apiurl+"Itinfraitems", itemdata).success(function(data){
				   // console.log(data);
				   $scope.msg = "Item added successfully";
				   $scope.item.ititemgroup = '';
				   $scope.item.ititemname = '';
				   $scope.item.ititemcode = '';
				   $scope.item.assettype = '';
				//    $('addItItem').modal('toggle');
				   $scope.InfraItems();
				//    location.reload()
			   });
			
		}
	
			$scope.examdatechange = function(dt)
			   {
				$scope.newDate =new Date(dt);
				return $scope.newDate
			   }
 


 });
				

