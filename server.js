const express = require('express');
const bodyParser = require('body-parser');
const colors = require('colors');
const path = require('path');
const pug = require('pug');
const cors = require('cors');
const fs = require('fs');
const jsonfile = require("jsonfile");


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





//ROUTES:
app.post('/state/:srv', (req, res) => {
    var stateToChange = req.params.srv;
    if(stateToChange === "epost"){
        console.log(colors.green(req.ip + " Set "+stateToChange + " To: "))
        console.log(req.body.state + "\n" + req.body.color)
        status.epost.state = req.body.state;
        status.epost.color = req.body.color;
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
    console.log(req.body);
    info.info = true;
    info.infoTabs.push({title:req.body.infoTitle, text:req.body.infoText, color:req.body.infoColor})
    console.log(info.infoTabs);
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
    let status = fs.readFileSync('./status.json', 'utf8');
    status = JSON.parse(status);
    console.log('API Fetch from: ' + req.ip);
    res.json(status);
});

app.get('/api/info', (req, res) => {
    console.log('API/INFO Fetch from: ' + req.ip);
    res.json(info.infoTabs);
})


app.listen(PORT, () => console.log('Statuspage running on port: ' + colors.red(PORT)));