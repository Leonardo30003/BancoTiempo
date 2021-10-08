
var cnf=require('./config.js');var router=require('express').Router();router.post('/detalle/',function(req,res){var version=req.headers.version;if(version==='1.0.0')
return listarLugares(req,res);return res.status(320).send({m:MENSAJE_DEPRECATE});});function listarLugares(req,res){var idCompania=req.body.idCompania;var idLugar=req.body.idLugar;if(!idCompania)
return res.status(400).send({en:-1,param:'idCompania'});if(!idLugar)
return res.status(400).send({en:-1,param:'idLugar'});cnf.ejecutarResSQL(SQL_EXISTE_COMPANIA,[idCompania],function(compania){if(compania.length<=0)
return res.status(200).send({en:-1,m:'Compania no Registrada.'});cnf.ejecutarResSQL(SQL_LUGAR,[idLugar],function(lugar){if(lugar.length<=0)
return res.status(200).send({en:-1,m:'Lugar no encontrado.'});cnf.ejecutarResSQL(SQL_EQUIPOS_ANTENAS,[idLugar],function(equiposAntenas){var tamanio=equiposAntenas.length-1;var contador=0;equiposAntenas.forEach(function(antena,index){var comando=[];comando.push({titulo:"Abrir",comando:"$$ABRIR"+antena.acronimo+"##"})
comando.push({titulo:"Cerrar",comando:"$$CERRAR"+antena.acronimo+"##"})
antena.comandos=comando;if(contador===tamanio)
cnf.ejecutarResSQL(SQL_EQUIPOS_LETREROS,[idLugar],function(equiposLetreros){var tamanio=equiposLetreros.length-1;var contador=0;equiposLetreros.forEach(function(antena,index){var comando=[];comando.push({titulo:"Tag no registrado",comando:"$$"+antena.acronimo+",MSG,1##"})
comando.push({titulo:"Vehiculo no Autorizado",comando:"$$"+antena.acronimo+",MSG,2##"})
comando.push({titulo:"Fuera de Horario",comando:"$$"+antena.acronimo+",MSG,3##"})
comando.push({titulo:"Personalizado",comando:"$$"+antena.acronimo+",MSG,T,Prueba##"})
comando.push({titulo:"Apagar",comando:"$$"+antena.acronimo+",MSG,OFF##"})
antena.comandos=comando;if(contador===tamanio)
return res.status(200).send({en:1,t:lugar[0]['lugar'],lAn:equiposAntenas,lLet:equiposLetreros});contador++;});},res);contador++;});},res);},res);},res);}
const SQL_EXISTE_COMPANIA="SELECT idCompania FROM kparkingutpl.compania where idCompania=? and eliminado=0;";const SQL_LUGAR="SELECT idLugar,lugar,latitud,longitud FROM kparkingutpl.lugar where idLugar=? and eliminado = 0;";const SQL_EQUIPOS_ANTENAS="SELECT idEquipo,equipo, et.equipoTipo,e.idEquipoTipo, acronimo,ip FROM kparkingutpl.equipo e inner join equipoTipo et on e.idEquipoTipo=et.idEquipoTipo where idLugar=? and eliminado = 0 AND e.idEquipoTipo=2;";const SQL_EQUIPOS_LETREROS="SELECT idEquipo,equipo, et.equipoTipo,e.idEquipoTipo, acronimo,ip FROM kparkingutpl.equipo e inner join equipoTipo et on e.idEquipoTipo=et.idEquipoTipo where idLugar=? and eliminado = 0 AND e.idEquipoTipo=3;";module.exports=router;