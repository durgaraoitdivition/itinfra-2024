'use strict';

module.exports = function(app, callback) {
  // Obtain the datasource registered with the name "db"
  const dataSource = app.dataSources.mysql;

  // Step 1: define a model for "INVENTORY" table,
  // including any models for related tables (e.g. "PRODUCT").

  
  dataSource.connector.execute("SHOW TABLES", (err,tables)=>{
  //  console.log(tables)
  
  for(let i=0;i<tables.length;i++){
            let modelname=tables[i].Tables_in_ItInfrastructure;
            //console.log(modelname);

            dataSource.discoverSchema(modelname, function(err, table) {
              if (err) 
                console.log(err);
              else{
              //Enable Primary Key
              table.properties[Object.keys(table.properties)[0]].id=true;
              //console.log(table);

              let model=app.registry.createModel(modelname,table.properties,  {relations: true});
             

              app.model(model, {dataSource: dataSource});
              
               // console.log(i);
                if(i>tables.length-2)
                  callback();
              }
           
            });
}

});

  //console.log(dt.getMonth()+'_'+dt.getFullYear());


};
