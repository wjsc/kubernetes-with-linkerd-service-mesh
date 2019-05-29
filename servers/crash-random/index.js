const http = require('http');
const config = require('../config');
const type = 'crash-random';
const port = config[type].port;
const status = 200;

http.createServer( (request, response) => {
  response.writeHead(status , {'Content-Type': 'application/json'});
  Math.random() > 0.5 && process.exit(1);
  response.write(JSON.stringify({ type }));
  response.end();
}).listen(port, 
    () => console.log(`Server '${type}' listening on port ${port}`)
);