const http = require('http');
const config = require('../config');
const type = 'fail';
const port = config[type].port;
const status = 500;

http.createServer( (request, response) => {
  response.writeHead(status, {'Content-Type': 'application/json'});
  response.write(JSON.stringify({ type }));
  response.end();
}).listen(port, 
    () => console.log(`Server '${type}' listening on port ${port}`)
);