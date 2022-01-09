
var cnf=require('./config.js');var router=require('express').Router();router.post('/registrar/',function(req,res){var version=req.headers.version;if(version==='1.0.0')
return registrarTicket(req,res);return res.status(320).send({m:MENSAJE_DEPRECATE});});function registrarTicket(req,res){var horas=req.body.horas;var descripcionActividad=req.body.descripcionActividad;var idCategoria=req.body.idCategoria;var idUsuario=req.body.idUsuario;var titulo=req.body.titulo;if(!horas)
return res.status(400).send({en:-1,param:'horas'});if(!descripcionActividad)
return res.status(400).send({en:-1,param:'descripcionActividad'});if(!titulo)
return res.status(400).send({en:-1,param:'titulo'});if(!idCategoria)
return res.status(400).send({en:-1,param:'idCategoria'});if(!idUsuario)
return res.status(400).send({en:-1,param:'idUsuario'});cnf.ejecutarResSQL(SQL_INSERT_TICKET,[horas,descripcionActividad,idCategoria,idUsuario,titulo],function(ofertas_demandas){if(ofertas_demandas['insertId']<=0)
return res.status(200).send({en:-1,m:'Lo sentimos, por favor intenta de nuevo más tarde.'});return res.status(200).send({en:1,m:'Registro realizado correctamente'});},res);}
var SQL_INSERT_TICKET="INSERT INTO bancodt.ofertas_demandas (horas, descripcion_actividad, idCategoria, id_ofertante, titulo) VALUES (?, ?, ?, ?,?)";const SQL_EXISTE_LUGAR="SELECT l.idCompania FROM "+_BD_+".lugar l WHERE l.idLugar = ? ;";router.post('/editar/',function(req,res){var version=req.headers.version;if(version==='1.0.0')
return actualizarTicket(req,res);return res.status(320).send({m:MENSAJE_DEPRECATE});});function actualizarTicket(req,res){var horas=req.body.horas;var descripcionActividad=req.body.descripcionActividad;var idCategoria=req.body.idCategoria;var titulo=req.body.titulo;var idOfertasDemandas=req.body.idOfertasDemandas;if(!horas)
return res.status(400).send({en:-1,param:'horas'});if(!descripcionActividad)
return res.status(400).send({en:-1,param:'descripcionActividad'});if(!titulo)
return res.status(400).send({en:-1,param:'titulo'});if(!idCategoria)
return res.status(400).send({en:-1,param:'idCategoria'});if(!idOfertasDemandas)
return res.status(400).send({en:-1,param:'idOfertasDemandas'});cnf.ejecutarResSQL(SQL_UPDATE_ADICIONAL,[horas,titulo,descripcionActividad,idCategoria,idOfertasDemandas],function(movimiento){if(movimiento['affectedRows']<=0)
return res.status(200).send({en:-1,m:'Lo sentimos, por favor intenta de nuevo más tarde.'});return res.status(200).send({en:1,m:'Oferta actualizada correctamente.'});},res);}
var SQL_UPDATE_ADICIONAL="UPDATE bancodt.ofertas_demandas SET horas=?, titulo=?, descripcion_actividad=?, idCategoria=? WHERE idOfertasDemandas=?;";module.exports=router;