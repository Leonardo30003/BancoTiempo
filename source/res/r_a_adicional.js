/* global _BD_, IP_SERVIDOR_NODE, _BDH_, MENSAJE_DEPRECATE */

var cnf = require('./config.js');
var router = require('express').Router();

/**
 * @api {post} /a/adicional/listar-adicional listar-adicional
 * @apiGroup A>ADICIONAL
 * @apiVersion 1.0.0 
 * 
 * @apiParam {int} idSucursal
 * @apiParam {int} idAdministrador
 * @apiParam {int} desde
 * @apiParam {int} cuantos
 * @apiParam {String} [parametro] criterio de busqueda
 * 
 * @apiParam {String} auth
 * @apiParam {int} idPlataforma
 * @apiParam {String} imei
 * @apiParam {String} marca
 * @apiParam {String} modelo
 * @apiParam {String} so
 * @apiParam {String} vs
 * @apiParam {int} idAplicativo
 * 
 * @apiSuccess {json} json {en: 1, lS: [{}]}
 * @apiSuccessExample Success-Response:
 *      Flujo normal de enventos.
 *        
 * @apiSuccess (Execpcional_1) {json} json {en: -1, m: 'Lo sentimos, la sucursal no tiene productos.'}
 * @apiSuccessExample Execpcional_1:
 *      Flujo alterno de eventos: 
 *        
 * @apiError {json} json {error: CODIGO_ERROR};
 * @apiErrorExample Error-Response:
 *      Los errores devuelve desde el estado de error -200 y menores
 */
router.post('/listar-adicional/', function (req, res) {
    var version = req.headers.version;
    if (version === '1.0.0')
        return obtenerListaAdicionales(req, res);
    return res.status(320).send({ m: MENSAJE_DEPRECATE });
});

function obtenerListaAdicionales(req, res) {
    var idSucursal = req.body.idSucursal
    var idAdministrador = req.body.idAdministrador
    var desde = req.body.desde
    var cuantos = req.body.cuantos
    if (!idSucursal)
        return res.status(400).send({ en: -1, param: 'Parameter missing code 0' });
    if (!idAdministrador)
        return res.status(400).send({ en: -1, param: 'Parameter missing code 1' });
    if (desde==null)
        return res.status(400).send({ en: -1, param: 'Parameter missing code 2' });
    if (!cuantos)
        return res.status(400).send({ en: -1, param: 'Parameter missing code 3' });

        var auth = req.body.auth;
        var idPlataforma = req.body.idPlataforma;
        var imei = req.body.imei;
        var marca = req.body.marca;
        var modelo = req.body.modelo;
        var so = req.body.so;
        var vs = req.body.vs;
        var idAplicativo = req.body.idAplicativo;
    
        if (!auth)
            return res.status(400).send({ en: -1, param: 'Parameter missing code 100' });
        if (!idAplicativo)
            return res.status(400).send({ en: -1, param: 'Parameter missing code 101' });
        if (!idPlataforma)
            return res.status(400).send({ en: -1, param: 'Parameter missing code 102' });
        if (!imei)
            return res.status(400).send({ en: -1, param: 'Parameter missing code 103' });
        if (!marca)
            return res.status(400).send({ en: -1, param: 'Parameter missing code 104' });
        if (!modelo)
            return res.status(400).send({ en: -1, param: 'Parameter missing code 105' });
        if (!so)
            return res.status(400).send({ en: -1, param: 'Parameter missing code 106' });
        if (!vs)
            return res.status(400).send({ en: -1, param: 'Parameter missing code 107' });
        let versiones = vs.split('.');
        if (versiones.length != 3)
            return res.status(400).send({ en: -1, param: 'vs' });
        if (isNaN(versiones[0]))
            return res.status(400).send({ en: -1, param: 'v1' });
        if (isNaN(versiones[1]))
            return res.status(400).send({ en: -1, param: 'v2' });
        if (isNaN(versiones[2]))
            return res.status(400).send({ en: -1, param: 'v3' }); 

    cnf.ejecutarResSQL(SQL_SELECT_ADICIONAL_SCUURSAL, [idSucursal, parseInt(desde), parseInt(cuantos)], function (adicionales) {
        if (adicionales.length <= 0)
            return res.status(200).send({en: -1, m: 'Lo sentimos, la sucursal no tiene adiconales.'});
        
        return res.status(200).send({en: 1, lA: adicionales});
        
    }, res);
}
var SQL_SELECT_ADICIONAL_SCUURSAL = "SELECT a.idAdicionalProducto, a.idSucursal, a.adicional, a.descripcion, IF(a.habilitado=1,1,0) AS habilitado, a.idAdministradorRegistro, a.fecha_registro FROM clipp.adicionalProducto a WHERE a.idSucursal=? AND a.habilitado=1 LIMIT ?, ?;";

