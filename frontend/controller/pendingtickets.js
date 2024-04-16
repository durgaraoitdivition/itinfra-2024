angular.module('stock').controller('pendingtickets',function($scope,$http,$filter,$cookies,$window,$route,$rootScope,apiurl){
	
 
		
		var apiurl = apiurl.getUrl();
		//console.log($scope.userdata);
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
		
		$scope.totaltikets = (campus)=>{
			$http.get(apiurl+"TicketMaster/TicketDatainAssets?campusname="+campus).success(function(data){
				console.log(data);
				//data = data.filter(e=>e.ticketStatusCode!=0)
				$scope.totaltickets = data;
				// for(let i=0; i<$scope.totaltickets.length; i++){
				// 	$scope.totaltickets[i].ticketCreated = new Date($scope.totaltickets[i].ticketCreated).toISOString().slice(0, 19).replace('T', ' ');
				// 	$scope.totaltickets[i].ticketDate = new Date($scope.totaltickets[i].ticketDate).toISOString().slice(0, 19).replace('T', ' ');
				// }
				$http.get(apiurl+'Ticketstatuses').success(function(data){
					//console.log(data);
					let datafilter = data.filter(e=>e.usreRole==$scope.userdata[0].usertype);
					$scope.tiketstatus = datafilter;
				})
			})
		}
		
	
		
	
		
			
 

 });
