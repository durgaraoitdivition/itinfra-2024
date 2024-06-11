angular.module('stock').controller('shippinginfo',function($scope,$http,$filter,$timeout, $cookies,$window,$route,$rootScope,apiurl, analysiapi, itnodeapi){


			var apiurl = apiurl.getUrl();
			var analysis = analysiapi.getUrl();
			var itinfra = itnodeapi.getUrl();
			$scope.adshipid=$route.current.params.adshipid;
			
			// console.log($scope.userdata[0]);
			
			
			//var apiurl = "http://10.60.1.19:3000/api/";
			$scope.currentDate = new Date()
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
			console.log(obj)
			var additem = {
				neworold : obj.neworold,
				// instid : obj.instid,
				// campusname : obj.campusname,
				itemgroup : obj.ititemgroup,
				itemname : obj.ititemname,
				quantity : obj.qunatityNo
			};
			$scope.sippeditems.push(additem);
			$scope.it.qunatityNo = 0;
			$scope.it.ititemgroup = '';
			$scope.it.ititemname = '';
			//console.log($scope.sippeditems);
		}

		$scope.removeRow = function (index) {
			//Find the record using Index from Array.
			var name = $scope.sippeditems[index].itemname;
			if ($window.confirm("Do you want to delete: " + name)) {
				//Remove the item from Array using Index.
				$scope.sippeditems.splice(index, 1);
			}
		}
		
		$scope.itemssubmit = function(itm,courier){
			// console.log($scope.it.campusid)
			var rcvcampusfilter = $scope.campusinfo.filter(e=>e.id==$scope.it.campusid);
			// console.log(rcvcampusfilter, rcvcampusfilter[0].campusName)
			if(rcvcampusfilter.length>0){
				$scope.userdata[0].campusName = $scope.campusinfo.filter(e=>e.id==$scope.userdata[0].campusid)[0].campusName
				var finalobj = {
					items:itm,
					sender : $scope.userdata,
					rcvcampusId : $scope.it.campusid,
					rcvcampusName:rcvcampusfilter[0].campusName,
					instId : $scope.it.instid,
					courier
				}
				console.log(finalobj)
				// $http.post(itinfra+"order/create", finalobj).success(function(data){
				// 	// console.log(data)
				// 	location.reload()
				// });
			}
			
		}
		$scope.backtotrack = () =>{
			location.reload()
		}
		$scope.printMode = false;
		$scope.printdiv = (branch, sendercmpid, shipid, couriername) =>{
			console.log(branch, sendercmpid, shipid, couriername)
			$scope.printMode = true;
			// console.log(sendercmpid);
			$http.get(apiurl+"ItInfraCampusMasters?filter=%7B%22where%22%3A%7B%22campusName%22%3A%22"+branch+"%22%7D%7D").success(function(cinfo){
				// console.log(cinfo);
				$scope.todetail = cinfo;
				$http.get(apiurl+"dbreports/UserInfobyCPid?CampusId="+cinfo[0].id).success(function(userinfo){
					console.log(userinfo);
					$scope.tonumber = userinfo.filter(e=>e.UserType==2);
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
		var dataTable;
		$scope.shippinglist = function(val, title){
				$scope.titleName = title;
				if (dataTable) {
					dataTable.DataTable().destroy();
				}
				if(title=='All'){
					var dataapi = apiurl+"Itinfrashipments?filter=%7B%22where%22%3A%7B%22senderCampusId%22%3A%22"+$scope.userdata[0].campusid+"%22%7D%7D";
				} else {
					var dataapi = apiurl+"Itinfrashipments?filter=%7B%22where%22%3A%7B%22senderCampusId%22%3A%22"+$scope.userdata[0].campusid+"%22%2C%20%22received%22%3A%22"+val+"%22%7D%7D";
				}
				$http.get(dataapi).success(function(data){
							// console.log(data);
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
										  senderCampus = $scope.shiplist[i].SenderName;
										  senderCampusId = $scope.shiplist[i].senderCampusId;
										  crrefno = $scope.shiplist[i].crrefno;
										  curdate = $scope.shiplist[i].currentdate;
										  curname = $scope.shiplist[i].couriername;
										  status = $scope.shiplist[i].received;
										  items = resultArray.filter(e=>e.adshpid==$scope.shiplist[i].adshpid);
										  recieverName = $scope.shiplist[i].recieverName
									}
									
								}
							
							 //  console.log(uniqcount,branch);
							   					
								$scope.finalsplist[x] = {
									"Branch": branch,
									"CampusId": CampusId,
									"senderCampusId" : senderCampusId,
									"senderCampus" : senderCampus,
									"Shipmentid": $scope.unqshipids[x],
									"Itemcount" : uniqcount,
									"CurPickId" : crrefno,
									"CurrentDate" : curdate,
									"CourierName" : curname,
									"Status" : status,
									items,
									recieverName
								}
							
							}
							$timeout(function() {
								//$("#noCampaignData").hide();
								var rowCount = $("#inoutdata tr").length;
								//console.log("Row count value is"+rowCount);
								if (rowCount >= 0) {
								  // console.log("Entered into Sorting");
								  dataTable = $("#inoutdata").dataTable({
										"bPaginate": true,
										"bLengthChange": true,
										"bFilter": true,
										"bSort": true,
										"bInfo": true,
										"bAutoWidth": true,
										"iDisplayLength": 50 // Set the number of rows per page to 50
								   });
								}
							 }, 400)
					
							// console.log($scope.finalsplist);
							
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
			$http.post(itinfra+"order/updatecourierno",obj).success(function(data){
				console.log(data);
				// location.reload();
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

		$scope.shipsmsclick = (info) =>{
			$scope.orderDetails = info;
			$http.get(itinfra+"order/receivers/"+info.Shipmentid).success(function(data){
				// console.log(data)
				$scope.receiversdata = data;
			})
		}

		$scope.re_send_sms = (rcdata) =>{
			if(rcdata!=undefined && rcdata.recieverName!=undefined && rcdata.recieverMobile!=undefined){
				var newuser = [{
					name : rcdata.recieverName,
					phoneNo : rcdata.recieverMobile,
					designation : rcdata.recieverDesignation
				}]
				// $scope.receiversdata.push(newuser);
			} else {
				var newuser = []
			}
			var smsobj = {
                shipmentId : $scope.orderDetails.Shipmentid, 
				crrefno : $scope.orderDetails.CurPickId,
                orderInfo:$scope.orderDetails,
				newreciever : newuser
            }
			// console.log(smsobj)
			$http.post(itinfra+"order/resendsms",smsobj).success(function(data){
				// console.log(data);
				location.reload();
			});
		}

		$scope.voucherprint = (shipid, status)=>{
			$http.get(itinfra+"order/receivers/"+shipid).success(function(data){
				console.log(data)
				$scope.orderdata = data.filter(e=>e.status==status);
				var url = "https://analysis.aditya.ac.in/itinfra/issue-voucher/index.html?refid="+$scope.orderdata[0].shipmentId+"-"+$scope.orderdata[0].id
				window.open(url, '_blank')
			})
		}
	
			$scope.examdatechange = function(dt)
			   {
				$scope.newDate =new Date(dt);
				return $scope.newDate
			   }
 


 });
				

