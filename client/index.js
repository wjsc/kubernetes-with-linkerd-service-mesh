const http = require('http');
const fetch = require('node-fetch');
const type = 'client';
const port = 80;
const status = 200;
const url = 'http://work-service:4007';
const options = {
    method: 'GET'
};

http.createServer( async (request, response) => {
  
  const message  = await fetch(url, options).then( res => res.json());
  console.log(message);
  response.writeHead(status, {'Content-Type': 'application/json'});
  response.write(JSON.stringify(message));
  response.end();

}).listen(port, 
    () => console.log(`Client '${type}' listening on port ${port}`)
);