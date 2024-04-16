var httpInterceptor = function () {
	return {
		request: function (config) {
		  if(sessionStorage.getItem('sptoken')){
			var sesdata = JSON.parse(sessionStorage.getItem('sptoken'));
			config.headers["authorization"] = 'Bearer '+sesdata.BearerToken;
			return config		
		  } 
		}
	}
  };
var app = angular.module("stock", ["ngRoute","ngCookies","oc.lazyLoad","chieffancypants.loadingBar", "base64"]);
app.config(function ($httpProvider) {
	$httpProvider.interceptors.push(httpInterceptor)
  });
  
	app.directive("compareTo", function ()  
		{  
			return {  
				require: "ngModel",  
				scope:  
				{  
					repeatPassword: "=compareTo"  
				},  
				link: function (scope, element, attributes, paramval)  
				{  
					paramval.$validators.compareTo = function (val)  
					{  
						return val == scope.repeatPassword;  
					};  
					scope.$watch("repeatPassword", function ()  
					{  
						paramval.$validate();  
					});  
				}  
			};  
		});
	app.directive('repeatDone', function() {
		return function(scope, element, attrs) {
			if (scope.$last) { // all are rendered
				scope.$eval(attrs.repeatDone);
			}
		}
	})	
 app.service('apiurl', function () {
    //    var apipath = 'http://10.70.3.229:3002/api/';
		 var apipath = 'https://apis.aditya.ac.in/itinfra/';
		return {
			getUrl: function() {
				return apipath;
			}
		}
		
    });

app.service('analysiapi', function () {
		// var analysis = 'http://10.60.1.9:3006/api/';
		var analysis = 'https://apis.aditya.ac.in/analysis/';
		return {
			getUrl: function() {
				return analysis;
			}
		}
		 
	 });

	app.directive('demoFileModel', function ($parse) {
        return {
            restrict: 'A', //the directive can be used as an attribute only

            /*
             link is a function that defines functionality of directive
             scope: scope associated with the element
             element: element on which this directive used
             attrs: key value pair of element attributes
             */
            link: function (scope, element, attrs) {
                var model = $parse(attrs.demoFileModel),
                    modelSetter = model.assign; //define a setter for demoFileModel

                //Bind change event on the element
                element.bind('change', function () {
                    //Call apply on scope, it checks for value changes and reflect them on UI
                    scope.$apply(function () {
                        //set the model value
                        modelSetter(scope, element[0].files[0]);
                    });
                });
            }
        };
    });

	app.service('fileUploadService', function ($http, $q) {

        this.uploadFileToUrl = function (file, uploadUrl) {
            //FormData, object of key/value pair for form fields and values
            var fileFormData = new FormData();
            fileFormData.append('file', file);
			fileFormData.append('path', "/itinfra");
            var deffered = $q.defer();
            $http.post(uploadUrl, fileFormData, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}

            }).success(function (response) {
                deffered.resolve(response);

            }).error(function (response) {
                deffered.reject(response);
            });

            return deffered.promise;
        }
    });


	/*app.run(function($rootScope) {
         $rootScope.apipath = "http://api.aditya.ac.in:3009/api/";
      });*/
  app.filter('unique', function() {
   return function(collection, keyname) {
      var output = []; 
        angular.forEach(collection, function(item) {
			if(output.indexOf(item[keyname]) === -1) 
				output.push(item[keyname]);
      });
      return output;
   };
});
  
//   app.filter('sumByColumn', function () {
//       return function (collection, column) {
//         var total = 0;

//         collection.forEach(function (item) {
//           total += parseInt(item[column]);
//         });

//         return total;
//       };
//     });
	app.filter('sumByColumn', function() {
		return function(data, key) {
		  if (angular.isUndefined(data) || angular.isUndefined(key))
			return 0;
		  var sum = 0;
	
		  angular.forEach(data, function(v, k) {
			sum = sum + parseInt(v[key]);
		  });
		  return sum;
		}
	  })

	var $routeProviderReference;
	var currentRoute;
	app.config(function($routeProvider){
		$routeProviderReference = $routeProvider;
	});


