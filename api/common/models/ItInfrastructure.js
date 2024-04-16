'use strict';
module.exports = function(Itinfrastructure){
	/**
 *
 * @param {number} infraid
 * @param {string} campusname
 * @param {Function(Error, any)} callback
 */

Itinfrastructure.getInfraDetails = function(infraid, campusname, callback) {
  var res;
  // TODO
		if(!infraid) infraid=0;
		if(!campusname) campusname='';
		const dataSource=Itinfrastructure.app.datasources.mysql;
		let qry="SELECT * FROM ItInfrastructure as infra join ItInfraItemDetails  as infdls on infra.itInfraid=infdls.itInfraid and infra.itItemId=infdls.itItemId where infra.itInfraid="+infraid+" or CampusName='"+campusname+"'";
		
                dataSource.connector.execute(qry,(err,res)=>{
                        callback(null, res);
                })
	};
};
