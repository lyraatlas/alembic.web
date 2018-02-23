// This import has to be the first thing, so that new relic can instrument everything.
const newRelic = require('newrelic');
import * as http from 'http';
import * as https from 'https';
import * as pem from 'pem';
import * as debug from 'debug';
import App from './server';
import { Config } from './config/config';
import log = require('winston');

var httpsServer;

pem.createCertificate({ days: 1, selfSigned: true },  (err, keys) => {
  if (err) {
    log.error(err);
    throw err
  }
  log.info('creating a server for https')
  this.httpsServer = https.createServer({ key: keys.serviceKey, cert: keys.certificate }, App.express).listen(9443);
  this.httpsServer.on('error', onError);
  let addrHttps = this.httpsServer.address();
  let bindhttps = (typeof addrHttps === 'string') ? `pipe ${addrHttps}` : `port ${addrHttps.port}`;
  log.info(`https server Listening on ${bindhttps}`);
});

debug('ts-express:server');

const server = http.createServer(App.express);
server.on('error', onError);
server.on('listening', onListening);

function onError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== 'listen') throw error;
  let bind = (typeof Config.active.get('port') === 'string') ? 'Pipe ' + Config.active.get('port') : 'Port ' + Config.active.get('port');
  switch (error.code) {
    case 'EACCES':
      log.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      log.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

var gracefulShutdown = function() {
  console.log("Received kill signal, shutting down gracefully.");
  server.close(function() {
    console.log("Closed out remaining connections.");
    process.exit()
  });
  
   // if after 
   setTimeout(function() {
       console.error("Could not close connections in time, forcefully shutting down");
       process.exit()
  }, 10*1000);
}

// listen for TERM signal .e.g. kill 
process.on ('SIGTERM', gracefulShutdown);

// listen for INT signal e.g. Ctrl-C
process.on ('SIGINT', gracefulShutdown);

function onListening(): void {
  let addr = server.address();
  let bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr}`;
  log.info(`Listening on ${bind}`);

  let addrHttps = this.httpsServer.address();
  let bindhttps = (typeof addrHttps === 'string') ? `pipe ${addrHttps}` : `port ${addrHttps}`;
  log.info(`Listening on ${bindhttps}`);
}

// The application is exported so that we can use it in testing framework.
export { App, server  }