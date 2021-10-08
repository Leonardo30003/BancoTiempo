define({ "api": [
  {
    "type": "EMIT>APP",
    "url": "/l_/",
    "title": "registrar lote",
    "group": "APP_RASTREO",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Json",
            "optional": false,
            "field": "lote",
            "description": "<p>[{&quot;fD&quot;:&quot;2018-03-03 17:56:24&quot;,&quot;iC&quot;:1,&quot;iE&quot;:1,&quot;p&quot;:[-79.2104899,-3.9701365],&quot;va&quot;:&quot;9&quot;,&quot;b1&quot;:&quot;1&quot;,&quot;b2&quot;:&quot;0&quot;,&quot;b3&quot;:&quot;1&quot;,&quot;b4&quot;:&quot;1&quot;,&quot;b5&quot;:&quot;1&quot;,&quot;pr&quot;:&quot;9&quot;,&quot;v&quot;:&quot;0.0&quot;,&quot;r&quot;:&quot;0.0&quot;,&quot;gm&quot;:&quot;0&quot;,&quot;gs&quot;:&quot;1&quot;,&quot;in&quot;:&quot;1&quot;}]</p>"
          },
          {
            "group": "Parameter",
            "type": "ACK",
            "optional": false,
            "field": "function",
            "description": "<p>canal de respuesta inmediata.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "ACK Error": [
          {
            "group": "ACK Error",
            "type": "json",
            "optional": false,
            "field": "APP",
            "description": "<p>{error: ERROR_QUERY }</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "ACK_Error:",
          "content": "En caso de existir este error se debera contemplar un mensaje alterno ya que esto ocurre solo \nsi el servidor no pudo procesar la peticion correctamente.",
          "type": "json"
        }
      ]
    },
    "filename": "listeners/listener_app.js",
    "groupTitle": "APP_RASTREO",
    "name": "Emit_appL_"
  },
  {
    "type": "EMIT>APP",
    "url": "/rc_/",
    "title": "responder comando",
    "group": "APP_RASTREO",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "idEquipo",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "json",
            "optional": false,
            "field": "respuesta",
            "description": "<p>{}</p>"
          },
          {
            "group": "Parameter",
            "type": "Json",
            "optional": false,
            "field": "trama",
            "description": "<p>{&quot;fD&quot;:&quot;2018-03-03 17:56:24&quot;,&quot;iA&quot;:-1, &quot;iE&quot;:1,&quot;p&quot;:[-79.2104899,-3.9701365],&quot;va&quot;:&quot;9&quot;,&quot;b1&quot;:&quot;1&quot;,&quot;b2&quot;:&quot;0&quot;,&quot;b3&quot;:&quot;1&quot;,&quot;b4&quot;:&quot;1&quot;,&quot;b5&quot;:&quot;1&quot;,&quot;pr&quot;:&quot;9&quot;,&quot;v&quot;:&quot;0.0&quot;,&quot;r&quot;:&quot;0.0&quot;,&quot;gm&quot;:&quot;0&quot;,&quot;gs&quot;:&quot;1&quot;,&quot;in&quot;:&quot;1&quot;}</p>"
          },
          {
            "group": "Parameter",
            "type": "ACK",
            "optional": false,
            "field": "function",
            "description": "<p>canal de respuesta inmediata.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "ACK Error": [
          {
            "group": "ACK Error",
            "type": "json",
            "optional": false,
            "field": "APP",
            "description": "<p>{error: ERROR_QUERY }</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "ACK_Error:",
          "content": "En caso de existir este error se debera contemplar un mensaje alterno ya que esto ocurre solo \nsi el servidor no pudo procesar la peticion correctamente.",
          "type": "json"
        }
      ]
    },
    "filename": "listeners/listener_app.js",
    "groupTitle": "APP_RASTREO",
    "name": "Emit_appRc_"
  },
  {
    "type": "EMIT>APP",
    "url": "/t_/",
    "title": "registrar trama",
    "group": "APP_RASTREO",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Json",
            "optional": false,
            "field": "trama",
            "description": "<p>{&quot;fD&quot;:&quot;2018-03-03 17:56:24&quot;,&quot;iC&quot;:1, &quot;iE&quot;:1,&quot;p&quot;:[-79.2104899,-3.9701365],&quot;va&quot;:&quot;9&quot;,&quot;b1&quot;:&quot;1&quot;,&quot;b2&quot;:&quot;0&quot;,&quot;b3&quot;:&quot;1&quot;,&quot;b4&quot;:&quot;1&quot;,&quot;b5&quot;:&quot;1&quot;,&quot;pr&quot;:&quot;9&quot;,&quot;v&quot;:&quot;0.0&quot;,&quot;r&quot;:&quot;0.0&quot;,&quot;gm&quot;:&quot;0&quot;,&quot;gs&quot;:&quot;1&quot;,&quot;in&quot;:&quot;1&quot;}</p>"
          },
          {
            "group": "Parameter",
            "type": "ACK",
            "optional": false,
            "field": "function",
            "description": "<p>canal de respuesta inmediata.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "ACK Error": [
          {
            "group": "ACK Error",
            "type": "json",
            "optional": false,
            "field": "APP",
            "description": "<p>{error: ERROR_QUERY }</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "ACK_Error:",
          "content": "En caso de existir este error se debera contemplar un mensaje alterno ya que esto ocurre solo \nsi el servidor no pudo procesar la peticion correctamente.",
          "type": "json"
        }
      ]
    },
    "filename": "listeners/listener_app.js",
    "groupTitle": "APP_RASTREO",
    "name": "Emit_appT_"
  },
  {
    "type": "EMIT>ADMINSITRADOR",
    "url": "/a_autenticar/",
    "title": "a_autenticar",
    "group": "A_Autenticar",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Json",
            "optional": false,
            "field": "datosJson",
            "description": "<p>{idAdministrador, imei, idApp, idPl}, idApp{1:cliente}</p>"
          },
          {
            "group": "Parameter",
            "type": "ACK",
            "optional": false,
            "field": "function",
            "description": "<p>canal de respuesta inmediata.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "ACK Normal": [
          {
            "group": "ACK Normal",
            "type": "json",
            "optional": false,
            "field": "ADMINSITRADOR",
            "description": "<p>{en: 1, lS: [{idSincronizar, version}]}</p>"
          }
        ],
        "ACK Error": [
          {
            "group": "ACK Error",
            "type": "json",
            "optional": false,
            "field": "ADMINSITRADOR",
            "description": "<p>{error: ERROR_QUERY }</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "ACK_Normal:",
          "content": "Flujo normal de eventos.",
          "type": "json"
        },
        {
          "title": "ACK_Error:",
          "content": "En caso de existir este error se debera contemplar un mensaje alterno ya que esto ocurre solo \nsi el servidor no pudo procesar la peticion correctamente.",
          "type": "json"
        }
      ]
    },
    "filename": "listeners/listener_autenticar.js",
    "groupTitle": "A_Autenticar",
    "name": "Emit_adminsitradorA_autenticar"
  },
  {
    "type": "EMIT>ALL",
    "url": "/consultar_mensaje_pedido/",
    "title": "consultar_mensaje_pedido",
    "group": "Chat_Pedido",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Json",
            "optional": false,
            "field": "datosMensaje",
            "description": "<p>{idPedido: 1}</p>"
          },
          {
            "group": "Parameter",
            "type": "ACK",
            "optional": false,
            "field": "function",
            "description": "<p>canal de respuesta inmediata.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "ACK": [
          {
            "group": "ACK",
            "type": "json",
            "optional": false,
            "field": "ALL",
            "description": "<p>{e: 1, lC:[{idChat, usuario, idPedido, idClienteEnvia AS idCliente, idAdministradorEnvia AS idAdministrador , fecha, hora, idAplicacion, idPlataforma, tipo, estado}]};</p>"
          }
        ],
        "ACK_1": [
          {
            "group": "ACK_1",
            "type": "json",
            "optional": false,
            "field": "ALL",
            "description": "<p>{: -1, mensaje: 'Mensaje aun no visto, servidor envio de nuevo el mensaje.'}</p>"
          }
        ],
        "ACK Error": [
          {
            "group": "ACK Error",
            "type": "json",
            "optional": false,
            "field": "ALL",
            "description": "<p>{error: CODIGO_ERROR};</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "ACK:",
          "content": "Se devuleve el id del chat del pedido.",
          "type": "json"
        },
        {
          "title": "ACK_1:",
          "content": "Se devuleve el id del chat del pedido.",
          "type": "json"
        },
        {
          "title": "ACK_Error:",
          "content": "Se devolvera el caso de errores ya sea por conexion a base de datos erroneas entre otras",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "listeners/listener_chat.js",
    "groupTitle": "Chat_Pedido",
    "name": "Emit_allConsultar_mensaje_pedido"
  },
  {
    "type": "EMIT>ALL",
    "url": "/consultar_mensaje_pedido/",
    "title": "consultar_mensaje_pedido",
    "group": "Chat_Pedido",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Json",
            "optional": false,
            "field": "datosMensaje",
            "description": "<p>{idPedido: 1}</p>"
          },
          {
            "group": "Parameter",
            "type": "ACK",
            "optional": false,
            "field": "function",
            "description": "<p>canal de respuesta inmediata.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "ACK": [
          {
            "group": "ACK",
            "type": "json",
            "optional": false,
            "field": "ALL",
            "description": "<p>{e: 1, lC:[{idChat, usuario, idPedido, idClienteEnvia AS idCliente, idAdministradorEnvia AS idAdministrador , fecha, hora, idAplicacion, idPlataforma, tipo, estado}]};</p>"
          }
        ],
        "ACK_1": [
          {
            "group": "ACK_1",
            "type": "json",
            "optional": false,
            "field": "ALL",
            "description": "<p>{: -1, mensaje: 'Mensaje aun no visto, servidor envio de nuevo el mensaje.'}</p>"
          }
        ],
        "ACK Error": [
          {
            "group": "ACK Error",
            "type": "json",
            "optional": false,
            "field": "ALL",
            "description": "<p>{error: CODIGO_ERROR};</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "ACK:",
          "content": "Se devuleve el id del chat del pedido.",
          "type": "json"
        },
        {
          "title": "ACK_1:",
          "content": "Se devuleve el id del chat del pedido.",
          "type": "json"
        },
        {
          "title": "ACK_Error:",
          "content": "Se devolvera el caso de errores ya sea por conexion a base de datos erroneas entre otras",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "listeners/listener_chat_encomienda.js",
    "groupTitle": "Chat_Pedido",
    "name": "Emit_allConsultar_mensaje_pedido"
  },
  {
    "type": "EMIT>CLIPP",
    "url": "/administrador_envia_chat_audio/",
    "title": "administrador_envia_chat_audio",
    "group": "Chat_Pedido",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Json",
            "optional": false,
            "field": "datosMensaje",
            "description": "<p>{idChat, usuario, idPedido, idCliente, idAplicacion, idPlataforma}</p>"
          },
          {
            "group": "Parameter",
            "type": "archivo",
            "optional": false,
            "field": "audio",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "ACK",
            "optional": false,
            "field": "function",
            "description": "<p>canal de respuesta inmediata.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "ACK": [
          {
            "group": "ACK",
            "type": "json",
            "optional": false,
            "field": "CLIPP",
            "description": "<p>{en: 1, m: &quot;Registrado correctamente.}</p>"
          }
        ],
        "ACK Error": [
          {
            "group": "ACK Error",
            "type": "json",
            "optional": false,
            "field": "KTAXI",
            "description": "<p>{error: CODIGO_ERROR};</p>"
          }
        ],
        "ESCUCHA": [
          {
            "group": "ESCUCHA",
            "type": "recibir_chat_audio_cliente",
            "optional": false,
            "field": "DRIVER",
            "description": "<p>{idChat, idPedido, idCliente, idAplicacion, idPlataforma, cliente:{nomres, telefono, correo} }</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "ACK:",
          "content": "Se devuleve el id del chat del pedido.",
          "type": "json"
        },
        {
          "title": "ACK_Error:",
          "content": "Se devolvera el caso de errores ya sea por conexion a base de datos erroneas entre otras",
          "type": "json"
        },
        {
          "title": "ESCUCHA:",
          "content": "Se emviara el chat al driver.",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "listeners/listener_chat_encomienda.js",
    "groupTitle": "Chat_Pedido",
    "name": "Emit_clippAdministrador_envia_chat_audio"
  },
  {
    "type": "EMIT>CLIPP",
    "url": "/administrador_envia_chat_audio/",
    "title": "administrador_envia_chat_audio",
    "group": "Chat_Pedido",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Json",
            "optional": false,
            "field": "datosMensaje",
            "description": "<p>{idChat, usuario, idPedido, idCliente, idAplicacion, idPlataforma}</p>"
          },
          {
            "group": "Parameter",
            "type": "archivo",
            "optional": false,
            "field": "audio",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "ACK",
            "optional": false,
            "field": "function",
            "description": "<p>canal de respuesta inmediata.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "ACK": [
          {
            "group": "ACK",
            "type": "json",
            "optional": false,
            "field": "CLIPP",
            "description": "<p>{en: 1, m: &quot;Registrado correctamente.}</p>"
          }
        ],
        "ACK Error": [
          {
            "group": "ACK Error",
            "type": "json",
            "optional": false,
            "field": "KTAXI",
            "description": "<p>{error: CODIGO_ERROR};</p>"
          }
        ],
        "ESCUCHA": [
          {
            "group": "ESCUCHA",
            "type": "recibir_chat_audio_cliente",
            "optional": false,
            "field": "DRIVER",
            "description": "<p>{idChat, idPedido, idCliente, idAplicacion, idPlataforma, cliente:{nomres, telefono, correo} }</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "ACK:",
          "content": "Se devuleve el id del chat del pedido.",
          "type": "json"
        },
        {
          "title": "ACK_Error:",
          "content": "Se devolvera el caso de errores ya sea por conexion a base de datos erroneas entre otras",
          "type": "json"
        },
        {
          "title": "ESCUCHA:",
          "content": "Se emviara el chat al driver.",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "listeners/listener_chat.js",
    "groupTitle": "Chat_Pedido",
    "name": "Emit_clippAdministrador_envia_chat_audio"
  },
  {
    "type": "EMIT>CLIPP",
    "url": "/administrador_envia_chat_imagen/",
    "title": "administrador_envia_chat_imagen",
    "group": "Chat_Pedido",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Json",
            "optional": false,
            "field": "datosMensaje",
            "description": "<p>{idChat, usuario, idPedido, idCliente, idAplicacion, idPlataforma}</p>"
          },
          {
            "group": "Parameter",
            "type": "archivo",
            "optional": false,
            "field": "imagen",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "ACK",
            "optional": false,
            "field": "function",
            "description": "<p>canal de respuesta inmediata.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "ACK": [
          {
            "group": "ACK",
            "type": "json",
            "optional": false,
            "field": "CLIPP",
            "description": "<p>{en: 1, m: &quot;Registrado correctamente.}</p>"
          }
        ],
        "ACK Error": [
          {
            "group": "ACK Error",
            "type": "json",
            "optional": false,
            "field": "KTAXI",
            "description": "<p>{error: CODIGO_ERROR};</p>"
          }
        ],
        "ESCUCHA": [
          {
            "group": "ESCUCHA",
            "type": "recibir_chat_imagen_cliente",
            "optional": false,
            "field": "DRIVER",
            "description": "<p>{idChat, idPedido, idCliente, idAplicacion, idPlataforma, cliente:{nomres, telefono, correo} }</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "ACK:",
          "content": "Se devuleve el id del chat del pedido.",
          "type": "json"
        },
        {
          "title": "ACK_Error:",
          "content": "Se devolvera el caso de errores ya sea por conexion a base de datos erroneas entre otras",
          "type": "json"
        },
        {
          "title": "ESCUCHA:",
          "content": "Se emviara el chat al driver.",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "listeners/listener_chat.js",
    "groupTitle": "Chat_Pedido",
    "name": "Emit_clippAdministrador_envia_chat_imagen"
  },
  {
    "type": "EMIT>CLIPP",
    "url": "/administrador_envia_chat_imagen/",
    "title": "administrador_envia_chat_imagen",
    "group": "Chat_Pedido",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Json",
            "optional": false,
            "field": "datosMensaje",
            "description": "<p>{idChat, usuario, idPedido, idCliente, idAplicacion, idPlataforma}</p>"
          },
          {
            "group": "Parameter",
            "type": "archivo",
            "optional": false,
            "field": "imagen",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "ACK",
            "optional": false,
            "field": "function",
            "description": "<p>canal de respuesta inmediata.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "ACK": [
          {
            "group": "ACK",
            "type": "json",
            "optional": false,
            "field": "CLIPP",
            "description": "<p>{en: 1, m: &quot;Registrado correctamente.}</p>"
          }
        ],
        "ACK Error": [
          {
            "group": "ACK Error",
            "type": "json",
            "optional": false,
            "field": "KTAXI",
            "description": "<p>{error: CODIGO_ERROR};</p>"
          }
        ],
        "ESCUCHA": [
          {
            "group": "ESCUCHA",
            "type": "recibir_chat_imagen_cliente",
            "optional": false,
            "field": "DRIVER",
            "description": "<p>{idChat, idPedido, idCliente, idAplicacion, idPlataforma, cliente:{nomres, telefono, correo} }</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "ACK:",
          "content": "Se devuleve el id del chat del pedido.",
          "type": "json"
        },
        {
          "title": "ACK_Error:",
          "content": "Se devolvera el caso de errores ya sea por conexion a base de datos erroneas entre otras",
          "type": "json"
        },
        {
          "title": "ESCUCHA:",
          "content": "Se emviara el chat al driver.",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "listeners/listener_chat_encomienda.js",
    "groupTitle": "Chat_Pedido",
    "name": "Emit_clippAdministrador_envia_chat_imagen"
  },
  {
    "type": "EMIT>CLIPP",
    "url": "/administrador_envia_mensaje/",
    "title": "administrador_envia_mensaje",
    "group": "Chat_Pedido",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Json",
            "optional": false,
            "field": "datosMensaje",
            "description": "<p>{idPedido, usuario, idAdministrador, fecha, hora, mensaje, idAplicacion, idPlataforma, tipo, quienEnvia}</p>"
          },
          {
            "group": "Parameter",
            "type": "ACK",
            "optional": false,
            "field": "function",
            "description": "<p>canal de respuesta inmediata.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "ACK": [
          {
            "group": "ACK",
            "type": "json",
            "optional": false,
            "field": "CLIPP",
            "description": "<p>{idChat: 1}</p>"
          }
        ],
        "ACK Error": [
          {
            "group": "ACK Error",
            "type": "json",
            "optional": false,
            "field": "KTAXI",
            "description": "<p>{error: CODIGO_ERROR};</p>"
          }
        ],
        "ESCUCHA": [
          {
            "group": "ESCUCHA",
            "type": "recibir_chat_cliente",
            "optional": false,
            "field": "DRIVER",
            "description": "<p>{idPedido, idAdministradorEnvia, fecha, hora, mensaje, idAplicacion, idPlataforma, tipo, quienEnvia, cliente:{nomres, telefono, correo}}</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "ACK:",
          "content": "Se devuleve el id del chat del pedido.",
          "type": "json"
        },
        {
          "title": "ACK_Error:",
          "content": "Se devolvera el caso de errores ya sea por conexion a base de datos erroneas entre otras",
          "type": "json"
        },
        {
          "title": "ESCUCHA:",
          "content": "Se emviara el chat al driver.",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "listeners/listener_chat.js",
    "groupTitle": "Chat_Pedido",
    "name": "Emit_clippAdministrador_envia_mensaje"
  },
  {
    "type": "EMIT>CLIPP",
    "url": "/administrador_envia_mensaje/",
    "title": "administrador_envia_mensaje",
    "group": "Chat_Pedido",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Json",
            "optional": false,
            "field": "datosMensaje",
            "description": "<p>{idPedido, usuario, idAdministrador, fecha, hora, mensaje, idAplicacion, idPlataforma, tipo, quienEnvia}</p>"
          },
          {
            "group": "Parameter",
            "type": "ACK",
            "optional": false,
            "field": "function",
            "description": "<p>canal de respuesta inmediata.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "ACK": [
          {
            "group": "ACK",
            "type": "json",
            "optional": false,
            "field": "CLIPP",
            "description": "<p>{idChat: 1}</p>"
          }
        ],
        "ACK Error": [
          {
            "group": "ACK Error",
            "type": "json",
            "optional": false,
            "field": "KTAXI",
            "description": "<p>{error: CODIGO_ERROR};</p>"
          }
        ],
        "ESCUCHA": [
          {
            "group": "ESCUCHA",
            "type": "recibir_chat_cliente",
            "optional": false,
            "field": "DRIVER",
            "description": "<p>{idPedido, idAdministradorEnvia, fecha, hora, mensaje, idAplicacion, idPlataforma, tipo, quienEnvia, cliente:{nomres, telefono, correo}}</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "ACK:",
          "content": "Se devuleve el id del chat del pedido.",
          "type": "json"
        },
        {
          "title": "ACK_Error:",
          "content": "Se devolvera el caso de errores ya sea por conexion a base de datos erroneas entre otras",
          "type": "json"
        },
        {
          "title": "ESCUCHA:",
          "content": "Se emviara el chat al driver.",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "listeners/listener_chat_encomienda.js",
    "groupTitle": "Chat_Pedido",
    "name": "Emit_clippAdministrador_envia_mensaje"
  },
  {
    "type": "EMIT>CLIPP",
    "url": "/administrador_escribiendo_mensaje/",
    "title": "administrador_escribiendo_mensaje",
    "group": "Chat_Pedido",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Json",
            "optional": false,
            "field": "datosMensaje",
            "description": "<p>{idChat, usuario, idPedido, idAdministrador, idAplicacion, idPlataforma}</p>"
          },
          {
            "group": "Parameter",
            "type": "ACK",
            "optional": false,
            "field": "function",
            "description": "<p>canal de respuesta inmediata.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "ACK": [
          {
            "group": "ACK",
            "type": "json",
            "optional": false,
            "field": "CLIPP",
            "description": "<p>{en: 1, m: &quot;Registrado correctamente.}</p>"
          }
        ],
        "ACK Error": [
          {
            "group": "ACK Error",
            "type": "json",
            "optional": false,
            "field": "KTAXI",
            "description": "<p>{error: CODIGO_ERROR};</p>"
          }
        ],
        "ESCUCHA": [
          {
            "group": "ESCUCHA",
            "type": "escribiendo_chat_cliente",
            "optional": false,
            "field": "DRIVER",
            "description": "<p>{idChat, idPedido, idCliente, idAplicacion, idPlataforma, cliente:{nomres, telefono, correo} }</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "ACK:",
          "content": "Se devuleve el id del chat del pedido.",
          "type": "json"
        },
        {
          "title": "ACK_Error:",
          "content": "Se devolvera el caso de errores ya sea por conexion a base de datos erroneas entre otras",
          "type": "json"
        },
        {
          "title": "ESCUCHA:",
          "content": "Se emviara el chat al driver.",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "listeners/listener_chat.js",
    "groupTitle": "Chat_Pedido",
    "name": "Emit_clippAdministrador_escribiendo_mensaje"
  },
  {
    "type": "EMIT>CLIPP",
    "url": "/administrador_escribiendo_mensaje/",
    "title": "administrador_escribiendo_mensaje",
    "group": "Chat_Pedido",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Json",
            "optional": false,
            "field": "datosMensaje",
            "description": "<p>{idChat, usuario, idPedido, idAdministrador, idAplicacion, idPlataforma}</p>"
          },
          {
            "group": "Parameter",
            "type": "ACK",
            "optional": false,
            "field": "function",
            "description": "<p>canal de respuesta inmediata.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "ACK": [
          {
            "group": "ACK",
            "type": "json",
            "optional": false,
            "field": "CLIPP",
            "description": "<p>{en: 1, m: &quot;Registrado correctamente.}</p>"
          }
        ],
        "ACK Error": [
          {
            "group": "ACK Error",
            "type": "json",
            "optional": false,
            "field": "KTAXI",
            "description": "<p>{error: CODIGO_ERROR};</p>"
          }
        ],
        "ESCUCHA": [
          {
            "group": "ESCUCHA",
            "type": "escribiendo_chat_cliente",
            "optional": false,
            "field": "DRIVER",
            "description": "<p>{idChat, idPedido, idCliente, idAplicacion, idPlataforma, cliente:{nomres, telefono, correo} }</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "ACK:",
          "content": "Se devuleve el id del chat del pedido.",
          "type": "json"
        },
        {
          "title": "ACK_Error:",
          "content": "Se devolvera el caso de errores ya sea por conexion a base de datos erroneas entre otras",
          "type": "json"
        },
        {
          "title": "ESCUCHA:",
          "content": "Se emviara el chat al driver.",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "listeners/listener_chat_encomienda.js",
    "groupTitle": "Chat_Pedido",
    "name": "Emit_clippAdministrador_escribiendo_mensaje"
  },
  {
    "type": "EMIT>CLIPP",
    "url": "/administrador_estado_mensaje/",
    "title": "administrador_estado_mensaje",
    "group": "Chat_Pedido",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Json",
            "optional": false,
            "field": "datosMensaje",
            "description": "<p>{idChat, usuario, idPedido, idCliente, fecha, hora, idAplicacion, idPlataforma, estado(1:Llego_servidor,2:Recibido,3:Leido)}</p>"
          },
          {
            "group": "Parameter",
            "type": "ACK",
            "optional": false,
            "field": "function",
            "description": "<p>canal de respuesta inmediata.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "ACK": [
          {
            "group": "ACK",
            "type": "json",
            "optional": false,
            "field": "CLIPP",
            "description": "<p>{en: 1, m: &quot;Registrado correctamente.}</p>"
          }
        ],
        "ACK Error": [
          {
            "group": "ACK Error",
            "type": "json",
            "optional": false,
            "field": "KTAXI",
            "description": "<p>{error: CODIGO_ERROR};</p>"
          }
        ],
        "ESCUCHA": [
          {
            "group": "ESCUCHA",
            "type": "estado_chat_cliente",
            "optional": false,
            "field": "DRIVER",
            "description": "<p>{idChat, idPedido, idCliente, fecha, hora, idAplicacion, idPlataforma, estado(1:Llego_servidor,2:Recibido,3:Leido),cliente:{nomres, telefono, correo}}</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "ACK:",
          "content": "Se devuleve el id del chat del pedido.",
          "type": "json"
        },
        {
          "title": "ACK_Error:",
          "content": "Se devolvera el caso de errores ya sea por conexion a base de datos erroneas entre otras",
          "type": "json"
        },
        {
          "title": "ESCUCHA:",
          "content": "Se emviara el chat al driver.",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "listeners/listener_chat_encomienda.js",
    "groupTitle": "Chat_Pedido",
    "name": "Emit_clippAdministrador_estado_mensaje"
  },
  {
    "type": "EMIT>CLIPP",
    "url": "/administrador_estado_mensaje/",
    "title": "administrador_estado_mensaje",
    "group": "Chat_Pedido",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Json",
            "optional": false,
            "field": "datosMensaje",
            "description": "<p>{idChat, usuario, idPedido, idCliente, fecha, hora, idAplicacion, idPlataforma, estado(1:Llego_servidor,2:Recibido,3:Leido)}</p>"
          },
          {
            "group": "Parameter",
            "type": "ACK",
            "optional": false,
            "field": "function",
            "description": "<p>canal de respuesta inmediata.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "ACK": [
          {
            "group": "ACK",
            "type": "json",
            "optional": false,
            "field": "CLIPP",
            "description": "<p>{en: 1, m: &quot;Registrado correctamente.}</p>"
          }
        ],
        "ACK Error": [
          {
            "group": "ACK Error",
            "type": "json",
            "optional": false,
            "field": "KTAXI",
            "description": "<p>{error: CODIGO_ERROR};</p>"
          }
        ],
        "ESCUCHA": [
          {
            "group": "ESCUCHA",
            "type": "estado_chat_cliente",
            "optional": false,
            "field": "DRIVER",
            "description": "<p>{idChat, idPedido, idCliente, fecha, hora, idAplicacion, idPlataforma, estado(1:Llego_servidor,2:Recibido,3:Leido),cliente:{nomres, telefono, correo}}</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "ACK:",
          "content": "Se devuleve el id del chat del pedido.",
          "type": "json"
        },
        {
          "title": "ACK_Error:",
          "content": "Se devolvera el caso de errores ya sea por conexion a base de datos erroneas entre otras",
          "type": "json"
        },
        {
          "title": "ESCUCHA:",
          "content": "Se emviara el chat al driver.",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "listeners/listener_chat.js",
    "groupTitle": "Chat_Pedido",
    "name": "Emit_clippAdministrador_estado_mensaje"
  },
  {
    "type": "EMIT>CLIPP",
    "url": "/cliente_envia_chat_audio/",
    "title": "cliente_envia_chat_audio",
    "group": "Chat_Pedido",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Json",
            "optional": false,
            "field": "datosMensaje",
            "description": "<p>{idChat, usuario, idPedido, idCliente, idAplicacion, idPlataforma}</p>"
          },
          {
            "group": "Parameter",
            "type": "archivo",
            "optional": false,
            "field": "audio",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "ACK",
            "optional": false,
            "field": "function",
            "description": "<p>canal de respuesta inmediata.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "ACK": [
          {
            "group": "ACK",
            "type": "json",
            "optional": false,
            "field": "CLIPP",
            "description": "<p>{en: 1, m: &quot;Registrado correctamente.}</p>"
          }
        ],
        "ACK Error": [
          {
            "group": "ACK Error",
            "type": "json",
            "optional": false,
            "field": "KTAXI",
            "description": "<p>{error: CODIGO_ERROR};</p>"
          }
        ],
        "ESCUCHA": [
          {
            "group": "ESCUCHA",
            "type": "recibir_chat_audio_administrador",
            "optional": false,
            "field": "DRIVER",
            "description": "<p>{idChat, idPedido, idCliente, idAplicacion, idPlataforma, cliente:{nomres, telefono, correo} }</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "ACK:",
          "content": "Se devuleve el id del chat del pedido.",
          "type": "json"
        },
        {
          "title": "ACK_Error:",
          "content": "Se devolvera el caso de errores ya sea por conexion a base de datos erroneas entre otras",
          "type": "json"
        },
        {
          "title": "ESCUCHA:",
          "content": "Se emviara el chat al driver.",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "listeners/listener_chat.js",
    "groupTitle": "Chat_Pedido",
    "name": "Emit_clippCliente_envia_chat_audio"
  },
  {
    "type": "EMIT>CLIPP",
    "url": "/cliente_envia_chat_imagen/",
    "title": "cliente_envia_chat_imagen",
    "group": "Chat_Pedido",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Json",
            "optional": false,
            "field": "datosMensaje",
            "description": "<p>{idChat, usuario, idPedido, idCliente, idAplicacion, idPlataforma}</p>"
          },
          {
            "group": "Parameter",
            "type": "archivo",
            "optional": false,
            "field": "imagen",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "ACK",
            "optional": false,
            "field": "function",
            "description": "<p>canal de respuesta inmediata.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "ACK": [
          {
            "group": "ACK",
            "type": "json",
            "optional": false,
            "field": "CLIPP",
            "description": "<p>{en: 1, m: &quot;Registrado correctamente.}</p>"
          }
        ],
        "ACK Error": [
          {
            "group": "ACK Error",
            "type": "json",
            "optional": false,
            "field": "KTAXI",
            "description": "<p>{error: CODIGO_ERROR};</p>"
          }
        ],
        "ESCUCHA": [
          {
            "group": "ESCUCHA",
            "type": "recibir_chat_imagen_administrador",
            "optional": false,
            "field": "DRIVER",
            "description": "<p>{idChat, idPedido, idCliente, idAplicacion, idPlataforma, cliente:{nomres, telefono, correo} }</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "ACK:",
          "content": "Se devuleve el id del chat del pedido.",
          "type": "json"
        },
        {
          "title": "ACK_Error:",
          "content": "Se devolvera el caso de errores ya sea por conexion a base de datos erroneas entre otras",
          "type": "json"
        },
        {
          "title": "ESCUCHA:",
          "content": "Se emviara el chat al driver.",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "listeners/listener_chat.js",
    "groupTitle": "Chat_Pedido",
    "name": "Emit_clippCliente_envia_chat_imagen"
  },
  {
    "type": "EMIT>CLIPP",
    "url": "/cliente_envia_mensaje/",
    "title": "cliente_envia_mensaje",
    "group": "Chat_Pedido",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Json",
            "optional": false,
            "field": "datosMensaje",
            "description": "<p>{idPedido, usuario, idCliente, fecha, hora, mensaje, idAplicacion, idPlataforma, tipo, quienEnvia}</p>"
          },
          {
            "group": "Parameter",
            "type": "ACK",
            "optional": false,
            "field": "function",
            "description": "<p>canal de respuesta inmediata.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "ACK": [
          {
            "group": "ACK",
            "type": "json",
            "optional": false,
            "field": "CLIPP",
            "description": "<p>{idChat: 1}</p>"
          }
        ],
        "ACK Error": [
          {
            "group": "ACK Error",
            "type": "json",
            "optional": false,
            "field": "KTAXI",
            "description": "<p>{error: CODIGO_ERROR};</p>"
          }
        ],
        "ESCUCHA": [
          {
            "group": "ESCUCHA",
            "type": "recibir_chat_administrador",
            "optional": false,
            "field": "DRIVER",
            "description": "<p>{idPedido, idClienteEnvia, fecha, hora, mensaje, idAplicacion, idPlataforma, tipo, quienEnvia, cliente:{nomres, telefono, correo}}</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "ACK:",
          "content": "Se devuleve el id del chat del pedido.",
          "type": "json"
        },
        {
          "title": "ACK_Error:",
          "content": "Se devolvera el caso de errores ya sea por conexion a base de datos erroneas entre otras",
          "type": "json"
        },
        {
          "title": "ESCUCHA:",
          "content": "Se emviara el chat al driver.",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "listeners/listener_chat.js",
    "groupTitle": "Chat_Pedido",
    "name": "Emit_clippCliente_envia_mensaje"
  },
  {
    "type": "EMIT>CLIPP",
    "url": "/cliente_escribiendo_mensaje/",
    "title": "cliente_escribiendo_mensaje",
    "group": "Chat_Pedido",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Json",
            "optional": false,
            "field": "datosMensaje",
            "description": "<p>{idChat, usuario, idPedido, idCliente, idAplicacion, idPlataforma}</p>"
          },
          {
            "group": "Parameter",
            "type": "ACK",
            "optional": false,
            "field": "function",
            "description": "<p>canal de respuesta inmediata.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "ACK": [
          {
            "group": "ACK",
            "type": "json",
            "optional": false,
            "field": "CLIPP",
            "description": "<p>{en: 1, m: &quot;Registrado correctamente.}</p>"
          }
        ],
        "ACK Error": [
          {
            "group": "ACK Error",
            "type": "json",
            "optional": false,
            "field": "KTAXI",
            "description": "<p>{error: CODIGO_ERROR};</p>"
          }
        ],
        "ESCUCHA": [
          {
            "group": "ESCUCHA",
            "type": "escribiendo_chat_administrador",
            "optional": false,
            "field": "DRIVER",
            "description": "<p>{idChat, idPedido, idCliente, idAplicacion, idPlataforma, cliente:{nomres, telefono, correo} }</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "ACK:",
          "content": "Se devuleve el id del chat del pedido.",
          "type": "json"
        },
        {
          "title": "ACK_Error:",
          "content": "Se devolvera el caso de errores ya sea por conexion a base de datos erroneas entre otras",
          "type": "json"
        },
        {
          "title": "ESCUCHA:",
          "content": "Se emviara el chat al driver.",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "listeners/listener_chat.js",
    "groupTitle": "Chat_Pedido",
    "name": "Emit_clippCliente_escribiendo_mensaje"
  },
  {
    "type": "EMIT>CLIPP",
    "url": "/cliente_estado_mensaje/",
    "title": "cliente_estado_mensaje",
    "group": "Chat_Pedido",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Json",
            "optional": false,
            "field": "datosMensaje",
            "description": "<p>{idChat, usuario, idPedido, idCliente, fecha, hora, idAplicacion, idPlataforma, estado(1:Llego_servidor,2:Recibido,3:Leido)}</p>"
          },
          {
            "group": "Parameter",
            "type": "ACK",
            "optional": false,
            "field": "function",
            "description": "<p>canal de respuesta inmediata.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "ACK": [
          {
            "group": "ACK",
            "type": "json",
            "optional": false,
            "field": "CLIPP",
            "description": "<p>{en: 1, m: &quot;Registrado correctamente.}</p>"
          }
        ],
        "ACK Error": [
          {
            "group": "ACK Error",
            "type": "json",
            "optional": false,
            "field": "KTAXI",
            "description": "<p>{error: CODIGO_ERROR};</p>"
          }
        ],
        "ESCUCHA": [
          {
            "group": "ESCUCHA",
            "type": "estado_chat_administrador",
            "optional": false,
            "field": "DRIVER",
            "description": "<p>{idChat, idPedido, idCliente, fecha, hora, idAplicacion, idPlataforma, estado(1:Llego_servidor,2:Recibido,3:Leido),cliente:{nomres, telefono, correo}}</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "ACK:",
          "content": "Se devuleve el id del chat del pedido.",
          "type": "json"
        },
        {
          "title": "ACK_Error:",
          "content": "Se devolvera el caso de errores ya sea por conexion a base de datos erroneas entre otras",
          "type": "json"
        },
        {
          "title": "ESCUCHA:",
          "content": "Se emviara el chat al driver.",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "listeners/listener_chat.js",
    "groupTitle": "Chat_Pedido",
    "name": "Emit_clippCliente_estado_mensaje"
  }
] });
