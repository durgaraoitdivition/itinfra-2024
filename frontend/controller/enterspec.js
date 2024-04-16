angular.module('stock').controller('EnterSpec',function($scope,$http,$filter, $localStorage,$window,$route,$rootScope,apiurl){



			var apiurl = apiurl.getUrl();
			
			//var apiurl = "http://10.60.1.19:3000/api/";
			
			$scope.infraid=$route.current.params.InfraId;
			
			console.log($scope.infraid);
			
			
				$http.get(apiurl+"ItInfrastructures?filter=%7B%22where%22%3A%7B%22itinfraid%22%3A"+$scope.infraid+"%7D%7D").success(function(data){
					console.log(data);
					$scope.singleitem = data;
					$scope.updatespec = [];
																																																									  					$http.get(apiurl+"ItInfraAssetUpdates?filter=%7B%22where%22%3A%7B%22ititemid%22%3A"+$scope.singleitem[0].ititemid+"%2C%22ititemname%22%3A%22"+$scope.singleitem[0].ititemname+"%22%2C%22campusid%22%3A%20%22"+$scope.singleitem[0].campusid+"%22%7D%7D").success(function(data){
						console.log(data);	
						$scope.assetdata = data;
						//console.log($scope.assetdata.length);	
					
																																																														
					if($scope.assetdata.length==0){																																																										
						for(var i=0; i<$scope.singleitem[0].ititemqty; i++){
							$scope.updatespec[i] = {
								itinfraassetupdateid: 0,
								ititemid : $scope.singleitem[0].ititemid,
								ititemname : $scope.singleitem[0].ititemname,
								ititemlocation : $scope.singleitem[0].ititemlocation,
								campusid : $scope.singleitem[0].campusid,
								ititemgroup : $scope.singleitem[0].ititemgroup
							}
						}
					} else {
						for(var i=0; i<$scope.singleitem[0].ititemqty; i++){
							$scope.updatespec[i] = {
							itinfraassetupdateid: 0,
							ititemid : $scope.singleitem[0].ititemid,
							ititemname : $scope.singleitem[0].ititemname,
							ititemlocation : $scope.singleitem[0].ititemlocation,
							campusid : $scope.singleitem[0].campusid,
							ititemgroup : $scope.singleitem[0].ititemgroup,
							ititembrand : $scope.assetdata[i].ititembrand,
							itassetmodelno : $scope.assetdata[i].itassetmodelno,
							itassetserialno : $scope.assetdata[i].itassetserialno,
							itassetmacid : $scope.assetdata[i].itassetmacid
								}
							}
					}
					
					});
					//console.log($scope.updatespec);
				});	
		 
			$scope.stksepcupdate = function(spec){
				console.log(spec);
				$http.post(apiurl+"ItInfraAssetUpdates",spec).success(function(data){
						window.location.href = 'index.html';																												 
				});
			}
		
	
	
	$scope.examdatechange = function(dt)
			   {
				$scope.newDate =new Date(dt);
				return $scope.newDate
			   }
 
   
     $scope.fill_other = function(ival,ary){
		 //console.log(ary.length);
		 for(var i=0; i<ary.length; i++){
			 if(ival>0){
				$scope.updatespec[ival].ititembrand = $scope.updatespec[ival-i].ititembrand;
				$scope.updatespec[ival].itassetmodelno = $scope.updatespec[ival-i].itassetmodelno;
				$scope.updatespec[ival].itassetserialno = $scope.updatespec[ival-i].itassetserialno;
				$scope.updatespec[ival].itassetmacid = $scope.updatespec[ival-i].itassetmacid;
			 }
		 }
	 }
	 
	 $scope.fill_two = function(nval){
		 console.log(nval);
	 }

 });
				

