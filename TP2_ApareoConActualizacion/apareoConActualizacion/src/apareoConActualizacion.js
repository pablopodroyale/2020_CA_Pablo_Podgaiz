// importar lo que sea necesario
import * as fs from 'fs';
import * as util from 'util';
const ERROR_FILE_NOT_EXIST = "Directorio o archivo inexistente";
const ERORR_NO_EXISTE_PAGO = "el siguiente pago no corresponde a ninguna deuda:";
const ERORR_NO_EXISTE_APELLIDO = "error al querer actualizar esta deuda:";
const SE_MANTIENE_REGISTRO = "se mantiene el registro original sin cambios";

/**
 * ordena (in place) una coleccion de datos segun las claves provistas.
 * @param {Object[]} coleccion el array que quiero ordenar
 * @param {string[]} claves las claves por las que quiero ordenar, por orden de importancia
 */
function ordenar(coleccion, claves) {
 
return coleccion.sort(sortByMultipleKey(claves));
}
function sortByMultipleKey(claves) {
    return function(a, b) {
        if (claves.length == 0) return 0; // force to equal if keys run out
        let key = claves[0]; // take out the first key
        if (a[key] < b[key]) return -1; // will be 1 if DESC
        else if (a[key] > b[key]) return 1; // will be -1 if DESC
        else return sortByMultipleKey(claves.slice(1))(a, b);
    }
}


/**
 * recibe las rutas del archivo de deudas original, archivo de pagos, archivo de deudas con las actualizaciones, y archivo de log para registrar errores o advertencias.
 * @param {string} rutaDeudasOld
 * @param {string} rutaPagos
 * @param {string} rutaDeudasNew
 * @param {string} rutaLog
 */

 /**
  * 
  * @param {*} error 
  * @param {*} resultado 
  */

const loggerNoExistePago = (error, ruta, obj) => {
    fs.appendFileSync( ruta, error + '\n' + obj + '\n=================================\n');
}

const loggersaldoAFavor = (ruta, obj) => {
    fs.appendFileSync( ruta, '\n' + 
                    "dni" + ": " + obj.dni + " posee $" + Math.abs(obj.debe) + " a su favor"
        + '\n=================================\n'
    );
}

/**
 * 
 * @param {*} error 
 * @param {*} texto2 
 * @param {*} resultado 
 * @param {*} ruta 
 * @param {*} deuda 
 * @param {*} pago 
 */
const loggerNoApellido = (error,texto2, ruta, deuda, pago) => {
    if (error) {
        fs.appendFileSync( ruta,'\n=================================\n'+ error + '\n' + deuda + '\n' + texto2 + '\n' + pago + '\n=================================\n');
    } 
}
const loggerResultDeudas = (ruta, deudas) => {
    fs.writeFileSync( ruta, deudas);
}

function actualizarArchivosDeudas(rutaDeudasOld, rutaPagos, rutaDeudasNew, rutaLog) {
    // esta función será mi callback!
   let deudasOldObj;
   let pagosObj;
    if(!fs.existsSync(rutaDeudasOld) || !fs.existsSync(rutaPagos) || !fs.existsSync(rutaDeudasNew) || !fs.existsSync(rutaLog) ){
        throw new Error(ERROR_FILE_NOT_EXIST);
   }else{
    deudasOldObj = JSON.parse(fs.readFileSync(rutaDeudasOld));
    pagosObj = JSON.parse(fs.readFileSync(rutaPagos));
    deudasOldObj =  ordenar(deudasOldObj,["dni","apellido"]);
    pagosObj =  ordenar(pagosObj,["dni","apellido"]);
     actualizarDeudas(deudasOldObj, pagosObj, loggerNoExistePago,loggerNoApellido,rutaLog, rutaDeudasNew );
   }
   
}

/**
 * @callback loggerCallback
 * @param {string} error error message to display
 */

/**
 * realiza el apareo con actualizacion entre deudas y pagos, y loguea algunos eventos relevantes.
 * @param {Object[]} deudas las deudas originales
 * @param {Object[]} pagos los pagos a aplicar
 * @param {loggerCallback} loggerNoExistePago funcion a la cual llamar en caso de necesitar loguear un evento
 * @returns {Object[]} las deudas actualizadas
 */
