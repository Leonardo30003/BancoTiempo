/* global FACTOR_DE_RETRASO, EMIT_REDIS, _BD_, ID_RE_CL_ASIGNADO, ID_RE_AD_ASIGNADO, ID_RE_CL_CANCELA, ID_RE_AD_CANCELADO_POR_CLIENTE, ID_RE_CL_CONFIRMA_CANCELADO_DE_PROFESIONAL, ID_RE_AD_CANCELA, ID_RE_CL_CANCELADO_POR_PROFESIONAL, ID_RE_AD_RECHAZA_ASIGNACION, ID_RE_CL_RESERVADA, MENSAJE_DEPRECATE, LLAVE_ECRIP */
var request = require("request");
var md5 = require('md5');
var sha256 = require('sha256');
var cnf = require('./config.js');

module.exports = {
    consultaTaxis: consultaTaxis,
    consultaTaxis_v2: consultaTaxis_v2,
    consultaTaxisDescuento_v2: consultaTaxisDescuento_v2,
    consultaTaxisDescuento_v3: consultaTaxisDescuento_v3,
    jsonCarreraConDestino: jsonCarreraConDestino,
    jsonCarreraSinDestino: jsonCarreraSinDestino
};

function CreateTokenKeyDestinoDistancia(ltO, lgO) {
    let timestamp = Date.now()
    let shail = sha256('5397CEF4-C6E6-4DEB-9B10-2365C5EFCD53' + ltO)
    let token = md5(timestamp + shail)
    let key = sha256(token + timestamp + lgO)
    return { token: token, key: key, timestamp: timestamp }
}

const CO2_TAXIS = 0.195;
function consultaTaxis(ltO, lgO, ltD, lgD, res) {
    const { token, key, timestamp } = CreateTokenKeyDestinoDistancia(ltO, lgO)
    var options = {
        method: 'POST', timeout: 1000,
        url: URL_SERVIDOR_KTAXI + 'ser/destino/calcular-valor-clipp/',
        headers: {
            Connection: 'keep-alive',
            Host: 'testktaxi.kradac.com',
            Accept: '*/*',
            version: '3.0.0'
        },
        form: {
            idCliente: 1,
            idAplicativo: 1,
            idCiudad: 1,
            latitudOrigen: ltO,
            longitudOrigen: lgO,
            latitudDestino: ltD,
            longitudDestino: lgD,
            imei: '5397CEF4-C6E6-4DEB-9B10-2365C5EFCD53',
            token: token,
            key: key,
            timeStanD: timestamp,
            idServicioActivo: 1,
        }
    };
    request(options, function (error, response, body) {
        if (error)
            return res.status(200).send({ en: -1, m: 'No se pudo obtener el costo del pedido', error: error });
        let respuesta;
        try {
            respuesta = JSON.parse(body);
            if (respuesta.en == 1)
                return res.status(200).send({ en: 1, d: respuesta.distancia.valor, co2: (parseFloat(respuesta.distancia.valor) * CO2_TAXIS), u: respuesta.distancia.unidad, t: respuesta.tiempoEstimado.valor, c: respuesta.costo.valor, mod: respuesta.costo.moneda, r: respuesta.r });
            return res.status(200).send({ en: -2, m: 'No se pudo obtener el costo del pedido' });
        } catch (e) {
            return res.status(200).send({ en: -3, m: 'No se pudo obtener el costo del pedido', e: e });
        }
    });
}

