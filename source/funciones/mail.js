/* global PORT_SERVER_HTTP, DOMINIO_SERVER, IS_DESARROLLO, MOMENT, DOMINIO_SERVER, DOMINIO_SERVIDOR_WEB */
var administrador = require('./administrador_functions');
//const mailjet = require('node-mailjet').connect('f3c041be65d8e1ed573475cd27c20ec5', '3aa58ff3682dc741230eee298804b8bc');
const mailjet = require('node-mailjet').connect('6a09cf744d29a693c8318c288a099be7', 'dd312d3b56b8886d79217fe0125011e6');
var nodemailer = require('nodemailer');
var urImg = DOMINIO_SERVER;

var mail_clipp = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'clipp@kradac.com',
        pass: "ZnEIdF4VZd%G3loXFAI%"
    }
});

var encabezadoClipp =
    '<!DOCTYPE html> <html> <head> ' +
    '<style type="text/css"> body{ margin:0; padding:0; } .imagenencabezado {width: 100%; } img {max-width: 100%; height: auto; } table {font-family: arial, sans-serif; border-collapse: collapse; width: 100%; } td, th {border: 1px solid #dddddd; text-align: left; padding: 8px; } tr:nth-child(even) {background-color: #dddddd; } .imagenencabezado {width: 100%; }</style> ' +
    '</head><body>';

var pieClipp =
    '<br><br><br>' +
    '<center>' +
    '<a style="margin-left: 10px" href="https://twitter.com/ClippMov"><img src="' + urImg + 'clipp/t.png"" width="18"></a>' +
    '<a style="margin-left: 10px" href="https://www.facebook.com/ClippMaaS/"><img src="' + urImg + 'clipp/f.png" width="18"></a>' +
    '<a style="margin-left: 10px" href="https://www.clipp.eco/"><img src="' + urImg + 'clipp/w.png" width="18"></a>' +
    '<hr color="blue"/> ' +
    '<p style="font-size: 10px"> ' +
    '<br> Si usted no ha realizado este proceso comuníquese inmediatamente con nosotros. ' +
    '<br> Copyright © 2020 | Clipp. Loja-Ecuador, Todos los derechos reservados. ' +
    '<br> Powered by ' +
    '<br> KRADAC' +
    '<br> <a href="https://www.clipp.eco/">www.clipp.eco</a> </p> ';

var encabezadoPuntuall =
    '<!DOCTYPE html> <html> <head> ' +
    '<style type="text/css"> body{ margin:0; padding:0; } .imagenencabezado {width: 100%; } img {max-width: 100%; height: auto; } table {font-family: arial, sans-serif; border-collapse: collapse; width: 100%; } td, th {border: 1px solid #dddddd; text-align: left; padding: 8px; } tr:nth-child(even) {background-color: #dddddd; } .imagenencabezado {width: 100%; }</style> ' +
    '</head><body>';

var piePuntuall =
    '<br><br><br>' +
    '<center>' +
    '<a style="margin-left: 10px" href="https://twitter.com/FundacionCaje?s=09"><img src="' + urImg + 'puntuall/t.png"" width="18"></a>' +
    '<a style="margin-left: 10px" href="https://www.facebook.com/funcaje/"><img src="' + urImg + 'puntuall/f.png" width="18"></a>' +
    '<a style="margin-left: 10px" href="http://fundacioncaje.org/"><img src="' + urImg + 'puntuall/w.png" width="18"></a>' +
    '<hr color="blue"/> ' +
    '<p style="font-size: 10px"> ' +
    '<br> Si usted no ha realizado este proceso comuníquese inmediatamente con nosotros. ' +
    '<br> Copyright © 2020 | puntuall. Loja-Ecuador, Todos los derechos reservados. ' +
    '<br> Powered by ' +
    '<br> KRADAC' +
    '<br> <a href="http://fundacioncaje.org/">www.fundacioncaje.org</a> </p> ';


function elegirMail(idAplicativo, calback) {
    switch (parseInt(idAplicativo)) {
        case ID_APLICATIVO_CLIPP:
            json = {
                FromJET: {
                    "Email": "clipp@kradac.com",
                    "Name": "Clipp"
                },
                url: urImg + 'clipp/',
                mail: mail_clipp,
                nombre: 'Clipp, Delivery y Movilidad en tus manos',
                from: 'CLIPP <clipp@kradac.com>',
                to: 'Bruno Valarezo<bmvalarezo@gmail.com>',
                bcc: 'Bruno Valarezo <bmvalarezo@gmail.com>>',
                br: '<hr color="blue"/>',
                encabezado: encabezadoClipp,
                pie: pieClipp,
                saludoCliente: 'Estimado cliente somos del APP CLIPP, ',
                saludoUsuario: 'Estimado asistente somos del AP CLIPP, '
            };
            return calback(json);
        case ID_APLICATIVO_PUNTUALL:
            json = {
                FromJET: {
                    "Email": "puntuall@kradac.com",
                    "Name": "Puntuall"
                },
                url: urImg + 'puntuall/',
                mail: mail_clipp,
                nombre: '¡Sé tú mismo el observador de la puntualidad!',
                from: 'PUNTUALL <puntuall@kradac.com>',
                to: 'Bruno Valarezo<bmvalarezo@gmail.com>',
                bcc: 'Bruno Valarezo <bmvalarezo@gmail.com>',
                br: '<hr color="blue"/>',
                encabezado: encabezadoPuntuall,
                pie: piePuntuall,
                saludoCliente: '¡Hola estimado cliente! Somos Puntuall App, ',
                saludoUsuario: 'Estimado usuario, somos Puntuall App, '
            };
            return calback(json);
        default:
            json = {
                FromJET: {
                    "Email": "clipp@kradac.com",
                    "Name": "Clipp"
                },
                url: urImg + 'clipp/',
                mail: mail_clipp,
                nombre: 'CLIPP',
                from: 'CLIPP <clipp@kradac.com>',
                to: 'Bruno Valarezo<bmvalarezo@gmail.com>',
                bcc: 'Bruno Valarezo <bmvalarezo@gmail.com>',
                br: '<hr color="blue"/>',
                encabezado: encabezadoClipp,
                pie: pieClipp,
                saludoCliente: 'Estimado cliente somos del APP CLIPP, ',
                saludoUsuario: 'Estimado asistente somos del AP CLIPP, '
            };
            return calback(json);
    }
}

