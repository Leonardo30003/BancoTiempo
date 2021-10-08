var request = require("request");
var cnf = require('./config.js');

function armarTextoWp(titulo, data, numeros, textoAdicional){
    var ambiente = ''
    if (IS_DESARROLLO)
        ambiente = '*------ DESARROLLO ------*'
    
    var textoWP=ambiente+'\n*'+titulo+'*\n';
    data.forEach(element => {
        if(element.valor=='_')
            textoWP +='*'+element.clave+'*\n';
        else
            textoWP +='*'+element.clave+':* '+element.valor+'\n';
        
    });
    textoWP +='\n\n'+textoAdicional;
    textoWP = textoWP.replace(/&/g, "y").replace("#", "%23");
//    console.log(textoWP);
//    console.log("////////////////////////////////////////////////////////////////////////////");
    textoWP = encodeURI(textoWP);
//    console.log(textoWP);
    numeros.forEach(numero => {
        enviarPedidoWP(textoWP, numero);
    });
    
}

function enviarPedidoWP(datos, numero) {
    //console.log('Link:> ' + 'http://winserver.kradac.com/grupo?p=' + numero + '&c=' + datos)
    var options = {
        method: 'GET', timeout: 1000,
        url: 'http://winserver.kradac.com/grupo?p=' + numero + '&c=' + datos,
        headers: {
            Connection: 'keep-alive',
            Host: 'winserver.kradac.com',
            Accept: '*/*',
        }
    };
    request(options, function (error, response, body) {
        if (error)
            console.log('No se ha podido realizar el envio del pedido por WP ' + error)

    });
}

function notificarEstadoPedidoWP(idPedido, estado){
    
    console.log("WP ESTADO PEDIDO: "+estado)
    cnf.ejecutarSQLCallback(SQL_PEDIDO_CLIENTE, [idPedido], function (pedidos) {
         if (pedidos.length <= 0)
             return;
         
        var titulo=pedidos[0].sucursal+" - "+estado+" - "+pedidos[0].ciudad;
        var data = [
            { clave: "Número orden", valor: pedidos[0]['numeroOrden'] },
            { clave: "Cliente", valor: pedidos[0].nombres + ' ' + pedidos[0].apellidos },
            { clave: "Estado", valor:estado },
            { clave: "Fecha", valor:pedidos[0].fechaRegistro }
        ];
        armarTextoWp(titulo, data, [GRUPO_DELIVERY_ERROR_WP], "");
    });
}

SQL_PEDIDO_CLIENTE="SELECT p.idPedido, p.idCliente, p.idSucursal, p.idDireccion, p.estado, p.idTipoEstadoPedido, p.tiempo, p.numeroOrden, c.nombres, c.apellidos, ciu.ciudad, s.sucursal, CONCAT(CONVERT_TZ(now(),  'UTC', ciu.zonaHoraria),'') AS fechaRegistro FROM clipp.pedido p INNER JOIN clipp.cliente c ON c.idCliente=p.idCliente INNER JOIN clipp.sucursal s ON s.idSucursal=p.idSucursal INNER JOIN clipp.ciudad ciu ON ciu.idCiudad=s.idCiudad WHERE p.idPedido = ? LIMIT 1;";


module.exports = {
    armarTextoWp: armarTextoWp,
    notificarEstadoPedidoWP: notificarEstadoPedidoWP
};