/**
 * @api {post} /a/adicional/registrar registrar
 * @apiGroup A>ADICIONAL
 * @apiVersion 1.0.0 
 * 
 * @apiParam {int} idSucursal
 * @apiParam {String} adicional
 * @apiParam {String} descripcion
 * @apiParam {int} idAdministrador
 * 
 * @apiParam {String} auth
 * @apiParam {int} idPlataforma
 * @apiParam {String} imei
 * @apiParam {String} marca
 * @apiParam {String} modelo
 * @apiParam {String} so
 * @apiParam {String} vs
 * @apiParam {int} idAplicativo
 * 
 * @apiSuccess {json} json {en: 1, lS: [{}]}
 * @apiSuccessExample Success-Response:
 *      Flujo normal de enventos.
 *        
 * @apiSuccess (Execpcional_1) {json} json {en: -1, m: 'Lo sentimos, la sucursal no tiene productos.'}
 * @apiSuccessExample Execpcional_1:
 *      Flujo alterno de eventos: 
 *        
 * @apiError {json} json {error: CODIGO_ERROR};
 * @apiErrorExample Error-Response:
 *      Los errores devuelve desde el estado de error -200 y menores
 */
router.post('/registrar/', function (req, res) {
    var version = req.headers.version;
    if (version === '1.0.0')
        return registrarAdicional(req, res);
    return res.status(320).send({ m: MENSAJE_DEPRECATE });
});

function registrarAdicional(req, res) {
    var idSucursal = req.body.idSucursal
    var adicional = req.body.adicional
    var descripcion = req.body.descripcion
    var idAdministrador = req.body.idAdministrador
    
    if (!idSucursal)
        return res.status(400).send({ en: -1, param: 'Parameter missing code 0' });
    if (!idAdministrador)
        return res.status(400).send({ en: -1, param: 'Parameter missing code 1' });
    if (!adicional)
        return res.status(400).send({ en: -1, param: 'Parameter missing code 2' });

    var auth = req.body.auth;
    var idPlataforma = req.body.idPlataforma;
    var imei = req.body.imei;
    var marca = req.body.marca;
    var modelo = req.body.modelo;
    var so = req.body.so;
    var vs = req.body.vs;
    var idAplicativo = req.body.idAplicativo;

    if (!auth)
        return res.status(400).send({ en: -1, param: 'Parameter missing code 100' });
    if (!idAplicativo)
        return res.status(400).send({ en: -1, param: 'Parameter missing code 101' });
    if (!idPlataforma)
        return res.status(400).send({ en: -1, param: 'Parameter missing code 102' });
    if (!imei)
        return res.status(400).send({ en: -1, param: 'Parameter missing code 103' });
    if (!marca)
        return res.status(400).send({ en: -1, param: 'Parameter missing code 104' });
    if (!modelo)
        return res.status(400).send({ en: -1, param: 'Parameter missing code 105' });
    if (!so)
        return res.status(400).send({ en: -1, param: 'Parameter missing code 106' });
    if (!vs)
        return res.status(400).send({ en: -1, param: 'Parameter missing code 107' });
    let versiones = vs.split('.');
    if (versiones.length != 3)
        return res.status(400).send({ en: -1, param: 'vs' });
    if (isNaN(versiones[0]))
        return res.status(400).send({ en: -1, param: 'v1' });
    if (isNaN(versiones[1]))
        return res.status(400).send({ en: -1, param: 'v2' });
    if (isNaN(versiones[2]))
        return res.status(400).send({ en: -1, param: 'v3' }); 

    cnf.ejecutarResSQL(SQL_INSERT_ADICIONAL, [idSucursal, adicional, descripcion, idAdministrador], function (adicional) {
        if (adicional['insertId'] <= 0)
            return res.status(200).send({ en: -1, m: 'Lo sentimos, por favor intenta de nuevo más tarde.' });
        
        return res.status(200).send({ en: 1, m: 'Registro realizado correctamente'}); 
        
    }, res);
}

var SQL_INSERT_ADICIONAL = "INSERT INTO clipp.adicionalProducto (idSucursal, adicional, descripcion, idAdministradorRegistro, fecha_registro) VALUES (?, ?, ?, ?, now());";

