angular.module('stock').controller('itemsbasedongroup',function($scope,$http,$filter,$cookies,$window,$route,$rootScope,apiurl){

		
			 
    var apiurl = apiurl.getUrl();
    
    //var apiurl = "http://10.60.1.19:3000/api/";
    
    // console.log($scope.userdata);
    
    let campusname = $route.current.params.campusname;
    let ItemGroupName = $route.current.params.ItemGroupName;
    let ItemName = $route.current.params.ItemName;
    let assetlocationgroup = $route.current.params.assetlocationgroup;
    let assetlocationname = $route.current.params.assetlocationname;

$scope.CampusMaster = function(){
$http.get(apiurl+"ItInfraCampusMasters").success(function(data){
            //console.log(data);
            $scope.campuslist = data;
        });	
 }


$scope.Campstockshow = 1;

$scope.campuStock = function(){
$http.get(apiurl+'dbreports/GetAssetsLimitedFileds?campusname="'+$scope.campusinfo[0].campusName+'"').success(function(data){
    //console.log(data);
    $scope.Campstockshow = 1;
    $scope.cmpwiselist = data;
    var indiaTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"});
    $scope.todate = new Date(indiaTime);
    
})
}

$scope.GetItemDetails = function(){
    //console.log(apiurl+"Assets?filter[where][campusname]="+campusname+"&filter[where][itemgroupname]="+ItemGroupName+"&filter[where][itemname]="+ItemName+"&filter[where][assetlocationgroup]="+assetlocationgroup+"&filter[where][assetlocationname]="+assetlocationname+"");
    
    if(!assetlocationname){
        assetlocationname=null;  
    }
    //console.log(assetlocationname);
    let obj = {
        groupdata : {
            campusname : campusname,
            itemgroupname: ItemGroupName,
            itemname: ItemName,
            assetlocationgroup : assetlocationgroup,
            assetlocationname : assetlocationname
        }
    }
    //console.log(obj);
    $http.post(apiurl+"TicketMaster/ItemsBasedonGroup", obj).success(function(data){
       // console.log(data)
        $scope.qtyitemlist = data;
    });    
    
    // $http.get(apiurl+"Assets?filter[where][campusname]="+campusname+"&filter[where][itemgroupname]="+ItemGroupName+"&filter[where][itemname]="+ItemName+"&filter[where][assetlocationgroup]="+assetlocationgroup+"&filter[where][assetlocationname]="+assetlocationname+"").success(function(data){
    //     //console.log(data);
    //     $scope.qtyitemlist = data;

    // })

    $http.get(apiurl+'Ticketstatuses').success(function(data){
       // console.log(data);
        let datafilter = data.filter(e=>e.usreRole==$scope.userdata[0].usertype);
        $scope.tiketstatus = datafilter.filter(e=>e.statustitle=='OPEN');
    })

}

$scope.showtk = 0;

$scope.raiseTicket = (info, idx)=>{
    $scope.showtk = 1;
    info.sno=idx;
    $scope.iteminfo = info;
}
$scope.sendticketsms = (obj) =>{
    // console.log(obj);
    $http.post("http://10.60.1.9:3006/api/sms/sendsms", obj).success(function(data){
        // console.log(data);
        return data;
    });	
 } 
$scope.showsubmit=0;
$scope.addTicket = (item, val)=>{
    $scope.showsubmit=1;
    console.log(item, val);
    $http.get(apiurl+"Tickets?filter[order]=ticketnumber%20DESC&filter[limit]=1").success(function(data){
        //console.log(data);
        let tkstatus = $scope.tiketstatus.filter(e=>e.statustitle == val.statustitle);
        //console.log(tkstatus);
        item.description = "#"+item.sno+": "+val.description;
        item.ticketstatuscode = tkstatus[0].statuscode;
        item.ticketstatusdescription = tkstatus[0].statusdesciption;
        item.ticketstatustitle = tkstatus[0].statustitle;
        item.ticketuserid = $scope.userdata[0].useremail;
        item.ticketusername = $scope.userdata[0].username;
        item.ticketdate = $scope.mysqldate(new Date());
        item.ticketcreated = $scope.mysqldate(new Date());
        if(data.length==0){
            item.ticketnumber = 101;
        } else {
            item.ticketnumber = data[0].ticketnumber+1;
        }
        
        // console.log(item);
        let obj = {
            ticketinfo : item
        }
        $http.post(apiurl+'TicketMaster/raiseTicket', obj).success(function(data){
            // console.log(data);
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
            
        }) 
    })
}


$scope.examdatechange = function(dt)
       {
        $scope.newDate =new Date(dt);
        return $scope.newDate
       }


});
