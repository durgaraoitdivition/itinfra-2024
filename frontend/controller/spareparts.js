angular.module('stock').controller('spareparts',function($scope,$http,$filter, $cookies,$window,$route,$rootScope,apiurl){

    var apiurl = apiurl.getUrl();

    $scope.mysqldate = function(dt) {
        var date;
        date = dt;
        date = date.getFullYear() + '-' +
            ('00' + (date.getMonth()+1)).slice(-2) + '-' +
            ('00' + date.getDate()).slice(-2);
        return date;
      } 
    
      $scope.showdiv = 0;
    $scope.sparepartsreport =(info)=>{
        if(info.reporttype=="OverAll"){
            var branchwise =  "No"  
        } else {
            var branchwise =  "Yes"
        }
        let obj = {
                    "startdate" : $scope.mysqldate(info.startdate),
                    "enddate" : $scope.mysqldate(info.enddate),
                    branchwise
                }
                console.log(obj);
        $http.post(apiurl+"dbreports/sparePartList",obj).success(function(data){
            console.log(data);
            $scope.showdiv = 1;
            $scope.sparepartslist = data.filter(e=>e.institutename=="DEGREE COLLEGE" && e.campusName!="ADPGMSC" && e.campusName!="AIPGS" );
        });        
    }

    $scope.repairsys =()=>{
        
        let obj = {
                    "itemName" : "Desktop",
                    "campusName" : "All"
                }
        $http.post(apiurl+"dbreports/repairedcount",obj).success(function(data){
            console.log(data);
            $scope.showdiv = 1;
            $scope.repairsyslist = data.filter(e=>e.institutename=="DEGREE COLLEGE" && e.campusName!="ADPGMSC" && e.campusName!="AIPGS");
        });        
    }

});