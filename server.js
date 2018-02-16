//Package dependencies:
const express = require('express');
const bodyParser = require('body-parser');
const colors = require('colors');
const cors = require('cors');
const mongoose = require('mongoose');
const request = require('request'); //Only for notifications..
//File dependencies:
const config = require("./configuration/config");
const api_router = require('./routes/api');

//System is not needed
const app = express();
const PORT = config.PORT;
//Middleware:
app.use(bodyParser.json());
app.use(cors());


//MONGODB Connection
mongoose.connect(config.mongoURL);
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'Database connection error'));

db.once('open', (callback) => {
    console.log(colors.green('Database connection success'));
});

//Routers
app.use('/', api_router);

//Start server
app.listen(PORT, () => console.log('Statuspage API running on port: ' + colors.red(PORT)));