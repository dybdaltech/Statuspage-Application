const mongoose = require('mongoose');



mongoose.connect('mongodb://172.19.20.69:27017/statuspage');
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'Database connection error'));

db.once('open', (callback) => {
    console.log(colors.green('Database connection success'));
});

let db = req.db;

let service_Name = "ESA";
let service_State = "Unknown";
let service_Color = "white";

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