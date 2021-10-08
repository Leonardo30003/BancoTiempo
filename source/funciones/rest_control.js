/* global FACTOR_DE_RETRASO, EMIT_REDIS, _BD_, ID_RE_CL_ASIGNADO, ID_RE_AD_ASIGNADO, ID_RE_CL_CANCELA, ID_RE_AD_CANCELADO_POR_CLIENTE, ID_RE_CL_CONFIRMA_CANCELADO_DE_PROFESIONAL, ID_RE_AD_CANCELA, ID_RE_CL_CANCELADO_POR_PROFESIONAL, ID_RE_AD_RECHAZA_ASIGNACION, ID_RE_CL_RESERVADA, MENSAJE_DEPRECATE, LLAVE_ECRIP */
var cnf = require('./config.js');

module.exports = {
    verificarAtorizacionCliente: verificarAtorizacionCliente,
    verificarAtorizacionAdministrador: verificarAtorizacionAdministrador,

    obtenerLlaves: obtenerLlaves,
    generarAuth: generarAuth
};

function obtenerLlaves(z, fecha, callback, res) {
    cnf.ejecutarResSQL(SQL_VER_LLAVES, [LLAVE_ECRIP, LLAVE_ECRIP, LLAVE_ECRIP, LLAVE_ECRIP, idServicioSectorCategoria, fecha], function (llaves) {
        if (llaves.length > 0)
            return verLlave(llaves[0], callback, res);
        let llave = generarAuth(32), token = generarAuth(16), checsum = generarAuth(16), separador = '$$' + generarAuth(4) + '$$';
        cnf.ejecutarResSQL(SQL_REGISTRAR_LLAVE, [idServicioSectorCategoria, fecha, llave, LLAVE_ECRIP, token, LLAVE_ECRIP, checsum, LLAVE_ECRIP, separador, LLAVE_ECRIP], function () {
            cnf.ejecutarResSQL(SQL_VER_LLAVES, [LLAVE_ECRIP, LLAVE_ECRIP, LLAVE_ECRIP, LLAVE_ECRIP, idServicioSectorCategoria, fecha], function (llaves) {
                if (llaves.length > 0)
                    return verLlave(llaves[0], callback, res);
                return res.status(200).send({en: -1, m: 'Ups lo sentimos, por favor intenta de nuevo más tarde.'});
            }, res);
        }, res);
    }, res);
}

function verLlave(llaves, callback, res) {
    if (!llaves.separador || !llaves.llave || !llaves.token || !llaves.checsum)
        return res.status(200).send({en: -1, m: 'Ups lo sentimos, por favor intenta de nuevo más tarde.'});
    let separador = llaves.separador.toString('ascii');
    let llave = llaves.llave.toString('ascii');
    let token = llaves.token.toString('ascii');
    let checsum = llaves.checsum.toString('ascii');
    return callback({separador: separador, llave: llave, token: token, checsum: checsum});
}

const SQL_VER_LLAVES =
        "SELECT (AES_DECRYPT(bl.separador, ?)) AS separador, (AES_DECRYPT(bl.llave, ?)) AS llave, (AES_DECRYPT(bl.token, ?)) AS token, (AES_DECRYPT(bl.checsum, ?)) AS checsum FROM " + _BD_ + ".boletoLlave bl WHERE idServicioSectorCategoria = ? AND fecha = ? LIMIT 1;";

const SQL_REGISTRAR_LLAVE =
        "INSERT IGNORE INTO " + _BD_ + ".boletoLlave (idServicioSectorCategoria, fecha, llave, token, checsum, separador) VALUES (?, ?, AES_ENCRYPT(?,?), AES_ENCRYPT(?,?), AES_ENCRYPT(?,?), AES_ENCRYPT(?,?));";

function generarAuth(tamanio) {
    var randomstring = '';
    var leter = ['A', 'B', 'C', 'A', 'B', 'C', 'Z', 'X', 'Y', 'Z', 'X', 'Y', '1', '2', 'A', 'B', 'C', 'Z', 'X', 'Y', '3', '4', '5', 'A', 'B', 'C', 'Z', 'X', 'Y', '6', '7', '8', '9', 'A', 'B', 'C', 'Z', 'X', 'Y', 'A', 'B', 'C', 'Z', 'X', 'Y'];
    for (var i = 0; i < tamanio; i++) {
        var rnum = Math.floor(Math.random() * leter.length);
        randomstring += leter[rnum];
    }
    return (randomstring);
}

