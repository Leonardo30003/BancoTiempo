var a_autenticar = require('./c_autenticar');

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
     * @api {EMIT>ADMINSITRADOR} /a_autenticar/ a_autenticar
     * @apiGroup A_Autenticar
     * @apiVersion 1.0.0
     *
     * @apiParam {Json} datosJson {idAdministrador, imei, idApp, idPl}, idApp{1:cliente}
     * 
     * @apiParam {ACK} function canal de respuesta inmediata.
     *
     * @apiSuccess (ACK Normal) {json} ADMINSITRADOR {en: 1, lS: [{idSincronizar, version}]}
     * @apiSuccessExample ACK_Normal:
     *     Flujo normal de eventos.
     *     
     * @apiSuccess (ACK Error) {json} ADMINSITRADOR {error: ERROR_QUERY }
     * @apiSuccessExample ACK_Error:
     *      En caso de existir este error se debera contemplar un mensaje alterno ya que esto ocurre solo 
     *      si el servidor no pudo procesar la peticion correctamente.    
     */
    socket.on('a_autenticar', function (datosJson, confirmacion) {
//        console.log("AUTENTICAR: ",datosJson);
        socket.auth = true;
        socket.idApp = datosJson['idApp'];
        if (typeof confirmacion === "function")
            a_autenticar.autenticar((isNaN(datosJson['idAdministrador']) ? null : (parseInt(datosJson['idAdministrador']) <= 0 ? null : datosJson['idAdministrador'])), datosJson['imei'], socket, datosJson['idApp'], datosJson['idPl'], confirmacion);
    });
    
}