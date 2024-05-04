angular.module('stock').controller('campusinoutwards',function($scope,$http,$timeout,$filter,$cookies,$window,$route,$rootScope,apiurl,itnodeapi){
	
 
		
	var apiurl = apiurl.getUrl();
	var itinfra = itnodeapi.getUrl();
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

	$scope.itinfraitems = ()=>{
		$http.get(apiurl+"Itinfraitems?filter=%7B%22where%22%3A%7B%22assettype%22%3A%22Spares%22%7D%7D").success(function(data){
			console.log(data);
			$scope.itemslist = data;
		});	
	}

	$scope.showdiv = 1;	
	$scope.shipmentType= 'Outward';
	var dataTable;
	$scope.totalinoutwords = (type)=>{
		var obj = {
			shipmentType: type,
			instId : 0,
			CampusName : "All"
		}
		$http.post(itinfra+"order/totalinoutwarditems", obj).success(function(data){
			console.log(data);
			//data = data.filter(e=>e.ticketStatusCode!=0)
			$timeout(function() {
				//$("#noCampaignData").hide();
				var rowCount = $("#inoutdata tr").length;
				//console.log("Row count value is"+rowCount);
				if (rowCount >= 0) {
				  // console.log("Entered into Sorting");
				  dataTable = $("#inoutdata").dataTable({
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
			 $scope.totalinoutsdata = data;
		})
	}
	
	
	$scope.filteritems = (type, instid, campus)=>{
		$scope.totalinoutsdata = []
		var obj = {
			shipmentType: type,
			instId : parseInt(instid),
			CampusName : campus
		}
		if (dataTable) {
			dataTable.DataTable().destroy();
		}
		$http.post(itinfra + "order/totalinoutwarditems", obj).success(function(data) {
			// Destroy the existing DataTable
			
	
			$timeout(function() {
				console.log(data);
				var rowCount = $("#inoutdata tr").length;
				if (rowCount >= 0) {
					dataTable = $("#inoutdata").dataTable({
						"bPaginate": true,
						"bLengthChange": true,
						"bFilter": true,
						"bSort": true,
						"bInfo": true,
						"bAutoWidth": true,
						"iDisplayLength": 50 // Set the number of rows per page to 50
					});
				}
			}, 400);
	
			$scope.totalinoutsdata = data;
		});
	}
	
		


});
