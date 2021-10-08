/* global _BD_ */
var cnf = require('./config.js');
var emit = require('./emit');
var fs = require('fs');
var firebase = require('./firebase');
//var c_despacho = require('./c_despacho');

module.exports = {
    administradorEnviaChat: administradorEnviaChat,
    administradorEstadoChat: administradorEstadoChat,
    administradorEscribiendoChat: administradorEscribiendoChat,
    administradorEnviaAudio: administradorEnviaAudio,
    administradorEnviaimagen: administradorEnviaimagen,
    consultarMensajeEncomienda: consultarMensajeEncomienda,
    conductorEnviaChatEncomienda: conductorEnviaChatEncomienda,
    conductorEnviaAudio: conductorEnviaAudio
};

var APP_CLIPP_STORE = 6;
var MOSTRAR_MENSAJE_TODOS=1;

var SQL_REGISTRAR_MENSAJE_ADMINISTRADOR =
        "INSERT INTO " + _BDH_ + ".chat (idPedido, idAdministradorEnvia, fecha, hora, mensaje, tipo, usuario, idAplicacion, idPlataforma, tipoPedido, mostrar ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";

var SQL_SELECT_CHAT="SELECT idChat, idPedido, idAdministradorEnvia AS idAdministrador, idClienteEnvia AS idCliente, usuario, fecha, hora, mensaje, tipo, quienEnvia, estado, extension, idAplicacion, idPlataforma, fecha_registro, tipoPedido, mostrar FROM clipphistorico.chat WHERE idChat=?;";
function administradorEnviaChat(socket, datosMensaje, confirmacion) {
    cnf.ejecutarConfirmacionSQL(SQL_REGISTRAR_MENSAJE_ADMINISTRADOR, [datosMensaje.idPedido, datosMensaje.idAdministrador, datosMensaje.fecha, datosMensaje.hora, datosMensaje.mensaje, datosMensaje.tipo, datosMensaje.usuario, datosMensaje.idAplicacion, datosMensaje.idPlataforma, datosMensaje.tipoPedido, datosMensaje.mostrar], function (respuesta) {
        if (respuesta['insertId'] <= 0)
            return confirmacion({en: -1});
        
        cnf.ejecutarSQLCallback(SQL_SELECT_CHAT, [respuesta['insertId']], function (chat) {
            if (chat.length > 0){
                cnf.ejecutarSQLCallback(SQL_SELECT_ENCOMIENDA, [datosMensaje.idPedido], function (encomienda) {
                    if (encomienda.length > 0){
//                        console.log(datosMensaje);
                        emitToChatConductor('cliente_envia_mensaje', datosMensaje.idPedido, chat[0]);
                        emit.emiToChatAdministradores('recibir_chat_encomienda_administrador', encomienda[0].idSucursal, socket.id, chat[0]);
                        pushPedidosAdministradores(encomienda[0].idSucursal,  chat[0]);
                    }
                });
            }
        });
        return confirmacion({en: 1, idChat: respuesta['insertId']});
    }, confirmacion);
}

var SQL_REGISTRAR_ESTADO_MENSAJE_ADMINISTRADOR =
        "INSERT INTO clipphistorico.chatRecibido(idChat, idAdministrador, idAplicacion, idPlataforma, fecha, hora, usuario, estado, fecha_actualizacion) VALUES(?, ?, ?, ?, ?, ?, ?, ?, now());";
var SQL_SELECT_ESTADO_MENSAJE_ADMINISTRADOR="SELECT idChatRecibido FROM clipphistorico.chatRecibido WHERE idChat = ? AND idAdministrador = ?;";
var SQL_UPDATE_ESTADO_MENSAJE_ADMINISTRADOR="UPDATE clipphistorico.chatRecibido SET fecha = ?, hora = ?, estado = ?, fecha_actualizacion = now() WHERE (idChatRecibido = ?);";

