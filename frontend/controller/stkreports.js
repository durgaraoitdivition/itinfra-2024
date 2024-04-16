angular.module('stock').controller('stkreports',function($scope,$http,$filter, $cookies,$window,$route,$rootScope,apiurl){

			
			var apiurl = apiurl.getUrl();
			

		
		$scope.ItInfraUsers = function(){
			$http.get(apiurl+"ItInfraUsers").success(function(data){
				//console.log(data);
				$scope.userList = data;
			});	
			 
		}
		
		$scope.InstMaster = function(){
				$http.get(apiurl+"ItInfraInstMasters").success(function(data){
							//console.log(data);
							$scope.Instlist = data;
						});	
				 }
		
		$scope.getcmplist = function(insid){
				$http.get(apiurl+"ItInfraCampusMasters?filter=%7B%22where%22%3A%7B%22instId%22%3A%22"+insid+"%22%7D%7D").success(function(data){
							//console.log(data);
							$scope.getcampuslist = data;
						});	
				 }
		
		$scope.CampusMaster = function(){
			$http.get(apiurl+"ItInfraCampusMasters").success(function(data){
					//console.log(data);
					$scope.campuslist = data;
				});	
		 }
		 
		 
		 $scope.addUser = function(userdata){
			// console.log(userdata);
			 var cmpids = userdata.campusid.toString();
			 userdata.userid = 0;
			 userdata.campusid = cmpids;
			 $http.post(apiurl+"ItInfraUsers",userdata).success(function(data){
					//console.log(data);
					window.location.href = 'index.html';
			});
			 
		 }
		
		$scope.deluser = function(uid){
			///console.log(uid);
			$http.delete(apiurl+"ItInfraUsers/"+uid).success(function(data){
				var result = confirm("Want to delete?");
				if (result == true) {
					window.location.href = 'index.html';
				}
			});
		}
		
		$scope.Campstockshow = 1;
		
		$scope.branchwise = function(cname){
			
			$http.get(apiurl+"Itinfracampusmasters?filter=%7B%22where%22%3A%7B%22campusName%22%3A%22"+cname+"%22%7D%7D").success(function(data){
					//console.log(data);
					$scope.onecampus = data[0];
					var indiaTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"});
					$scope.todate = new Date(indiaTime);
				});	
				
			$http.get(apiurl+"dbreports/GetAssetsLimitedFileds?campusname='"+cname+"'").success(function(data){
					//console.log(data);
					$scope.Campstockshow = 1;
					$scope.stocklist = data;
				});
		}
		
		
		$scope.GetItemDetails = function(info){
			//console.log(info);
			$scope.Campstockshow = 2;
			if(!info.assetLocationName){
				info.assetLocationName=null;  
			}
			let obj = {
				groupdata : {
					campusname : info.campusName,
					itemgroupname: info.ItemGroupName,
					itemname: info.ItemName,
					assetlocationgroup : info.assetLocationGroup,
					assetlocationname : info.assetLocationName
				}
			}
			//console.log(obj);
			$http.post(apiurl+"TicketMaster/ItemsBasedonGroup", obj).success(function(data){
				//console.log(data)
				$scope.itmdetals = data;

					
						$scope.qtyitemlist = [];
						for(var i=0; i<$scope.itmdetals.length; i++){
							
							 $scope.qtyitemlist[i] = {
									"campusname": info.campusName,
									"assetid" : info.assetId,
									"unonumber" : info.unoNumber,
									"itemid" : info.itemId,
									"assetlocationname" : info.assetLocationName,
									"itemgroupname" : info.ItemGroupName
							};
							
						}
			});
			
			$http.get(apiurl+'Ticketstatuses').success(function(data){
				//console.log(data);
				let datafilter = data.filter(e=>e.usreRole==$scope.userdata[0].usertype);
				$scope.tiketstatus = datafilter;
			})
			
		}
		$scope.raiseTicket = (info)=>{
			$scope.iteminfo = info;
		}
		$scope.addTicket = (item, val)=>{
			//console.log(item, val);
			$http.get(apiurl+"Tickets?filter[order]=ticketnumber%20DESC&filter[limit]=1").success(function(data){
				//console.log(data);
				let tkstatus = $scope.tiketstatus.filter(e=>e.statustitle == val.statusTitle);
				item.description = val.description;
				item.ticketstatuscode = tkstatus[0].statuscode;
				item.ticketstatusdescription = tkstatus[0].statusdesciption;
				item.ticketstatustitle = tkstatus[0].statustitle;
				item.ticketuserid = $scope.userdata[0].useremail;
				item.ticketusername = $scope.userdata[0].username;
				item.ticketdate = $scope.mysqldate(new Date());
				item.ticketnumber = data[0].ticketnumber+1;
				//console.log(item);
				let obj = {
					ticketinfo : item
				}
				$http.post(apiurl+'TicketMaster/raiseTicket', obj).success(function(data){
					//console.log(data);
					location.reload();
				}) 
			})
		}

		// $scope.deleteitems =(val)=>{
		// 	console.log(val);
		// 	let obj = {
		// 		"itinfraid" : val.itinfraid,
		// 		"ititemid": val.ititemid,
		// 		"status" : 0
		// 	}
		// 	$http.post(apiurl+'dbreports/ItemStatusChange', obj).success((data)=>{
		// 		//console.log(data);
		// 		location.reload();
		// 	})
		// }

		$scope.deleteitem = (itid)=>{
			var result = confirm("Want to delete?");
			if (result) {
				//Logic to delete the item
				$http.delete(apiurl+"Assets/"+itid).success((data)=>{
					console.log(data);
					location.reload()
				})
			}
		}
		
		$scope.Configlable = function(dtlsid,cmpname){
			
			$http.get(apiurl+'Itinfraitemdetails/'+dtlsid).then((data)=>{
						console.log(data.data,cmpname);
						$scope.data=data.data;
						$scope.campusname=cmpname;
				  });
			$scope.fstring=function(str){
			return str.replace(/[^a-zA-Z ]/g, "");
			}
			$scope.nformat=function(num){
				return num.toFixed(2)
			}	
		}		
		
		
		$scope.getitemcmpwise = function(cname){
			$http.get(apiurl+"Itinfracampusmasters?filter=%7B%22where%22%3A%7B%22campusName%22%3A%22"+cname+"%22%7D%7D").success(function(data){
					//console.log(data);
					$scope.onecampus = data[0];
					var indiaTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"});
					$scope.todate = new Date(indiaTime);
				});
			$http.get(apiurl+"dbreports/itemcmpwise?campusname='"+cname+"'").success(function(data){
					console.log(data);
					$scope.camitemswiselist = data;
				});
		}
		
		
		$scope.InfraItems = function(){
		$http.get(apiurl+"ItInfraItemGroups").success(function(data){
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
		 
		 $scope.gettotalitems = function(itm){
			 $http.get(apiurl+"ItInfrastructures?filter=%7B%22where%22%3A%7B%22ititemname%22%3A%22"+itm+"%22%7D%7D").success(function(data){
					//console.log(data);
					$scope.totalitemslist = data;
					$scope.unqcampus = $filter('unique')($scope.totalitemslist,'campusname');
					//console.log($scope.unqcampus);
					$scope.finalarray = [];
					for(var i=0; i<$scope.unqcampus.length; i++){
						var itemscount = 0;
						var nwbranch = '';
						
						for(var j=0; j<$scope.totalitemslist.length; j++){
							if($scope.unqcampus[i]==$scope.totalitemslist[j].campusname){
								//console.log($scope.unqcampus[i],$scope.totalitemslist[j].campusname);
								itemscount = itemscount+$scope.totalitemslist[j].ititemqty;
								nwbranch = $scope.totalitemslist[j].campusname;
								ititemgroup = $scope.totalitemslist[j].ititemgroup;
								ititemname = $scope.totalitemslist[j].ititemname;
							}
						}
						//console.log(itemscount);
						$scope.finalarray[i] = {
									"Branch": nwbranch,
									"ItemGroup" : ititemgroup,
									"ItemName" : ititemname,
									"Itemcount" : itemscount
								}
						
					}
					//console.log($scope.finalarray);
				});
		 }
		 
		 
		 $scope.getitemsgroup = function(itmgrp){
			// console.log(itmgrp);
			 $http.get(apiurl+"dbreports/itemgroupwise?Itemgroup='"+itmgrp+"'").success(function(data){
				console.log(data);
				
				$scope.itemgroupwise = data.filter(e=>e.institutename=="DEGREE COLLEGE" && e.campusName!="ADPGMSC" && e.campusName!="AIPGS" );
				
				$scope.unqitmnames = $filter('unique')($scope.itemgroupwise,'ItemName');
				
				//console.log($scope.unqitmnames);
				$scope.itemnamewise = [];
				for(var i=0; i<$scope.unqitmnames.length; i++){
					
					$scope.itemnamewise[i] = $scope.itemgroupwise.filter(e=>e.ItemName == $scope.unqitmnames[i]);	
					
				}
				
				//console.log($scope.itemnamewise);
				
				
			});
		 }
		
		
		
		
 $scope.examdatechange = function(dt)
			   {
				$scope.newDate =new Date(dt);
				return $scope.newDate
			   }

 });
