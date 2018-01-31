let config = {};
config.version = "0.9.2";


//Change for your enviroment:
config.PORT = process.env.PORT || 5000;
config.mongoURL = 'mongodb://172.19.20.69:27017/statuspage';
config.mongoCollection = "statuspage";

module.exports = config;