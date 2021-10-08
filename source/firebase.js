/* global _BD_ */

var cnf = require('./config.js');
var administrador = require('./administrador_functions');
var request = require("request");

var URL_FIREBASE = 'https://fcm.googleapis.com/fcm/send';
var TOKEN_FIREBASE = 'key=AIzaSyAMyonWg9zsTSGCgFLgPI5rEXuJMN6ublY';
var TOKEN_FIREBASE_ADMINISTRADOR = 'key=AAAA7r5znTo:APA91bEPyNjARJfy0iP7-Of9itu-uGLL_4mu4MfG0A8XDQqTmXYYjS0FhDYpBWlg9wgKOo3xjKIjzhYWX-9IC6BTjJgB8DBv9Q042lJXRd46QTcwcpNUgNdv6xScJLEq5kMi0iZACQe_';

module.exports = {
    enviarPushToCliente: enviarPushToCliente,
    enviarPushToClienteAck: enviarPushToClienteAck,
    enviarPushToClientesAck: enviarPushToClientesAck,
    enviarPushToAdministrador: enviarPushToAdministrador,
    pushToCliente: pushToCliente,
    pushToAdministrador: pushToAdministrador,
    enviarDataToAdministrador: enviarDataToAdministrador,
    pushPedidosAdministradoresSucursal: pushPedidosAdministradoresSucursal,
    enviarPushToClientePedido: enviarPushToClientePedido,
    pushDataAdministradoresSucursal: pushDataAdministradoresSucursal,
};

var SQL_OBTENER_TOKEN_CLIENTE =
    "SELECT token FROM " + _BD_ + ".clienteSessionPush WHERE idCliente = ? AND `activado` = 1;";

var SQL_OBTENER_TOKEN_VARIOS_CLIENTE =
    "SELECT token, idCliente FROM " + _BD_ + ".clienteSessionPush WHERE `activado` = 1 AND idCliente IN (";

function enviarPushToCliente(idCliente, titulo, cuerpo, tipo, data) {
    cnf.ejecutarSQLCallback(SQL_OBTENER_TOKEN_CLIENTE, [idCliente], function (tokens) {
        tokens.forEach(function (token) {
            let body = { to: token['token'], data: { idCliente: idCliente, t: tipo, data: data }, notification: { body: cuerpo, title: titulo, content_available: true, priority: 'high', click_action: 'FLUTTER_NOTIFICATION_CLICK' } };
            var options = { method: 'POST', url: URL_FIREBASE, headers: { 'content-type': 'application/json', authorization: TOKEN_FIREBASE }, body: body, json: true };
            request(options, function (error) {
                if (error)
                    return administrador.imprimirErrLogs('firebase idCliente: ' + idCliente + ' error: ' + JSON.stringify(error));
                return;//administrador.imprimirLogs('firebase: idCliente: ' + idCliente + ' body: ' + JSON.stringify(body));
            });
        });
    });
}

function enviarPushToClienteAck(idCliente, titulo, cuerpo, tipo, data, res) {
    console.log('----------- Funcion enviar push--------------');
    console.log('idCliente: ', idCliente);
    console.log('titulo: ', titulo);
    console.log('cuerpo: ', cuerpo);
    console.log('tipo: ', tipo);
    console.log('data: ', data);
    cnf.ejecutarSQLCallback(SQL_OBTENER_TOKEN_CLIENTE, [idCliente], function (tokens) {
        if (tokens.length <= 0)
            return res.status(200).send({ en: 0, m: 'Lo sentimos, token inválido' });
        for (let i = 0; i < tokens.length; i++) {
            console.log('For unico');
            console.log('tokems: ', tokens[i]['token']);
            console.log('idCliente: ', idCliente);
            let body = { to: tokens[i]['token'], data: { idCliente: idCliente, t: tipo, data: data }, notification: { body: cuerpo, title: titulo, content_available: true, priority: 'high', click_action: 'FLUTTER_NOTIFICATION_CLICK' } };
            var options = { method: 'POST', url: URL_FIREBASE, headers: { 'content-type': 'application/json', authorization: TOKEN_FIREBASE }, body: body, json: true };
            request(options, function (error) {
                if (error)
                    return res.status(200).send({ en: 0, m: 'Error al enviar mensaje.' });
            });
            if (i == tokens.length - 1) {
                return res.status(200).send({ en: 1, m: 'Mensajes enviados correctamente.' });
            }
        }
    });
}

