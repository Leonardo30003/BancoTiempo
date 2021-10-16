#!/bin/bash
pwd
jsmin <VAR_COBROS.js> ../lib/VAR_COBROS.js
jsmin <VAR_GLOBAL.js> ../lib/VAR_GLOBAL.js
jsmin <VAR_APP.js> ../lib/VAR_APP.js
jsmin <config.js> ../lib/config.js
jsmin <firebase.js> ../lib/firebase.js
jsmin <servidor.js> ../lib/servidor.js


cd ./mod_servidor/
pwd
jsmin <administrador_functions.js> ../../lib/administrador_functions.js
jsmin <monitoreador.js> ../../lib/monitoreador.js


cd ../funciones/
pwd
jsmin <admin_pago.js> ../../lib/admin_pago.js
jsmin <mail.js> ../../lib/mail.js
jsmin <rest_control.js> ../../lib/rest_control.js
jsmin <ktaxi_carrera.js> ../../lib/ktaxi_carrera.js
jsmin <mensajes_wp.js> ../../lib/mensajes_wp.js


cd ../listeners/
pwd
jsmin <listener_app.js> ../../lib/listener_app.js
jsmin <listener_autenticar.js> ../../lib/listener_autenticar.js

cd ../redis_emit/
pwd
jsmin <emit.js> ../../lib/emit.js
jsmin <emit_compras.js> ../../lib/emit_compras.js



cd ../res/
pwd

jsmin <r_a_adicional.js> ../../lib/r_a_adicional.js
jsmin <r_a_espacios.js> ../../lib/r_a_espacios.js
jsmin <r_a_accesos.js> ../../lib/r_a_accesos.js
jsmin <r_a_ticket.js> ../../lib/r_a_ticket.js
jsmin <r_a_lugar.js> ../../lib/r_a_lugar.js
jsmin <r_a_lugar_equipo.js> ../../lib/r_a_lugar_equipo.js
jsmin <r_c_login.js> ../../lib/r_c_login.js
jsmin <r_a_login.js> ../../lib/r_a_login.js
jsmin <r_a_oferta.js> ../../lib/r_a_oferta.js


cd ../../variables/
pwd
jsmin <ES.js> ../../lib/ES.js 



echo Finalizo compresion


