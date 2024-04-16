angular.module('stock').controller('indent', function ($scope, $http, $filter, $cookies, $window, $route, $rootScope, fileUploadService, $base64, apiurl) {



	var apiurl = apiurl.getUrl();

	//var apiurl = "http://10.60.1.19:3000/api/";
	var filevault = "https://apis.aditya.ac.in/filevault/"

	$scope.userdata = JSON.parse($window.sessionStorage.getItem('logindata'));
	// console.log($scope.userdata[0]);
	

	$http.get(apiurl + "Itinfraitemgroups").success(function (data) {
		//console.log(data);
		$scope.itemgrouplist = data;
	});

	
	$http.get(apiurl+'Ticketstatuses').success(function(data){
		// console.log(data);
		//  let datafilter = data.filter(e=>e.usreRole==$scope.userdata[0].usertype);
		//  console.log(datafilter);
		 $scope.tiketstatus = data.filter(e=>e.statustitle=='OPEN');
	 })
	 $http.get(apiurl + "ItInfraCampusMasters").success(function (data) {
		// console.log(data);
		$scope.campuslist = data;
		$scope.campusfileter = $scope.campuslist.filter(e=>e.id==$scope.userdata[0].campusid);
		$scope.campusName=$scope.campusfileter[0].campusName;
		$scope.insid=$scope.campusfileter[0].instId;
	});
	$http.get(apiurl + "Itinfrainstmasters").success(function (data) {
		// console.log(data);
		$scope.instmaster = data;
		$scope.insfileter = $scope.instmaster.filter(e=>e.instid==$scope.insid);
		$scope.instName=$scope.insfileter[0].institutename;
	});
	$scope.stockitem = [];
	$scope.showsubmit = 0;
	$scope.getitemname = function (itemgrp) {
		$http.get(apiurl + "ItInfraItems?filter=%7B%22where%22%3A%7B%22ititemgroup%22%3A%22" + itemgrp + "%22%7D%7D").success(function (data) {
			//console.log(data);
			$scope.totalitems = data;
			$scope.ticket.itItemId = data[0].ititemid;
			// let itItemGrpid = $scope.itemgrouplist.filter(e => e.ititemgrpname == data[0].ititemgroup);
			// $scope.ticket.itemgroupid = itItemGrpid[0].ititemgrpid;
		});

	}


	$scope.ItemLocation = function () {
		$http.get(apiurl + "ItInfraLocations").success(function (data) {
			//console.log(data);
			$scope.locationslist = data;
		});
	}

	$scope.InfraItems = function () {
		$http.get(apiurl + "ItInfraItemGroups").success(function (data) {
			//console.log(data);
			$scope.itemslist = data;
			$scope.stockitem.ititemgrpid = data[0].ititemgrpid;
		});
	}
	$scope.mongoid = "";
	$scope.filekey = "";
	$scope.mimetype = "";
	$scope.fileurl = "";
	$scope.uploadFile = function () {
		var file = $scope.myFile;
		var uploadUrl = filevault+"upload", //Url of webservice/api/server
			promise = fileUploadService.uploadFileToUrl(file, uploadUrl);

		promise.then(function (response) {
			console.log(response);
			// $scope.serverResponse = response;
			let sptoken = JSON.parse(sessionStorage.getItem('sptoken')).BearerToken;
			var string = sptoken + response._id;

			$scope.mongoid = response._id;
			$scope.mimetype = response.mimetype;
			// Encode the String
			$scope.filekey = $base64.encode(string);
			$scope.fileurl = filevault+"download/"+$scope.mongoid+"?key="+$scope.filekey
			
			// console.log($scope.filekey);
		}, function (res) {
			console.log(res);
			$scope.serverResponse = 'An error has occurred';
		})
	};
	$scope.showsubmit=0;
	$scope.createIndent = (item)=>{
		$scope.showsubmit=1;
		$http.get(apiurl+"Tickets?filter[order]=ticketnumber%20DESC&filter[limit]=1").success(function(data){
			//console.log(data);
			console.log($scope.tiketstatus);
			let tkstatus = $scope.tiketstatus.filter(e=>e.statustitle == "OPEN");
			//console.log(tkstatus);
			item.description = "#"+1+": "+item.description;
			item.ticketstatuscode = tkstatus[0].statuscode;
			item.ticketstatusdescription = tkstatus[0].statusdesciption;
			item.ticketstatustitle = tkstatus[0].statustitle;
			item.ticketuserid = $scope.userdata[0].useremail;
			item.ticketusername = $scope.userdata[0].username;
			item.ticketdate = $scope.mysqldate(new Date());
			item.ticketcreated = $scope.mysqldate(new Date());
			item.ticketnumber = data[0].ticketnumber+1;
			item.fileId = $scope.mongoid
			item.mimetype = $scope.mimetype
			item.campusName = $scope.campusName
			item.instName=$scope.instName
			
			console.log(item);
			let obj = {
				ticketinfo : item
			}
			$http.post(apiurl+'TicketMaster/raiseIndent', obj).success(function(data){
				//console.log(data);
				$scope.showsubmit=0;
				location.reload();
			}) 
		})
	}

	$scope.examdatechange = function (dt) {
		$scope.newDate = new Date(dt);
		return $scope.newDate
	}


});
