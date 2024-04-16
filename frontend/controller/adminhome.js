angular.module('stock').controller('adminhome',function($scope,$http,$filter,$cookies,$window,$route,$rootScope,apiurl, analysiapi){
	
 
		 $scope.userdata = JSON.parse($window.sessionStorage.getItem('logindata'));
		
		//console.log($scope.userdata);

			
			 
			var apiurl = apiurl.getUrl();
var analysis = analysiapi.getUrl();
$http.get(apiurl+"ItInfraCampusMasters").success(function(data){
			//console.log(data);
			$window.sessionStorage.setItem('campusinfo',JSON.stringify(data));
		});
		
			
$scope.sendsms = (obj) =>{
			// console.log(obj);
			$http.post(analysis+"sms/sendsms", obj).success(function(data){
				console.log(data);
				return data;
			});	
		 }
			
			
 

 });
