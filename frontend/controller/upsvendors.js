angular.module('stock').controller('upsvendors', function ($scope, $http, $filter, $cookies, $window, $route, $rootScope, apiurl, analysiapi, itnodeapi) {

    $scope.userdata = JSON.parse($window.sessionStorage.getItem('logindata'));

    //console.log($scope.userdata);
    var apiurl = apiurl.getUrl();
    var nodeapi = itnodeapi.getUrl()+'upsvendors/';
    $scope.vendors = [];
    $scope.vendor = {};
    
    $scope.loadVendors = function() {
        $http.get(nodeapi).then(response => {
            $scope.vendors = response.data;
        }).catch(function (data) {
            console.log(data)
        });
    };

    $scope.getVendor = function(id) {
        $http.get(nodeapi+"getbyid/"+id).then(response => {
            $scope.vendor = response.data[0];
        }).catch(function (data) {
            console.log(data)
        });
    };

    $scope.createVendor = function(obj) {
        if(obj.upsvid){
            $scope.updateVendor(obj.upsvid, obj)
        } else {
            $http.post(nodeapi, obj).then(response => {
                $scope.vendors.push(response.data);
                $scope.vendor = {};
            }).catch(function (data) {
                console.log(data)
            });
        }
    };

    $scope.updateVendor = function(id, obj) {
        $http.put(nodeapi+"update/"+id, obj).then(response => {
            $scope.loadVendors();
            $scope.vendor = {};
        }).catch(function (data) {
            console.log(data)
        });
    };

    $scope.deleteVendor = function(id) {
        $http.delete(nodeapi+"delete/"+id).then(response => {
            $scope.loadVendors();
        }).catch(function (data) {
            console.log(data)
        });
    };

})        