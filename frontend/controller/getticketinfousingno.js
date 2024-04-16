angular.module('stock').controller('getticketinfousingno',function($scope,$http,$timeout,$filter,$cookies,$window,$route,$rootScope,apiurl, fileUploadService, $base64, $sce){
	
 
		
	var apiurl = apiurl.getUrl();
	var filevault = "https://apis.aditya.ac.in/filevault/"
	let ticketno = $route.current.params.ticketno;
	$http.get(apiurl+'Ticketstatuses').success(function(data){
		//console.log(data);
		let datafilter = data.filter(e=>e.usreRole==$scope.userdata[0].usertype);
		//console.log(datafilter);
		if($scope.userdata[0].userLevel=="LabAssistant"){
			$http.get(apiurl+"Tickets?[filter][where][ticketnumber]="+ticketno+"").success(function(data){
				$scope.ticketslist = data.filter(e=>e.ticketstatustitle=='COMPLETED');
				if(data.length==0){
					$scope.tiketstatus = datafilter.filter(e=>e.statustitle=='OPEN');
				}else {
					if($scope.ticketslist.length==0){
						$scope.tiketstatus = datafilter.filter(e=>e.statustitle=='OPEN');
					} else {
						$scope.tiketstatus = datafilter.filter(e=>e.statustitle!='OPEN');
					}
				}
				
			});
			//console.log('test');
		} else {
			$scope.tiketstatus = datafilter;
		}
			
	})
	$scope.InstMaster = function(){
		$http.get(apiurl+"ItInfraInstMasters").success(function(data){
					//console.log(data);
					$scope.Instlist = data;
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
			//console.log(data);
			$scope.itemslist = data;
		});	
	}
	$scope.getvendorslist = function(){
		$http.get(apiurl+"Vendordetails").success(function(data){
					//console.log(data);
					$scope.vendorslist = data;
				});	
		 
		 }
	

	
	$scope.getticketsbyno = ()=>{
		//console.log(apiurl+"Tickets?[filter][where][ticketnumber]="+ticketno+"&filter[order]=ticketdate%20DESC");
		$http.get(apiurl+"Tickets?[filter][where][ticketnumber]="+ticketno+"").success(function(data){
			$scope.assethistory = data;
			
			for(let i=0; i<$scope.assethistory.length; i++){
				if($scope.assethistory[i].fileId!=null && $scope.assethistory[i].fileId!=''){
					let sptoken = JSON.parse(sessionStorage.getItem('sptoken')).BearerToken;
					var keystring = sptoken + $scope.assethistory[i].fileId;
					$scope.filekey = $base64.encode(keystring);
					$scope.assethistory[i].fileurl = filevault+"download/"+$scope.assethistory[i].fileId+"?key="+$scope.filekey
				} else {
					$scope.assethistory[i].fileurl = ""
				}
			}
			
			// for(let i=0; i<$scope.assethistory.length; i++){
			// 	$scope.assethistory[i].ticketcreated = new Date($scope.assethistory[i].ticketcreated).toISOString().slice(0, 19).replace('T', ' ');
			// 	$scope.assethistory[i].ticketdate = new Date($scope.assethistory[i].ticketdate).toISOString().slice(0, 19).replace('T', ' ');
			// }
		})
	}
	

	$scope.editdiv = 0;
	function sortByColumn(a, colIndex){

		a.sort(sortFunction);
	
		function sortFunction(a, b) {
			if (a[colIndex] === b[colIndex]) {
				return 0;
			}
			else {
				return (a[colIndex] < b[colIndex]) ? -1 : 1;
			}
		}
	
		return a;
	}
	$scope.showsubmit=0;
	$scope.mongoid = "";
	$scope.filekey = "";
	$scope.mimetype = "";
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
	$scope.sendticketsms = (obj) =>{
		// console.log(obj);
		$http.post("http://10.60.1.9:3006/api/sms/sendsms", obj).success(function(data){
			// console.log(data);
			return data;
		});	
	 } 
	$scope.updateTicketStatus = (item, val) =>{
		$scope.showsubmit=1;
		//let minrecored = sortByColumn($scope.assethistory, 'ticketid')
		//let getno = minrecored[0].description.split(":");
		let getno = $scope.assethistory[0].description.split(":");
		let tkstatus = $scope.tiketstatus.filter(e=>e.statustitle == val.statustitle);
		if(val.itempartname){
			let itempart = $scope.itemslist.filter(e=>e.ititemname == val.itempartname);
			item.partItemId = itempart[0].ititemid;
			item.partItemName = itempart[0].ititemname;
			item.partSerialNo = val.itempartserialno;
			item.sentvendor = val.sentvendor;
		}
		//let instname = $scope.instlist.filter(e=>e.instid==$scope.campusinfo[0].inst_id);
		item.description = getno[0] +": "+val.description;
		item.ticketstatuscode = tkstatus[0].statuscode;
		item.ticketstatusdescription = tkstatus[0].statusdesciption;
		item.ticketstatustitle = tkstatus[0].statustitle;
		item.ticketuserid = $scope.userdata[0].useremail;
		item.ticketusername = $scope.userdata[0].username;
		item.ticketdate = $scope.mysqldate(new Date());
		item.ticketnumber = item.ticketnumber;
		item.unoNumber = item.uno;
		item.assetId = item.assetid;
		item.assetLocationGroup= item.assetlocationgroup
		item.assetLocationName= item.assetlocationname
		item.campusName = item.campusname
		item.ItemGroupName = item.itemgroupname
		item.itemId= item.itemid
		item.ItemName=item.itemname
		item.fileId = $scope.mongoid
		item.mimetype = $scope.mimetype
		//console.log(item);
		let obj = {
			ticketinfo : item
		}
		// console.log(obj);

		$http.post(apiurl+'TicketMaster/raiseTicket', obj).success(function(data){
			//console.log(data);
			if(item.ticketstatustitle=='NOT COMPLETED' || item.ticketstatustitle=='CLOSE'){
				$http.get(apiurl+"ItInfraCampusMasters?filter=%7B%22where%22%3A%7B%22id%22%3A%22"+$scope.allotedcmp[0].id+"%22%7D%7D").success(function(toinfo){
					// console.log(userinfo);
					var userPhonesStr = toinfo[0].campusPhone.replace(/\s/g, '');
					// console.log(userPhones);
					let smsobj  = {
						"mobile": userPhonesStr,
						"senderid": "ADIACY",
						"message": "BRANCH "+item.campusName+" TICKET NO :"+item.ticketnumber+" STATUS "+item.ticketstatustitle+" IT DESK.ADITYA"
					}
					// console.log(smsobj);
					$scope.sendticketsms(smsobj);
					$scope.showsubmit=0;
					location.reload();
				}); 
			} else{
				$scope.showsubmit=0;
				location.reload();
			}
			
		}) 
	}

	$scope.clickonedit = (inf)=>{
		$scope.updatediv = 0;
		$scope.editdiv = 1;
		//console.log(inf);
		$scope.oneticketedit = inf;
		$scope.ticket = {
			statustitle : $scope.oneticketedit.ticketstatustitle,
			itempartname : $scope.oneticketedit.partitemname,
			itempartserialno : $scope.oneticketedit.partserialno,
			sentvendor : $scope.oneticketedit.sentvendor,
			description : $scope.oneticketedit.description,
			fileId : $scope.oneticketedit.fileId
		}
		$scope.fileurl = $scope.oneticketedit.fileurl;
	}

	$scope.editTicketStatus  = (stock, upval)=>{
		let tkstatus = $scope.tiketstatus.filter(e=>e.statustitle == upval.statustitle);
		let item = {
			assetid : stock.assetid,
			lastticketnumber : stock.ticketnumber,
			assetticketstatus : tkstatus[0].statustitle,
			assetticketdec : tkstatus[0].statusdesciption,
			ticketstatuscode : tkstatus[0].statuscode,
			description : upval.description,
			ticketdate : $scope.mysqldate(new Date()),
			ticketid : stock.ticketid
		}
		if(upval.itempartname){
			let itempart = $scope.itemslist.filter(e=>e.ititemname == upval.itempartname);
			item.partItemId = itempart[0].ititemid;
			item.partItemName = itempart[0].ititemname;
			item.partSerialNo = upval.itempartserialno;
			item.sentvendor = upval.sentvendor;
		}
		item.fileId = $scope.oneticketedit.fileId
		item.newfileId = $scope.mongoid
		item.mimetype = $scope.mimetype
		let obj = {
			ticketinfo : item
		}
		$http.post(apiurl+'TicketMaster/UpdateTicketbyId', obj).success(function(data){
			//console.log(data);
			location.reload();
		}) 
	}
	

});
