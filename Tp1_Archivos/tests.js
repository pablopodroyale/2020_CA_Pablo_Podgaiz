var http = require('http');
var functions  = require('./functions.js');

http.createServer(function (req, res) {
 
    functions.leerArchivoComoString('./demofile.html',res);
  
    functions.escribirTextoEnArchivo("F:\\ort\\Tercero_2\\CA\\Tps\\Tp1_Archivos","hola mundo",true);

    let resultTransformarStringEnArrayDeNumeros = functions.transformarStringEnArrayDeNumeros("123 | 456 | 789 | 1bc | 10", "|");
    console.log(resultTransformarStringEnArrayDeNumeros);


    let resultTransformarArrayDeNumerosAUnSoloString = functions.transformarArrayDeNumerosAUnSoloString([123, 456, 789, 10], ",");
    console.log(resultTransformarArrayDeNumerosAUnSoloString);

    let resultCombinarDosArrays = functions.combinarDosArrays([1, 5, 10],[1,2, 3, 8, 11]);
    console.log(resultCombinarDosArrays);

    let resultCombinarNArrays = functions.combinarNArrays([[1, 10], [2, 3, 15, 16], [4], [6, 7, 13]]);
    console.log(resultCombinarNArrays);
    // res.writeHead(200, {'Content-Type': 'text/html'});
    // res.write(result);
    // res.end();
}).listen(8082);