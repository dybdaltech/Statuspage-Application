const express = require('express');
const bodyParser = require('body-parser');
const colors = require('colors');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const jsonfile = require("jsonfile");
const mongoose = require('mongoose');
var InfoDB = require('./models/Info');
var Services = require('./models/status');


const app = express();
const PORT = process.env.PORT || 5000;
//Middleware:
app.use(bodyParser.json());
app.use(cors());


//MONGODB Connection
mongoose.connect('mongodb://172.19.20.69:27017/statuspage');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Database connection error'));

db.once('open', (callback) => {
    console.log(colors.green('Database connection success'));
});


//ROUTES:
app.post('/state/:srv', (req, res) => {//Change service state
    var stateToChange = { Name: req.params.srv};
    console.log(req.ip);
    console.log('-------------------------');
    console.log("Changed " + stateToChange + " Too " + req.body.state + ". With color" + req.body.color);
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
    let db = req.db;
    let info_title = req.body.infoTitle;
    let info_description= req.body.infoText;
    let info_color = req.body.infoColor;
    console.log(req.ip);
    console.log('-------------------------');
    console.log("Created " + info_title + ", with info " + info_description + ". With color" + info_color);
    let newInfo = new InfoDB({
        title: info_title,
        Text: info_description,
        Color: info_color,
        Date: "null"
    });

    newInfo.save((err) => {
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
    //res.json(status);
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