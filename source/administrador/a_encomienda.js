var cnf = require('./config.js');
var firebase = require('./firebase');
var request = require("request");
var c_estado_pedido = require('./c_estados_pedido.js');
var administrador = require('./administrador_functions');
var a_encomienda_chat=require('./a_encomienda_chat');
var ktaxiCarrera = require('./ktaxi_carrera.js');
var mensajes_wp = require('./mensajes_wp');

const ESTADO_INICIAL=1;
function nuevoEncomienda(socket, data, ack){
    var idUsuario = data['idUsuario']
    var idAplicativo = data['idAplicativo']
    var idPlataforma = data['idPlataforma']
    var idSucursal = data['idSucursal']
    var idDireccionOrigen = data['idDireccionOrigen']
    var idDireccionDestino = data['idDireccionDestino']
    var idFormaPago = data['idFormaPago']
    var idContacto = data['idContacto']
    var marca = data['marca']
    var modelo = data['modelo']
    var version_clipp = data['version_clipp']
    var version_so = data['version_so']
    var idTipoTransporte = data['idTipoTransporte']
    var costoEnvio = data['costoEnvio']
    var costoPaquete = data['costoPaquete']
    var calles = data['calles']
    var referencia = data['referencia']
    var observacion = data['observacion']
    var tiempo = data['tiempo']
    var distancia = data['distancia']
    
    if (!idUsuario)
        return ack({ en: -1, param: 'Parameter missing code 1' })
    if (!idAplicativo)
        return ack({ en: -1, param: 'Parameter missing code 2' })
    if (!idPlataforma)
        return ack({ en: -1, param: 'Parameter missing code 3' })
//    if (!idContacto)
//        return ack({ en: -1, param: 'Parameter missing code 5' })
    if (!idTipoTransporte)
        return ack({ en: -1, param: 'Parameter missing code 6' })
//    if (idDireccionDestino)
//        if(!costoEnvio)
//            return ack({ en: -1, param: 'Parameter missing code 7' })
    
    if (!costoEnvio)
        costoEnvio=0;
//    if (!idFormaPago)
//        return ack({ en: -1, param: 'Parameter missing code 8' })
    if (!idDireccionOrigen && !idSucursal)
        return ack({ en: -1, param: 'Parameter missing code 9' })
//    if (!idDireccionDestino && !calles && !referencia)
//        return ack({ en: -1, param: 'Parameter missing code 10' })

    
    var auth = data['auth']
    var idAplicativo = data['idAplicativo']
    var idPlataforma = data['idPlataforma']
    var imei = data['imei']
    var marca = data['marca']
    var modelo = data['modelo']
    var so = data['so']
    var vs = data['vs']

    if (!auth)
        return ack({ en: -1, param: 'Parameter missing code 100' })
    if (!idAplicativo)
        return ack({ en: -1, param: 'Parameter missing code 101' })
    if (!idPlataforma)
        return ack({ en: -1, param: 'Parameter missing code 102' })
    if (!imei)
        return ack({ en: -1, param: 'Parameter missing code 103' })
    if (!marca)
        return ack({ en: -1, param: 'Parameter missing code 104' })
    if (!modelo)
        return ack({ en: -1, param: 'Parameter missing code 105' })
    if (!so)
        return ack({ en: -1, param: 'Parameter missing code 106' })
    if (!vs)
        return ack({ en: -1, param: 'Parameter missing code 107' })

    cnf.ejecutarResSQL(SQL_INSERT_ENCOMIENDA, [idUsuario, idAplicativo, idPlataforma, idSucursal, idDireccionOrigen, idDireccionDestino, idContacto, ESTADO_INICIAL, idTipoTransporte, costoEnvio, costoPaquete, calles, referencia, observacion, idFormaPago, marca, modelo, imei, vs, so, tiempo, distancia], function (encomienda) {
        if (encomienda['insertId'] <= 0)
            return ack({ en: -1, m: 'En este momento no se puede realizar su encomienda, intente nuevamente más tarde.' })
            
        cnf.ejecutarResSQL(SQL_INSERT_ENCOMIENDA_ESTDO, [ESTADO_INICIAL, encomienda['insertId'], idUsuario, idAplicativo, idPlataforma], function (estado) {
            if (estado['insertId'] <= 0)
                return ack({ en: -1, m: 'En este momento no se puede realizar su encomienda, intente nuevamente más tarde.' })  
            
            solicitarDespachoClipperEncomienda(encomienda['insertId'], data, ack);
            notificarWPEncomiendas(encomienda['insertId']);
            cnf.ejecutarResSQL(SQL_SELECT_INFORMACION_ENCOMIENDA, [encomienda['insertId']], function (encomiendas) {
                 if (encomiendas.length <= 0)
                     return ack({ en: -1, m: 'En este momento no se puede realizar su encomienda, intente nuevamente más tarde.' })  
                     
                return ack({ en: 1, encomienda: encomiendas[0],  m: 'Encomienda registrada correctamente' });
            });
            
        });
        
    });
}

