/* global _BD_, IP_SERVIDOR_NODE, _BDH_ */

var cnf = require('./config.js');

module.exports = {
    registrarUnicoRastreo: registrarUnicoRastreo,
    registrarRastreo: registrarRastreo,
    eliminarRegistroRastreo: eliminarRegistroRastreo,
    eliminarTodoRegistroRastreo: eliminarTodoRegistroRastreo
};

function eliminarTodoRegistroRastreo(idAdministrador, imei, confirmacion) {
    cnf.ejecutarConfirmacionSQL(SQL_ELIMINAR_TODOS_REGISTRO_RASTREO, [idAdministrador, imei], function () {
        return confirmacion({en: 1});
    }, confirmacion);
}

var SQL_ELIMINAR_TODOS_REGISTRO_RASTREO =
        "DELETE FROM "
        + _BD_ + ".administradorRastreo WHERE idAdministrador = ? AND imei = ?";

function registrarUnicoRastreo(idAdministrador, idEquipo, imei, idControlador, confirmacion) {
    cnf.ejecutarConfirmacionSQL(SQL_ELIMINAR_TODOS_REGISTRO_RASTREO, [idAdministrador, imei], function () {
        cnf.ejecutarConfirmacionSQL(SQL_REGISTRAR_RASTREO, [idAdministrador, idEquipo, imei, idControlador], function () {
            cnf.ejecutarConfirmacionSQL(SQL_OBTENER_RASTREO, [idEquipo], function (rastreos) {
                return confirmacion({en: 1, lR: rastreos});
            }, confirmacion);
        }, confirmacion);
    }, confirmacion);
}

function eliminarRegistroRastreo(idAdministrador, idEquipo, imei, idControlador, confirmacion) {
    cnf.ejecutarConfirmacionSQL(SQL_ELIMINAR_REGISTRO_RASTREO, [idAdministrador, idEquipo, imei], function () {
        return confirmacion({en: 1});
    }, confirmacion);
}

var SQL_ELIMINAR_REGISTRO_RASTREO =
        "DELETE FROM "
        + _BD_ + ".administradorRastreo WHERE idAdministrador = ? AND idEquipo = ? AND imei = ? LIMIT 1;";

function registrarRastreo(idAdministrador, idEquipo, imei, idControlador, confirmacion) {
    cnf.ejecutarConfirmacionSQL(SQL_REGISTRAR_RASTREO, [idAdministrador, idEquipo, imei, idControlador], function () {
        cnf.ejecutarConfirmacionSQL(SQL_OBTENER_RASTREO, [idEquipo], function (rastreos) {
            return confirmacion({en: 1, lR: rastreos});
        }, confirmacion);
    }, confirmacion);
}

var SQL_REGISTRAR_RASTREO =
        "INSERT IGNORE INTO "
        + _BD_ + ".administradorRastreo (idAdministrador, idEquipo, imei, idControlador) VALUES (?, ?, ?, ?);";

var SQL_OBTENER_RASTREO =
        "SELECT CONCAT( DATE_FORMAT(r.fecha_dato,'%d-%m-%Y %H:%i:%s'), '.000Z') AS fd, DATE_FORMAT(r.fecha_dato,'%d-%m-%Y %H:%i:%s') AS fecha_dato, r.idEquipo, r.idControlador, r.latitud, r.longitud, r.velocidad, r.rumbo, r.b1,r.b2,r.b3,r.b4,r.b5, r.gsm, r.idEvento, r.gps, r.ign, r.estado, evn.color, evn.acronimo FROM "
        + _BD_ + ".rastreo r INNER JOIN "
        + _BD_ + ".evento evn ON r.idEvento = evn.idEvento "
        + " WHERE r.idEquipo = ? LIMIT 1;";