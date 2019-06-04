const http = require('http');
const fetch = require('node-fetch');
const type = 'client';
const port = 80;

const timeout = 2000;

const url_fail_random = 'http://fail-random-service.resilience.svc.cluster.local:4004';
const url_work = 'http://work-service.resilience.svc.cluster.local:4007';

const options = {
    method: 'GET',
    timeout
};

http.createServer( async (request, response) => {
  
  try{
    // const url = Math.random() > 0.5 ? url_work : url_fail_random;
    const url = url_fail_random;
    const res  = await fetch(url, options);
    const status = res.status;
    console.log(`${status} - ${url}`);
    const message = await res.json();
    console.log(`Response: ${message}`);
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