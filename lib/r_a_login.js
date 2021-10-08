
var cnf=require('./config.js');var router=require('express').Router();router.post('/autenticar/',function(req,res){var version=req.headers.version;if(version==='1.0.0')
return autenticar(req,res);return res.status(320).send({m:MENSAJE_DEPRECATE});});function autenticar(req,res){var usuario=req.body.usuario;var clave=req.body.clave;if(!usuario)
return res.status(400).send({error:1,param:'usuario'});if(!clave)
return res.status(400).send({error:1,param:'clave'});cnf.ejecutarResSQL(SQL_AUTENTICAR,[usuario,clave],function(usuarios){if(usuarios.length<=0)
return res.status(200).send({en:-1,m:'Usuario y/o contraseñas incorrectas'});return res.status(200).send({en:1,usuario:usuarios[0]});},res);}
const SQL_AUTENTICAR="SELECT idAdministrador,nombres,apellidos,imagen FROM "+_BD_+".administrador where usuario=? and contrasenia=MD5(CONCAT(? , 'd2be0658f23e36fdf58c408302faabbb')) and bloqueado=0;"
module.exports=router;