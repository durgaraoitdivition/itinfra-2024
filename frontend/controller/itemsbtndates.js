angular.module('stock').controller('itemsbtndates',function($scope,$http,$timeout,$filter,$cookies,$window,$route,$rootScope,apiurl, fileUploadService, $base64, $sce, itnodeapi){
	
 
		
	var apiurl = apiurl.getUrl();
	$scope.sType = $route.current.params.sType;
	$scope.from = $route.current.params.from;
	$scope.toDate = $route.current.params.to;
	$scope.campus = $route.current.params.cmp;
	$scope.ItGrp = $route.current.params.ItGrp;
	$scope.ItName = $route.current.params.ItName;
	var itinfra = itnodeapi.getUrl();
	$scope.inoutitemwisedata = ()=>{
		var obj = {
			shipmentType: $scope.sType,
			fromDate: $scope.from,
			toDate : $scope.toDate,
			campus : $scope.campus,
			ItemGroup:$scope.ItGrp,
			ItemName : $scope.ItName
		}
		$http.post(itinfra+"order/itembtndates", obj).success(function(data){
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

});
