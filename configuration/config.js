let config = {};
config.version = "1.1.0";


//Change for your enviroment:
config.PORT = process.env.PORT || 5000;
config.mongoURL = 'mongodb://172.19.20.69:27017/statuspage';
config.mongoCollection = "statuspage";
config.clientPORT = 80;

module.exports = config;