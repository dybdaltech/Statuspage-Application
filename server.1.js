const express = require('express');
const bodyParser = require('body-parser');
const colors = require('colors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.set('view-engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

status = {
    epost:{
        state:"Unknown",
        color:""
    },
    intern:{
        state:"Unknown",
        color:""
    },
    esa:{
        state:"Unknown",
        color:""
    },
    helse:{
        state:"Unknown",
        color:""
    }
};

info = {
    info:false,
    info_0:{
        message:"",
        date:"",
        color:""
    },
    info_1:{
        message:"",
        date:"",
        color:""
    },
    info_2:{
        message:"",
        date:"",
        color:""
    }
};
app.post('/state', (req, res ) => {
    console.log(colors.green(req.ip + " Changed status too: "));
    //console.log(req.body);
    if(req.body.serviceChange === "epost") {
        console.log(req.body.serviceChange + " -> " + req.body.epost.state);
        status.epost.state = req.body.epost.state;
        status.epost.color = req.body.epost.color;
        res.send('Success');
    }
    if(req.body.serviceChange === "esa"){
        console.log(req.body.serviceChange + " -> " + req.body.esa.state);
        status.esa.state  = req.body.esa.state;
        status.esa.color = req.body.esa.color;
        res.send('Success');
    }
    if(req.body.serviceChange === "intern"){
        console.log(req.body.serviceChange + " -> " + req.body.intern.state);
        status.intern.state = req.body.intern.state;
        status.intern.color = req.body.intern.color;
        res.send('Success');
    }
    if(req.body.serviceChange === "helse"){
        console.log(req.body.serviceChange + " -> " + req.body.helse.state);
        status.helse.state = req.body.helse.state;
        status.helse.color = req.body.helse.color;
        res.send('Success');
    } 
    if(req.body.serviceChange === "all") {
        console.log(req.body.serviceChange + " -> " + "All good?");
        status.epost.state = req.body.epost.state;
        status.epost.color = req.body.epost.color;
        status.intern.state = req.body.intern.state;
        status.intern.color = req.body.intern.color;
        status.esa.state  = req.body.esa.state;
        status.esa.color = req.body.esa.color;
        status.helse.state = req.body.helse.state;
        status.helse.color = req.body.helse.color;
        res.send('Success');
    }
    else {
        res.send("Failed to set state for: " + req.body.serviceChange);
        console.log("Failed to set state for: " + req.body.serviceChange);
    }
    
});

app.post('/info', (req, res ) => {
    console.log(info);
    console.log(colors.green(req.ip + " Changed information too: "));
    info.info = true;
    info.message = req.body.message.message;
    info.date = req.body.message.date;
    info.color = req.body.message.color;
    console.log(JSON.stringify(info))
    res.send('Success');
});

app.get('/', (req, res) => {
    console.log("Get from: "+ req.ip);
    res.render('index.ejs', {
        state: status,
        info: info
    });
});


app.listen(PORT, () => console.log('Statuspage running on port: ' + colors.red(PORT)));



<h4 >
<% if (info.info) {%>
    <p class="<%= info.info_0.color %>" >
        <%= info.info_0.message %>
        <%= info.info_0.date %>
    </p>
    <p class="<%= info.info_1.color%>" >
        <%= info.info_1.message %>
        <%= info.info_1.date %>
    </p>
    <p class="<%= info.info_2.color%>" >
        <%= info.info_2.message %>
        <%= info.info_2.date %>
    </p>

    <% } %>
    
</h4>