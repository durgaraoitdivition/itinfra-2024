'use strict';
var date;
date = new Date();

module.exports = function(Ticketmaster) {

    Ticketmaster.raiseticket = function(ticketinfo, callback) {
		const dataSource=Ticketmaster.app.datasources.mysql;
		//console.log(ticketinfo);
        // if(ticketinfo.ticketstatustitle=="CLOSE"){
        //     ticketinfo.ticketstatustitle = "Working";
        // }
        //console.log("update Assets set assetTicketStatus='"+ticketinfo.ticketstatustitle+"',  lastTicketNumber="+ticketinfo.ticketnumber+", updatedAt=NOW() where assetId="+ticketinfo.assetId+"");
        dataSource.connector.execute("update Assets set assetTicketStatus='"+ticketinfo.ticketstatustitle+"',  lastTicketNumber="+ticketinfo.ticketnumber+", updatedAt=NOW() where assetId="+ticketinfo.assetId+"",(err,res)=>{
            if(!ticketinfo.partItemId){
              ticketinfo.partItemId = 0;
            }
            let preobj =   {            
                "assetid": ticketinfo.assetId,
                "uno": ticketinfo.unoNumber,
                "assetlocationgroup": ticketinfo.assetLocationGroup,
                "assetlocationname": ticketinfo.assetLocationName,
                "campusname": ticketinfo.campusName,
                "description": ticketinfo.description,
                "institutename": ticketinfo.institutename,
                "itemgroupname": ticketinfo.ItemGroupName,
                "itemid": ticketinfo.itemId,
                "itemname": ticketinfo.ItemName,
                "partitemid": ticketinfo.partItemId,
                "partitemname": ticketinfo.partItemName,
                "partserialno": ticketinfo.partSerialNo,
                "ticketcreated": ticketinfo.ticketcreated,
                "ticketdate": ticketinfo.ticketdate,
                "ticketnumber": ticketinfo.ticketnumber,
                "ticketstatuscode": ticketinfo.ticketstatuscode,
                "ticketstatusdescription": ticketinfo.ticketstatusdescription,
                "ticketstatustitle": ticketinfo.ticketstatustitle,
                "ticketuserid": ticketinfo.ticketuserid,
                "ticketusername": ticketinfo.ticketusername,
                "sentvendor": ticketinfo.sentvendor,
                "fileId" : ticketinfo.fileId,
		            "mimetype" : ticketinfo.mimetype
            }
            for( var m in preobj ) {
                if ( preobj[m] == undefined ) {
                    preobj[m]='';
                }
            }
            let finalobj = preobj;
            
            finalobj.description =  finalobj.description.replace(/'/g, "\\'");
           //console.log("insert ignore into Tickets (ticketNumber, uno, assetid, itemId, ItemName, ItemGroupName, instituteName, campusName, assetLocationGroup, assetLocationName, description, ticketStatusCode, ticketStatusTitle, ticketStatusDescription, partItemId, partItemName, partSerialNo, ticketUserId, ticketUserName, ticketDate, ticketCreated) values ("+finalobj.ticketnumber+", "+finalobj.uno+", "+finalobj.assetid+", "+finalobj.itemid+", '"+finalobj.itemname+"', '"+finalobj.itemgroupname+"', '"+finalobj.institutename+"', '"+finalobj.campusname+"', '"+finalobj.assetlocationgroup+"', '"+finalobj.assetlocationname+"', '"+finalobj.description+"', "+finalobj.ticketstatuscode+", '"+finalobj.ticketstatustitle+"', '"+finalobj.ticketstatusdescription+"', "+finalobj.partitemid+", '"+finalobj.partitemname+"', '"+finalobj.partserialno+"', '"+finalobj.ticketuserid+"', '"+finalobj.ticketusername+"', '"+finalobj.ticketdate+"', '"+finalobj.ticketcreated+"')");
            dataSource.connector.execute("insert ignore into Tickets (ticketNumber, uno, assetid, itemId, ItemName, ItemGroupName, instituteName, campusName, assetLocationGroup, assetLocationName, description, ticketStatusCode, ticketStatusTitle, ticketStatusDescription, partItemId, partItemName, partSerialNo, ticketUserId, ticketUserName, ticketDate, ticketCreated, sentvendor, fileId, mimetype) values ("+finalobj.ticketnumber+", "+finalobj.uno+", "+finalobj.assetid+", "+finalobj.itemid+", '"+finalobj.itemname+"', '"+finalobj.itemgroupname+"', '"+finalobj.institutename+"', '"+finalobj.campusname+"', '"+finalobj.assetlocationgroup+"', '"+finalobj.assetlocationname+"', '"+finalobj.description+"', "+finalobj.ticketstatuscode+", '"+finalobj.ticketstatustitle+"', '"+finalobj.ticketstatusdescription+"', "+finalobj.partitemid+", '"+finalobj.partitemname+"', '"+finalobj.partserialno+"', '"+finalobj.ticketuserid+"', '"+finalobj.ticketusername+"', '"+finalobj.ticketdate+"', '"+finalobj.ticketcreated+"', '"+finalobj.sentvendor+"', '"+finalobj.fileId+"', '"+finalobj.mimetype+"')",(err,res)=>{
              if(finalobj.fileId==''){
                callback(null, res);
              } else {
                dataSource.connector.execute("insert ignore into indent (assetId, itemName, monogoId, mimetype) values ("+finalobj.assetid+", '"+finalobj.itemname+"', '"+finalobj.fileId+"', '"+finalobj.mimetype+"')",(err,res)=>{
                  callback(null, res);
              });
              } 
            });     
		})  
   
  	};

    Ticketmaster.raiseindent = function(ticketinfo, callback) {
      const dataSource=Ticketmaster.app.datasources.mysql;
      
              let preobj =   {            
                  "assetid": 0,
                  "uno": 0,
                  "assetlocationgroup": ticketinfo.assetlocationgroup,
                  "assetlocationname": ticketinfo.assetlocationname,
                  "campusname": ticketinfo.campusName,
                  "description": ticketinfo.description,
                  "institutename": ticketinfo.instName,
                  "itemgroupname": ticketinfo.itemgroupname,
                  "itemid": ticketinfo.itItemId,
                  "itemname": ticketinfo.itemname,
                  "ticketcreated": ticketinfo.ticketcreated,
                  "ticketdate": ticketinfo.ticketdate,
                  "ticketnumber": ticketinfo.ticketnumber,
                  "ticketstatuscode": ticketinfo.ticketstatuscode,
                  "ticketstatusdescription": ticketinfo.ticketstatusdescription,
                  "ticketstatustitle": ticketinfo.ticketstatustitle,
                  "ticketuserid": ticketinfo.ticketuserid,
                  "ticketusername": ticketinfo.ticketusername,
                  "fileId" : ticketinfo.fileId,
                  "mimetype" : ticketinfo.mimetype
              }
              for( var m in preobj ) {
                  if ( preobj[m] == undefined ) {
                      preobj[m]='';
                  }
              }
              let finalobj = preobj;
              
              finalobj.description =  finalobj.description.replace(/'/g, "\\'");
             
              dataSource.connector.execute("insert ignore into Tickets (ticketNumber, uno, assetid, itemId, ItemName, ItemGroupName, instituteName, campusName, assetLocationGroup, assetLocationName, description, ticketStatusCode, ticketStatusTitle, ticketStatusDescription, ticketUserId, ticketUserName, ticketDate, ticketCreated, fileId, mimetype) values ("+finalobj.ticketnumber+", "+finalobj.uno+", "+finalobj.assetid+", "+finalobj.itemid+", '"+finalobj.itemname+"', '"+finalobj.itemgroupname+"', '"+finalobj.institutename+"', '"+finalobj.campusname+"', '"+finalobj.assetlocationgroup+"', '"+finalobj.assetlocationname+"', '"+finalobj.description+"', "+finalobj.ticketstatuscode+", '"+finalobj.ticketstatustitle+"', '"+finalobj.ticketstatusdescription+"', '"+finalobj.ticketuserid+"', '"+finalobj.ticketusername+"', '"+finalobj.ticketdate+"', '"+finalobj.ticketcreated+"', '"+finalobj.fileId+"', '"+finalobj.mimetype+"')",(err,res)=>{
                if(finalobj.fileId==''){
                  callback(null, res);
                } else {
                  dataSource.connector.execute("insert ignore into indent (assetId, itemName, monogoId, mimetype) values ("+finalobj.assetid+", '"+finalobj.itemname+"', '"+finalobj.fileId+"', '"+finalobj.mimetype+"')",(err,res)=>{
                    callback(null, res);
                });
                } 
              });     
     
      };

    Ticketmaster.cmpwiseopentickets = function(campusname, callback) {
		const dataSource=Ticketmaster.app.datasources.mysql;
		//console.log(campusname);
        dataSource.connector.execute("select ticketId ,	ticketNumber, 	assetid, 	itemId, 	ItemName, 	ItemGroupName, 	assetLocationGroup, 	assetLocationName, 	description ,	sum(ticketStatusCode) as ticketStatusCode ,	ticketStatusTitle, 	ticketStatusDescription, 	ticketUserName, 	ticketDate, 	createdAt ,	updatedAt from Tickets where campusName='"+campusname+"' GROUP BY assetid, ticketNumber",(err,res)=>{

            callback(null, res);
            
		})  
   
  	};

    Ticketmaster.updateticketbyid = function(ticketinfo, callback) {
		const dataSource=Ticketmaster.app.datasources.mysql;
		//console.log(ticketinfo);
        //console.log("update Assets set assetStatus='"+ticketinfo.assetstatus+"', assetTicketStatus='"+ticketinfo.assetticketstatus+"', lastTicketNumber="+ticketinfo.lastticketnumber+", updatedAt=NOW() where assetId="+ticketinfo.assetid+"");
        for( var m in ticketinfo ) {
          if ( ticketinfo[m] == undefined ) {
            ticketinfo[m]='';
          }
      }
      //ticketinfo = ticketinfo;

        dataSource.connector.execute("update Assets set assetTicketStatus='"+ticketinfo.assetticketstatus+"',  lastTicketNumber="+ticketinfo.lastticketnumber+" where assetId="+ticketinfo.assetid+"",(err,res)=>{
          if ( ticketinfo.partItemId == undefined ) {ticketinfo.partItemId=0;}
          if ( ticketinfo.partItemName == undefined ) {ticketinfo.partItemName='';}
          if ( ticketinfo.partSerialNo == undefined ) {ticketinfo.partSerialNo='';}
          if ( ticketinfo.sentvendor == undefined ) {ticketinfo.sentvendor='';}
          
            dataSource.connector.execute("update Tickets set ticketStatusCode="+ticketinfo.ticketstatuscode+", ticketStatusTitle='"+ticketinfo.assetticketstatus+"', ticketStatusDescription='"+ticketinfo.assetticketdec+"', description='"+ticketinfo.description+"', partItemId="+ticketinfo.partItemId+", partItemName='"+ticketinfo.partItemName+"', partSerialNo='"+ticketinfo.partSerialNo+"', ticketDate='"+ticketinfo.ticketdate+"', sentvendor='"+ticketinfo.sentvendor+"', fileId='"+ticketinfo.newfileId+"', mimetype='"+ticketinfo.mimetype+"' where ticketId="+ticketinfo.ticketid+"",(err,res)=>{

              // console.log(err)
              if(ticketinfo.fileId==''){
                callback(null, res);
              } else{
                dataSource.connector.execute("update indent set monogoId='"+ticketinfo.newfileId+"',  mimetype='"+ticketinfo.mimetype+"' where monogoId='"+ticketinfo.fileId+"'",(err,res)=>{
                  callback(null, res);
               })
              }

            }); 

		})  
   
  	};

    Ticketmaster.ticketdatainassets = function(campusname,callback) {
      const dataSource=Ticketmaster.app.datasources.mysql;
      //console.log(itinfraid, status, ititemid);
          //console.log("select ticketId, Assets.assetId, unoNumber, assetTicketStatus, description, lastTicketNumber, Assets.ItemGroupName, Assets.ItemName, Assets.assetLocationGroup, Assets.assetLocationName, Assets.instituteName, Assets.campusName, ticketDate, ticketCreated, ticketUserId, partItemId, partItemName, partSerialNo from Assets, Tickets where Assets.lastTicketNumber = Tickets.ticketNumber and Assets.campusName='"+campusname+"' AND Assets.assetTicketStatus!='CLOSE' AND Tickets.ticketStatusTitle!='CLOSE' group by Assets.assetId, Tickets.ticketNumber order by ticketDate desc");
      dataSource.connector.execute("select Tickets.* from Tickets, (select ticketNumber,max(ticketId) as tickid from Tickets group by assetId, ticketNumber) max_ticket where Tickets.ticketId=max_ticket.tickid and Tickets.ticketStatusTitle!='CLOSE' and campusName='"+campusname+"'",(err,res)=>{
        
        callback(null, res);
        
      })
   
  	}; 

    Ticketmaster.getlatestticketinfo = function(assetid,callback) {
      const dataSource=Ticketmaster.app.datasources.mysql;
      //console.log(itinfraid, status, ititemid);
          //console.log("select * from Assets where campusName='"+campusname+"' AND assetStatus!='Working' AND assetStatus!='CLOSE'");
      dataSource.connector.execute("select * from Tickets where assetid="+assetid+" group by ticketNumber order by ticketId",(err,res)=>{
        
        callback(null, res);
        
      })
   
  	};

    Ticketmaster.systemsworkingstatus = function(instname, callback) {
      const dataSource=Ticketmaster.app.datasources.mysql;
      //console.log(itinfraid, status, ititemid);
          //console.log("select * from Assets where campusName='"+campusname+"' AND assetStatus!='Working' AND assetStatus!='CLOSE'");
      dataSource.connector.execute("select Assets.userId, userName, userPhone, campusName, institutename, sum(CASE assetTicketStatus when 'CLOSE' then 1 else 0 END) as working, sum(CASE assetTicketStatus when 'CLOSE' then 0 else 1 END) as activetickets, sum(CASE assetTicketStatus when 'COMPLETED' then 1 else 0 END) as completed, count(*) as total from Assets, ItInfraUsers where institutename="+instname+" and Assets.userId=ItInfraUsers.userId and (ItemGroupName='DESKTOPS' or ItemGroupName='LAPTOPS') group by campusName",(err,res)=>{
        
        callback(null, res);
        
      })
  	};

    Ticketmaster.totalticketdatainassets = function(callback) {
      const dataSource=Ticketmaster.app.datasources.mysql;
      //console.log("select ticketId, Assets.assetId, unoNumber, assetTicketStatus, description, lastTicketNumber, Assets.ItemGroupName, Assets.ItemName, Assets.assetLocationGroup, Assets.assetLocationName, Assets.instituteName, Assets.campusName, ticketDate, ticketCreated, ticketUserId, partItemId, partItemName, partSerialNo from Assets, Tickets where Assets.lastTicketNumber = Tickets.ticketNumber AND Assets.assetTicketStatus!='CLOSE' AND Tickets.ticketStatusTitle!='CLOSE' group by Assets.assetId, Tickets.ticketNumber order by ticketDate desc")
      //console.log("select Tickets.* from Tickets, (select ticketNumber,max(ticketId) as tickid from Tickets group by assetId, ticketNumber) max_ticket where Tickets.ticketId=max_ticket.tickid and Tickets.ticketStatusTitle!='CLOSE'")
      dataSource.connector.execute("select Tickets.* from Tickets, (select ticketNumber,max(ticketId) as tickid from Tickets group by assetId, ticketNumber) max_ticket where Tickets.ticketId=max_ticket.tickid and Tickets.ticketStatusTitle!='CLOSE'",(err,res)=>{
        
        callback(null, res);
        
      })
      
  	};

    Ticketmaster.campusalltiketsgroupby = function(campusname,callback) {
      const dataSource=Ticketmaster.app.datasources.mysql;
      //console.log(itinfraid, status, ititemid);
          //console.log("select * from Assets where campusName='"+campusname+"' AND assetStatus!='Working' AND assetStatus!='CLOSE'");
      dataSource.connector.execute("select l.* from Tickets l inner join (select ticketNumber, max(updatedAt) as latest from Tickets group by ticketNumber) r  on l.updatedAt = r.latest and l.ticketNumber= r.ticketNumber and       campusName='"+campusname+"' order by updatedAt desc",(err,res)=>{
        
        callback(null, res);
        
      })
   
  	};

    Ticketmaster.itemsbasedongroup = function(groupdata,callback) {
      const dataSource=Ticketmaster.app.datasources.mysql;
      //console.log(itinfraid, status, ititemid);
      
      
      if(groupdata.assetlocationname==null){
        var assetLocationName = "assetLocationName is NULL";
      } else {
        var  assetLocationName = "assetLocationName='"+groupdata.assetlocationname+"'"
      }
      //campusname=ADCASL&ItemGroupName=AUDIO VIDEO&ItemName=Head Sets&assetlocationgroup=Computer Lab&assetlocationname=Animation Block
      // console.log("select * from Assets where campusName='ADCASL' and ItemGroupName='AUDIO VIDEO' and ItemName='Head Sets' and assetLocationGroup='Computer Lab' and assetLocationName='Animation Block'");
      //console.log(assetLocationName);
      dataSource.connector.execute("select * from Assets where campusName='"+groupdata.campusname+"' and ItemGroupName='"+groupdata.itemgroupname+"' and ItemName='"+groupdata.itemname+"' and assetLocationGroup='"+groupdata.assetlocationgroup+"' and "+assetLocationName+"",(err,res)=>{
        
        callback(null, res);
        
      })
   
  	};

    Ticketmaster.computerstatusaltreport = function(allottedcampuses, callback) {
      const dataSource=Ticketmaster.app.datasources.mysql;
      
      //console.log("select campusName, institutename, sum(CASE assetTicketStatus when 'CLOSE' then 1 else 0 END) as working, sum(CASE assetTicketStatus when 'CLOSE' then 0 else 1 END) as notworking, count(*) as total from Assets where (ItemGroupName='DESKTOPS' or ItemGroupName='LAPTOPS') and campusName in ("+allottedcampuses+")  group by campusName order by institutename");
      dataSource.connector.execute("select ItemGroupName, campusName, institutename, sum(CASE assetTicketStatus when 'CLOSE' then 1 else 0 END) as working, sum(CASE assetTicketStatus when 'CLOSE' then 0 else 1 END) as activetickets, sum(CASE assetTicketStatus when 'COMPLETED' then 1 else 0 END) as completed, count(*) as total from Assets where (ItemGroupName='DESKTOPS' or ItemGroupName='LAPTOPS') and campusName in ("+allottedcampuses+")  group by campusName order by institutename",(err,res)=>{
        
        callback(null, res);
        
      })
   
  	};

    Ticketmaster.computerstatusreportall = function(callback) {
      const dataSource=Ticketmaster.app.datasources.mysql;
      dataSource.connector.execute("select ItemGroupName, campusName, institutename, sum(CASE assetTicketStatus when 'CLOSE' then 1 else 0 END) as working, sum(CASE assetTicketStatus when 'CLOSE' then 0 else 1 END) as activetickets, sum(CASE assetTicketStatus when 'COMPLETED' then 1 else 0 END) as completed, count(*) as total from Assets where (ItemGroupName='DESKTOPS' or ItemGroupName='LAPTOPS') group by campusName order by institutename",(err,res)=>{
        
        callback(null, res);
        
      })
   
  	};
    
    Ticketmaster.powerbackupstatusaltreport = function(allottedcampuses, callback) {
      const dataSource=Ticketmaster.app.datasources.mysql;
      
      //console.log("select campusName, institutename, sum(CASE assetTicketStatus when 'CLOSE' then 1 else 0 END) as working, sum(CASE assetTicketStatus when 'CLOSE' then 0 else 1 END) as notworking, count(*) as total from Assets where (ItemGroupName='DESKTOPS' or ItemGroupName='LAPTOPS') and campusName in ("+allottedcampuses+")  group by campusName order by institutename");
      dataSource.connector.execute("select ItemGroupName, campusName, institutename, sum(CASE assetTicketStatus when 'CLOSE' then 1 else 0 END) as working, sum(CASE assetTicketStatus when 'CLOSE' then 0 else 1 END) as notworking, count(*) as total from Assets where ItemGroupName='POWER BACKUP' and campusName in ("+allottedcampuses+")  group by campusName order by institutename",(err,res)=>{
        
        callback(null, res);
        
      })
   
  	};

    Ticketmaster.ticketsbetweendates = function(startdate, enddate, callback) {
      const dataSource=Ticketmaster.app.datasources.mysql;
      
      //console.log("select campusName, institutename, sum(CASE assetTicketStatus when 'CLOSE' then 1 else 0 END) as working, sum(CASE assetTicketStatus when 'CLOSE' then 0 else 1 END) as notworking, count(*) as total from Assets where (ItemGroupName='DESKTOPS' or ItemGroupName='LAPTOPS') and campusName in ("+allottedcampuses+")  group by campusName order by institutename");
      dataSource.connector.execute("select campusName, group_concat(nos order by ticketStatusTitle) as numbers, group_concat(ticketStatusTitle order by ticketStatusTitle) as titles from (select campusName,count(ticketStatusTitle) as nos,ticketStatusTitle FROM Tickets  where  updatedAt between Date('"+startdate+"') and Date('"+enddate+"')  group by campusName,ticketStatusTitle order by ticketStatusTitle ) as t group by campusName",(err,res)=>{
        
        callback(null, res);
        
      })
   
  	};

    Ticketmaster.ticketsbetweendatesbyalt = function(alloteddatefilter, callback) {
      const dataSource=Ticketmaster.app.datasources.mysql;
      //console.log(alloteddatefilter);
      //console.log("select campusName, group_concat(nos order by ticketStatusTitle) as numbers, group_concat(ticketStatusTitle order by ticketStatusTitle) as titles from (select campusName,count(ticketStatusTitle) as nos,ticketStatusTitle FROM Tickets  where  updatedAt between '"+alloteddatefilter.startdate+' 00:00'+"' and '"+alloteddatefilter.enddate+' 23:59'+"' and campusName in ("+alloteddatefilter.altcampuses+")  group by campusName,ticketStatusTitle order by ticketStatusTitle ) as t group by campusName");
      dataSource.connector.execute("select campusName, group_concat(nos order by ticketStatusTitle) as numbers, group_concat(ticketStatusTitle order by ticketStatusTitle) as titles from (select campusName,count(ticketStatusTitle) as nos,ticketStatusTitle FROM Tickets  where  updatedAt between '"+alloteddatefilter.startdate+' 00:00'+"' and '"+alloteddatefilter.enddate+' 23:59'+"' and campusName in ("+alloteddatefilter.altcampuses+")  group by campusName,ticketStatusTitle order by ticketStatusTitle ) as t group by campusName",(err,res)=>{
        
        callback(null, res);
        
      })
   
  	};

    Ticketmaster.filtertitledatesintickets = function(filtertitledata, callback) {
      const dataSource=Ticketmaster.app.datasources.mysql;
      //console.log(filtertitledata);
      //console.log("select * from Tickets where campusName='"+filtertitledata.campus+"' and ticketStatusTitle='"+filtertitledata.titlename+"' AND updatedAt between Date('"+filtertitledata.startdate+"') and Date('"+filtertitledata.enddate+"')");
      dataSource.connector.execute("select * from Tickets where campusName='"+filtertitledata.campus+"' and ticketStatusTitle='"+filtertitledata.titlename+"' AND updatedAt between '"+filtertitledata.startdate+' 00:00'+"' and '"+filtertitledata.enddate+' 23:59'+"'",(err,res)=>{
        
        callback(null, res);
        
      })
   
  	};
Ticketmaster.itemsgroupby = function(callback) {
      const dataSource=Ticketmaster.app.datasources.mysql;
      dataSource.connector.execute("select group_concat(itItemName order by itItemName) as itItemNames, itItemGroup from ItInfraItems group by itItemGroup",(err,res)=>{
        
        callback(null, res);
        
      })
   
  	};
};
