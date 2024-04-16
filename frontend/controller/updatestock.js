angular.module('stock').controller('updatestock',function($scope,$http,$filter,$cookies,$window,$route,$rootScope,apiurl){

		
			 
			var apiurl = apiurl.getUrl();
			
			//var apiurl = "http://10.60.1.19:3000/api/";
			
			$scope.userdata = JSON.parse($window.sessionStorage.getItem('logindata'));
			//console.log($scope.userdata[0].cmpid);
			let assetid = $route.current.params.assetid;
			
			$http.get(apiurl+"Itinfraitemgroups").success(function(data){
				//console.log(data);
				$scope.itemgrouplist = data;
			});
				

			$scope.getassetdata = ()=>{
				$http.get(apiurl+"Assets?filter[where][assetid]="+assetid).success(function(data){
					console.log(data);
					$scope.stockitem =data[0];
					$scope.stockitem.purchasedate = new Date($scope.stockitem.purchasedate);
					$scope.stockitem.warrantyupto = new Date($scope.stockitem.warrantyupto);
					$scope.getitemname($scope.stockitem.itemgroupname);
				})
			}
		
	$scope.getitemname = function(itemgrp){
		$http.get(apiurl+"ItInfraItems?filter=%7B%22where%22%3A%7B%22ititemgroup%22%3A%22"+itemgrp+"%22%7D%7D").success(function(data){
					//console.log(data);
					$scope.totalitems = data;
					$scope.stockitem.itemid = data[0].ititemid;
					let itItemGrpid = $scope.itemgrouplist.filter(e=>e.ititemgrpname == data[0].ititemgroup);
					$scope.stockitem.itemgroupid =itItemGrpid[0].ititemgrpid;
				});	
		 
		 }
		 $scope.getvendorslist = function(){
			$http.get(apiurl+"Vendordetails").success(function(data){
						console.log(data);
						$scope.vendorslist = data;
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
			$scope.stockitem.ititemgrpid=data[0].ititemgrpid;
		});	
	}
	
	
	$scope.getunodata = (uno)=>{
		
		// obj = {
		// 	itinfraid: parseInt(itinfraid),
		// 	unoNo : parseInt(uno)
		// }
		$http.get(apiurl+"Itinfraitemdetails?filter=%7B%22where%22%3A%7B%22itinfraitemdetailsid%22%3A"+uno+"%7D%7D").success(function(data){
			console.log(data);
			let itItemGrpid = $scope.itemgrouplist.filter(e=>e.ititemgrpname == "DESKTOPS");
			$scope.campusname = $scope.campusinfo[0].campusName;
			$scope.stockitem = {
				"assetid":$scope.stockitem.assetid,
				"stockentryno":$scope.stockitem.stockentryno,
				"assetlocationgroup": $scope.stockitem.assetlocationgroup,
				"assetlocationname": $scope.stockitem.assetlocationname,
				"simpleconfig": data[0].itinfraitemsimplespec,
				"fullconfig": data[0].itinfraitemdetailedspec,
				"brandname": data[0].itinfraitemsimplespec.cpu.brand,
				"itemgroupid": itItemGrpid[0].ititemgrpid,
				"itemgroupname": $scope.stockitem.itemgroupname,
				"itemname": $scope.stockitem.itemname,
				"macid": data[0].itinfraitemuniqno,
				"modelno": data[0].itinfraitemmodelno,
				"serialno": data[0].itinfraitemserialno,
				"purchasefrom": $scope.stockitem.purchasefrom,
				"purchasedate": new Date($scope.stockitem.purchasedate),
				"warrantyupto": new Date($scope.stockitem.warrantyupto),
				"unonumber": parseInt(uno)
			}
			$scope.getitemname($scope.stockitem.itemgroupname)
			console.log($scope.stockitem);
		})
	
	}
	
	
	$scope.Configlable = function(dtlsid){
		$http.get(apiurl+'Itinfraitemdetails/'+dtlsid).then((data)=>{
                    //console.log(data.data);
                    $scope.data=data.data;
					$scope.campusname = $scope.stockitem.campusname;
					$scope.fstring=function(str){
						return str.replace(/[^a-zA-Z ]/g, "");
						}
              });
		
		$scope.nformat=function(num){
			return num.toFixed(2)
		}	
	}
	$scope.regmysqldate = function(dt) {
		var date;
		date = dt;
		date = date.getFullYear() + '-' +
			('00' + (date.getMonth()+1)).slice(-2) + '-' +
			('00' + date.getDate()).slice(-2);
		return date;
	  }

	$scope.updateasset = (info)=>{
		// let obj = {
		// 	assetid : info.assetid,
		// 	stockentryno: info.stockentryno,
		// 	purchasedate : $scope.regmysqldate(info.purchasedate),
		// 	warrantyupto : $scope.regmysqldate(info.warrantyupto),
		// 	purchasefrom : info.purchasefrom,
		// 	updatedat : new Date()
		// }
		//console.log(info);
		info.simpleconfig = JSON.stringify(info.simpleconfig);
		info.fullconfig = JSON.stringify(info.fullconfig);
		console.log(info);
		$http.post(apiurl+"Assets/update?where=%7B%22assetid%22%3A"+info.assetid+"%7D",info).success(function(data){
			//console.log(data);
			location.reload();
		});
	}
	
	
	
	
	$scope.examdatechange = function(dt)
			   {
				$scope.newDate =new Date(dt);
				return $scope.newDate
			   }
 

 });
