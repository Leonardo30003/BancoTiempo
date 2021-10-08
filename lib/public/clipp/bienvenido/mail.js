var KEY;
var SCRIPT;
var URL;
var URL_EMAILHTTPS;
try {
    var hashes = window.location.href.slice(document.URL.indexOf('?') + 1).split('&');
    var ur = document.URL;
    URL_EMAILHTTPS = ur.split("simert/bienvenido")[0];
    console.log(URL_EMAILHTTPS);
    KEY = hashes[0].split(':')[1];
    SCRIPT = hashes[1].split(':')[1];
} catch (e) {
    document.getElementById('respuesta').innerHTML = "¡Link enviado incorrecto X(!";

}
setTimeout(function () {
    enviar()
}, 1000);

function validar(KEY, SCRIPT, calback) {
    $.get(URL_EMAILHTTPS + 'u/validar/correo/' + KEY + '/' + SCRIPT, function (data) {
        calback(data);
    });
}

function enviar() {
    if (KEY !== undefined && SCRIPT !== undefined) {
        validar(KEY, SCRIPT, function (data) {
            if (data.error) {
                document.getElementById('respuesta').innerHTML = "¡Link enviado incorrecto!";
                alert("¡Link enviado incorrecto X(!");
            } else {
                if (data.en === 1) {
                    document.getElementById('respuesta').innerHTML = "¡Validación exitosa!"
                } else {
                    document.getElementById('respuesta').innerHTML = "¡Link enviado incorrecto!";
                    alert("¡Link enviado incorrecto X(!");
                }
            }
        });
    } else {
        document.getElementById('respuesta').innerHTML = "¡Link enviado incorrecto!";
        alert("¡Link enviado incorrecto X(!");
    }
} 