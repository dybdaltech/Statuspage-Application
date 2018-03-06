//Dependencies
const express = require('express');
const path = require('path');
const colors = require('colors');
const request = require('request');
//File dependencies
const config = require('../configuration/config');
const discord = require('../configuration/discord');

//Initialize express
const app = express();

//server public folder as content
app.use(express.static(path.join(__dirname, 'public'))); 

//Discord function
function discord_notify (msg) {
    let discord_url = discord.hookURL; //Your Discord webhook URL
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

//Start the client server
app.listen(config.clientPORT, () => {
    startedMessage = 'CLIENT running on port: ';
    console.log(startedMessage + colors.red(config.clientPORT));
    discord_notify(startedMessage + config.clientPORT);
});