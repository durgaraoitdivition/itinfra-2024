angular.module('stock').controller('upsticketupdate',function($scope,$http,$timeout,$filter,$cookies,$window,$route,$rootScope,apiurl, itnodeapi){
	
	var apiurl = apiurl.getUrl();
    var nodeapi = itnodeapi.getUrl();
	let ticketno = $route.current.params.ticketno;
    $scope.editdiv = 0;
    $scope.showsubmit=0;
    $scope.getTicketTimeline = function() {
        $http.get(nodeapi+"upstickets/ticketno/"+ticketno).then(response => {
            console.log(response)
            // var filtervendor = $scope.vendors.filter(e=>e.upsvname==response.data[0].companyName);
            // response.data[0].upsvid = filtervendor[0].upsvid
            $scope.tickettimeline = response.data;
            
        }).catch(function (data) {
            console.log(data)
        });
    };

    $scope.updateTicketStatus = function(obj) {
        var filtercampus= $scope.campusinfo.filter(e=>e.id==$scope.userdata[0].campusid);
        var finalobj = {
            ticketNo : $scope.tickettimeline[0].ticketNo,
            campus : filtercampus[0].campusName,
            status : obj.status,
            createdAt : $scope.tickettimeline[0].createdAt,
            description : obj.description,
            userId : $scope.userdata[0].useremail,
            companyName: $scope.tickettimeline[0].companyName,
            mobileNo: $scope.tickettimeline[0].mobileNo,
            alternateMobileNo: $scope.tickettimeline[0].alternateMobileNo,
            email :  $scope.tickettimeline[0].email
        }
        $http.post(nodeapi+"upstickets/", finalobj).then(response => {
            // console.log(response.data);
            // location.reload();
            window.location.href = 'index.html#/upstickets';
        }).catch(function (data) {
            console.log(data)
        });
    };
});
