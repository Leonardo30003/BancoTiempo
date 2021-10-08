/* global ID_MOVIL, ESCUCHA_EN_SINCRONIZAR */

var ser_rastreo = require('./ser_rastreo');
var CM_Trama = require('./CM_Trama');
var moment = require('moment-timezone');
var emit = require('./emit');

module.exports = {
    on: on
};

/**
 * Description
 * @method on
 * @param {} socket
 * @return 
 */
function on(socket) {

    /**
     * @api {EMIT>APP} /rc_/ responder comando
     * @apiGroup APP>RASTREO
     * @apiVersion 1.0.0
     * 
     * @apiParam {int} idEquipo 
     * @apiParam {json} respuesta {} 
     * @apiParam {Json} trama {"fD":"2018-03-03 17:56:24","iA":-1, "iE":1,"p":[-79.2104899,-3.9701365],"va":"9","b1":"1","b2":"0","b3":"1","b4":"1","b5":"1","pr":"9","v":"0.0","r":"0.0","gm":"0","gs":"1","in":"1"}
     * 
     * @apiParam {ACK} function canal de respuesta inmediata.
     *
     * @apiSuccess (ACK Error) {json} APP {error: ERROR_QUERY }
     * @apiSuccessExample ACK_Error:
     *      En caso de existir este error se debera contemplar un mensaje alterno ya que esto ocurre solo 
     *      si el servidor no pudo procesar la peticion correctamente.    
     */
    socket.on('rc_', function (idEquipo, respuesta, trama, confirmacion) {
        if (typeof confirmacion === "function") {
            return confirmacion({en: 1});
        }
    });

    /**
     * @api {EMIT>APP} /t_/ registrar trama
     * @apiGroup APP>RASTREO
     * @apiVersion 1.0.0
     * 
     * @apiParam {Json} trama {"fD":"2018-03-03 17:56:24","iC":1, "iE":1,"p":[-79.2104899,-3.9701365],"va":"9","b1":"1","b2":"0","b3":"1","b4":"1","b5":"1","pr":"9","v":"0.0","r":"0.0","gm":"0","gs":"1","in":"1"}
     * 
     * @apiParam {ACK} function canal de respuesta inmediata.
     *
     * @apiSuccess (ACK Error) {json} APP {error: ERROR_QUERY }
     * @apiSuccessExample ACK_Error:
     *      En caso de existir este error se debera contemplar un mensaje alterno ya que esto ocurre solo 
     *      si el servidor no pudo procesar la peticion correctamente.    
     */
    socket.on('t_', function (trama, confirmacion) {
        if (typeof confirmacion === "function") {
            trama['fD'] = trama['fD'] + '.000Z';
            trama['fR'] = moment().tz('Africa/Bissau').format().replace(/T/, ' ').replace(/\..+/, '').substring(0, 19) + '.000Z';
            trama['iEt'] = ID_MOVIL;
            ser_rastreo.notificarTrama(ID_MOVIL, trama['iE'], trama);
            CM_Trama.guardar(trama);
            return confirmacion({en: 1});
        }
    });
    /**
     * @api {EMIT>APP} /l_/ registrar lote
     * @apiGroup APP>RASTREO
     * @apiVersion 1.0.0
     * 
     * @apiParam {Json} lote [{"fD":"2018-03-03 17:56:24","iC":1,"iE":1,"p":[-79.2104899,-3.9701365],"va":"9","b1":"1","b2":"0","b3":"1","b4":"1","b5":"1","pr":"9","v":"0.0","r":"0.0","gm":"0","gs":"1","in":"1"}]
     * 
     * @apiParam {ACK} function canal de respuesta inmediata.
     *
     * @apiSuccess (ACK Error) {json} APP {error: ERROR_QUERY }
     * @apiSuccessExample ACK_Error:
     *      En caso de existir este error se debera contemplar un mensaje alterno ya que esto ocurre solo 
     *      si el servidor no pudo procesar la peticion correctamente.    
     */
    socket.on('l_', function (lote, confirmacion) {
        if (typeof confirmacion === "function") {
            let fR = moment().tz('Africa/Bissau').format().replace(/T/, ' ').replace(/\..+/, '').substring(0, 19) + '.000Z';
            lote.forEach(trama => {
                trama['fR'] = fR;
                trama['fD'] = trama['fD'] + '.000Z';
                trama['iEt'] = ID_MOVIL;
                CM_Trama.guardar(trama);
            });
            return confirmacion({en: 1});
        }
    });
}