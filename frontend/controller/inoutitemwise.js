angular.module('stock').controller('inoutitemwise',function($scope,$http,$timeout,$filter,$cookies,$window,$route,$rootScope,apiurl, fileUploadService, $base64, $sce, itnodeapi){
	
 
		
	var apiurl = apiurl.getUrl();
	var itinfra = itnodeapi.getUrl();
	$scope.sType = $route.current.params.sType;
	$scope.instId = $route.current.params.instId;
	$scope.CName = $route.current.params.campus;
	$scope.ItGrp = $route.current.params.ItGrp;
	$scope.ItName = $route.current.params.ItName;

	$scope.inoutitemwisedata = ()=>{
		if($scope.instId=='' && $scope.CName==''){
			var filterobj = {
				sType: $scope.sType,
				instId : 0,
				CName : "All",
				ItGrp : $scope.ItGrp,
				ItName : $scope.ItName
			}
		} else {
			var filterobj = {
				sType: $scope.sType,
				instId : parseInt($scope.instId),
				CName : $scope.CName,
				ItGrp : $scope.ItGrp,
				ItName : $scope.ItName
			}
		}
		$http.post(itinfra+"order/itemwiseinoutwards", filterobj).success(function(data){
			console.log(data);
			//data = data.filter(e=>e.ticketStatusCode!=0)
			$timeout(function() {
				//$("#noCampaignData").hide();
				var rowCount = $("#inoutitemdata tr").length;
				//console.log("Row count value is"+rowCount);
				if (rowCount >= 0) {
				  // console.log("Entered into Sorting");
				  dataTable = $("#inoutitemdata").dataTable({
						"bPaginate": true,
						"bLengthChange": true,
						"bFilter": true,
						"bSort": true,
						"bInfo": true,
						"bAutoWidth": true,
						"iDisplayLength": 50 // Set the number of rows per page to 50
				   });
				}
			 }, 400)
			 $scope.itemwisedata = data;
		})
	}

	$scope.sumByKey = (array, key)=> {
        return array.reduce((sum, obj) => {
            return sum + (obj[key] || 0);
        }, 0);
    }

});
