const http = require('http');
const type = 'timeout';
const port = 80;
const status = 200;
const timeout = 20000;

http.createServer( (request, response) => {
  setTimeout( () => {
    response.writeHead(status , {'Content-Type': 'application/json'});
    console.log(status, request.path);
    response.write(JSON.stringify({ type }));
    response.end();
  }, timeout)
}).listen(port, 
    () => console.log(`Server '${type}' listening on port ${port}`)
);