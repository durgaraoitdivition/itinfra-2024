angular.module('stock').controller('closedtickets',function($scope,$http,$filter,$cookies,$window,$route,$rootScope,apiurl){
	
 
		
    var apiurl = apiurl.getUrl();
    let campus = $scope.campusinfo[0].campusName;
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
    
    $scope.completedtickets = ()=>{
		$http.get(apiurl+"TicketMaster/CampusAllTiketsGroupby?campusname="+campus).success(function(data){
			//console.log(data);
			data = data.filter(e=>e.ticketStatusTitle=='CLOSE')
			$scope.fineshedtickets = data;
            // for(let i=0; i<$scope.fineshedtickets.length; i++){
			// 	$scope.fineshedtickets[i].ticketCreated = new Date($scope.fineshedtickets[i].ticketCreated).toISOString().slice(0, 19).replace('T', ' ');
            //     $scope.fineshedtickets[i].ticketDate = new Date($scope.fineshedtickets[i].ticketDate).toISOString().slice(0, 19).replace('T', ' ');
			// }
			$scope.fineshedcount = $scope.fineshedtickets.length;
		})
	}
    

    

    
        


});
