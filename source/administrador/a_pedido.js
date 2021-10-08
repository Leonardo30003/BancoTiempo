var cnf = require('./config.js');
var firebase = require('./firebase');
var c_estado_pedido = require('./c_estados_pedido.js');
var administrador = require('./administrador_functions');

function setEstadoSucursal(socket, data, ack) {
    var idAdministrador = data['idAdministrador']
    var idSucursal = data['idSucursal']
    var estado = data['estado']
    cnf.ejecutarResSQL(SQL_SET_ESTADO_SUCURSAL, [idAdministrador, idSucursal, estado], function (estado) {
        if (estado['insertId'] <= 0) {
            return ack({ en: -1, m: 'No se pudo registrar el estado, intenta nuevamente más tarde.' })
        } else {
            return ack({ en: 1, m: 'Estado registrado correctamente' })
        }
    })
}

var SQL_SET_ESTADO_SUCURSAL = 'INSERT INTO clipp.administrador_estados_sucursal (idAdministrador, idSucursal, estado, fecha_registro) VALUES (?,?,?, NOW());'

//const ID_APLICATIVO_CLIPP_STORE=6;
const ID_ESTADO_PEDIDO_INICIAL=1;
function notificarPedidoASucursal(idSucursal, idPedido, ack) {
    cnf.ejecutarResSQL(SQL_ASOCIAR_ADMINISTRADOR, [idSucursal, ID_APLICATIVO_CLIPP_STORE], function (administradores) {
        if (administradores.length > 0) {
            administradores.forEach(function (administrador) {
                asociarUsuarioAPedido(administrador['idAplicativo'], idPedido, administrador['idAdministrador'])
            })
            cnf.ejecutarResSQL(SQL_GET_INFO_PEDIDO, [idPedido], function (pedidoRegistrado) {
                if (pedidoRegistrado.length > 0) {
                    var pedido = pedidoRegistrado[0]
                    adicionalesProducto(idPedido, function(productos){
                        if (productos.length > 0) {
                            pedido.producto = productos;
                            cnf.ejecutarResSQL(SQL_EXISTE_HORARIO, [pedido.idCiudad, idSucursal], function (existe) {
                                if (existe.length > 0) {
                                    administradores.forEach(function (canal) {
                                        if (canal.socketId!=null) {//enviar notificacion 
                                            firebase.enviarPushToAdministrador(canal.idAdministrador, pedido.sucursal+' Nuevo pedido', 'orden #'+pedido.numeroOrden+' '+pedido.nombres+' ha realizado una nueva compra en tu local', PUSH_TIPO_NUEVO_PEDIDO, pedido);
                                            EMIT_REDIS.to(canal.socketId).emit('nuevo_pedido', pedido);
                                        }else{
                                            firebase.enviarPushToAdministrador(canal.idAdministrador, pedido.sucursal+' Nuevo pedido', 'orden #'+pedido.numeroOrden+' '+pedido.nombres+' ha realizado una nueva compra en tu local', PUSH_TIPO_NUEVO_PEDIDO, pedido);
                                        }

                                    });
                                } else {
                                    pedidoNoAtendido(pedido)
                                    //return ack( {en: -1, m: 'La tienda no se encuentra abierta en este momento.'})
                                }
                            })
                        } else {
                            pedidoNoAtendido(pedido)
                            //return ack( {en: -1, m: 'Ocurrio un problema al registrar los productos, intenta nuevamente más tarde'})
                        }
                    });
                } else {
                    return administrador.imprimirLogs('notificarPedidoASucursal: idPedido: ' + idPedido + ' Error: No se pudo obtener el pedido');
                }
            })
        } else {
            return administrador.imprimirLogs('notificarPedidoASucursal: idPedido: ' + idPedido + ' Error: No se encontraron administradores de la sucursal ' + 'idSucursal: ' + idSucursal);
        }
    })
}


