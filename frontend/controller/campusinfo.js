angular.module('stock').controller('campusinfo',function($scope,$http,$timeout,$filter, $cookies,$window,$route,$rootScope,apiurl){

			
    var apiurl = apiurl.getUrl();
        

    $scope.campusdata = [];
    $scope.ItInfraCampus = function(){
        $http.get(apiurl+"Itinfracampusmasters").success(function(data){
            //console.log(data);
            $timeout(function() {
                //$("#noCampaignData").hide();
                var rowCount = $("#incdata tr").length;
                //console.log("Row count value is"+rowCount);
                if (rowCount >= 0) {
                  // console.log("Entered into Sorting");
                   $("#incdata").dataTable({
                        "bPaginate": true,
                        "bLengthChange": true,
                        "bFilter": true,
                        "bSort": true,
                        "bInfo": true,
                        "bAutoWidth": true,
                        "pageLength": 50
                   });
                }
             }, 400)

            $scope.campusdata = data;
        });	
         
    }
 
     $scope.edituser = (uid)=>{
        $http.get(apiurl+"Itinfracampusmasters?filter=%7B%22where%22%3A%7B%22id%22%3A"+uid+"%7D%7D").success(function(data){
            console.log(data);
            $scope.user = data[0];
        });	
    }
     
     $scope.addCampus = function(userdata){	   
        $http.post(apiurl+"Itinfracampusmasters/update?where=%7B%22id%22%3A"+userdata.id+"%7D",userdata).success(function(data){
            // console.log(data);
            location.reload()
        });
    }

    
    

   
    
$scope.examdatechange = function(dt)
           {
            $scope.newDate =new Date(dt).toISOString().slice(0, 19).replace('T', ' ');
            return $scope.newDate
           }

});
