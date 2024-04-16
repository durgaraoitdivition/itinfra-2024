angular.module('stock').controller('totaltickets',function($scope,$http,$filter,$cookies,$window,$route,$rootScope,apiurl){
	
 
		
    var apiurl = apiurl.getUrl();
    //console.log($scope.userdata);
    	
    $scope.campuslist = JSON.parse($window.sessionStorage.getItem('campusinfo'));
	console.log($scope.campuslist); 
    
	$scope.joinkeyvalues = (titles, numbers) =>{
		var result = numbers.reduce(function (result, field, index) {
			result[titles[index]] = field;
			return result;
		}, {})
		return result;
	}
	$scope.showdiv  = 0;
	$scope.currentdate = ()=>{
		let currentdate = new Date();
		let yesterday = currentdate.setDate(currentdate.getDate() - 1)
		$scope.startdate = new Date(currentdate.setDate(currentdate.getDate()));
		$scope.enddate = new Date();
		//console.log(info);
		let filteraltscmp = $scope.campuslist.filter(e=>e.instId==3)
		var result = filteraltscmp.map(function(val) {
			return val.campusName;
		 }).join(',');
		
		var finalresult = '\'' + result.split(',').join('\',\'') + '\'';

		let startdate = $filter('date')(yesterday, 'yyyy-MM-dd');
		let enddate = $filter('date')(new Date(), 'yyyy-MM-dd');
		let obj = {
			alloteddatefilter : {
				altcampuses : finalresult,
				startdate : startdate,
				enddate : enddate
			}
		}
		console.log(obj);
		$http.post(apiurl+"TicketMaster/TicketsBetweenDatesbyAlt", obj).success(function(data){
           // console.log(data);
			let finalobj = [];
            for(let i=0; i<data.length; i++){
				finalobj[i] = {
					campusName : data[i].campusName,
					objvalues : $scope.joinkeyvalues(data[i].titles.split(","), data[i].numbers.split(","))
				} 
				finalobj[i].CLOSE=finalobj[i].objvalues.CLOSE;
				finalobj[i].OPEN=finalobj[i].objvalues.OPEN;
				finalobj[i].COMPLETED=finalobj[i].objvalues.COMPLETED;
				finalobj[i].PARTREADY=finalobj[i].objvalues.PARTREADY;
				finalobj[i].PARTREQUIRED=finalobj[i].objvalues.PARTREQUIRED;
				finalobj[i].SERVICE=finalobj[i].objvalues.SERVICE;

			}
			//console.log(finalobj);
			$scope.tickettypes = finalobj;
        });	
		
	}
	$scope.ticketsbtdate = ()=>{
		let filteraltscmp = $scope.campuslist.filter(e=>e.instId==3)
		var result = filteraltscmp.map(function(val) {
			return val.campusName;
		 }).join(',');
		
		var finalresult = '\'' + result.split(',').join('\',\'') + '\'';
		let startdate = $filter('date')(new Date($scope.startdate), 'yyyy-MM-dd');
		let enddate = $filter('date')(new Date($scope.enddate), 'yyyy-MM-dd');
		let obj = {
			alloteddatefilter : {
				altcampuses : finalresult,
				startdate : startdate,
				enddate : enddate
			}
		}
		console.log(startdate, enddate);
		$http.post(apiurl+"TicketMaster/TicketsBetweenDatesbyAlt", obj).success(function(data){
            //console.log(data);
			let finalobj = [];
            for(let i=0; i<data.length; i++){
				finalobj[i] = {
					campusName : data[i].campusName,
					objvalues : $scope.joinkeyvalues(data[i].titles.split(","), data[i].numbers.split(","))
				} 
				finalobj[i].CLOSE=finalobj[i].objvalues.CLOSE;
				finalobj[i].OPEN=finalobj[i].objvalues.OPEN;
				finalobj[i].COMPLETED=finalobj[i].objvalues.COMPLETED;
				finalobj[i].PARTREADY=finalobj[i].objvalues.PARTREADY;
				finalobj[i].PARTREQUIRED=finalobj[i].objvalues.PARTREQUIRED;
				finalobj[i].SERVICE=finalobj[i].objvalues.SERVICE;

			}
			//console.log(finalobj);
			$scope.tickettypes = finalobj;
        });	
		
	}
 	$scope.isttimemysql = (dt)=>{
		let newda = new Date(dt).toISOString().slice(0, 19).replace('T', ' ');
		let newdate = $filter('date')(new Date(newda), 'dd-MM-yyyy HH:mm');
		return newdate;
	}

	$scope.gettitlewiselist = (campus, title, startdt, enddt) =>{
		//console.log(campus, title, startdt, enddt);
		$scope.showdiv  = 1;
		let obj = {
			filtertitledata : {
				campus : campus,
				titlename : title,
				startdate : $filter('date')(new Date(startdt), 'yyyy-MM-dd'),
				enddate : $filter('date')(new Date(enddt), 'yyyy-MM-dd')
			}
		}
		$http.post(apiurl+"TicketMaster/FilterTitleDatesinTickets", obj).success(function(data){
			//console.log(data);
			$scope.totaltickets = data;
		});
	}

        


});