function administradorEstadoChat(socket, datosMensaje, confirmacion) {
    cnf.ejecutarConfirmacionSQL(SQL_SELECT_ESTADO_MENSAJE_ADMINISTRADOR, [datosMensaje.idChat, datosMensaje.idAdministrador], function (chatEstado) {
        if(chatEstado.length > 0) 
            cnf.ejecutarConfirmacionSQL(SQL_UPDATE_ESTADO_MENSAJE_ADMINISTRADOR, [datosMensaje.fecha, datosMensaje.hora, datosMensaje.estado, chatEstado[0].idChatRecibido], function (respuesta) {
                if (respuesta['affectedRows'] <= 0)
                    return confirmacion({en: -1, m:"Intente masa tarde por favor."});
                datosMensaje.idChatEstado=chatEstado[0].idChatRecibido;
                cnf.ejecutarSQLCallback(SQL_SELECT_ENCOMIENDA, [datosMensaje.idPedido], function (encomienda) {
                    if (encomienda.length > 0){
                        emit.emiToChatAdministradores('estado_chat_encomienda_administrador', encomienda[0].idSucursal, socket.id, datosMensaje);
                    }
                });
                return confirmacion({en: 1, m: "Registrado correctamente."});
            }, confirmacion);
        else
            cnf.ejecutarConfirmacionSQL(SQL_REGISTRAR_ESTADO_MENSAJE_ADMINISTRADOR, [datosMensaje.idChat, datosMensaje.idAdministrador, datosMensaje.idAplicacion, datosMensaje.idPlataforma, datosMensaje.fecha, datosMensaje.hora, datosMensaje.usuario, datosMensaje.estado], function (respuesta) {
                if (respuesta['insertId'] <= 0)
                    return confirmacion({en: -1, m:"Intente masa tarde por favor."});
                
                datosMensaje.idChatEstado=respuesta['insertId'];
                cnf.ejecutarSQLCallback(SQL_SELECT_ENCOMIENDA, [datosMensaje.idPedido], function (encomienda) {
                    if (encomienda.length > 0){
                        emit.emiToChatAdministradores('estado_chat_encomienda_administrador', encomienda[0].idSucursal, socket.id, datosMensaje);
                    }
                });
                return confirmacion({en: 1, m: "Registrado correctamente."});
            }, confirmacion);
        
    }, confirmacion);
}

function administradorEscribiendoChat(socket, datosMensaje, confirmacion) {
    cnf.ejecutarSQLCallback(SQL_SELECT_ENCOMIENDA, [datosMensaje.idPedido], function (encomienda) {
        if (encomienda.length > 0){
            emit.emiToChatAdministradores('escribiendo_chat_encomienda_administrador', encomienda[0].idSucursal, socket.id, datosMensaje);
        }
    });
    return confirmacion({en: 1, m: "Registrado correctamente."});
}

var SQL_REGISTRAR_MENSAJE_ARCHIVO_ADMINISTRADOR =
        "INSERT INTO " + _BDH_ + ".chat (idPedido, idAdministradorEnvia, fecha, hora, mensaje, tipo, usuario, extension, idAplicacion, idPlataforma) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";

function administradorEnviaAudio(socket, datosMensaje, confirmacion) {
    cnf.ejecutarConfirmacionSQL(SQL_REGISTRAR_MENSAJE_ARCHIVO_ADMINISTRADOR, [datosMensaje.idPedido, datosMensaje.idAdministrador, datosMensaje.fecha, datosMensaje.hora, "AUDIO", datosMensaje.tipo, datosMensaje.usuario, datosMensaje.archivo.extension, datosMensaje.idAplicacion, datosMensaje.idPlataforma], function (respuesta) {
        if (respuesta['insertId'] <= 0)
            return confirmacion({en: -1});
        
        datosMensaje.idChat=respuesta['insertId'];
        cnf.ejecutarSQLCallback(SQL_SELECT_ENCOMIENDA, [datosMensaje.idPedido], function (encomienda) {
            if (encomienda.length > 0){
                emit.emiToChatAdministradores('recibir_chat_encomienda_audio_administrador', encomienda[0].idSucursal, socket.id, datosMensaje);
                pushPedidosAdministradores(encomienda[0].idSucursal, datosMensaje);
            }
        });
        guardarAudio('./public/clipp/media/chat/audio/'+ datosMensaje.idChat+datosMensaje.archivo.extension, datosMensaje.archivo.audio);
        return confirmacion({en: 1, idChat: datosMensaje.idChat});
    }, confirmacion);
}