var SQL_ASOCIAR_ADMINISTRADOR = 'SELECT aa.idAplicativo, asu.idAdministrador,  ac.socketId FROM clipp.administrador_sucursal asu INNER JOIN clipp.administrador_aplicativo aa ON asu.idAdministrador = aa.idAdministrador LEFT JOIN clipp.administrador_sucursalActiva asa ON asa.idAdministrador=asu.idAdministrador AND asa.idSucursal= asu.idSucursal LEFT JOIN clipp.administradorConectado ac ON ac.idAdministrador=asu.idAdministrador  WHERE asu.idSucursal = ? AND aa.idAplicativo=?;'
var SQL_EXISTE_HORARIO = "SELECT h.idHorario, sh.desde, sh.hasta FROM clipp.sucursal_horario sh INNER JOIN clipp.ciudad c ON c.idCiudad = ? INNER JOIN clipp.horario h ON sh.idHorario = h.idHorario WHERE h.numeroDia=(DAYOFWEEK(CONVERT_TZ(NOW(),  'UTC', c.zonaHoraria))-1) AND time(sh.desde)<=time(CONVERT_TZ(NOW(),  'UTC', c.zonaHoraria)) AND time(sh.hasta)>=time(CONVERT_TZ(NOW(),  'UTC', c.zonaHoraria)) AND sh.idSucursal = ? LIMIT 1;";
//var SQL_SUCURSAL_ESTADO_ACTUAL = 'SELECT aes.idAdministrador, aes.idSucursal, aes.estado, max(aes.fecha_registro) as fecha FROM clipp.administrador_estados_sucursal aes WHERE aes.idSucursal = ? AND aes.fecha_registro >= ?;'
//var SQL_GET_CANAL_ADMINISTRADOR = 'SELECT aco.socketId, aco.idApp, aco.idPlataforma, aco.idAdministrador FROM clipp.administrador_sucursal asu INNER JOIN clipp.administradorConectado aco ON asu.idAdministrador = aco.idAdministrador INNER JOIN (SELECT * FROM clipp.administrador_sucursalActiva asa WHERE asa.fecha_registro = (SELECT max(fecha_registro) from clipp.administrador_sucursalActiva WHERE idAdministrador = asa.idAdministrador) AND asa. idSucursal = ?) as asa ON asu.idAdministrador = asa.idAdministrador WHERE asu.idSucursal = ?;'
var SQL_GET_INFO_PEDIDO = 'SELECT p.idPedido, p.idTipoEstadoPedido, p.idSucursal, p.idDireccion, p.estado, p.fecha_registro, p.fechaReserva, p.costo, p.distancia, p.nota, p.costoEnvio, p.tiempo, p.numeroOrden, c.codigoPais, c.celular, c.nombres, c.apellidos, d.direccion, d.referencia, d.latitud, d.longitud, ep.titulo, ep.tituloStore, ep.descripcionCorta, ep.descripcionCortaStore, ep.descripcionLarga, ep.sigEstado, ep.identificativo, ep.color, fp.idFormaPago, fp.forma, s.sucursal, s.idCiudad FROM clipp.pedido p INNER JOIN clipp.cliente c ON p.idCliente = c.idCliente INNER JOIN clipp.direccion d ON p.idDireccion = d.idDireccion INNER JOIN clipp.estadoPedido ep ON p.estado = ep.estado INNER JOIN clipp.sucursal s On s.idSucursal=p.idSucursal INNER JOIN clipp.formaPago fp ON p.idFormaPago = fp.idFormaPago WHERE p.idPedido = ? and p.idTipoEstadoPedido = ep.idTipoEstadoPedido;'
//var SQL_FECHA_ACTUAL = "SELECT CONVERT_TZ(NOW(), '+00:00', c.zonaHoraria) as fechaActual, (DAYOFWEEK(CONVERT_TZ(NOW(),  '+00:00', c.zonaHoraria))-1) as day, DATE(CONVERT_TZ(NOW(), '+00:00', c.zonaHoraria)) as fecha FROM clipp.ciudad c INNER JOIN clipp.direccion d ON c.idCiudad = d.idCiudad WHERE d.idDireccion = ? LIMIT 1;"

function asociarUsuarioAPedido(idAplicativo, idPedido, idUsuario) {
    cnf.ejecutarResSQL(SQL_VERIFICAR_ASOCIADO, [idPedido, idAplicativo, idUsuario], function (asociado) {
        if (asociado.length <= 0) {
            cnf.ejecutarResSQL(SQL_REGISTRAR_ASOCIADO, [idAplicativo, idPedido, idUsuario], function (registro) {
                if (registro['insertId'] <= 0)
                    return { en: -1, m: "No se pudo registrar al usuario" }
            });
        }
    });
}

var SQL_VERIFICAR_ASOCIADO = 'SELECT * FROM clipp.conexiones_pedido WHERE idPedido = ? AND idApp = ? AND idUsuario = ?;';
var SQL_REGISTRAR_ASOCIADO = 'INSERT INTO clipp.conexiones_pedido (idApp, idPedido, idUsuario, fecha_registro) VALUES (?, ?, ?, NOW());';


