var administrador=require('./administrador_functions');var mysql=require('mysql');var mysqlPort=3306;var mysqlHost;var mysqlUser;var mysqlPass;if(IS_DESARROLLO){mysqlHost='169.62.217.189';mysqlUser='LfIGfI4Nhv!SmhGU3';mysqlPass='hGfIU3hGfI7ZGrNhfI4342Gfn8LGfIUHg%mhG65Sl3N';}else{if(ID_APP===ID_APP_CLIPP){mysqlHost='10.73.211.219';mysqlUser='ServerMaster';mysqlPass='Ahg%14!jkhGh7Ha7*(7agiG&*A^*&tgG*A&Tyuf';}else{throw"ERROR NO SE SELECCIONO UNA BASE DE DATOS POR APP CONFIG";}}
var mysqlStringKtaxiDB={host:mysqlHost,user:mysqlUser,password:mysqlPass,port:mysqlPort,multipleStatements:false,charset:'utf8mb4'};var pool=mysql.createPool({connectionLimit:50,host:mysqlHost,user:mysqlUser,password:mysqlPass,multipleStatements:false,charset:'utf8mb4',database:_BD_});function ejecutarSQL(QUERY,VALORES){pool.query(QUERY,VALORES,function(err){if(err)
administrador.imprimirErrLogs(err+' SQL: '+QUERY+' VALORES: '+VALORES);});}
function ejecutarSQLCallback(QUERY,VALORES,callback){pool.query(QUERY,VALORES,function(err,ejecucion){if(err){administrador.imprimirErrLogs(err+' SQL: '+QUERY+' VALORES: '+VALORES);if(IS_DESARROLLO)
return callback({error:1,m:err.sqlMessage});return callback({error:1,m:'Error'});}
callback(ejecucion);});}
function ejecutarConfirmacionSQL(QUERY,VALORES,callback,confirmacion){pool.query(QUERY,VALORES,function(err,ejecucion){if(err){administrador.imprimirErrLogs(err+' SQL: '+QUERY+' VALORES: '+VALORES);if(IS_DESARROLLO)
return confirmacion({error:1,m:err.sqlMessage});return confirmacion({error:1,m:'Error'});}
callback(ejecucion);});}
function ejecutarResSQL(QUERY,VALORES,callback,res){pool.query(QUERY,VALORES,function(err,ejecucion){if(err){administrador.imprimirErrLogs(err+' SQL: '+QUERY+' VALORES: '+VALORES);return res.status(400).send({error:1,m:err.sqlMessage});}
callback(ejecucion);});}
module.exports={on:on,ejecutarSQL:ejecutarSQL,ejecutarSQLCallback:ejecutarSQLCallback,ejecutarConfirmacionSQL:ejecutarConfirmacionSQL,ejecutarResSQL:ejecutarResSQL};function on(callback){MYSQL_PING=mysql.createConnection(mysqlStringKtaxiDB);MYSQL_PING.connect(function(err){if(err){administrador.imprimirErrLogs('config.js NO SE PUDO CONECTAR A MYSQL '+err);callback(false);}else{administrador.imprimirOneLogs('Exito en conexion a MYSQL');}});MYSQL_PING.query('SELECT 1 + 1 AS solution',function(err){if(err){administrador.imprimirErrLogs('config.js NO SE PUDO COMPROBAR CONEXION A MYSQL '+err);callback(false);}else{administrador.imprimirOneLogs('Exito al comprobar conexion a MYSQL');inicializar(callback);}});MYSQL_PING.end();}
function inicializar(callback){MYSQL=mysql.createConnection(mysqlStringKtaxiDB);MYSQL.connect(function(err){if(err)
throwLogError();realizarPing(MYSQL);});callback(true);}
function throwLogError(){administrador.imprimirErrLogs('config.js CONEXION');throw"ERROR AL HACER PING SE REINICIARA EL SERVIDOR";}
function realizarPing(CANAL){setInterval(function(){CANAL.ping(function(err){if(err)
throwLogError();});},60000);}