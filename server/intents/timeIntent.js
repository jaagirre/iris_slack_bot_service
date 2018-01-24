'use strict'

const request = require('superagent');

module.exports.process = function process(intentData , registry,  cb){
    if (intentData.intent[0].value !== 'time')
        return cb(new Error(`Expected time intent, got  ${intentData.intent[0].value}`));
    
   // console.log('kkkkkkkkkkkkkk' + intentData.location);
    if (!intentData.location) return cb(new Error('Missing location in time intent'));
    //return cb(false, `I don't yet know the time in ${intentData.location[0].value}`);

    const location = intentData.location[0].value.replace(/,.?iris/i,'');
    //console.log('lllllllllllll');
    const service = registry.get('time');
    if (!service) return cb(false, 'No service avalaiable.');

    //request.get(`http://localhost:3010/service/${location}`, (err, res) =>{
        request.get(`http://${service.ip}:${service.port}/service/${location}`, (err, res) =>{
        if (err || res.statusCode != 200 || !res.body.result){
            console.log(err);
            //console.log(res.nody);
            return cb(false, `I had a problem finding out the time in ${location}`); 
        }
        console.log('hhhhhhhhhhhhhhhhhh');
        return cb(false, `In  ${location}, it is now ${res.body.result}`);
    });
}

       
            /*if (!res.intent){
                console.log('1');
                return rtm.sendMessage("Sorry I don't yet  know what are you talking about.", message.channel);
            }else if( res.intent[0].value == 'time'  && res.location){
                return rtm.sendMessage(`Ì don't yet know the time in ${res.location[0].value}`,  message.channel);
            }else{
                
                return rtm.sendMessage("Sorry I don't yet  know what are you talking about", message.channel);
            }*/
           /* rtm.sendMessage('Sorry, i did not undertsand ', message.channel, function messageSent(){
                //TODO
         //   });*/