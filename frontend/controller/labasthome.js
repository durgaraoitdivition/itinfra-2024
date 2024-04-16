angular.module('stock').controller('labasthome',function($scope,$http,$filter,$cookies,$window,$route,$rootScope,apiurl, analysiapi){

		
			 
	var apiurl = apiurl.getUrl();
	var analysis = analysiapi.getUrl();	
		$scope.sendsms = (obj) =>{
			// console.log(obj);
			$http.post(analysis+"sms/sendsms", obj).success(function(data){
				console.log(data);
				return data;
			});	
		 }
	//var apiurl = "http://10.60.1.19:3000/api/";
	console.log($scope.userdata);

	let campus = $scope.campusinfo[0].campusName;
	$scope.totaltikets = ()=>{
		$http.get(apiurl+"TicketMaster/TicketDatainAssets?campusname="+campus).success(function(data){
			//console.log(data);
			//data = data.filter(e=>e.ticketStatusCode!=0)
			$scope.totaltickets = data;

			$http.get(apiurl+'Ticketstatuses').success(function(data){
				//console.log(data);
				let datafilter = data.filter(e=>e.usreRole==$scope.userdata[0].usertype);
				$scope.tiketstatus = datafilter;
			})
		})
	}
	
	
	$scope.examdatechange = function(dt)
			   {
				$scope.newDate =new Date(dt);
				return $scope.newDate
			   }
 

 });