const SQL_SELECT_INFORMACION_ENCOMIENDA="SELECT e.idEncomienda, e.idUsuario, e.idAplicativo, e.idPlataforma, e.idSucursal, e.idDireccionOrigen, e.idDireccionDestino, e.idContacto, e.idEstado, e.costoEnvio, e.costoPaquete, e.distancia, e.tiempo, e.calles, e.referencia, e.observacion, e.fechaRegistro, ee.titulo, ee.estado, ee.titulo, ee.descripcion, ee.color, fp.idFormaPago, fp.icono, IF(ce.idContactoEncomienda IS NOT NULL,ce.idContactoEncomienda,-1) AS idContactoEncomienda, IF(ce.nombres IS NOT NULL,ce.nombres,'') AS nombres, IF(ce.telefono IS NOT NULL, ce.telefono, '') AS telefono, e.idTipoTransporte, tp.titulo, tp.imagen FROM clipp.encomienda e INNER JOIN clipp.estadoEncomienda ee ON ee.estado=e.idEstado INNER JOIN clipp.formaPago fp ON fp.idFormaPago=e.idFormaPago INNER JOIN clipp.transportePedido tp ON tp.idTransportePedido=e.idTipoTransporte LEFT JOIN clipp.contactoEncomienda ce ON ce.idContactoEncomienda=e.idContacto WHERE e.idEncomienda = ?;";
const SQL_INSERT_ENCOMIENDA="INSERT INTO clipp.encomienda (idUsuario, idAplicativo, idPlataforma, idSucursal, idDireccionOrigen, idDireccionDestino, idContacto, idEstado, idTipoTransporte, costoEnvio, costoPaquete, calles, referencia, observacion, idFormaPago, marca, modelo, imei, version_clipp, version_so, tiempo, distancia) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
const SQL_INSERT_ENCOMIENDA_ESTDO="INSERT INTO clipp.encomienda_estadoEncomienda (estado, idEncomienda, idUsuario, idAplicativo, idPlataforma) VALUES (?, ?, ?, ?, ?);";

function solicitarDespachoClipperEncomienda(idEncomienda, data, ack) {
    if (!data.idSucursal)
        return ack({ en: -1, param: 'idSucursal.' });
    if (!idEncomienda)
        return ack({ en: -1, param: 'idEncomienda.' });
    if (!data.idTipoTransporte)
        return ack({ en: -1, param: 'idTipoTransporte.' });

    cnf.ejecutarResSQL(SQL_LSITAR_SUCURSAL, [data.idSucursal], function (sucursales) {
        if (sucursales.length <= 0)
            return ack({ en: -1, m: 'Lo sentimos, intentalo de nuevo mas tarde.' });
        //console.log('sucursalees: ', sucursales);

        cnf.ejecutarResSQL(SQL_OBTENER_ORIGEN_DESTINO, [idEncomienda], function (destinos) {
            if (destinos.length <= 0)
                return ack({ en: -1, m: 'Lo sentimos, no hay direcciones para este pedido.' });

//            console.log('SOLCICITAR CLIPPER ENCOMIENDA, '+sucursales[0]['idClienteKtaxi']);
            let options = {
                method: 'POST',
                url: URL_SERVIDOR_KTAXI + 'clipp/cliente',
                headers: {
                    Connection: 'keep-alive',
                    Host: 'testktaxi.kradac.com',
                    Accept: '*/*',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    version: '3.1.1'
                },
                form: {
                    idCliente: sucursales[0]['idClienteKtaxi'],
                }
            };
            request(options, function (error, response, body) {
                if (error) {
                    console.log('error: ', error);
                }
                if (error)
                    return ack({ en: -1, m: 'Lo sentimos, intentelo de nuevo mas tarde sucedio un error.' });
                try {
                    respuesta = JSON.parse(body);
                    
                    if (respuesta['en'] && respuesta['en'] == 1) {
                        cnf.ejecutarResSQL(SQL_OBTENER_SERVICIO_ACTIVO, [data.idTipoTransporte, destinos[0]['idCiudad']], function (servicios) {
                            if (servicios.length <= 0)
                                return ack({ en: -1, m: 'Lo sentimos, no hay servicios activas para esta ciudad.' });

                            var dataDestino="";
                            let datos;
                            if(destinos[0].idDireccionDestino!=null){
                                datos = ktaxiCarrera.jsonCarreraConDestino(sucursales[0], respuesta, data['imei'], destinos[0], servicios[0]);
                            }else{
                                datos = ktaxiCarrera.jsonCarreraSinDestino(sucursales[0], respuesta, data['imei'], servicios[0]);
                            }
                            
                            let metadatos = {
                                "idPlataformaKtaxi": data['idPlataforma'],
                                "versionKtaxi": data['vs'],
                                "versionSo": data['so'],
                                "marca": data['marca'],
                                "modelo": data['modelo'],
                                "nivelBateria": 100,
                                "operadora": "App",
                                "tipoConexion": 1,
                                "tipoRed": 1,
                                "usandoGps": 1,
                                "realizadoDesde": 1
                            }
                            console.log("solicitar_multiples_carrera",datos);
                            console.log("solicitar_multiples_carrera",metadatos);
                            SOCKET_CLIENTE_KTAXI.emit("solicitar_multiples_carrera", datos, metadatos, function (idSolicitud) {
                                if (idSolicitud <= 0)
                                    return ack({ en: -1, m: 'Lo sentimos, intentelo de nuevo mas tarde no se pudo solicitar la carrera.' });

                                cnf.ejecutarResSQL(SQL_REGISTRAR_ID_SOLICITUD, [idEncomienda, idSolicitud, data.idSucursal, data.idUsuario, sucursales[0]['idClienteKtaxi'], data['idAplicativo']], function (solicitudes) {
                                    if (solicitudes.length <= 0) 
                                        return ack({ en: -1, m: 'Lo sentimos, No se pudo registrar la solictud en el pedido.' });

                                    SOCKET_CLIENTE_KTAXI.emit("notificar_solicitud", idSolicitud, 0, function (data) {
                                        console.log('ENCOMIENDA', data);
                                    });
                                });
                            });
                        });
                    } else {
                        return ack({ en: -1, m: 'No se pudo consumir recurso de ktaxi' });
                    }
                } catch (e) {
                    return ack({ en: -1, m: 'Lo sentimos, intentelo de nuevo mas tarde.' });
                }
            });

        });
    });
}

