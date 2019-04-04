/**
 * API para transformacao de documentos
 * Utiliza o Carbone.IO (http://carbone.io/)
 * 
 * @author Andre Santana
 * @version 1.0
 * @date 08/03/2019
 */
const fs = require('fs');
const carbone = require('carbone');
const mainConfig = require('./config/config.js');
const utilFunctions = require('./util/util.js');
var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');

var uploads = multer({dest : global.env.upload_path}).single('documento');
var app = express();
app.use(bodyParser.json());

/**
 * Root diretorio 
 */
app.get('/', function (req, res) {
    res.send({'msg' :  `${global.messages.root_dir} ${new Date().getFullYear()}`});
})

/**
 * Ponto de entrada para transformacao de arquivo
 */
app.post('/api/v1/documento/:docType',  function (req, res) {

  uploads(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      res.status(404).send({'msg' : `${ global.messages.multer_upload_err} ${err}` });      
    } else if (err) {
      res.status(404).send({'msg' : `${ global.messages.req_err} ${err}` });
    }

      if (!req.is('multipart/form-data')) {
        res.status(404).send({'msg' : `${ global.messages.header_not_found}` });
      }
      
      try {

          if (JSON.stringify(req.body) == '{}') {
            res.status(404).send({'msg' : global.messages.param_body});
          }

          if (req.file === undefined) {
            res.status(404).send({'msg' : global.messages.param_file});
          }
        
          // Dados para inserir no arquivo
          var data = req.body;
          var template = req.file.filename;
          var docType = '.odt';
          
          if (req.params.docType != undefined) {
            docType = req.params.docType;
            docType = utilFunctions.stringSanitize(docType);
          }

          //console.log(req.file);
          //console.log(req.body);
          //console.log(docType);

          carbone.set({
            lang : 'pt-br'
          });

          // Gera o arquivo usando o template 
          carbone.render(global.env.upload_path + template, data, function(err, result){
            if (err) {
              res.status(500).send({'msg' : `${global.messages.gen_file_err} ${err}`})
              return
            }

            // arquivo para realizar o download
            downloadFile = global.env.download_path + template + '.' + docType;

            // grava o arquivo
            fs.writeFileSync(downloadFile, result);
            //remove o arquivo de template
            fs.unlinkSync(global.env.upload_path + template);

            if (fs.existsSync(downloadFile)) {
              res.download(downloadFile, function(err) {
                  if (!err) {
                    fs.unlinkSync(downloadFile);
                  } else {
                    res.status(404).send({'msg' : `${global.messages.download_err} ${err}`})
                  }
              });
            }

            //process.exit();
          }); 
      
        } catch (e) {
          console.log('API Transform - [ %s ] Houve um erro na API = %s', Date.now(), e);
        }
  });
})


// Iniciar o servidor de app
var server = app.listen(global.env.node_port, function () {
  var host = server.address().address
  var port = server.address().port
  
  paths = [global.env.download_path,global.env.upload_path];
  utilFunctions.validatePathAndCreateFolder(paths);
  
  console.log('API Transform - [ %s ] Paths de download e upload configurados.', Date.now())
  console.log('API Transform - [ %s ] Servidor iniciado em http://%s:%s', Date.now(), host, port)
})
