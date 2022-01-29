
var cnf=require('./config.js');var router=require('express').Router();router.post('/listar/',function(req,res){var version=req.headers.version;if(version==='1.0.0')
return listarOfertas(req,res);return res.status(320).send({m:'versión'});});function listarOfertas(req,res){var desde=req.body.desde;var cuantos=req.body.cuantos;var idUsuario=req.body.idUsuario;var criterio=req.body.criterio;var where=''
if(idUsuario)
where=' where od.id_ofertante= '+idUsuario;if(!desde)
return res.status(400).send({error:1,param:'desde'});if(!cuantos)
return res.status(400).send({error:1,param:'cuantos'});var SQL_OFERTAS="SELECT od.idOfertasDemandas,od.fecha_creacion ,od.descripcion_actividad,od.titulo, od.horas,u.idUsuario,u.calificacion, p.nombres, p.apellidos,c.idCategoria,c.categoria FROM bancodt.ofertas_demandas od  inner join usuario u on od.id_ofertante = u.idUsuario inner join persona p on u.id_persona = p.id_persona inner join categoria c on c.idCategoria= od.idCategoria "+where+" order by od.fecha_creacion  desc LIMIT ?, ?;";cnf.ejecutarResSQL(SQL_OFERTAS,[parseInt(desde),parseInt(cuantos)],function(movmientos){if(movmientos.length<=0)
return res.status(200).send({en:-1,m:'Lo sentimos pero no se encuentran movimientos para los parametros enviados.'});return res.status(200).send({en:1,lM:movmientos});},res);}
module.exports=router;