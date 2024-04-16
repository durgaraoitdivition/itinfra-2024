angular.module('stock').controller('computerstatus',function($scope,$http,$filter,$cookies,$window,$route,$rootScope,apiurl){
    var apiurl = apiurl.getUrl();

    $scope.InstMaster = function(){
		$http.get(apiurl+"ItInfraInstMasters").success(function(data){
                //console.log(data);
                $scope.Instlist = data;
            });	
		}

    $scope.SystemsWorkingStatus = (inst)=>{
       // console.log(inst);
        $http.get(apiurl+"TicketMaster/SystemsWorkingStatus?instname=%22"+inst+"%22").success(function(data){
            let filterdata = data.filter(e=>e.campusName!='ADPGMSC' && e.campusName!='AIPGS')
            // if(tkstatus=='active'){
			// 	var statuswise = filterdata
			// } else if(tkstatus=='completed'){
			// 	var statuswise = filterdata.filter(e=>e.ticketStatusTitle=='COMPLETED')
			// } else if(tkstatus=='notworking'){
			// 	var statuswise = filterdata.filter(e=>e.ticketStatusTitle!='COMPLETED')
			// }
            for(let i=0; i<filterdata.length; i++){
				filterdata[i].notworking = filterdata[i].activetickets - filterdata[i].completed
			}
            $scope.systemscountlist = filterdata;
            console.log($scope.systemscountlist);
        });	
 
    }

});