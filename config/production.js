//aqui pondemros que se craga via variables de entorno
module.exports ={
    port: process.env.NODE_ENV.PORT ,
    log: 'error' ,
    slack_token: process.env.NODE_ENV.SLACK_TOKEN,
    wit_token: process.env.NODE_ENV.WIT_TOKEN,
    slack_log_level : 'verbose'
};