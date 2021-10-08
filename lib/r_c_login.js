
var cnf=require('./config.js');var router=require('express').Router();router.post('/autenticar/',function(req,res){var version=req.headers.version;if(version==='1.0.0')
return autenticar(req,res);return res.status(320).send({m:MENSAJE_DEPRECATE});});function autenticar(req,res){var usuario=req.body.usuario;var clave=req.body.clave;if(!usuario)
return res.status(400).send({error:1,param:'usuario'});if(!clave)
return res.status(400).send({error:1,param:'clave'});cnf.ejecutarResSQL(SQL_AUTENTICAR,[usuario,clave],function(usuarios){if(usuarios.length<=0)
return res.status(200).send({en:-1,m:'Usuario y/o contraseñas incorrectas'});return res.status(200).send({en:1,usuario:usuarios[0]});},res);}
const SQL_AUTENTICAR="SELECT p.id_persona,p.nombres,p.apellidos, p.telefono,pr.usuario FROM bancodt.persona p inner join persona_has_rol pr on pr.id_persona=p.id_persona where pr.rol_id_rol=2 and usuario=? and password = ?"
router.post('/vehiculo/',function(req,res){var version=req.headers.version;if(version==='1.0.0')
return consultaVehiculo(req,res);return res.status(320).send({m:MENSAJE_DEPRECATE});});function consultaVehiculo(req,res){var idUsuario=req.body.idUsuario;if(!idUsuario)
return res.status(400).send({error:1,param:'idUsuario'});cnf.ejecutarResSQL(SQL_VEHICULOS,[idUsuario],function(vehiculos){if(vehiculos.length<=0)
return res.status(200).send({en:-1,m:'El usuario no tiene Vehiculos Asignados'});return res.status(200).send({en:1,v:vehiculos});},res);}
const SQL_VEHICULOS="SELECT t.idTarjeta, t.tarjeta, v.idVehiculo,v.placa,vt.vehiculoTipo FROM kparkingutpl.tarjeta t "+" inner join tarjetaAsignacion ta on ta.idTarjeta=t.idTarjeta and ta.habilitado=1"+" left join tarjetaVehiculo tv on tv.idTarjeta=t.idTarjeta and tv.habilitado=1"+" inner join vehiculo v on v.idVehiculo = tv.idVehiculo"+" inner join vehiculoTipo vt on vt.idVehiculoTipo=v.idVehiculoTipo"+" where idAsignado=?"
router.post('/tarjeta/',function(req,res){var version=req.headers.version;if(version==='1.0.0')
return consultaTarjeta(req,res);});function consultaTarjeta(req,res){var idUsuario=req.body.idUsuario;if(!idUsuario)
return res.status(400).send({error:1,param:'idUsuario'});cnf.ejecutarResSQL(SQL_TARJETAS,[idUsuario],function(tarjeta){if(tarjeta.length<=0)
return res.status(200).send({en:-1,m:'El usuario no tiene Tarjetas Asignadas'});return res.status(200).send({en:1,t:tarjeta});},res);}
const SQL_TARJETAS="SELECT t.idTarjeta,t.tarjeta,tp.tarjetaTipo FROM kparkingutpl.tarjetaAsignacion ta"+" inner join tarjeta t on t.idTarjeta=ta.idTarjeta"+" inner join tarjetaTipo tp on tp.idTarjetaTipo=t.idTarjetaTipo"+" where idAsignado=? and habilitado=1";router.post('/permiso/',function(req,res){var version=req.headers.version;if(version==='1.0.0')
return consultaPermisos(req,res);return res.status(320).send({m:MENSAJE_DEPRECATE});});function consultaPermisos(req,res){var idTarjeta=req.body.idTarjeta;if(!idTarjeta)
return res.status(400).send({error:1,param:'idTarjeta'});cnf.ejecutarResSQL(SQL_LUGARES_PERMISO,[idTarjeta],function(permiso){if(permiso.length<=0)
return res.status(200).send({en:-1,m:'El usuario no tiene Tarjetas Asignadas'});var tamanio=permiso.length-1;var contador=0;permiso.forEach(function(lugar,index){cnf.ejecutarResSQL(SQL_HORARIO,[lugar.idHorario],function(horario){lugar.h=horario;if(contador===tamanio)
return res.status(200).send({en:1,l:permiso});contador++;},res);});},res);}
const SQL_HORARIO="SELECT if(dia=1,'Domingo',if(dia=2,'Lunes',if(dia=3,'Martes',if(dia=4,'Miercoles',if(dia=5,'Jueves',if(dia=6,'Viernes',if(dia=7,'Sábado',''))))))) as dia,desde,hasta FROM kparkingutpl.horarioDetalle where idHorario=? and habilitado=1 ;";const SQL_LUGARES_PERMISO="SELECT l.lugar,tlh.idHorario,tlh.fechaInicio,tlh.fechaFin FROM kparkingutpl.tarjetaLugarHorario tlh"+" inner join lugar l on l.idLugar=tlh.idLugar"+" where idTarjeta=?";module.exports=router;