const SQL_LSITAR_SUCURSAL ="SELECT idClienteKtaxi, latitud, longitud, callePrincipal, calleSecundaria, barrioCliente, referenciaCliente   FROM " + _BD_ + ".sucursal where idSucursal = ? LIMIT 1;";
const SQL_OBTENER_ORIGEN_DESTINO ="SELECT e.idDireccionDestino, e.costoEnvio, e.distancia, e.tiempo, d.referencia, d.latitud, d.longitud, SUBSTRING_INDEX(d.direccion, 'y', 1) AS cllPrincipal, SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(d.direccion,'y',2),'y',-1), ',', 1) AS cllSecundaria, SUBSTRING_INDEX(SUBSTRING_INDEX(d.direccion,',',2),',',-1) AS barrioDestino, s.idCiudad FROM clipp.encomienda e LEFT JOIN clipp.sucursal s ON s.idSucursal=e.idSucursal LEFT JOIN clipp.direccion d ON d.idDireccion = e.idDireccionDestino WHERE e.idEncomienda = ? LIMIT 1;";
const SQL_REGISTRAR_ID_SOLICITUD ="INSERT INTO " + _BD_ + ".encomienda_solicitud (idEncomienda, idSolicitud, idSucursal, idUsuario, idClienteKtaxi, idAplicacion) VALUES(?, ?, ?, ?, ?, ?);";    
const SQL_OBTENER_SERVICIO_ACTIVO ="SELECT IFNULL(idServicioActivo, 0) as idServicioActivo, IFNULL(idCaracteristica, 0) as idCaracteristica  FROM " + _BD_ + ".transportePedido_servicioActivo WHERE idtransportePedido = ? AND idCiudadClipp = ? LIMIT 1;"

var ESTADO_CLIPER=3;
function escuchaPricipalEncomienda(response) {
//    console.log('0 Respuesta del escucha ENCOMIENDA');
//    console.log("ENCOMIENDAS CLIPP:",response);
    var respuesta = JSON.parse(JSON.stringify(response))
    if (respuesta['datosSolicitud'] != null) {
        //console.log('1 Respuesta del escucha');
        let datosSolicitud = respuesta['datosSolicitud']
        cnf.ejecutarResSQL(SQL_SELECT_SOLICTUD, [datosSolicitud['idSolicitud']], function (solicitud) {
            //console.log('2 Respuesta del escucha');
            if (solicitud.length > 0) {
//                console.log('ESTADOS KTAXI:'+datosSolicitud['estado']);
                switch (datosSolicitud['estado']) {
                    case 4:
                        console.log("Estado 4 KTAXI ENCOMIENDA");
                        cnf.ejecutarResSQL(SQL_VERIFICAR_ESTADO_SOLICITUD, [datosSolicitud['idSolicitud'],datosSolicitud['estado']], function (estadoSolicitud) {
                            if (estadoSolicitud.length <= 0)
                                cnf.ejecutarResSQL(SQL_UPDATE_SOLICITUD, [respuesta['username'], datosSolicitud['idVehiculo'], datosSolicitud['nombres'], datosSolicitud['apellidos'], datosSolicitud['idEmpresa'], datosSolicitud['placa'], datosSolicitud['telefono'], datosSolicitud['imagen'], datosSolicitud['tiempo'], datosSolicitud['estado'], datosSolicitud['idSolicitud']], function (solicitudUpdate) {
                                    if (solicitudUpdate['affectedRows'] > 0) {
                                        //console.log('6 Respuesta del escucha');
                                        let metadata = {
                                            "idSolicitud": datosSolicitud['idSolicitud'],
                                            "idVehiculo": datosSolicitud['idVehiculo']
                                        }
//                                        console.log("ESTADO 4 SOLICTUD KTAXI");
                                        SOCKET_CLIENTE_KTAXI.emit("confirmar_tiempo", respuesta['username'], metadata, function (tiempo) {
                                            cnf.ejecutarResSQL(SQl_ESTADO_ENCOMIENDA_SIGUIENTE, [solicitud[0].idEncomienda], function (estadoActual) {
                                                if (estadoActual.length > 0){
                                                    console.log("Estado ENCOMIENDA: ",estadoActual[0]);
                                                    cnf.ejecutarResSQL(SQL_INSERT_ENCOMIENDA_ESTDO, [estadoActual[0].estadoSiguiente, solicitud[0].idEncomienda, solicitud[0].idUsuario, solicitud[0].idAplicacion, 1], function (nuevoEstado) {
                                                        if (nuevoEstado['affectedRows'] > 0) {
                                                            cnf.ejecutarResSQL(SQL_UPDATE_ENCOMIENDA_ESTADO, [estadoActual[0].estadoSiguiente, solicitud[0].idEncomienda], function (updateEncomienda) {
                                                                if (updateEncomienda['affectedRows'] > 0)
                                                                    emitEstadoEncomienda(solicitud[0].idEncomienda, estadoActual[0].estadoSiguiente);
                                                                    enviarDatosEcnomiendaConductor(solicitud[0].idEncomienda, datosSolicitud['idSolicitud']);
                                                                });

                                                        }else{
                                                            console.log('En este momento no se puede realizar su encomienda, intente nuevamente más tarde.');
                                                        }
                                                    });
                                                }else
                                                    console.log("No se encontro la encomienda:"+solicitud[0].idEncomienda);
                                            });
                                        });
                                    } else {
                                        console.log('pedidoSolicitud NO Actualizado')
                                    }
                                });
                            else
                                console.log("ya esta registrado el evento")
                        });
                        break
                    case 7:
                        console.log("Estado 7 KTAXI ENCOMIENDA");
                        cnf.ejecutarResSQL(SQl_ESTADO_CANCELAR_CLIPPER, [solicitud[0].idEncomienda], function (estadoActualCalelar) {
                            console.log(estadoActualCalelar.length);
                            if (estadoActualCalelar.length > 0){
                                console.log("ESTADO SIG CANCELAR: "+estadoActualCalelar[0]);
                                cnf.ejecutarResSQL(SQL_INSERT_ENCOMIENDA_ESTDO, [estadoActualCalelar[0].estadoSiguiente, solicitud[0].idEncomienda, solicitud[0].idUsuario, solicitud[0].idAplicacion, 1], function (nuevoEstado) {
                                    if (nuevoEstado['affectedRows'] > 0) {
                                        cnf.ejecutarResSQL(SQL_UPDATE_SOLICITUD_CANCELADO, [datosSolicitud['estado'], datosSolicitud['idSolicitud']], function (solicitudCancelada) {
                                            if (solicitudCancelada['affectedRows'] > 0)
                                                cnf.ejecutarResSQL(SQL_UPDATE_ENCOMIENDA_ESTADO, [estadoActualCalelar[0].estadoSiguiente, solicitud[0].idEncomienda], function (updateEncomienda) {
                                                    if (updateEncomienda['affectedRows'] > 0){
                                                        emitEstadoEncomienda(solicitud[0].idEncomienda, estadoActualCalelar[0].estadoSiguiente);
                                                    }
                                                });
                                        });
                                    }else{
                                        console.log('En este momento no se puede realizar su encomienda, intente nuevamente más tarde.');
                                    }
                                });
                            }
                        });
                        break
                    case 9:
                        console.log("Estado 9 KTAXI ENCOMIENDA");
                        break
                }
            } else {
                //El pedido no esta ligado a ninguna solicitud
            }
        });
    } else {
        console.log('pedidoSolicitud 1')
    }
}

