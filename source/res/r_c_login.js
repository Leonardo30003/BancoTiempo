/* global _BD_, IP_SERVIDOR_NODE, _BDH_, MENSAJE_DEPRECATE */

var cnf = require('./config.js');
var router = require('express').Router();



/**
 * @api {post} /c/login/autenticar autenticar
 * @apiGroup C>LOGIN
 * @apiVersion 3.1.1
 * 
 * @apiParam {int} idAplicativo
 * @apiParam {String} usuario sera el correo electronico o el celular con el que se registro
 * @apiParam {String} clave deberá ser enviada con un MD5
 * @apiParam {String} idFacebook en caso de autenticarce con facebook, si no se logea con facebook no se enviara la clave idFacebook
 * 
 * @apiParam {String} token token de firebase
 * 
 * @apiParam {int} idPlataforma iOs, Android, WEB
 * @apiParam {String} imei
 * @apiParam {String} marca marca del dispositivo. Maximo 45 caracteres
 * @apiParam {String} modelo del del dispositivo. Maximo 45 caracteres
 * @apiParam {String} so sistema operativo del dispositivo. Maximo 45 caracteres
 * @apiParam {String} vs version del APP formato obligatorio (numbre.numbre.number). Maximo 45 caracteres
 *  
 * @apiSuccess {json} json {en: 1, usuario: {idCliente, celular, correo, nombres, apellidos, cedula}}
 * @apiSuccessExample Success-Response:
 *   Fujo normal de eventos: Si cambiarClave = 2 se mostrara pantalla de cambio de clave caso contrario se ingresara normalmente.
 *   
 * @apiSuccess (Execpcional_1) {json} json {en: -1, m: 'Usuario y/o contraseñas incorrectas'}
 * @apiSuccessExample Execpcional_1:
 *      Flujo alterno de eventos:
 *   
 * @apiError {json} json {error: CODIGO_ERROR};
 * @apiErrorExample Error-Response:
 *   Los errores devuelve desde el estado de error -200 y menores
 */
router.post('/autenticar/', function (req, res) {
    var version = req.headers.version;
    if (version === '1.0.0')
        return autenticar(req, res);
    return res.status(320).send({m: MENSAJE_DEPRECATE});
});

function autenticar(req, res) {
    var usuario = req.body.usuario;
    var clave = req.body.clave;


    if (!usuario)
        return res.status(400).send({error: 1, param: 'usuario'});
    if (!clave)
        return res.status(400).send({error: 1, param: 'clave'});


    cnf.ejecutarResSQL(SQL_AUTENTICAR, [usuario, clave], function (usuarios) {
        if (usuarios.length <= 0)
            return res.status(200).send({en: -1, m: 'Usuario y/o contraseñas incorrectas'});
        return res.status(200).send({en: 1, usuario: usuarios[0]});
    }, res);
}

const SQL_AUTENTICAR =
        "SELECT idUsuario,nombres,apellidos,imagen FROM " + _BD_ + ".usuario where usuario=? and contrasenia=MD5(CONCAT(?, 'd2be0658f23e36fdf58c408302faabbb')) and bloqueado=0;"

router.post('/vehiculo/', function (req, res) {
    var version = req.headers.version;
    if (version === '1.0.0')
        return consultaVehiculo(req, res);
    return res.status(320).send({m: MENSAJE_DEPRECATE});
});

function consultaVehiculo(req, res) {
    var idUsuario = req.body.idUsuario;

    if (!idUsuario)
        return res.status(400).send({error: 1, param: 'idUsuario'});

    cnf.ejecutarResSQL(SQL_VEHICULOS, [idUsuario], function (vehiculos) {
        if (vehiculos.length <= 0)
            return res.status(200).send({en: -1, m: 'El usuario no tiene Vehiculos Asignados'});
        return res.status(200).send({en: 1, v: vehiculos});
    }, res);
}

const SQL_VEHICULOS =
        "SELECT t.idTarjeta, t.tarjeta, v.idVehiculo,v.placa,vt.vehiculoTipo FROM kparkingutpl.tarjeta t " +
        " inner join tarjetaAsignacion ta on ta.idTarjeta=t.idTarjeta and ta.habilitado=1" +
        " left join tarjetaVehiculo tv on tv.idTarjeta=t.idTarjeta and tv.habilitado=1" +
        " inner join vehiculo v on v.idVehiculo = tv.idVehiculo" +
        " inner join vehiculoTipo vt on vt.idVehiculoTipo=v.idVehiculoTipo" +
        " where idAsignado=?"

router.post('/tarjeta/', function (req, res) {
    var version = req.headers.version;
    if (version === '1.0.0')
        return consultaTarjeta(req, res);
});

function consultaTarjeta(req, res) {
    var idUsuario = req.body.idUsuario;
    if (!idUsuario)
        return res.status(400).send({error: 1, param: 'idUsuario'});

    cnf.ejecutarResSQL(SQL_TARJETAS, [idUsuario], function (tarjeta) {
        if (tarjeta.length <= 0)
            return res.status(200).send({en: -1, m: 'El usuario no tiene Tarjetas Asignadas'});
        return res.status(200).send({en: 1, t: tarjeta});
    }, res);
}

const SQL_TARJETAS =
        "SELECT t.idTarjeta,t.tarjeta,tp.tarjetaTipo FROM kparkingutpl.tarjetaAsignacion ta" +
        " inner join tarjeta t on t.idTarjeta=ta.idTarjeta" +
        " inner join tarjetaTipo tp on tp.idTarjetaTipo=t.idTarjetaTipo" +
        " where idAsignado=? and habilitado=1";

router.post('/permiso/', function (req, res) {
    var version = req.headers.version;
    if (version === '1.0.0')
        return consultaPermisos(req, res);
    return res.status(320).send({m: MENSAJE_DEPRECATE});
});
//arreglar para n lugares de la tarjeta
function consultaPermisos(req, res) {
    var idTarjeta = req.body.idTarjeta;
    if (!idTarjeta)
        return res.status(400).send({error: 1, param: 'idTarjeta'});

    cnf.ejecutarResSQL(SQL_LUGARES_PERMISO, [idTarjeta], function (permiso) {
        if (permiso.length <= 0)
            return res.status(200).send({en: -1, m: 'El usuario no tiene Tarjetas Asignadas'});
        var tamanio = permiso.length - 1;
        var contador = 0;
        permiso.forEach(function (lugar, index) {
            cnf.ejecutarResSQL(SQL_HORARIO, [lugar.idHorario], function (horario) {
                lugar.h = horario;
                if (contador === tamanio)
                    return res.status(200).send({en: 1, l: permiso});
                contador++;
            }, res);
        });



    }, res);
}
const SQL_HORARIO =
        "SELECT if(dia=1,'Domingo',if(dia=2,'Lunes',if(dia=3,'Martes',if(dia=4,'Miercoles',if(dia=5,'Jueves',if(dia=6,'Viernes',if(dia=7,'Sábado',''))))))) as dia,desde,hasta FROM kparkingutpl.horarioDetalle where idHorario=? and habilitado=1 ;";

const SQL_LUGARES_PERMISO =
        "SELECT l.lugar,tlh.idHorario,tlh.fechaInicio,tlh.fechaFin FROM kparkingutpl.tarjetaLugarHorario tlh" +
        " inner join lugar l on l.idLugar=tlh.idLugar" +
        " where idTarjeta=?";


module.exports = router;