module.exports = {
    enviarMailContrasenia: enviarMailContrasenia,
    enviarMailBienbenida: enviarMailBienbenida,
    enviarMailGenerico: enviarMailGenerico,
    pedidoFinalizado: pedidoFinalizado
};

function enviarMailGenerico(idAplicativo, to, asunto, valores) {
    var AMBIENTE_DESARROLLO = '';
    if (IS_DESARROLLO) {
        AMBIENTE_DESARROLLO =
            '<tr><td>Ambiente: </td> <td style="font-weight: bold;">Desarrollo</td></tr>';
    }
    let html = '';
    for (var i = 0; i < valores.length; i++) {
        html = html +
            '<tr>' +
            '<td>' + valores[i]['clave'] + ': </td>' +
            '<td style="font-weight: bold;">' + valores[i]['valor'] + '</td>' +
            '</tr>';
    }

    var FECHA = MOMENT().tz('America/Guayaquil').format().replace(/T/, ' ').replace(/\..+/, '').substring(0, 19);
    elegirMail(idAplicativo, function (mailEnvio) {
        mailEnvio['mail'].sendMail({
            from: mailEnvio['from'],
            to: to,
            subject: asunto,
            html: mailEnvio['encabezado']

                +
                '<img class="imagenencabezado" src="' + mailEnvio['url'] + 'KTAXI.png">'

                +
                '<table style="width: 100%">' +
                AMBIENTE_DESARROLLO

                +
                html

                +
                '<tr>' +
                '<td>Fecha: </td>' +
                '<td style="font-weight: bold;">' + FECHA + '</td>' +
                '</tr>' +
                '</table>'

                +
                mailEnvio['pie']

                +
                '</body> </html>'
        }, function () {});
    });
}

function enviarMailContrasenia(idAplicativo, name, to, pass) {
    var AMBIENTE_DESARROLLO = '';
    if (IS_DESARROLLO) {
        AMBIENTE_DESARROLLO =
            '<tr><td>Ambiente: </td> <td style="font-weight: bold;">Desarrollo</td></tr>';
    }
    elegirMail(idAplicativo, function (mailEnvio) {
        var asunto = 'Recuperación contraseña ' + mailEnvio['nombre'];
        var html = mailEnvio['encabezado']

            +
            '<img class="imagenencabezado" src="' + mailEnvio['url'] + 'KTAXI.png">'

            +
            '<center><h3>' +
            'Saludos ' + name + ' se ha realizado un cambio de contraseña en su cuenta ' +
            mailEnvio['nombre'] +
            '. Recuerda, puedes ingresar con tu número de celular o correo.' +
            '</h3></center>'

            +
            '<table style="width: 100%">' +
            AMBIENTE_DESARROLLO +
            '<tr>' +
            '<td>Contraseña temporal: </td>' +
            '<td style="font-weight: bold;">' + pass + '</td>' +
            '</tr>' +
            '</table>'

            +
            mailEnvio['pie']

            +
            '</body> </html>';
        if (mailEnvio['FromJET']) {
            var To = [{
                "Email": to,
                "Name": name
            }];
            var Bcc = [{
                "Email": "<bmvalarezo@gmail.com>",
                "Name": "Bruno Valarezo"
            }];
            /* var Bcc = [{
                "Email": "<ricardojh05@gmail.com>",
                "Name": "Ricardo"
            }]; */
            return enviarMailJet(asunto, html, mailEnvio['FromJET'], To, Bcc);
            //return enviarMailJet(asunto, html, mailEnvio['FromJET'], To);
        }
        mailEnvio['mail'].sendMail({
            from: mailEnvio['from'],
            to: name + ' <' + to + '>',
            bcc: mailEnvio['bcc'],
            subject: asunto,
            html: html
        }, function () {});
    });
}