const SQL_SELECT_SOLICTUD="SELECT idEncomienda, idSolicitud, idSucursal, idUsuario, idClienteKtaxi, fecha_registro, idAplicacion, username, idVehiculo, nombres, apellidos, idEmpresa, placa, telefono, imagen, tiempo, estadoKtaxi FROM clipp.encomienda_solicitud ps WHERE ps.idSolicitud = ?;";
const SQL_UPDATE_SOLICITUD = "UPDATE clipp.encomienda_solicitud ps SET ps.username = ?, ps.idVehiculo = ?, nombres = ?, apellidos = ?, idEmpresa = ?, placa = ?, telefono = ?, imagen = ?, tiempo = ?, estadoKtaxi = ? WHERE idSolicitud = ?;";
const SQL_UPDATE_SOLICITUD_CANCELADO = "UPDATE clipp.encomienda_solicitud ps SET ps.estadoKtaxi = ? WHERE ps.idSolicitud = ?;";
const SQl_ESTADO_ENCOMIENDA_SIGUIENTE="SELECT en.estadoSiguiente FROM clipp.encomienda e INNER JOIN clipp.estadoEncomienda en ON en.estado=e.idEstado WHERE e.idEncomienda = ?; ";
const SQl_ESTADO_CANCELAR_CLIPPER="SELECT en.sigCancelableClipper AS estadoSiguiente  FROM clipp.encomienda e INNER JOIN clipp.estadoEncomienda en ON en.estado=e.idEstado WHERE e.idEncomienda = ? AND en.sigCancelableClipper IS NOT NULL;";
const SQL_UPDATE_ENCOMIENDA_ESTADO="UPDATE clipp.encomienda SET idEstado = ? WHERE idEncomienda = ?;";
const SQL_VERIFICAR_ESTADO_SOLICITUD="SELECT idSolicitud FROM clipp.encomienda_solicitud WHERE idSolicitud=? AND estadoKtaxi=?";


const ESTADO_CLIPPER_ASIGANADO=2;
const INDETIFICATIVO_SOLICITAR_COMPRA=5;
var INDETIFICATIVO_CANCELAR=6;
function registrarNuevoEstado(socket, data, ack) {
//    console.log("Registrar nuevo estado ENCOMIENDA: ",data);
    if (!data.idEncomienda)
        return ack({ en: -1, param: 'Parameter missing code 1' })
    if (!data.estado)
        return ack({ en: -1, param: 'Parameter missing code 2' })
    if (!data.idUsuario)
        return ack({ en: -1, param: 'Parameter missing code 3' })
    if (!data.idAplicativo)
        return ack({ en: -1, param: 'Parameter missing code 4' })
    if (!data.idPlataforma)
        return ack({ en: -1, param: 'Parameter missing code 5' })
    if (!data.identificativo)
        return ack({ en: -1, param: 'Parameter missing code 6' })
    
    if (data.identificativo==3){
        if (!data.idUsuario)
            return ack({ en: -1, param: 'Parameter missing code 1' })
        if (!data.calificacion)
            return ack({ en: -1, param: 'Parameter missing code 2' })
        if (!data.idAplicativo)
            return ack({ en: -1, param: 'Parameter missing code 4' })
        if (!data.idPlataforma)
            return ack({ en: -1, param: 'Parameter missing code 5' })
    }
    
    cnf.ejecutarResSQL(SQL_SELECT_ESTADO_ENCOMIENDA_ESTADO, [data.idEncomienda, data.estado], function (estadoEncomienda) {
        if(estadoEncomienda.length>0)
            emitEstadoEncomienda(data.idEncomienda, data.estado);
                
        cnf.ejecutarResSQL(SQL_INSERT_ENCOMIENDA_ESTDO, [data.estado, data.idEncomienda, data.idUsuario, data.idAplicativo, data.idPlataforma], function (nuevoEstado) {
            if (nuevoEstado['affectedRows'] > 0) {
                cnf.ejecutarResSQL(SQL_UPDATE_ENCOMIENDA_ESTADO, [data.estado, data.idEncomienda], function (updateEncomienda) {
                    if (updateEncomienda['affectedRows'] > 0){
                        emitEstadoEncomienda(data.idEncomienda, data.estado);
//                        console.log("IDENTIFICATIVO ENCOMIENDA:"+data.identificativo);
                        if(data.identificativo==2){
                            enviarEncomiendaClipper(data.idEncomienda); 
                            return ack({en:1, m:'Estado registrada correctamente' })
                        }else if(data.identificativo==3){
                            registrarCalificacion(data.idEncomienda, ack, data);
                        }else if(data.identificativo==5){
                            cnf.ejecutarResSQL(SQL_SELECT_ENCOMIENDA_INDETIFICADO, [data.idEncomienda, INDETIFICATIVO_SOLICITAR_COMPRA], function (encomiendas) {
//                                console.log("Se esta solicitando un clipper");
                                if (encomiendas.length > 0)
                                    solicitarDespachoClipperEncomienda(data.idEncomienda,encomiendas[0], function(resul){
                                        console.log(resul);
                                        return ack({en:1, m:'Estado registrada correctamente' })
                                    });
                           });
                        }else if(data.identificativo==INDETIFICATIVO_CANCELAR){//cancelar carrera
//                            console.log("Se esta cancelando la solicitud");
                            cancelarSolicitudEncomiendaTaxi(data.idEncomienda);
                        }else{
                            return ack({en:1, m:'Estado registrada correctamente' })
                        }
                    }
                });
            }else
                return ack({en:-1, m:'En este momento no se puede realizar su encomienda, intente nuevamente más tarde.' })
        });
    });
}

