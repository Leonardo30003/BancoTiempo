
var cnf=require('./config.js');var router=require('express').Router();router.post('/listar/',function(req,res){var version=req.headers.version;if(version==='1.0.0')
return listarCategorias(req,res);return res.status(320).send({m:MENSAJE_DEPRECATE});});function listarCategorias(req,res){cnf.ejecutarResSQL(SQL_CATEGORIAS,[],function(lugar){if(lugar.length<=0)
return res.status(200).send({en:-1,m:'No Existen Categorias.'});return res.status(200).send({en:1,t:lugar.length,ls:lugar});},res);}
const SQL_CATEGORIAS="SELECT idCategoria,categoria,logo FROM bancodt.categoria where habilitado=1";module.exports=router;