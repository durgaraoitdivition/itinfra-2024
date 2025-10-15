angular.module('stock').controller('upstickets', function ($scope, $http, $filter, $cookies, $window, $route, $rootScope, apiurl, analysiapi, itnodeapi) {

    $scope.userdata = JSON.parse($window.sessionStorage.getItem('logindata'));

    // console.log($scope.userdata);
    var apiurl = apiurl.getUrl();
    var nodeapi = itnodeapi.getUrl();
    $scope.tickets = [];

    $http.get(nodeapi+"upsvendors").then(response => {
        // console.log(response)
        $scope.vendors = response.data;
    }).catch(function (data) {
        console.log(data)
    });
    $scope.statuscode = "OPEN"
    $scope.loadTickets = function() {
        if($scope.userdata[0].userLevel=='Admin'){
            $http.get(nodeapi+'upstickets/').then(response => {
                console.log(response)
                $scope.totalticektes = response.data
                $scope.tickets = response.data.filter(e=>e.status!='COMPLETED');
            }).catch(function (data) {
                console.log(data)
            });
        } else {
            $http.get(nodeapi+'upstickets/user/'+$scope.userdata[0].useremail).then(response => {
                console.log(response)
                $scope.totalticektes = response.data
                $scope.tickets = response.data.filter(e=>e.status!='COMPLETED');
            }).catch(function (data) {
                console.log(data)
            });
        }
            
    };

    $scope.statuswisetickets = (statuscode) =>{
        if(statuscode=='ALL'){
            $scope.tickets = $scope.totalticektes
        } else {
            $scope.tickets = $scope.totalticektes.filter(e=>e.status==statuscode)
        }
        
    }

    $scope.getVendor = function(id) {
        $http.get(nodeapi+"upsvendors/getbyid/"+id).then(response => {
            // console.log(response.data)
            var venderinfo = response.data[0];
            $scope.ticket = { 
                upsvid : venderinfo.upsvid,
                companyName : venderinfo.upsvname,
                address : venderinfo.upsvcity,
                mobileNo : venderinfo.upsvphone,
                email : venderinfo.upsvemail
            }
        }).catch(function (data) {
            console.log(data)
        });
    };

    $scope.getTicket = function(id) {
        $http.get(nodeapi+"upstickets/getbyid/"+id).then(response => {
            // console.log(response)
            var filtervendor = $scope.vendors.filter(e=>e.upsvname==response.data[0].companyName);
            response.data[0].upsvid = filtervendor[0].upsvid
            $scope.ticket = response.data[0];
            
        }).catch(function (data) {
            console.log(data)
        });
    };
    // console.log($scope.campusinfo)
    $scope.createTicket = function(obj) {
        obj.userId = $scope.userdata[0].useremail
        if(obj.utid){
            $scope.updateTicket(obj.utid, obj)
        } else {
            $http.get(nodeapi+"upstickets/latesttid/").then(response => {
                console.log(response.data)
                if(response.data.length>0){
                    obj.ticketNo = response.data[0].ticketNo+1
                } else {
                    obj.ticketNo = 1001
                }
                
                var filtercampus= $scope.campusinfo.filter(e=>e.id==$scope.userdata[0].campusid);
                obj.campus = filtercampus[0].campusName
                obj.status = "OPEN";
                $http.post(nodeapi+"upstickets/", obj).then(response => {
                    // console.log(response.data)
                    $scope.loadTickets()
                    $scope.ticket = {}
                }).catch(function (data) {
                    console.log(data)
                });
            }).catch(function (data) {
                console.log(data)
            });
            
        }
    };

    $scope.updateTicket = function(id, obj) {
        $http.put(nodeapi+"upstickets/update/"+id, obj).then(response => {
            $scope.loadTickets();
            $scope.ticket = {};
        }).catch(function (data) {
            console.log(data)
        });
    };

    $scope.deleteTicket = function(id) {
        $http.delete(nodeapi+"upstickets/delete/"+id).then(response => {
            $scope.loadtickets();
        }).catch(function (data) {
            console.log(data)
        });
    };

})        