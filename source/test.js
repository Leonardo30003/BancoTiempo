var request = require("request");
const URL_HERA_MAPS = 'https://route.api.here.com/routing/7.2/';

function routingHearMap(lt1, lg1, lt2, lg2, callback) {
    var options = {method: 'GET',
        url: URL_HERA_MAPS + 'calculateroute.json?waypoint0=' + lt1 + '%2C' + lg1 + '&waypoint1=' + lt2 + '%2C' + lg2 + '&mode=fastest%3Bcar%3Btraffic%3Aenabled&app_id=boaSXme7b301aYqcQvbe&app_code=TvErG2oDvN7c8rQz61c42w&departure=now&language=es-Es&instructionFormat=text&vehicletype=diesel,5.5&consumptionmodel=standard'
        ,
        headers: {Connection: 'keep-alive', Host: 'route.api.here.com', Accept: '*/*', 'User-Agent': 'PostmanRuntime/7.15.0'}};
    request(options, function (error, response, body) {
        if (error)
            return callback({error: error});
        try {
            let respuesta = JSON.parse(body);
            let puntos = respuesta['response']['route'][0]['leg'][0]['maneuver'];
            let summary = respuesta['response']['route'][0]['summary'];
            let distance = summary['distance'];
            let distancia = distance / 1000;
            let baseTime = summary['baseTime']; //Segundos
            let horas = baseTime / 60 / 60;
            let minutos = Math.ceil((horas - parseInt(horas)) * 60);
            let co2Emission = summary['co2Emission'];
            let ruta = {dis: distancia, unidad: 'km', tiempo: horas + 'h' + minutos, co2: co2Emission};
            let cordenadas = [];
            for (var i = 0; i < puntos.length; i++) {
                let cor = puntos[i];
                let pos = cor['position'];
                cordenadas[i] = {p: [pos['latitude'], pos['longitude']], d: cor['instruction']};
            }
            ruta['cordenadas'] = cordenadas;
            return callback({en: 1, ruta: ruta});
        } catch (exception) {
            return callback({error: exception});
        }
    });
}

var DOMINIO_GOOGLE_API = 'https://maps.googleapis.com/';

function obtenerRuta(latitudOrigen, longitudOrigen, latitudDestino, longitudDestino, keyMapa, callback) {
    let options = {method: 'GET', url: DOMINIO_GOOGLE_API + 'maps/api/directions/json?origin=' + latitudOrigen + ',' + longitudOrigen + '&destination=' + latitudDestino + ',' + longitudDestino + '&key=' + keyMapa, qs: {}};
    request(options, function (error, response, body) {
        if (error)
            return callback({error: error});
        try {
            let respuesta = JSON.parse(body);
            let puntos = respuesta.routes[0].legs[0].steps;
            let distance = respuesta.routes[0].legs[0].distance.value;
            let distancia = distance / 1000;
            let baseTime = respuesta.routes[0].legs[0].duration.value; //Segundos
            let horas = baseTime / 60 / 60;
            let minutos = Math.ceil((horas - parseInt(horas)) * 60);
            let ruta = {dis: distancia.toFixed(2), unidad: 'km', tiempo: (parseInt(horas) > 0 ? parseInt(horas) + 'h' : '') + minutos + ' min', co2: 'S/N'};
            let cordenadas = [];
            for (var i = 0; i < puntos.length; i++) {
                let cor = puntos[i];
                cordenadas[i] = {p: [cor['start_location']['lat'], cor['end_location']['lng']], d: 'S/N'};
            }
            ruta['cordenadas'] = cordenadas;
            return callback({en: 1, ruta: ruta});
        } catch (exception) {
            return callback({error: exception});
        }
    });
}

obtenerRuta(-4.015483, -79.201800, -4.004090, -79.209331, 'AIzaSyCUGdMQ8JZ3Yc4SqA_KjPrVj1nq9krBWdM', function (respuesta) {
    console.log(respuesta);
});