function enviarMailBienbenida(idAplicativo, idCliente, name, to, url) {
    var AMBIENTE_DESARROLLO = '';
    if (IS_DESARROLLO) {
        AMBIENTE_DESARROLLO =
            '[DES]';
    }
    obtenerUrlCarpeta(idAplicativo, idCliente, url, function (link) {
        elegirMail(idAplicativo, function (mailEnvio) {
            var asunto = AMBIENTE_DESARROLLO +'Bienvenido a ' + mailEnvio['nombre'];
            if (ID_APLICATIVO_CLIPP == idAplicativo) {
                var html = mailEnvio['encabezado'] +
                    '<center>' +
                    '<img src="' + mailEnvio['url'] + 'BIENVENIDO.png">'

                    +
                    mailEnvio['br']

                    +
                    '<p>Hola <strong>' + name + ' </strong>'

                    +
                    ' Gracias por unirte a la comunidad Clipp Delivery.</p>'

                    +
                    '<center>'

                    +
                    '<p>Diferentes opciones de movilidad, delivery y compra de servicios como rent a car y boletos de viaje, todo en una sola app. </p>'

                    +
                    '<p>Mantente informado de nuestras promociones y servicios actualizando tus datos. </p>'

                    +
                    '<p><strong¡Gracias por apoyar a empresas 100% ecuatorianas!</strong> </p>' +
                    '<br>'

                    +
                    '<br>' +
                    '<br>' +
                    '<hr color="blue" /> '


                    +
                    '<img src="' + mailEnvio['url'] + 'PIE.png">'

                    +
                    mailEnvio['pie']

                    +
                    '</body> </html>';

            } else {

                var html = mailEnvio['encabezado'] +
                    '<center>' +
                    '<img src="' + mailEnvio['url'] + 'BIENVENIDO.png">'

                    +
                    mailEnvio['br']

                    +
                    '<p>Hola <strong>' + name + ' </strong>'

                    +
                    ' ¡Gracias por unirte a Puntuall App!</p>'

                    +
                    '<center>'

                    +
                    '<p>Nos alegra que te unas al equipo Puntuall para vigilar la puntualidad, ser puntual es respetar el tiempo de los demás. </p>'

                    +
                    '<p>Una iniciativa de Fundación Caje con el aporte tecnológico de Kradac. </p>'

                    +
                    '<p><strong>Para mantenerte al día con nuestras novedades, soporte técnico y promociones recuerda siempre mantener actualizado tus datos personales.</strong> </p>' +
                    '<br>'

                    +
                    '<p><strong>¡Vamos a verificar la puntualidad!</strong> </p>' +
                    '<br>'

                    +
                    '<br>' +
                    '<br>' +
                    '<hr color="blue" /> '


                    +
                    '<img src="' + mailEnvio['url'] + 'PIE.png">'

                    +
                    mailEnvio['pie']

                    +
                    '</body> </html>';
            }

            if (mailEnvio['FromJET']) {
                var To = [{
                    "Email": to,
                    "Name": name
                }];
                /* var Bcc = [{
                    "Email": "<ricardojh05@gmail.com>",
                    "Name": "Ricardo"
                }]; */
                /* var Cc = [{
                    "Email": "<bmvalarezo@gmail.com>",
                    "Name": "Bruno Valarezo"
                }]; */
                var Bcc = [{
                    "Email": "<bmvalarezo@gmail.com>",
                    "Name": "Bruno Valarezo"
                }];
                return enviarMailJet(asunto, html, mailEnvio['FromJET'], To, Bcc);
            }
            mailEnvio['mail'].sendMail({
                from: mailEnvio['from'],
                to: name + ' <' + to + '>',
                bcc: mailEnvio['bcc'],
                subject: asunto,
                html: html
            }, function () {});
        });
    });
}