function administradorEnviaimagen(socket, datosMensaje, confirmacion) {//idPedido, idAdministradorEnvia, fecha, hora, mensaje, tipo, usuario, idAplicacion, idPlataforma
    cnf.ejecutarConfirmacionSQL(SQL_REGISTRAR_MENSAJE_ARCHIVO_ADMINISTRADOR, [datosMensaje.idPedido, datosMensaje.idAdministrador, datosMensaje.fecha, datosMensaje.hora, "IMAGEN", datosMensaje.tipo, datosMensaje.usuario, datosMensaje.archivo.extension, datosMensaje.idAplicacion, datosMensaje.idPlataforma], function (respuesta) {
        if (respuesta['insertId'] <= 0)
            return confirmacion({en: -1});
        
        datosMensaje.idChat=respuesta['insertId'];
        cnf.ejecutarSQLCallback(SQL_SELECT_ENCOMIENDA, [datosMensaje.idPedido], function (encomienda) {
            if (encomienda.length > 0){
                emit.emiToChatAdministradores('recibir_chat_encomienda_imagen_administrador', encomienda[0].idSucursal, socket.id, datosMensaje);
                pushPedidosAdministradores(encomienda[0].idSucursal, datosMensaje);
            }
        });
        guardarImagenBynary('./public/clipp/media/chat/imagen/'+ datosMensaje.idChat+datosMensaje.archivo.extension, datosMensaje.archivo.imagen);
        return confirmacion({en: 1, idChat: datosMensaje.idChat});
    }, confirmacion);
}

var SQL_SELECT_ENCOMIENDA="SELECT e.idSucursal FROM clipp.encomienda e WHERE e.idEncomienda = ?;";

////////////////////////////////////////////CONDUCTOR////////////////////////////////////////////////////
var SQL_REGISTRAR_MENSAJE_CONDUCTOR =
        "INSERT INTO " + _BDH_ + ".chat (idPedido, fecha, hora, mensaje, tipo, usuario, idAplicacion, idPlataforma, tipoPedido, mostrar) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";

var chatPredeterminadoConductorEncomi=["Esperamos que disfrutes de nuestro servicio."];
function conductorEnviaChatEncomienda(datosMensaje) {
    if(chatPredeterminadoConductorEncomi.find(element => element === datosMensaje.mensaje)){
        return console.log("Mensaje de ktaxi repetido");
    }else{
        cnf.ejecutarResSQL(SQL_REGISTRAR_MENSAJE_CONDUCTOR, [datosMensaje.idPedido, datosMensaje.fecha, datosMensaje.hora, datosMensaje.mensaje, datosMensaje.tipo, datosMensaje.usuario, datosMensaje.idAplicacion, datosMensaje.idPlataforma, datosMensaje.tipoPedido, datosMensaje.mostrar], function (respuesta) {
    //        if (respuesta['insertId'] <= 0)
                //return confirmacion({en: -1});

            cnf.ejecutarSQLCallback(SQL_SELECT_CHAT, [respuesta['insertId']], function (chat) {
                if (chat.length > 0){
                    cnf.ejecutarSQLCallback(SQL_SELECT_ENCOMIENDA, [datosMensaje.idPedido], function (encomienda) {
                        if (encomienda.length > 0){
//                            console.log("CHAT_KTAXI_2 "+encomienda[0].idSucursal);
                            emit.emiToChatAdministradores('recibir_chat_encomienda_administrador', encomienda[0].idSucursal, "", chat[0]);
                            pushPedidosAdministradores(encomienda[0].idSucursal, chat[0]);
                        }
                    });
                }
            });
//            console.log("CHAT_KTAXI_1 ");


    //        return confirmacion({en: 1, idChat: respuesta['insertId']});
        });
    }
}

//var SQL_REGISTRAR_ESTADO_MENSAJE_CONDUCTOR =
//        "INSERT INTO clipphistorico.chatRecibido(idChat, idAplicacion, idPlataforma, fecha, hora, usuario, estado, fecha_actualizacion) VALUES(?, ?, ?, ?, ?, ?, ?, now());";
//var SQL_SELECT_ESTADO_MENSAJE_CONDUCTOR="SELECT idChatRecibido FROM clipphistorico.chatRecibido WHERE idChat = ? AND usuario = ? AND idAplicacion = ?;";
//var SQL_UPDATE_ESTADO_MENSAJE_CONDUCTOR="UPDATE clipphistorico.chatRecibido SET fecha = ?, hora = ?, estado = ?, fecha_actualizacion = now() WHERE (idChatRecibido = ?);";

