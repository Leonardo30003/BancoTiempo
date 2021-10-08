
var cnf=require('./config.js');var router=require('express').Router();router.post('/listar-adicional/',function(req,res){var version=req.headers.version;if(version==='1.0.0')
return obtenerListaAdicionales(req,res);return res.status(320).send({m:MENSAJE_DEPRECATE});});function obtenerListaAdicionales(req,res){var idSucursal=req.body.idSucursal
var idAdministrador=req.body.idAdministrador
var desde=req.body.desde
var cuantos=req.body.cuantos
if(!idSucursal)
return res.status(400).send({en:-1,param:'Parameter missing code 0'});if(!idAdministrador)
return res.status(400).send({en:-1,param:'Parameter missing code 1'});if(desde==null)
return res.status(400).send({en:-1,param:'Parameter missing code 2'});if(!cuantos)
return res.status(400).send({en:-1,param:'Parameter missing code 3'});var auth=req.body.auth;var idPlataforma=req.body.idPlataforma;var imei=req.body.imei;var marca=req.body.marca;var modelo=req.body.modelo;var so=req.body.so;var vs=req.body.vs;var idAplicativo=req.body.idAplicativo;if(!auth)
return res.status(400).send({en:-1,param:'Parameter missing code 100'});if(!idAplicativo)
return res.status(400).send({en:-1,param:'Parameter missing code 101'});if(!idPlataforma)
return res.status(400).send({en:-1,param:'Parameter missing code 102'});if(!imei)
return res.status(400).send({en:-1,param:'Parameter missing code 103'});if(!marca)
return res.status(400).send({en:-1,param:'Parameter missing code 104'});if(!modelo)
return res.status(400).send({en:-1,param:'Parameter missing code 105'});if(!so)
return res.status(400).send({en:-1,param:'Parameter missing code 106'});if(!vs)
return res.status(400).send({en:-1,param:'Parameter missing code 107'});let versiones=vs.split('.');if(versiones.length!=3)
return res.status(400).send({en:-1,param:'vs'});if(isNaN(versiones[0]))
return res.status(400).send({en:-1,param:'v1'});if(isNaN(versiones[1]))
return res.status(400).send({en:-1,param:'v2'});if(isNaN(versiones[2]))
return res.status(400).send({en:-1,param:'v3'});cnf.ejecutarResSQL(SQL_SELECT_ADICIONAL_SCUURSAL,[idSucursal,parseInt(desde),parseInt(cuantos)],function(adicionales){if(adicionales.length<=0)
return res.status(200).send({en:-1,m:'Lo sentimos, la sucursal no tiene adiconales.'});return res.status(200).send({en:1,lA:adicionales});},res);}
var SQL_SELECT_ADICIONAL_SCUURSAL="SELECT a.idAdicionalProducto, a.idSucursal, a.adicional, a.descripcion, IF(a.habilitado=1,1,0) AS habilitado, a.idAdministradorRegistro, a.fecha_registro FROM clipp.adicionalProducto a WHERE a.idSucursal=? AND a.habilitado=1 LIMIT ?, ?;";router.post('/registrar/',function(req,res){var version=req.headers.version;if(version==='1.0.0')
return registrarAdicional(req,res);return res.status(320).send({m:MENSAJE_DEPRECATE});});function registrarAdicional(req,res){var idSucursal=req.body.idSucursal
var adicional=req.body.adicional
var descripcion=req.body.descripcion
var idAdministrador=req.body.idAdministrador
if(!idSucursal)
return res.status(400).send({en:-1,param:'Parameter missing code 0'});if(!idAdministrador)
return res.status(400).send({en:-1,param:'Parameter missing code 1'});if(!adicional)
return res.status(400).send({en:-1,param:'Parameter missing code 2'});var auth=req.body.auth;var idPlataforma=req.body.idPlataforma;var imei=req.body.imei;var marca=req.body.marca;var modelo=req.body.modelo;var so=req.body.so;var vs=req.body.vs;var idAplicativo=req.body.idAplicativo;if(!auth)
return res.status(400).send({en:-1,param:'Parameter missing code 100'});if(!idAplicativo)
return res.status(400).send({en:-1,param:'Parameter missing code 101'});if(!idPlataforma)
return res.status(400).send({en:-1,param:'Parameter missing code 102'});if(!imei)
return res.status(400).send({en:-1,param:'Parameter missing code 103'});if(!marca)
return res.status(400).send({en:-1,param:'Parameter missing code 104'});if(!modelo)
return res.status(400).send({en:-1,param:'Parameter missing code 105'});if(!so)
return res.status(400).send({en:-1,param:'Parameter missing code 106'});if(!vs)
return res.status(400).send({en:-1,param:'Parameter missing code 107'});let versiones=vs.split('.');if(versiones.length!=3)
return res.status(400).send({en:-1,param:'vs'});if(isNaN(versiones[0]))
return res.status(400).send({en:-1,param:'v1'});if(isNaN(versiones[1]))
return res.status(400).send({en:-1,param:'v2'});if(isNaN(versiones[2]))
return res.status(400).send({en:-1,param:'v3'});cnf.ejecutarResSQL(SQL_INSERT_ADICIONAL,[idSucursal,adicional,descripcion,idAdministrador],function(adicional){if(adicional['insertId']<=0)
return res.status(200).send({en:-1,m:'Lo sentimos, por favor intenta de nuevo más tarde.'});return res.status(200).send({en:1,m:'Registro realizado correctamente'});},res);}
var SQL_INSERT_ADICIONAL="INSERT INTO clipp.adicionalProducto (idSucursal, adicional, descripcion, idAdministradorRegistro, fecha_registro) VALUES (?, ?, ?, ?, now());";router.post('/editar/',function(req,res){var version=req.headers.version;if(version==='1.0.0')
return actualizarAdicional(req,res);return res.status(320).send({m:MENSAJE_DEPRECATE});});function actualizarAdicional(req,res){var idAdicionalProducto=req.body.idAdicionalProducto
var idSucursal=req.body.idSucursal
var adicional=req.body.adicional
var descripcion=req.body.descripcion
var idAdministrador=req.body.idAdministrador
if(!idAdicionalProducto)
return res.status(400).send({en:-1,param:'Parameter missing code 0'});if(!idSucursal)
return res.status(400).send({en:-1,param:'Parameter missing code 1'});if(!idAdministrador)
return res.status(400).send({en:-1,param:'Parameter missing code 2'});if(!adicional)
return res.status(400).send({en:-1,param:'Parameter missing code 3'});var auth=req.body.auth;var idPlataforma=req.body.idPlataforma;var imei=req.body.imei;var marca=req.body.marca;var modelo=req.body.modelo;var so=req.body.so;var vs=req.body.vs;var idAplicativo=req.body.idAplicativo;if(!auth)
return res.status(400).send({en:-1,param:'Parameter missing code 100'});if(!idAplicativo)
return res.status(400).send({en:-1,param:'Parameter missing code 101'});if(!idPlataforma)
return res.status(400).send({en:-1,param:'Parameter missing code 102'});if(!imei)
return res.status(400).send({en:-1,param:'Parameter missing code 103'});if(!marca)
return res.status(400).send({en:-1,param:'Parameter missing code 104'});if(!modelo)
return res.status(400).send({en:-1,param:'Parameter missing code 105'});if(!so)
return res.status(400).send({en:-1,param:'Parameter missing code 106'});if(!vs)
return res.status(400).send({en:-1,param:'Parameter missing code 107'});let versiones=vs.split('.');if(versiones.length!=3)
return res.status(400).send({en:-1,param:'vs'});if(isNaN(versiones[0]))
return res.status(400).send({en:-1,param:'v1'});if(isNaN(versiones[1]))
return res.status(400).send({en:-1,param:'v2'});if(isNaN(versiones[2]))
return res.status(400).send({en:-1,param:'v3'});cnf.ejecutarResSQL(SQL_UPDATE_ADICIONAL,[idSucursal,adicional,descripcion,idAdministrador,idAdicionalProducto],function(adicional){if(adicional['affectedRows']<=0)
return res.status(200).send({en:-1,m:'Lo sentimos, por favor intenta de nuevo más tarde.'});return res.status(200).send({en:1,m:'Adicional actualizado correctamente.'});},res);}
var SQL_UPDATE_ADICIONAL="UPDATE clipp.adicionalProducto SET idSucursal=?, adicional=?, descripcion=?, fecha_actualizo=now(), idAdministradorActualizo=? WHERE idAdicionalProducto=?;";router.post('/habilitar/',function(req,res){var version=req.headers.version;if(version==='1.0.0')
return habilitarAdicional(req,res);return res.status(320).send({m:MENSAJE_DEPRECATE});});function habilitarAdicional(req,res){var idAdicionalProducto=req.body.idAdicionalProducto
var habilitado=req.body.habilitado
var idAdministrador=req.body.idAdministrador
if(!idAdicionalProducto)
return res.status(400).send({en:-1,param:'Parameter missing code 0'});if(!habilitado)
return res.status(400).send({en:-1,param:'Parameter missing code 1'});if(!idAdministrador)
return res.status(400).send({en:-1,param:'Parameter missing code 2'});var auth=req.body.auth;var idPlataforma=req.body.idPlataforma;var imei=req.body.imei;var marca=req.body.marca;var modelo=req.body.modelo;var so=req.body.so;var vs=req.body.vs;var idAplicativo=req.body.idAplicativo;if(!auth)
return res.status(400).send({en:-1,param:'Parameter missing code 100'});if(!idAplicativo)
return res.status(400).send({en:-1,param:'Parameter missing code 101'});if(!idPlataforma)
return res.status(400).send({en:-1,param:'Parameter missing code 102'});if(!imei)
return res.status(400).send({en:-1,param:'Parameter missing code 103'});if(!marca)
return res.status(400).send({en:-1,param:'Parameter missing code 104'});if(!modelo)
return res.status(400).send({en:-1,param:'Parameter missing code 105'});if(!so)
return res.status(400).send({en:-1,param:'Parameter missing code 106'});if(!vs)
return res.status(400).send({en:-1,param:'Parameter missing code 107'});let versiones=vs.split('.');if(versiones.length!=3)
return res.status(400).send({en:-1,param:'vs'});if(isNaN(versiones[0]))
return res.status(400).send({en:-1,param:'v1'});if(isNaN(versiones[1]))
return res.status(400).send({en:-1,param:'v2'});if(isNaN(versiones[2]))
return res.status(400).send({en:-1,param:'v3'});var SQL_HABILITAR_ADICIONAL="";if(habilitado==1)
SQL_HABILITAR_ADICIONAL="UPDATE clipp.adicionalProducto SET habilitado=?, idAdministradorHabilito=?, fecha_habilito=now() WHERE idAdicionalProducto=?;";else
SQL_HABILITAR_ADICIONAL="UPDATE clipp.adicionalProducto SET habilitado=?, idAdministradorDeshabilito=?,  fecha_deshabilito=now() WHERE idAdicionalProducto=?;";cnf.ejecutarResSQL(SQL_HABILITAR_ADICIONAL,[parseInt(habilitado),idAdministrador,idAdicionalProducto],function(adicional){if(adicional['affectedRows']<=0)
return res.status(200).send({en:-1,m:'Lo sentimos, por favor intenta de nuevo más tarde.'});return res.status(200).send({en:1,m:'Adicional actualizado correctamente.'});},res);}
module.exports=router;