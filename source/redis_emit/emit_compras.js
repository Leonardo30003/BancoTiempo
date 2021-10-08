var cnf = require('./config.js');

module.exports = {
    emitToAdministradorSucursal: emitToAdministradorSucursal
};

function emitToAdministradorSucursal(idSucursal, emit, data){
    cnf.ejecutarResSQL(SQL_CONEXIONES_PEDIDO_ADMINISTRADOR, [idSucursal, ID_APLICATIVO_CLIPP_STORE], function (socket) {
        if (socket.length > 0) {
            socket.forEach(function (canal) {
                if(canal.socketId){
//                    console.log("Notificar socket"+canal.idAdministrador);
                    EMIT_REDIS.to(canal.socketId).emit(emit, data);
                }
            })
        }
    });
}
var SQL_CONEXIONES_PEDIDO_ADMINISTRADOR = 'SELECT aa.idAplicativo, asu.idAdministrador,  ac.socketId FROM clipp.administrador_sucursal asu INNER JOIN clipp.administrador_aplicativo aa ON asu.idAdministrador = aa.idAdministrador INNER JOIN clipp.administrador_sucursalActiva asa ON asa.idAdministrador=asu.idAdministrador AND asa.idSucursal= asu.idSucursal LEFT JOIN clipp.administradorConectado ac ON ac.idAdministrador=asu.idAdministrador  WHERE asu.idSucursal = ? AND aa.idAplicativo = ?;'