app.controller('menu', function($scope,$http,$window, $filter, apiurl, analysiapi){

		if(!$window.sessionStorage.getItem('logindata')){
			window.location.assign("login.html");
		}
		var splkey = {BearerToken:'9cf742e6-4d25-4b73-acfe-648911a804e8'};
		$window.sessionStorage.setItem('sptoken',JSON.stringify(splkey));
		var apiurl = apiurl.getUrl();
	var analysis = analysiapi.getUrl();
	$scope.sendsms = (obj) =>{
			// console.log(obj);
			$http.post(analysis+"sms/sendsms", obj).success(function(data){
				console.log(data);
				return data;
			});	
		 }
		$scope.doTheBack = function() {
			window.history.back();
		  };
		$scope.userdata = JSON.parse($window.sessionStorage.getItem('logindata'));
			
			//console.log($window.sessionStorage.getItem('campusinfo'));
			$scope.campusinfo = JSON.parse($window.sessionStorage.getItem('campusinfo'));
			$scope.allotedcmp = JSON.parse($window.sessionStorage.getItem('allotedcmp'));
			if($scope.userdata[0].usertype==1){
				$scope.defaultid = $scope.allotedcmp[0].id;
			} else {
				$scope.defaultid = $scope.campusinfo[0].id;
			}
			
			//console.log($scope.campusinfo)
			
			
			$scope.campuchange = function(cid){
				//console.log(cid);
				let campusinfo = $scope.allotedcmp.filter(e=>e.id==cid);
				//console.log(campusinfo);
				window.sessionStorage.removeItem('campusinfo');
				$window.sessionStorage.setItem('campusinfo',JSON.stringify(campusinfo));
				//console.log(JSON.parse($window.sessionStorage.getItem('campusinfo')));
				location.reload()
				//window.location.href="#/userhome";
				
			}
			$scope.isttimemysql = (dt)=>{
				
				let newda = new Date(dt).toISOString().slice(0, 19).replace('T', ' ');
				let newdate = $filter('date')(new Date(newda), 'dd-MM-yyyy HH:mm');
				//console.log(newdate);
				return newdate;
			}
		
		$http.get(apiurl+'Itinfrainstmasters').success(function(data){
			$scope.instlist = data;
		})
		$scope.mysqldate = function(dt) {
			var date;
			date = dt;
			date = date.getFullYear() + '-' +
				('00' + (date.getMonth()+1)).slice(-2) + '-' +
				('00' + date.getDate()).slice(-2) + ' ' + 
				('00' + date.getHours()).slice(-2) + ':' + 
				('00' + date.getMinutes()).slice(-2) + ':' + 
				('00' + date.getSeconds()).slice(-2);
			return date;
		  }
		  $scope.examdatechange = function(dt)
		  {
		   $scope.newDate =new Date(dt);
		   return $scope.newDate
		  }  
		if($scope.userdata[0].usertype == 1){
			$scope.pertype = '/admin';
		}else if($scope.userdata[0].usertype == 2) {
			$scope.pertype = '/user';
		} else {
			$scope.pertype = '/labast';
		}
		
		var mymenustr =  $window.sessionStorage.getItem("menu");
		var mydata = JSON.parse(mymenustr);
		//console.log(mydata);
		var ctrljsarray=[];
		var k=0;	
		for(i=0;i<mydata.length;i++){
					for(j = 0; j < mydata[i].submenu.length; j++){
							if(mydata[i].submenu[j].controller.length!=0)
							ctrljsarray[k++]='controller/'+mydata[i].submenu[j].controller+'.js';
					}
		}				
		//console.log(ctrljsarray);
		
				if(mydata!=null){
				for(i=0;i<mydata.length;i++){
					var j = 0, currentRoute;
					for(j = 0; j < mydata[i].submenu.length; j++){
						
						currentRoute = mydata[i].submenu[j];
						
						$routeProviderReference
						.when(currentRoute.tag, {
							templateUrl: 'html/'+currentRoute.url,
							controller : currentRoute.controller,
							resolve: {
										loadMyCtrl: function($ocLazyLoad) {
											return $ocLazyLoad.load({files: ctrljsarray});
										}
									}		
						})
						.otherwise($scope.pertype+'home');                        
					}	
					//console.log(currentRoute);
			}
			$scope.mainmenu = mydata;
			$scope.logountnow =  function(){
				sessionStorage.clear()
				window.location.assign("login.html");
			
				}
		}else
			window.location.assign("login.html");
			
			 	
		
});