function actualizarDeudas(deudas, pagos, loggerNoExistePago,loggerNoApellido,rutaLog,rutaDeudasNew) {
    let indexDeudas = 0;
    let indexPagos = 0;
    let deudaAnt = deudas[indexDeudas];
    let pagoAnt = pagos[indexPagos];
    let result = {
        table : []
   };
    while (indexDeudas < deudas.length || indexPagos < pagos.length) {
        while (indexDeudas < deudas.length && indexPagos < pagos.length  && pagoAnt.dni == deudaAnt.dni || deudaAnt.dni > pagoAnt.dni) {
             //Si aparece un registro de pago que coincide con una deuda en su dni pero no en su
            //apellido, el mismo no se procesa, y se deben loguear ambos, la deuda y el pago.
            if (deudaAnt.dni === pagoAnt.dni && deudaAnt.apellido !== pagoAnt.apellido) {
                loggerNoApellido(ERORR_NO_EXISTE_APELLIDO, SE_MANTIENE_REGISTRO,rutaLog,util.inspect(deudaAnt),util.inspect(pagoAnt));
            }
             //Coincide la deuda y el pago, asi que descuento el pago
            else if(deudaAnt.dni === pagoAnt.dni && deudaAnt.dni === pagoAnt.dni){
                deudaAnt.debe = deudaAnt.debe - pagoAnt.pago;
            }else if( deudaAnt.dni > pagoAnt.dni){
                loggerNoExistePago(ERORR_NO_EXISTE_PAGO,rutaLog,util.inspect(pagoAnt));
            }
            //Si aparece un registro de pago con un dni que no coincide con el de ninguna deuda, ese
            //registro no se procesa, y se debe loguear como operación inválida.
            else{
                loggerNoExistePago(ERORR_NO_EXISTE_PAGO,rutaLog,util.inspect(pagoAnt));
            }
            indexPagos += 1;
            pagoAnt = pagos[indexPagos];
        }
        if (deudaAnt.debe > 0) {
            result.table.push(deudaAnt);
          
        }else{
            if (deudaAnt.debe < 0) {
                loggersaldoAFavor(rutaLog,deudaAnt);
            }
        }
        indexDeudas += 1;
        deudaAnt =  deudas[indexDeudas];
        //Si aparece un registro de pago con un dni que no coincide con el de ninguna deuda, ese
        //registro no se procesa, y se debe loguear como operación inválida.
       if (indexDeudas == deudas.length) {
        loggerNoExistePago(ERORR_NO_EXISTE_PAGO,rutaLog,util.inspect(pagoAnt));
        indexPagos +=1;
            while ( indexPagos < pagos.length) {
                pagoAnt = pagos[indexPagos];
                indexPagos +=1;
            }   
        }
    }
    loggerResultDeudas(rutaDeudasNew,JSON.stringify(result,null,4));
}

/**
 * arma un mensaje informando los detalles de un pago que no corresponde a ninguna deuda
 * @param {Object} pago el pago sin deuda correspondiente
 * @returns {string} el mensaje a logguear
 */
function armarMsgPagoSinDeudaAsociada(pago) {
    const logMsg = `
el siguiente pago no corresponde a ninguna deuda:
${util.inspect(pago)}

=================================
`
    return logMsg
}

/**
 * arma un mensaje indicando el dni del sujeto que pagó de más, y cuanto dinero quedó a su favor
 * @param {Object} deuda la deuda con excedente de pago
 * @returns {string} el mensaje a logguear
 */
function armarMsgPagoDeMas(deuda) {
    const logMsg = `
dni: ${deuda.dni} posee $${Math.abs(deuda.debe)} a su favor

=================================
`
    return logMsg
}

/**
 * arma un mensaje mostrando la deuda, y el pago que no se pudo concretar, y notifica que el registro permanece sin cambios.
 * @param {Object} deuda
 * @param {Object} pago
 * @returns {string} el mensaje a logguear
 */
function armarMsgPagoConDatosErroneos(deuda, pago) {
    const logMsg = `
error al querer actualizar esta deuda:
${util.inspect(deuda)}
con este pago:
${util.inspect(pago)}

se mantiene el registro original sin cambios

=================================
`
    return logMsg
}

// no modificar la interfaz pública!
export default {
    actualizarArchivosDeudas
}