const SQL_SELECT_ESTADO_ENCOMIENDA_ESTADO="SELECT ee.estado FROM clipp.encomienda_estadoEncomienda en INNER JOIN clipp.estadoEncomienda ee ON ee.estado=en.estado WHERE en.idEncomienda=? AND en.estado=? AND ee.isDuplicar=0";

const SQL_SELECT_ESTADO_ENCOMIENDA="SELECT ee.estado, ee.identificativo FROM clipp.encomienda e INNER JOIN clipp.estadoEncomienda ee ON ee.estado=e.idEstado WHERE e.idEncomienda = ?;";

function obtenerEstadoEncomienda(socket, data, ack) {
            
    cnf.ejecutarResSQL(SQL_SELECT_ENCOMIENDA_ESTADO, [data.idEncomienda], function (estadoEncomienda) {
        if(estadoEncomienda.length<=0)
            return ack({en:-1, m:'No se encontra el estado de la encomienda.' })
        
        cnf.ejecutarResSQL(SQL_SELECT_DATOS_SOLICITUD, [data.idEncomienda], function (solictudes) {
            var solicitud={};
            if(solictudes.length>0)
                solicitud=solictudes[0];
            
            ack({en:1, idEncomienda:data.idEncomienda, estado:estadoEncomienda[0], solicitud:solicitud});
        });
    });
        
}

const SQL_SELECT_ENCOMIENDA_ESTADO="SELECT estado, orden, titulo, descripcion, color, isCancelable, icon, estadoSiguiente, tituloSiguenteEstado, isCancelableSigueinte, muestraSigEstado, sigCancelable, e.identificativo FROM clipp.encomienda en INNER JOIN clipp.estadoEncomienda e ON  e.estado=en.idEstado WHERE en.idEncomienda = ?;";
const SQL_SELECT_ENCOMIENDA_INDETIFICADO="SELECT e.idEncomienda, e.idUsuario, e.idAplicativo, e.idPlataforma, e.idSucursal, e.idDireccionOrigen, e.idDireccionDestino, e.idContacto, e.idEstado, e.idTipoTransporte, e.costoEnvio, e.costoPaquete, e.distancia, e.tiempo, e.calles, e.referencia, e.observacion, e.fechaRegistro, e.marca, e.modelo, e.imei, e.version_clipp AS vs, e.version_so AS so, e.idFormaPago FROM clipp.encomienda e INNER JOIN clipp.estadoEncomienda ee ON ee.estado=e.idEstado WHERE e.idEncomienda=? AND ee.identificativo=?;";
const SQL_SELECT_ENCOMIENDA="SELECT e.idEncomienda, e.idUsuario, e.idAplicativo, e.idPlataforma, e.idSucursal, e.idDireccionOrigen, e.idDireccionDestino, e.idContacto, e.idEstado, e.idTipoTransporte, e.costoEnvio, e.costoPaquete, e.distancia, e.tiempo, e.calles, e.referencia, e.observacion, e.fechaRegistro, e.marca, e.modelo, e.imei, e.version_clipp AS vs, e.version_so AS so, e.idFormaPago FROM clipp.encomienda e WHERE e.idEncomienda=?";

function emitEstadoEncomienda(idEncomienda, estado){
    cnf.ejecutarResSQL(SQL_SELECT_ENCOMIENDA, [idEncomienda], function (encomienda) {
        if(encomienda.length<=0)
            return;
        cnf.ejecutarResSQL(SQL_SELECT_DATOS_SOLICITUD, [idEncomienda], function (solictudes) {
            var solicitud={};
            if(solictudes.length>0)
                solicitud=solictudes[0];
            
            cnf.ejecutarResSQL(SQL_SELECT_ESTADO, [estado], function (siguienteEstado) { 
                if (siguienteEstado.length > 0){
                    notificarSucursalAdministrador(idEncomienda, encomienda[0].idSucursal, "actualizar_estado_encomienda", siguienteEstado[0], solicitud);
                    if(siguienteEstado[0].isNotificarWhatsApp==1)
                        notificarWPEstado(idEncomienda);
                }
            });
        });
    });
    
}
const SQL_SELECT_ESTADO="SELECT e.estado, e.orden, e.titulo, e.descripcion, e.color, e.isCancelable, e.icon, e.estadoSiguiente, e.tituloSiguenteEstado, e.isCancelableSigueinte, e.muestraSigEstado, e.sigCancelable, e.identificativo, IF(e.isNotificarWhatsApp=1,1,0) AS isNotificarWhatsApp  FROM clipp.estadoEncomienda e WHERE e.estado = ?;";
const SQL_SELECT_DATOS_SOLICITUD="SELECT es.idSolicitud, es.idClienteKtaxi, es.username, es.idVehiculo, es.nombres, es.apellidos, es.idEmpresa, es.placa, es.telefono, es.imagen, es.tiempo FROM clipp.encomienda_solicitud es WHERE es.idEncomienda = ? AND es.estadoKtaxi=4 ORDER BY es.fecha_registro DESC LIMIT 1";