//function conductorEstadoChat(datosMensaje, confirmacion) {
//    cnf.ejecutarConfirmacionSQL(SQL_SELECT_ESTADO_MENSAJE_CONDUCTOR, [datosMensaje.idChat, datosMensaje.usuario, datosMensaje.idAplicacion], function (chatEstado) {
//        if(chatEstado.length > 0) 
//            cnf.ejecutarConfirmacionSQL(SQL_UPDATE_ESTADO_MENSAJE_CONDUCTOR, [datosMensaje.fecha, datosMensaje.hora, datosMensaje.estado, chatEstado[0].idChatRecibido], function (respuesta) {
//                if (respuesta['affectedRows'] <= 0)
//                    return confirmacion({en: -1, m:"Intente masa tarde por favor."});
//
//                emit.emiToChatCliente('estado_chat_cliente', "", datosMensaje);
//                emit.emiToChatAdministradores('estado_chat_administrador', "", datosMensaje);
//                return confirmacion({en: 1, m: "Registrado correctamente."});
//            }, confirmacion);
//        else
//            cnf.ejecutarConfirmacionSQL(SQL_REGISTRAR_ESTADO_MENSAJE_CONDUCTOR, [datosMensaje.idChat, datosMensaje.idAplicacion, datosMensaje.idPlataforma, datosMensaje.fecha, datosMensaje.hora, datosMensaje.usuario, datosMensaje.estado], function (respuesta) {
//                if (respuesta['affectedRows'] <= 0)
//                    return confirmacion({en: -1, m:"Intente masa tarde por favor."});
//
//                emit.emiToChatCliente('estado_chat_cliente', "", datosMensaje);
//                emit.emiToChatAdministradores('estado_chat_administrador', "", datosMensaje);
//                return confirmacion({en: 1, m: "Registrado correctamente."});
//            }, confirmacion);
//        
//    }, confirmacion);
//}

//function conductorEscribiendoChat(socket, datosMensaje, confirmacion) {
//    emit.emiToChatCliente('escribiendo_chat_cliente', "", datosMensaje);
//    emit.emiToChatAdministradores('escribiendo_chat_administrador', "", datosMensaje);
//    return confirmacion({en: 1, m: "Registrado correctamente."});
//}

function conductorEnviaAudio(datosMensaje, audio) {
    cnf.ejecutarResSQL(SQL_REGISTRAR_MENSAJE_CONDUCTOR, [datosMensaje.idPedido, datosMensaje.fecha, datosMensaje.hora, datosMensaje.mensaje, datosMensaje.tipo, datosMensaje.usuario, datosMensaje.idAplicacion, datosMensaje.idPlataforma], function (respuesta) {
//        if (respuesta['insertId'] <= 0)
//            return confirmacion({en: -1});
//        
        datosMensaje.idChat=respuesta['insertId'];
//        emit.emiToChatCliente('recibir_chat_audio_cliente', "", datosMensaje);
//        emit.emiToChatAdministradores('recibir_chat_audio_administrador', "", datosMensaje);
//        pushPedidosAdministradores(datosMensaje.idPedido, datosMensaje);
//        pushPedidosCliente(datosMensaje.idPedido, datosMensaje);
        guardarAudio('./public/clipp/media/chat/audio/'+ datosMensaje.idChat+".zip", audio);
    });
}

//function conductorEnviaImagen(datosMensaje, confirmacion) {
//    cnf.ejecutarConfirmacionSQL(SQL_REGISTRAR_MENSAJE_ADMINISTRADOR, [datosMensaje.idPedido, datosMensaje.idAdministrador, datosMensaje.fecha, datosMensaje.hora, "IMAGEN", datosMensaje.tipo, datosMensaje.usuario], function (respuesta) {
//        if (respuesta['insertId'] <= 0)
//            return confirmacion({en: -1});
//        
//        datosMensaje.idChat=respuesta['insertId'];
//        emit.emiToArchivoChatCliente('recibir_chat_imagen_cliente', "", datosMensaje);
//        emit.emiToArchivoChatAdministradores('recibir_chat_imagen_administrador', "", datosMensaje);
//        pushPedidosCliente(datosMensaje.idPedido, datosMensaje);
//        pushPedidosAdministradores(datosMensaje.idPedido, datosMensaje);
//        guardarImagenBynary('./public/clipp/media/chat/imagen/'+ datosMensaje.idChat+datosMensaje.archivo.extension,datosMensaje.archivo.imagen);
//        return confirmacion({en: 1, idChat: datosMensaje.idChat});
//    }, confirmacion);
//}




