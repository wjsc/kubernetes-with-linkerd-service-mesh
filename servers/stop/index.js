const http = require('http');
const type = 'stop';
const port = 80;
const status = 200;

http.createServer( (request, response) => {
  response.writeHead(status , {'Content-Type': 'application/json'});
  console.log(status, request.path);
  response.write(JSON.stringify({ type }));
  response.end();
})
console.log(`Server not listening`);