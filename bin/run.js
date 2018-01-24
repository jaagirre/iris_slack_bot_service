'use strict';
//para cargar el fichero .env en process.env
require('dotenv').load();
const config = require('../config/index');

const slackClient = require('../server/slackClient');
const service = require('../server/service');
const http = require('http');

const server = http.createServer(service);

const witToken = config.wit_token;
const witClient = require('../server/witClient')(witToken);

const slackToken = config.slack_token;;

const slackLogLevel = 'verbose';

const PORT = config.port;

//esto es importante
const serviceRegistry = service.get('serviceRegistry');

const rtm = slackClient.init(slackToken , slackLogLevel, witClient , serviceRegistry );
console.log('A coonectartse');
rtm.start();
console.log('rtm.start hecho');

slackClient.addAuthenticatedhandler(rtm , () => {
    server.listen(PORT);
});




server.on('listening', function(){
    console.log(`IRIS is listening on ${server.address().port} in ${service.get('env')} mode`);
});

