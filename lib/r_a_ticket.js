
var cnf=require('./config.js');var router=require('express').Router();router.post('/registrar/',function(req,res){var version=req.headers.version;if(version==='1.0.0')
return registrarTicket(req,res);return res.status(320).send({m:MENSAJE_DEPRECATE});});function registrarTicket(req,res){var descripcionActividad=req.body.descripcionActividad;var idCategoria=req.body.idCategoria;var idUsuario=req.body.idUsuario;var titulo=req.body.titulo;if(!descripcionActividad)
return res.status(400).send({en:-1,param:'descripcionActividad'});if(!titulo)
return res.status(400).send({en:-1,param:'titulo'});if(!idCategoria)
return res.status(400).send({en:-1,param:'idCategoria'});if(!idUsuario)
return res.status(400).send({en:-1,param:'idUsuario'});cnf.ejecutarResSQL(SQL_INSERT_TICKET,[descripcionActividad,idCategoria,idUsuario,titulo],function(ofertas_demandas){if(ofertas_demandas['insertId']<=0)
return res.status(200).send({en:-1,m:'Lo sentimos, por favor intenta de nuevo más tarde.'});return res.status(200).send({en:1,m:'Registro realizado correctamente'});},res);}
var SQL_INSERT_TICKET="INSERT INTO bancodt.ofertas_demandas ( descripcion_actividad, idCategoria, id_ofertante, titulo,tipo) VALUES ( ?, ?, ?,?,1)";router.post('/editar/',function(req,res){var version=req.headers.version;if(version==='1.0.0')
return actualizarTicket(req,res);return res.status(320).send({m:MENSAJE_DEPRECATE});});function actualizarTicket(req,res){var descripcionActividad=req.body.descripcionActividad;var idCategoria=req.body.idCategoria;var titulo=req.body.titulo;var idOfertasDemandas=req.body.idOfertasDemandas;var estado=req.body.estado;if(!descripcionActividad)
return res.status(400).send({en:-1,param:'descripcionActividad'});if(!titulo)
return res.status(400).send({en:-1,param:'titulo'});if(!idCategoria)
return res.status(400).send({en:-1,param:'idCategoria'});if(!idOfertasDemandas)
return res.status(400).send({en:-1,param:'idOfertasDemandas'});if(!estado)
return res.status(400).send({en:-1,param:'estado'});cnf.ejecutarResSQL(SQL_UPDATE_ADICIONAL,[titulo,descripcionActividad,idCategoria,estado,idOfertasDemandas],function(movimiento){if(movimiento['affectedRows']<=0)
return res.status(200).send({en:-1,m:'Lo sentimos, por favor intenta de nuevo más tarde.'});return res.status(200).send({en:1,m:'Oferta actualizada correctamente.'});},res);}
var SQL_UPDATE_ADICIONAL="UPDATE bancodt.ofertas_demandas SET titulo=?, descripcion_actividad=?, idCategoria=?, estado=? WHERE idOfertasDemandas=?;";module.exports=router;