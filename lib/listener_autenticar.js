var a_autenticar=require('./c_autenticar');module.exports={on:on};function on(socket){socket.on('a_autenticar',function(datosJson,confirmacion){socket.auth=true;socket.idApp=datosJson['idApp'];if(typeof confirmacion==="function")
a_autenticar.autenticar((isNaN(datosJson['idAdministrador'])?null:(parseInt(datosJson['idAdministrador'])<=0?null:datosJson['idAdministrador'])),datosJson['imei'],socket,datosJson['idApp'],datosJson['idPl'],confirmacion);});}