function consultaTaxis_v2(ltO, lgO, ltD, lgD, idCiudadKtaxi, idServicioActivo, res) {

    const { token, key, timestamp } = CreateTokenKeyDestinoDistancia(ltO, lgO)
    var options = {
        method: 'POST', timeout: 1000,
        url: URL_SERVIDOR_KTAXI + 'ser/destino/calcular-valor-clipp/',
        headers: {
            Connection: 'keep-alive',
            Host: 'testktaxi.kradac.com',
            Accept: '*/*',
            version: '3.0.1'
        },
        form: {
            idCliente: 1,
            idAplicativo: ID_APLICATIVO_CLIPP_TAXI,
            idCiudad: idCiudadKtaxi,
            latitudOrigen: ltO,
            longitudOrigen: lgO,
            latitudDestino: ltD,
            longitudDestino: lgD,
            imei: '5397CEF4-C6E6-4DEB-9B10-2365C5EFCD53',
            token: token,
            key: key,
            timeStanD: timestamp,
            idServicioActivo: idServicioActivo,
        }
    };
    request(options, function (error, response, body) {
        if (error)
            return res.status(200).send({ en: -1, m: 'No se pudo obtener el costo del pedido', error: error });
        let respuesta;
        try {
            respuesta = JSON.parse(body);
            if (respuesta.en == 1)
                return res.status(200).send({ en: 1, d: respuesta.distancia.valor, co2: (parseFloat(respuesta.distancia.valor) * CO2_TAXIS), u: respuesta.distancia.unidad, t: respuesta.tiempoEstimado.valor, c: respuesta.costo.valor, mod: respuesta.costo.moneda, r: respuesta.r });
            return res.status(200).send({ en: -2, m: 'No se pudo obtener el costo del pedido' });
        } catch (e) {
            return res.status(200).send({ en: -3, m: 'No se pudo obtener el costo del pedido', e: e });
        }
    });
}

var TIPO_DESCUENTO_PORCENTUAL = 2;
var TIPO_DESCUENTO_FIJO = 1;
function consultaTaxisDescuento_v2(ltO, lgO, ltD, lgD, idCiudadKtaxi, idServicioActivo, idCliente, res) {
//    console.log('Url consulta: '+URL_SERVIDOR_KTAXI + 'ser/destino/calcular-valor-clipp/');
    
    const { token, key, timestamp } = CreateTokenKeyDestinoDistancia(ltO, lgO)
    var options = {
        method: 'POST', timeout: 1000,
        url: URL_SERVIDOR_KTAXI + 'ser/destino/calcular-valor-clipp/',
        headers: {
            Connection: 'keep-alive',
            Host: 'testktaxi.kradac.com',
            Accept: '*/*',
            version: '3.0.1'
        },
        form: {
            idCliente: 1,
            idAplicativo: ID_APLICATIVO_CLIPP_TAXI,
            idCiudad: idCiudadKtaxi,
            latitudOrigen: ltO,
            longitudOrigen: lgO,
            latitudDestino: ltD,
            longitudDestino: lgD,
            imei: '5397CEF4-C6E6-4DEB-9B10-2365C5EFCD53',
            token: token,
            key: key,
            timeStanD: timestamp,
            idServicioActivo: idServicioActivo,
        }
    };
    request(options, function (error, response, body) {
        if (error)
            return res.status(200).send({ en: -1, m: 'No se pudo obtener el costo del pedido', error: error });
        let respuesta;
        try {
            respuesta = JSON.parse(body);
//       console.log('respuesta costo :', respuesta);
            if (respuesta.en == 1)
                cnf.ejecutarResSQL(SQL_SELECT_DESCUENTOS, [idCliente], function (clientes) {
                    let costoCarrera = respuesta.costo.valor;
                    let descuento = {};
                    let valor = 0;
                    if (clientes.length > 0) {
                        if (clientes[0].idTipoDescuento == TIPO_DESCUENTO_PORCENTUAL)
                            valor = (clientes[0].valor / 100) * costoCarrera;
                        else if (clientes[0].idTipoDescuento == TIPO_DESCUENTO_FIJO)
                            valor = (costoCarrera < clientes[0].valor ? costoCarrera : clientes[0].valor);
                        return res.status(200).send({ en: 1, d: respuesta.distancia.valor, co2: (parseFloat(respuesta.distancia.valor) * CO2_TAXIS), u: respuesta.distancia.unidad, t: respuesta.tiempoEstimado.valor, c: respuesta.costo.valor, mod: respuesta.costo.moneda, r: respuesta.r, desc: { valor: parseFloat((Math.floor(valor * 100) / 100).toFixed(2)), idDescuentoCliente: clientes[0].idDescuentoCliente, nombre: clientes[0].descuento } });
                    } else {
//                        console.log({ en: 1, d: respuesta.distancia.valor, co2: (parseFloat(respuesta.distancia.valor) * CO2_TAXIS), u: respuesta.distancia.unidad, t: respuesta.tiempoEstimado.valor, c: respuesta.costo.valor, mod: respuesta.costo.moneda, r: respuesta.r });
                        return res.status(200).send({ en: 1, d: respuesta.distancia.valor, co2: (parseFloat(respuesta.distancia.valor) * CO2_TAXIS), u: respuesta.distancia.unidad, t: respuesta.tiempoEstimado.valor, c: respuesta.costo.valor, mod: respuesta.costo.moneda, r: respuesta.r });
                    }
                });
            else
                return res.status(200).send({ en: -2, m: 'No se pudo obtener el costo del pedido' });
        } catch (e) {
            return res.status(200).send({ en: -3, m: 'No se pudo obtener el costo del pedido', e: e });
        }
    });
}

