const http = require('http');
const fetch = require('node-fetch');
const type = 'client';
const port = 80;

const url_crash_random = 'http://crash-random-service';
const url_fail_random = 'http://fail-random-service';
const url_timeout_random = 'http://timeout-random-service';
const url_work = 'http://work-service';
// const stop = 'http://stop-service.resilience';
const url_remote = 'https://bmxxnts66d.execute-api.us-east-1.amazonaws.com/default/fail-random-remote';

http.createServer( async (request, response) => {
  
  try{

    const options = { method: 'GET'};

    const result  = await Promise.all( [
      fetch(url_fail_random, options).then(res => throwOnError(res, [200]) || res.json()),
      fetch(url_crash_random, options).then(res => throwOnError(res, [200]) || res.json()),
      // fetch(url_remote, options).then(res => throwOnError(res, [200]) || res.json()),
      fetch(url_work, options).then(res => throwOnError(res, [200]) || res.json())
    ]);

    const status = 200;
    console.log(status, request.url);
    response.writeHead(status, {'Content-Type': 'application/json'});
    response.write(JSON.stringify({ result }));
    response.end();
  }
  catch(error){
    console.log(500, request.url, error);
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