'use strict';

module.exports = function(Dbreports) 
{
 /**
 *
 * @param {string} allottedids
 * @param {Function(Error, any)} callback
 */

	
	Dbreports.userallottedcampus = function(allottedids, callback) {
		const dataSource=Dbreports.app.datasources.mysql;
		//console.log("select * from ItInfraCampusMaster  where id IN ("+allottedids+")");
		//var mystr = allottedids;
		//var altids = mystr.replace(/,\s*$/, "");
		//console.log("select * from ItInfraCampusMaster  where id IN ("+allottedids+") order by id");
		dataSource.connector.execute("select id, campus_name as campusName, campus_incharge as campusIncharge, campus_city as campusCity, campus_address as campusAddress, campus_phone as campusPhone, campus_email as campusEmail, campus_biometric as campusBiometric, inst_id as instId, campus_code as campusCode, biometric_type as biometricType, InstName as instname from ItInfraCampusMaster  where id IN ("+allottedids+") order by id",(err,res)=>{
			//console.log(res);
			callback(null, res);
		})
   
  	};
	
	Dbreports.getstockuid = function(UserId, callback) {
		const dataSource=Dbreports.app.datasources.mysql;
		dataSource.connector.execute("select * from ItInfrastructure where userId="+UserId+" and status=1",(err,res)=>{
			//console.log(res);
			callback(null, res);
		})
   
  	};
	
	Dbreports.lastshippedid = function(callback) {
		const dataSource=Dbreports.app.datasources.mysql;
		dataSource.connector.execute("SELECT * FROM ItInfraShipment ORDER BY ShipId DESC LIMIT 1",(err,res)=>{
			// console.log(res);
			if(res.length==0){
				let obj  = {ADSHPid : 1000}
				res.push(obj);
			}
			callback(null, res);
		})
   
  	};
	
	Dbreports.getuserinfo = function(CampusId,callback) {
		const dataSource=Dbreports.app.datasources.mysql;
		dataSource.connector.execute("select * from ItInfraUsers where CONCAT(',', CampusId, ',') like '%,"+CampusId+",%'",(err,res)=>{
		//dataSource.connector.execute("select * from ItInfraUsers where CampusId IN ("+CampusId+")",(err,res)=>{
			//console.log(res);
			callback(null, res);
		})
   
  	};
	
	Dbreports.updatecurid = function(adshipid,curshipid,callback) {
		const dataSource=Dbreports.app.datasources.mysql;
		//console.log(adshipid, curshipid);
		dataSource.connector.execute("update ItInfraShipment set crRefNo='"+curshipid+"' where ADSHPid='"+adshipid+"'",(err,res)=>{
			//console.log(res);
			callback(null, res);
		})
   
  	};
	
	Dbreports.receiveditemsbyids = function(CampusId, callback) {
		const dataSource=Dbreports.app.datasources.mysql;
		dataSource.connector.execute("select * from ItInfraShipment where CampusId IN ("+CampusId+")",(err,res)=>{
			//console.log(res);
			callback(null, res);
		})
   
  	};
	
	Dbreports.updatercvstatus = function(AdShipId,Received,callback) {
		const dataSource=Dbreports.app.datasources.mysql;
		//console.log(AdShipId, Received);
		dataSource.connector.execute("update ItInfraShipment set Received="+Received+", ReceivedDate=now() where ADSHPid="+AdShipId+"",(err,res)=>{
			//console.log(res);
			callback(null, res);
		})
   
  	};
	
	Dbreports.getitemgroup = function(Itemgroup,callback) {
		const dataSource=Dbreports.app.datasources.mysql;
		
		dataSource.connector.execute("select COUNT(*) AS ititemqty,  campusName, institutename, ItemName, 	ItemGroupName, 	 assetLocationGroup, 	assetLocationName, 	userId from Assets where ItemGroupName="+Itemgroup+" GROUP BY  campusName, ItemName",(err,res)=>{
		//dataSource.connector.execute("select * from ItInfraUsers where CampusId IN ("+CampusId+")",(err,res)=>{
			//console.log(res);
			callback(null, res);
		})
   
  	};
	
	Dbreports.itemsbranchwise = function(campusname,callback) {
		const dataSource=Dbreports.app.datasources.mysql;
		dataSource.connector.execute("select COUNT(*) AS ititemqty,  campusName, 	ItemName, 	ItemGroupName, 	 assetLocationGroup, 	assetLocationName, 	userId from Assets where campusName="+campusname+" GROUP BY  ItemName",(err,res)=>{
		//dataSource.connector.execute("select * from ItInfraUsers where CampusId IN ("+CampusId+")",(err,res)=>{
			//console.log(res);
			callback(null, res);
		})
   
  	};
	
	
	Dbreports.updateitemdetails = function(ItInfraId,ItItemId,Uids,callback) {
		const dataSource=Dbreports.app.datasources.mysql;
		//console.log(ItInfraId,ItItemId,Uids);
		//console.log("update ItInfraItemDetails set itInfraid="+ItInfraId+", itItemId="+ItItemId+" where ItInfraItemDetailsId IN ("+Uids+")");
		dataSource.connector.execute("update ItInfraItemDetails set itInfraid="+ItInfraId+", itItemId="+ItItemId+" where ItInfraItemDetailsId IN ("+Uids+")",(err,res)=>{
			//console.log(res);
			callback(null, res);
		})
   
  	};
	Dbreports.getassetslimitedfileds = function(campusname,callback) {
		const dataSource=Dbreports.app.datasources.mysql;
		//console.log(ItInfraId,unoNo);
		// console.log("select COUNT(*) AS ititemqty,   campusName, assetLocationGroup, assetLocationName, ItemGroupName, ItemName, userId from Assets where campusName="+campusname+"  GROUP BY ItemName, ItemGroupName, assetLocationName, assetLocationGroup")
		dataSource.connector.execute("select COUNT(*) AS ititemqty,   campusName, assetLocationGroup, assetLocationName, ItemGroupName, ItemName, userId from Assets where campusName="+campusname+"  GROUP BY ItemName, ItemGroupName, assetLocationName, assetLocationGroup",(err,res)=>{
			callback(null, res);		
		})
  	};
	Dbreports.addorupdateitem = function(itemdetails,callback) {
		const dataSource=Dbreports.app.datasources.mysql;
		//console.log("insert into ItInfrastructure (itItemId, 	itItemName, 	itItemBrand, 	 	itItemLocation, 	itItemSubLocation, 	itItemQty, 	CampusId, 	HwEngMaild, 	itItemGroup, 	createdAt, 	userId, 	CampusName, 	InstId) values ("+itemdetails.itItemId+", '"+itemdetails.itemname+"', '"+itemdetails.brandname+"', '"+itemdetails.assetlocationgroup+"', '"+itemdetails.assetlocationname+"', 1, "+itemdetails.campusid+", '"+itemdetails.useremail+"', '"+itemdetails.itemgroupname+"', now(), "+itemdetails.userid+", '"+itemdetails.campusname+"', "+itemdetails.instId+")");
		

			//callback(null, res);
			if(!itemdetails.unonumber){
				itemdetails.unonumber=0
			}
			if(!itemdetails.simpleconfig){
				itemdetails.simpleconfig={}
			}
			if(!itemdetails.fullconfig){
				itemdetails.fullconfig={}
			}
			let prepareobj = {
				"unonumber":itemdetails.unonumber,
				"stockEntryNo":itemdetails.stockEntryNo,
				"itItemId":itemdetails.itItemId,
				"itemname":itemdetails.itemname,
				"itemgroupid":itemdetails.itemgroupid,
				"itemgroupname":itemdetails.itemgroupname,
				"brandname":itemdetails.brandname,
				"modelno":itemdetails.modelno,
				"serialno":itemdetails.serialno,
				"macid":itemdetails.macid,
				"institutename":itemdetails.institutename,
				"campusname":itemdetails.campusname,
				"assetlocationgroup":itemdetails.assetlocationgroup,
				"assetlocationname":itemdetails.assetlocationname,
				"purchasefrom":itemdetails.purchasefrom,
				"purchasedate":itemdetails.purchasedate,
				"warrantyupto":itemdetails.warrantyupto,
				"userid":itemdetails.userid,
			}

			//itemdetails.simpleconfig = JSON.stringify(itemdetails.simpleconfig);
			//itemdetails.fullconfig = JSON.stringify(itemdetails.fullconfig);
			for( var m in prepareobj ) {
                if ( prepareobj[m] == undefined ) {
                    prepareobj[m]='';
                }
            }
            //console.log(prepareobj);
			let finalobj = prepareobj;
			
			dataSource.connector.execute("insert ignore into Assets (unoNumber, 	stockEntryNo, 	AssetType, 	itemId, 	ItemName, 	ItemGroupId, 	ItemGroupName, 	brandName, 	modelNo, 	serialNo, 	macId,  	institutename, 	campusName, 	assetLocationGroup, 	assetLocationName, 	lastTicketNumber, 	purchaseFrom, 	purchaseDate, 	warrantyUpto, 	userId, 	createdAt) values ("+finalobj.unonumber+", '"+finalobj.stockEntryNo+"', 'Fixed Asset', "+finalobj.itItemId+", '"+finalobj.itemname+"', "+finalobj.itemgroupid+", '"+finalobj.itemgroupname+"', '"+finalobj.brandname+"', '"+finalobj.modelno+"', '"+finalobj.serialno+"', '"+finalobj.macid+"', '"+finalobj.institutename+"', '"+finalobj.campusname+"', '"+finalobj.assetlocationgroup+"', '"+finalobj.assetlocationname+"', 0, '"+finalobj.purchasefrom+"', '"+finalobj.purchasedate+"', '"+finalobj.warrantyupto+"', "+finalobj.userid+", now())",(err,res)=>{
				callback(err, res)
			});	

	

		//callback(null, itemdetails)
		
  	};

	Dbreports.itemstatuschange = function(itinfraid,status,ititemid,callback) {
		const dataSource=Dbreports.app.datasources.mysql;
		//console.log(itinfraid, status, ititemid);
		dataSource.connector.execute("update ItInfrastructure set status="+status+", updatedat=now() where itinfraid="+itinfraid+"",(err,res)=>{
			dataSource.connector.execute("update ItInfraItemDetails set itemSatus="+status+", updatedat=now() where itinfraid="+itinfraid+"",(err,res)=>{
				callback(null, res);
			});	
		})
   
  	};

	Dbreports.datamigrate = function(callback) {
		const dataSource=Dbreports.app.datasources.mysql;
		//console.log(itinfraid, status, ititemid);
		dataSource.connector.execute("select * from ItInfraItemDetails, ItInfrastructure where ItInfraItemDetails.itInfraid=ItInfrastructure.itInfraid and ItInfraItemDetails.itemSatus=1 and ItInfrastructure.status=1 and ItInfrastructure.InstId=1",(err,res)=>{

			
			//callback(null, res);
			let resdata = res;
			//resdata.itInfraItemSimpleSpec = JSON.stringify(resdata[0].itInfraItemSimpleSpec);
			//resdata.itInfraItemDetailedSpec = JSON.stringify(resdata.itInfraItemDetailedSpec);
			
			
    		let itInfraItemSimpleSpec = resdata[0].itInfraItemSimpleSpec.replace(/\\/g, '');
			itInfraItemSimpleSpec = JSON.parse(itInfraItemSimpleSpec);
    		let itInfraItemDetailedSpec = resdata[0].itInfraItemDetailedSpec.replace(/\\/g, '');
			itInfraItemDetailedSpec = JSON.parse(itInfraItemDetailedSpec);

			let simpleconfig = resdata[0].itInfraItemSimpleSpec;
			let fullconfig = resdata[0].itInfraItemDetailedSpec;

			
			//console.log(str);
			//console.log(str.cpu.brand);
			// console.log("insert ignore into Assets (unoNumber, 	itemId, 	ItemName, 	 	ItemGroupName, 	brandName, 	modelNo, 	serialNo,	macId, 	simpleConfig,	fullConfig, 	institutename, 	campusName, 	assetLocationGroup, 	assetLocationName, 	 userId) values ("+resdata[0].ItInfraItemDetailsId+", "+resdata[0].itItemId+", '"+resdata[0].itItemName+"', '"+resdata[0].itItemGroup+"', '"+itInfraItemSimpleSpec.cpu.brand+"', '"+itInfraItemSimpleSpec.cpu.model+"', '"+resdata[0].itInfraItemSerialNo+"', '"+resdata[0].itInfraItemUniqNo+"', '"+simpleconfig+"', '"+fullconfig+"', 'JUNIOUR', '"+resdata[0].CampusName+"', '"+resdata[0].itItemLocation+"', '"+resdata[0].itItemSubLocation+"',  "+resdata[0].userId+")");
			//ItemGroupId,

			var sql = "insert ignore into Assets (unoNumber, 	AssetType,	itemId, 	ItemName, 	ItemGroupId, 	ItemGroupName, 	brandName, 	modelNo, 	serialNo,	macId, 	simpleConfig, fullConfig,	 	institutename, 	campusName, 	assetLocationGroup, 	assetLocationName, 	userId) values ?";
			var values =[];
			for (let i = 0; i < resdata.length; i++) {
				if(resdata[i].itItemGroup=='DESKTOPS'){
					resdata[i].ItemGroupId = 38
				}
				if(resdata[i].itItemGroup=='LAPTOPS'){
					resdata[i].ItemGroupId = 39
				}
				values.push([resdata[i].ItInfraItemDetailsId, 'Fixed Asset', resdata[i].itItemId, resdata[i].itItemName, resdata[i].ItemGroupId, resdata[i].itItemGroup, itInfraItemSimpleSpec.cpu.brand, itInfraItemSimpleSpec.cpu.model, resdata[i].itInfraItemSerialNo, resdata[i].itInfraItemUniqNo, simpleconfig, fullconfig,  'SCHOOLS', resdata[i].CampusName, resdata[i].itItemLocation, resdata[i].itItemSubLocation, resdata[i].userId])
			}
			//console.log(sql, values);
			// dataSource.connector.execute(sql,[values],(err,res)=>{
			// 	callback(null, res);	
			// })

			// dataSource.connector.execute("insert ignore into Assets (unoNumber, 	itemId, 	ItemName, 	 	ItemGroupName, 	brandName, 	modelNo, 	serialNo,	macId, 	simpleConfig,	fullConfig, 	institutename, 	campusName, 	assetLocationGroup, 	assetLocationName, 	userId) values ("+resdata[0].ItInfraItemDetailsId+", "+resdata[0].itItemId+", '"+resdata[0].itItemName+"', '"+resdata[0].itItemGroup+"', '"+itInfraItemSimpleSpec.cpu.brand+"', '"+itInfraItemSimpleSpec.cpu.model+"', '"+resdata[0].itInfraItemSerialNo+"', '"+resdata[0].itInfraItemUniqNo+"', '"+simpleconfig+"', '"+fullconfig+"', 'JUNIOUR', '"+resdata[0].CampusName+"', '"+resdata[0].itItemLocation+"', '"+resdata[0].itItemSubLocation+"', "+resdata[0].userId+")",(err,res)=>{
			// 	callback(null, res);	
			// })
			
		})
   
  	};

	Dbreports.datamigrateafterdsk = function(callback) {
		const dataSource=Dbreports.app.datasources.mysql;
		//console.log(itinfraid, status, ititemid);
		dataSource.connector.execute("select itInfraid, ItInfrastructure.itItemId, ItInfrastructure.itItemName, itItemGrpid, itItemLocation, 	itItemSubLocation, 	itItemQty,  	HwEngMaild, 	ItInfrastructure.itItemGroup, 	ItInfrastructure.createdAt, 	ItInfrastructure.updatedAt, 	userId, 	CampusName, 	InstituteName,	status from ItInfrastructure, ItInfraItems, ItInfraItemGroup, ItInfraInstMaster where ItInfrastructure.itItemId=ItInfraItems.itItemId and ItInfrastructure.itItemGroup=ItInfraItemGroup.itItemGrpName and ItInfrastructure.InstId=ItInfraInstMaster.Instid and status=1 and  ItInfrastructure.itItemGroup!='DESKTOPS' and ItInfrastructure.itItemGroup!='LAPTOPS'",(err,res)=>{
			
			let resdata = res;
			
			var sql = "insert ignore into Assets (unoNumber, 	AssetType,	itemId, 	ItemName, 	ItemGroupId, 	ItemGroupName, 	institutename, 	campusName, 	assetLocationGroup, 	assetLocationName, 	userId, createdAt, updatedAt) values ?";
			var values =[];
			for (let i = 0; i < resdata.length; i++) {
				//console.log(resdata[i].itItemQty);
				for (let j = 0; j < resdata[i].itItemQty; j++) {
					values.push([0, 'Fixed Asset', resdata[i].itItemId, resdata[i].itItemName, resdata[i].itItemGrpid, resdata[i].itItemGroup, resdata[i].InstituteName, resdata[i].CampusName, resdata[i].itItemLocation, resdata[i].itItemSubLocation, resdata[i].userId, resdata[i].createdAt, resdata[i].updatedAt])
				}
			}
			//console.log(sql, values);
			// dataSource.connector.execute(sql,[values],(err,res)=>{
			// 	callback(null, res);	
			// })

			
		})
   
  	};

	Dbreports.sparepartsreport = function(startdate,enddate,branchwise,callback) {
		const dataSource=Dbreports.app.datasources.mysql;
		if(branchwise.toLowerCase()=='yes'){
			dataSource.connector.execute("select campusName,  institutename, ticketStatusTitle, partItemName, count(*) as count from Tickets where ticketStatusTitle='PARTREADY' and updatedAt BETWEEN '"+startdate+" 00:00:00' and    '"+enddate+" 23:59:59' group by campusName, partItemName",(err,res)=>{
				//console.log(res);
				callback(null, res);
			})
		} else {
			dataSource.connector.execute("select institutename, ticketStatusTitle, partItemName, count(*) as count from Tickets where ticketStatusTitle='PARTREADY' and updatedAt BETWEEN '"+startdate+" 00:00:00' and    '"+enddate+" 23:59:59' group by institutename, partItemName",(err,res)=>{
				//console.log(res);
				callback(null, res);
			})
		}
   
  	};
	

	Dbreports.repairedorperfect = function(itemName,campusName,callback) {
		const dataSource=Dbreports.app.datasources.mysql;
		if(itemName.toLowerCase()=='all' && campusName.toLowerCase()!="all"){
			dataSource.connector.execute("select ItemName, ItemGroupName, campusName, institutename, SUM(CASE WHEN lastTicketNumber is not null THEN 0 ELSE 1 END) AS repaired, SUM(CASE WHEN lastTicketNumber is null THEN 0 ELSE 1 END) AS working, count(*) as total from Assets where campusName='"+campusName+"' group by campusName, ItemName",(err,res)=>{
				//console.log(res);
				callback(null, res);
			})
		} else if((itemName.toLowerCase()!='all' && campusName.toLowerCase()=="all")){
			dataSource.connector.execute("select ItemName, ItemGroupName, campusName,  institutename, SUM(CASE WHEN lastTicketNumber is not null THEN 0 ELSE 1 END) AS repaired, SUM(CASE WHEN lastTicketNumber is null THEN 0 ELSE 1 END) AS working, count(*) as total from Assets where ItemName='"+itemName+"' group by campusName",(err,res)=>{
				//console.log(res);
				callback(null, res);
			})
		} else {
			dataSource.connector.execute("select ItemName, ItemGroupName, campusName,  institutename, SUM(CASE WHEN lastTicketNumber is not null THEN 0 ELSE 1 END) AS repaired, SUM(CASE WHEN lastTicketNumber is null THEN 0 ELSE 1 END) AS working, count(*) as total from Assets group by campusName, ItemName",(err,res)=>{
				//console.log(res);
				callback(null, res);
			})
		}
   
  	};
};
