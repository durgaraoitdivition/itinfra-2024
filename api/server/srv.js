'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');


var app = module.exports = loopback();

if(process.argv.length<4){
    console.log("Use: node srv.js <datasource> <tablename>");  
    process.exit();
}
var table = process.argv[3];
var ds=process.argv[2];


/*process.argv.forEach(function (val, index, array) {
    console.log(index + ': ' + val);
  });*/

  boot(app, __dirname, function(err) {
    if (err) throw err;
  
  });

var dataSource = app.dataSources[ds];

dataSource.discoverSchema(table, function(err, tb) {
  if (err) {
    console.log("\n\nTable "+tb.name+" not exist! \n\n");
      process.exit(1);

  };
  var fs = require('fs');
  var contents = JSON.parse(fs.readFileSync('./server/model-config.json'));
  if(contents[tb.name]==undefined ){
    var obj={
        "dataSource": ds,
        "public": true
      }
      contents[tb.name]=obj;
      fs.writeFileSync('./server/model-config.json', JSON.stringify(contents,null,2), 'utf8');
      

      var filejson="./common/models/"+table+".json";
      fs.writeFileSync(filejson, JSON.stringify(tb,null,2), 'utf8');


      var filejs="./common/models/"+table+".js";
      var jsdata="'use strict';\nmodule.exports = function("+tb.name+"){\n};";
      fs.writeFileSync(filejs, jsdata, 'utf8');

      console.log("\n\nModel "+tb.name+" Created Successfully! \n\n");
      process.exit(1);

}else{
  
console.log("\n\nModel already exist!\n\n");
process.exit(1)
}
  
});

