angular.module('stock').controller('adminpendingtickets',function($scope,$http,$timeout,$filter,$cookies,$window,$route,$rootScope,apiurl){
	
 
		
	var apiurl = apiurl.getUrl();
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
	$scope.totaltikets = ()=>{
		$http.get(apiurl+"TicketMaster/TotalTicketDatainAssets").success(function(data){
			//console.log(data);
			//data = data.filter(e=>e.ticketStatusCode!=0)
			$timeout(function() {
				//$("#noCampaignData").hide();
				var rowCount = $("#ticketdata tr").length;
				//console.log("Row count value is"+rowCount);
				if (rowCount >= 0) {
				  // console.log("Entered into Sorting");
				   $("#ticketdata").dataTable({
						"bPaginate": true,
						"bLengthChange": true,
						"bFilter": true,
						"bSort": true,
						"bInfo": true,
						"bAutoWidth": true
				   });
				}
			 }, 400)
			let filterdata = data.filter(e=>e.assetTicketStatus=='PARTREQUIRED' || e.assetTicketStatus=='REPLACEMENT')
			$scope.totaltickets = filterdata;
			console.log($scope.totaltickets);
			$http.get(apiurl+'Ticketstatuses').success(function(data){
				//console.log(data);
				let datafilter = data.filter(e=>e.usreRole==$scope.userdata[0].usertype);
					$scope.tiketstatus = datafilter;
			})
		})
	}

	$scope.filtertickets = (campus)=>{
		$http.get(apiurl+"TicketMaster/TicketDatainAssets?campusname="+campus).success(function(data){
			$timeout(function() {
				//$("#noCampaignData").hide();
				var rowCount = $("#ticketdata tr").length;
				//console.log("Row count value is"+rowCount);
				if (rowCount >= 0) {
				  // console.log("Entered into Sorting");
				   $("#ticketdata").dataTable({
						"bPaginate": true,
						"bLengthChange": true,
						"bFilter": true,
						"bSort": true,
						"bInfo": true,
						"bAutoWidth": true
				   });
				}
			 }, 400)
			 
			$scope.totaltickets = data;
			console.log($scope.totaltickets);
			// for(let i=0; i<$scope.totaltickets.length; i++){
			// 	$scope.totaltickets[i].ticketCreated = new Date($scope.totaltickets[i].ticketCreated).toISOString().slice(0, 19).replace('T', ' ');
			// 	$scope.totaltickets[i].ticketDate = new Date($scope.totaltickets[i].ticketDate).toISOString().slice(0, 19).replace('T', ' ');
			// }
		})
	}
	
	$scope.getticketsbyno = (tkno)=>{
		$scope.showdiv = 2;	
		$http.get(apiurl+"Tickets?filter=%7B%22where%22%3A%7B%22ticketnumber%22%3A%22"+tkno+"%22%7D%7D").success(function(data){
			//console.log(data);
			$scope.assethistory = data;
		})
	}
	

	$scope.editdiv = 0;

	
	$scope.updateTicketStatus = (item, val) =>{
		
		let tkstatus = $scope.tiketstatus.filter(e=>e.statustitle == val.statustitle);
		if(val.itempartname){
			let itempart = $scope.itemslist.filter(e=>e.ititemname == val.itempartname);
			item.partItemId = itempart[0].ititemid;
			item.partItemName = itempart[0].ititemname;
			item.partSerialNo = val.itempartserialno;
		}
		//let instname = $scope.instlist.filter(e=>e.instid==$scope.campusinfo[0].inst_id);
		item.description = val.description;
		item.ticketstatuscode = tkstatus[0].statuscode;
		item.ticketstatusdescription = tkstatus[0].statusdesciption;
		item.ticketstatustitle = tkstatus[0].statustitle;
		item.ticketuserid = $scope.userdata[0].useremail;
		item.ticketusername = $scope.userdata[0].username;
		item.ticketdate = $scope.mysqldate(new Date());
		item.ticketnumber = item.ticketnumber;
		
		//console.log(item);
		let obj = {
			ticketinfo : item
		}
		$http.post(apiurl+'TicketMaster/raiseTicket', obj).success(function(data){
			//console.log(data);
			location.reload();
		}) 
	}

	$scope.clickonedit = (inf)=>{
		$scope.updatediv = 0;
		$scope.editdiv = 1;
		console.log(inf);
		$scope.oneticketedit = inf;
		$scope.ticket = {
			statustitle : $scope.oneticketedit.ticketstatustitle,
			description : $scope.oneticketedit.description
		}
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
			ticketid : stock.ticketid
		}
		let obj = {
			ticketinfo : item
		}
		$http.post(apiurl+'TicketMaster/UpdateTicketbyId', obj).success(function(data){
			//console.log(data);
			location.reload();
		}) 
	}
		


});
