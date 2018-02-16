# Statuspage-Back-end
Back end for statuspage application at work


For server.js:
1. Have a MongoDB ready
2. Inside project folder: npm install
3. Change config.js inside /configuration too fit your enviroment
4. Have a front-end ready, I'll release mine when I consider it showable to the public (I'm using VueJS)
5. node server.js


TODO list:
* Add authentication (Passport?)        | O
* Add seperate router folder            | X
* Push front-end (After authentication) | O


For discord notifications:
1. Go to your Discord server, select the channel and press the little cogwheel ![Discord picture](https://imgur.com/a/HZJbL)
2. Click create webhook ![Discord picture create](https://imgur.com/bCGctjA)
3. Fill in a name and desired image, copy the webhook URL
4. Paste the webhook URL in the "discord_notify" functions.



for Old_server.js :
1. Add folder "Status/"
2. Add status.json and info.json
3. Run server.js