var SQL_CONSULTAR_MENSAJES_PEDIDO="SELECT c.idChat, IF(c.usuario IS NOT NULL,c.usuario,'') AS usuario, c.mensaje, c.idPedido, c.idClienteEnvia AS idCliente, c.idAdministradorEnvia AS idAdministrador, c.fecha, c.hora, c.idAplicacion, c.idPlataforma, IF(c.extension IS NOT NULL,c.extension,'') AS extension, c.tipo, c.estado FROM clipphistorico.chat c WHERE c.idPedido = ? AND c.tipoPedido = ? ORDER BY c.fecha_registro ASC;";
var SQL_CONSLTAR_ESTADO_MENSAJE="SELECT cr.idChatRecibido AS idChatEstado, cr.idAdministrador, cr.idCliente,  cr.idAplicacion, cr.idPlataforma, cr.usuario, cr.fecha, cr.hora, cr.estado FROM clipphistorico.chatRecibido cr where cr.idChat = ?;";
var TIPO_PEDIDO_ENCOMIENDA=2;
function consultarMensajeEncomienda(socket, datosMensaje, confirmacion) {
    cnf.ejecutarConfirmacionSQL(SQL_CONSULTAR_MENSAJES_PEDIDO, [datosMensaje.idPedido, TIPO_PEDIDO_ENCOMIENDA], function (chatPedido) {
        if (chatPedido.length > 0){
            var result = new Array();
            var tamanio = chatPedido.length - 1;
            var contador=0;
            chatPedido.forEach(function (des, index) {
                cnf.ejecutarResSQL(SQL_CONSLTAR_ESTADO_MENSAJE, [des.idChat], function (chatEstado) {
                    des.estadoChat=chatEstado;
                    result[index]=des;
                    if (tamanio === contador) {
                        return confirmacion({en: 1, lC: result});
                    }
                    contador++;
                });
            });
        }else{
            return confirmacion({en: -1, m: "No se encontro chat."});
        }
    }, confirmacion);
}

function guardarAudio(ruta, audio) {
    fs.writeFile(ruta, audio, function (err) {
        if (err)
            console.log('comunicacion.js método guardarAudio ' + err);
    });
}

function guardarImagenBynary(ruta, base64){
    var decodedImage = new Buffer(base64, 'base64').toString('binary');
    fs.writeFile(ruta, decodedImage, 'binary', function(err) {
        if(err)
            console.log("Intente más tarde por favor." );
    });
}

function pushPedidosAdministradores(idSucursal, datosJsonEnvio){
    cnf.ejecutarSQLCallback(SQL_SELECT_ADMINISTRADORES_SUCURSAL, [APP_CLIPP_STORE, idSucursal], function (canales) {
        canales.forEach(function (canal) {
//            console.log("FIREBASE_2 "+canal.idAdministrador+", tipo:"+PUSH_TIPO_PEDIDO_CHAT_ADMINISTRADOR);
            firebase.pushToAdministrador(canal.token, canal.idAdministrador, "Mensaje "+datosJsonEnvio.usuario, datosJsonEnvio.mensaje, PUSH_TIPO_PEDIDO_CHAT_ADMINISTRADOR, datosJsonEnvio);
        });
    });
}


const SQL_SELECT_ADMINISTRADORES_SUCURSAL="SELECT ads.idAdministrador, asp.token FROM clipp.administrador_sucursal ads INNER JOIN clipp.administrador_sucursalActiva adsu ON adsu.idAdministrador=ads.idAdministrador AND  adsu.idSucursal = ads.idSucursal INNER JOIN clipp.administradorSessionPush asp ON asp.idAdministrador=adsu.idAdministrador WHERE ads.idSucursal = ? AND ads.habilitado=1 AND asp.activado = 1;";
const SQL_SELECT_CLIENTE_PEDIDOS="SELECT cp.idUsuario, csp.token FROM clipp.conexiones_pedido cp INNER JOIN clipp.clienteSessionPush csp ON csp.idCliente=cp.idUsuario WHERE cp.idApp = ? AND cp.idPedido = ? AND csp.activado = 1 AND token!='';";


function emitToChatConductor(emit, idPedido, datosJsonEnvio){
    cnf.ejecutarSQLCallback(SQL_SELECT_PEDIDO_SOLICITUD, [idPedido], function (solicitud) {
        if (solicitud.length > 0){
            SOCKET_CLIENTE_KTAXI.emit(emit, solicitud[0].idSolicitud, solicitud[0].username, datosJsonEnvio.mensaje, function (chat) {
            });
        }
    });
}

function perfilUsuarios(idAplicativo){
    if(idAplicativo==1){
        return 'USUARIO';
    }else if(idAplicativo==6){
        return 'LOCAL';
    }else{
        return 'SOPORTE';
    }
}

const SQL_SELECT_PEDIDO_SOLICITUD="SELECT idSolicitud, username FROM clipp.encomienda_solicitud WHERE idEncomienda=? ORDER BY fecha_registro DESC LIMIT 1";