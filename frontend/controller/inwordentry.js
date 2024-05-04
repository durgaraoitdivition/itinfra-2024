angular.module('stock').controller('inwordentry',function($scope,$http,$filter, $cookies,$window,$route,$rootScope,apiurl, itnodeapi){


    var apiurl = apiurl.getUrl();
    var itinfra = itnodeapi.getUrl();
    
    $scope.adshipid=$route.current.params.adshipid;
    
    // console.log($scope.userdata);
    
    
    //var apiurl = "http://10.60.1.19:3000/api/";

    $scope.inwordshow = 0;
    $scope.CampusMaster = function(){
        $http.get(apiurl+"ItInfraCampusMasters").success(function(data){
                    //console.log(data);
                    $scope.campuslist = data;
                });	
         }
    
    $scope.vendormaster = function(){
        $http.get(apiurl+"Vendordetails").success(function(data){
            //console.log(data);
            $scope.vendorslist = data;
        });	
    }
                     
    $scope.getcmplist = function(insid){
        $http.get(apiurl+"ItInfraCampusMasters?filter=%7B%22where%22%3A%7B%22instId%22%3A%22"+insid+"%22%7D%7D").success(function(data){
                    //console.log(data);
                    $scope.getcampuslist = data;
                });	
         }
 
    $scope.InstMaster = function(){
        $http.get(apiurl+"ItInfraInstMasters").success(function(data){
                    //console.log(data);
                    $scope.Instlist = data;
                });	
         }
 
    $scope.InfraItems = function(){
        $http.get(apiurl+"TicketMaster/itemsgroupby").success(function(data){
                    //console.log(data);
                    
                    $scope.itemslist = data;
                    
                });	
         }
         
    $scope.getitemname = function(itemgrp){
        $http.get(apiurl+"ItInfraItems?filter=%7B%22where%22%3A%7B%22ititemgroup%22%3A%22"+itemgrp+"%22%7D%7D").success(function(data){
                    //console.log(data);
                    $scope.totalitems = data;
                });	
 
     }
    
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
      $scope.msg = '';
    $scope.addItem = function(itemdata){
        
           itemdata.ititemid = 0;
           $http.post(apiurl+"Itinfraitems", itemdata).success(function(data){
               // console.log(data);
               $scope.msg = "Item added successfully";
               $scope.item.ititemgroup = '';
               $scope.item.ititemname = '';
               $scope.item.ititemcode = '';
               $scope.item.assettype = '';
            //    $('addItItem').modal('toggle');
               $scope.InfraItems();
            //    location.reload()
           });
        
    }
    
    
    $scope.sippeditems = [];
    $scope.receiveddate = new Date();


$scope.addInword = function (obj) {

    

    $http.get(apiurl+"dbreports/LastShipId").success(function(data){
        // console.log(data);
        $scope.lastshipid = parseInt(data[0].ADSHPid);
        // console.log(obj.campusname);
        if(obj.campusname!=undefined){
            $http.get(apiurl+"ItInfraCampusMasters?filter=%7B%22where%22%3A%7B%22campusName%22%3A%22"+obj.campusname+"%22%7D%7D").success(function(cinfo){
                // console.log(cinfo);
                $scope.todetail = cinfo;
                $http.get(apiurl+"dbreports/UserInfobyCPid?CampusId="+cinfo[0].id).success(function(userinfo){
                    console.log(userinfo);
                    $scope.tonumber = userinfo.filter(e=>e.UserType==2);
                    var additem = {
                        /*SNo: $scope.sippeditems.length+1,*/
                        shipid : 0,
                        shipmentType : "Inward",
                        neworold : obj.neworold,
                        branchorvendor : obj.branchorvendor,
                        adshpid : $scope.lastshipid+1,
                        campusid : $scope.allotedcmp[0].id,
                        instid : $scope.allotedcmp[0].instId,
                        campusname : $scope.allotedcmp[0].campusName,
                        itemgroup : obj.ititemgroup,
                        itemname : obj.ititemname,
                        quantity : obj.qunatityNo,
                        senderCampusId : cinfo[0].id,
                        SenderName: obj.campusname,
                        senderid : $scope.tonumber[0].userId,
                        ReceiverId : $scope.userdata[0].userid,
                        useremail : $scope.userdata[0].useremail,
                        userphone : $scope.userdata[0].userphone,
                        currentdate : new Date(),
                        receiveddate : $scope.receiveddate,
                        received : parseInt(obj.Received)
                    };
                    $scope.sippeditems.push(additem);
                    $scope.it.qunatityNo = 0;
                    $scope.it.ititemgroup = '';
                    $scope.it.ititemname = '';
                    //console.log($scope.sippeditems);
                });	
            });
        } else {
            var venderinfo = $scope.vendorslist.filter(e=>e.vname==obj.vendorName);
            console.log(venderinfo);
            var additem = {
                /*SNo: $scope.sippeditems.length+1,*/
                shipid : 0,
                neworold : obj.neworold,
                branchorvendor : obj.branchorvendor,
                shipmentType : "Inward",
                adshpid : $scope.lastshipid+1,
                campusid : $scope.allotedcmp[0].id,
                instid : $scope.allotedcmp[0].instId,
                campusname : $scope.allotedcmp[0].campusName,
                vendorName : obj.vendorName,
                itemgroup : obj.ititemgroup,
                itemname : obj.ititemname,
                quantity : obj.qunatityNo,
                senderCampusId : venderinfo[0].vid,
                SenderName: venderinfo[0].vname,
                senderid : venderinfo[0].vid,
                ReceiverId : $scope.userdata[0].userid,
                useremail : $scope.userdata[0].useremail,
                userphone : $scope.userdata[0].userphone,
                currentdate : new Date(),
                receiveddate : $scope.receiveddate,
                received : parseInt(obj.Received)
            };
            $scope.sippeditems.push(additem);
            $scope.it.qunatityNo = 0;
            $scope.it.ititemgroup = '';
            $scope.it.ititemname = '';
        }
        
    });
}

$scope.removeRow = function (index) {
    //Find the record using Index from Array.
    var name = $scope.sippeditems[index].itemname;
    if ($window.confirm("Do you want to delete: " + name)) {
        //Remove the item from Array using Index.
        $scope.sippeditems.splice(index, 1);
    }
}

$scope.itemssubmit = function(itm,crf){
    ///itm.forEach(function(v){ delete v.SNo });
    
    for(var i=0; i<itm.length; i++){
        itm[i].couriername =  crf.couriername;
        itm[i].crrefno =  crf.crrefno;
        itm[i].shipmentmsg = crf.infomsg;
    }
    // console.log(itm);
    $http.post(apiurl+"ItInfraShipments",itm).success(function(data){
        // console.log(data);
    	// window.location.href = "index.html#/trackshipment"
        location.reload()
    });
    
}
$scope.printdiv = (branch, sendercmpid, shipid, couriername) =>{
    // console.log(sendercmpid);
    $http.get(apiurl+"ItInfraCampusMasters?filter=%7B%22where%22%3A%7B%22campusName%22%3A%22"+branch+"%22%7D%7D").success(function(cinfo){
        // console.log(cinfo);
        $scope.todetail = cinfo;
        $http.get(apiurl+"dbreports/UserInfobyCPid?CampusId="+cinfo[0].id).success(function(userinfo){
            //console.log(userinfo);
            $scope.tonumber = userinfo;
            $http.get(apiurl+"ItInfraShipments?filter=%7B%22where%22%3A%7B%22adshpid%22%3A%22"+shipid+"%22%7D%7D").success(function(data){
                // console.log(data);
                    if(data.length>0){
                        $http.get(apiurl+"ItInfraCampusMasters?filter=%7B%22where%22%3A%7B%22id%22%3A%22"+sendercmpid+"%22%7D%7D").success(function(frominfo){
                            // console.log(frominfo);
                            $scope.fromadress = frominfo;
                            $scope.adidwiselist = data;	
                            $scope.couriername = couriername;
                            $scope.shipmentid = shipid;
                            setTimeout(() => {
                                window.print()
                            }, 1000);
                        });
                        
                        // window.print()	
                    }
            });
        });	
    });
    
}

    
$scope.cmpwiseshiplist = function(){
    // console.log($scope.campusinfo);
    if($scope.userdata[0].usertype==1){
        var cmpid = defaultid = $scope.userdata[0].campusid;
    } else {
        var cmpid = $scope.campusinfo[0].id;
    }
        $http.get(apiurl+"ItInfraShipments?filter=%7B%22where%22%3A%7B%22campusid%22%3A%22"+cmpid+"%22%7D%7D").success(function(data){
                    // console.log(data);
                    $scope.cmpshiplist = data;
                    const resultArray = data.map(item => ({
                        itemgroup: item.itemgroup,
                        itemname: item.itemname,
                        quantity: item.quantity,
                        adshpid : item.adshpid
                    }));
                    $scope.cmpunqshipids = $filter('unique')($scope.cmpshiplist,'adshpid');
                    //console.log($scope.cmpunqshipids);
                    $scope.finalarray = [];
                    
                    for(var x=0;x<$scope.cmpunqshipids.length;x++){
                        
                        //console.log($scope.unqshipids[x]);
                        var cmpuniqcount=0;
                        var nwbranch = '';
                        for(var i=0; i<$scope.cmpshiplist.length; i++){
                            //console.log($scope.shiplist[i].quantity);
                            if($scope.cmpunqshipids[x]==$scope.cmpshiplist[i].adshpid){
                                  cmpuniqcount = cmpuniqcount+$scope.cmpshiplist[i].quantity;
                                  nwbranch = $scope.cmpshiplist[i].campusname;
                                  CampusId = $scope.cmpshiplist[i].campusid;
                                  crrefno = $scope.cmpshiplist[i].crrefno;
                                  CourierName = $scope.cmpshiplist[i].couriername
                                  curdate = $scope.cmpshiplist[i].currentdate;
                                  receiveddate = $scope.cmpshiplist[i].receiveddate;
                                  status = $scope.cmpshiplist[i].received;
                                  senderCampusId = $scope.cmpshiplist[i].senderCampusId
                                  SenderName = $scope.cmpshiplist[i].SenderName
                                  items = resultArray.filter(e=>e.adshpid==$scope.cmpshiplist[i].adshpid)
                            }
                            
                        }
                    
                     //console.log(status);
                                           
                        $scope.finalarray[x] = {
                            "Branch": nwbranch,
                            "CampusId" : CampusId,
                            "Shipmentid": $scope.cmpunqshipids[x],
                            "Itemcount" : cmpuniqcount,
                            "CourierName" : CourierName,
                            "CurPickId" : crrefno,
                            "CurrentDate" : curdate,
                            "receiveddate" : receiveddate,
                            "Status" : status,
                            "senderCampusId" : senderCampusId,
                            "SenderName" : SenderName,
                            items,
                        }
                    
                    }
                    
                    // console.log($scope.finalarray);
                    // $scope.listofshipped = (itemid) =>{
                    //     $scope.cmpunqshipids = $scope.cmpshiplist.filter(e=>e.adshpid == itemid);
                    // }
                    
                });	
                
    }	

    
    
$scope.shipmentsms = (order, curstatus) =>{
    $http.get(apiurl+"ItInfraCampusMasters?filter=%7B%22where%22%3A%7B%22id%22%3A%22"+order.CampusId+"%22%7D%7D").success(function(toinfo){
        
        $http.get(apiurl+"ItInfraCampusMasters?filter=%7B%22where%22%3A%7B%22id%22%3A%22"+order.senderCampusId+"%22%7D%7D").success(function(frominfo){
            if(curstatus=='In Transit'){
                var userPhonesStr = toinfo[0].campusPhone.replace(/\s/g, '');
            }
            if(curstatus=='Received'){
                var userPhonesStr = frominfo[0].campusPhone.replace(/\s/g, '');
            }
            if(order.CourierName=='Our Staff'){
                var crnewname = order.CourierName+' '+order.crrefno
            } else {
                var crnewname = order.CourierName;
            }
            let smsobj  = {
                "mobile": userPhonesStr,
                "senderid": "ADIACY",
                "message": "Your computer indent No:"+order.Shipmentid+" "+curstatus+" to "+toinfo[0].campusName+" through "+crnewname+" - from "+frominfo[0].campusName+" -ADITYA."
                // "message": "The Parcel "+curstatus+" to "+toinfo[0].campusName+" with Track No:"+order.Shipmentid+" through "+order.CourierName+" from "+frominfo[0].campusName+"-ADITYA"
            }
            // console.log(smsobj);
            $scope.sendsms(smsobj);
        });
    })
}

$scope.updatecrid = function(itemdata){
    // console.log(itemdata);
    //var obj = "adshipid="+adid+"&curshipid="+cuid;
    var obj = {"adshipid":itemdata.Shipmentid,"curshipid":itemdata.curid}
    //console.log(obj);
    $http.post(apiurl+"dbreports/UpdateCid",obj).success(function(data){
        //console.log('success');
        $scope.shipmentsms(itemdata, 'In Transit')
        location.reload();
    });
}

$scope.updatercvstatus = function(orderinfo){
    var statusupdate = {
        "Shipmentid" : orderinfo.Shipmentid,
        "Received":1,
        "status" : 'Received',
        "name": $scope.userdata[0].username,
        "email": $scope.userdata[0].useremail,
        "phoneNo": $scope.userdata[0].userphone,
        "designation" : $scope.userdata[0].userLevel,
        "orderDetails" : orderinfo
    }
    // console.log(orderinfo, statusupdate)
    $http.post(itinfra+"order/updatestatus",statusupdate).success(function(data){
        // console.log(data);
        location.reload();
    });
}

$scope.adshipidWise = function(){
    $http.get(apiurl+"ItInfraShipments?filter=%7B%22where%22%3A%7B%22adshpid%22%3A%22"+$scope.adshipid+"%22%7D%7D").success(function(data){
                    //console.log(data);
            $scope.adidwiselist = data;		
    });
}


    $scope.examdatechange = function(dt)
       {
        $scope.newDate =new Date(dt);
        return $scope.newDate
       }



});
        