/**
 * @api {post} /a/adicional/editar editar
 * @apiGroup A>ADICIONAL
 * @apiVersion 1.0.0 
 * 
 * @apiParam {int} idAdicionalProducto
 * @apiParam {int} idSucursal
 * @apiParam {String} adicional
 * @apiParam {String} descripcion
 * @apiParam {int} idAdministrador
 * 
 * @apiParam {String} auth
 * @apiParam {int} idPlataforma
 * @apiParam {String} imei
 * @apiParam {String} marca
 * @apiParam {String} modelo
 * @apiParam {String} so
 * @apiParam {String} vs
 * @apiParam {int} idAplicativo
 * 
 * @apiSuccess {json} json {en: 1, m: 'Adicional actualizado correctamente.'}
 * @apiSuccessExample Success-Response:
 *      Flujo normal de enventos.
 *        
 * @apiSuccess (Execpcional_1) {json} json {en: -1, m: 'Lo sentimos, por favor intenta de nuevo más tarde.'}
 * @apiSuccessExample Execpcional_1:
 *      Flujo alterno de eventos: 
 *        
 * @apiError {json} json {error: CODIGO_ERROR};
 * @apiErrorExample Error-Response:
 *      Los errores devuelve desde el estado de error -200 y menores
 */
router.post('/editar/', function (req, res) {
    var version = req.headers.version;
    if (version === '1.0.0')
        return actualizarAdicional(req, res);
    return res.status(320).send({ m: MENSAJE_DEPRECATE });
});

function actualizarAdicional(req, res) {
    var idAdicionalProducto = req.body.idAdicionalProducto
    var idSucursal = req.body.idSucursal
    var adicional = req.body.adicional
    var descripcion = req.body.descripcion
    var idAdministrador = req.body.idAdministrador
    
    if (!idAdicionalProducto)
        return res.status(400).send({ en: -1, param: 'Parameter missing code 0' });
    if (!idSucursal)
        return res.status(400).send({ en: -1, param: 'Parameter missing code 1' });
    if (!idAdministrador)
        return res.status(400).send({ en: -1, param: 'Parameter missing code 2' });
    if (!adicional)
        return res.status(400).send({ en: -1, param: 'Parameter missing code 3' });

    var auth = req.body.auth;
    var idPlataforma = req.body.idPlataforma;
    var imei = req.body.imei;
    var marca = req.body.marca;
    var modelo = req.body.modelo;
    var so = req.body.so;
    var vs = req.body.vs;
    var idAplicativo = req.body.idAplicativo;

    if (!auth)
        return res.status(400).send({ en: -1, param: 'Parameter missing code 100' });
    if (!idAplicativo)
        return res.status(400).send({ en: -1, param: 'Parameter missing code 101' });
    if (!idPlataforma)
        return res.status(400).send({ en: -1, param: 'Parameter missing code 102' });
    if (!imei)
        return res.status(400).send({ en: -1, param: 'Parameter missing code 103' });
    if (!marca)
        return res.status(400).send({ en: -1, param: 'Parameter missing code 104' });
    if (!modelo)
        return res.status(400).send({ en: -1, param: 'Parameter missing code 105' });
    if (!so)
        return res.status(400).send({ en: -1, param: 'Parameter missing code 106' });
    if (!vs)
        return res.status(400).send({ en: -1, param: 'Parameter missing code 107' });
    let versiones = vs.split('.');
    if (versiones.length != 3)
        return res.status(400).send({ en: -1, param: 'vs' });
    if (isNaN(versiones[0]))
        return res.status(400).send({ en: -1, param: 'v1' });
    if (isNaN(versiones[1]))
        return res.status(400).send({ en: -1, param: 'v2' });
    if (isNaN(versiones[2]))
        return res.status(400).send({ en: -1, param: 'v3' }); 

    cnf.ejecutarResSQL(SQL_UPDATE_ADICIONAL, [idSucursal, adicional, descripcion, idAdministrador, idAdicionalProducto], function (adicional) {
         if (adicional['affectedRows'] <= 0)
            return res.status(200).send({ en: -1, m: 'Lo sentimos, por favor intenta de nuevo más tarde.' });
        
        return res.status(200).send({ en: 1, m: 'Adicional actualizado correctamente.'});
        
    }, res);
}

var SQL_UPDATE_ADICIONAL = "UPDATE clipp.adicionalProducto SET idSucursal=?, adicional=?, descripcion=?, fecha_actualizo=now(), idAdministradorActualizo=? WHERE idAdicionalProducto=?;";

