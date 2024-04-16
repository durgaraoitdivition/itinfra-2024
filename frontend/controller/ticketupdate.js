angular.module('stock').controller('ticketupdate',function($scope,$http,$filter,$cookies,$window,$route,$rootScope,apiurl){
	
    var apiurl = apiurl.getUrl();
    $scope.assetid = $route.current.params.assetid;
    $scope.getticketsbyno = ()=>{
        $http.get(apiurl+"Tickets?filter=%7B%22where%22%3A%7B%22assetid%22%3A"+$scope.assetid+"%7D%7D").success(function(data){
            console.log(data);
            $scope.assethistory = data;
           
            let maxrecordsid = (Math.max.apply(Math, $scope.assethistory.map(function(o) {
                  return o.ticketnumber;
                })));
            $scope.maxrecord = $scope.assethistory.filter(e=>e.ticketnumber == maxrecordsid);
        })
        $http.get(apiurl+'Ticketstatuses').success(function(data){
            console.log(data);
            $scope.tiketstatus = data;
        })
    }
    
   
    
    $scope.updateTicketStatus = (item, val) =>{
        
        
        let tkstatus = $scope.tiketstatus.filter(e=>e.statustitle == val.statusTitle);
        //let instname = $scope.instlist.filter(e=>e.instid==$scope.campusinfo[0].inst_id);
        item.description = val.description;
        item.ticketstatuscode = tkstatus[0].statuscode;
        item.ticketstatusdescription = tkstatus[0].statusdesciption;
        item.ticketstatustitle = tkstatus[0].statustitle;
        item.ticketuserid = $scope.userdata[0].userid;
        item.ticketusername = $scope.userdata[0].useremail;
        item.ticketdate = $scope.mysqldate(new Date());
        item.institutename = item.itemgroupname;
        item.ticketnumber = item.ticketnumber;
        console.log(item);
        let obj = {
            ticketinfo : item
        }
        $http.post(apiurl+'TicketMaster/raiseTicket', obj).success(function(data){
            console.log(data);
        }) 
    }

    

});   