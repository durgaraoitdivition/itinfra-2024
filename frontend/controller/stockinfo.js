angular.module('stock').controller('stockinfo',function($scope,$http,$filter,$cookies,$window,$route,$rootScope,apiurl){

		
			 
			var apiurl = apiurl.getUrl();
			
			//var apiurl = "http://10.60.1.19:3000/api/";
			
			//console.log($scope.userdata);
			
			$scope.campusinfo = JSON.parse($window.sessionStorage.getItem('campusinfo'));
		
	$scope.getitemname = function(itemgrp){
		$http.get(apiurl+"ItInfraItems?filter=%7B%22where%22%3A%7B%22ititemgroup%22%3A%22"+itemgrp+"%22%7D%7D").success(function(data){
					//console.log(data);
					$scope.totalitems = data;
				});	
		 
		 }
		

	
	$scope.Itemsuidwise = function(){
		$http.get(apiurl+"dbreports/UserWisedata?UserId="+$scope.userdata[0].userid).success(function(data){
					//console.log(data);
					$scope.uidwiselist = data;
				});	
		 
		 }
	
	$scope.CampusMaster = function(){
		$http.get(apiurl+"ItInfraCampusMasters").success(function(data){
					//console.log(data);
					$scope.campuslist = data;
				});	
		 }
	
	$scope.ItemLocation = function(){
		$http.get(apiurl+"ItInfraLocations").success(function(data){
					//console.log(data);
					$scope.locationslist = data;
				});	
		 }
	
	$scope.InfraItems = function(){
		$http.get(apiurl+"ItInfraItemGroups").success(function(data){
					//console.log(data);
					
					$scope.itemslist = data;
					
				});	
		 }
	
	$scope.addStock = function(stk){
		
		//console.log(stk)
		
		var cmpid = parseInt(stk.campusid)
		
		$http.get(apiurl+"ItInfraCampusMasters?filter=%7B%22where%22%3A%7B%22id%22%3A"+cmpid+"%7D%7D").success(function(cdata){
					//console.log(cdata);		
			stk.campusname = cdata[0].campusName;
			stk.instid = cdata[0].instId;
			$http.get(apiurl+"ItInfraItems?filter=%7B%22where%22%3A%7B%22ititemname%22%3A%22"+stk.ititemname+"%22%7D%7D").success(function(data){
				stk.itinfraid = 0;
				stk.userid = $scope.userdata[0].userid;
				stk.hwengmaild = $scope.userdata[0].useremail;
				stk.ititemid = parseInt(data[0].ititemid);	
				//stk.ititemid = parseInt(stk.ititemid);
				stk.createdat = new Date();
				stk.updatedat = new Date();
				console.log(stk);
				$http.post(apiurl+"ItInfrastructures",stk).success(function(data){
						//console.log(data);
						//window.location.href = 'index.html#/addstock';
						location.reload();
				});
			
			});
		})

	}
 
 	$scope.editstk = function(sid){
		$http.get(apiurl+"ItInfrastructures?filter=%7B%22where%22%3A%7B%22itinfraid%22%3A"+sid+"%7D%7D").success(function(data){
			//console.log(data);
			$scope.onestk = data[0];
			$scope.getitemname($scope.onestk.ititemgroup);
		})
	}
	
	$scope.delstk = function(sid){
		$http.delete(apiurl+"ItInfrastructures/"+sid).success(function(data){
			var result = confirm("Want to delete?");
			if (result == true) {
				window.location.href = 'index.html';
			}
		});
	}
	
	
	$scope.editStock = function(stk){
		
		//console.log(stk)
		$http.get(apiurl+"ItInfraItems?filter=%7B%22where%22%3A%7B%22ititemname%22%3A%22"+stk.ititemname+"%22%7D%7D").success(function(data){
			stk.ititemid = parseInt(data[0].ititemid);
			//var indiaTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"});
			stk.updatedat = new Date();
			//stk.updatedat = new Date(stk.updatedat);
			//console.log(stk);
			$http.post(apiurl+'ItInfrastructures/'+stk.itinfraid+'/replace',stk).success(function(data){
					//console.log(data);
					//window.location.href = 'index.html';
					location.reload();
			});
		
		});

	}
	
	$scope.Campstockshow = 1;
	
	$scope.campuStock = function(){
		//console.log($scope.campusinfo[0].campusName);
		$http.get(apiurl+'dbreports/GetAssetsLimitedFileds?campusname="'+$scope.campusinfo[0].campusName+'"').success(function(data){
			//console.log(data);
			$scope.Campstockshow = 1;
			$scope.cmpwiselist = data;
			var indiaTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"});
			$scope.todate = new Date(indiaTime);
			
		})
	}
	
	$scope.GetItemDetails = function(info){
		$scope.Campstockshow = 2;
		//console.log(info);
		$http.get(apiurl+"Assets?filter[where][campusname]="+info.campusName+"&filter[where][assetlocationgroup]="+info.assetLocationGroup+"&filter[where][assetlocationname]="+info.assetLocationName+"").success(function(data){
			
			//console.log(data);
			$scope.qtyitemlist = data;
		
		})

		$http.get(apiurl+'Ticketstatuses').success(function(data){
			//console.log(data);
			let datafilter = data.filter(e=>e.usreRole==$scope.userdata[0].usertype);
			$scope.tiketstatus = datafilter;
		})
		
	}
	
	$scope.UpdateItemDetails = function(update){	
			
		var myArray = update.filter(function( obj ) {
				return obj.uid !== '';
			});
				
		var arryuids = myArray.map(function(val) {
		  return val.uid;
		}).join(',');
		//var arryuids = arryuids.replace(/,\s*$/, "");
		//console.log(arryuids);
		var obj = {"itinfraid": update[0].itinfraid, "ititemid": update[0].ititemid, "uids" : arryuids}
		
		//console.log(obj);

		$http.post(apiurl+"dbreports/UpdateInfraids",obj).success(function(data){
				// console.log(data);
				location.reload();
			});
	}
	
	$scope.Configlable = function(dtlsid,cmpname){
		$http.get(apiurl+'Itinfraitemdetails/'+dtlsid).then((data)=>{
                   // console.log(data.data);
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
			// console.log(item);
			let obj = {
				ticketinfo : item
			}
			$http.post(apiurl+'TicketMaster/raiseTicket', obj).success(function(data){
				//console.log(data);
				//location.reload();
			}) 
		})
    }
	
	
	$scope.examdatechange = function(dt)
			   {
				$scope.newDate =new Date(dt);
				return $scope.newDate
			   }
 

 });
