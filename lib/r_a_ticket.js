
var cnf=require('./config.js');var router=require('express').Router();router.post('/registrar/',function(req,res){var version=req.headers.version;if(version==='1.0.0')
return registrarTicket(req,res);return res.status(320).send({m:MENSAJE_DEPRECATE});});function registrarTicket(req,res){var idLugar=req.body.idLugar;var codigo=req.body.codigo;var numero=req.body.numero;var placa=req.body.placa;var estado=req.body.estado;var fechaHoraIngreso=req.body.fechaHoraIngreso;if(!idLugar)
return res.status(400).send({en:-1,param:'idLugar'});if(!codigo)
return res.status(400).send({en:-1,param:'codigo'});if(!numero)
return res.status(400).send({en:-1,param:'numero'});if(!fechaHoraIngreso)
return res.status(400).send({en:-1,param:'fechaHoraIngreso'});cnf.ejecutarResSQL(SQL_EXISTE_LUGAR,[idLugar],function(lugar){if(lugar.length<=0)
return res.status(200).send({en:-1,m:'Lugar no registrado'});cnf.ejecutarResSQL(SQL_INSERT_TICKET,[lugar[0]['idCompania'],idLugar,codigo,numero,placa,fechaHoraIngreso,estado],function(ticket){if(ticket['insertId']<=0)
return res.status(200).send({en:-1,m:'Lo sentimos, por favor intenta de nuevo más tarde.'});return res.status(200).send({en:1,m:'Registro realizado correctamente'});},res);},res);}
var SQL_INSERT_TICKET="INSERT INTO "+_BD_+".ticket (idCompania, idLugar, codigo, numero, placa, fechaHoraIngreso, estado) VALUES (?, ?, ?, ?, ?, ?, ?);";const SQL_EXISTE_LUGAR="SELECT l.idCompania FROM "+_BD_+".lugar l WHERE l.idLugar = ? ;";router.post('/editar/',function(req,res){var version=req.headers.version;if(version==='1.0.0')
return actualizarTicket(req,res);return res.status(320).send({m:MENSAJE_DEPRECATE});});function actualizarTicket(req,res){var idLugar=req.body.idLugar;var codigo=req.body.codigo;var fechaHoraSalida=req.body.fechaHoraSalida;var fechaHoraPago=req.body.fechaHoraSalida;var estado=req.body.estado;var total=req.body.total;var nombreDescuento=req.body.nombreDescuento;var valorDescuento=req.body.valorDescuento;var usuarioId=req.body.usuarioId;var comentario=req.body.comentario;if(!idLugar)
return res.status(400).send({en:-1,param:'idLugar'});if(!codigo)
return res.status(400).send({en:-1,param:'codigo'});if(!fechaHoraSalida)
return res.status(400).send({en:-1,param:'fechaHoraSalida'});if(!fechaHoraPago)
return res.status(400).send({en:-1,param:'fechaHoraPago'});cnf.ejecutarResSQL(SQL_EXISTE_LUGAR,[idLugar],function(lugar){if(lugar.length<=0)
return res.status(200).send({en:-1,m:'Lugar no registrado'});cnf.ejecutarResSQL(SQL_UPDATE_ADICIONAL,[fechaHoraSalida,fechaHoraPago,estado,total,nombreDescuento,valorDescuento,usuarioId,comentario,codigo],function(movimiento){if(movimiento['affectedRows']<=0)
return res.status(200).send({en:-1,m:'Lo sentimos, por favor intenta de nuevo más tarde.'});return res.status(200).send({en:1,m:'Ticket actualizado correctamente.'});},res);},res);}
var SQL_UPDATE_ADICIONAL="UPDATE "+_BD_+".ticket SET fechaHoraSalida=?, fechaHoraPago=?,  estado=?, total=?, nombreDescuento=?, valorDescuento=?, usuarioId=?,comentario=?,  fecha_actualizo=now() WHERE codigo=?;";module.exports=router;