function enviarPushToClientesAck(clientes, titulo, cuerpo, tipo, data, res) {
    console.log('----------- Funcion enviar varios push--------------');
    console.log('clientes: ', clientes);
    console.log('titulo: ', titulo);
    console.log('cuerpo: ', cuerpo);
    console.log('tipo: ', tipo);
    console.log('data: ', data);
    cnf.ejecutarSQLCallback(SQL_OBTENER_TOKEN_VARIOS_CLIENTE + clientes + ');', [], function (tokens) {
        if (tokens.length <= 0)
            return res.status(200).send({ en: 0, m: 'Lo sentimos, token inválido' });
        console.log('Resultado de tokens: ', tokens);
        for (let i = 0; i < tokens.length; i++) {
            console.log('For each');
            console.log('tokems: ', tokens[i]['token']);
            console.log('idCliente: ', tokens[i]['idCliente']);
            let body = { to: tokens[i]['token'], data: { idCliente: tokens[i]['idCliente'], t: tipo, data: data }, notification: { body: cuerpo, title: titulo, content_available: true, priority: 'high', click_action: 'FLUTTER_NOTIFICATION_CLICK' } };
            var options = { method: 'POST', url: URL_FIREBASE, headers: { 'content-type': 'application/json', authorization: TOKEN_FIREBASE }, body: body, json: true };
            request(options, function (error) {
                if (error)
                    return res.status(200).send({ en: 0, m: 'Error al enviar mensaje.' });
            });
            if (i == tokens.length - 1) {
                return res.status(200).send({ en: 1, m: 'Mensajes enviados correctamente.' });
            }
        }
    });
}

function enviarPushUnClienteConNode(idCliente, titulo, cuerpo, tipo, data, res) {
    console.log('----------- Funcion enviar push--------------');
    console.log('idCliente: ', idCliente);
    console.log('titulo: ', titulo);
    console.log('cuerpo: ', cuerpo);
    console.log('tipo: ', tipo);
    console.log('data: ', data);

    cnf.ejecutarSQLCallback(SQL_OBTENER_TOKEN_CLIENTE, [idCliente], function (tokens) {
        if (tokens.length <= 0)
            return res.status(200).send({ en: 0, m: 'Lo sentimos, token inválido' });
        tokens.forEach(function (token) {
            console.log('Tokens :', tokens);

            /* let body = { to: token['token'], data: { idCliente: idCliente, t: tipo, data: data }, notification: { body: cuerpo, title: titulo, content_available: true, priority: 'high', click_action: 'FLUTTER_NOTIFICATION_CLICK' } };
            var options = { method: 'POST', url: URL_FIREBASE, headers: { 'content-type': 'application/json', authorization: TOKEN_FIREBASE }, body: body, json: true };
            request(options, function (error) {
                if (error)
                    return administrador.imprimirErrLogs('firebase idCliente: ' + idCliente + ' error: ' + JSON.stringify(error));
                return;
            }); */

            let registrationToken = token['token'];

            let message = {
                data: {
                    score: '850',
                    time: '2:45'
                },
                token: registrationToken
            };

            // Send a message to the device corresponding to the provided
            // registration token.
            admin.messaging().send(message)
                .then((response) => {
                    // Response is a message ID string.
                    console.log('Successfully sent message:', response);
                    return res.status(200).send({ en: 1, m: 'Mensaje enviado correctamente.' });
                })
                .catch((error) => {
                    console.log('Error sending message:', error);
                    return res.status(200).send({ en: 0, m: 'Error al enviar mensaje.' });
                });
        });
    });
}


