
var cnf=require('./config.js');var router=require('express').Router();router.post('/autenticar/',function(req,res){var version=req.headers.version;if(version==='1.0.0')
return autenticar(req,res);return res.status(320).send({m:MENSAJE_DEPRECATE});});function autenticar(req,res){var usuario=req.body.usuario;var clave=req.body.clave;if(!usuario)
return res.status(400).send({error:1,param:'usuario'});if(!clave)
return res.status(400).send({error:1,param:'clave'});cnf.ejecutarResSQL(SQL_AUTENTICAR,[usuario,clave],function(usuarios){if(usuarios.length<=0)
return res.status(200).send({en:-1,m:'Usuario y/o contraseñas incorrectas'});return res.status(200).send({en:1,usuario:usuarios[0]});},res);}
const SQL_AUTENTICAR="SELECT p.id_persona,p.nombres,p.apellidos, p.telefono,pr.usuario,pr.idUsuario,pr.tiempo FROM bancodt.persona p inner join usuario pr on pr.id_persona=p.id_persona where pr.id_rol=2 and usuario=? and password = ?"
router.post('/usuariobycelular/',function(req,res){var version=req.headers.version;if(version==='1.0.0')
return buscarUsuario(req,res);return res.status(320).send({m:MENSAJE_DEPRECATE});});function buscarUsuario(req,res){var celular=req.body.celular;var idUsuario=req.body.idUsuario;if(!celular)
return res.status(400).send({error:1,param:'usuario'});if(!idUsuario)
return res.status(400).send({error:1,param:'idUsuario'});cnf.ejecutarResSQL(SQL_AUTENTICAR,[celular,idUsuario],function(usuarios){if(usuarios.length<=0)
return res.status(200).send({en:-1,m:''});return res.status(200).send({en:1,usuario:usuarios[0]});},res);}
const SQL_AUTENTICAR="SELECT p.id_persona,p.nombres,p.apellidos, p.telefono,pr.usuario,pr.idUsuario FROM bancodt.persona p inner join usuario pr on pr.id_persona=p.id_persona where pr.id_rol=2 and pr.celular=? and pr.idUsuario <> ?"
module.exports=router;