/**
 * @api {post} /a/adicional/habilitar habilitar
 * @apiGroup A>ADICIONAL
 * @apiVersion 1.0.0 
 * 
 * @apiParam {int} idAdicionalProducto
 * @apiParam {int} habilitado 0:Deshabilita, 1:habilitado
 * @apiParam {int} idAdministrador
 * 
 * @apiParam {String} auth
 * @apiParam {int} idPlataforma
 * @apiParam {String} imei
 * @apiParam {String} marca
 * @apiParam {String} modelo
 * @apiParam {String} so
 * @apiParam {String} vs
 * @apiParam {int} idAplicativo
 * 
 * @apiSuccess {json} json {en: 1, m: 'Adicional actualizado correctamente.'}
 * @apiSuccessExample Success-Response:
 *      Flujo normal de enventos.
 *        
 * @apiSuccess (Execpcional_1) {json} json {en: -1, m: 'Lo sentimos, por favor intenta de nuevo más tarde.'}
 * @apiSuccessExample Execpcional_1:
 *      Flujo alterno de eventos: 
 *        
 * @apiError {json} json {error: CODIGO_ERROR};
 * @apiErrorExample Error-Response:
 *      Los errores devuelve desde el estado de error -200 y menores
 */
router.post('/habilitar/', function (req, res) {
    var version = req.headers.version;
    if (version === '1.0.0')
        return habilitarAdicional(req, res);
    return res.status(320).send({ m: MENSAJE_DEPRECATE });
});

function habilitarAdicional(req, res) {
    var idAdicionalProducto = req.body.idAdicionalProducto
    var habilitado = req.body.habilitado
    var idAdministrador = req.body.idAdministrador
    
    if (!idAdicionalProducto)
        return res.status(400).send({ en: -1, param: 'Parameter missing code 0' });
    if (!habilitado)
        return res.status(400).send({ en: -1, param: 'Parameter missing code 1' });
    if (!idAdministrador)
        return res.status(400).send({ en: -1, param: 'Parameter missing code 2' });
    
    var auth = req.body.auth;
    var idPlataforma = req.body.idPlataforma;
    var imei = req.body.imei;
    var marca = req.body.marca;
    var modelo = req.body.modelo;
    var so = req.body.so;
    var vs = req.body.vs;
    var idAplicativo = req.body.idAplicativo;

    if (!auth)
        return res.status(400).send({ en: -1, param: 'Parameter missing code 100' });
    if (!idAplicativo)
        return res.status(400).send({ en: -1, param: 'Parameter missing code 101' });
    if (!idPlataforma)
        return res.status(400).send({ en: -1, param: 'Parameter missing code 102' });
    if (!imei)
        return res.status(400).send({ en: -1, param: 'Parameter missing code 103' });
    if (!marca)
        return res.status(400).send({ en: -1, param: 'Parameter missing code 104' });
    if (!modelo)
        return res.status(400).send({ en: -1, param: 'Parameter missing code 105' });
    if (!so)
        return res.status(400).send({ en: -1, param: 'Parameter missing code 106' });
    if (!vs)
        return res.status(400).send({ en: -1, param: 'Parameter missing code 107' });
    let versiones = vs.split('.');
    if (versiones.length != 3)
        return res.status(400).send({ en: -1, param: 'vs' });
    if (isNaN(versiones[0]))
        return res.status(400).send({ en: -1, param: 'v1' });
    if (isNaN(versiones[1]))
        return res.status(400).send({ en: -1, param: 'v2' });
    if (isNaN(versiones[2]))
        return res.status(400).send({ en: -1, param: 'v3' }); 
    
    var SQL_HABILITAR_ADICIONAL = "";
    if(habilitado==1)
        SQL_HABILITAR_ADICIONAL = "UPDATE clipp.adicionalProducto SET habilitado=?, idAdministradorHabilito=?, fecha_habilito=now() WHERE idAdicionalProducto=?;";
    else
        SQL_HABILITAR_ADICIONAL = "UPDATE clipp.adicionalProducto SET habilitado=?, idAdministradorDeshabilito=?,  fecha_deshabilito=now() WHERE idAdicionalProducto=?;";
    
    
    cnf.ejecutarResSQL(SQL_HABILITAR_ADICIONAL, [parseInt(habilitado), idAdministrador, idAdicionalProducto], function (adicional) {
         if (adicional['affectedRows'] <= 0)
            return res.status(200).send({ en: -1, m: 'Lo sentimos, por favor intenta de nuevo más tarde.' });
        
        return res.status(200).send({ en: 1, m: 'Adicional actualizado correctamente.'});
        
    }, res);
}

module.exports = router;
