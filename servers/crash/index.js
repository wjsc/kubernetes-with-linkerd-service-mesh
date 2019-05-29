const http = require('http');
const type = 'crash';
const port = 80;

http.createServer( (request, response) => {
  process.exit(1);
}).listen(port, 
    () => console.log(`Server '${type}' listening on port ${port}`)
);