function notificarWPEstado(idEncomienda){
    cnf.ejecutarResSQL(SQL_SELECT_NOTIFICAR_WP_ESTADO, [idEncomienda], function (encomienda) { 
        if (encomienda.length > 0){
            cnf.ejecutarResSQL(SQL_INFO_CLIPPER_ENCOMIENDA, [idEncomienda], function (solicitudes) {
                var titulo=encomienda[0].sucursal+' - ENCOMIENDA - '+encomienda[0].titulo+" - "+encomienda[0].ciudad;
                var data = [
                    { clave: "Cliente", valor: encomienda[0].sucursal},
                    { clave: "Estado", valor: encomienda[0].titulo},
                    { clave: "Fecha", valor: encomienda[0].fecha_registro },
                    { clave: "Descripción corta", valor: encomienda[0].descripcion},
                    { clave: "Siguiente Estado", valor: encomienda[0].tituloSiguenteEstado},
                    { clave: "Clipper", valor: (solicitudes[0]['nombres']!=null?(solicitudes[0]['nombres']+' '+solicitudes[0]['apellidos']+' wa.me/' + telefonoCodigoArea(encomienda[0]['codigoArea'], solicitudes[0]['telefono']+"") + '?text=Hola%20'+solicitudes[0]['nombres'].replace(" ",'%20')):"SN")}
                ];
                mensajes_wp.armarTextoWp(titulo, data, [GRUPO_DELIVERY_WP], "");
            })
        }
    });
}
var SQL_SELECT_NOTIFICAR_WP_ESTADO="SELECT s.sucursal, ciu.ciudad, ee.titulo, ee.descripcion, CONCAT(CONVERT_TZ(e.fechaRegistro,  'UTC', ciu.zonaHoraria), '') AS fecha_registro, IF(ee.tituloSiguenteEstado IS NOT NULL,ee.tituloSiguenteEstado,'') AS tituloSiguenteEstado, pa.codigoArea FROM clipp.encomienda e INNER JOIN clipp.sucursal s ON s.idSucursal=e.idSucursal INNER JOIN clipp.ciudad ciu ON ciu.idCiudad=s.idCiudad INNER JOIN clipp.pais pa ON pa.idPais=ciu.idPais INNER JOIN clipp.estadoEncomienda ee ON ee.estado=e.idEstado WHERE e.idEncomienda=?;";
var SQL_INFO_CLIPPER_ENCOMIENDA = 'SELECT es.idEncomienda, es.username, es.idVehiculo, es.nombres, es.apellidos, es.idEmpresa, es.placa, es.telefono, es.imagen, es.tiempo, es.idSolicitud FROM clipp.encomienda_solicitud es WHERE es.idEncomienda = ? ORDER BY es.fecha_registro DESC;'

function notificarSucursalAdministrador(idEncomienda, idSucursal, emit, siguienteEstado, solicitud){
    cnf.ejecutarResSQL(SQL_GET_CANAL_ADMINISTRADOR, [idSucursal, idSucursal], function (canales) {
        if (canales.length > 0) {
            canales.forEach(function (canal) {
//                firebase.enviarPushToAdministrador(canal.idAdministrador, pedido.estado, 'pedido :' + pedido.titulo + ', ' + pedido.nota + ' valor:' + pedido.costo, PUSH_TIPO_NUEVO_PEDIDO, pedido);
                EMIT_REDIS.to(canal['socketId']).emit(emit, {idEncomienda:idEncomienda, estado:siguienteEstado, solicitud:solicitud});
            });
        } else {
            console.log("No esta abierto el local");
        }
    });
}
var SQL_GET_CANAL_ADMINISTRADOR = 'SELECT aco.socketId, aco.idApp, aco.idPlataforma, aco.idAdministrador FROM clipp.administrador_sucursal asu INNER JOIN clipp.administradorConectado aco ON asu.idAdministrador = aco.idAdministrador INNER JOIN (SELECT * FROM clipp.administrador_sucursalActiva asa WHERE asa.fecha_registro = (SELECT max(fecha_registro) from clipp.administrador_sucursalActiva WHERE idAdministrador = asa.idAdministrador) AND asa. idSucursal = ?) as asa ON asu.idAdministrador = asa.idAdministrador WHERE asu.idSucursal = ?;'


function enviarEncomiendaClipper(idEncomienda){
    cnf.ejecutarSQLCallback(SQL_SELECT_DATOS_SOLICITUD, [idEncomienda], function (solicitudes) {
        if(solicitudes.length > 0){
            const params = {
                "idSolicitud": solicitudes[0]["idSolicitud"],
                "idVehiculo": solicitudes[0]["idVehiculo"]
            }
            SOCKET_CLIENTE_KTAXI.emit("abordar_vehiculo", solicitudes[0]["username"], params, function (respuesta) {
                console.log("enviarAbordoCliente ", respuesta);
            });
        }else{
            console.log("ERROR enviarAbordoCliente ");
        }
    })
    
}



function registrarCalificacion(idEncomienda, ack, data) {
    cnf.ejecutarResSQL(SQL_CALIFICACION, [idEncomienda], function (calificacion) {
        if (calificacion.length > 0) {
            return ack({ en: -1, m: 'Ya se ha realizado la calificación anteriormente' })
        } else {
            cnf.ejecutarResSQL(SQL_INSERT_CALIFICAR_ENCOMIENDA, [idEncomienda, data['idUsuario'], data['calificacion'], data['nota'], data['idAplicativo'], data['idPlataforma'], data['tags']], function (calificado) {
                if (calificado['insertId'] <= 0)
                    return ack({ en: -1, m: 'No se pudo realizar la calificación' })
                
                return ack({en:1, m:'Estado registrada correctamente' })
            })
        }
    })
}

