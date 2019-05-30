const http = require('http');
const fetch = require('node-fetch');
const type = 'client';
const port = 80;
const status = 200;
const timeout = 2000;

const url = 'http://crash-random-service:4002';
const options = {
    method: 'GET',
    timeout
};

http.createServer( async (request, response) => {
  
  try{
    const message  = await fetch(url, options).then( res => res.json());
    console.log(message);
    response.writeHead(status, {'Content-Type': 'application/json'});
    response.write(JSON.stringify(message));
    response.end();
  }
  catch(error){
    response.writeHead(500, {'Content-Type': 'application/json'});
    response.write(JSON.stringify({ message:'backend failed', error }));
    response.end();
  }

}).listen(port, 
    () => console.log(`Client '${type}' listening on port ${port}`)
);