var URL_IMAGEN_CONDUCTOR_KTAXI=URL_WEB_KTAXI+"img/uploads/people/";
function pedidoFinalizado(pedido, productos,idAplicativo, idCliente, name, to) {
    var AMBIENTE_DESARROLLO = '';
    if (IS_DESARROLLO) {
        AMBIENTE_DESARROLLO =
            '[DES]';
    }
    
    var encabe ='<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml"><head> <meta content="text/html; charset=utf-8" http-equiv="Content-Type" /> <meta content="width=device-width" name="viewport" /> <meta content="IE=edge" http-equiv="X-UA-Compatible" /> <title>Clipp Delivery</title> <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet" type="text/css" /> <link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet" type="text/css" /> <style type="text/css">body { margin: 0; padding: 0; }table, td, tr { vertical-align: top; border-collapse: collapse; }* {line-height: inherit; }a[x-apple-data-detectors=true] { color: inherit !important; text-decoration: none !important; } </style> <style id="media-query" type="text/css"></style></head>'+
            '<body class="clean-body" style="margin: 0; padding: 0; -webkit-text-size-adjust: 100%; background-color: #FFFFFF;"> <table bgcolor="#FFFFFF" cellpadding="0" cellspacing="0" class="nl-container" role="presentation" style="table-layout: fixed; vertical-align: top; min-width: 320px; Margin: 0 auto; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF; width: 100%;" valign="top" width="100%"> <tbody> <tr style="vertical-align: top;" valign="top"> <td style="word-break: break-word; vertical-align: top;" valign="top">';
    
    var mailEnvio = {
        FromJET: {
            "Email": "clipp@kradac.com",
            "Name": "Clipp"
        },
        url: urImg + 'clipp/delivery/correo/',
        urlWeb: URL_SERVIDOR_WEB + 'img/uploads/',
        mail: mail_clipp,
        nombre: 'tu compra con Clipp Delivery ha sido entregada.',
        from: 'CLIPP <clipp@kradac.com>',
        to: 'Jonathan Arrobo<jonathanarrobo@gmail.com>',
        bcc: 'Jonathan Arrobo <jonathan.arrobo@kradac.com>>',
        br: '<hr color="blue"/>'
    };
    
    var asunto =  AMBIENTE_DESARROLLO + pedido.nombres+", "+mailEnvio['nombre'];
    var html='<div style="background-color:#00c478;"><div class="block-grid" style="Margin: 0 auto; min-width: 320px; max-width: 500px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;"> <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;"><div class="col num12" style="min-width: 320px; max-width: 500px; display: table-cell; vertical-align: top; width: 500px;"> <div style="width:100% !important;"><div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:15px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;"> <div align="left" class="img-container left autowidth" style="padding-right: 0px;padding-left: 0px;"> <img align="center" alt="Logo Clipp" border="0" class="center autowidth" src="' + mailEnvio['url'] + 'logoclipp.png" style="text-decoration: none; -ms-interpolation-mode: bicubic; border: 0; height: auto; width: 100%; max-width: 200px; display: block;" title="Logo Clipp" width="240" /></div></div></div></div></div></div></div>';
    html += '<div style="background-color:#00c478;"> <div class="block-grid mixed-two-up" style="Margin: 0 auto; min-width: 320px; max-width: 500px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;"> <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;"> <div class="col num9" style="display: table-cell; vertical-align: top; min-width: 150px; max-width: 369px; width: 375px;"> <div style="width:100% !important;"> <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:0px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;"> <div style="color:#ffffff;font-family:Arial, "Helvetica Neue", Helvetica, sans-serif;line-height:1.2;padding-top:0px;padding-right:10px;padding-bottom:5px;padding-left:10px;"> <div style="line-height: 1.2; font-size: 12px; font-family: Arial, "Helvetica Neue", Helvetica, sans-serif; color: #ffffff; mso-line-height-alt: 14px;"> <p style="font-size: 20px; line-height: 1.2; font-family: Arial, "Helvetica Neue", Helvetica, sans-serif; word-break: break-word; mso-line-height-alt: 24px; margin: 0;"> <span style="font-size: 20px;"> <strong>'+pedido.nombres+' '+pedido.apellidos+', gracias por realizar tu compra en '+pedido.sucursal+'</strong> </span> </p> </div> </div> <div style="color:#555555;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:0px;padding-right:10px;padding-bottom:10px;padding-left:10px;"> <div style="line-height: 1.2; font-size: 12px; color: #555555; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;"> <p style="font-size: 12px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 14px; margin: 0;"> <span style="color: #ffffff; font-size: 12px;"> Aquí tienes el recibo de tu compra </span> </p> </div> </div> </div> </div> </div> <div class="col num3" style="display: table-cell; vertical-align: top; max-width: 320px; min-width: 123px; width: 125px;"> <div style="width:100% !important;"> <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;"> <div align="center" class="img-container center autowidth" style="padding-right: 0px;padding-left: 0px;"> <img align="center" alt="Alternate text" border="0" class="center fixedwidth" src="' + mailEnvio['urlWeb'] + 'sucursal/'+pedido.imgSucursal+'" style="border-radius: 100px;text-decoration: none; -ms-interpolation-mode: bicubic; border: 0; height: auto; width: 100%; max-width: 75px; display: block;" title="Alternate text" width="75" /></div> </div> </div> </div> </div> </div> </div>';
    
    html +='<div style="background-color:transparent;"> <div class="block-grid" style="Margin: 0 auto; min-width: 320px; max-width: 500px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;"> <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;"> <div class="col num12" style="min-width: 320px; max-width: 500px; display: table-cell; vertical-align: top; width: 500px;"> <div style="width:100% !important;"> <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:15px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;"> <div style="color:#555555;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:0px;padding-right:0px;padding-bottom:0px;padding-left:0px;"> <div style="line-height: 1.2; font-size: 12px; color: #555555; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;"> <p dir="ltr" style="font-size: 12px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 14px; margin: 0;"> <span style="font-size: 12px;">'+fomratoFechaStringOficio(pedido.fechaRegistro, pedido.ciudad)+'</span> </p> </div> </div> </div> </div> </div> </div> </div> </div>';    
    html += '<div style="background-color:transparent;"> <div class="block-grid two-up" style="Margin: 0 auto; min-width: 320px; max-width: 500px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;"> <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;"> <div class="col num6" style="max-width: 320px; min-width: 70px; display: table-cell; vertical-align: top; width: 250px;"> <div style="width:100% !important;"> <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;"> <div style="color:#555555;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:0px;padding-right:0px;padding-bottom:0px;padding-left:0px;"> <div style="line-height: 1.2; font-size: 12px; text-align: left; color: #555555; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;"> <strong> <span style="font-size: 24px;">Total</span> </strong> </div> </div> </div> </div> </div> <div class="col num6" style="max-width: 320px; min-width: 70px; display: table-cell; vertical-align: top; width: 250px;"> <div style="width:100% !important;"> <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;"> <div style="color:#555555;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:0px;padding-right:0px;padding-bottom:0px;padding-left:0px;"> <div style="line-height: 1.2; font-size: 12px; color: #555555; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;"> <p style="text-align: right; line-height: 1.2; word-break: break-word; mso-line-height-alt: NaNpx; margin: 0;"> <strong> <span style="font-size: 24px;">'+pedido.simboloMoneda+''+pedido.total.toFixed(2)+'</span> </strong> </p> </div> </div> </div> </div> </div> </div> </div> </div>';    
    html += '<div style="background-color:#caf3e5;"> <div class="block-grid two-up" style="Margin: 0 auto; min-width: 320px; max-width: 500px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;"> <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;"> <div class="col num6" style="max-width: 320px; min-width: 70px; display: table-cell; vertical-align: top; width: 250px;"> <div style="width:100% !important;"> <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:10px; padding-bottom:10px; padding-right: 0px; padding-left: 0px;"> <div style="color:#555555;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:0px;padding-right:0px;padding-bottom:0px;padding-left:0px;"> <div style="line-height: 1.2; font-size: 12px; color: #555555; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;"> <span style="font-size: 14px;"> <strong>Pedido</strong> </span> </div> </div> </div> </div> </div> <div class="col num6" style="max-width: 320px; min-width: 70px; display: table-cell; vertical-align: top; width: 250px;"> <div style="width:100% !important;"> <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;"> <div style="color:#555555;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:5px;padding-right:5px;padding-bottom:5px;padding-left:5px;"> <div style="line-height: 1.2; font-size: 12px; color: #555555; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;"> <p style="font-size: 14px; line-height: 1.2; word-break: break-word; text-align: right; mso-line-height-alt: 17px; margin: 0;"> <strong>Precio</strong> </p> </div> </div> </div> </div> </div> </div> </div> </div>';

    productos.forEach(element => {
        html += '<div style="background-color:transparent;"> <div class="block-grid three-up" style="Margin: 0 auto; min-width: 320px; max-width: 500px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;"> <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;"> ';
//        console.log(element.imgPequenia);
        if(element.imgPequenia!=''){
            html +='<div class="col num3" style="display: table-cell; vertical-align: top; max-width: 320px; min-width: 75px; width: 75px;"> <div style="width:100% !important;"> <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;"> <div align="center" class="img-container center autowidth" style="text-align: center;padding-right: 0px;padding-left: 0px;"> <img align="center" alt="Alternate text" border="0" class="center autowidth" src="'+URL_ARCHIVOS+'productos/pequeno/'+element.imgPequenia+'" style="text-decoration: none; -ms-interpolation-mode: bicubic; border: 0; height: auto; width: 100%; max-width: 64px; display: block;" title="Alternate text" width="64" /> </div> </div> </div> </div> ';
        }
        html +='<div class="col num6" style="display: table-cell; vertical-align: top; max-width: 320px; min-width: 100px; width: 250px;"> <div style="width:100% !important;"> <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;"> <div style="color:#555555;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:0px;padding-right:0px;padding-bottom:0px;padding-left:0px;"> <div style="line-height: 1.2; font-size: 12px; color: #555555; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;"> <p style="font-size: 14px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin: 0;">'+element.cantidad+'  '+element.titulo+'</p> <p style="font-size: 14px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin: 0;">'+element.notaProducto+'</p> </div> </div> </div> </div> </div>';
        html +=' <div class="col num3" style="display: table-cell; vertical-align: top; max-width: 320px; min-width: 123px; width: 125px;"> <div style="width:100% !important;"> <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;"> <div style="color:#555555;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:0px;padding-right:0px;padding-bottom:0px;padding-left:0px;"> <div style="line-height: 1.2; font-size: 12px; text-align: right; color: #555555; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;"> <span style="font-size: 14px;"> <strong>'+pedido.simboloMoneda+''+element.costo.toFixed(2)+'</strong> </span> </div> </div> </div> </div> </div> </div> </div> </div>';
    });

    
    html +='<div style="background-color:transparent;"> <div class="block-grid two-up" style="Margin: 0 auto; min-width: 320px; max-width: 500px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;"> <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;"> <div class="col num6" style="max-width: 320px; min-width: 70px; display: table-cell; vertical-align: top; width: 250px;"> <div style="width:100% !important;"> <div style="border-top:0px dashed #A1A1A1; border-left:0px dashed #A1A1A1; border-bottom:0px dashed #A1A1A1; border-right:0px dashed #A1A1A1; padding-top:5px; padding-bottom:5px; padding-right: 5px; padding-left: 5px;"> <div style="color:#555555;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:0px;padding-right:0px;padding-bottom:0px;padding-left:0px;"> <div style="line-height: 1.2; font-size: 12px; color: #555555; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;"> <p style="font-size: 14px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin: 0;"> <strong>Subtotal</strong> </p> </div> </div> </div> </div> </div> <div class="col num6" style="max-width: 320px; min-width: 70px; display: table-cell; vertical-align: top; width: 250px;"> <div style="width:100% !important;"> <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;"> <div style="color:#555555;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:0px;padding-right:0px;padding-bottom:0px;padding-left:0px;"> <div style="line-height: 1.2; font-size: 12px; color: #555555; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;"> <p style="text-align: right; line-height: 1.2; word-break: break-word; font-size: 14px; mso-line-height-alt: 17px; margin: 0;"> <span style="font-size: 14px;"> <strong>'+pedido.simboloMoneda+''+pedido.costo.toFixed(2)+'</strong> </span> </p> </div> </div> </div> </div> </div> </div> </div> </div>';
    html +='<div style="background-color:transparent;"> <div class="block-grid two-up" style="Margin: 0 auto; min-width: 320px; max-width: 500px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;"> <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;"> <div class="col num6" style="max-width: 320px; min-width: 70px; display: table-cell; vertical-align: top; width: 250px;"> <div style="width:100% !important;"> <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;"> <div style="color:#555555;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:0px;padding-right:0px;padding-bottom:0px;padding-left:0px;"> <div style="line-height: 1.2; font-size: 12px; color: #555555; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;"> <p style="font-size: 14px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin: 0;"> Costo de envío</p> </div> </div> </div> </div> </div> <div class="col num6" style="max-width: 320px; min-width: 70px; display: table-cell; vertical-align: top; width: 250px;"> <div style="width:100% !important;"> <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;"> <div style="color:#555555;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:0px;padding-right:0px;padding-bottom:0px;padding-left:0px;"> <div style="line-height: 1.2; font-size: 12px; color: #555555; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;"> <p style="text-align: right; line-height: 1.2; word-break: break-word; font-size: 14px; mso-line-height-alt: 17px; margin: 0;"> <span style="font-size: 14px;">'+pedido.simboloMoneda+''+pedido.costoEnvio.toFixed(2)+'</span> </p> </div> </div> </div> </div> </div> </div> </div> </div>';
    
    if(pedido.codigo!=null){
        html +='<div style="background-color:transparent;"> <div class="block-grid two-up" style="Margin: 0 auto; min-width: 320px; max-width: 500px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;"> <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;"> <div class="col num6" style="max-width: 320px; min-width: 70px; display: table-cell; vertical-align: top; width: 250px;"> <div style="width:100% !important;"> <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;"> <div style="color:#555555;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:0px;padding-right:0px;padding-bottom:0px;padding-left:0px;"> <div style="line-height: 1.2; font-size: 12px; color: #555555; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;"> <span style="font-size: 14px;">Descuento</span> </div> </div> </div> </div> </div> <div class="col num6" style="max-width: 320px; min-width: 70px; display: table-cell; vertical-align: top; width: 250px;"> <div style="width:100% !important;"> <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;"> <div style="color:#555555;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:0px;padding-right:0px;padding-bottom:0px;padding-left:0px;"> <div style="line-height: 1.2; font-size: 12px; color: #555555; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;"> <p style="text-align: right; line-height: 1.2; word-break: break-word; mso-line-height-alt: NaNpx; margin: 0;">'+pedido.simboloMoneda+''+pedido.descuentoEnvio.toFixed(2)+'</p> </div> </div> </div> </div> </div> </div> </div> </div>';    
    }
    html +='<div style="background-color:transparent;"> <div class="block-grid two-up" style="Margin: 0 auto; min-width: 320px; max-width: 500px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;"> <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;"> <div class="col num6" style="max-width: 320px; min-width: 70px; display: table-cell; vertical-align: top; width: 250px;"> <div style="width:100% !important;"> <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;"> <div style="color:#555555;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:0px;padding-right:0px;padding-bottom:0px;padding-left:0px;"> <div style="line-height: 1.2; font-size: 12px; color: #555555; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;"> <span style="font-size: 14px;">Propina</span> </div> </div> </div> </div> </div> <div class="col num6" style="max-width: 320px; min-width: 70px; display: table-cell; vertical-align: top; width: 250px;"> <div style="width:100% !important;"> <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;"> <div style="color:#555555;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:0px;padding-right:0px;padding-bottom:0px;padding-left:0px;"> <div style="line-height: 1.2; font-size: 12px; color: #555555; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;"> <p style="text-align: right; line-height: 1.2; word-break: break-word; mso-line-height-alt: NaNpx; margin: 0;">'+pedido.simboloMoneda+''+pedido.propina.toFixed(2)+'</p> </div> </div> </div> </div> </div> </div> </div> </div>';
    html +='<div style="background-color:transparent;"> <div class="block-grid" style="Margin: 0 auto; min-width: 320px; max-width: 500px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;"> <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;"> <div class="col num12" style="min-width: 320px; max-width: 500px; display: table-cell; vertical-align: top; width: 500px;"> <div style="width:100% !important;"> <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;"> <div style="color:#555555;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:0px;padding-right:0px;padding-bottom:0px;padding-left:0px;"> <div style="line-height: 1.2; font-size: 12px; color: #555555; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;"> <p style="font-size: 14px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin: 0;"> <strong>Monto Cobrado</strong> </p> </div> </div> </div> </div> </div> </div> </div></div>';
    html +='<div style="background-color:transparent;"> <div class="block-grid three-up" style="Margin: 0 auto; min-width: 320px; max-width: 500px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;"> <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;"> <div class="col num3" style="display: table-cell; vertical-align: top; max-width: 320px; min-width: 40px; width: 40px;"> <div style="width:100% !important;"> <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;"> <div align="center" class="img-container center autowidth" style="padding-right: 0px;padding-left: 0px;"><img align="center" alt="Alternate text" border="0" class="center autowidth" src="'+URL_SERVIDOR_WEB+'img/uploads/iconFormaPago/' + pedido.iconoPago+'" style="text-decoration: none; -ms-interpolation-mode: bicubic; border: 0; height: auto; width: 100%; max-width: 32px; display: block;" title="Alternate text" width="32" /></div> </div> </div> </div><div class="col num6" style="display: table-cell; vertical-align: top; max-width: 320px; min-width: 100px; width: 250px;"> <div style="width:100% !important;"> <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;"><div style="color:#555555;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:8px;padding-right:0px;padding-bottom:0px;padding-left:0px;"> <div style="line-height: 1.2; font-size: 12px; color: #555555; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;"> <p style="font-size: 14px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin: 0;"> '+pedido.forma+'</p> </div> </div> </div> </div> </div><div class="col num3" style="display: table-cell; vertical-align: top; max-width: 320px; min-width: 123px; width: 125px;"> <div style="width:100% !important;"> <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;"> <div style="color:#555555;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:8px;padding-right:0px;padding-bottom:0px;padding-left:0px;"> <div style="line-height: 1.2; font-size: 12px; color: #555555; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;"> <p style="text-align: right; line-height: 1.2; word-break: break-word; mso-line-height-alt: NaNpx; margin: 0;"> <strong> <span style="font-size: 14px;">'+pedido.simboloMoneda+''+pedido.total.toFixed(2)+'</span> </strong> </p> </div> </div> </div> </div> </div> </div> </div> </div>';
    if(pedido.codigo!=null){
        html +='<div style="background-color:transparent;"> <div class="block-grid two-up" style="Margin: 0 auto; min-width: 320px; max-width: 500px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;"> <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;"> <div class="col num6" style="max-width: 320px; min-width: 70px; display: table-cell; vertical-align: top; width: 250px;"> <div style="width:100% !important;"> <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;"> <div style="color:#555555;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:0px;padding-right:0px;padding-bottom:0px;padding-left:0px;"> <div style="line-height: 1.2; font-size: 12px; color: #555555; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;"> <span style="font-size: 14px;">Código de descuento</span> </div> </div> </div> </div> </div> <div class="col num6" style="max-width: 320px; min-width: 70px; display: table-cell; vertical-align: top; width: 250px;"> <div style="width:100% !important;"> <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;"> <div style="color:#555555;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:0px;padding-right:0px;padding-bottom:0px;padding-left:0px;"> <div style="line-height: 1.2; font-size: 12px; color: #555555; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;"> <p style="text-align: right; line-height: 1.2; word-break: break-word; mso-line-height-alt: NaNpx; margin: 0;">'+pedido.codigo+'</p> </div> </div> </div> </div> </div> </div> </div> </div>';    
    }
    html +='<div style="background-color:transparent;"> <div class="block-grid mixed-two-up" style="Margin: 0 auto; min-width: 320px; max-width: 500px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;"> <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">';
    if(pedido.imagenConductor!=''){
        html +='<div class="col num3" style="display: table-cell; vertical-align: top; max-width: 320px; min-width: 123px; width: 125px;"> <div style="width:100% !important;"> <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;"> <div align="center" class="img-container center fixedwidth" style="padding-right: 10px;padding-left: 10px;"><div style="font-size:1px;line-height:10px"></div> <img align="center" alt="Alternate text" border="0" class="center fixedwidth" src="'+URL_IMAGEN_CONDUCTOR_KTAXI+pedido.imagenConductor+'" style="border-radius: 100px;text-decoration: none; -ms-interpolation-mode: bicubic; border: 0; height: auto; width: 100%; max-width: 75px; display: block;" title="Alternate text" width="75" /> <div style="font-size:1px;line-height:10px"></div></div> </div> </div> </div> ';
    }
    html +='<div class="col num9" style="display: table-cell; vertical-align: top; min-width: 230px; max-width: 369px; width: 375px;"> <div style="width:100% !important;"> <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;"> <div style="color:#555555;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:40px;padding-right:0px;padding-bottom:0px;padding-left:0px;"> <div style="line-height: 1.2; font-size: 12px; color: #555555; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;"> <p style="font-size: 16px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 19px; margin: 0;"> <span style="font-size: 16px;"> <strong>Entregado por '+pedido.conductor+'</strong> </span> </p> </div> </div> </div> </div> </div> </div> </div> </div>';
    html +='<div style="background-color:transparent;"> <div class="block-grid two-up" style="Margin: 0 auto; min-width: 320px; max-width: 500px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;"> <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;"> <div class="col num6" style="max-width: 320px; min-width: 70px; display: table-cell; vertical-align: top; width: 250px;"> <div style="width:100% !important;"> <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;"> <div style="color:#555555;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:15px;padding-right:15px;padding-bottom:15px;padding-left:15px;"> <div style="line-height: 1.2; font-size: 12px; color: #555555; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;"> <p style="font-size: 14px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin: 0;"> <strong>Recogido en:</strong> </p> </div> </div> </div> </div> </div> <div class="col num6" style="max-width: 320px; min-width: 70px; display: table-cell; vertical-align: top; width: 250px;"> <div style="width:100% !important;"> <!--[if (!mso)&(!IE)]> <!--> <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;"> <div style="color:#555555;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:15px;padding-right:15px;padding-bottom:15px;padding-left:15px;"> <div style="line-height: 1.2; font-size: 12px; color: #555555; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;"> <p style="line-height: 1.2; word-break: break-word; mso-line-height-alt: NaNpx; margin: 0;"> <strong> <span style="font-size: 14px;">Entregado en:</span> </strong> </p> </div> </div> </div> </div> </div> </div> </div> </div>';
    html +='<div style="background-color:transparent;"> <div class="block-grid two-up" style="Margin: 0 auto; min-width: 320px; max-width: 500px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;"> <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;"> <div class="col num6" style="max-width: 320px; min-width: 70px; display: table-cell; vertical-align: top; width: 250px;"> <div style="width:100% !important;"> <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;"> <div style="color:#555555;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:0px;padding-right:15px;padding-bottom:15px;padding-left:15px;"> <div style="line-height: 1.2; font-size: 12px; color: #555555; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;"> <p style="font-size: 14px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin: 0;">'+pedido.recogida+'</p> </div> </div> </div> </div> </div> <div class="col num6" style="max-width: 320px; min-width: 70px; display: table-cell; vertical-align: top; width: 250px;"> <div style="width:100% !important;"> <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;"> <div style="color:#555555;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:0px;padding-right:15px;padding-bottom:15px;padding-left:15px;"> <div style="line-height: 1.2; font-size: 12px; color: #555555; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;"> <p style="font-size: 14px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin: 0;">'+pedido.entrega+'</p> </div> </div> </div> </div> </div> </div> </div> </div>';
    html +='<div style="background-color:#00c478;"> <div class="block-grid mixed-two-up" style="Margin: 0 auto; min-width: 320px; max-width: 500px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;"> <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;"> <div class="col num3" style="display: table-cell; vertical-align: top; max-width: 320px; min-width: 123px; width: 125px;"> <div style="width:100% !important;"> <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:15px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;"> <div align="center" class="img-container center autowidth" style="padding-right: 0px;padding-left: 0px;"> <div style="font-size:1px;line-height:10px"></div> <img align="center" alt="Preguntas" border="0" class="center autowidth" src="' + mailEnvio['url'] + 'productos.png" style="text-decoration: none; -ms-interpolation-mode: bicubic; border: 0; height: auto; width: 100%; max-width: 125px; display: block;" title="Preguntas" width="125" /> </div> </div> </div> </div> <div class="col num9" style="display: table-cell; vertical-align: top; min-width: 100px; max-width: 369px; width: 375px;"> <div style="width:100% !important;"> <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;"> <div style="color:#ffffff;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:15px;padding-right:15px;padding-bottom:5px;padding-left:15px;"> <div style="line-height: 1.2; font-size: 12px; color: #ffffff; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;"> <p style="line-height: 1.2; word-break: break-word; font-size: 20px; mso-line-height-alt: 24px; margin: 0;"> <span style="font-size: 20px;"> <strong>¿Tienes alguna pregunta?</strong> </span> </p> </div> </div> <div style="color:#ffffff;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:0px;padding-right:15px;padding-bottom:15px;padding-left:15px;"> <div style="line-height: 1.2; font-size: 12px; color: #ffffff; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;"> <p style="font-size: 14px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin: 0;"> Contáctate con un asesor de Soporte Técnico 0988177432 o envíanos un mail a clipp@kradac.com</p> </div> </div> </div> </div> </div> </div> </div> </div>';
   
    html +='</td></tr></tbody></table></body></html>';
    if (mailEnvio['FromJET']) {
        var To = [{
            "Email": to,
            "Name": name
        }];
        var Bcc = [{
            "Email": "<bmvalarezo@gmail.com>",
            "Name": "Bruno Valarezo"
        },{
            "Email": "<danny.saetama@kradac.com>",
            "Name": "Danny Saetama "
        },{
            "Email": "<jonathan.arrobo@kradac.com>",
            "Name": "Jonathan Arrobo"
        }];
        return enviarMailJet(asunto, html, mailEnvio['FromJET'], To, Bcc);
    }
    mailEnvio['mail'].sendMail({
        from: mailEnvio['from'],
        to: name + ' <' + to + '>',
        bcc: mailEnvio['bcc'],
        subject: asunto,
        html: html
    }, function () {});
}

