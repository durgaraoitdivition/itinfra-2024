angular.module('stock').controller('uploadscancopy',function($scope,$http,$filter,$cookies,$window,$route,$rootScope,apiurl){

		
			 
			var apiurl = apiurl.getUrl();
			
			//var apiurl = "http://10.60.1.19:3000/api/";
			
			
			
			$scope.Allottids = function(){
				//console.log($scope.userdata[0].campusid);
				var altid = $scope.userdata[0].campusid;
				$http.get(apiurl+"dbreports/allottedCampus?allottedids="+altid).success(function(data){
					//console.log(data);
					$scope.allotedcmp = data;
				});	
			}

 

 });
