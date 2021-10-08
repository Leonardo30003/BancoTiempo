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
router.post('/detalle/', function (req, res) {
    var version = req.headers.version;
    if (version === '1.0.0')
        return listarLugares(req, res);
    return res.status(320).send({m: MENSAJE_DEPRECATE});
});

function listarLugares(req, res) {
    var idCompania = req.body.idCompania;
    var idLugar = req.body.idLugar;
    if (!idCompania)
        return res.status(400).send({en: -1, param: 'idCompania'});
    if (!idLugar)
        return res.status(400).send({en: -1, param: 'idLugar'});

    cnf.ejecutarResSQL(SQL_EXISTE_COMPANIA, [idCompania], function (compania) {
        if (compania.length <= 0)
            return res.status(200).send({en: -1, m: 'Compania no Registrada.'});
        cnf.ejecutarResSQL(SQL_LUGAR, [idLugar], function (lugar) {
            if (lugar.length <= 0)
                return res.status(200).send({en: -1, m: 'Lugar no encontrado.'});
            cnf.ejecutarResSQL(SQL_EQUIPOS_ANTENAS, [idLugar], function (equiposAntenas) {
                var tamanio = equiposAntenas.length - 1;
                var contador = 0;
//                for (var antena in equiposAntenas) {
                equiposAntenas.forEach(function (antena, index) {
                    var comando = [];
                    comando.push({titulo: "Abrir", comando: "$$ABRIR" + antena.acronimo + "##"})
                    comando.push({titulo: "Cerrar", comando: "$$CERRAR" + antena.acronimo + "##"})
                    antena.comandos = comando;

                    if (contador === tamanio)
                        cnf.ejecutarResSQL(SQL_EQUIPOS_LETREROS, [idLugar], function (equiposLetreros) {
                            var tamanio = equiposLetreros.length - 1;
                            var contador = 0;
                            equiposLetreros.forEach(function (antena, index) {
                                var comando = [];
                                comando.push({titulo: "Tag no registrado", comando: "$$" + antena.acronimo + ",MSG,1##"})
                                comando.push({titulo: "Vehiculo no Autorizado", comando: "$$" + antena.acronimo + ",MSG,2##"})
                                comando.push({titulo: "Fuera de Horario", comando: "$$" + antena.acronimo + ",MSG,3##"})
                                comando.push({titulo: "Personalizado", comando: "$$" + antena.acronimo + ",MSG,T,Prueba##"})
                                comando.push({titulo: "Apagar", comando: "$$" + antena.acronimo + ",MSG,OFF##"})
                                antena.comandos = comando;
                                if (contador === tamanio)
                                    return res.status(200).send({en: 1, t: lugar[0]['lugar'], lAn: equiposAntenas, lLet: equiposLetreros});

                                contador++;
                            });

                        }, res);
                    contador++;
                });

            }, res);

        }, res);
    }, res);
}

const SQL_EXISTE_COMPANIA =
        "SELECT idCompania FROM kparkingutpl.compania where idCompania=? and eliminado=0;";
const SQL_LUGAR =
        "SELECT idLugar,lugar,latitud,longitud FROM kparkingutpl.lugar where idLugar=? and eliminado = 0;";
const SQL_EQUIPOS_ANTENAS =
        "SELECT idEquipo,equipo, et.equipoTipo,e.idEquipoTipo, acronimo,ip FROM kparkingutpl.equipo e inner join equipoTipo et on e.idEquipoTipo=et.idEquipoTipo where idLugar=? and eliminado = 0 AND e.idEquipoTipo=2;";
const SQL_EQUIPOS_LETREROS =
        "SELECT idEquipo,equipo, et.equipoTipo,e.idEquipoTipo, acronimo,ip FROM kparkingutpl.equipo e inner join equipoTipo et on e.idEquipoTipo=et.idEquipoTipo where idLugar=? and eliminado = 0 AND e.idEquipoTipo=3;";

module.exports = router;
