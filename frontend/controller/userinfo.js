angular.module('stock').controller('userinfo',function($scope,$http,$timeout,$filter, $cookies,$window,$route,$rootScope,apiurl){

			
		var apiurl = apiurl.getUrl();
		


		$scope.userPermissions = function(){
			$http.get(apiurl+"Userpermissions").success(function(data){
				//console.log(data);
				$scope.userpermission = data;
			});	
				
		}
		$scope.userList = [];
		$scope.ItInfraUsers = function(){
console.log(apiurl+"ItInfraUsers")
			$http.get(apiurl+"ItInfraUsers?filter=%7B%22where%22%3A%7B%22status%22%3A1%7D%7D").success(function(data){
				console.log(data);
				$timeout(function() {
					//$("#noCampaignData").hide();
					var rowCount = $("#userdata tr").length;
					//console.log("Row count value is"+rowCount);
					if (rowCount >= 0) {
					  // console.log("Entered into Sorting");
					   $("#userdata").dataTable({
							"bPaginate": true,
							"bLengthChange": true,
							"bFilter": true,
							"bSort": true,
							"bInfo": true,
							"bAutoWidth": true,
							"pageLength": 50
					   });
					}
				 }, 400)

				//$scope.userList = data.filter(e=>e.status==1);
$scope.userList = data;
			});	
			 
		}
		
		$scope.CampusMaster = function(){
			$http.get(apiurl+"ItInfraCampusMasters").success(function(data){
					//console.log(data);
					$scope.campuslist = data;
				});	
		 }
		 $scope.edituser = (uid)=>{
			$http.get(apiurl+"Itinfrausers?filter=%7B%22where%22%3A%7B%22userid%22%3A"+uid+"%7D%7D").success(function(data){
				console.log(data);
				$scope.user = data[0];
				$scope.user.campusid = $scope.user.campusid.split(",");
			});	
		}
		 
		 $scope.addUser = function(userdata){
			 console.log(userdata);
			 if(!userdata.userid){
				let userperm = $scope.userpermission.filter(e=>e.permlevel==userdata.userLevel);
				var cmpids = userdata.campusid.toString();
				userdata.userid = 0;
				userdata.campusid = cmpids;
				userdata.userLevel = userperm[0].permlevel
				userdata.usertype = userperm[0].permtype
				//console.log(userdata);
				$http.post(apiurl+"ItInfraUsers", userdata).success(function(data){
					console.log(data);
					location.reload()
				});
			 } else {
				//console.log(userdata);
				let userperm = $scope.userpermission.filter(e=>e.permlevel==userdata.userLevel);
				var cmpids = userdata.campusid.toString();
				let obj = {
							"userid": userdata.userid,
							"username": userdata.username,
							"useremail": userdata.useremail,
							"userphone": userdata.userphone,
							"userpwd": userdata.userpwd,
							"campusid": cmpids,
							"usertype": userperm[0].permtype,
							"userLevel": userperm[0].permlevel
						   }
					console.log(obj);	   
				$http.post(apiurl+"ItInfraUsers/update?where=%7B%22userid%22%3A"+userdata.userid+"%7D",obj).success(function(data){
					console.log(data);
					location.reload()
				});
			 }
			
			 
		 }
		
		

		$scope.deluser = function(uid){
			///console.log(uid);
			$http.delete(apiurl+"ItInfraUsers/"+uid).success(function(data){
				var result = confirm("Want to delete?");
				if (result == true) {
					window.location.href = 'index.html#/addusers';
				}
			});
		}

		
 $scope.examdatechange = function(dt)
			   {
				$scope.newDate =new Date(dt).toISOString().slice(0, 19).replace('T', ' ');
				return $scope.newDate
			   }

 });
