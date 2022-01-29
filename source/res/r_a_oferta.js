/* global _BD_, IP_SERVIDOR_NODE, _BDH_, MENSAJE_DEPRECATE */

var cnf = require('./config.js');
var router = require('express').Router();

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
    var idUsuario = req.body.idUsuario;

    if (!idUsuario)
        return res.status(400).send({en: -1, param: 'idUsuario'});


    if (!desde)
        return res.status(400).send({error: 1, param: 'desde'});
    if (!cuantos)
        return res.status(400).send({error: 1, param: 'cuantos'});
//    if (!criterio)
//        return res.status(400).send({error: 1, param: 'criterio'});
    var SQL_OFERTAS = "SELECT if((select idfavorito from bancodt.favorito where idOfertaDemanda=od.idOfertasDemandas and idUsuario=? ) >0,1,0) as isFavorito, if(u.idUsuario=?,0,1) as pagar, od.idOfertasDemandas,od.fecha_creacion ,od.descripcion_actividad,od.titulo,u.idUsuario,u.calificacion, p.nombres, p.apellidos,c.idCategoria,c.categoria,p.email,p.imagen FROM bancodt.ofertas_demandas od  inner join usuario u on od.id_ofertante = u.idUsuario inner join persona p on u.id_persona = p.id_persona inner join categoria c on c.idCategoria= od.idCategoria left join favorito f on f.idOfertaDemanda= od.idOfertasDemandas order by isFavorito desc,od.fecha_creacion  desc LIMIT ?, ?;";



    cnf.ejecutarResSQL(SQL_OFERTAS, [idUsuario,idUsuario,parseInt(desde), parseInt(cuantos)], function (movmientos) {
        if (movmientos.length <= 0)
            return res.status(200).send({en: -1, m: 'Lo sentimos pero no se encuentran ofertas registradas'});

        return res.status(200).send({en: 1, lM: movmientos});
    }, res);


}
router.post('/reg-favorito/', function (req, res) {
    var version = req.headers.version;
    if (version === '1.0.0')
        return registrarFavorito(req, res);
    return res.status(320).send({m: MENSAJE_DEPRECATE});
});

function registrarFavorito(req, res) {
    var idOfertaDemanda = req.body.idOfertaDemanda;
    var idUsuario = req.body.idUsuario;



    if (!idOfertaDemanda)
        return res.status(400).send({en: -1, param: 'idOfertaDemanda'});
    if (!idUsuario)
        return res.status(400).send({en: -1, param: 'idUsuario'});


    cnf.ejecutarResSQL(SQL_INSERT_TICKET, [horas, descripcionActividad, idCategoria, idUsuario, titulo], function (ofertas_demandas) {
        if (ofertas_demandas['insertId'] <= 0)
            return res.status(200).send({en: -1, m: 'Lo sentimos, por favor intenta de nuevo más tarde.'});

        return res.status(200).send({en: 1, m: 'Registro realizado correctamente'});
    }, res);
}

var SQL_INSERT_TICKET = "INSERT INTO bancodt.ofertas_demandas (horas, descripcion_actividad, idCategoria, id_ofertante, titulo) VALUES (?, ?, ?, ?,?)";


module.exports = router;