function pedidoNoAtendido(pedido) {
//    console.log("PEDIDO NO ATENDIDO:"+pedido.idPedido);
    cnf.ejecutarResSQL(SQL_OBTENER_ESTADO_NO_ATENDIDO, [pedido['idTipoEstadoPedido']], function (estados) {
        if (estados.length > 0) {
            let siguiente = estados[0]
            cnf.ejecutarResSQL(SQL_REGISTRO_ESTADO_PEDIDO, [pedido['idPedido'], siguiente['estado'], data['idAplicativo'], data['idPlataforma'], data['idUsuario']], function (nuevoEstado) {
                if (nuevoEstado['affectedRows'] > 0) {
                    cnf.ejecutarResSQL(SQL_UPDATE_PEDIDO, [siguiente['estado'], pedido['idPedido']], function (pedidoActualizado) {
                        if (pedidoActualizado['affectedRows'] > 0) {
                            c_estado_pedido.emitEstadoPedido(siguiente['estado'], pedido['idPedido'], pedido['idTipoEstadoPedido'], pedido['idSucursal'])
                        } else {
                            return administrador.imprimirLogs('pedidoNoAtendido: idPedido: ' + pedido['idPedido'] + ' Error: No se pudo actualizar el estado del pedido a NO atendido');
                        }
                    });
                } else {
                    return administrador.imprimirLogs('pedidoNoAtendido: idPedido: ' + pedido['idPedido'] + ' Error: No se pudo registrar el estado del pedido a NO atendido');
                }
            });
        } else {
            return administrador.imprimirLogs('pedidoNoAtendido: idPedido: ' + pedido['idPedido'] + ' Error: No se pudo registrar el estado del pedido a NO atendido');
        }
    });
}

var SQL_OBTENER_ESTADO_NO_ATENDIDO = 'SELECT ep.estado, ep.titulo, ep.tituloStore, ep.descripcionCorta, ep.descripcionCortaStore, ep.descripcionLarga, ep.idTipoEstadoPedido, ep.tituloSigEstado, ep.tituloSigEstadoStore, ep.sigEstado, ep.icon, ep.muestraSigEstado, ep.isCancelable, ep.identificativo, ep.muestraEstado, ep.sigCancelable, ep.color FROM clipp.estadoPedido ep  WHERE ep.identificativo  = 7 AND ep.idTipoEstadoPedido = ?;'
var SQL_REGISTRO_ESTADO_PEDIDO = 'INSERT INTO clipp.pedido_estadoPedido (idPedido, estado, idAplicativo, idPlataforma, idUsuario, fecha_registro) VALUES (?, ?, ?, ?, ?, NOW());'
var SQL_UPDATE_PEDIDO = "UPDATE clipp.pedido SET estado = ? WHERE idPedido = ?;"


function adicionalesProducto(idPedido, claback){
    cnf.ejecutarResSQL(GET_PRODUCTOS_PEDIDO, [idPedido], function (productos) {
        var result = new Array();
        let tamanio = productos.length - 1;
        var contador = 0;
        productos.forEach(function (producto, index) {
            cnf.ejecutarResSQL(SQL_SELECT_ADICIONAL_PRODUCTO, [producto.idProducto, idPedido], function (adicional) {
                producto.adicional=adicional;
                result[index]=producto;
                if (tamanio === contador) {
                    return claback(result);
                }
                contador++;    
            }); 
        });
    });
    
}

var GET_PRODUCTOS_PEDIDO = "SELECT pp.idProducto, p.idProductoEstado, p.fecha, pp.notaProducto as nota, pp.cantidad, pp.costo, p.precio, p.iva, p.imgGrande, p.imgPequenia, p.descripcionCorta, p.descripccionLarga, p.terminos, p.link, p.titulo, p.subTitulo, p.restricciones, p.minimo, p.maximo, p.stock, p.fecha_inicio_venta, p.fecha_maxima_venta, p.isPromocion = 1 as isPromocion FROM clipp.pedido_producto pp  INNER JOIN clipp.producto p ON pp.idProducto = p.idProducto  WHERE pp.idPedido = ?;"
var SQL_SELECT_ADICIONAL_PRODUCTO="SELECT ppap.cantidad, ppap.costo, ppap.tipo, IF(ppap.tipo=1, p.titulo, ap.adicional) AS titulo FROM clipp.pedidoProducto_adicionalProducto ppap LEFT JOIN clipp.producto p ON p.idProducto=ppap.idAdicionalProducto LEFT JOIN clipp.adicionalProducto ap ON ap.idAdicionalProducto=ppap.idAdicionalProducto WHERE ppap.idProducto=? AND ppap.idPedido=?;";


module.exports = {
    setEstadoSucursal: setEstadoSucursal,
    notificarPedidoASucursal: notificarPedidoASucursal,
    asociarUsuarioAPedido: asociarUsuarioAPedido
};