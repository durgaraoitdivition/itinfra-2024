angular.module('stock').controller('userhome',function($scope,$http,$filter,$cookies,$window,$route,$rootScope,apiurl, analysiapi){
	
 
	var apiurl = apiurl.getUrl();
	var analysis = analysiapi.getUrl();
	$scope.sendsms = (obj) =>{
			// console.log(obj);
			$http.post(analysis+"sms/sendsms", obj).success(function(data){
				console.log(data);
				return data;
			});	
		 } 
	$scope.campusinfo = JSON.parse($window.sessionStorage.getItem('campusinfo'));
	// $scope.datain = ()=>{
	// 	$http.get(apiurl+'dbreports/DataMigrate').success(function(data){
	// 	console.log(data);
	// 	})
	// }
	// $scope.datainnotdsk = ()=>{
	// 	$http.get(apiurl+'dbreports/DataMigrateAfterDsk').success(function(data){
	// 	console.log(data);
	// 	})
	// }
	//console.log($scope.campusinfo)
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

	$scope.completedtickets = ()=>{
		$http.get(apiurl+"TicketMaster/CampusAllTiketsGroupby?campusname="+campus).success(function(data){
			//console.log(data);
			data = data.filter(e=>e.ticketStatusTitle=='CLOSE')
			$scope.fineshedtickets = data;
			$scope.fineshedcount = $scope.fineshedtickets.length;
		})
	}

	

 });
