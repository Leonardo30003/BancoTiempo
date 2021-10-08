var cnf = require('./config.js');
var c_despacho = require('./c_despacho.js');
var a_encomienda = require('./a_encomienda.js');
var firebase = require('./firebase.js');
var mensaje_wp = require('./mensajes_wp');

module.exports = {
    iniciarThreadServer: iniciarThreadServer
};

function iniciarThreadServer(){
//    console.log("Inicio de hilos");
    activarMonitoreador();
    monitoreadorHorarios();
}

const INDETIFICATIVO_PEDIDO_SOLICTANDO_CLIPPER = 8;
const INDETIFICATIVO_PEDIDO_ATENDIENDO_CLIPPER = 3;
const INTERVAL_SEGUNDOS_EXPIRADO = 60;//190
const ESTADO_SOLICITUD_KTAXI = 0;
const TIEMPO_HILO_MONITOREADOR = 10;
function activarMonitoreador() {
    setTimeout(function () {
        cnf.ejecutarResSQL(SQL_PEDIDO_EXPIRADO, [INDETIFICATIVO_PEDIDO_SOLICTANDO_CLIPPER, INDETIFICATIVO_PEDIDO_ATENDIENDO_CLIPPER, INTERVAL_SEGUNDOS_EXPIRADO], function (pedidos) {
            if (pedidos.length > 0) {
                var contador = 0;
                var tamanio = pedidos.length - 1;
                pedidos.forEach(function (pedido, index) {
                    cnf.ejecutarResSQL(SQL_PEDIDO_SOLICTUD_EXPIRADO, [pedido.idPedido, ESTADO_SOLICITUD_KTAXI, INTERVAL_SEGUNDOS_EXPIRADO], function (pedidoSolic) {
                        if (pedidoSolic.length > 0) {
                            renotificarPedido(pedidoSolic[0], pedido);
                            mensaje_wp.notificarEstadoPedidoWP(pedido.idPedido, ESTADO_SOLICITAR_EXPIRO);
                        }
                        if (tamanio === contador)
                            return activarMonitoreador();
                        contador++;
                    });
                });
            } else
                return activarMonitoreador();
        })
    }, 1000 * TIEMPO_HILO_MONITOREADOR);
}

const SQL_PEDIDO_EXPIRADO = "SELECT p.idPedido, p.idSucursal, p.idTransportePedido, p.idFormaPago FROM clipp.pedido p INNER JOIN clipp.estadoPedido ep ON p.estado = ep.estado WHERE ep.idTipoEstadoPedido = p.idTipoEstadoPedido AND  (ep.identificativo = ? OR ep.identificativo = ?) AND DATE_ADD(p.fecha_registro,INTERVAL ? SECOND)<=now();";
const SQL_PEDIDO_SOLICTUD_EXPIRADO = "SELECT idSolicitud, idVehiculo, IF(username IS NOT NULL,username,'') AS username, idUsuario, estadoKtaxi  FROM clipp.pedido_solicitud WHERE idPedido = ? AND estadoKtaxi = ? AND username IS NULL AND DATE_ADD(fecha_registro,INTERVAL ? SECOND)<=now() ORDER BY fecha_registro DESC LIMIT 1;";

function renotificarPedido(pedidoSolic, pedido){
    c_despacho.cancelarSolicitudTaxi(pedidoSolic.idSolicitud, pedidoSolic.idVehiculo, pedidoSolic.username)
    let data = {
        "idPedido": pedido.idPedido,
        "idUsuario": pedidoSolic.idUsuario,
        "idTransportePedido": pedido.idTransportePedido,
        "idFormaPago": pedido.idFormaPago,
        "idPlataforma": 6,
        "vs": '1.0.0',
        "so": '1.0.0',
        "marca": 'Server',
        "modelo": 'Clipp',
        "imei": 'ServerClipp',
    }
    c_despacho.solicitarCarreraNueva(pedido.idSucursal, data);
}

