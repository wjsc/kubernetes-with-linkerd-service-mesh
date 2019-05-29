const http = require('http');
const type = 'fail';
const port = 80;
const status = 500;

http.createServer( (request, response) => {
  response.writeHead(status, {'Content-Type': 'application/json'});
  response.write(JSON.stringify({ type }));
  response.end();
}).listen(port, 
    () => console.log(`Server '${type}' listening on port ${port}`)
);