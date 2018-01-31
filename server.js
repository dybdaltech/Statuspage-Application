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

app.use(bodyParser.json());
app.use(cors());

/*
status = {
    epost:{
        name:'epost',
        state:"Unknown",
        color:""
    },
    intern:{
        name:'intern',
        state:"Unknown",
        color:""
    },
    esa:{
        name:'esa',
        state:"Unknown",
        color:""
    },
    helse:{
        name:'helse',
        state:"Unknown",
        color:""
    }
};
*/
info = {
    info:false,
    infoTabs:[
    ]
};
//JSON THINGS:
let statusFile = './status.json';
let epostFile = './status/epost.json';
//statusFile = JSON.parse(statusFile);

//MONGODB THINGS
mongoose.connect('mongodb://172.19.20.69:27017/statuspage');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Database connection error'));

db.once('open', (callback) => {
    console.log(colors.green('Database connection success'));
});
//ROUTES:
app.post('/state/:srv', (req, res) => {
    //THIS IS VERY BUGGED, DO NOT USE THIS
    var stateToChange = req.params.srv;
    if(stateToChange === "epost"){
        console.log(colors.green(req.ip + " Set "+stateToChange + " To: "))
        console.log(req.body.state + "\n" + req.body.color)
        let objectOne = req.body.state;
        jsonfile.writeFileSync(statusFile, objectOne, (err) => {
            console.error(err);
        });
        /*
        status.epost.state = req.body.state;
        status.epost.color = req.body.color;
        */
    }
    if(stateToChange === "intern"){
        console.log(colors.green(req.ip + " Set "+stateToChange + " To: "))
        console.log(req.body.state + "\n" + req.body.color)
        status.intern.state = req.body.state;
        status.intern.color = req.body.color;
    }
    if(stateToChange === "esa"){
        console.log(colors.green(req.ip + " Set "+stateToChange + " To: "))
        console.log(req.body.state + "\n" + req.body.color)
        status.esa.state = req.body.state;
        status.esa.color = req.body.color;
    }
    if(stateToChange === "helse"){
        console.log(colors.green(req.ip + " Set "+stateToChange + " To: "))
        console.log(req.body.state + "\n" + req.body.color)
        status.helse.state = req.body.state;
        status.helse.color = req.body.color;
    }
});


app.post('/info/create', (req, res) => {
    console.log(colors.yellow("INFO CREATE"));
    let db = req.db;

    let info_title = req.body.infoTitle;
    let info_description= req.body.infoText;
    let info_color = req.body.infoColor;
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

app.get('/', (req, res) => {
    console.log("Get from: "+ req.ip);
    res.redirect('http://localhost:8080');
    res.send('Redirected too correct site!');
});

app.delete('/api/info/:del', (req, res) => {
    objectToDelete = req.params.del;
    arr = info.infoTabs;
    console.log(objectToDelete);
    console.log('                 ');
    for(a = 0; a < arr.length; a++){
        console.log(arr[a].title);
        if(arr[a].title === objectToDelete){
            console.log('DELETING')
            arr.splice(a, 1);
            res.send('Success');
            return;
        } else {
            res.send('Failed to delete object');
        }
    }
});

app.get('/api', (req, res) => {
    status = jsonfile.readFileSync(statusFile);

    console.log('API Fetch from: ' + req.ip);
    Services.find({}, '', (err, status) => {
        if(err) {
            console.log(err);
        }
        res.send({
            status
        })
    });
    //res.json(status);
});

app.get('/api/info', (req, res) => {
    console.log('API/INFO Fetch from: ' + req.ip);
    InfoDB.find({}, '' , (err, infoTabs) => {
        if(err) {
            console.error(err);
        }
        res.send({
            infoTabs
        })
    }).sort({_id:-1})
});


app.listen(PORT, () => console.log('Statuspage running on port: ' + colors.red(PORT)));