const TIME_HILO_HORARIO=60; 
const INTERVALO_HORARIO_PRIMERO=15;
const INTERVALO_HORARIO_SEGUNDO=5;
function monitoreadorHorarios(){
//    console.log("Corriendo hilo horarios");
    setTimeout(function () {
        cnf.ejecutarResSQL(SQL_SELECT_HORARIOS, [INTERVALO_HORARIO_PRIMERO, INTERVALO_HORARIO_SEGUNDO], function (horarios) {
            if(horarios.length>0){
                evaluarHorarios(horarios);
            }
            return monitoreadorHorarios();
        })
        
    }, 1000 * TIME_HILO_HORARIO);
}
var SQL_SELECT_HORARIOS ="SELECT s.sucursal, sh.idSucursalHorario, sh.idSucursal, sh.activo, sh.desde, sh.hasta,  time_format(date_add(CONVERT_TZ(NOW(),  'UTC', c.zonaHoraria),INTERVAL ? MINUTE),  '%H:%i:00') AS horaServ1, time_format(date_add(CONVERT_TZ(NOW(),  'UTC', c.zonaHoraria),INTERVAL ? MINUTE), '%H:%i:00') AS horaServ2, time_format(CONVERT_TZ(NOW(),  'UTC', c.zonaHoraria),  '%H:%i:00') AS horaServ3 FROM clipp.sucursal_horario sh INNER JOIN clipp.sucursal s ON s.idSucursal=sh.idSucursal INNER JOIN clipp.ciudad c ON c.idCiudad=s.idCiudad WHERE sh.numeroDia=(DAYOFWEEK(CONVERT_TZ(NOW(),  'UTC', c.zonaHoraria))-1) HAVING horaServ1=sh.desde OR horaServ2=sh.desde OR horaServ3=sh.desde OR horaServ1=sh.hasta OR horaServ2=sh.hasta OR horaServ3=sh.hasta;";

var ACCION_PUSH_HORARIO_ABRIR=2;
var ACCION_PUSH_HORARIO_CERRAR=3;
var HORARIO_ABIERTO=1;
function evaluarHorarios(horarios){
    var contador = 0;
    var tamanio = horarios.length - 1;
    horarios.forEach(function (horario, index) {
        var accion=1;
        var tiempo=0;
        var titulo="Horarios "+horario.sucursal;
        var cuerpo="";
        
        if(horario.activo==HORARIO_ABIERTO){
            if(horario.desde==horario.horaServ1){
                tiempo=INTERVALO_HORARIO_PRIMERO;
                cuerpo="En "+INTERVALO_HORARIO_PRIMERO+" minutos su tienda abrirá si necesitas más tiempo acceda a horarios.";
            }else if(horario.desde==horario.horaServ2){
                tiempo=INTERVALO_HORARIO_SEGUNDO;
                cuerpo="En "+INTERVALO_HORARIO_SEGUNDO+" minutos su tienda abrirá si necesitas más tiempo acceda a horarios.";
            }else if(horario.desde==horario.horaServ3){
                accion=ACCION_PUSH_HORARIO_ABRIR;
                cuerpo="Tu tienda está abierto, que tengas un excelente día";
            }

            if(horario.hasta==horario.horaServ1){
                tiempo=INTERVALO_HORARIO_PRIMERO;
                cuerpo="En "+INTERVALO_HORARIO_PRIMERO+" minutos su tienda cerrará, Para aumentar tiempo acceda a horarios.";
            }else if(horario.hasta==horario.horaServ2){
                tiempo=INTERVALO_HORARIO_SEGUNDO;
                cuerpo="En "+INTERVALO_HORARIO_SEGUNDO+" minutos su tienda cerrará, Para aumentar tiempo acceda a horarios.";
            }else if(horario.hasta==horario.horaServ3){
                accion=ACCION_PUSH_HORARIO_CERRAR;
                cuerpo="Su tienda se cerró, vas a seguir trabajando acceda a horarios";
            }
        }else if(horario.desde==horario.horaServ3 || horario.desde==horario.horaServ1 || horario.desde==horario.horaServ2){
            cuerpo="Si vas a abrir tu tienda no olvides ir a horarios y abrir el local";
        }else{
            return console.log("este local permanece cerrado");
        }
        horario.accion=accion;
        horario.tiempo=tiempo;
        firebase.pushDataAdministradoresSucursal(horario.idSucursal, titulo, cuerpo, PUSH_TIPO_HORARIO, horario);
//        console.log("Enviar informacion: "+cuerpo+", data: ",horario);
    });
}
var ESTADO_SOLICITAR_EXPIRO="SOLICTUD EXPIRO";
