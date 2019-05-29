const http = require('http');
const type = 'fail-random';
const port = 80;
const status_ok = 200;
const status_error = 500;

http.createServer( (request, response) => {
  response.writeHead(Math.random() > 0.5 ? status_ok : status_error , {'Content-Type': 'application/json'});
  response.write(JSON.stringify({ type }));
  response.end();
}).listen(port, 
    () => console.log(`Server '${type}' listening on port ${port}`)
);