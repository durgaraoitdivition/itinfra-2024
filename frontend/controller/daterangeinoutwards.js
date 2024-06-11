angular.module('stock').controller('daterangeinoutwards',function($scope,$http,$timeout,$filter,$cookies,$window,$route,$rootScope,apiurl, itnodeapi){
	
 
		
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
	$scope.InfraItems = function(){
		$http.get(apiurl+"TicketMaster/itemsgroupby").success(function(data){
					//console.log(data);
					
					$scope.itemslist = data;
					
				});	
		 }
		 
	$scope.getitemname = function(itemgrp){
		$http.get(apiurl+"ItInfraItems?filter=%7B%22where%22%3A%7B%22ititemgroup%22%3A%22"+itemgrp+"%22%7D%7D").success(function(data){
					//console.log(data);
					$scope.totalitems = data;
				});	
 
	 }
	function calculateNextDateByDays(currentDate, daysToAdd) {
		const date = new Date(currentDate);
		date.setDate(date.getDate() + daysToAdd);
		return date;
	  }
	$scope.regnextmysqldate = function(dt) {
		var date;
		date = calculateNextDateByDays(dt, 1);
		date = date.getFullYear() + '-' +
			('00' + (date.getMonth()+1)).slice(-2) + '-' +
			('00' + (date.getDate())).slice(-2);
		return date;
	  }
	  $scope.regmysqldate = function(dt) {
		var date;
		date = dt;
		date = date.getFullYear() + '-' +
			('00' + (date.getMonth()+1)).slice(-2) + '-' +
			('00' + date.getDate()).slice(-2);
		return date;
	  }
		
	var curdate = $scope.regmysqldate(new Date());
	$scope.stock ={
		shipmentType : 'Outward' , 
		fromDate:curdate, 
		toDate : curdate
	};
	var dataTable;
	$scope.totalinoutwords = ()=>{
		let todaydate = curdate
		let nextdate = curdate
		let obj = 
			{
			"shipmentType":'Outward',
			"fromDate" : todaydate,
			"toDate" : nextdate
			} 
			// console.log(obj)
		$http.post(itinfra+"order/stockbtndates", obj).success(function(data){
			// console.log(data);
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
			 $scope.daterangedata = data;
		})
	}
	
	$scope.filterstockdata = (obj) =>{
		// console.log(obj)
		$scope.daterangedata = []
		
		if (dataTable) {
			dataTable.DataTable().destroy();
		}
		// console.log($scope.todaydate)
		let finalobj =  {
					"shipmentType": obj.shipmentType,
					"fromDate" : obj.fromDate,
					"toDate" : obj.toDate
				} 
		$http.post(itinfra+"order/stockbtndates", finalobj).success(function(data) {
			// console.log(data)
			// Destroy the existing DataTable
			$timeout(function() {
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
	
			$scope.daterangedata = data;
		});
	}
	$scope.itemwisedata = []
	$scope.getitemsinbtwdates = (reqobj)=>{
		var obj = {
			shipmentType: reqobj.shipmentType,
			fromDate: reqobj.fromDate,
			toDate : reqobj.toDate,
			campus : "All",
			ItemGroup:reqobj.ititemgroup,
			ItemName : reqobj.ititemname
		}
		$http.post(itinfra+"order/itembtndates", obj).success(function(data){
			// console.log(data);
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

	$scope.getcmpwisestockbtwdates = (reqobj)=>{
		var obj = {
			shipmentType: reqobj.shipmentType,
			fromDate: reqobj.fromDate,
			toDate : reqobj.toDate,
			campus : reqobj.campusid,
			ItemGroup:"All",
			ItemName : "All"
		}
		$http.post(itinfra+"order/itembtndates", obj).success(function(data){
			// console.log(data);
			//data = data.filter(e=>e.ticketStatusCode!=0)
			$timeout(function() {
				//$("#noCampaignData").hide();
				var rowCount = $("#cmpstock tr").length;
				//console.log("Row count value is"+rowCount);
				if (rowCount >= 0) {
				  // console.log("Entered into Sorting");
				  dataTable = $("#cmpstock").dataTable({
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