function enviarPushToClientePedido(idPedido, titulo, cuerpo, data, clipper) {


    cnf.ejecutarResSQL(SQL_GET_USUARIO_PEDIDO, [idPedido], function (usuarios) {
        if (usuarios.length > 0)
            usuarios.forEach(function (usuario) {//{idCliente: idCliente, t: tipo, data: data}
                var dataInfo = { idCliente: usuario.idUsuario, t: PUSH_TIPO_PEDIDO_CLIENTE, data: data };
                if (clipper)
                    dataInfo = { idCliente: usuario.idUsuario, t: PUSH_TIPO_PEDIDO_CLIENTE, data: data, clipper: clipper };

                let body = { to: usuario.token, data: dataInfo, notification: { body: cuerpo, title: titulo, content_available: true, priority: 'high', click_action: 'FLUTTER_NOTIFICATION_CLICK' } };
                var options = { method: 'POST', url: URL_FIREBASE, headers: { 'content-type': 'application/json', authorization: TOKEN_FIREBASE }, body: body, json: true };
                request(options, function (error) {
                    if (error)
                        return administrador.imprimirErrLogs('firebase idCliente: ' + idCliente + ' error: ' + JSON.stringify(error));
                    return;//administrador.imprimirLogs('firebase: idCliente: ' + idCliente + ' body: ' + JSON.stringify(body));
                });
                //firebase.enviarPushToCliente(canal.idCliente, pedido[0].sucursal + ' - ' + estado[0].titulo, 'Orden #' + pedido[0].numeroOrden + ', ' + estado[0].descripcionLarga, PUSH_TIPO_PEDIDO_CLIENTE, estado[0]);
            })
    })
}

var SQL_GET_USUARIO_PEDIDO = 'SELECT cp.idUsuario, cs.token FROM clipp.conexiones_pedido cp INNER JOIN clipp.clienteSessionPush cs ON cs.idCliente=cp.idUsuario WHERE cp.idPedido = ? AND cp.idApp = 1 AND cs.activado;'

var SQL_OBTENER_TOKEN_ADMINISTRADOR =
    "SELECT token FROM " + _BD_ + ".administradorSessionPush WHERE idAdministrador = ? AND `activado` = 1;";

function enviarPushToAdministrador(idAdministrador, titulo, cuerpo, tipo, data) {
    cnf.ejecutarSQLCallback(SQL_OBTENER_TOKEN_ADMINISTRADOR, [idAdministrador], function (tokens) {
        tokens.forEach(function (token) {
            let body = { to: token['token'], data: { idAdministrador: idAdministrador, t: tipo, data: data }, notification: { body: cuerpo, title: titulo, content_available: true, priority: 'high', click_action: 'FLUTTER_NOTIFICATION_CLICK' } };
            var options = { method: 'POST', url: URL_FIREBASE, headers: { 'content-type': 'application/json', authorization: TOKEN_FIREBASE_ADMINISTRADOR }, body: body, json: true };
            request(options, function (error) {
                if (error)
                    return administrador.imprimirErrLogs('ERROR firebase idAdministrador: ' + idAdministrador + ' error: ' + JSON.stringify(error));
                return;//administrador.imprimirLogs('firebase: idAdministrador: ' + idAdministrador+ ' body: ' + JSON.stringify(body));
            });
        });
    });
}

//No se envia como una notificacion para que la pueda tratar en la app
function enviarDataToAdministrador(idAdministrador, titulo, cuerpo, tipo, data) {
    cnf.ejecutarSQLCallback(SQL_OBTENER_TOKEN_ADMINISTRADOR, [idAdministrador], function (tokens) {
        tokens.forEach(function (token) {
            let body = { to: token['token'], data: { idAdministrador: idAdministrador, t: tipo, data: data, body: cuerpo, title: titulo } };
            var options = { method: 'POST', url: URL_FIREBASE, headers: { 'content-type': 'application/json', authorization: TOKEN_FIREBASE_ADMINISTRADOR }, body: body, json: true };
            request(options, function (error) {
                if (error)
                    return administrador.imprimirErrLogs('ERROR firebase idAdministrador: ' + idAdministrador + ' error: ' + JSON.stringify(error));
                return;//administrador.imprimirLogs('firebase: idAdministrador: ' + idAdministrador+ ' body: ' + JSON.stringify(body));
            });
        });
    });
}

function pushToCliente(token, idCliente, titulo, cuerpo, tipo, data) {
    let body = { to: token, data: { idCliente: idCliente, t: tipo, data: data }, notification: { body: cuerpo, title: titulo, content_available: true, priority: 'high', click_action: 'FLUTTER_NOTIFICATION_CLICK' } };
    var options = { method: 'POST', url: URL_FIREBASE, headers: { 'content-type': 'application/json', authorization: TOKEN_FIREBASE }, body: body, json: true };
    request(options, function (error) {
        if (error)
            return administrador.imprimirErrLogs('firebase idCliente: ' + idCliente + ' error: ' + JSON.stringify(error));
        return;//administrador.imprimirLogs('firebase: idCliente: ' + idCliente + ' body: ' + JSON.stringify(body));
    });
}

