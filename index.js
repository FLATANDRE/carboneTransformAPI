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
var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');

var uploads = multer({dest : global.env.upload_path});

var app = express();
app.use(bodyParser.json());

/**
 * Root diretorio 
 */
app.get('/', function (req, res) {
    res.send({'msg' :  `${global.messages} ${new Date().getFullYear()}`});
})

/**
 * Ponto de entrada para transformacao de arquivo
 */
app.post('/api/v1/documento', uploads.single('documento'),  function (req, res) {

  //if (!req.is('application/json')) {
  //  res.status(404).send({'msg' : 'Header content-type faltando.'});
  //}
  
  if (JSON.stringify(req.body) == '{}') {
    res.status(404).send({'msg' : global.messages.param_body});
  }

  if (req.file === undefined) {
    res.status(404).send({'msg' : global.messages.param_file});
  }

  console.log(req.file);
  console.log(req.body);

  // Data to inject
  var data = req.body;
  var template = req.file.filename;
  
  var options = {
    convertTo : 'docx' //can be docx, txt, ...
  };

  // Generate a report using the sample template provided by carbone module
  carbone.render(global.env.upload_path + template, data, function(err, result){
    if (err) {
      res.status(500).send({'msg' : `${global.messages.gen_file_err} ${err}`})
      return
    }

    // write the result
    fs.writeFileSync(global.env.download_path + template + '.odt', result);
    //remove o arquivo de template
    fs.unlinkSync(global.env.upload_path + template);

    if (fs.existsSync(global.env.download_path + template + '.odt')) {
      res.download(global.env.download_path + template + '.odt', function(err) {
          if (!err) {
            fs.unlinkSync(global.env.download_path + template + '.odt');
          } else {
            res.status(404).send({'msg' : 'Não foi realizar o download do arquivo. ' + err})
          }
      });
    }

    //process.exit();
  });

  //res.status(200).send({"msg" : "Documento gerado" });
})


var server = app.listen(global.env.node_port, function () {
  var host = server.address().address
  var port = server.address().port
  
  console.log("Example app listening at http://%s:%s", host, port)
})