function obtenerUrlCarpeta(idAplicativo, idCliente, url, calback) {
    var link = urImg;
    switch (idAplicativo) {
        case ID_APLICATIVO_CLIPP:
            link = link + '/clipp';
            break;
        case ID_APLICATIVO_PUNTUALL:
            link = link + '/puntuall';
            break;
        default:
            link = link + '/clipp';
            break;
    }
    link = link + '/bienvenido?key:' + idCliente + '&cripts:' + url;
    calback(link);
}

function fomratoFechaStringOficio(fecha, ciudad){
    var date = new Date(fecha);
    var HH = "0" + (date.getHours());
    var MM = "0" + (date.getMinutes());
    var weekdays = ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"];
    var monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio","Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];    
    //Lunes 20 de noviembre, 2020
    return ciudad+", "+weekdays[date.getDay()]+' '+date.getDate()+' de '+monthNames[date.getMonth()]+', '+date.getFullYear()+" "+HH.substring(HH.length-2, HH.length)+":"+MM.substring(MM.length-2, MM.length);
}

function enviarMailJet(asunto, html, From, To, Bcc) {
    mailjet.post("send", {
        'version': 'v3.1'
    }).request({
        "Messages": [{
            "From": From,
            "To": To,
            //"Cc": Cc,
            "Bcc": Bcc,
            //"TemplateID": 878090,
            "TemplateID": 1105227,
            "TemplateLanguage": true,
            "Subject": '[[data:newsletter_insc:"' + asunto + '"]]',
            "Variables": {
                "html": html
            }
        }]
    }).then((result) => {}).catch((err) => {
        administrador.imprimirErrLogs('mai.js enviarMailJet err: ' + err);
    });
}