var SQL_INSERT_CALIFICAR_ENCOMIENDA = 'INSERT INTO clipp.encomiendaCalificacion (idEcomienda, idUsuario, calificacion, nota, idAplicativo, idPlataforma, tags, fecha_registro) VALUES (?, ?, ?, ?, ?, ?, ?, NOW());';
var SQL_CALIFICACION='SELECT idEncomiendaCalificacion FROM clipp.encomiendaCalificacion WHERE idEcomienda = ?';


function escuchaChatConductorEncomienda(response, audio) {
    armarChatConductor(response.idSolicitud, response.message, audio);
}

var TIPO_PEDIDO_ENCOMIENDA=2;
const ID_APP_CLIPER = 7;
const ID_PLATAFORMA_ANDROID = 2;
const TIPO_MENSAJE_TEXTO = 1;
var TIPO_MENSAJE_AUDIO = 2;
function armarChatConductor(idSolicitud, mensaje, audio) {
    cnf.ejecutarSQLCallback(SQL_SELECT_SOLICITUD_ENCOMIENDA, [idSolicitud], function (solicitud) {
        //        console.log("Recibir chat conductor");
        if (solicitud.length > 0) {
            var mensajeJson = {};
            if (audio) {
                mensajeJson = {
                    idPedido: solicitud[0].idEncomienda,
                    fecha: solicitud[0].fecha,
                    hora: solicitud[0].hora,
                    mensaje: 'AUDIO',
                    tipo: TIPO_MENSAJE_AUDIO,
                    usuario: solicitud[0].nombres,
                    idAplicacion: ID_APP_CLIPER,
                    idPlataforma: ID_PLATAFORMA_ANDROID,
                    tipoPedido: TIPO_PEDIDO_ENCOMIENDA,
                    mostrar:1
                };
//                a_encomienda_chat.conductorEnviaAudio(mensajeJson, audio);
            } else if (mensaje) {
                mensajeJson = {
                    idPedido: solicitud[0].idEncomienda,
                    fecha: solicitud[0].fecha,
                    hora: solicitud[0].hora,
                    mensaje: mensaje,
                    tipo: TIPO_MENSAJE_TEXTO,
                    usuario: solicitud[0].nombres,
                    idAplicacion: ID_APP_CLIPER,
                    idPlataforma: ID_PLATAFORMA_ANDROID,
                    tipoPedido: TIPO_PEDIDO_ENCOMIENDA,
                    mostrar:1
                };
                a_encomienda_chat.conductorEnviaChatEncomienda(mensajeJson);
            } else {
                console.log("Mensaje no identificado:", mensaje);
            }

        }

    });
}

const SQL_SELECT_SOLICITUD_ENCOMIENDA = "SELECT idEncomienda, DATE(NOW()) AS fecha, TIME(NOW()) AS hora, nombres FROM clipp.encomienda_solicitud WHERE idSolicitud=?";

function enviarDatosEcnomiendaConductor(idEncomienda, idSolicitud) {
    cnf.ejecutarSQLCallback(SQL_SELECT_SOLICITUD_ENCOMIENDA_1, [idEncomienda, idSolicitud], function (solicitud) {
        if (solicitud.length <= 0)
            return console.log("No se encontro el cliete para el pedido: " + idEncomienda);

        var mensaje = 'Diríjase a -' + solicitud[0].sucursal + '- a recoger la encomienda, el valor que debe cancelar por la encomienda es de ' + solicitud[0].costoPaquete;
        SOCKET_CLIENTE_KTAXI.emit('cliente_envia_mensaje', idSolicitud, solicitud[0].username, mensaje, function (chat) {
            //console.log("CHAT CONDUCTOR ",chat);
        });
        var mensaje_1 = 'Para entregar la encomienda contactarse con el cliente '+solicitud[0].nombres+' al número +593' + solicitud[0].telefono.substr(-9);
        SOCKET_CLIENTE_KTAXI.emit('cliente_envia_mensaje', idSolicitud, solicitud[0].username, mensaje_1, function (chat) {
            //console.log("CHAT CONDUCTOR ",chat);
        });

    });
}

var SQL_SELECT_SOLICITUD_ENCOMIENDA_1 = "SELECT IF(c.nombres IS NOT NULL,c.nombres,'') AS nombres, IF(c.telefono IS NOT NULL,c.telefono,'') AS telefono, e.costoEnvio, e.costoPaquete,  es.username, es.idEncomienda, s.sucursal FROM clipp.encomienda e LEFT JOIN clipp.contactoEncomienda c ON c.idcontactoEncomienda=e.idContacto INNER JOIN clipp.encomienda_solicitud es ON es.idEncomienda=e.idEncomienda INNER JOIN clipp.sucursal s ON s.idSucursal=e.idSucursal WHERE e.idEncomienda = ? AND es.idSolicitud = ?;";

const SQL_SOLICITUD_ENCOMIENDA_PROCESO="SELECT idSolicitud, idVehiculo, IF(username IS NOT NULL,username,'') AS username FROM clipp.encomienda_solicitud WHERE idEncomienda=? ORDER BY fecha_registro DESC LIMIT 1";

function cancelarSolicitudEncomiendaTaxi(idEncomienda) {
    cnf.ejecutarSQLCallback(SQL_SOLICITUD_ENCOMIENDA_PROCESO, [idEncomienda], function (solicitud) {
        if(solicitud.length>0){
            let params = {
                "idSolicitud": solicitud[0].idSolicitud,
                "razon": 4,
                "observacion": 'El tiempo de espera de la solicitud ha caducado',
                "idVehiculo": solicitud[0].idVehiculo
            }
            SOCKET_CLIENTE_KTAXI.emit("cancelar_carrera", solicitud[0].username, params, function (data) {
                cnf.ejecutarResSQL(SQL_UPDATE_ESTADO_KTAXI, [7, solicitud[0].idSolicitud], function (estadoKtaxi) {
                    if (estadoKtaxi['affectedRows'] > 0)
                        console.log("La solicitud fue cancelada:" + solicitud[0].idSolicitud);
                });
            })
        }
    });
    
}
var SQL_UPDATE_ESTADO_KTAXI = 'UPDATE clipp.encomienda_solicitud es SET es.estadoKtaxi = ? WHERE es.idSolicitud = ?;'


