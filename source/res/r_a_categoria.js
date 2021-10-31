/* global _BD_, IP_SERVIDOR_NODE, _BDH_, MENSAJE_DEPRECATE */

var cnf = require('./config.js');
var router = require('express').Router();


/**
 * @api {post} /a/lugar/editar editar
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
router.post('/listar/', function (req, res) {
    var version = req.headers.version;
    if (version === '1.0.0')
        return listarLugares(req, res);
    return res.status(320).send({m: MENSAJE_DEPRECATE});
});

function listarLugares(req, res) {

    cnf.ejecutarResSQL(SQL_CATEGORIAS, [], function (lugar) {
        if (lugar.length <= 0)
            return res.status(200).send({en: -1, m: 'No Existen Categorias.'});
        return res.status(200).send({en: 1, t: lugar.length, ls: lugar});
    }, res);
}


const SQL_CATEGORIAS =
        "SELECT idCategoria,categoria,logo FROM bancodt.categoria where habilitado=1";


router.post('/detalle/', function (req, res) {
    var version = req.headers.version;
    if (version === '1.0.0')
        return detalleLugar(req, res);
    return res.status(320).send({m: MENSAJE_DEPRECATE});
});

function detalleLugar(req, res) {
    var idLugar = req.body.idLugar;
    if (!idLugar)
        return res.status(400).send({en: -1, param: 'idLugar'});

    cnf.ejecutarResSQL(SQL_EXISTE_LUGAR, [idLugar], function (compania) {
        if (compania.length <= 0)
            return res.status(200).send({en: -1, m: 'Lugar no Registrado.'});
        cnf.ejecutarResSQL(SQL_DETALLE, [idLugar], function (lugar) {
            cnf.ejecutarResSQL(SQL_ANTENAS, [idLugar], function (antenas) {
                cnf.ejecutarResSQL(SQL_HORARIO, [lugar[0]['idHorario']], function (horario) {
                    return res.status(200).send({en: 1, l: lugar[0], h: horario, a: antenas});
                }, res);
            }, res);

        }, res);
    }, res);
}

const SQL_EXISTE_LUGAR =
        "SELECT l.idLugar FROM " + _BD_ + ".lugar l WHERE l.idLugar = ? and l.eliminado =0;";

const SQL_ANTENAS =
        "SELECT idEquipo,equipo,ubicacion,comentario,acronimo as idAntena FROM kparkingutpl.equipo where idEquipoTipo=2 and visible=1 and idLugar=? and eliminado=0 order by ubicacion;";


const SQL_HORARIO =
        "SELECT if(dia=1,'Domingo',if(dia=2,'Lunes',if(dia=3,'Martes',if(dia=4,'Miercoles',if(dia=5,'Jueves',if(dia=6,'Viernes',if(dia=7,'Sábado',''))))))) as dia,desde,hasta FROM kparkingutpl.horarioDetalle where idHorario=? and habilitado=1 ;";


const SQL_DETALLE =
        "SELECT l.idHorario,l.idLugar,l.lugar,l.latitud,l.longitud,l.capacidad," +
        " l.capacidadDisc,l.fecha_registro,lt.lugarTipo,l.distanciaAbrir FROM " + _BD_ + ".lugar l" +
        " INNER join lugarTipo lt on lt.idLugarTipo=l.idLugarTipo" +
        " where l.idLugar=? limit 1;";

module.exports = router;
