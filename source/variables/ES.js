
//SE REPORTAN ESTADOS DE LAS PLAZAS
var T_ESTADO_PLAZA = 1;
exports.T_ESTADO_PLAZA = T_ESTADO_PLAZA;

//SE REPORTAN ESTADOS DE LAS PLAZAS
var T_ESTADO_PARQUEADERO = 2;
exports.T_ESTADO_PARQUEADERO = T_ESTADO_PARQUEADERO;

var T_ESTADO_PLAZA_CAMARA = 3;
exports.T_ESTADO_PLAZA_CAMARA = T_ESTADO_PLAZA_CAMARA;

//SE REPORTAN ESTADOS DE LAS PLAZAS
var T_ESTADO_LETRERO = 4;
exports.T_ESTADO_LETRERO = T_ESTADO_LETRERO;

var T_ASIGNADO_PLAZA = 5;
exports.T_ASIGNADO_PLAZA = T_ASIGNADO_PLAZA;



var ID_P_LIBRE = 1;//Libre marcado por controlador
exports.ID_P_LIBRE = ID_P_LIBRE;

var ID_P_OCUPADO = 2;//Ocupado marcado por controlador
exports.ID_P_OCUPADO = ID_P_OCUPADO;

var ID_P_OCUPADO_CAM = 3;//Ocupado marcado por camara
exports.ID_P_OCUPADO_CAM = ID_P_OCUPADO_CAM;

var ID_P_SANCIONADO = 4;//Sancionado
exports.ID_P_SANCIONADO = ID_P_SANCIONADO;

var ID_P_PAGADO = 5;//Pagada
exports.ID_P_PAGADO = ID_P_PAGADO;

var ID_P_LIBRE_CAM = 6;//Libre marcado por camara
exports.ID_P_LIBRE_CAM = ID_P_LIBRE_CAM;

var ID_P_LIBRE_OPERADOR = 7;//Cuando el operador no ve la plaza que libera por que esta asignada a otra zona o a otra plaza
exports.ID_P_LIBRE_OPERADOR = ID_P_LIBRE_OPERADOR;

var ID_P_OCUPADO_INICIO_JORNADA = 8;//Ocupado con fraccion marcada correctamente
exports.ID_P_OCUPADO_INICIO_JORNADA = ID_P_OCUPADO_INICIO_JORNADA;


var ID_P_INFRACCIONADA = 9;//Ocupado con fraccion marcada correctamente
exports.ID_P_INFRACCIONADA = ID_P_INFRACCIONADA;

var ID_P_OCUPADA_CON_TIEMPO = 10;//Ocupado con tiempo marcado por el cliente del APP
exports.ID_P_OCUPADA_CON_TIEMPO = ID_P_OCUPADA_CON_TIEMPO;

var ID_P_LIBRE_USUARIO = 11;//Libre marcado por cliente
exports.ID_P_LIBRE_USUARIO = ID_P_LIBRE_USUARIO;

var ID_P_CANDADO_RETIRADO = 12;
exports.ID_P_CANDADO_RETIRADO = ID_P_CANDADO_RETIRADO;

var ID_P_INICIO_NOTIFICACION = 13;
exports.ID_P_INICIO_NOTIFICACION = ID_P_INICIO_NOTIFICACION;


var ID_P_COMPRA_TIEMPO = 15;
exports.ID_P_COMPRA_TIEMPO = ID_P_COMPRA_TIEMPO;

var ID_P_CANDADO_PUESTO = 14;
exports.ID_P_CANDADO_PUESTO = ID_P_CANDADO_PUESTO;


var ID_M_REGISTRADO = 1;//notificada
exports.ID_M_REGISTRADO = ID_M_REGISTRADO;

var ID_M_ENCADENADO = 2;//atendida
exports.ID_M_ENCADENADO = ID_M_ENCADENADO;

var ID_M_PAGADO = 3;//despachada
exports.ID_M_PAGADO = ID_M_PAGADO;


exports.PUSH_USUARIO_PLAZA_ASIGNADA = 1;//Cuando se asigna una plaza al parqueo del cliente flotante.

exports.PUSH_USUARIO_PLAZA_LIBERADA_PC = 2;//Cuando se libera la plaza por el controlador.

exports.PUSH_USUARIO_PLAZA_LIBERADA_PU = 3;//Cuando se libera la plaza por el cliente.

exports.PUSH_USUARIO_PLAZA_ADQUISICION = 4;//Cuando se adquiere tiempo de parqueo.

exports.PUSH_USUARIO_PLAZA_AUMENTO = 5;//Cuando se aumenta tiempo de parqueo.

exports.PUSH_USUARIO_RECARGA_SALDO = 6;//Cuando se recarga saldo.