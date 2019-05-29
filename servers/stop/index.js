const http = require('http');
const config = require('../config');
const type = 'stop';
const port = config[type].port;
const status = 200;

http.createServer( (request, response) => {
  response.writeHead(status, {'Content-Type': 'application/json'});
  response.write(JSON.stringify({ type }));
  response.end();
})
console.log(`Server not listening`);