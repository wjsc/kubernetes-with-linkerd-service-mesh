const http = require('http');
const type = 'timeout-random';
const port = 80;
const status = 200;
const timeout = 20000;

http.createServer( (request, response) => {
  setTimeout( () => {
    response.writeHead(status , {'Content-Type': 'application/json'});
    console.log(status, request.path);
    response.write(JSON.stringify({ type }));
    response.end();
  }, Math.random() > 0.5 ? timeout : 1)
}).listen(port, 
    () => console.log(`Server '${type}' listening on port ${port}`)
);