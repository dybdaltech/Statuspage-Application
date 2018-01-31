//Package dependencies:
const express = require('express');
const bodyParser = require('body-parser');
const colors = require('colors');
const cors = require('cors');
const mongoose = require('mongoose');
//File dependencies:
const InfoDB = require('./models/Info');
const Services = require('./models/status');
const config = require("./configuration/config");
const system = require('./models/system');
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


//ROUTES:
app.post('/state/:srv', (req, res) => {//Change service state
    let stateToChange = { Name: req.params.srv};
    console.log(req.ip);
    console.log('-------------------------');
    console.log("Changed " + req.params.srv + ". Too: " + req.body.state + ". With color " + req.body.color);
    let new_State = req.body.state;
    let new_Color = req.body.color;
    Services.findOneAndUpdate(stateToChange, {
        State: new_State,
        Color: new_Color
    }, '', (err, srv) => {
        if (err) {
            console.error(err);
            res.send(500, {error: err});
        }
        console.log(srv);
        srv.save();
    });
});


app.post('/info/create', (req, res) => { //Create new information box, returns success
    
    let db = req.db; //Honestly got no idea on why this is needed
    let info_title = req.body.infoTitle;
    let info_description= req.body.infoText;
    let info_color = req.body.infoColor;
    //Log the output to console
    console.log(req.ip);
    console.log('-------------------------');
    console.log("Created " + info_title + ", with info " + info_description + ". With color " + info_color);
    let new_Info = new InfoDB({
        title: info_title,
        Text: info_description,
        Color: info_color,
        Date: "null"
    });

    new_Info.save((err) => {
        if (err) {
            console.error(err);
        }
        res.send({
            success: true,
            message: "Infobox saved succesfully!"
        });
    });

})

app.get('/', (req, res) => {//Redirects to :8080 for front-end
    console.log("Get from: "+ req.ip);
    res.redirect('http://localhost:8080');
    res.send('Redirected too correct site!');
});

app.delete('/api/info/:del', (req, res) => {//Delete an information box!
    objectToDelete = { _id: req.params.del};
    InfoDB.remove(objectToDelete, (err) => {
        if(err){
            console.log(err);
            res.send(500, {error: err});
        }
    });
});

app.get('/api', (req, res) => {//Get all service states for dashboard. Returns 500 err on err

    console.log('API Fetch from: ' + req.ip);
    Services.find({}, '', (err, status) => {
        if(err) {
            console.log(err);
            res.send(500, {error: err});
        }
        res.send({
            status
        })
    });
    let get_ip = req.ip;
    let get_time = new Date().toLocaleDateString();
    let get_Info = new system({
        Name: "",
        IpAdress: get_ip,
        Time: get_time
    });
    get_Info.save((err) => {
        if(err) {
            console.error(err);
        }
    });
});

app.get('/api/info', (req, res) => {//Get all info boxes to display at dashboard!
    console.log('API/INFO Fetch from: ' + req.ip);
    InfoDB.find({}, '' , (err, infoTabs) => {
        if(err) {
            console.error(err);
            res.send(500, {error: err});
        }
        res.send({
            infoTabs
        })
    }).sort({_id:-1})
});


app.listen(PORT, () => console.log('Statuspage running on port: ' + colors.red(PORT)));