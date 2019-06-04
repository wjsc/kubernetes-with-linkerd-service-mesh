const http = require('http');
const type = 'fail-random';
const port = 80;
const status_ok = 200;
const status_error = 500;

http.createServer( (request, response) => {
  const status = Math.random() > 0.5 ? status_ok : status_error;
  response.writeHead(status , {'Content-Type': 'application/json'});
  console.log(status, request.path);
  response.write(JSON.stringify({ type }));
  response.end();
}).listen(port, 
    () => console.log(`Server '${type}' listening on port ${port}`)
);