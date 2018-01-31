const mongoose  = require('mongoose');

let Schema = mongoose.Schema;

let ServicesSchema = new Schema({
    Name: String,
    State: String,
    Color: String
});

let Services = mongoose.model("services", ServicesSchema);

module.exports = Services;