function pushToAdministrador(token, idAdministrador, titulo, cuerpo, tipo, data) {
    let body = { to: token, data: { idAdministrador: idAdministrador, t: tipo, data: data }, notification: { body: cuerpo, title: titulo, content_available: true, priority: 'high', click_action: 'FLUTTER_NOTIFICATION_CLICK' } };
    var options = { method: 'POST', url: URL_FIREBASE, headers: { 'content-type': 'application/json', authorization: TOKEN_FIREBASE_ADMINISTRADOR }, body: body, json: true };
    request(options, function (error) {
        if (error)
            return administrador.imprimirErrLogs('ERROR firebase idAdministrador: ' + idAdministrador + ' error: ' + JSON.stringify(error));
        return;//administrador.imprimirLogs('firebase: idAdministrador: ' + idAdministrador+ ' body: ' + JSON.stringify(body));
    });
}

//firebase.enviarPushToAdministrador(canal.idAdministrador, pedido.sucursal+' - '+estados.titulo, 'Orden #' + pedido.numeroOrden + ' '+pedido.nombres+ ', ' + estados.descripcionLarga, PUSH_TIPO_PEDIDO_ADMINISTRADOR, estados);
function pushPedidosAdministradoresSucursal(idSucursal, titulo, cuerpo, tipo, data, clipper) {
    cnf.ejecutarSQLCallback(SQL_SELECT_ADMINISTRADORES_SUCURSAL, [idSucursal], function (canales) {
        canales.forEach(function (canal) {
            var dataInfo = { idAdministrador: canal.idAdministrador, t: tipo, data: data };
            if (clipper) {
                dataInfo = { idAdministrador: canal.idAdministrador, t: tipo, data: data, clipper: clipper };
            }
            let body = { to: canal.token, data: dataInfo, notification: { body: cuerpo, title: titulo, content_available: true, priority: 'high', click_action: 'FLUTTER_NOTIFICATION_CLICK' } };
            var options = { method: 'POST', url: URL_FIREBASE, headers: { 'content-type': 'application/json', authorization: TOKEN_FIREBASE_ADMINISTRADOR }, body: body, json: true };
            request(options, function (error) {
                if (error)
                    return administrador.imprimirErrLogs('ERROR firebase idAdministrador: ' + canal.idAdministrador + ' error: ' + JSON.stringify(error));
                return;//administrador.imprimirLogs('firebase: idAdministrador: ' + idAdministrador+ ' body: ' + JSON.stringify(body));
            });
        });
    });
}

//Enviar push por sucursales pero con data para que lo trate el app, se quito *notification*
function pushDataAdministradoresSucursal(idSucursal, titulo, cuerpo, tipo, data) {
    cnf.ejecutarSQLCallback(SQL_SELECT_ADMINISTRADORES_SUCURSAL, [idSucursal], function (canales) {
        canales.forEach(function (canal) {
            let body = { to: canal.token, data: { idAdministrador: canal.idAdministrador, t: tipo, data: data, body: cuerpo, title: titulo } };
            var options = { method: 'POST', url: URL_FIREBASE, headers: { 'content-type': 'application/json', authorization: TOKEN_FIREBASE_ADMINISTRADOR }, body: body, json: true };
            request(options, function (error) {
                if (error)
                    return administrador.imprimirErrLogs('ERROR firebase idAdministrador: ' + canal.idAdministrador + ' error: ' + JSON.stringify(error));
                return;//administrador.imprimirLogs('firebase: idAdministrador: ' + idAdministrador+ ' body: ' + JSON.stringify(body));
            });
        });
    });
}

const SQL_SELECT_ADMINISTRADORES_SUCURSAL = "SELECT ads.idAdministrador, asp.token FROM clipp.administrador_sucursal ads INNER JOIN clipp.administrador_sucursalActiva adsu ON adsu.idAdministrador=ads.idAdministrador AND  adsu.idSucursal = ads.idSucursal INNER JOIN clipp.administradorSessionPush asp ON asp.idAdministrador=adsu.idAdministrador WHERE ads.idSucursal = ?   AND ads.habilitado=1 AND asp.activado = 1;";