function notificarWPEncomiendas(idEncomienda){
    cnf.ejecutarResSQL(SQL_ENCOMIEDA_INFO, [idEncomienda], function (encomienda) {
        if (encomienda.length > 0) {
            
            var cont = 1
            var codC = (encomienda[0]['codigoArea'] ? encomienda[0]['codigoArea'].replace("+", "") : '');
            var celularCliente = codC + encomienda[0]['contactoCliente'];
            if (encomienda[0]['codigoArea'] == '+593') {
                celularCliente = codC + encomienda[0]['contactoCliente'].substr(1);
            }

//            var cod = pedido[0]['codigoArea'].replace("+", "");
//            var numSucursal = cod + pedido[0]['contacto'];
//            if (pedido[0]['codigoArea'] == '+593') {
//                numSucursal = cod + pedido[0]['contacto'].substr(1);
//            }
            var titulo = 'NUEVA ENCOMIENDA - ' + encomienda[0]['sucursal'] + ' - ' + encomienda[0]['ciudad'];
            var data = [
                {clave: "Origen", valor: '_'},
                {clave: "Cliente ", valor: encomienda[0]['sucursal']},
                {clave: "Celular", valor: encomienda[0]['contactoCliente']},
                {clave: "Dirección", valor: encomienda[0]['direccionOrigen']+'\n'},
                {clave: "Destino", valor: '_'},
                {clave: "Nombre", valor: encomienda[0]['nombreDestino']},
                {clave: "Contacto", valor: encomienda[0]['telefonoDestino']},
                {clave: "Dirección", valor: encomienda[0]['direccionDestino']},
                {clave: "Referencia", valor: encomienda[0]['referenciaDestino']+'\n'},
                {clave: "Datos de la Encomienda", valor: '_'},
                {clave: "Estado", valor: encomienda[0]['estado']},
                {clave: "Forma de pago", valor: encomienda[0]['forma']},
                {clave: "Whatsapp del Cliente", valor: 'wa.me/' + celularCliente + '?text=Hola'},
                {clave: "Ver en el mapa", valor: 'https://www.google.com/maps/dir/' + encomienda[0]['latitudS'] + ',' + encomienda[0]['longitudS'] + '/' + encomienda[0]['latitudD'] + ',' + encomienda[0]['longitudD']},
                {clave: "Observació", valor: encomienda[0]['observacion']+'\n'},
                {clave: "Costo Paquete", valor: encomienda[0]['costoPaquete']},
                {clave: "Costo Envio", valor: encomienda[0]['costoEnvio']}
            ];
            var textoAdicionalWP = "";
            var numerosDestino = [GRUPO_DELIVERY_WP];
            mensajes_wp.armarTextoWp(titulo, data, numerosDestino, textoAdicionalWP);
        } else {
            console.log('No se ha pudo obtener la encomienda para wp' + idEncomienda)
        }
    });
}

var SQL_ENCOMIEDA_INFO="SELECT s.sucursal, ciu.ciudad, s.contacto AS contactoCliente, p.codigoArea, IF(ce.nombres is not null,ce.nombres,'') AS nombreDestino, IF(ce.telefono is not null,ce.telefono,'') AS telefonoDestino, CONCAT(CONVERT_TZ(e.fechaRegistro,  'UTC', ciu.zonaHoraria), '') AS fecha_registro, CONCAT(s.callePrincipal,' ',s.calleSecundaria) AS direccionOrigen, IF(d.direccion IS NOT NULL,d.direccion,'' ) AS direccionDestino, IF(d.referencia IS NOT NULL,d.referencia,'' ) AS referenciaDestino, ee.titulo AS estado, fp.forma, s.latitud AS latitudS, s.longitud AS longitudS, e.observacion, e.costoPaquete, e.costoEnvio,  IF(d.latitud IS NOT NULL, d.latitud,'') AS latitudD, IF(d.longitud IS NOT NULL, d.longitud,'') AS longitudD FROM clipp.encomienda e INNER JOIN clipp.sucursal s ON s.idSucursal=e.idSucursal LEFT JOIN clipp.contactoEncomienda ce ON ce.idContactoEncomienda=e.idContacto INNER JOIN clipp.ciudad ciu ON ciu.idCiudad=s.idCiudad LEFT JOIN clipp.direccion d ON d.idDireccion=e.idDireccionDestino INNER JOIN clipp.estadoEncomienda ee ON ee.estado=e.idEstado INNER JOIN clipp.formaPago fp ON fp.idFormaPago=e.idFormaPago INNER JOIN clipp.pais p ON p.idPais=ciu.idPais WHERE e.idEncomienda=?";

function telefonoCodigoArea(codigoArea, numeroContacto){
    var cod = codigoArea.replace("+", "");
    var contactoCodigoArea = cod + numeroContacto;
    if (codigoArea == '+593') {
        contactoCodigoArea = cod + numeroContacto.substr(1);
    }
    return contactoCodigoArea;
}

module.exports = {
    nuevoEncomienda: nuevoEncomienda,
    obtenerEstadoEncomienda: obtenerEstadoEncomienda,
    escuchaPricipalEncomienda: escuchaPricipalEncomienda,
    registrarNuevoEstado: registrarNuevoEstado,
    escuchaChatConductorEncomienda: escuchaChatConductorEncomienda,
//    reconctarDispositivosEncomienda: reconctarDispositivosEncomienda,
};