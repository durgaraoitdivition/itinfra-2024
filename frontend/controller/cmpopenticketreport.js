angular.module('stock').controller('cmpopenticketreport',function($scope,$http,$filter,$cookies,$window,$route,$rootScope,apiurl){
	
 
		
    var apiurl = apiurl.getUrl();
    //console.log($scope.userdata);
   
    let campus = $route.current.params.campus;
    let statustk = $route.current.params.tkstatus
    $scope.CampusMaster = function(){
        $http.get(apiurl+"ItInfraCampusMasters").success(function(data){
                //console.log(data);
                $scope.campuslist = data;
            });	
    }
    
    $scope.totaltikets = ()=>{
        $http.get(apiurl+"TicketMaster/TicketDatainAssets?campusname="+campus).success(function(data){
            console.log(data);
            if(statustk=='active'){
				var statuswise = data
			} else if(statustk=='completed'){
				var statuswise = data.filter(e=>e.ticketStatusTitle=='COMPLETED')
			} else if(statustk=='notworking'){
				var statuswise = data.filter(e=>e.ticketStatusTitle!='COMPLETED')
			}
            $scope.totaltickets = statuswise;
        })
    }
    
   
        


});
