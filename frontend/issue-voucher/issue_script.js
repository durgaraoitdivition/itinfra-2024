var app = angular.module("itinfra", []);

app.controller('receipt', function($scope, $http, $filter) {
    // let apipath = 'http://10.70.3.73:6600/'; 
    var apipath = 'https://apis.aditya.ac.in/itinfra24/';
        
    // Get the URL of the current page
    const url = new URL(window.location.href);

    // Get the value of the 'refid' parameter
    $scope.userid = url.searchParams.get('refid');
    const refid = $scope.userid.split("-")[0];
    // console.log(refid)
	$http.get(apipath+"order/details/"+refid).success(function(data){
        // console.log(data)
        $scope.orderdata = data;
    })
    $scope.confirm = false;
    $scope.confromcheck = (val) =>{
        $scope.confirm = val;  
    }
    $scope.submitRecieved = (shipmentCode) =>{
        var obj = {shipmentCode}
        var result = confirm("Are you sure you received this order?");
			if (result) {
                $http.post(apipath+"order/updatefromsms/", obj).success(function(data){
                    // console.log(data);
                    location.reload();
                })
            }    
    }

    $scope.examdatechange = function(dt)
			   {
				$scope.newDate =new Date(dt);
				return $scope.newDate
			   }
});