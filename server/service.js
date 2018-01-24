'use strict';

const express = require('express');
const service = express();
const ServiceRegistry = require('./serviceRegistry');
const serviceRegistry = new ServiceRegistry();


service.set('serviceRegistry', serviceRegistry);
//service.get('/service/:intent/:port', (req, res, next)=>{
service.put('/service/:intent/:port', (req, res, next)=>{
    const serviceIntent = req.params.intent;
    const servicePort = req.params.port;
    

    const serviceIP = req.connection.remoteAddress.includes('::')
    //? `[${req.connection.remoteAdrress}]` : req.connection.remoteAddress;
    ? '['+req.connection.remoteAddress +']' : req.connection.remoteAddress;

    serviceRegistry.add(serviceIntent , serviceIP , servicePort);
    res.json({result: `${serviceIntent} at ${serviceIP}:${servicePort}`});

});

module.exports = service;