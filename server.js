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
//New comment
//System is not needed
const app = express();
const PORT = config.PORT;
//Middleware:
app.use(bodyParser.json());
app.use(cors());

function discord_notify (msg) {
    let discord_url = "https://discordapp.com/api/webhooks/413995250172952577/FvWuLbsfuHGj7qCxricDLFuXI-k8pJjYtZYHmFkuCvwXObBQVOOCTTYlwmKQ235hcA6z" //Your Discord webhook URL
    notify_body = {
        "content":msg
    }
    request.post({url: discord_url, formData: notify_body}, (err, res, body) => {
        if (err) {
            console.error('Failed to notify on Discord', err);
        }
        console.log('Notified on Discord', body);
    })
}
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
app.listen(PORT, () => {
    startedMessage = 'API running on port: ';
    console.log(startedMessage + colors.red(PORT));
    discord_notify(startedMessage + PORT);
});

