var config = require('./config.json');
global.env = config["main"];

config = require('./messages.json');
global.messages = config["textos"];

console.log(`Main Config loaded - ${JSON.stringify(env)}`);
console.log(`Messages Config loaded - ${JSON.stringify(messages)}`);