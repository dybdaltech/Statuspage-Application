const mongoose  = require('mongoose');

let Schema = mongoose.Schema;

let SystemSchema = new Schema({
    Name: String,
    IpAdress: String,
    Time: String
});

let System = mongoose.model("system", SystemSchema);

module.exports = System;