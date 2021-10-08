/* global FACTOR_DE_RETRASO, EMIT_REDIS, _BD_, ID_RE_CL_ASIGNADO, ID_RE_AD_ASIGNADO, ID_RE_CL_CANCELA, ID_RE_AD_CANCELADO_POR_CLIENTE, ID_RE_CL_CONFIRMA_CANCELADO_DE_PROFESIONAL, ID_RE_AD_CANCELA, ID_RE_CL_CANCELADO_POR_PROFESIONAL, ID_RE_AD_RECHAZA_ASIGNACION, ID_TRANSACCION_TIPO_INGRESO, ID_TRANSACCION_ESTADO_COMPLETADO */
var cnf = require('./config.js');
const crypto = require('crypto');

module.exports = {
    registrarTransaccion: registrarTransaccion,
    encrypt: encrypt,
    registrarTransaccionPagosCliente:registrarTransaccionPagosCliente
};

var SQL_REGISTART_TRANSACCION =
        "INSERT INTO " + _BD_ + ".transaccion (idCliente, idTransaccionEstado, idTransaccionTipo, idSaldoRazon, saldo, anio, mes, idAdministradorRegistro, observacionRegistro, opcional, idTransaccionPeticion, idTransaccionEntidad, fecha_servicio) VALUES (?, ?, ?, ?, ?, YEAR(NOW()), MONTH(NOW()), ?, ?, ?, ?, ?, ?);";

function registrarTransaccion(idCliente, saldo, idTransaccionTipo, idSaldoRazon, idAdministradorRegistro, observacion, opcional, idTransaccionPeticion, fecha_servicio, idTransaccionEntidad, callback) {
    cnf.ejecutarSQLCallback(SQL_REGISTART_TRANSACCION, [idCliente, ID_TRANSACCION_ESTADO_COMPLETADO, idTransaccionTipo, idSaldoRazon, saldo, idAdministradorRegistro, observacion, opcional, idTransaccionPeticion, idTransaccionEntidad, fecha_servicio], function (registro) {
        if (registro['error'] || registro['insertId'] <= 0)
            return callback(-1);
        return callback(registro['insertId']);
    });
}


var SQL_REGISTART_TRANSACCION_PAGO =
        "INSERT INTO " + _BD_ + ".pago_cliente (idCliente, idPago, idT, tipo, valor, idFormaPago) VALUES (?, ?, ?, ?, ?, ?);";

function registrarTransaccionPagosCliente(idCliente, idPago, idTransaccion, tipo, valor, idFormaPago, callback) {
    cnf.ejecutarSQLCallback(SQL_REGISTART_TRANSACCION_PAGO, [idCliente, idPago, idTransaccion, tipo, valor, idFormaPago], function (registro) {
        if (registro['error'] || registro['insertId'] <= 0)
            return callback(-1);
        return callback(registro['insertId']);
    });
}

function encrypt(str, calve, vi) {
    const cipher = crypto.createCipheriv('aes-256-cbc', calve, vi);
    let enc = cipher.update(str, 'utf8', 'base64');
    enc += cipher.final('base64');
    return enc;
}