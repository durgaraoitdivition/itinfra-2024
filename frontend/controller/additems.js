angular.module('stock').controller('additems',function($scope,$http,$filter,$cookies,$window,$route,$rootScope,apiurl){

		
			 
			var apiurl = apiurl.getUrl();
			
			//var apiurl = "http://10.60.1.19:3000/api/";
			
			$scope.userdata = JSON.parse($window.sessionStorage.getItem('logindata'));
			//console.log($scope.userdata[0].cmpid);
			let itinfraid = $route.current.params.itnfraid;
			
			$http.get(apiurl+"Itinfraitemgroups").success(function(data){
				//console.log(data);
				$scope.itemgrouplist = data;
			});
	
			$http.get(apiurl+"Itinfrainstmasters").success(function(data){
				//console.log(data);
				$scope.instmaster = data;
			});	
		
	$scope.getitemname = function(itemgrp){
		$http.get(apiurl+"ItInfraItems?filter=%7B%22where%22%3A%7B%22ititemgroup%22%3A%22"+itemgrp+"%22%7D%7D").success(function(data){
					//console.log(data);
					$scope.totalitems = data;
					$scope.stockitem.itItemId = data[0].ititemid;
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
	
	

	
	$scope.updateform =0;
	$scope.getunodata = (uno)=>{
		$scope.updateform =1;
		
		// obj = {
		// 	itinfraid: parseInt(itinfraid),
		// 	unoNo : parseInt(uno)
		// }
		$http.get(apiurl+"Itinfraitemdetails?filter=%7B%22where%22%3A%7B%22itinfraitemdetailsid%22%3A"+uno+"%7D%7D").success(function(data){
			console.log(data);
			let itItemGrpid = $scope.itemgrouplist.filter(e=>e.ititemgrpname == "DESKTOPS");
			$scope.campusname = $scope.campusinfo[0].campusName;
			$scope.stockitem = {
				"assetlocationgroup": data[0].assetlocationgroup,
				"assetlocationname": data[0].assetlocationname,
				"brandname": data[0].itinfraitemsimplespec.cpu.brand,
				"fullconfig": data[0].itinfraitemdetailedspec,
				"itemgroupid": itItemGrpid[0].ititemgrpid,
				"itemgroupname": "DESKTOPS",
				"itemname": "Desktop",
				"macid": data[0].itinfraitemuniqno,
				"modelno": data[0].itinfraitemmodelno,
				"serialno": data[0].itinfraitemserialno,
				"simpleconfig": data[0].itinfraitemsimplespec,
				"unonumber": parseInt(uno)
			}
			$scope.getitemname($scope.stockitem.itemgroupname)
			//console.log($scope.stockitem);
		})
	
	}
	
	
	$scope.Configlable = function(dtlsid){
		$http.get(apiurl+'Itinfraitemdetails/'+dtlsid).then((data)=>{
                    //console.log(data.data);
                    $scope.data=data.data;
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
	$scope.showsubmit = 0;
	$scope.addAsset =(info)=>{
		$scope.showsubmit = 1;
		let instdata = $scope.instmaster.filter(e=>e.instid==$scope.campusinfo[0].instId);
		if(info.config){
			info.simpleconfig = {
				config : info.config
			}
		}
		if(info.purchasedate !=null){
			info.purchasedate=$scope.regmysqldate(info.purchasedate);
		}
		if(info.warrantyupto !=null){
			info.warrantyupto=$scope.regmysqldate(info.warrantyupto);
		}
		info.campusname = $scope.campusinfo[0].campusName;
		info.campusid=$scope.userdata[0].campusid;
		info.useremail=$scope.userdata[0].useremail;
		info.userid=$scope.userdata[0].userid;
		info.institutename = instdata[0].institutename;
		
		
		//console.log(info);
		let obj = {
			itemdetails : info
		}
		$http.post(apiurl+"/dbreports/AddorUpdateitem", obj).success(function(data){
			//console.log(data);
			window.location.href= "#/addstock";
		});	
	}
	
	
	
	
	$scope.examdatechange = function(dt)
			   {
				$scope.newDate =new Date(dt);
				return $scope.newDate
			   }
 

 });
