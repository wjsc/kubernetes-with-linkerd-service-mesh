const http = require('http');
const type = 'crash-random';
const port = 80;
const status = 200;

http.createServer( (request, response) => {
  response.writeHead(status , {'Content-Type': 'application/json'});
  Math.random() > 0.5 && process.exit(1);
  console.log(status, request.path);
  response.write(JSON.stringify({ type }));
  response.end();
}).listen(port, 
    () => console.log(`Server '${type}' listening on port ${port}`)
);