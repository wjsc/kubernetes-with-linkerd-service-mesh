const http = require('http');
const config = require('../config');
const type = 'crash';
const port = config[type].port;

http.createServer( (request, response) => {
  process.exit(1);
}).listen(port, 
    () => console.log(`Server '${type}' listening on port ${port}`)
);