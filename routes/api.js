const express = require('express');
const router = express.Router();
const request = require('request');
//File dependencies:
const InfoDB = require('../models/Info');
const Services = require('../models/status');
const config = require("../configuration/config");
const system = require('../models/system');
const Chat = require('../models/chat');

//Some middleware things
function discord_notify (msg) {
    let discord_url = "" //Your Discord webhook URL
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


//ROUTES:
router.post('/state/:srv', (req, res) => {//Change service state
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
            discord_notify(err);
        } else {
            console.log(srv);
            srv.save();
            discord_notify(srv);
        }

    });

});


router.post('/info/create', (req, res) => { //Create new information box, returns success
    
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
            let errorstring = "Database error when creating information box: " + err;
            discord_notify(errorstring);
        } else {
            n_msg = req.ip + " Created " + info_title + ", with info " + info_description + ". With color " + info_color;
            discord_notify(n_msg)
            res.send({
                success: true,
                message: "Infobox saved succesfully!"
            });
        }

    });
})

router.get('/', (req, res) => {//Redirects to :8080 for front-end
    console.log("Get from: "+ req.ip);
    res.redirect('http://localhost:8080');
    res.send('Redirected too correct site!');
});

router.delete('/api/info/:del', (req, res) => {//Delete an information box!
    objectToDelete = { _id: req.params.del};
    InfoDB.remove(objectToDelete, (err) => {
        if(err){
            console.log(err);
            res.send(500, {error: err});
            n_msg = req.ip +" tried to delete. Error deleting " + req.params.del;
            discord_notify(n_msg);
        } else {
            n_msg = req.ip + " Deleted " + req.params.del;
            discord_notify(n_msg);
        }
    });
});

router.get('/api', (req, res) => {//Get all service states for dashboard. Returns 500 err on err

    console.log('API Fetch from: ' + req.ip);
    Services.find({}, '', (err, status) => {
        if(err) {
            console.log(err);
            res.send(500, {error: err});
            n_msg = "Error db.find /api: " + req.ip;
            discord_notify(n_msg);
        } else {
            res.send({
                status
            })
            n_msg = "Sent API to: " + req.ip;
            discord_notify(n_msg);
        }

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

router.get('/api/info', (req, res) => {//Get all info boxes to display at dashboard!
    console.log('API/INFO Fetch from: ' + req.ip);
    InfoDB.find({}, '' , (err, infoTabs) => {
        if(err) {
            console.error(err);
            res.send(500, {error: err});
            errorstring = "ERROR db.find api/info: " + err;
            discord_notify(errorstring);
        } else {      
            res.send({
                infoTabs
            });
            n_msg = "Sent api/info to: " + req.ip;
            discord_notify(n_msg);
        }
    }).sort({_id:-1})
});

router.get('/chat/get', (req, res ) => {
    console.log("Sending Chat to " + req.ip);
    Chat.find({}, '', (err, messages) => {
        if(err) console.error(err);
        res.send({
            messages
        });
    }).sort({_id:-1});
});

router.get('/chat/get/:cget', (req, res) => {
    msg_id = req.params.cget;
    console.log('Entered edit message: ' + req.ip);
    Chat.findById(msg_id, (err, msg) => {
        if(err) {
            console.log('could not find message.');
            res.send('Could not find ID');
        }
        res.send({msg})
    });

})
router.post('/chat/new', (req, res) => {
    let chat_name = req.body.sender;
    let chat_msg = req.body.msg;
    let new_chat_message = new Chat({
        Sender: chat_name,
        Message: chat_msg
    });

    new_chat_message.save((err) => {
        if(err) console.log(err);
        res.send({
            success: true,
            message: "Chat message succesfully sent!"
        });
    });
});

router.post('/chat/edit/:id', (req, res) => {
    //console.log(id);
    let chat_change = { _id: req.params.id};
    let chat_solve = req.body.msg;
    let chat_solver = req.body.sender;
    Chat.findOneAndUpdate(chat_change, {
        Sollution: chat_solve,
        Solver: chat_solver
    }, '', (err, cedit) => {
        if(err) {
            console.log(err);
            res.send(err);
        }
        cedit.save();
    });
});

module.exports = router;