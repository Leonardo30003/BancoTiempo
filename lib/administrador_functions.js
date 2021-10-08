
module.exports={imprimirOneLogs:imprimirOneLogs,imprimirLogs:imprimirLogs,imprimirErrLogs:imprimirErrLogs};function imprimirOneLogs(log){console.log('ID_APP: '+ID_APP+' '+MOMENT().tz('America/Guayaquil').format().replace(/T/,' ').replace(/\..+/,'').substring(0,19)+': '+log);}
function imprimirLogs(log){if(IS_DESARROLLO)
console.log('ID_APP: '+ID_APP+' '+MOMENT().tz('America/Guayaquil').format().replace(/T/,' ').replace(/\..+/,'').substring(0,19)+': '+log);}
function imprimirErrLogs(log){console.log('ID_APP: '+ID_APP+' '+MOMENT().tz('America/Guayaquil').format().replace(/T/,' ').replace(/\..+/,'').substring(0,19)+' ERROR >>> :'+log);}