const SQL_VERIFICAR_AUTORIZACION_CLIENTE =
        "SELECT c.nombres, c.apellidos, c.celular, c.correo, c.isAdministrador FROM "
        + _BD_ + ".clienteSessionPush csp INNER JOIN "
        + _BD_ + ".cliente c ON csp.idCliente = c.idCliente WHERE csp.idCliente = ? AND  csp.idPlataforma = ? AND csp.imei = ?  AND csp.auth = MD5(CONCAT(?, 'JpKradacTounk')) AND csp.activado = 1 LIMIT 1;";

function verificarAtorizacionCliente(idCliente, auth, idPlataforma, imei, marca, modelo, so, vs, res, callback) {
    if (!marca) {
        res.status(400).send({error: 1, param: 'marca'});
        return callback(false);
    }
    if (!modelo) {
        res.status(400).send({error: 1, param: 'modelo'});
        return callback(false);
    }
    if (!so) {
        res.status(400).send({error: 1, param: 'so'});
        return callback(false);
    }
    if (!vs) {
        res.status(400).send({error: 1, param: 'vs'});
        return callback(false);
    }
    let versiones = vs.split('.');
    if (versiones.length != 3) {
        res.status(400).send({error: 1, param: 'vs'});
        return callback(false);
    }
    if (isNaN(versiones[0])) {
        res.status(400).send({error: 1, param: 'v1'});
        return callback(false);
    }
    if (isNaN(versiones[1])) {
        res.status(400).send({error: 1, param: 'v2'});
        return callback(false);
    }
    if (isNaN(versiones[2])) {
        res.status(400).send({error: 1, param: 'v3'});
        return callback(false);
    }
    if (versiones[2] <= 99)
        return res.status(320).send({m: MENSAJE_DEPRECATE});
    cnf.ejecutarResSQL(SQL_VERIFICAR_AUTORIZACION_CLIENTE, [idCliente, idPlataforma, imei, auth], function (autorizaciones) {
        if (autorizaciones.length <= 0) {
            callback(false);
            return res.status(403).send({m: 'Su sesión a caducado =('});
        }
        return callback(true, autorizaciones);
    }, res);
}


const SQL_VERIFICAR_AUTORIZACION_ADMINISTRADOR =
        "SELECT fecha_inicio FROM " + _BD_ + ".administradorSessionPush WHERE idAdministrador = ? AND  idPlataforma = ? AND imei = ?  AND auth = MD5(CONCAT(?, 'JpKradacTounk')) AND activado = 1 LIMIT 1;";

function verificarAtorizacionAdministrador(idAdministrador, auth, idPlataforma, imei, marca, modelo, so, vs, res, callback) {
    if (!marca) {
        res.status(400).send({error: 1, param: 'marca'});
        return callback(false);
    }
    if (!modelo) {
        res.status(400).send({error: 1, param: 'modelo'});
        return callback(false);
    }
    if (!so) {
        res.status(400).send({error: 1, param: 'so'});
        return callback(false);
    }
    if (!vs) {
        res.status(400).send({error: 1, param: 'vs'});
        return callback(false);
    }
    /* let versiones = vs.split('.');
    if (versiones.length != 3) {
        res.status(400).send({error: 1, param: 'vs'});
        return callback(false);
    }
    if (isNaN(versiones[0])) {
        res.status(400).send({error: 1, param: 'v1'});
        return callback(false);
    }
    if (isNaN(versiones[1])) {
        res.status(400).send({error: 1, param: 'v2'});
        return callback(false);
    }
    if (isNaN(versiones[2])) {
        res.status(400).send({error: 1, param: 'v3'});
        return callback(false);
    }
    if (versiones[2] <= 99)
        return res.status(320).send({m: MENSAJE_DEPRECATE}); */
    cnf.ejecutarResSQL(SQL_VERIFICAR_AUTORIZACION_ADMINISTRADOR, [idAdministrador, idPlataforma, imei, auth], function (autorizaciones) {
        if (autorizaciones.length <= 0) {
            callback(false);
            return res.status(403).send({m: 'Su sesión a caducado =('});
        }
        return callback(true);
    }, res);
}
