var config = require('./config.json');
global.env = config["main"];

config = require('./messages.json');
global.messages = config["textos"];

console.log('API Transform - [ %s ] Arquivos de configuração principal carregado - %s', Date.now(), JSON.stringify(env));
console.log('API Transform - [ %s ] Arquivo de mensagens carregado - %s', Date.now(), JSON.stringify(messages));