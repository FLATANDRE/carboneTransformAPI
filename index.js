const fs = require('fs');
const carbone = require('carbone');
var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');

var uploads = multer({dest : 'uploads/'});

var app = express();
app.use(bodyParser.json());


app.get('/', function (req, res) {
    res.send('API Doc Transformation v1 - Copyright ' + new Date().getFullYear());
})


app.post('/api/v1/documento', uploads.single('documento'),  function (req, res) {

  //if (!req.is('application/json')) {
  //  res.status(404).send({'msg' : 'Header content-type faltando.'});
  //}
  
  
  if (JSON.stringify(req.body) == '{}') {
    res.status(404).send({'msg' : 'Parâmetros do documento não preenchidos.'});
  }

  console.log(req.file);
  console.log(req.body);

  // Data to inject
  var data = req.body;
  var template = req.file.filename;
  //var data = {
  //  name : 'John'
  //};

  var options = {
    convertTo : 'docx' //can be docx, txt, ...
  };

  // Generate a report using the sample template provided by carbone module
  carbone.render('uploads/' + template, data, function(err, result){
    if (err) {
      return console.log(err);
    }

    // write the result
    fs.writeFileSync('downloads/' + template + '.odt', result);
    //remove o arquivo de template
    fs.unlinkSync('uploads/' + template);

    if (fs.existsSync('downloads/' + template + '.odt')) {
      res.download('downloads/' + template + '.odt', function(err) {
          if (!err) {
            fs.unlinkSync('downloads/' + template + '.odt');
          }
      });
    }

    //process.exit();
  });

  //res.status(200).send({"msg" : "Documento gerado" });
})


var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port
  
  console.log("Example app listening at http://%s:%s", host, port)
})