function consultaTaxisDescuento_v3(ltO, lgO, ltD, lgD, idCiudadKtaxi, idServicioActivo, idCliente, idSucursal, costoPedido, res) {
//  console.log('------------------- Consultar Descuento v3 ------------------');
    const { token, key, timestamp } = CreateTokenKeyDestinoDistancia(ltO, lgO)
    var options = {
        method: 'POST', timeout: 1000,
        url: URL_SERVIDOR_KTAXI + 'ser/destino/calcular-valor-clipp/',
        headers: {
            Connection: 'keep-alive',
            Host: 'testktaxi.kradac.com',
            Accept: '*/*',
            version: '3.0.1'
        },
        form: {
            idCliente: 1,
            idAplicativo: ID_APLICATIVO_CLIPP_TAXI,
            idCiudad: idCiudadKtaxi,
            latitudOrigen: ltO,
            longitudOrigen: lgO,
            latitudDestino: ltD,
            longitudDestino: lgD,
            imei: '5397CEF4-C6E6-4DEB-9B10-2365C5EFCD53',
            token: token,
            key: key,
            timeStanD: timestamp,
            idServicioActivo: idServicioActivo,
        }
    };
    request(options, function (error, response, body) {
        console.log('error :', error);
        if (error)
            return res.status(200).send({ en: -1, m: 'No se pudo obtener el costo del pedido en -1', error: error });
        let respuesta;
        try {
            respuesta = JSON.parse(body);
//           console.log('respuesta costo :', respuesta);
            if (respuesta.en == 1) {
                cnf.ejecutarResSQL(SQL_SELECT_DESCUENTOS_POR_SUCURSAL, [idCliente, idSucursal], function (clientesSucursal) {
//                    console.log('Clientes Sucursal: ', clientesSucursal);
                    let costoCarrera = respuesta.costo.valor;
                    let descuento = {};
                    let valor = 0;
                    if (clientesSucursal.length > 0) {
                        if (clientesSucursal[0].valorMinConsumo > costoPedido) 
                            return res.status(200).send({ en: 1, d: respuesta.distancia.valor, co2: (parseFloat(respuesta.distancia.valor) * CO2_TAXIS), u: respuesta.distancia.unidad, t: respuesta.tiempoEstimado.valor, c: respuesta.costo.valor, mod: respuesta.costo.moneda, r: respuesta.r });
                        if (clientesSucursal[0].idTipoDescuento == TIPO_DESCUENTO_PORCENTUAL)
                            valor = (clientesSucursal[0].valor / 100) * costoCarrera;
                        else if (clientesSucursal[0].idTipoDescuento == TIPO_DESCUENTO_FIJO )
                            valor = (costoCarrera < clientesSucursal[0].valor ? costoCarrera : clientesSucursal[0].valor);
                        return res.status(200).send({ en: 1, d: respuesta.distancia.valor, co2: (parseFloat(respuesta.distancia.valor) * CO2_TAXIS), u: respuesta.distancia.unidad, t: respuesta.tiempoEstimado.valor, c: respuesta.costo.valor, mod: respuesta.costo.moneda, r: respuesta.r, desc: { valor: parseFloat((Math.floor(valor * 100) / 100).toFixed(2)), idDescuentoCliente: clientesSucursal[0].idDescuentoCliente, nombre: clientesSucursal[0].descuento } });
                    } else {
                        cnf.ejecutarResSQL(SQL_SELECT_DESCUENTOS, [idCliente], function (clientes) {
//                            console.log('Clientes: ', clientes);
                            let costoCarrera = respuesta.costo.valor;
                            let descuento = {};
                            let valor = 0;
                            if (clientes.length > 0) {
                                if (clientes[0].idTipoDescuento == TIPO_DESCUENTO_PORCENTUAL)
                                    valor = (clientes[0].valor / 100) * costoCarrera;
                                else if (clientes[0].idTipoDescuento == TIPO_DESCUENTO_FIJO)
                                    valor = (costoCarrera < clientes[0].valor ? costoCarrera : clientes[0].valor);
                                return res.status(200).send({ en: 1, d: respuesta.distancia.valor, co2: (parseFloat(respuesta.distancia.valor) * CO2_TAXIS), u: respuesta.distancia.unidad, t: respuesta.tiempoEstimado.valor, c: respuesta.costo.valor, mod: respuesta.costo.moneda, r: respuesta.r, desc: { valor: parseFloat((Math.floor(valor * 100) / 100).toFixed(2)), idDescuentoCliente: clientes[0].idDescuentoCliente, nombre: clientes[0].descuento } });
                            } else {
//                                console.log({ en: 1, d: respuesta.distancia.valor, co2: (parseFloat(respuesta.distancia.valor) * CO2_TAXIS), u: respuesta.distancia.unidad, t: respuesta.tiempoEstimado.valor, c: respuesta.costo.valor, mod: respuesta.costo.moneda, r: respuesta.r });
                                return res.status(200).send({ en: 1, d: respuesta.distancia.valor, co2: (parseFloat(respuesta.distancia.valor) * CO2_TAXIS), u: respuesta.distancia.unidad, t: respuesta.tiempoEstimado.valor, c: respuesta.costo.valor, mod: respuesta.costo.moneda, r: respuesta.r });
                            }
                        });
                        /* return res.status(200).send({ en: 1, d: respuesta.distancia.valor, co2: (parseFloat(respuesta.distancia.valor) * CO2_TAXIS), u: respuesta.distancia.unidad, t: respuesta.tiempoEstimado.valor, c: respuesta.costo.valor, mod: respuesta.costo.moneda, r: respuesta.r }); */
                    }
                });
            } else
                return res.status(200).send({ en: -2, m: 'No se pudo obtener el costo del pedido en -2' });
        } catch (e) {
            return res.status(200).send({ en: -3, m: 'No se pudo obtener el costo del pedido en -3', e: e });
        }
    });
}
var SQL_SELECT_DESCUENTOS = "SELECT d.idTipoDescuento, d.idDescuento, dc.idDescuentoCliente, d.valor, d.descuento FROM clipp.descuento_cliente dc INNER JOIN clipp.descuento d ON d.idDescuento=dc.idDescuento WHERE dc.idCliente=? AND now() between dc.fechaInicio AND dc.fechaFin AND dc.estado=1 AND dc.numeroPedidos<=dc.pedidosMax";

