const http = require('http');
const type = 'fail';
const port = 80;
const status = 500;

http.createServer( (request, response) => {
  response.writeHead(status , {'Content-Type': 'application/json'});
  console.log(status, request.path);
  response.write(JSON.stringify({ type }));
  response.end();
}).listen(port, 
    () => console.log(`Server '${type}' listening on port ${port}`)
);