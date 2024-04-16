angular.module('stock').controller('addinfraitems',function($scope,$http,$timeout,$filter, $cookies,$window,$route,$rootScope,apiurl){

			
    var apiurl = apiurl.getUrl();
  
    $scope.itemsList = [];
    $scope.ItInfraItems = function(){
        $http.get(apiurl+"Itinfraitems").success(function(data){
            //console.log(data);
            $timeout(function() {
                //$("#noCampaignData").hide();
                var rowCount = $("#userdata tr").length;
                //console.log("Row count value is"+rowCount);
                if (rowCount >= 0) {
                  // console.log("Entered into Sorting");
                   $("#userdata").dataTable({
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

            $scope.itemsList = data;
        });	
         
    }
    
    $scope.InfraGroupItems = function(){
        $http.get(apiurl+"TicketMaster/itemsgroupby").success(function(data){
            //console.log(data);
            $scope.itemsgrouplist = data;
        });	
    }

     $scope.edititem = (itid)=>{
        $http.get(apiurl+"Itinfraitems?filter=%7B%22where%22%3A%7B%22ititemid%22%3A"+itid+"%7D%7D").success(function(data){
            // console.log(data);
            $scope.item = data[0];
        });	
    }
     
     $scope.addItem = function(itemdata){
         if(!itemdata.ititemid){
            itemdata.ititemid = 0;
            console.log(itemdata);
            $http.post(apiurl+"Itinfraitems", itemdata).success(function(data){
                // console.log(data);
                location.reload()
            });
         } else {
            console.log(itemdata);	   
            $http.post(apiurl+"Itinfraitems/update?where=%7B%22ititemid%22%3A"+itemdata.ititemid+"%7D",itemdata).success(function(data){
                // console.log(data);
                location.reload()
            });
         }
        
         
     }
    

    
$scope.examdatechange = function(dt)
           {
            $scope.newDate =new Date(dt).toISOString().slice(0, 19).replace('T', ' ');
            return $scope.newDate
           }

});
