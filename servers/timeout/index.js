const http = require('http');
const config = require('../config');
const type = 'timeout';
const port = config[type].port;
const status = 200;
const timeout = 20000;

http.createServer( (request, response) => {
  setTimeout( () => {
    response.writeHead(status, {'Content-Type': 'application/json'});
    response.write(JSON.stringify({ type }));
    response.end();
  }, timeout)
}).listen(port, 
    () => console.log(`Server '${type}' listening on port ${port}`)
);