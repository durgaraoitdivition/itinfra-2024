const pool = require("../config/database");
const util = require('util');
const query = util.promisify(pool.query).bind(pool);
require("./commonFunc")();


module.exports = {
    getUsers: (req, res, next) => {
        pool.query('select * from ItInfraUsers', (err, result) => {
            if (err) {
                console.log(err);
                res.send({ error: err.message });
            } else {
                res.status(200).send(result)
               // console.log(result);
            }
        });
    },

    getReceiversByOrderId: (req, res, next) => {
        pool.query('select * from receiverDetails where shipmentId="'+req.params.orderid+'"', (err, result) => {
            if (err) {
                // console.log(err);
                res.send({ error: err.message });
            } else {
                res.status(200).send(result)
               // console.log(result);
            }
        });
    },

    getDetailsbyOderid: async (req, res, next) => {
        try {
            const result = await query('SELECT * FROM ItInfraShipment WHERE ADSHPid = ?', [req.params.orderid]);
            
            var campusids = result[0].CampusId + "," + result[0].senderCampusId;
            var fromto = await campusInfobyid(campusids);
            var resobj = {
                reciever: fromto.filter(e=>e.id==result[0].CampusId),
                sender : fromto.filter(e=>e.id==result[0].senderCampusId),
                orderDetails : result
            }
            // console.log(fromto);
            res.status(200).send(resobj)
        } catch (err) {
            // console.error(err);
            res.send({ error: err.message });
        }
    },

    createOrder: async (req, res, next) => {
        try {
            var reqdata = req.body;
            var arr = reqdata.items;
            var noofitems = sumByKey(arr, 'quantity')
            console.log(noofitems)
            var senderInfo = reqdata.sender[0];
            var courierInfo = reqdata.courier
            if(courierInfo.crrefno=='' || courierInfo.crrefno==undefined){
                var curstatus = 'Shipped';
            } else {
                var curstatus = 'In Transit'
            }
            // if(courierInfo.couriername=='Our Staff'){
            //     var crnewname = courierInfo.couriername+' '+courierInfo.crrefno
            // } else {
            //     var crnewname = courierInfo.couriername;
            // }
            var getreceivers = await getusersinfo(reqdata.rcvcampusId);
            var receivers = getreceivers.filter(e=>e.userLevel!='LabAssistant');
            // console.log(receivers)
            var shipmentId = await getorderid();
            if((courierInfo.recieverName!='' && courierInfo.recieverName!=undefined) || (courierInfo.recieverMobile!='' && courierInfo.recieverMobile!=undefined)){
                var cmpobj = {
                    userName: courierInfo.recieverName,
                    userEmail: '',
                    userPhone: courierInfo.recieverMobile,
                    userLevel: courierInfo.recieverDesignation
                }
                receivers.push(cmpobj)
            }
            const curdate = mysqldatetime(new Date())
            var receiverstable = await insertreceivers(receivers, shipmentId, curstatus);
            var qry = 'insert ignore into ItInfraShipment (ADSHPid, InstId, ReceiverId, CampusId, CampusName, CourierName, crRefNo, shipmentMsg, ItemGroup, ItemName, Quantity, UserEmail,  SenderId, UserPhone, CurrentDate, senderCampusId, SenderName, neworold, recieverName, recieverMobile, recieverDesignation) values ?';
            let values = [];
            for (let i = 0; i < arr.length; i++) {
                values.push([shipmentId, reqdata.instId, receivers[0].userId, reqdata.rcvcampusId, reqdata.rcvcampusName, courierInfo.couriername, courierInfo.crrefno, courierInfo.shipmentmsg, arr[i].itemgroup, arr[i].itemname, arr[i].quantity,  senderInfo.useremail,  senderInfo.userid, senderInfo.userphone, curdate, senderInfo.campusid, senderInfo.campusName, arr[i].neworold, courierInfo.recieverName, courierInfo.recieverMobile, courierInfo.recieverDesignation])
            }
            var shipmentres = await query(qry, [values])
            // var smsobj = {
            //     shipmentId, 
            //     curstatus,
            //     receiver:reqdata.rcvcampusName,
            //     crnewname,
            //     sender : senderInfo.campusName,
            //     receiversarray:receivers
            // }
            // var smsfuncres = await smsapi(smsobj)
            const curdateonly = mysqldate(new Date())
            var smsobj = {
                shipmentId, 
                curdate : curdateonly,
                noofitems,
                curstatus
            }
            var smsfuncres = await whatsappapi(smsobj)
            var result = {receiverstable, shipmentres, smsfuncres}
            res.status(200).send(result)
        } catch(err) {
            console.log(err); // console log the error so we can see it in the console
            res.send({ error: err.message });
        }
    },

    updateCourierNo: (req, res, next) => {
        var data = req.body
        pool.query("update ItInfraShipment set crRefNo='"+data.curshipid+"' where ADSHPid='"+data.adshipid+"'", (err, result) => {
            if (err) {
                console.log(err);
                res.send({ error: err.message });
            } else {
                res.status(200).send(result)
               // console.log(result);
            }
        });
    },

    updateStatus: async (req, res, next) => {
        try {
            var data = req.body;
            var orderinfo = req.body.orderDetails;
            const curdate = mysqldate(new Date())
            var finalres = await updateorderstatus(req.body);
            // var smsobj = {
            //     shipmentId:data.Shipmentid, 
            //     curstatus : "Received",
            //     receiver:orderinfo.Branch,
            //     receiverCampusId:orderinfo.CampusId,
            //     crnewname:orderinfo.CourierName,
            //     sender : orderinfo.SenderName,
            //     senderCampusId : orderinfo.senderCampusId
            // }
            // var smsfuncres = await smsapi(smsobj)
            var smsobj = {
                shipmentId : data.Shipmentid, 
                curdate,
                noofitems:orderinfo.Itemcount,
                curstatus : "Received",
                senderCampusId : orderinfo.senderCampusId
            }
            var smsfuncres = await whatsappapi(smsobj)
            res.status(200).send({finalres, smsfuncres})
        } catch (err) {
            res.send({ error: err.message });
        }
    },

    updateFromSMS: async (req, res, next) => {
        try {
            var data = req.body.shipmentCode.split('-');
            // console.log(data)
            const result = await query('SELECT * FROM receiverDetails WHERE id = ? and shipmentId=?', [data[1], data[0]]);
            
            var statusupdate = {
                "Shipmentid":result[0].shipmentId,
                "Received":1,
                "status" : 'Received',
                "name": result[0].name,
                "email": result[0].email,
                "phoneNo": result[0].phoneNo,
                "designation" : result[0].designation
            }
            var finalres = await updateorderstatus(statusupdate)

            const orderinfo = await query('SELECT * FROM ItInfraShipment WHERE ADSHPid = ?', [data[0]]);
            // console.log(orderinfo)
            // var smsobj = {
            //     shipmentId:result[0].Shipmentid, 
            //     curstatus : "Received",
            //     receiver:orderinfo[0].Branch,
            //     receiverCampusId:orderinfo[0].CampusId,
            //     crnewname:orderinfo[0].CourierName,
            //     sender : orderinfo[0].SenderName,
            //     senderCampusId : orderinfo[0].senderCampusId
            // }
            // var smsfuncres = await smsapi(smsobj)
            const curdate = mysqldate(new Date())
            var noofitems = sumByKey(orderinfo, 'Quantity')
            var smsobj = {
                shipmentId : result[0].shipmentId, 
                curdate,
                noofitems,
                curstatus : "Received",
                senderCampusId : orderinfo[0].senderCampusId
            }
            var smsfuncres = await whatsappapi(smsobj)
            res.status(200).send({finalres, smsfuncres})
        } catch (err) {
            console.log(err)
            res.send({ error: err.message });
        }
    },

    reSendSMS: async (req, res, next) => {
        var reqdata = req.body;
        if(reqdata.crrefno==''){
            reqdata.curstatus = 'Shipped';
        } else {
            reqdata.curstatus = 'In Transit'
        }
        // if(reqdata.curname=='Our Staff'){
        //     reqdata.crnewname = reqdata.curname+' '+reqdata.crrefno
        // } else {
        //     reqdata.crnewname = reqdata.curname;
        // }
        // console.log(reqdata)
        try {
            // var smsfuncres = await smsapi(reqdata)
            const curdatetime = mysqldatetime(new Date())
            if(reqdata.newreciever.length>0){
                let userdata = reqdata.newreciever[0];
                await query("insert ignore into receiverDetails (name, phoneNo, designation, status, currentDate, shipmentId) values ('"+userdata.name+"','"+userdata.phoneNo+"','"+userdata.designation+"','"+reqdata.curstatus+"', '"+curdatetime+"', '"+reqdata.shipmentId+"')")
            }
            
            const curdate = mysqldate(new Date())
            var smsobj = {
                shipmentId:reqdata.shipmentId, 
                curdate,
                noofitems:reqdata.orderInfo.Itemcount,
                curstatus : reqdata.curstatus
            }
            var smsfuncres = await whatsappapi(smsobj)
            res.status(200).send(smsfuncres)
        } catch(err) {
            // console.log(err); // console log the error so we can see it in the console
            res.send({ error: err.message });
        }
    },

    getTotalInorOutwardItems: async (req, res, next) => {
        var reqdata = req.body;
        
        try {
            if(reqdata.instId==0 && reqdata.CampusName=="All"){
                var qry = "select ItemGroup, ItemName, sum(Quantity) as count, shipmentType from ItInfraShipment where shipmentType='"+reqdata.shipmentType+"' group by ItemGroup, ItemName order by ItemGroup"
            } else {
                var qry = "select InstId, CampusName, ItemGroup, ItemName, sum(Quantity) as count, shipmentType from ItInfraShipment where shipmentType='"+reqdata.shipmentType+"' and InstId="+reqdata.instId+" and CampusName='"+reqdata.CampusName+"' group by ItemGroup, ItemName order by ItemGroup"
            }
            var finalres = await query(qry)
            res.status(200).send(finalres)
        } catch(err) {
            console.log(err); // console log the error so we can see it in the console
            res.send({ error: err.message });
        }
    },

    getItemwiseInOutwards: async (req, res, next) => {
        var reqdata = req.body;
        
        try {
            if(reqdata.instId==0 && reqdata.CName=="All"){
                var qry = "select * from ItInfraShipment where shipmentType='"+reqdata.sType+"' and ItemGroup='"+reqdata.ItGrp+"' and ItemName='"+reqdata.ItName+"'"
            } else {
                var qry = "select * from ItInfraShipment where shipmentType='"+reqdata.sType+"' and InstId="+reqdata.instId+" and CampusName='"+reqdata.CName+"'  and ItemGroup='"+reqdata.ItGrp+"' and ItemName='"+reqdata.ItName+"'"
            }
            var finalres = await query(qry)
            res.status(200).send(finalres)
        } catch(err) {
            console.log(err); // console log the error so we can see it in the console
            res.send({ error: err.message });
        }
    },

    getStockBetweenDates: async (req, res, next) => {
        var reqdata = req.body;
        
        try {
            // if(reqdata.instId==0 && reqdata.campus=="All"){
            //     var filterdata = ''
            // } else {
            //     var filterdata = 'and InstId='+reqdata.instId+' and CampusName="'+reqdata.campus+'"'
            // }
            var finalres = await query("select shipmentType, CampusName, ItemGroup, ItemName, sum(Quantity) as count  from ItInfraShipment where shipmentType='"+reqdata.shipmentType+"' and CurrentDate BETWEEN '"+reqdata.fromDate+" 00:00:00' AND '"+reqdata.toDate+"  23:59:59' group by CampusName, ItemGroup, ItemName order by CampusName")
            res.status(200).send(finalres)
        } catch(err) {
            console.log(err); // console log the error so we can see it in the console
            res.send({ error: err.message });
        }
    },
    
    getItemsBetweenDates: async (req, res, next) => {
        var reqdata = req.body;
        
        try {
            if(reqdata.campus=='All'){
                var filtercdn = "";
            } else {
                var filtercdn = " and CampusName='"+reqdata.campus+"'"; 
            }
            if(reqdata.ItemGroup=='All' && reqdata.ItemName=='All'){
                var filteritem = "";
            } else {
                var filteritem = " and ItemGroup='"+reqdata.ItemGroup+"' and ItemName='"+reqdata.ItemName+"'"; 
            }
            var finalres = await query("select *  from ItInfraShipment where shipmentType='"+reqdata.shipmentType+"' and CurrentDate BETWEEN '"+reqdata.fromDate+" 00:00:00' AND '"+reqdata.toDate+"  23:59:59' "+filtercdn+" "+filteritem+" order by CurrentDate")
            res.status(200).send(finalres)
        } catch(err) {
            console.log(err); // console log the error so we can see it in the console
            res.send({ error: err.message });
        }
    }
}
