const pool = require("../config/database");
const util = require('util');
const query = util.promisify(pool.query).bind(pool);
const fetch = require('node-fetch');
var analysisApi = 'http://10.60.1.9:3006/api/';
// var analysisApi = 'https://apis.aditya.ac.in/analysis/';
module.exports = function() { 

    this.smsapi = async (obj)=>{
        if(obj.curstatus=='Shipped' || obj.curstatus=='In Transit' ){
            let userPhonesStr = obj.receiversarray.map(obj => obj.userPhone).join(', ');
            // console.log(userPhonesStr)
            var smsobj  = {
                "mobile": userPhonesStr,
                "senderid": "ADIACY",
                "message": "Your computer indent No:"+obj.shipmentId+" "+obj.curstatus+" to "+obj.receiver+" through "+obj.crnewname+" - from "+obj.sender+" -ADITYA."
            }
        }
        if(obj.curstatus=='Received'){
            var senderarray = await getusersinfo(obj.senderCampusId)
            let userPhonesStr = senderarray.map(obj => obj.userPhone).join(', ');
            // console.log(userPhonesStr)
            var smsobj  = {
                "mobile": userPhonesStr,
                "senderid": "ADIACY",
                "message": "Your computer indent No:"+obj.shipmentId+" "+obj.curstatus+" to "+obj.receiver+" through "+obj.crnewname+" - from "+obj.sender+" -ADITYA."
            }
        }
        
        console.log(smsobj);
        const ordersms = await fetch(analysisApi+'sms/sendsms', {
            method: 'post',
            body: JSON.stringify(smsobj),
            headers: {'Content-Type': 'application/json'}
          });
        var response = await ordersms.json();
        if(response.status==200){
            var finalres = response
        } else {
            var finalres = {status:400};
        }
        return finalres
    }

    this.whatsappapi = async (obj)=>{
        // console.log(obj)
        // var itemscount = await query("SELECT DATE_FORMAT(CurrentDate, '%d-%m-%Y') AS currentDate, SUM(Quantity) AS quantity  FROM ItInfraShipment  WHERE ADSHPid = "+shipmentId+"  GROUP BY ADSHPid, DATE_FORMAT(CurrentDate, '%d-%m-%Y')");
        var finalres = [];
        if(obj.curstatus=='Shipped' || obj.curstatus=='In Transit' ){
            var userPhonesStr = await query("SELECT *  FROM receiverDetails  WHERE shipmentId = "+obj.shipmentId+"");
        }
        if(obj.curstatus=='Received'){
            var getdata = await getusersinfo(obj.senderCampusId);
            var rcvdata = await query("SELECT *  FROM receiverDetails  WHERE shipmentId = "+obj.shipmentId+" and status='Received'");
            // console.log(getdata)
            var userPhonesStr = [];
            for (var i = 0; i < getdata.length; i++) {
                if (getdata[i].userPhone) {
                    userPhonesStr.push({ phoneNo: getdata[i].userPhone,  shipmentId:obj.shipmentId, id:rcvdata[0].id });
                }
            }
            
        }    
        // console.log(userPhonesStr)
        for(var i=0; i<userPhonesStr.length; i++){
           var smsobj =  { "data" : { "messaging_product": "whatsapp", "to": "91"+userPhonesStr[i].phoneNo, "type": "template", "template": { "name": "itd_issue_voucher", "language": { "code": "en" },
            "components": [
                        {
                            "type": "header",
                            "parameters": [
                                {
                                    "type": "image",
                                    "image": {
                                        "link": "https://analysis.aditya.ac.in/uploads/whatsapp/itdivision_banner.jpg"
                                    }
                                }
                            ]
                        },
                        {
                            "type": "body",
                            "parameters": [
                                {
                                    "type": "text",
                                    "text": obj.shipmentId

                                },
                                {
                                    "type": "text",
                                    "text": obj.curdate

                                },
                                {
                                    "type": "text",
                                    "text": obj.noofitems

                                }
                            ]
                        },
                        {
                            "type": "button",
                            "sub_type": "url",
                            "index": "0",
                            "parameters": [
                                {
                                    "type": "text",
                                    "text": "itinfra/issue-voucher/index.html?refid="+userPhonesStr[0].shipmentId+"-"+userPhonesStr[i].id+""
                                }
                            ]
                        }
                        ]
            } }}

            const ordersms = await fetch('https://apis.aditya.ac.in/kafka/producer/whatsapp', {
                method: 'post',
                body: JSON.stringify(smsobj),
                headers: {'Content-Type': 'application/json'}
              });
            var response = await ordersms.json();
            finalres.push(response)
        }
        return finalres
    }

    this.mysqldatetime = (dt)=>{

        let currentdate = dt.getFullYear() + '-' +
            ('00' + (dt.getMonth()+1)).slice(-2) + '-' +
            ('00' + dt.getDate()).slice(-2) + ' ' + 
            ('00' + dt.getHours()).slice(-2) + ':' + 
            ('00' + dt.getMinutes()).slice(-2) + ':' + 
            ('00' + dt.getSeconds()).slice(-2);
        return currentdate;
    }

    this.mysqldate = (dt)=>{

        let currentdate = dt.getFullYear() + '-' +
            ('00' + (dt.getMonth()+1)).slice(-2) + '-' +
            ('00' + dt.getDate()).slice(-2)
        return currentdate;
    }

    this.getorderid = ()=>{
        return new Promise((resolve, reject)=>{
            let sqlqry = "SELECT * FROM ItInfraShipment ORDER BY ADSHPid DESC LIMIT 1";
            pool.query(sqlqry, (error, elements)=>{
                if(error){
                    return reject(error);
                } else {
                    return resolve(parseInt(elements[0].ADSHPid)+1);
                }
            });
                
        });
    }

    this.campusInfobyid = (CampusId)=>{
        return new Promise((resolve, reject)=>{
            let sqlqry = "select * from ItInfraCampusMaster where id in ("+CampusId+")";
            pool.query(sqlqry, (error, elements)=>{
                if(error){
                    return reject(error);
                } else {
                    // console.log(elements)
                    return resolve(elements);
                }
            });
                
        });
    }

    this.getusersinfo = async (CampusId)=>{
        var cmpincharge = await campusInfobyid(CampusId);
        // console.log(CampusId, cmpincharge)
        return new Promise((resolve, reject)=>{
            let sqlqry = "select * from ItInfraUsers where CONCAT(',', CampusId, ',') like '%,"+CampusId+",%' and status=1";
            pool.query(sqlqry, (error, elements)=>{
                if(error){
                    return reject(error);
                } else {
                    // console.log(elements)
                    const firstPhone = cmpincharge[0].campus_phone.includes(',') ? cmpincharge[0].campus_phone.split(',')[0].trim()  : cmpincharge[0].campus_phone.trim();
                    var cmpobj = {
                        userName: cmpincharge[0].campus_incharge,
                        userEmail: cmpincharge[0].campus_email,
                        userPhone: firstPhone,
                        userLevel: 'Principal'
                    }
                    elements.push(cmpobj);
                    return resolve(elements);
                }
            });
                
        });
    }

    this.insertreceivers = (arr, shipid, status)=>{
        return new Promise((resolve, reject)=>{
            const curdate = mysqldate(new Date())
            let sqlqry = 'insert ignore into receiverDetails (name, email, phoneNo, designation, status, currentDate, shipmentId) values ?'
        
            let values = [];
            for (let i = 0; i < arr.length; i++) {
                console.log([arr[i].userName, arr[i].userEmail, arr[i].userPhone, arr[i].userLevel, status, curdate, shipid])
                values.push([arr[i].userName, arr[i].userEmail, arr[i].userPhone, arr[i].userLevel, status, curdate, shipid])
            }
            pool.query(sqlqry, [values], (error, elements)=> {
                if(error){
                    return reject(error);
                } else {
                    return resolve(elements);
                }
            });
                
        });
    }

    this.updateorderstatus = async (data)=>{
        var rcvarr = [{userName:data.name, userEmail : data.email, userPhone:data.phoneNo, userLevel:data.designation }]
        var rcvresult = await insertreceivers(rcvarr, data.Shipmentid,  data.status)
        var shipmentresult =  await query("update ItInfraShipment set recieverName='"+data.name+"', recieverMobile='"+data.phoneNo+"', recieverDesignation='"+data.designation+"',  Received="+data.Received+", ReceivedDate=now() where ADSHPid="+data.Shipmentid+"");
        return {rcvresult, shipmentresult}
    }

    this.sumByKey = (array, key)=> {
        return array.reduce((sum, obj) => {
            return sum + (obj[key] || 0);
        }, 0);
    }
}    