var SQL_SELECT_DESCUENTOS_POR_SUCURSAL = "SELECT d.idTipoDescuento, d.idDescuento, dc.idDescuentoSucursal, d.valor, d.descuento, cds.codigo, IFNULL(cd.valorMinConsumo,0) AS valorMinConsumo FROM clipp.descuento_sucursal dc INNER JOIN clipp.descuento d ON d.idDescuento=dc.idDescuento INNER JOIN clipp.codigoDescuento_sucursal cds ON cds.idSucursal = dc.idSucursal AND cds.estado = 1 INNER JOIN clipp.codigoDescuento cd ON cd.idCodigoDescuento = cds.idCodigoDescuento WHERE dc.idCliente = ? AND dc.idSucursal = ? AND NOW() between dc.fechaInicio AND dc.fechaFin AND dc.estado=1 AND dc.numeroPedidos<=dc.pedidosMax";


function jsonCarreraSinDestino(cliente, clienteKtaxi, imei, servicio) {
    return {
        "idCliente": cliente['idClienteKtaxi'],
        "idEmpresa": 0,
        "ciudad": clienteKtaxi['usuario']['ciudad'],
        "latitud": cliente['latitud'],
        "longitud": cliente['longitud'],
        "callePrincipal": cliente['callePrincipal'],
        "calleSecundaria": cliente['calleSecundaria'],
        "barrioCliente": cliente['barrioCliente'] + ", Encomienda",
        "referenciaCliente": cliente['referenciaCliente'],
        "ltg": -4.3551243135484,
        "lgg": -79.21343122127693,
        "nombres": clienteKtaxi['usuario']['nombres'],
        "celularPasajero": clienteKtaxi['usuario']['celular'],
        "nombresPasajero": clienteKtaxi['usuario']['nombres'],
        "isNuevoSolicitud": 1,
        "idDispositivo": "ServerClipp",
        "room": 1,
        "idAplicativo": ID_APLICATIVO_CLIPP_TAXI,
        "p": 1,
        "tipo": 0,
        "saldo": 0,
        "conP": 4,
        "idSa": servicio['idServicioActivo'] == 0 ? ID_SERVICIO_ACTIVO : servicio['idServicioActivo'],
        "dirSis": cliente['barrioCliente'] + '$$_' + cliente['callePrincipal'] + '$$_' + cliente['calleSecundaria'],
        "dirSisB": "",
        "chat": "2",
        "caracteristicas": [servicio['idCaracteristica'] == 0 ? ID_CARACTERISTICA : servicio['idCaracteristica']],
        "lCfn": [{
            "idCfn": 1,
            "valor": 1
        }],
        "propina": "0.00",
        "token": "kjahdfkldasjrklewjroiewuroiewjmfahsdl",
    }
}

