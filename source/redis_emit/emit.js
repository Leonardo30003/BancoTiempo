/* global _BD_, EMIT_REDIS */

var cnf = require('./config.js');

module.exports = {
    emiToChatAdministradores: emiToChatAdministradores,
    emiToArchivoChatAdministradores: emiToArchivoChatAdministradores,
    emiToChatCliente: emiToChatCliente,
    emiToArchivoChatCliente: emiToArchivoChatCliente
    
};

var SQL_LISTAR_ADMINISTRADORES_CONECTADOS =
        "SELECT DISTINCT ac.socketId, ads.idAdministrador FROM clipp.administrador_sucursal ads INNER JOIN clipp.administradorConectado ac ON ads.idAdministrador=ac.idAdministrador INNER JOIN clipp.administrador_sucursalActiva asa ON asa.idAdministrador=ads.idAdministrador AND asa.idSucursal = ads.idSucursal WHERE ads.idSucursal=? AND ac.socketId!=?;";

var APP_CLIPP_STORE = 6;
function emiToChatAdministradores(emit_cliente, idSucursal, idSocket, datosJsonEnvio) {
    cnf.ejecutarSQLCallback(SQL_LISTAR_ADMINISTRADORES_CONECTADOS, [idSucursal, idSocket], function (canales) {

        canales.forEach(function (canal) {
//            console.log("EMIT:"+emit_cliente+",ID:"+canal['socketId']+",IDAD:"+canal['idAdministrador']);
            EMIT_REDIS.to(canal['socketId']).emit(emit_cliente, datosJsonEnvio);
        });
    });
}

function emiToArchivoChatAdministradores(emit_cliente, idSucursal, idSocket, datosJsonEnvio) {
//    datosJsonEnvio.extension=datosJsonEnvio.archivo.extension;
//    datosJsonEnvio.archivo="";
    cnf.ejecutarSQLCallback(SQL_LISTAR_ADMINISTRADORES_CONECTADOS, [idSucursal, idSocket], function (canales) {
        canales.forEach(function (canal) {
            EMIT_REDIS.to(canal['socketId']).emit(emit_cliente, datosJsonEnvio);
        });
    });
}

///////////////////////////CLIENTES////////////////////////////

var SQL_LISTAR_CLIENTE_CONECTADOS =
        "SELECT DISTINCT cc.socketId, cp.idUsuario  FROM " + _BD_ + ".conexiones_pedido cp LEFT JOIN " + _BD_ + ".clienteConectado cc ON cc.idCliente=cp.idUsuario WHERE cp.idApp=? AND cp.idPedido=?;";

var APP_CLIPP_CLIENTE = 1;
function emiToChatCliente(emit_adminin, idSocket, datosJsonEnvio) {
    cnf.ejecutarSQLCallback(SQL_LISTAR_CLIENTE_CONECTADOS, [APP_CLIPP_CLIENTE, datosJsonEnvio.idPedido], function (canales) {
        
        canales.forEach(function (canal) {
            EMIT_REDIS.to(canal['socketId']).emit(emit_adminin, datosJsonEnvio);
        });
    });
}

function emiToArchivoChatCliente(emit_cliente, idSocket, datosJsonEnvio) {
//    datosJsonEnvio.extension=datosJsonEnvio.archivo.extension;
//    datosJsonEnvio.archivo="";
    cnf.ejecutarSQLCallback(SQL_LISTAR_CLIENTE_CONECTADOS, [APP_CLIPP_CLIENTE, datosJsonEnvio.idPedido], function (canales) {
        canales.forEach(function (canal) {
            EMIT_REDIS.to(canal['socketId']).emit(emit_cliente, datosJsonEnvio);
        });
    });
}
