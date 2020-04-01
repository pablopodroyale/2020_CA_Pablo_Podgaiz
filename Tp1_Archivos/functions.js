var fs = require('fs');


exports.leerArchivoComoString = function (path,res) {
    return fs.readFileSync(path, function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
      });
  };

  exports.escribirTextoEnArchivo = function (path, text, flag){
    let archivo = "test.txt";
    if(fs.existsSync( path )) {
        if(flag){
            fs.writeFileSync( path + "\\"  + archivo , text );
        }else{
            throw "El archivo no existe";
            ("el archivo no existe");
            
            // console.log("el archivo no existe");
        }
    } 
  };

  exports.transformarStringEnArrayDeNumeros = function (texto,separador){
    let arr = texto.split(separador);
    let result = [];
    for (let index = 0; index < arr.length; index++) {
        let element = arr[index];
        if(!isNaN(element) ){
            result.push(element);
        }
    }
    return result;
  };


  exports.transformarArrayDeNumerosAUnSoloString = function (arr,separador){
    let result = "";
    for (let index = 0; index < arr.length; index++) {
        let element = arr[index];
        result = result + element;
        if(index < arr.length - 1){
            result = result + separador;
        }
    }
    return result;
  };

  function combinarDosArrays (arrUno,arrDos){
    let result = arrUno.concat(arrDos);
    result.sort(function(a, b){return a - b});
    result = [...new Set(result)]
    return result;
  };

  exports.combinarDosArrays = combinarDosArrays;

  exports.combinarNArrays = function (arr){
    let arrAux = [];
    let result = [];
     //Si hay uno
    if(arr.length == 1){
        result = arr[0];
    }
    //Si hay 2
    else if(arr.length == 2){
        result = combinarDosArrays(arr[0],arr[1]);
    //SI hay mas de 2
    }else{
        result = combinarDosArrays(arr[0],arr[1]);
        for (let index = 2; index < arr.length; index++) {
            let item = arr[index];
            result = combinarDosArrays(result, item);
        }
    return result;
    };
}
  