'use strict'

const { RtmClient, CLIENT_EVENTS } = require('@slack/client');
// const CLIENT_EVENTS  = require('@slack/client').CLIENT_EVENTS;
//
const RTM_EVENTS  = require('@slack/client').RTM_EVENTS;
// An access token (from your Slack app or custom integration - usually xoxb)
//const token = process.env.SLACK_TOKEN || '';
//const token = 'xoxb-297518210389-oWH5NfW8OTGj8Vl80W11v5cq';
// Cache of data
const appData = {};

let rtm = null;
let nlp = null;
let registry = null;

/////////////////////////////
function handleOnMessage(message){
    //console.log(message);
    if (message.text.toLowerCase().includes('iris')){
        nlp.ask(message.text , (err, res) =>{
            if (err){
                console.log(err);
                return;
            }

            try{
               
                if (!res.intent || !res.intent[0] || !res.intent[0].value){
                    throw new Error("Could not extract intent.");
                }
                const intent = require('./intents/'+ res.intent[0].value + 'Intent');
                intent.process(res, registry ,  function(error, response){
                    console.log('After intent processing.');
                    if (error){
                        console.log(error.message);
                        return;
                    }
                    console.log('Responding..');
                    return rtm.sendMessage(response, message.channel);
                });
            }catch(err){
                console.log(err);
                console.log(res);
                rtm.sendMessage("Sorry i don't know what are you talking about." , message.channel);
            }
        
        });//ask se ha defibido como una propiedad , espectacular
                              //esto es los closures de javascript
                              //gainera funztio honen deia token-a erabili dezake nahiz eta ez egon hemen
                              //esta funtzioan klase baten instantzia lez izan daiteke.
                              /*'C8R8HPVGT'*/
    }
    
    /*rtm.sendMessage('this is a test message',  message.channel, function messageSent(){
        //TODO
    });*/
}



///////////////
function handleOnAuthenticated(connectData){
    appData.selfId = connectData.self.id;
    console.log(`Logged in as ${appData.selfId} of team ${connectData.team.id}, but not yet connected to a channel`);
}

function addAuthenticatedHandler(rtm, handler){
    rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, handler);
    
}

// The client will emit an RTM.AUTHENTICATED event on when the connection data is avaiable
    // (before the connection is open)
/*    rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, (connectData) => {
        // Cache the data necessary for this app in memory
       appData.selfId = connectData.self.id;
       console.log(`Logged in as ${appData.selfId} of team ${connectData.team.id}`);
   });
*/
////////////
module.exports.init = function slackClient(token, log, nlpClient, serviceRegistry){
    // Initialize the RTM client with the recommended settings. Using the defaults for these
    // settings is deprecated.
    nlp = nlpClient;
    registry = serviceRegistry;
     rtm = new RtmClient(token, {
        dataStore: false,
        useRtmConnect: true,
        logLevel: log
    });

    addAuthenticatedHandler(rtm , handleOnAuthenticated);
  
    // The client will emit an RTM.RTM_CONNECTION_OPEN the connection is ready for
     // sending and recieving messages
  
    rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPEN, () => {
        console.log(`Ready`);
    });

    rtm.on(RTM_EVENTS.MESSAGE, handleOnMessage);

    return rtm;
}



module.exports.addAuthenticatedhandler = addAuthenticatedHandler;

//rtm.start();