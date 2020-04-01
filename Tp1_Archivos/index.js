var http = require('http');
var functions  = require('./functions.js');

http.createServer(function (req, res) {
 
  //functions.leerArchivoComoString('./demofile.html',res);
  
  // functions.escribirTextoEnArchivo("F:\\ort\\Tercero_2\\CA\\Tps\\Tp1_Archivos","hola mundo",false);
    // let result = functions.transformarStringEnArrayDeNumeros("123 | 456 | 789 | 1bc | 10", "|");
    // let result = functions.transformarArrayDeNumerosAUnSoloString([123, 456, 789, 10], ",");
    let result = functions.combinarDosArrays([1, 5, 10],[1,2, 3, 8, 11]);
    res.writeHead(200, {'Content-Type': 'text/html'});
    // res.write(result);
    res.end(result.toString());
}).listen(8081);