const fs = require('fs');

exports.stringSanitize = function (textToSanitize) {
    return textToSanitize.replace(/[^a-z0-9áéíóúñü \.,_-]/gim,"");
}

exports.validatePathAndCreateFolder = function(paths) {
    paths.forEach(path => {
        if (!fs.existsSync(path)) {    
            fs.mkdirSync(path);
        }
    });
}