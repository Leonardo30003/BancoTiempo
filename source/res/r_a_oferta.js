/* global _BD_, IP_SERVIDOR_NODE, _BDH_, MENSAJE_DEPRECATE */

var cnf = require('./config.js');
var router = require('express').Router();


/**
 * @api {post} /a/espacios/editar editar
 * @apiGroup A>ESPACIOS
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
router.post('/consultar/', function (req, res) {
    var version = req.headers.version;
    if (version === '1.0.0')
        return consultarEspacios(req, res);
    return res.status(320).send({m: MENSAJE_DEPRECATE});
});

function consultarEspacios(req, res) {
    var idLugar = req.body.idLugar;
    if (!idLugar)
        return res.status(400).send({en: -1, param: 'idLugar'});

    cnf.ejecutarResSQL(SQL_CONSULTAR_ESPACIOS, [idLugar, idLugar, idLugar, idLugar], function (espacios) {
        if (espacios.length <= 0)
            return res.status(400).send({en: -1, m: 'Lugar no Registrado.'});
        cnf.ejecutarResSQL(SQL_FORMAT, [espacios[0]['espaciosLibres'], espacios[0]['espaciosLibres'], espacios[0]['espaciosLibres'], espacios[0]['espaciosLibres'], espacios[0]['espaciosLibres']], function (espaciosl) {
            if (espaciosl.length <= 0)
                return res.status(400).send({en: -1, m: 'error.'});
            cnf.ejecutarResSQL(SQL_EXISTE_LETRERO, [espaciosl[0]['total'], idLugar], function (letreros) {
                return res.status(200).send({en: 1, el: espacios[0]['espaciosLibres'], oTag: espacios[0]['ocupadosTag'], oTick: espacios[0]['ocupadosTicket'], lcom: letreros});

            }, res);
        }, res);
    }, res);
}

var SQL_CONSULTAR_ESPACIOS = "SELECT (capacidad-(SELECT count(*) FROM " + _BD_ + ".movimiento " +
        "WHERE estado = 1 and idLugar=? and tipo in(1,2))) as espaciosLibres, (SELECT count(*) FROM " + _BD_ + ".movimiento " +
        "WHERE estado = 1 and idLugar=? and tipo =1) as ocupadosTag,(SELECT count(*) FROM " + _BD_ + ".movimiento " +
        "WHERE estado = 1 and idLugar=? and tipo =2) as ocupadosTicket from " + _BD_ + ".lugar where idLugar=?;";
var SQL_FORMAT = "select IF(?<10, concat('00',?), IF(?<100, concat('0',?), ?)) as total;";
const SQL_EXISTE_LETRERO =
        "SELECT concat('$$',e.acronimo,',MSG,P,',?,'##') as com,e.ip FROM " + _BD_ + ".equipo e WHERE e.idLugar = ? and idEquipoTipo=3 ";

router.post('/listar/', function (req, res) {
    var version = req.headers.version;
    if (version === '1.0.0')
        return listarOfertas(req, res);
    return res.status(320).send({m: 'versión'});
});


function listarOfertas(req, res) {
//    var idAdministrador = req.body.idAdministrador;
    var desde = req.body.desde;
    var cuantos = req.body.cuantos;
   
    var criterio = req.body.criterio;
//    var fInicio = req.body.fInicio;
//    var fFin = req.body.fFin;

//    if (!idAdministrador)
//        return res.status(400).send({error: 1, param: 'idAdministrador'});
    if (!desde)
        return res.status(400).send({error: 1, param: 'desde'});
    if (!cuantos)
        return res.status(400).send({error: 1, param: 'cuantos'});
//    if (!criterio)
//        return res.status(400).send({error: 1, param: 'criterio'});


   
        cnf.ejecutarResSQL(SQL_OFERTAS, [parseInt(desde), parseInt(cuantos)], function (movmientos) {
            if (movmientos.length <= 0)
                return res.status(200).send({en: -1, m: 'Lo sentimos pero no se encuentran movimientos para los parametros enviados.'});

            return res.status(200).send({en: 1, lM: movmientos});
        }, res);


}
var SQL_OFERTAS ="SELECT od.fecha_creacion ,od.descripcion_actividad,od.titulo, od.numero_minutos,u.idUsuario, p.nombres, p.apellidos,c.idCategoria,c.categoria FROM bancodt.ofertas_demandas od  inner join usuario u on od.id_ofertante = u.idUsuario inner join persona p on u.id_persona = p.id_persona inner join categoria c on c.idCategoria= od.idCategoria order by od.fecha_creacion  desc LIMIT ?, ?;";


module.exports = router;
