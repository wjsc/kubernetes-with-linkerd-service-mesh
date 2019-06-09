const http = require('http');
const fetch = require('node-fetch');
const type = 'client';
const port = 80;

const url_crash = 'http://crash-service.resilience:4001';
const url_crash_random = 'http://crash-random-service.resilience:4002';
const url_fail = 'http://fail-service.resilience:4003';
const url_fail_random = 'http://fail-random-service.resilience:4004';
const stop = 'http://stop-service.resilience:4005';
const url_timeout = 'http://timeout-service.resilience:4006';
const url_work = 'http://work-service.resilience:4007';
const url_remote = 'https://bmxxnts66d.execute-api.us-east-1.amazonaws.com/default/fail-random-remote';

http.createServer( async (request, response) => {
  
  try{

    const options = { method: 'GET'};

    const result  = await Promise.all( [
      fetch(url_remote, options).then(res => throwOnError(res, [200]) || res.json()),
      fetch(url_fail_random, options).then(res => throwOnError(res, [200]) || res.json()),
      fetch(url_work, options).then(res => throwOnError(res, [200]) || res.json())
    ]);

    const status = 200;

    response.writeHead(status, {'Content-Type': 'application/json'});
    response.write(JSON.stringify({ result }));
    response.end();
  }
  catch(error){
    response.writeHead(500, {'Content-Type': 'application/json'});
    response.write(JSON.stringify({ error }));
    response.end();
  }

}).listen(port, 
    () => console.log(`Client '${type}' listening on port ${port}`)
);

const throwOnError = (res, valid_statuses) => {
  if(!valid_statuses.includes(res.status)) {
    throw(`${res.url} response was ${res.status}`);
  } 
}