function jsonCarreraConDestino(cliente, clienteKtaxi, imei, destino, servicio) {
    return {
        "idCliente": cliente['idClienteKtaxi'],
        "idEmpresa": 0,
        "ciudad": clienteKtaxi['usuario']['ciudad'],
        "latitud": cliente['latitud'],
        "longitud": cliente['longitud'],
        "callePrincipal": cliente['callePrincipal'],
        "calleSecundaria": cliente['calleSecundaria'],
        "barrioCliente": cliente['barrioCliente'] + ", Encomienda",
        "referenciaCliente": cliente['referenciaCliente'],
        "ltg": -4.3551243135484,
        "lgg": -79.21343122127693,
        "nombres": clienteKtaxi['usuario']['nombres'],
        "celularPasajero": clienteKtaxi['usuario']['celular'],
        "nombresPasajero": clienteKtaxi['usuario']['nombres'],
        "isNuevoSolicitud": 1,
        "idDispositivo": "ServerClipp",//imei,
        "room": 1,
        "idAplicativo": ID_APLICATIVO_CLIPP_TAXI,
        "p": 1,
        "tipo": 0,
        "saldo": 0,
        "conP": 4,
        "idSa": servicio['idServicioActivo'] == 0 ? ID_SERVICIO_ACTIVO : servicio['idServicioActivo'],
        "dirSis": cliente['barrioCliente'] + '$$_' + cliente['callePrincipal'] + '$$_' + cliente['calleSecundaria'],
        "dirSisB": "",
        "idPago": 1,
        "idCredito": 0,
        "lD": [{
            "desBar": destino['barrioDestino'], // barrio destino 
            "desRef": destino['referencia'], // destino referencia
            "desCp": destino['cllPrincipal'], // calle principal destino
            "desCs": destino['cllSecundaria'], // calle secundaria destino
            "desDis": destino['distancia'],
            "desC": destino['costoEnvio'],
            "desT": destino['tiempo'],
            "ltD": destino['latitud'],
            "lgD": destino['longitud'],
            "desSis": destino['barrioDestino'] + '$$_' + destino['cllPrincipal'] + '$$_' + destino['cllSecundaria'], // destino
            "desSisB": "0,0,0",
            "idSa": servicio['idServicioActivo'] == 0 ? ID_SERVICIO_ACTIVO : servicio['idServicioActivo'],
        }],
        "chat": "2",
        "caracteristicas": [servicio['idCaracteristica'] == 0 ? ID_CARACTERISTICA : servicio['idCaracteristica']],
        "lCfn": [{
            "idCfn": 1,
            "valor": 1
        }],
        "propina": "0.00",
        "token": "kjahdfkldasjrklewjroiewuroiewjmfahsdl",
    }
}