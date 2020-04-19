const fs = require('fs');
const path = require('path');
const fsp = fs.promises;
const util = require('util');
const sha1 = require('sha1');

//1)
backupSync("F:\\ort\\Tercero_2\\CA\\Tps\\2020_CA_Pablo_Podgaiz\\Tp3\\backup");
//2)
backupAsync("F:\\ort\\Tercero_2\\CA\\Tps\\2020_CA_Pablo_Podgaiz\\Tp3\\backup");
//3)a)
backupWithPromiseThenCatch("F:\\ort\\Tercero_2\\CA\\Tps\\2020_CA_Pablo_Podgaiz\\Tp3\\backup");
//3)b)
backupWithAsyncAwait("F:\\ort\\Tercero_2\\CA\\Tps\\2020_CA_Pablo_Podgaiz\\Tp3\\backup");



/**
 * Modularizo la lectura sync
 * @param {*} dir 
 */
function readFilesSync(dir) {
    const files = [];
  
    fs.readdirSync(dir).forEach(filename => {
      const name = path.parse(filename).name;
      const ext = path.parse(filename).ext;
      const filepath = path.resolve(dir, filename);
      const stat = fs.statSync(filepath);
      const isFile = stat.isFile();
  
      if (isFile) {
          files.push({ filepath, name, ext });
        }
    });
    return files;
  }

  function writeAllFiles(files, pathBackup) {
      try {
        if (!fs.existsSync(pathBackup)){
            fs.mkdirSync(pathBackup);
        }
          files.forEach(file => {
              if (path.basename(file.filepath).substring(0,1) != ".") {
                fs.writeFileSync(path.join(pathBackup,path.basename(file.filepath)), 'utf8');
              }
             
          });
      } catch (error) {
          console.log(error);
      }
  }

  function backupSync(dir) {
    var files =  readFilesSync(dir);
    let  dest  = createRandomPath(dir);
    writeAllFiles(files,dest);
  }

  async function  readFilesAsync(path){
    const files = [];
    fs.readdir(path, (error, nombres) => {
      if (error) {
      console.log(error);
      } else {
      // hacer algo con los nombres!
          nombres.forEach(element => {
              files.push(element);
        });;
      }
      })
    return files;
  }

  async function backupAsync (dir) {
    let  dest  = createRandomPath(dir);
    let files = [];
      fs.readdir(dir, (error, nombres) => {
      if (error) {
      // hubo un error, no pude leer la carpeta! hacer algo!
      } else {
      // hacer algo con los nombres!
        nombres.forEach(element => {
            if (element.substring(0,1) != "." && fs.statSync(path.join(dir,element)).isFile()) {
                files.push(path.join(dir,element));
            }
        });
        files.forEach(element => {
          fs.copyFile(element, path.join(dest,path.basename(element) ), (err) => {
            if (err) throw err;
            
            console.log('source.txt was copied to destination.txt');
          });
        });
      }
      })
    }

    function backupWithPromiseThenCatch (dir) {
      let files = [];
      let  dest  = createRandomPath(dir);
     
      fs.readdir(dir, (error, nombres) => {
      if (error) {
      // hubo un error, no pude leer la carpeta! hacer algo!
      } else {
      // hacer algo con los nombres!
        nombres.forEach(element => {
            if (element.substring(0,1) != "." && fs.statSync(path.join(dir,element)).isFile()) {
                files.push(path.join(dir,element));
            }
        });
        files.forEach(element => {
          fsp.copyFile(element, path.join(dest,path.basename(element)) )
           .then(result => console.log('archivo copiado'))
           .catch(error => {console.log('error copiando archivo')})
        });
      }
      })
    }

    async function backupWithAsyncAwait (dir) {
      let files = [];
      let  dest  = createRandomPath(dir);
        try {
          files = await fsp.readdir(dir);
          files.forEach(element => {
            if (element.substring(0,1) != "." && fs.statSync(path.join(dir,element)).isFile()) {
              fsp.copyFile(path.join(dir,element), path.join(dest,path.basename(element)) )
              .then(result => console.log('archivo copiado'))
              .catch(error => {console.log('error copiando archivo')})
            }
          });
        }catch (err) {
            console.log(err);
          }
      }

function createRandomPath(dir) {
  let hash_Path = sha1(Math.random()).toString().substring(0, 6);
  let path_Dest = "\\backup" + hash_Path;
  let dest = path.join(dir + path_Dest);
  try {
    fs.mkdirSync(dest);
  }
  catch (err) {
    if (err.code !== 'EEXIST')
      throw err;
  }
  return dest;
}
